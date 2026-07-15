# IFTA Fuel Tax Reporting

- **Status**: Planned
- **Priority**: P0 — quarterly legal obligation for interstate carriers; TMSs without it get filtered out immediately
- **Effort**: M
- **Category**: Table stakes

## Why

IFTA requires quarterly per-jurisdiction mileage + fuel-purchase reporting. Competitors bundle it.
We already ingest the hard half (mileage by state via ELD GPS data); fuel purchases arrive with
[fuel-card-integrations](fuel-card-integrations.md) or manual entry via existing `TruckExpense`.

## What to build

- Jurisdiction mileage: derive state/province crossings from ELD location history (`Infrastructure.Integrations.Eld` providers already pull vehicle locations). Store per-truck per-jurisdiction miles per quarter.
- Fuel purchases: extend `Entities/Expense/TruckExpense` with gallons + jurisdiction, or a dedicated `FuelPurchase` entity (`migration-creator` skill).
- Quarterly IFTA report: per-jurisdiction summary (miles, gallons, tax due) with CSV + PDF export via `Infrastructure.Documents/Pdf/` (QuestPDF, same as invoices).
- Hangfire job to snapshot quarters; reminder notifications before filing deadlines (mirror `MaintenanceReminderJob`).
- Page: `tms-portal/pages/reports/` or new `pages/ifta/`.
- Note EU angle: same mileage-by-jurisdiction engine later powers EU road-toll/km-charge reporting — keep jurisdiction logic country-agnostic.

## Acceptance

For a quarter of ELD + fuel data, the report matches per-jurisdiction miles/gallons a dispatcher would compute manually, exportable as PDF/CSV for filing.

## Notes

_(add dated implementation notes here)_
