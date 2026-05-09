# Subagents

## What These Are

These subagents are lightweight role guides for AI coding agents working on **Yelkenli Yaşam Tycoon**.

They describe how a worker should think about a task area such as design, frontend implementation, balance, QA, or build workflow.

They are lightweight role guides, not automatic scripts.

## When To Use Each Role

- `game-designer.md`: Use when reviewing gameplay ideas, progression changes, retention features, achievements, upgrades, or feature fit with the core loop.
- `frontend-developer.md`: Use when implementing React + TypeScript UI or state changes in a safe, mobile-first way.
- `economy-balancer.md`: Use when changing money, followers, XP, route rewards, sponsor pacing, upgrade costs, daily bonuses, or other progression values.
- `qa-tester.md`: Use when manually checking gameplay flow, mobile layout, regressions, and persistence behavior.
- `build-engineer.md`: Use when validating build workflow, preflight checks, production builds, or Android debug build steps.

## Recommended Order For Major Tasks

1. `game-designer` reviews the idea
2. `frontend-developer` implements
3. `economy-balancer` reviews values if economy is affected
4. `qa-tester` checks gameplay flow
5. `build-engineer` runs preflight/build workflow
