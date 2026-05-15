## Seeded user roles

- super admin
- it admin
- manager
- employee

## Seeded test accounts

All accounts use the same password by default (unless overridden by env vars for Super Admin).

| Role | Email | Password |
|---|---|---|
| super admin | superadmin@intellysys.local | Intellysys@123 *(override with `SEED_SUPERADMIN_PASSWORD`)* |
| it admin | itadmin@intellysys.local | Intellysys@123 |
| manager | manager@intellysys.local | Intellysys@123 |
| employee | employee@intellysys.local | Intellysys@123 |

## Notes

- Run seeding with `bun run db:seed`.
- The Super Admin account can be overridden with:
  - `SEED_SUPERADMIN_EMAIL`
  - `SEED_SUPERADMIN_PASSWORD`
  - `SEED_SUPERADMIN_NAME`

