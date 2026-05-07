# Test account login

Credentials come from the database seed (`prisma/seed.ts`). Unless you override them with environment variables when seeding, they are:

| Field | Value |
| --- | --- |
| **Email** | `superadmin@intellysys.local` |
| **Password** | `changeme` |
| **Role** | `superadmin` |

## Login endpoint

`POST /api/v1/auth/login`

Example body:

```json
{
  "email": "superadmin@intellysys.local",
  "password": "changeme"
}
```

## Overrides

You can set these before running `bun run db:seed`:

- `SEED_SUPERADMIN_EMAIL`
- `SEED_SUPERADMIN_PASSWORD`
- `SEED_SUPERADMIN_NAME`

If you change them, use the values you set instead of the table above.
