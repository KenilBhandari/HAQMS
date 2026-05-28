 High: public registration still lets the client choose role, so an attacker can self-
     create elevated accounts by posting ADMIN or DOCTOR. See backend/src/controllers/
     authControllers/register.controller.js:40. This is a real privilege-escalation path.
  3. High: several sensitive mutation routes are only protected by authenticate, not role
     checks. That means any logged-in user can create patients, book/update appointments,
     and create/update queue tokens unless the backend blocks it elsewhere. See backend/
     src/routes/patients.js:10, backend/src/routes/appointments.js:12, and backend/src/
     routes/queue.js:12. Frontend role gating does not make this safe.
  4. High: backend CORS does not allow PATCH, but the frontend uses PATCH for appointment
     and queue updates. That can break browser requests cross-origin. See backend/src/
     index.js:31. This is an integration bug, not a lint/build issue.
  5. Medium: the backend request logger prints the full URL, which can leak patient/doctor
     search terms into logs. See backend/src/index.js:42. In this app, that is privacy-
     sensitive.
  6. Medium: GET /api/appointments validates status but never applies it to the Prisma
     where clause, so the filter is ignored. See backend/src/controllers/
     appointmentControllers/getAppointments.controller.js:7. That is a logic bug in the
     API contract.
  7. Low to medium: query strings are still concatenated without encodeURIComponent, so
     special characters can break search/filter requests. See frontend/src/services/
     doctors.js:6, frontend/src/services/patients.js:3, and frontend/src/services/
     queue.js:3. Not a SQL injection issue anymore, but still a request-shape bug.
  8. Low: the UI copy still claims the doctor search is SQL-injection vulnerable and the
     booking panel warns about queue race conditions, but the backend no longer matches
     those claims. See frontend/src/components/dashboard/PhysicianRegistry.js:25 and
     frontend/src/components/dashboard/BookingPanel.js:151. It is stale assessment text,
     not a runtime bug.

  Integration check

  - The current frontend/backend payload shapes line up for the main flows:
      - doctors list
      - patients list
      - queue list
      - appointments list
      - doctor stats report
      - patient history page
  - The prior frontend hook-order and build/lint blockers are gone in the current tree.
  - The remaining break risk is mostly backend permission/CORS behavior, not UI shape
    mismatch.
