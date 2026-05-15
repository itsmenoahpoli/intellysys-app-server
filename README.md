# Intellysys Server

## Backend API for Intellysys

**Version 1.0.0**

---

### Description

Intellysys Server is a TypeScript HTTP API built with [Elysia](https://elysiajs.com/) on the [Bun](https://bun.sh/) runtime. It uses [Prisma](https://www.prisma.io/) for database access against **PostgreSQL**, [JWT](https://jwt.io/) for authentication, and ships with OpenAPI documentation via Swagger UI.

The service exposes a versioned REST API under `/api/v1`, including health checks, authentication routes, and interactive docs at `/swagger` when the server is running.

---

### Prerequisites

Install the following on your machine before you start. Versions are guidelines; use current stable releases where possible.

| Tool | Purpose |
| --- | --- |
| **[Git](https://git-scm.com/)** | Clone and update this repository. |
| **[Bun](https://bun.sh/)** | Primary runtime and package manager for local development (`bun install`, `bun run dev`). |
| **[Node.js](https://nodejs.org/) (optional)** | Only needed if you prefer running the Prisma CLI with `npx` instead of `bunx`. Bun alone is enough for the workflow below. |
| **PostgreSQL** | Application database. On macOS, **[DBngin](https://dbngin.com/)** is a simple way to run a local PostgreSQL instance; you can also use Docker, Homebrew (`brew install postgresql@16`), or a managed database. |
| **[pgAdmin](https://www.pgadmin.org/)** (or another SQL client) | Browse schemas, run SQL, and inspect data (alternatives: **TablePlus**, **DBeaver**, **Postico**, VS Code extensions). |

Ensure PostgreSQL is **running** and you know the **host**, **port**, **database name**, **user**, and **password** for your connection string.

---

### Tech stack

- **Runtime:** Bun  
- **Framework:** Elysia  
- **ORM:** Prisma 5  
- **Database:** PostgreSQL  
- **Auth:** `@elysia/jwt`, bcrypt-style passwords via `Bun.password`  

---

### Setup and installation (localhost)

#### 1. Clone the repository

```bash
git clone <repository-url>
cd intellysys-server
```

#### 2. Install dependencies

```bash
bun install
```

#### 3. Configure environment variables

Create a `.env` file in the project root (same folder as `package.json`). Example shape:

```env
NODE_ENV=development
APP_PORT=5060
APP_JWT_SECRET=your-long-random-secret-at-least-32-chars
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"
```

- **`APP_JWT_SECRET`** is required at startup; missing values cause the process to exit during validation.  
- **`DATABASE_URL`** is required by Prisma for migrations and runtime database access (format matches [Prisma’s PostgreSQL URL](https://www.prisma.io/docs/orm/reference/connection-urls#postgresql)).  

Adjust host, port, credentials, and database name to match your PostgreSQL instance (including one created with DBngin).

#### 4. Create the database

In PostgreSQL, create an empty database (name should match `DATABASE_URL`). You can use pgAdmin, `psql`, or your preferred client:

```sql
CREATE DATABASE your_database_name;
```

#### 5. Apply migrations

From the project root:

```bash
bunx prisma migrate deploy
```

For iterative local development you may use:

```bash
bunx prisma migrate dev
```

(`migrate dev` can prompt for migration names and is interactive; `migrate deploy` applies existing migrations and suits CI-like flows.)

#### 6. Seed default roles and test user (optional but recommended)

```bash
bun run db:seed
```

This creates the **superadmin** role and a seeded user account. Override defaults with `SEED_SUPERADMIN_EMAIL`, `SEED_SUPERADMIN_PASSWORD`, and `SEED_SUPERADMIN_NAME` if needed.

See **[docs/test-account-login.md](./docs/test-account-login.md)** for default login credentials used after seeding.

#### 7. Start the development server

```bash
bun run dev
```

The API listens on the port from **`APP_PORT`** (for example `http://localhost:5060`). Logs will indicate the base URL and Swagger address.

---

### API documentation

With the server running, open interactive OpenAPI docs in a browser:

```text
http://localhost:<APP_PORT>/swagger
```

Replace `<APP_PORT>` with your configured port (for example `5060`).

---

### Useful scripts

| Script | Command | Description |
| --- | --- | --- |
| Development | `bun run dev` | Run the API with file watching. |
| Database seed | `bun run db:seed` | Run Prisma seed (`prisma/seed.ts`). |

---

### Documentation

- [Test account login (seed defaults)](./docs/test-account-login.md)
