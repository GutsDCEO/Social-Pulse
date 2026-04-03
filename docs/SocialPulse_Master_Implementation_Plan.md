# 🏗️ SocialPulse — Master Implementation Plan v2

> **Generated:** 2026-04-01 | **Sprint Timeline:** April 1 – May 9, 2026 (30 working days)
> **Source of Truth:** `lovable_pm_prompt.md` (Holy Bible) + Full Codebase Audit
> **UI Rule:** Frontend MUST strictly follow the Lovable UI screenshots

---

## Decisions Locked

| # | Decision | Answer |
|---|----------|--------|
| Q1 | Frontend CabinetRole | Fix to match backend: `ADMIN \| CM \| AVOCAT` |
| Q2 | Phase order | Media Upload (Phase 3) **before** Lawyer Space (Phase 4) |
| Q3 | PostService architecture | **2 separate interfaces**: `PostService` (CRUD) + `PostStateMachine` (transitions) — SOLID-S ✅ |
| Q4 | UI compliance | Frontend must **strictly match Lovable screenshots** |
| Q5 | Reporting Rule | Every session MUST end with a **highly detailed, step-by-step instruction report** for the next model session. |

---

## Table of Contents

1. [Full Codebase Audit](#1-full-codebase-audit)
2. [Complete REST API Contract](#2-complete-rest-api-contract)
3. [Frontend ↔ Backend Sync Map](#3-frontend--backend-sync-map)
4. [Phase 1 — Fix Critical Mismatches](#phase-1--fix-critical-mismatches)
5. [Phase 2 — Core Post Lifecycle APIs](#phase-2--core-post-lifecycle-apis)
6. [Phase 3 — Media Upload + Admin Stats](#phase-3--media-upload--admin-stats)
7. [Phase 4 — Frontend Wiring + Lawyer Space](#phase-4--frontend-wiring--lawyer-space)
8. [Phase 5 — Advanced Features](#phase-5--advanced-features)
9. [Phase 6 — Testing, Docs & Launch](#phase-6--testing-docs--launch)
10. [Model Allocation Matrix](#model-allocation-matrix)

---

## 1. Full Codebase Audit

### 🔴 Critical Mismatches (Integration Breakers)

| # | Issue | Backend | Frontend | Impact |
|---|-------|---------|----------|--------|
| 1 | **PostStatus enum incomplete** | ~~5 states~~ → Fixed to 8 | 8 states ✅ | ~~Backend rejects frontend values~~ **FIXED** |
| 2 | **CabinetRole MISMATCH** | `Role.java` = `ADMIN, CM, AVOCAT` | `auth.ts` = `CABINET_ADMIN, MEMBER` | **Every role check fails** |
| 3 | **CreatePostRequest skeletal** | ~~Only `content`~~ → Fixed w/ full fields | Sends 5 fields | ~~400 on creation~~ **FIXED** |
| 4 | **PostDTO skeletal** | ~~Missing 5 fields~~ → Fixed | Expects all fields | ~~undefined renders~~ **FIXED** |
| 5 | **switch-cabinet endpoint MISSING** | No handler | Calls `POST /v1/auth/switch-cabinet` | **404 on cabinet switch** |
| 6 | **9/15 frontend API calls return 404** | Missing 8 PostController endpoints | Full service with 9 functions | **Massive 404 wall** |

### 🟡 SOLID Violations

| # | Issue | Details |
|---|-------|---------|
| 7 | **PostService was concrete** → **FIXED** to interface | Now `PostService` (interface) + needs `PostServiceImpl` |
| 8 | **UserManagementService** | Already correct: interface + `UserManagementServiceImpl` ✅ |

### 🟠 Ghost Code (Wrong Project Artifacts)

> [!WARNING]
> These files belong to a **different project** (academic scheduling) and must be removed or replaced.

| File | Evidence | Action |
|------|----------|--------|
| `services/planningService.ts` | References `creneaux`, `formateur`, `salle`, `module`, `groupe`, `pole` | **DELETE** — not SocialPulse |
| `services/referentielService.ts` | References `Pole`, `Filiere`, `Groupe`, `Salle`, `Formateur`, `Module` | **DELETE** — not SocialPulse |
| `types/api.ts` → `DashboardStats` | References `modules_total`, `volume_horaire_total`, `taux_completion` | **REPLACE** with SocialPulse admin stats |

### 🔵 Missing Backend Infrastructure

| Component | What's Needed |
|-----------|---------------|
| `AuditLogRepository` | JPA repo for `AuditLog` entity (exists but unused) |
| `AuditLogService` | Append-only logging (interface + impl) |
| `AuditLogController` | Query audit trail endpoints |
| `MediaController` | Upload, list, validate, delete media |
| `MediaService` | File storage logic (interface + impl) |
| `PostStateMachine` | State transition guards (new interface) |
| `PostServiceImpl` | Implementation of newly extracted PostService interface |
| `AdminStatsController` | Platform-wide KPIs |
| `NotificationService` | In-app notification system (Phase 5) |

### 🔵 Missing Frontend Pages (per Holy Bible)

| Page | Holy Bible Section | Route |
|------|-------------------|-------|
| `LawyerDashboard` | Role 3 — Root Dashboard | `/lawyer` |
| `LawyerValidation` | Communications en attente | `/lawyer/validation` |
| `LawyerCalendar` | Read-only calendar | `/lawyer/calendar` |
| `LawyerMedia` | Médiathèque | `/lawyer/media` |
| `LawyerSettings` | Paramètres | `/lawyer/settings` |
| `LawyerSupport` | Mon CM | `/lawyer/support` |
| `LawyerGMB` | Google Business Profile | `/lawyer/gmb` |
| `LawyerEmailing` | Emailing module | `/lawyer/emailing` |

---

## 2. Complete REST API Contract

### 2.1 Auth APIs (`/api/v1/auth`)

| Method | Endpoint | Role | Request DTO | Response DTO | Status |
|--------|----------|------|-------------|-------------|--------|
| `POST` | `/login` | Public | `LoginRequest` | `AuthResponse` | ✅ |
| `POST` | `/register` | Public | `RegisterRequest` | `AuthResponse` | ✅ |
| `POST` | `/logout` | Any | — | 200 | ✅ |
| `POST` | `/switch-cabinet` | Authed | `SwitchCabinetRequest` | `AuthResponse` | ❌ |

### 2.2 Cabinet APIs (`/api/v1/cabinets`)

| Method | Endpoint | Role | Request DTO | Response DTO | Status |
|--------|----------|------|-------------|-------------|--------|
| `GET` | `/` | Authed | — | `List<CabinetDTO>` | ✅ |
| `GET` | `/me` | Authed | — | `CabinetDTO` | ✅ |
| `GET` | `/{id}` | Authed | — | `CabinetDTO` | ❌ |
| `POST` | `/` | SUPER_ADMIN | `CreateCabinetRequest` | `CabinetDTO` | ✅ |
| `PUT` | `/{id}` | SUPER_ADMIN | `UpdateCabinetRequest` | `CabinetDTO` | ❌ |
| `POST` | `/{id}/assign` | SUPER_ADMIN | `AssignUserRequest` | 200+Header | ✅ |
| `POST` | `/{id}/request-modification` | CM | `ProfileModificationReq` | 201 | ❌ P4 |
| `GET` | `/{id}/modification-requests` | ADMIN,AVOCAT | — | `List<ModReqDTO>` | ❌ P4 |

### 2.3 Post APIs (`/api/v1/posts`) — CRITICAL

| Method | Endpoint | Role | Request DTO | Response DTO | Status |
|--------|----------|------|-------------|-------------|--------|
| `GET` | `/` | Authed | `?page&size&status` | `Page<PostDTO>` | ⚠️ No pagination |
| `GET` | `/{id}` | Authed | — | `PostDTO` | ❌ |
| `POST` | `/` | CM | `CreatePostRequest` | `PostDTO` | ⚠️ DTO fixed |
| `PUT` | `/{id}` | CM | `UpdatePostRequest` | `PostDTO` | ❌ |
| `PUT` | `/{id}/submit` | CM | — | `PostDTO` | ❌ |
| `PATCH` | `/{id}/approve` | AVOCAT | — | `PostDTO` | ❌ |
| `PATCH` | `/{id}/reject` | AVOCAT | `{reason}` | `PostDTO` | ❌ |
| `POST` | `/{id}/request-edit` | AVOCAT | `{comment}` | `PostDTO` | ❌ |
| `POST` | `/{id}/decline` | AVOCAT | `{reason, platforms[]}` | `PostDTO` | ❌ |
| `DELETE` | `/{id}` | CM | — | 204 | ❌ |

### 2.4 Media APIs (`/api/v1/media`)

| Method | Endpoint | Role | Request | Response | Status |
|--------|----------|------|---------|----------|--------|
| `POST` | `/upload` | CM,AVOCAT | `MultipartFile` | `MediaDTO` | ❌ |
| `GET` | `/` | Authed | `?theme&type&validated` | `List<MediaDTO>` | ❌ |
| `GET` | `/{id}` | Authed | — | `MediaDTO` | ❌ |
| `PATCH` | `/{id}/validate` | AVOCAT | — | `MediaDTO` | ❌ |
| `DELETE` | `/{id}` | CM | — | 204 | ❌ |

### 2.5 Audit Log APIs (`/api/v1/audit-logs`)

| Method | Endpoint | Role | Response | Status |
|--------|----------|------|----------|--------|
| `GET` | `/` | SUPER_ADMIN | `Page<AuditLogDTO>` | ❌ |
| `GET` | `/post/{postId}` | Authed | `List<AuditLogDTO>` | ❌ |
| `GET` | `/export` | SUPER_ADMIN | CSV/PDF | ❌ P5 |

### 2.6 Admin APIs (`/api/v1/admin`)

| Method | Endpoint | Role | Response | Status |
|--------|----------|------|----------|--------|
| `GET` | `/stats` | SUPER_ADMIN | `AdminStatsDTO` | ❌ |
| `POST` | `/seed-demo-data` | SUPER_ADMIN | 201 | ❌ P5 |
| `DELETE` | `/demo-data` | SUPER_ADMIN | 204 | ❌ P5 |

### 2.7 Notification APIs (`/api/v1/notifications`) — Phase 5

| Method | Endpoint | Role | Response | Status |
|--------|----------|------|----------|--------|
| `GET` | `/` | Authed | `List<NotificationDTO>` | ❌ |
| `PATCH` | `/{id}/read` | Authed | 200 | ❌ |
| `GET` | `/unread-count` | Authed | `{count}` | ❌ |

### 2.8 Lawyer-Specific APIs — Phase 5

| Method | Endpoint | Role | Description | Status |
|--------|----------|------|-------------|--------|
| `GET` | `/api/v1/gmb/reviews` | AVOCAT | List GMB reviews | ❌ |
| `POST` | `/api/v1/gmb/reviews/{id}/reply` | AVOCAT | Reply | ❌ |
| `POST` | `/api/v1/gmb/posts` | AVOCAT | Create GMB post | ❌ |
| `GET` | `/api/v1/emailing/contacts` | AVOCAT | Contacts | ❌ |
| `POST` | `/api/v1/emailing/campaigns` | AVOCAT | Send campaign | ❌ |
| `GET` | `/api/v1/emailing/templates` | AVOCAT | Templates | ❌ |

---

## 3. Frontend ↔ Backend Sync Map

> [!CAUTION]
> If a frontend function calls an endpoint that doesn't exist → 🔴 404.

### `postService.ts` (9 functions → only 2 have backend handlers)

| Frontend Function | Endpoint | Backend | Status |
|---|---|---|---|
| `getPosts()` | `GET /v1/posts` | `PostController.getPosts()` | ⚠️ No pagination |
| `getPost(id)` | `GET /v1/posts/{id}` | — | 🔴 |
| `createPost(data)` | `POST /v1/posts` | `PostController.createPost()` | ⚠️ DTO fixed |
| `updatePost(id, data)` | `PUT /v1/posts/{id}` | — | 🔴 |
| `submitPost(id)` | `PUT /v1/posts/{id}/submit` | — | 🔴 |
| `approvePost(id)` | `PATCH /v1/posts/{id}/approve` | — | 🔴 |
| `rejectPost(id)` | `PATCH /v1/posts/{id}/reject` | — | 🔴 |
| `requestEdit(id, comment)` | `POST /v1/posts/{id}/request-edit` | — | 🔴 |
| `declinePost(id, reason)` | `POST /v1/posts/{id}/decline` | — | 🔴 |

### `cabinetService.ts` (6 functions → 3 have backend handlers)

| Frontend Function | Endpoint | Status |
|---|---|---|
| `getCabinets()` | `GET /v1/cabinets` | ✅ |
| `getCabinet(id)` | `GET /v1/cabinets/{id}` | 🔴 |
| `createCabinet(data)` | `POST /v1/cabinets` | ✅ |
| `updateCabinet(id, data)` | `PUT /v1/cabinets/{id}` | 🔴 |
| `switchCabinet(cabinetId)` | `POST /v1/auth/switch-cabinet` | 🔴 |
| `assignUserToCabinet(id, body)` | `POST /v1/cabinets/{id}/assign` | ✅ |

---

## Phase 1 — Fix Critical Mismatches

> **Priority:** P0 | **Duration:** 1-2 sessions | **Prereqs:** None

### Session 1.1 — Backend Enum + DTO Fixes

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3 Flash** |
| **Why** | Simple edits: add enum values, add DTO fields, delete ghost files |
| **Quota** | 🟢 Minimal |

**Files to attach as context:**
- `PostStatus.java` (already fixed ✅)
- `AuditAction.java` (already fixed ✅)
- `CreatePostRequest.java` (already fixed ✅)
- `PostDTO.java` (already fixed ✅)
- `PostService.java` (already extracted to interface ✅)

**Remaining tasks:**
```
1. Create PostServiceImpl.java in service/impl/ — move the old PostService logic there
   - Update mapToDTO() to include all new PostDTO fields (title, targetNetworks, etc.)
   - Implement getPostById(), updatePost(), deletePost()
   
2. Create PostStateMachine.java interface in service/
   - submitPost(UUID postId, String cmUsername) → DRAFT/PENDING_CM → PENDING_LAWYER
   - approvePost(UUID postId, String lawyerUsername) → PENDING_LAWYER → APPROVED
   - rejectPost(UUID postId, String lawyerUsername, String reason) → PENDING_LAWYER → REJECTED
   - requestEdit(UUID postId, String lawyerUsername, String comment) → PENDING_LAWYER → PENDING_CM
   - declinePost(UUID postId, String lawyerUsername, String reason, List<String> platforms) → partial decline
   - schedulePost(UUID postId) → APPROVED → SCHEDULED
   
3. Create PostStateMachineImpl.java in service/impl/
   - Each method validates current state, throws IllegalStateTransitionException if invalid
   - Each transition creates an AuditLog entry
```

**Verification:**
```bash
cd social-pulse && mvn compile
# Must compile with 0 errors
```

---

### Session 1.2 — Frontend Role Fix + Ghost Cleanup

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3 Flash** |
| **Why** | Simple type edits, file deletion |
| **Quota** | 🟢 Minimal |

**Tasks:**
```
1. auth.ts → Change CabinetRole from 'CABINET_ADMIN' | 'MEMBER' 
   to 'ADMIN' | 'CM' | 'AVOCAT' to match backend Role.java

2. AuthContext.tsx → Update hasRole() to check against new values

3. ProtectedRoute.tsx → Update allowedRoles type

4. App.tsx → Update Protected component allowedRoles values:
   - CM routes: allowedRoles={['CM']}
   - Admin routes: keep AdminOnly guard (checks user.isAdmin)
   - Add placeholder Lawyer routes with allowedRoles={['AVOCAT']}

5. DELETE these ghost files (from another project):
   - services/planningService.ts
   - services/referentielService.ts

6. types/api.ts → Replace DashboardStats/StatsResponse with SocialPulse types:
   - AdminStatsDTO { totalUsers, activeCabinets, postsThisWeek, pendingValidations, mrrCurrent }
```

**Verification:**
```bash
cd frontend && npm run build
# Must build with 0 errors, 0 type errors
```

---

## Phase 2 — Core Post Lifecycle APIs

> **Priority:** P0 | **Duration:** 4-5 sessions | **Prereqs:** Phase 1 complete

### Session 2.1 — switch-cabinet + Cabinet CRUD completion

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (High)** |
| **Why** | JWT reissuance logic, authorization validation, complex service code |
| **Quota** | 🟡 Medium |

**Files to attach:**
- `AuthController.java`, `AuthService.java`, `JwtTokenProvider.java`
- `CabinetController.java`, `CabinetService.java`, `CabinetServiceImpl.java`
- `TenantContextFilter.java`, `SecurityConfig.java`

**Tasks:**
```
1. Add POST /api/v1/auth/switch-cabinet to AuthController
   - Create SwitchCabinetRequest DTO: { cabinetId: UUID }
   - AuthService.switchCabinet(username, cabinetId):
     a. Validate user belongs to the cabinet (UserCabinetRepository)
     b. Reissue JWT with new activeCabinetId claim
     c. Return full AuthResponse

2. Add GET /api/v1/cabinets/{id} to CabinetController
   - CabinetService.getCabinetById(UUID id)
   - Validate user has access to this cabinet (tenant check)

3. Add PUT /api/v1/cabinets/{id} to CabinetController
   - Create UpdateCabinetRequest DTO
   - @PreAuthorize("hasRole('SUPER_ADMIN')")
   - CabinetService.updateCabinet(UUID id, UpdateCabinetRequest)
```

**Quality Sentinel prompt prefix:**
```
You MUST follow @[/qualiy-sentinel]. Thin controllers, rich services, 
@Valid on all request bodies, @PreAuthorize on all mutation endpoints.
No hardcoded secrets. Log auth failures. Never expose stack traces.
```

**Verification:**
```bash
# Backend compiles
mvn compile

# Manual test with curl:
curl -X POST http://localhost:8080/api/v1/auth/switch-cabinet \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cabinetId":"<uuid>"}'
# Expected: 200 with new token
```

---

### Session 2.2 — PostController Full CRUD + State Transitions

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (High)** |
| **Why** | Complex controller with 10 endpoints, state machine guards, audit logging |
| **Quota** | 🟡 Medium — this is the largest single backend task |

**Files to attach:**
- `PostController.java`, `PostService.java` (interface), `PostStateMachine.java` (interface)
- `PostDTO.java`, `CreatePostRequest.java`, `Post.java` (entity)
- `PostStatus.java`, `AuditAction.java`, `AuditLog.java`
- `TenantContext.java`

**Tasks:**
```
1. Create PostStateMachineImpl.java
   - Inject PostRepository, AuditLogRepository, UserRepository
   - Each method: validate current status → update status → save AuditLog → return PostDTO
   - Guard matrix:
     DRAFT           → PENDING_LAWYER  (CM submits)
     PENDING_CM      → PENDING_LAWYER  (CM re-submits after edit)
     PENDING_LAWYER  → APPROVED        (Lawyer approves)
     PENDING_LAWYER  → REJECTED        (Lawyer rejects)
     PENDING_LAWYER  → PENDING_CM      (Lawyer requests edit)
     APPROVED        → SCHEDULED       (System sets schedule)
     SCHEDULED       → PUBLISHED       (Cron publishes)
     Any             → ERROR           (Publish failure)
   - Throw IllegalStateTransitionException for invalid transitions

2. Create PostServiceImpl.java (implements PostService interface)
   - getAllPostsInCabinet() — paginated, filterable by status
   - getPostById(UUID) — single post w/ tenant validation
   - createPost(request, username) — DRAFT, now with title + targetNetworks
   - updatePost(UUID, request, username) — only DRAFT/PENDING_CM
   - deletePost(UUID, username) — only DRAFT

3. Expand PostController.java with all endpoints:
   GET    /              → getAllPostsInCabinet() [paginated]
   GET    /{id}          → getPostById()
   POST   /              → createPost()         @PreAuthorize CM
   PUT    /{id}          → updatePost()         @PreAuthorize CM
   PUT    /{id}/submit   → submitPost()         @PreAuthorize CM
   PATCH  /{id}/approve  → approvePost()        @PreAuthorize AVOCAT
   PATCH  /{id}/reject   → rejectPost()         @PreAuthorize AVOCAT
   POST   /{id}/request-edit → requestEdit()    @PreAuthorize AVOCAT
   POST   /{id}/decline  → declinePost()        @PreAuthorize AVOCAT
   DELETE /{id}          → deletePost()         @PreAuthorize CM

4. Create new DTOs:
   - UpdatePostRequest { title, content, targetNetworks, scheduledAt }
   - PostDeclineRequest { reason, platforms[] }
   - PostEditRequest { comment }
   - PostRejectRequest { reason }

5. Create AuditLogRepository (extends JpaRepository)
   - findByPostId(UUID postId)
   - findAll(Pageable)

6. Create AuditLogService interface + AuditLogServiceImpl
   - logAction(UUID postId, UUID actorId, AuditAction, String comment)
   - getByPostId(UUID) → List<AuditLogDTO>
   - getAll(Pageable) → Page<AuditLogDTO>

7. Create AuditLogDTO
   - { id, postId, actorId, actorName, action, comment, performedAt }

8. Create AuditLogController
   - GET /api/v1/audit-logs         @PreAuthorize SUPER_ADMIN
   - GET /api/v1/audit-logs/post/{postId}   Authed
```

**Verification:**
```bash
mvn compile && mvn test
```

---

### Session 2.3 — PostController TDD Tests

| Field | Value |
|-------|-------|
| **Model** | **Claude Sonnet 4.6** |
| **Why** | Complex MockMvc tests with state machine edge cases — Sonnet is precise |
| **Quota** | 🟡 Medium — reserve for test quality |

**Tasks:**
```
1. PostControllerIntegrationTest.java
   - Test each endpoint with valid/invalid role
   - Test OWASP A01: CM can't approve, Avocat can't create
   - Test tenant isolation: post from Cabinet A not visible in Cabinet B

2. PostStateMachineTest.java
   - Test all valid transitions (8 scenarios)
   - Test invalid transitions (e.g., PUBLISHED → DRAFT should throw)
   - Test audit log creation on each transition

3. AuditLogControllerTest.java
   - Test admin access
   - Test non-admin rejection (403)
```

---

## Phase 3 — Media Upload + Admin Stats

> **Priority:** P1 | **Duration:** 2-3 sessions | **Prereqs:** Phase 2 complete

### Session 3.1 — Media Backend

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (High)** |
| **Why** | File upload handling, storage abstraction, validation |

**Tasks:**
```
1. MediaService interface + MediaServiceImpl
   - upload(MultipartFile, cabinetId, username) → MediaDTO
   - getAll(cabinetId, filters) → List<MediaDTO>
   - getById(UUID) → MediaDTO
   - validate(UUID, lawyerUsername) → set isValidated=true
   - delete(UUID, username)
   - Storage: local filesystem (dev) with clear interface for future S3

2. MediaController
   - POST /api/v1/media/upload     @PreAuthorize CM,AVOCAT
   - GET  /api/v1/media            Authed (tenant-filtered)
   - GET  /api/v1/media/{id}       Authed
   - PATCH /api/v1/media/{id}/validate  @PreAuthorize AVOCAT
   - DELETE /api/v1/media/{id}     @PreAuthorize CM

3. MediaDTO { id, fileName, contentType, sizeBytes, legalTheme, isValidated, cabinetId, url, uploadedAt }

4. Update Media.java entity:
   - Add @FilterDef for cabinetFilter (missing from current entity)
   - Add uploadedAt timestamp
```

### Session 3.2 — Admin Stats + Demo Seeder

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (Low)** |
| **Why** | Aggregate queries, straightforward service |

**Tasks:**
```
1. AdminStatsDTO { totalUsers, activeCabinets, postsThisWeek, pendingValidations, avgValidationTime }

2. AdminStatsService interface + impl
   - JPA @Query aggregate methods

3. AdminStatsController
   - GET /api/v1/admin/stats  @PreAuthorize SUPER_ADMIN

4. DemoDataSeeder endpoint (POST /api/v1/admin/seed-demo-data)
   - Create 3 demo cabinets, 2 CMs, 3 lawyers
   - Create 20 posts across all statuses
   - Tag all records with [DEMO] prefix
   - DELETE /api/v1/admin/demo-data → teardown
```

---

## Phase 4 — Frontend Wiring + Lawyer Space

> **Priority:** P1 | **Duration:** 5-6 sessions | **Prereqs:** Phase 2-3 backend deployed
> **UI Rule:** Every page MUST match the Lovable UI screenshots exactly.

### Session 4.1 — Wire Existing Pages

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (Low)** |
| **Why** | React hooks, service calls, component state — routine frontend |

**Files to attach:**
- All frontend `services/*.ts` and `types/*.ts`
- Lovable UI screenshots for reference

**Tasks:**
```
1. Dashboard.tsx → call GET /posts + GET /cabinets (replace mock data)
2. MesCabinets.tsx → call GET /cabinets with filters + switchCabinet()
3. Editor.tsx → call POST /posts with full CreatePostRequest
4. Validation.tsx → call GET /posts?status=PENDING_LAWYER + approve/reject
5. Calendar.tsx → call GET /posts?status=SCHEDULED
6. AdminDashboard.tsx → call GET /admin/stats
7. AdminUsers.tsx → call GET /users + POST /users
8. AdminCabinets.tsx → call GET /cabinets + POST /cabinets
```

### Session 4.2 — Lawyer Dashboard Page

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (Low)** |
| **Why** | Complex layout but routine React — must match Lovable exactly |

**Lovable screens to attach:**
- Lawyer Root Dashboard screenshots (Espace de pilotage éditorial)
- Holy Bible lines 117-130

**Tasks:**
```
1. Create pages/lawyer/LawyerDashboard.tsx
   - Matching the Lovable UI EXACTLY:
     a. Green compliance banner ("Conforme RIN" badge)
     b. Digital presence donut chart (0-100)
     c. Alerts block
     d. "Publications en attente" prominent gateway
     e. Performance chart
     f. CM info card
     g. E-Réputation Google snippet
     h. Newsletters + Blog summary
     i. Calendar + Actualité judiciaire
     j. Opportunités de communication
     k. Vos paramètres clés

2. Add route /lawyer → LawyerDashboard in App.tsx
```

### Session 4.3 — Lawyer Validation Gateway

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (Low)** |
| **Why** | Critical UX — must match Lovable's validation card UI |

**Tasks:**
```
1. Create pages/lawyer/LawyerValidation.tsx
   - Banner: "Aucune publication sans validation explicite"
   - Filter bar: Priority (Urgent, Aujourd'hui, Expirés), Category
   - Review cards: Network tag, Context, Datetime, Title, Thumbnail
   - Action buttons:
     a. Valider (Green) → PATCH /posts/{id}/approve
     b. Demander modification (Orange) → POST /posts/{id}/request-edit
     c. Refuser (Red) → PATCH /posts/{id}/reject
     d. Décliner pour... (dropdown, per-platform) → POST /posts/{id}/decline
     e. Aperçu (eye icon) → CSS-perfect modal preview

2. Create components/lawyer/PostReviewCard.tsx
3. Create components/lawyer/PostPreviewModal.tsx
```

### Session 4.4 — Remaining Lawyer Pages

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (Low)** |

**Tasks:**
```
1. LawyerCalendar.tsx — Reuse CM calendar component, HIDE create/generate buttons
2. LawyerMedia.tsx — Médiathèque with "Validé" badges, AI generation restricted to images
3. LawyerSettings.tsx — Délais de validation (Standard/Urgent), Fallback logic, Networks activation
4. LawyerSupport.tsx — "Mon CM" hub (FAQ, Messaging, Booking)
5. Update App.tsx with all /lawyer/* routes
6. Update Sidebar.tsx with Lawyer sidebar structure (Holy Bible lines 176-182)
```

### Session 4.5 — CabinetContextSwitcher Component

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3 Flash** |
| **Why** | Small UI component |

**Tasks:**
```
1. Create components/layout/CabinetSwitcher.tsx
   - Dropdown in the top bar showing current cabinet name
   - Lists all user's cabinets from cabinetRoles
   - On select: call switchCabinet() → refreshes JWT + reloads data
```

---

## Phase 5 — Advanced Features

> **Priority:** P2 | **Duration:** 4-5 sessions | **Prereqs:** Phase 4 complete

### Session 5.1 — SocialPublisher Strategy Pattern

| Field | Value |
|-------|-------|
| **Model** | **Claude Opus 4.6** |
| **Why** | Architecture design — Strategy Pattern, Spring auto-injection |

**Tasks:**
```
1. SocialPublisher interface { publish(Post post) → PublishResult }
2. LinkedInPublisher, FacebookPublisher, InstagramPublisher, TwitterPublisher
3. PublishOrchestrator service — iterates targetNetworks, calls matching publisher
4. PublishResult { success, platformPostId, errorMessage }
```

### Session 5.2 — Post Scheduling Cron

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (High)** |

**Tasks:**
```
1. PostSchedulerService with @Scheduled(fixedRate = 60_000)
   - Query: SELECT posts WHERE status=SCHEDULED AND scheduledAt <= NOW
   - For each: call PublishOrchestrator
   - On success: update status → PUBLISHED, set publishedAt
   - On failure: increment retry count, if retries >= 3 → ERROR
```

### Session 5.3 — Notification System

| Field | Value |
|-------|-------|
| **Model** | **Claude Sonnet 4.6** |

**Tasks:**
```
1. Notification entity { id, userId, message, type, isRead, createdAt }
2. NotificationService — create on post state changes
3. NotificationController — GET /, PATCH /{id}/read, GET /unread-count
4. Frontend: NotificationBell component in top bar
```

### Session 5.4 — Security Hardening

| Field | Value |
|-------|-------|
| **Model** | **Claude Opus 4.6** |

**Tasks:**
```
1. Rate limiting on /auth/login (Bucket4j: 5 attempts → 15min lockout)
2. GDPR right to erasure cascade
3. @SimulationReadOnly audit — verify all write endpoints are protected
```

---

## Phase 6 — Testing, Docs & Launch

> **Priority:** P2 | **Duration:** 3 sessions | **Prereqs:** Phases 1-5 complete

### Session 6.1 — Full Test Suite

| Field | Value |
|-------|-------|
| **Model** | **Claude Sonnet 4.6** |

**Tasks:**
```
1. Complete MockMvc integration test coverage for all controllers
2. ArchUnit tests: no @Repository from @Controller, etc.
3. Frontend: React Testing Library for core components
```

### Session 6.2 — E2E + Documentation

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (High)** |

**Tasks:**
```
1. Cypress E2E: Login → Create Post → Approve → Verify Published
2. Swagger/OpenAPI annotations on all endpoints
3. README with setup, architecture, API reference
```

### Session 6.3 — Docker + CI/CD

| Field | Value |
|-------|-------|
| **Model** | **Gemini 3.1 Pro (High)** |

**Tasks:**
```
1. Multi-stage Dockerfile (backend + frontend)
2. docker-compose.yml (app + postgres + nginx)
3. .github/workflows/ci.yml (build + test on push)
```

---

## Model Allocation Matrix

| Model | Total Sessions | Tasks |
|-------|---------------|-------|
| **Gemini 3 Flash** | 3 | Enum fixes, DTO edits, ghost cleanup, small components |
| **Gemini 3.1 Pro (Low)** | 6 | All frontend pages, wiring, Lawyer UI, Admin Stats |
| **Gemini 3.1 Pro (High)** | 6 | switch-cabinet, PostController, MediaController, scheduling, Docker |
| **Claude Sonnet 4.6** | 3 | TDD tests, Notification system, full test suite |
| **Claude Opus 4.6** | 2 | SocialPublisher architecture, Security hardening |

### Quota Budget

| Model | Est. Cost per Session | Total Sessions | Budget |
|-------|----------------------|----------------|--------|
| Flash | 🟢 Minimal | 3 | Low |
| Pro Low | 🟢 Low | 6 | Moderate |
| Pro High | 🟡 Medium | 6 | Moderate |
| Sonnet | 🟡 Medium | 3 | Moderate |
| Opus | 🔴 High | 2 | Use sparingly |

---

## Verification Plan

### Per-Phase Checks

| Phase | Verification |
|-------|-------------|
| 1 | `mvn compile` + `npm run build` — zero errors |
| 2 | `mvn test` — all MockMvc tests pass; `curl` every endpoint |
| 3 | Upload a file via `/media/upload`; verify tenant isolation |
| 4 | Browser: Full UI matches Lovable screenshots pixel-for-pixel |
| 5 | Post travels: DRAFT → PENDING_LAWYER → APPROVED → SCHEDULED → PUBLISHED |
| 6 | Cypress E2E green; Docker container starts; CI pipeline passes |

### End-to-End Smoke Test (Final)
```
1. mvn spring-boot:run
2. npm run dev
3. Login as Admin → Create Cabinet → Create CM → Create Lawyer → Assign both
4. Login as CM → Switch Cabinet → Create Post → Submit
5. Login as Lawyer → See pending → Approve
6. Wait for cron → Post is PUBLISHED
7. Check audit log → full trail visible
```
