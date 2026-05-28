Frontend Audit Results
Here are all 26 issues found across the 8 frontend JS files. I've grouped them for efficient implementation:
🔴 Critical (app crashes)
#	Issue
1	medicalHistory null crash — toUpperCase() on null
2	Link used but never imported (ReferenceError)
🟠 High (wrong data / memory leak)
#	Issue
3	data.data.token / data.data.user — backend returns flat { success, token, user }
4	data.data in doctor search — backend doesn't nest under .data
5	setInterval no clearInterval — memory leak on every nav
6	Hardcoded localhost:5000/api duplicated in 2 files
7	/patients/[id]/history-records route doesn't exist (404)
8	Queue fetch sets raw response object as tokens array
9	Login response parsed with wrong shape, login broken
🟡 Medium (inconsistent, inefficient)
#	Issue
10	res.ok vs data.success — inconsistent validation (10+ endpoints)
11	No env variables (NEXT_PUBLIC_API_URL)
12	Stale closure — refreshCount misssing from deps
13	No debounce on patient search (API per keystroke)
14	localStorage token storage (XSS vector)
15	No token expiry check on init
16	document.getElementById() in React
17	Navigation guard race condition on mount
🟢 Low
#	Issue
18	Login field uses type="text" instead of type="email"
19	Check-in always uses doctorsList[0]
20	No server-side token invalidation on logout
Proposed Implementation Plan
Phase 1 — Fix the crashes & broken login (issues 1, 2, 3, 4, 6, 7, 9)
1. Add Link import to dashboard/page.js
2. Add optional chaining on medicalHistory
3. Fix AuthContext.js login/register response destructuring (data.data → flat)
4. Fix doctor search data.data usage
5. Add NEXT_PUBLIC_API_URL env var, create API client helper, replace hardcoded URLs
6. Either build history-records page or remove the dead link
Phase 2 — Fix queue & data flow (issues 5, 8, 10, 12)
1. Add clearInterval cleanup in queue page
2. Fix queue fetch to extract .queue from response wrapper
3. Standardize all API calls to check data.success first
Phase 3 — Polish (issues 13, 15, 16, 17, 18, 19)
1. Add debounce hook for search inputs
2. Add token expiry check
3. Replace document.getElementById with React state
4. Fix the remaining minor issues