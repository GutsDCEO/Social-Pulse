# SocialPulse — Project Handover & Resume Context

> **Date**: March 19, 2026
> **Current Branch**: `feature/w1-1.3-master-erd` (Ready to be merged into `main`)
> **Next Active Branch to Create**: `feature/w1-1.4-jwt-auth-backend`

---

## 📊 Current State

We have successfully completed the foundational backend setup and database architecture.

- **[Done] Issue #17**: Project Init (Spring Boot 3.4.3, Java 21, Vite/React stub)
- **[Done] Issue #18**: Docker PostgreSQL 16 & pgAdmin Setup (`docker-compose.yml`)
- **[Done] Issue #19**: Master ERD & Flyway Migration
  - **Entities mapped**: `User`, `Cabinet`, `UserCabinet` (explicit join), `Post`, `Media`, `PostMedia`, `AuditLog`.
  - **Enums created**: `Role`, `PostStatus`, `CabinetStatus`, `PaymentStatus`, `AuditAction`.
  - **Flyway**: Configured with `V1__Initial_Schema.sql`.
  - **Backward compatibility**: Maintained for the existing `AuthService` draft using `User.getCabinetRoles()`.

---

## 🚀 Setup Instructions (For the New Machine)

When you clone this repo on your new machine, run these exact steps to instantly get back to a working state:

1. **Environment Variables**:
   Copy `.env.example` to `.env` in the project root. The defaults work out-of-the-box for local dev.

2. **Start Infrastructure**:
   ```bash
   docker-compose up -d
   ```
   *This starts PostgreSQL on 5432 and pgAdmin on 5050.*

3. **Verify Database (Optional)**:
   - Open pgAdmin at http://localhost:5050 (Login: `admin@socialpulse.com` / `admin`).
   - Add new server connection: Host `db`, Port `5432`, DB `socialpulse_db`, User `postgres`, Password `changeme`.

4. **Build & Run Backend**:
   ```bash
   cd social-pulse
   mvn clean install
   mvn spring-boot:run
   ```
   *Flyway will automatically create the tables on the first run. The `DataInitializer` will seed an `admin` and `cm` user into the `Cabinet Stagiaire & Associés`.*

---

## 🎯 Immediate Next Step: Issue #1.4 (JWT Auth Polishing)

We have already planned the next feature. You should instantly create a new branch and hand the checklist below to the AI.

```bash
git checkout main
git pull origin main
git checkout -b feature/w1-1.4-jwt-auth-backend
```

### 📋 The Implementation Plan for Issue #1.4
*(Give this entire checklist to your AI agent on the new machine to resume execution)*

**1. Refactor Architecture (Provider Pattern)**
- Rename `JwtUtils` to `security/JwtTokenProvider.java`.
- Move the `secret` key to a `@Value` injected from `application.yml`.
- Update JWT Payload to include: `sub` (username), `email`, `roles` (map of Cabinet ID -> Role), `activeCabinetId`, and **`isSimulating` (boolean)**.

**2. Security Hardening (OWASP)**
- Set `BCryptPasswordEncoder` strength to `12` in `SecurityConfig`.
- Ensure all API endpoints except `/api/v1/auth/**` are protected.

**3. Implement Registration**
- Create `RegisterRequest.java` DTO (username, email, password, fullName).
- Implement `POST /api/v1/auth/register` in `AuthController`.
- Implement `register` method in `AuthService` (hash password, save User object).
- Prevent duplicate usernames/emails (return `409 Conflict`).
- Handle validation gracefully (return `400 Bad Request`).

**4. Quality Sentinel & Multicase Testing**
- Add Unit Tests for `JwtTokenProvider` (valid, expired, tampered tokens).
- Add Integration Tests in `AuthControllerIntegrationTest`:
  - **Registration**: Success (201), Duplicate User (409), Duplicate Email (409), Invalid Format (400).
  - **Login**: Success (200), Wrong Password (401), User Not Found (401), Inactive Account (401).

---

## 🤖 Agent Prompt Template

**Copy and paste this prompt to the AI on your new machine to instantly resume work:**

> "Hello! I have just cloned the SocialPulse repository to a new machine. Please read the file `docs/project_handover_context.md` to understand our exact current state.
> 
> We need to execute the **Implementation Plan for Issue #1.4** listed in that document. Please confirm you understand the plan, ensure you are using the @/quality-sentinel workflow, and begin implementing the code. Do not forget to write the Multicase tests mentioned in the plan."
