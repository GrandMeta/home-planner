# Copilot Instructions — Real Estate Decision Portal

This project is a local-first Real Estate Decision Portal for evaluating apartment projects, units, costs, parking, legal/RERA status, site visits, follow-ups, payments, living suitability, and investment suitability.

## Source of Truth

Before making structural or feature changes, read the `/docs` folder.

Important files:

- `/docs/00_PRODUCT_VISION.md`
- `/docs/03_PROJECT_AND_UNIT_SCHEMA.md`
- `/docs/04_FINANCIAL_FORMULAS.md`
- `/docs/09_SCORING_MODEL.md`
- `/docs/12_DESIGN_SYSTEM.md`
- `/docs/13_COMPONENT_LIBRARY.md`
- `/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md`
- `/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md`
- `/docs/17_TESTING_AND_QA_CHECKLIST.md`

## Engineering Rules

- Use TypeScript strictly.
- Keep formulas outside React components.
- Keep scoring outside React components.
- Keep validation outside React components.
- Use reusable components.
- Use centralized enums and types.
- Use JSON/app state as the canonical data model.
- Do not make Excel the source of truth.
- Do not hardcode only the seed projects.
- Do not introduce backend/cloud in version 1.
- Do not use paid map APIs in version 1.
- Use Leaflet + OpenStreetMap for maps.
- Use Indian currency formatting.
- Do not show missing values as `₹0`, `null`, `undefined`, or `NaN`.
- Show missing data clearly.
- Keep Living Score and Investment Score separate.
- Treat Parking as a dedicated section.
- Treat Legal/RERA as a dedicated section.

## UI Rules

The UI should feel like a calm decision cockpit, not a broker listing website or Excel clone.

Prioritize:

- True landing cost
- True carpet cost
- Missing data
- Risk
- Parking clarity
- Legal/RERA readiness
- Site visit follow-ups
- Living vs investment suitability
- Next action