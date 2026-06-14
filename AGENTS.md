# AGENTS.md

## Project

Real Estate Decision Portal.

This is a local-first Next.js + TypeScript application for comparing apartment projects, units, costs, site visits, parking, legal/RERA status, follow-ups, payment milestones, living suitability, and investment suitability.

## Mandatory Instruction

Before implementing or modifying any major feature, read the relevant files in `/docs`.

The `/docs` folder is the product, design, data, engineering, and QA source of truth.

## Core Guardrails

1. Do not build everything in one step.
2. Do not hardcode only the seed projects.
3. Do not use Excel as the long-term source of truth.
4. Use JSON and app state as the canonical data model.
5. Keep financial formulas separate from UI.
6. Keep scoring separate from UI.
7. Keep validation separate from UI.
8. Use reusable components.
9. Use TypeScript types and centralized enums.
10. Use Indian currency formatting.
11. Do not show missing values as `₹0`, `null`, `undefined`, or `NaN`.
12. Keep Living Score and Investment Score separate.
13. Treat Parking as a dedicated module.
14. Treat Legal/RERA as a dedicated module.
15. Use local-first persistence.
16. Do not introduce backend/cloud in version 1.
17. Do not introduce paid map APIs in version 1.
18. Build a clean, calm, dashboard-style UI.
19. Ensure mobile usability for site visits.
20. Run build/tests before considering work complete.

## Recommended Build Order

1. App scaffold
2. Types and enums
3. Zod schemas
4. Formatting utilities
5. Financial formula engine
6. Local store
7. Seed data
8. Core components
9. Dashboard
10. Project pages
11. Forms
12. Comparison
13. Site visits
14. Map
15. Financials
16. Scoring
17. Follow-ups/documents/payments
18. Import/export
19. Settings
20. QA and polish