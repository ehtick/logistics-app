# QuickBooks Sync

- **Status**: Planned
- **Priority**: P0 — the single most common hard requirement for US small carriers; its absence disqualifies us in most evaluations
- **Effort**: M
- **Category**: Table stakes

## Why

Every competitor (Toro, Truckbase, Rose Rocket, Alvys) syncs to QuickBooks. Carriers' accountants live
in QuickBooks; our native invoicing is a complement, not a replacement. Buyer guides list
"connects to your ELD and QuickBooks out of the box" as the filter criterion for the 1–250 truck band.

## What to build

- QuickBooks Online first (OAuth2 + REST); Desktop later only if demanded.
- One-way push to start: `LoadInvoice` → QBO Invoice, `Payment` → QBO Payment, `CompanyExpense`/`TruckExpense` → QBO Expense, customers → QBO Customers.
- New infrastructure project following the existing pattern: `src/Infrastructure/Logistics.Infrastructure.Integrations.Accounting/` with a port in `Application.Abstractions` (mirror how `Infrastructure.Integrations.Eld` is structured).
- Sync state per entity (external id + last-synced hash) to make pushes idempotent; retry via Hangfire job like `Jobs/EldSyncJob.cs`.
- Tenant-level connection settings page under `tms-portal/pages/settings/` (mirror ELD provider config UX).
- Add `TenantFeature.Accounting` flag; include in Professional+ plans (`SubscriptionPlanSeeder`).

## Acceptance

An invoice created and paid in the TMS appears in the tenant's QBO with correct customer, line items, tax, and payment status — without manual re-entry.

## Notes

_(add dated implementation notes here)_
