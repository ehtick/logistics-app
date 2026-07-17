# AI Preference Flywheel (learn from approve/reject)

- **Status**: Planned
- **Priority**: P1 - top-pick differentiator: labeled training data already accumulates in every tenant DB and is currently ignored
- **Effort**: M
- **Category**: AI differentiation

## Why

Every `AiDispatchDecision` carries an approve/reject outcome (+ rejection reason), yet session 100
is no smarter than session 1. Distilling this history into per-tenant dispatch policy makes the agent
demonstrably improve weekly - no TMS competitor has a learning dispatcher, and the accumulated policy
becomes switching-cost moat.

## What to build

- Nightly Hangfire job (`Jobs/`, mirror `PayrollGenerationJob`) that runs an LLM distillation pass over the last N decisions + outcomes + rejection reasons → a short "dispatch policy" markdown doc stored per tenant (new entity, e.g. `Entities/AiDispatch/AiDispatchPolicy.cs`).
- `AiDispatchConversationBuilder` injects the current policy doc into the system prompt (bounded, e.g. ≤ 1k tokens; keep `AiDispatchSystemPrompt.Build` clean by passing it as a parameter).
- Policy page in `tms-portal/pages/ai-dispatch/`: dispatcher can read, edit, or delete learned rules (transparency = trust; also GDPR-friendly).
- Distillation cost counts against tenant quota via existing `LlmPricing`/`AiQuotaService` or runs on the cheapest model tier.
- Feeds [ai-graduated-autonomy](ai-graduated-autonomy.md): approval-rate stats per action type come from the same decision history.

## Acceptance

After a week of consistent rejections for a pattern (e.g. deadhead > 80 mi), new sessions stop suggesting that pattern and the policy page shows the learned rule in plain language.

## Notes

_(add dated implementation notes here)_
