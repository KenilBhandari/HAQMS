I checked the frontend code-bearing files and ran npm run lint --prefix frontend. The
  frontend is not fully clean yet. It has a few real blockers, plus several lower-priority
  consistency issues.

  Top Issues

  1. frontend/src/app/dashboard/page.js is currently a React hooks bug and a logic bug.
      - It reads authLoading from useAuth(), but AuthContext exposes loading, not
        authLoading.
      - It returns before useState, so hooks are called conditionally.
      - Lint confirms this: react-hooks/rules-of-hooks at frontend/src/app/dashboard/
        page.js:29.
      - Impact: the dashboard route is unstable and may fail build/lint or behave
        incorrectly on auth transitions.
  2. frontend/src/context/AuthContext.js still stores JWTs in localStorage.
      - See frontend/src/context/AuthContext.js:17 and frontend/src/context/
        AuthContext.js:61.
      - This is an XSS token-theft risk.
      - There’s also a lint issue for setting state inside an effect at frontend/src/
        context/AuthContext.js:27, and logout() is referenced before its declaration in
        the effect at frontend/src/context/AuthContext.js:32.
      - Impact: security risk plus lint/build noise.
  3. The frontend data contract is still fragile in the hooks/services layer.
      - frontend/src/hooks/useQueue.js:13-15 expects { success, tokens }.
      - frontend/src/hooks/useDoctorWorklist.js:19-20 expects wrapped success payloads
        too.
      - frontend/src/context/DashboardContext.js:28-33 also assumes checkIn() returns
        success and token.
      - The shared API helper in frontend/src/services/api.js just returns r.json(), so
        the frontend has no unified HTTP/error normalization.
      - Impact: if any endpoint shape differs, the UI silently breaks or stays empty.
  4. Several frontend files currently fail the React lint rules.
      - frontend/src/app/patients/[id]/history-records/page.js:21 sets state synchronously
        inside an effect.
      - frontend/src/hooks/useQueue.js:24 does the same.
      - frontend/src/hooks/useDoctorWorklist.js:26 does the same.
      - frontend/src/hooks/useDebounce.js:4 mutates a ref during render.
      - Lint also warns about missing deps in frontend/src/components/dashboard/
        PatientRegistry.js:22 and frontend/src/context/DashboardContext.js:40.
      - Impact: npm run lint --prefix frontend currently fails with 7 errors and 5
        warnings.

  Lower Priority / Architecture

  5. The frontend still has duplicated patterns and stale migration artifacts.
      - frontend/src/components/dashboard/PatientRegistry.js and frontend/src/components/
        dashboard/BookingPanel.js still use inline fetch instead of the service layer.
      - frontend/src/lib/constants.js still defines TOKEN_STORAGE_KEY and
        USER_STORAGE_KEY, but the auth flow is still hardcoded in AuthContext.
      - frontend/src/app/layout.js and frontend/src/app/globals.css are visually coherent,
        but the design language is still conservative and largely based on Inter +
        glassmorphism. Not broken, just not especially distinct.

  What I verified

  - npm run lint --prefix frontend fails right now.
  - The current frontend does have some fixes already in place:
      - queue interval cleanup exists
      - optional chaining is used in the patient history page
      - env-based API base URL is now present
  - But the frontend still has real correctness and security issues.

