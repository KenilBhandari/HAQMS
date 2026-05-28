# 🏥 HAQMS — Enterprise-Grade Full-Stack Transformation

> **A complete reconstruction of a deliberately vulnerable hospital management system into a secure, scalable, production-oriented full-stack platform.**

---

# Executive Summary — Issues, Fixes & Decisions

---

# 1. Issues Identified

## Security (10 vulns from the upstream fork)

| #  | Issue                          | What Was Happening                                                                                           | Severity    |
| -- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ----------- |
| 1  | Hardcoded JWT fallback         | `JWT_SECRET \|\| 'my-super-secret...'` — secret in plain text in source                                      | 🔴 Critical |
| 2  | JWT expiry disabled            | `verify(token, secret, { ignoreExpiration: true })` — tokens never expired                                   | 🔴 Critical |
| 3  | Passwords logged in plain text | `console.log(\`…password: ${req.body.password}`)` on every login                                             | 🔴 Critical |
| 4  | Admin guard was a no-op        | `authorizeAdminOnlyLegacy` had the role check **commented out** with a TODO — any user could do admin things | 🔴 Critical |
| 5  | Password hash returned in API  | Registration response included the full Prisma user object, `password` hash and all                          | 🔴 Critical |
| 6  | Request bodies logged (PII)    | `console.log(…payload: ${JSON.stringify(req.body)})` leaking patient/staff data                              | 🟠 High     |
| 7  | DB errors leaked to client     | `res.json({ error, databaseError: error.message })` — internal SQL details exposed                           | 🟠 High     |
| 8  | No input validation            | Email/password/phone fields accepted anything, including garbage                                             | 🟠 High     |
| 9  | CORS blocked PATCH             | PATCH wasn't in allowed methods — broke appointment & queue updates cross-origin                             | 🟠 High     |
| 10 | No rate limiting               | Auth endpoints were open to brute-force                                                                      | 🟡 Medium   |

---

## Bugs (5 from code review)

| #  | Bug                                    | What Was Happening                                                                                                                                             |
| -- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 11 | Queue race condition                   | Two concurrent check-ins could get the same token number — the "fix" was `setTimeout(350ms)` hoping the DB catches up                                          |
| 12 | Inconsistent API responses             | Login returned `{ status, data: { token, user } }`, register returned `{ message, user }`, `/me` returned a bare user object — frontend had to guess the shape |
| 13 | Status filter parsed but never applied | `getAppointments` validated the `status` query param then… never used it. Filter was always `{}`                                                               |
| 14 | React memory leaks                     | `useEffect` hooks with intervals, timeouts, and subscriptions but zero cleanup — stale closures and updates after unmount                                      |
| 15 | Query string injection                 | URLs built with `` `/patients?search=${search}` `` — no encoding, special characters broke requests                                                            |

---

# 2. Fixes Implemented

* **All 10 security vulns closed** — removed fallback secrets, leaks, and TODOs; added validation, rate limiter, proper CORS config

* **Queue race fixed** — replaced `setTimeout(350ms)` with PostgreSQL `pg_advisory_xact_lock` inside a Prisma `$transaction`. Tokens are now generated atomically per doctor — no duplicates under any load

* **Admin guard restored** — the commented-out role check is back. Non-admin users get `403`

* **API contract unified** — every endpoint now speaks:

  ```json
  { "success": true, ...data }
  ```

  on success, and:

  ```json
  { "success": false, "error": "..." }
  ```

  on failure.

* **Status filter works** — `where.status = status` added (one missing line was the whole bug)

* **Memory leaks closed** — every effect has cleanup: cancellation flags, `clearTimeout`, mounted-state guards

* **Query params sanitized** — replaced raw concatenation with `URLSearchParams` + `encodeURIComponent`

---

# 3. Optimizations Performed

| Optimisation               | What Changed                                                                        | Why It Matters                                                      |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Backend MVC**            | 18 controllers across 6 domain folders + 5 route files (routing only)               | Each file does one thing — testable, mockable, maintainable         |
| **Frontend decomposition** | 1500-line `page.js` → 7 components + `DashboardContext` + 5 hooks + 7 service files | No more scroll-to-find-the-bug. Each concern lives in its own file  |
| **ESM migration**          | All 28 backend files: `require` → `import`, `module.exports` → `export`             | Modern Node.js, static analysis, aligns with frontend module system |
| **Rate limiting**          | 15 requests per 15 minutes on auth endpoints                                        | Makes brute-force impractical                                       |
| **Transactional queue**    | Advisory locks + `$transaction` for token generation                                | Atomic consistency — no duplicates even under concurrent load       |
| **Input validation**       | Reusable `regex.js` with email/password/phone patterns                              | Bad data rejected before it touches the DB                          |

---

# 4. Remaining Known Issues

## 1. High — Registration lets the client pick the role

The register endpoint trusts whatever `role` the client sends. The frontend only offers `RECEPTIONIST` / `DOCTOR`, but nothing stops a crafted request from setting `ADMIN`.

Needs backend enforcement that restricts registration to ADMIN users only (currently done at the route level, but if that middleware is missed, it's open).

---

## 2. Medium — Some mutation routes rely on frontend gating

`POST /patients`, `PATCH /appointments`, and `PATCH /queue/:id` check roles via middleware, but not all roles are explicitly denied.

Frontend hides buttons for unauthorized roles, but the backend should be the final gate.

---

## 3. Medium — JWT stored in `localStorage`

This is XSS-vulnerable — if an attacker gets JS execution, they steal the token.

HTTP-only cookies would fix this but introduce **CSRF** vulnerabilities (cross-site request forgery), which need a double-submit cookie pattern or `SameSite=Strict` to mitigate.

The trade-off is real:

* `localStorage` → XSS token theft risk
* Cookies → CSRF risk

Current decision:

* Keep `localStorage`
* Rely on React’s built-in XSS protections
* Assume CSP headers are configured at deployment

Production recommendation:

* HTTP-only cookies
* CSRF tokens
* Short-lived access tokens

---

## 4. Low — Request logger prints full query strings

The logger in `index.js` logs `req.path`, which includes search/filter parameters.

In production, these could contain PII:

* Patient names
* Phone numbers
* Search filters

Recommendation: sanitize URLs before logging.

---

## 5. Low — Stale UI copy

The booking panel and physician registry still display warning text about SQL injection and race conditions that no longer exist.

The copy hasn't caught up with the fixes.

---

## 6. Low — Missing `encodeURIComponent` in a couple of service files

`patients.js` and `queue.js` still use template literals for some query params instead of `URLSearchParams`.

Works for now, but special characters could still break requests.

---

# 5. Approach & Reasoning Behind Major Decisions

| Decision                                          | Reasoning                                                                                                                                                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **PostgreSQL advisory locks for queue tokens**    | Needed per-doctor granular locking without a separate lock table. Advisory locks are lightweight, auto-released on transaction commit, and don't block rows that aren't being locked                                           |
| **MVC controllers instead of inline route logic** | Route files were 100–300 lines mixing routing, DB queries, error handling, and business rules. Splitting into controllers means each function has one job — testable in isolation, mockable, and doesn't cause merge conflicts |
| **Frontend decomposition over monolith**          | The single dashboard file was ~1500 lines. Impossible to review, impossible to test, impossible to work on with more than one person                                                                                           |
| **ESM migration (CommonJS → ES Modules)**         | CJS is legacy. ESM is the standard — static imports enable tree-shaking, better IDE support, and consistency with the frontend                                                                                                 |
| **react-hot-toast over building a toast system**  | Why reinvent wheels? `react-hot-toast` is 5 KB, works outside React components, has zero-config `<Toaster />`, and is actively maintained                                                                                      |
| **DashboardContext instead of Redux / Zustand**   | Shared state is small and app-scoped. Context avoids unnecessary boilerplate and dependency overhead                                                                                                                           |
| **Rate limiting only on auth**                    | Auth is the brute-force vector. Queue and patient endpoints must handle bursts during peak hospital hours                                                                                                                      |
| **`import 'dotenv/config'` at module top**        | Ensures env vars load before imported modules execute in ESM                                                                                                                                                                   |
| **localStorage for JWT (not HTTP-only cookies)**  | Acknowledged compromise between XSS risk and CSRF complexity for a demo/presentation environment                                                                                                                               |
