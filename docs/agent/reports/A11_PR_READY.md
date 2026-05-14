# PR Title
A11: Stabilization, state hardening, CSS safety contracts, and CI quality gate

# PR Body
## What
This PR closes A11 phases 1-5 with evidence-first delivery.

## Included
- Stabilization baseline fixed and verified
- State flow hardening (step/tab transition guards + save/load fallback handling)
- CSS safety contracts documented (ownership/collision/viewport/layer)
- Component cleanup backlog documented (no behavior change)
- CI quality gate added (`lint`, `build`, `audit:game`, `audit:mobile-ui`)

## Evidence
- `npm run lint` PASS
- `npm run build` PASS
- `npm run audit:game` PASS
- `npm run audit:mobile-ui` PASS

## Main Files
- `src/App.tsx`
- `src/App.css`
- `src/lib/saveLoad.ts`
- `docs/agent/reports/A11_TECHNICAL_XRAY.md`
- `docs/agent/reports/A11_RISK_REGISTER.md`
- `docs/agent/reports/A11_NEXT_20_AGENT_TASKS.md`
- `docs/agent/reports/A11_PHASE_CLOSURE_SUMMARY.md`
- `.github/workflows/ci.yml`

## Residual
- Large file decomposition remains as follow-up backlog.
