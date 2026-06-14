# 10_ROADMAP.md

# Real Estate Decision Portal — Implementation Roadmap

## 1. Purpose of This Document

This document defines the phased implementation roadmap for the Real Estate Decision Portal.

The portal should not be built in one large step. It should be developed progressively so that each phase produces a usable, testable, and expandable output.

The roadmap should guide Codex and future development prompts.

Each phase should reference the `/docs` folder as the source of truth.

---

## 2. Product Build Principle

The application should be built as a structured personal decision cockpit for real estate evaluation.

The build should prioritize:

1. Clean architecture
2. Strong data model
3. Formula correctness
4. Practical usability
5. Progressive data entry
6. Decision clarity
7. Local-first persistence
8. Future extensibility

The first version should not over-engineer backend, authentication, cloud sync, or document AI extraction.

The first version should focus on making the core portal usable for actual project comparison and site visit tracking.

---

## 3. Recommended Technology Stack

Initial recommended stack:

| Layer             | Recommendation                       |
| ----------------- | ------------------------------------ |
| Framework         | Next.js                              |
| Language          | TypeScript                           |
| Styling           | Tailwind CSS                         |
| UI Components     | shadcn/ui or clean custom components |
| Tables            | TanStack Table                       |
| Charts            | Recharts                             |
| Map               | Leaflet + OpenStreetMap              |
| Forms             | React Hook Form                      |
| Validation        | Zod                                  |
| State             | Zustand or React Context             |
| Local Persistence | IndexedDB or local JSON              |
| Import/Export     | JSON first, CSV/Excel later          |
| Currency Format   | Indian Rupee format                  |
| Date Format       | DD-MMM-YYYY                          |

The application should remain local-first in the initial version.

---

## 4. Roadmap Overview

The portal should be implemented in the following phases:

```text
Phase 1: Project Setup and Documentation Alignment
Phase 2: TypeScript Data Model and Formula Engine
Phase 3: App Shell and Navigation
Phase 4: Local Data Store and JSON Project Pack
Phase 5: Project and Unit Intake Forms
Phase 6: Master Dashboard
Phase 7: Project Detail Pages
Phase 8: Unit Comparison
Phase 9: Site Visit Checklist
Phase 10: Map and Location View
Phase 11: Financial Analysis
Phase 12: Scoring Engine
Phase 13: Follow-Up and Document Tracker
Phase 14: Payment Milestone Tracker
Phase 15: Import/Export
Phase 16: UI Polish and Decision Readiness
Phase 17: Future Enhancements
```

---

# Phase 1 — Project Setup and Documentation Alignment

## Objective

Create the application scaffold and ensure the `/docs` folder exists as the source of truth.

## Inputs

Existing documentation:

```text
/docs/00_PRODUCT_VISION.md
/docs/01_USER_JOURNEY.md
/docs/02_DATA_DICTIONARY.md
/docs/03_PROJECT_AND_UNIT_SCHEMA.md
/docs/04_FINANCIAL_FORMULAS.md
/docs/05_DATA_INGESTION_AND_PROJECT_INTAKE.md
/docs/06_SITE_VISIT_CHECKLIST.md
/docs/07_DASHBOARD_REQUIREMENTS.md
/docs/08_MAP_AND_LOCATION_REQUIREMENTS.md
/docs/09_SCORING_MODEL.md
/docs/10_ROADMAP.md
```

## Tasks

1. Create Next.js + TypeScript project.
2. Add Tailwind CSS.
3. Add base layout.
4. Add `/docs` folder.
5. Add all markdown documentation files.
6. Add route placeholders.
7. Add basic README explaining that `/docs` is the source of truth.

## Routes to Create

```text
/
 /projects
 /projects/[projectId]
 /compare
 /map
 /site-visits
 /financials
 /payments
 /documents
 /follow-ups
 /settings
```

## Output

A clean app scaffold with documentation included.

## Acceptance Criteria

* App runs locally.
* `/docs` folder exists.
* Main routes exist.
* Navigation is visible.
* No real dashboard logic yet.
* Documentation is committed in the repo.

---

# Phase 2 — TypeScript Data Model and Formula Engine

## Objective

Convert the schema and financial formulas into TypeScript types and pure utility functions.

## Reference Docs

* `02_DATA_DICTIONARY.md`
* `03_PROJECT_AND_UNIT_SCHEMA.md`
* `04_FINANCIAL_FORMULAS.md`
* `09_SCORING_MODEL.md`

## Tasks

1. Create centralized TypeScript types.
2. Create enums.
3. Create Zod schemas for validation.
4. Create financial formula utilities.
5. Create scoring utility placeholders.
6. Create currency/date formatting utilities.
7. Add unit tests for core formula functions where practical.

## Suggested File Structure

```text
/src
  /types
    real-estate.ts
    enums.ts
    money.ts

  /schemas
    project-schema.ts
    unit-schema.ts
    project-pack-schema.ts

  /lib
    financial-formulas.ts
    scoring.ts
    formatters.ts
    validation.ts
```

## Core Formula Functions

Implement:

```text
calculateBasicFlatCost
calculateFloorRisePremium
calculateAgreementValue
calculateGstAmount
calculateTdsAmount
calculateStampDuty
calculateRegistrationAmount
calculateTotalStatutoryCharges
calculateTotalSunkAcquisitionCost
calculateCorpusFund
calculateAdvanceMaintenance
calculateTotalPossessionCost
calculateTotalLandingCost
calculateTrueCostPerSba
calculateTrueCostPerCarpet
calculateReraEfficiency
calculateHiddenCostPercentage
calculateLoanAmount
calculateEmi
calculateGrossRentalYield
calculateNetRentalYield
```

## Acceptance Criteria

* TypeScript types compile.
* Formula functions are pure.
* Missing numeric values do not break formulas.
* Indian currency formatter works.
* Zod validation exists for Project Pack JSON.

---

# Phase 3 — App Shell and Navigation

## Objective

Create the visual structure of the portal.

## Reference Docs

* `07_DASHBOARD_REQUIREMENTS.md`

## Tasks

1. Create app layout.
2. Add sidebar or top navigation.
3. Add responsive page container.
4. Add placeholder pages.
5. Add reusable components:

   * KPI card
   * Status badge
   * Risk badge
   * Data missing badge
   * Section card
   * Page header
   * Empty state
6. Add basic theme and spacing.

## Required Pages

```text
Home / Master Dashboard
Projects
Project Detail
Compare Units
Map
Site Visits
Financial Analysis
Payment Milestones
Documents
Follow-Ups
Settings
```

## Acceptance Criteria

* User can navigate between all main pages.
* UI feels like a clean dashboard, not a spreadsheet.
* Placeholder content explains each page’s purpose.
* No data logic required yet.

---

# Phase 4 — Local Data Store and JSON Project Pack

## Objective

Establish the application data layer using structured JSON as the canonical source.

## Reference Docs

* `03_PROJECT_AND_UNIT_SCHEMA.md`
* `05_DATA_INGESTION_AND_PROJECT_INTAKE.md`

## Tasks

1. Create Project Pack JSON structure.
2. Create seed data file.
3. Create local data store.
4. Load data from seed JSON.
5. Save edits locally.
6. Add JSON import/export base capability.
7. Add data validation during import.

## Suggested Files

```text
/data/seed-projects.json

/src/store
  real-estate-store.ts

/src/lib
  project-pack-import.ts
  project-pack-export.ts
```

## Seed Data

Initial seed projects:

```text
The Earthscape
DSR Courtyard
Myhna Orchid
DSR The Address
Sanjeevini Adwaith / The Adwaith
```

At this phase, the seed data can be partial. It does not need to be perfect.

## Acceptance Criteria

* App loads seed projects.
* Projects appear in the Projects page.
* Data survives page navigation.
* JSON export produces a Project Pack.
* Invalid JSON import shows errors, not crashes.

---

# Phase 5 — Project and Unit Intake Forms

## Objective

Create manual entry forms for adding and editing projects and units.

## Reference Docs

* `02_DATA_DICTIONARY.md`
* `03_PROJECT_AND_UNIT_SCHEMA.md`
* `05_DATA_INGESTION_AND_PROJECT_INTAKE.md`

## Tasks

1. Create Add Project form.
2. Create Edit Project form.
3. Create Add Unit form.
4. Create Edit Unit form.
5. Create cost breakup form.
6. Create parking form.
7. Create legal/RERA form.
8. Create location form.
9. Add validation.
10. Add progressive save.

## Project Form Sections

```text
Project Basics
Builder Details
Location
Purpose and Status
RERA / Legal Summary
Notes
```

## Unit Form Sections

```text
Unit Metadata
Space Details
Cost Breakup
Statutory Charges
Maintenance and Possession
Parking
Financial Planning
Living / Investment Notes
```

## Acceptance Criteria

* User can add new project.
* User can add multiple units under a project.
* User can edit project/unit data.
* Missing optional fields are allowed.
* Required fields are minimal.
* Forms update local store.
* Calculated values refresh after edits.

---

# Phase 6 — Master Dashboard

## Objective

Build the landing dashboard that summarizes active projects and selected units.

## Reference Docs

* `07_DASHBOARD_REQUIREMENTS.md`
* `04_FINANCIAL_FORMULAS.md`
* `09_SCORING_MODEL.md`

## Tasks

1. Create dashboard KPI cards.
2. Create shortlisted/selected units table.
3. Add project status overview.
4. Add missing data alerts.
5. Add risk alerts.
6. Add open follow-ups.
7. Add recommended next actions.
8. Add basic charts.

## Required KPI Cards

```text
Total Projects Tracked
Active Projects
Shortlisted Projects
Units Under Comparison
Lowest Landing Cost
Best True Carpet Cost
Best RERA Efficiency
Best Living Score
Best Investment Score
Open Follow-Ups
Critical Risks
Data Missing Items
```

## Required Table

Master selected units comparison table with:

```text
Project
Builder
Area
BHK
SBA
Carpet
Efficiency %
Base Rate
Agreement Value
Total Landing Cost
True SBA Cost
True Carpet Cost
Parking
Possession
Living Score
Investment Score
Risk
Status
Next Action
```

## Acceptance Criteria

* Dashboard shows seed projects.
* Selected units appear in comparison.
* Total landing cost is visible.
* True SBA and carpet cost are visible where data exists.
* Missing data is clearly flagged.
* Dashboard does not break when data is incomplete.

---

# Phase 7 — Project Detail Pages

## Objective

Create a detailed page for each project.

## Reference Docs

* `07_DASHBOARD_REQUIREMENTS.md`

## Tasks

1. Create project header.
2. Add project overview tab.
3. Add units tab.
4. Add costs tab.
5. Add parking tab.
6. Add legal/RERA tab.
7. Add amenities tab.
8. Add location tab.
9. Add site visits tab.
10. Add documents tab.
11. Add follow-ups tab.
12. Add payment schedule tab.

## Required Tabs

```text
Overview
Units
Costs
Parking
Legal/RERA
Amenities
Location
Site Visits
Documents
Follow-Ups
Payment Schedule
Notes
```

## Acceptance Criteria

* Each project has a detail page.
* Units are listed under the project.
* Project/unit values can be edited.
* Cost and parking data are visible separately.
* Legal/RERA and location sections exist.
* Missing data and risks are visible.

---

# Phase 8 — Unit Comparison

## Objective

Create a side-by-side comparison view for selected units.

## Reference Docs

* `07_DASHBOARD_REQUIREMENTS.md`
* `04_FINANCIAL_FORMULAS.md`

## Tasks

1. Allow user to select units for comparison.
2. Create grouped comparison table.
3. Highlight best/worst values.
4. Add comparison filters.
5. Add save comparison set option.
6. Add export option later.

## Comparison Groups

```text
Project and Unit Metadata
Space and Efficiency
Core Cost
Statutory and Registration
Maintenance and Possession
Interiors and Move-In
Total Cost KPIs
Parking
Legal/RERA
Location
Living Score
Investment Score
Risks and Follow-Ups
Decision Notes
```

## Highlighting Rules

Highlight:

* Lowest total landing cost
* Lowest true SBA cost
* Lowest true carpet cost
* Highest RERA efficiency
* Best living score
* Best investment score
* Earliest possession
* Parking risk
* Legal risk
* Missing data

## Acceptance Criteria

* User can compare at least 2 units.
* User can compare units across projects.
* User can compare units within the same project.
* Financial KPIs are shown clearly.
* Missing values do not break comparison.

---

# Phase 9 — Site Visit Checklist

## Objective

Create the structured site visit checklist module.

## Reference Docs

* `06_SITE_VISIT_CHECKLIST.md`
* `01_USER_JOURNEY.md`

## Tasks

1. Create Site Visits page.
2. Create Add Site Visit flow.
3. Create visit header form.
4. Generate default checklist template.
5. Add checklist item status controls.
6. Add notes and follow-up toggles.
7. Create follow-up tasks from checklist.
8. Generate visit summary.
9. Allow checklist data to update project/unit records.

## Checklist Categories

```text
Project Identity
Sales Contact
Unit Selection
Space/Layout
Financial Confirmation
Parking
Legal/RERA
Construction Quality
Amenities
Water/Power/Infrastructure
Location
Community/Living
Investment
Documents
Negotiation
Follow-Ups
Final Outcome
```

## Acceptance Criteria

* User can create site visit.
* Default checklist appears.
* User can mark statuses.
* User can add notes.
* User can create follow-ups from checklist items.
* Visit summary is generated.
* Visit does not require all fields to be complete.

---

# Phase 10 — Map and Location View

## Objective

Create the Bangalore Project Map.

## Reference Docs

* `08_MAP_AND_LOCATION_REQUIREMENTS.md`

## Tasks

1. Add Leaflet map.
2. Show project pins.
3. Add current residence marker.
4. Add primary workplace marker.
5. Add radius circles.
6. Add city-zone filters.
7. Add project status/purpose filters.
8. Add map popup cards.
9. Add fallback list for projects without coordinates.
10. Add location edit form.

## Required Map Features

```text
Project pins
Current residence marker
Primary workplace marker
3 km / 5 km / 10 km / 15 km circles
East/North/South/West/Central filters
Living/Investment/Both filters
Shortlist/risk/status filters
Project popup card
Fallback list for missing coordinates
```

## Acceptance Criteria

* Projects with coordinates appear on map.
* Projects without coordinates appear in fallback list.
* User can edit location information.
* Current residence/workplace markers are supported.
* Map does not require paid API key.

---

# Phase 11 — Financial Analysis

## Objective

Create deeper financial analysis views.

## Reference Docs

* `04_FINANCIAL_FORMULAS.md`
* `07_DASHBOARD_REQUIREMENTS.md`

## Tasks

1. Create financial analysis page.
2. Add true value analysis panel.
3. Add hidden cost analysis.
4. Add cost breakdown charts.
5. Add EMI estimator.
6. Add own contribution estimate.
7. Add rental yield calculator.
8. Add cost completeness score.

## Required Panels

```text
Builder Quote vs Landing Cost
Agreement Value Breakdown
GST and Registration Breakdown
Possession Cost
Interiors and Move-In Budget
True SBA Cost
True Carpet Cost
Hidden Cost Percentage
EMI and Loan Estimate
Rental Yield Estimate
```

## Acceptance Criteria

* User can see true cost buildup.
* Hidden costs are visible.
* EMI estimate works.
* Rental yield estimate works.
* Cost comparison is clear and explainable.

---

# Phase 12 — Scoring Engine

## Objective

Implement Living Score, Investment Score, Risk Score, and recommendations.

## Reference Docs

* `09_SCORING_MODEL.md`

## Tasks

1. Implement scoring utility functions.
2. Add default weights.
3. Add score breakdown.
4. Add score confidence.
5. Add risk caps.
6. Add manual score inputs.
7. Add score settings page.
8. Show scores across dashboard, project, comparison, and map.

## Required Scores

```text
Living Score
Investment Score
Financial Score
Location Score
Parking Score
Legal/RERA Score
Data Completeness Score
Overall Risk Level
Recommendation Status
```

## Acceptance Criteria

* Living and investment scores are separate.
* Weights are configurable.
* Missing data reduces confidence.
* Critical risks cap recommendations.
* Score explanation is visible.
* User can manually override recommendation.

---

# Phase 13 — Follow-Up and Document Tracker

## Objective

Create global follow-up and document tracking.

## Reference Docs

* `06_SITE_VISIT_CHECKLIST.md`
* `07_DASHBOARD_REQUIREMENTS.md`

## Tasks

1. Create Follow-Ups page.
2. Create Documents page.
3. Add follow-up creation/editing.
4. Add document record creation/editing.
5. Link follow-ups to projects/units/site visits.
6. Link documents to projects/units.
7. Add filters and status tracking.
8. Add overdue/critical task view.

## Acceptance Criteria

* User can create follow-up tasks.
* User can close follow-up tasks.
* User can track documents collected/reviewed.
* Follow-ups appear on dashboard.
* Critical pending items are visible.

---

# Phase 14 — Payment Milestone Tracker

## Objective

Track payment schedules and cash flow.

## Reference Docs

* `04_FINANCIAL_FORMULAS.md`
* `07_DASHBOARD_REQUIREMENTS.md`

## Tasks

1. Create payment milestones page.
2. Add milestone creation/editing.
3. Add project/unit-level milestones.
4. Calculate milestone amounts.
5. Add GST and TDS per milestone.
6. Add own contribution and loan disbursement.
7. Add paid/pending/overdue status.
8. Add receipt tracking.
9. Validate milestone total equals 100%.

## Acceptance Criteria

* Payment milestones can be created.
* Milestone percentage calculates amount.
* Total percentage warning appears if not 100%.
* Paid and pending amounts are visible.
* Upcoming payments are visible.
* Cash flow view is available.

---

# Phase 15 — Import / Export

## Objective

Support practical backup, migration, and sharing.

## Reference Docs

* `05_DATA_INGESTION_AND_PROJECT_INTAKE.md`

## Tasks

1. JSON export.
2. JSON import.
3. CSV export for comparison.
4. CSV export for follow-ups.
5. CSV export for payment milestones.
6. Excel export for family/advisor sharing.
7. Optional Excel migration utility for current workbook.

## Export Priority

```text
1. Full JSON backup
2. Master comparison CSV
3. Shortlisted units CSV
4. Follow-ups CSV
5. Payment milestones CSV
6. Excel export
```

## Acceptance Criteria

* User can export full project database as JSON.
* User can import valid JSON Project Pack.
* Invalid import shows validation errors.
* User can export comparison data.
* Excel remains optional, not core.

---

# Phase 16 — UI Polish and Decision Readiness

## Objective

Make the portal usable as a real decision system.

## Tasks

1. Improve visual hierarchy.
2. Add empty states.
3. Add loading states.
4. Add data missing indicators.
5. Add risk badges.
6. Add decision readiness checklist.
7. Add next-action recommendations.
8. Add tooltips for financial terms.
9. Add responsive site visit mobile view.
10. Improve table readability.

## Required Tooltips

Add explanations for:

```text
Agreement Value
Total Sunk Acquisition Cost
Total Landing Cost
True Cost per SBA Sq.Ft
True Cost per Carpet Sq.Ft
RERA Efficiency
Hidden Cost %
Corpus Fund
Maintenance Advance
PLC
Floor Rise
TDS
Stamp Duty
Registration Fee
MODT
```

## Acceptance Criteria

* UI is clean and understandable.
* Missing data is visible.
* Risks are visible.
* Next actions are visible.
* Forms are usable.
* Dashboard supports actual decision-making.

---

# Phase 17 — Future Enhancements

These are not required for the first version.

## 17.1 Future Features

```text
Document/image/PDF extraction
AI-assisted cost sheet parsing
Online RERA enrichment
Map geocoding
Google Maps route estimates
Rental benchmark enrichment
Price benchmark enrichment
Cloud database
User authentication
Mobile PWA
Document upload storage
Possession tracker
Snagging photo tracker
Family review mode
Bank/advisor export pack
Scenario analysis
Negotiation tracker
```

## 17.2 Future Possession Features

```text
OC/CC tracking
Final demand tracking
Utility setup
Parking allotment tracking
Access card tracking
Snagging checklist
Handover document checklist
Interior start readiness
Move-in readiness
Rental readiness
```

---

# 18. Suggested Codex Prompt Sequence

Use this sequence for implementation.

## Prompt 1 — Setup Docs and App Scaffold

```text
Read all files in /docs. Treat them as the source of truth. Create the initial Next.js + TypeScript app scaffold with Tailwind, routes, layout, and placeholder pages. Do not implement business logic yet.
```

## Prompt 2 — Data Types and Formulas

```text
Read /docs/02_DATA_DICTIONARY.md, /docs/03_PROJECT_AND_UNIT_SCHEMA.md, and /docs/04_FINANCIAL_FORMULAS.md. Create TypeScript types, enums, Zod schemas, and pure financial formula functions.
```

## Prompt 3 — Local Store and Seed JSON

```text
Read /docs/05_DATA_INGESTION_AND_PROJECT_INTAKE.md. Create a local-first data store and seed-projects.json structure. Load seed projects into the app.
```

## Prompt 4 — Project and Unit Forms

```text
Create project and unit intake forms based on the schema. Support progressive save, missing values, and local persistence.
```

## Prompt 5 — Dashboard

```text
Build the Master Dashboard according to /docs/07_DASHBOARD_REQUIREMENTS.md using seed data and calculated KPIs.
```

## Prompt 6 — Project Detail Pages

```text
Build individual project detail pages with tabs for overview, units, costs, parking, legal, amenities, location, site visits, documents, follow-ups, and payment schedule.
```

## Prompt 7 — Site Visit Checklist

```text
Build the site visit checklist module according to /docs/06_SITE_VISIT_CHECKLIST.md. Support checklist statuses, notes, follow-up creation, and visit summary.
```

## Prompt 8 — Map

```text
Build the map page according to /docs/08_MAP_AND_LOCATION_REQUIREMENTS.md using Leaflet and OpenStreetMap.
```

## Prompt 9 — Scoring

```text
Implement Living Score, Investment Score, Risk Score, score confidence, and recommendation logic based on /docs/09_SCORING_MODEL.md.
```

## Prompt 10 — Export and Polish

```text
Add JSON/CSV export, improve UI polish, add tooltips, missing data badges, risk badges, and decision readiness summary.
```

---

# 19. Implementation Guardrails

Codex should follow these guardrails:

1. Always read `/docs` before making structural changes.
2. Do not hardcode only the five seed projects.
3. Do not make Excel the long-term source of truth.
4. Use JSON and app data model as canonical structure.
5. Keep financial formulas separate from UI.
6. Keep scoring logic separate from UI.
7. Do not let missing data break calculations.
8. Show missing critical data visibly.
9. Treat parking as a dedicated section.
10. Treat legal/RERA as a dedicated section.
11. Keep living and investment scoring separate.
12. Make all assumptions configurable.
13. Keep UI clean and decision-oriented.
14. Maintain local-first usability.
15. Build in small, testable increments.

---

# 20. Phase Completion Definition

A phase is complete only when:

1. The app builds successfully.
2. The feature is visible in UI.
3. The feature works with seed data.
4. Missing data is handled safely.
5. User can edit or update relevant data where needed.
6. No major console/runtime errors exist.
7. The implementation follows the docs.
8. The feature improves real decision-making.

---

# 21. Final Roadmap Principle

The portal should be built progressively.

First, create the foundation.

Then make data structured.

Then make comparison useful.

Then make site visits actionable.

Then make location visible.

Then make scoring and financial logic decision-ready.

The final product should help the user manage the entire real estate journey from discovery to possession with clarity, discipline, and confidence.
