# 18_CODEX_IMPLEMENTATION_PROMPTS.md

# Real Estate Decision Portal — Codex Implementation Prompts

## 1. Purpose of This Document

This document provides the exact implementation prompt sequence for building the Real Estate Decision Portal using Codex.

The goal is to guide Codex step by step, using the `/docs` folder as the source of truth.

Codex should not be asked to build the entire application in one prompt.

The portal should be implemented in controlled phases:

1. Scaffold
2. Types
3. Formulas
4. Store
5. Seed data
6. Components
7. Dashboard
8. Project and unit pages
9. Comparison
10. Site visits
11. Map
12. Financial analysis
13. Scoring
14. Follow-ups/documents/payments
15. Import/export
16. QA and polish

---

## 2. Core Codex Instruction

Every Codex prompt should start with this instruction:

```text
Read all files in /docs before implementing. Treat the /docs folder as the source of truth. Do not invent major product behavior outside the documentation. If anything is unclear, make a reasonable implementation choice and document it in comments or TODO notes.
```

---

## 3. Development Guardrails for Codex

Codex must follow these rules:

```text
1. Do not build everything in one step.
2. Do not hardcode only the five seed projects.
3. Do not use Excel as the long-term source of truth.
4. Use JSON and app state as the canonical data model.
5. Keep formulas separate from UI.
6. Keep scoring separate from UI.
7. Keep data validation separate from UI.
8. Use reusable components.
9. Use TypeScript types and centralized enums.
10. Use Indian currency formatting.
11. Do not show missing values as ₹0.
12. Do not let missing data break calculations.
13. Keep Living Score and Investment Score separate.
14. Treat parking as a dedicated section.
15. Treat Legal/RERA as a dedicated section.
16. Use local-first persistence.
17. Do not introduce backend/cloud until later.
18. Do not introduce paid map APIs in version 1.
19. Build a clean, calm, dashboard-style UI.
20. Keep the app usable on mobile for site visits.
```

---

# 4. Prompt 01 — Project Setup and Documentation

## Objective

Create the initial Next.js application scaffold with docs included.

## Codex Prompt

```text
Read all files in /docs before implementing. Treat the /docs folder as the source of truth.

Create the initial Real Estate Decision Portal application using:

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Clean folder structure
- Placeholder routes

Set up the following routes:

/
 /projects
 /projects/[projectId]
 /compare
 /map
 /site-visits
 /site-visits/[siteVisitId]
 /financials
 /payments
 /documents
 /follow-ups
 /settings

Create a basic AppShell with sidebar navigation on desktop.

Add placeholder pages with page headers explaining each page’s purpose.

Do not implement real business logic yet.

Ensure the app builds successfully.
```

## Expected Output

* App scaffold
* Routes
* Navigation
* Placeholder pages
* Tailwind configured
* Docs retained in `/docs`

## Acceptance Criteria

```text
npm run build succeeds
All routes load
Sidebar navigation works
No business logic yet
```

---

# 5. Prompt 02 — Types, Enums, and Schema Foundation

## Objective

Create TypeScript types and centralized enums based on the schema docs.

## Codex Prompt

```text
Read these docs carefully:

/docs/02_DATA_DICTIONARY.md
/docs/03_PROJECT_AND_UNIT_SCHEMA.md
/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md
/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md

Create the TypeScript type foundation for the Real Estate Decision Portal.

Create files:

/src/types/enums.ts
/src/types/money.ts
/src/types/real-estate.ts
/src/types/scoring.ts

Define types for:

- Builder
- Project
- Unit
- SpaceDetails
- CostBreakup
- StatutoryCharges
- MaintenancePossessionCosts
- PostPossessionBudget
- ParkingDetails
- LegalInfo
- LocationInfo
- Amenity
- SiteVisit
- ChecklistItem
- FollowUpTask
- DocumentRecord
- PaymentMilestone
- FinancialPlan
- InvestmentAssumptions
- LivingSuitability
- ScoreCard
- AppSettings
- ProjectPack

Create centralized string union types/enums for statuses, risk levels, confidence, cost treatment, project purpose, city zone, checklist status, recommendation status, and document status.

Do not create UI yet.

Ensure all types compile with strict TypeScript.
```

## Expected Output

* Centralized type model
* No duplicated enum strings
* Compile-safe schema foundation

## Acceptance Criteria

```text
No TypeScript errors
No major use of any
All major entities defined
Enums centralized
```

---

# 6. Prompt 03 — Zod Validation Schemas

## Objective

Create validation schemas for project, unit, settings, and Project Pack JSON.

## Codex Prompt

```text
Read:

/docs/03_PROJECT_AND_UNIT_SCHEMA.md
/docs/05_DATA_INGESTION_AND_PROJECT_INTAKE.md
/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md
/docs/17_TESTING_AND_QA_CHECKLIST.md

Using Zod, create validation schemas for:

- Project
- Unit
- ProjectPack
- AppSettings
- FollowUpTask
- DocumentRecord
- PaymentMilestone

Create files:

/src/schemas/project-schema.ts
/src/schemas/unit-schema.ts
/src/schemas/project-pack-schema.ts
/src/schemas/settings-schema.ts

Validation should support partial real estate data. Do not force all optional fields.

Project creation should require only:

- projectName
- builderName
- city
- cityZone
- projectPurposeTag
- projectStatus

Unit creation should require only:

- projectId
- bhkConfiguration
- superBuiltUpAreaSqft or approximate SBA

Create validation helper types and functions.

Invalid import data should return readable validation errors.
```

## Acceptance Criteria

```text
Valid partial projects pass
Invalid enum values fail
ProjectPack validates
Errors are readable
```

---

# 7. Prompt 04 — Formatting Utilities

## Objective

Create central formatting utilities.

## Codex Prompt

```text
Read:

/docs/12_DESIGN_SYSTEM.md
/docs/13_COMPONENT_LIBRARY.md
/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md

Create formatting utilities in:

/src/lib/formatters.ts

Implement:

formatInr(amount)
formatInrCompact(amount)
formatNumber(value)
formatSqft(value)
formatPercentage(value)
formatDate(value)
formatScore(value)

Rules:

- Use Indian currency formatting.
- Do not show null, undefined, or NaN as values.
- Missing money should show “Data Missing” where requested.
- Compact INR should show values like ₹1.83 Cr when appropriate.
- Percentages should be readable.
- Dates should display as DD-MMM-YYYY.
```

## Acceptance Criteria

```text
₹1,83,26,994 format works
₹1.83 Cr compact format works
Missing values are safe
NaN never appears in UI
```

---

# 8. Prompt 05 — Financial Formula Engine

## Objective

Create pure financial formula functions.

## Codex Prompt

```text
Read:

/docs/04_FINANCIAL_FORMULAS.md
/docs/17_TESTING_AND_QA_CHECKLIST.md
/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md

Create pure formula functions in:

/src/lib/financial-formulas.ts

Implement:

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
calculateTotalPostPossessionBudget
calculateTotalLandingCost
calculateTrueCostPerSba
calculateTrueCostPerCarpet
calculateReraEfficiency
calculateHiddenCostPercentage
calculateLoanAmount
calculateEmi
calculateGrossRentalYield
calculateNetRentalYield
calculateMilestoneAmount
calculatePaymentScheduleTotal

Use a CalculationResult pattern:

{
  value: number | null
  canCalculate: boolean
  missingFields: string[]
  warnings: string[]
  explanation?: string
}

Do not put formula logic inside React components.

Handle missing values safely.

Do not return NaN.

Do not hardcode current tax or registration rates. Use settings/default inputs.
```

## Acceptance Criteria

```text
Formula functions are pure
Missing values do not crash
True carpet cost handles missing carpet
TDS is not added to landing cost by default
Settings-based rates supported
```

---

# 9. Prompt 06 — Financial Formula Tests

## Objective

Add tests for financial formulas.

## Codex Prompt

```text
Read:

/docs/04_FINANCIAL_FORMULAS.md
/docs/17_TESTING_AND_QA_CHECKLIST.md

Add Vitest tests for the financial formula engine.

Create:

/src/lib/financial-formulas.test.ts

Test:

- Basic flat cost
- Floor rise inclusive mode
- Floor rise above-baseline mode
- Agreement value
- GST
- TDS
- Stamp duty
- Registration
- Total statutory charges
- Total sunk acquisition cost
- Advance maintenance monthly formula
- Advance maintenance per-sq.ft total formula
- Total landing cost
- True SBA cost
- True carpet cost
- RERA efficiency
- Hidden cost percentage
- EMI
- Gross rental yield
- Net rental yield
- Payment milestone percentage total

Ensure tests cover missing values and zero division protection.
```

## Acceptance Criteria

```text
Tests pass
NaN is never returned
Missing data returns readable result
```

---

# 10. Prompt 07 — Local Store and Project Pack

## Objective

Create local-first state management and JSON Project Pack support.

## Codex Prompt

```text
Read:

/docs/05_DATA_INGESTION_AND_PROJECT_INTAKE.md
/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md
/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md

Create the local-first data store using Zustand.

Create:

/src/store/real-estate-store.ts
/src/store/settings-store.ts
/src/store/ui-store.ts

The store should manage:

- builders
- projects
- units
- siteVisits
- followUps
- documents
- paymentMilestones
- selectedUnitIds
- settings

Add actions for add/update/delete for each major entity.

Add selected unit comparison actions.

Add importProjectPack and exportProjectPack.

Use localStorage persistence for version 1.

Do not build backend integration.

Do not overwrite existing local data with seed data automatically after first load.
```

## Acceptance Criteria

```text
Store persists locally
Projects can be added/updated
Units can be added/updated
Selected units persist
Export Project Pack works
Import Project Pack function exists
```

---

# 11. Prompt 08 — Seed Data JSON

## Objective

Create seed data for initial five projects.

## Codex Prompt

```text
Read:

/docs/05_DATA_INGESTION_AND_PROJECT_INTAKE.md
/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md

Create a seed JSON file:

/src/data/seed-projects.json

Include the initial projects:

1. The Earthscape
2. DSR Courtyard
3. Myhna Orchid
4. DSR The Address
5. Sanjeevini Adwaith / The Adwaith

Use the Project Pack structure.

Seed data can be partial. Mark missing fields clearly as null or unknown. Do not invent exact values that are not known.

Include at least:

- projectId
- projectName
- builderName
- city
- cityZone
- projectStatus
- projectPurposeTag
- units array or unit records where available
- cost fields only where known
- source notes

Add first-load logic:
If no existing local store data exists, load seed data.
If local data exists, do not overwrite it.
```

## Acceptance Criteria

```text
Seed projects load
Missing fields are allowed
No invented exact values
Existing local data is preserved
```

---

# 12. Prompt 09 — Core UI Components

## Objective

Build reusable design-system components.

## Codex Prompt

```text
Read:

/docs/11_UI_UX_DESIGN_DIRECTION.md
/docs/12_DESIGN_SYSTEM.md
/docs/13_COMPONENT_LIBRARY.md
/docs/16_RESPONSIVE_AND_ACCESSIBILITY_GUIDELINES.md

Build core reusable components:

/src/components/layout/AppShell.tsx
/src/components/layout/PageHeader.tsx
/src/components/layout/SectionCard.tsx
/src/components/layout/EmptyState.tsx

/src/components/badges/StatusBadge.tsx
/src/components/badges/RiskBadge.tsx
/src/components/badges/DataMissingBadge.tsx
/src/components/badges/PurposeBadge.tsx
/src/components/badges/ConfidenceBadge.tsx
/src/components/badges/ParkingBadge.tsx

/src/components/data-display/MoneyValue.tsx
/src/components/data-display/AreaValue.tsx
/src/components/data-display/PercentageValue.tsx
/src/components/data-display/DateValue.tsx
/src/components/data-display/ScoreValue.tsx

Use Tailwind styling according to the design system.

Ensure missing values show safe labels and never show undefined, null, or NaN.
```

## Acceptance Criteria

```text
Components render safely
Badges use consistent styles
MoneyValue uses INR format
Missing values visible
```

---

# 13. Prompt 10 — Dashboard Page

## Objective

Build the Master Dashboard.

## Codex Prompt

```text
Read:

/docs/07_DASHBOARD_REQUIREMENTS.md
/docs/12_DESIGN_SYSTEM.md
/docs/13_COMPONENT_LIBRARY.md
/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md

Build the Master Dashboard at route:

/

The dashboard should show:

- KPI cards
- Active projects
- Shortlisted/selected units
- Lowest landing cost
- Best true carpet cost
- Best RERA efficiency
- Best living score
- Best investment score
- Open follow-ups
- Critical risks
- Missing data alerts
- Recommended next actions

Use real store data and derived calculations from formula utilities.

Do not hardcode dashboard values.

Handle empty store gracefully.

Use cards and tables from the component library.
```

## Acceptance Criteria

```text
Dashboard loads seed projects
KPI cards show real derived values
Missing data alerts visible
No crash with incomplete data
```

---

# 14. Prompt 11 — Projects Page and Project Detail

## Objective

Create project list and project detail pages.

## Codex Prompt

```text
Read:

/docs/07_DASHBOARD_REQUIREMENTS.md
/docs/13_COMPONENT_LIBRARY.md
/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md

Build:

/projects
/projects/[projectId]

Projects page should show:

- Search
- Filters
- Project list table on desktop
- Project cards on mobile
- Add Project button
- Status badges
- Risk badges
- Next action

Project detail page should show:

- Project header
- Overview
- Units
- Costs
- Parking
- Legal/RERA
- Amenities
- Location
- Site Visits
- Documents
- Follow-Ups
- Payment Schedule
- Notes

Use tabs on desktop and responsive sections on mobile.

Do not implement every edit form yet unless necessary; provide clean placeholders/actions where needed.
```

## Acceptance Criteria

```text
Project list works
Project detail opens by ID
Seed projects visible
Project sections exist
Missing data visible
```

---

# 15. Prompt 12 — Project and Unit Intake Forms

## Objective

Create add/edit forms.

## Codex Prompt

```text
Read:

/docs/02_DATA_DICTIONARY.md
/docs/03_PROJECT_AND_UNIT_SCHEMA.md
/docs/05_DATA_INGESTION_AND_PROJECT_INTAKE.md
/docs/13_COMPONENT_LIBRARY.md
/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md

Build forms for:

- Add Project
- Edit Project
- Add Unit
- Edit Unit
- Cost Breakup
- Parking Details
- Legal/RERA
- Location Details

Use React Hook Form and Zod.

Support progressive save.

Required fields should be minimal.

Use default values from settings:

- City = Bangalore
- City Zone = East Bangalore
- Project Status = New Lead
- Purpose = Undecided
- Currency = INR

Do not force complete data entry.
```

## Acceptance Criteria

```text
User can add project
User can add unit
User can edit cost
User can edit parking
Forms allow missing optional data
Data persists
```

---

# 16. Prompt 13 — Unit Comparison Page

## Objective

Build side-by-side unit comparison.

## Codex Prompt

```text
Read:

/docs/07_DASHBOARD_REQUIREMENTS.md
/docs/04_FINANCIAL_FORMULAS.md
/docs/13_COMPONENT_LIBRARY.md
/docs/16_RESPONSIVE_AND_ACCESSIBILITY_GUIDELINES.md

Build the Compare page at:

/compare

Allow users to select units for comparison.

Create grouped comparison sections:

- Project and unit metadata
- Space and efficiency
- Core cost
- Statutory and registration
- Maintenance and possession
- Interiors and move-in
- Total cost KPIs
- Parking
- Legal/RERA
- Location
- Living score
- Investment score
- Risks and follow-ups
- Decision notes

Highlight:

- Lowest landing cost
- Lowest true SBA cost
- Lowest true carpet cost
- Highest RERA efficiency
- Best living score
- Best investment score
- Missing data
- High risk

Desktop can use wide table. Mobile should use section-based comparison cards.
```

## Acceptance Criteria

```text
At least 2 units can be compared
Best/worst values highlighted
Missing data visible
Mobile does not break
```

---

# 17. Prompt 14 — Site Visit Checklist Module

## Objective

Build the site visit workflow.

## Codex Prompt

```text
Read:

/docs/06_SITE_VISIT_CHECKLIST.md
/docs/13_COMPONENT_LIBRARY.md
/docs/16_RESPONSIVE_AND_ACCESSIBILITY_GUIDELINES.md
/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md

Build:

/site-visits
/site-visits/[siteVisitId]

Create:

- Site visit list
- Add site visit flow
- Visit header
- Default checklist template
- Checklist sections
- Checklist item status controls
- Notes
- Follow-up required toggle
- Evidence required toggle
- Visit outcome
- Visit summary

Checklist categories should include:

- Project Identity
- Sales Contact
- Unit Selection
- Space/Layout
- Financial Confirmation
- Parking
- Legal/RERA
- Construction Quality
- Amenities
- Water/Power/Infrastructure
- Location
- Community/Living
- Investment
- Documents
- Negotiation
- Follow-Ups
- Final Outcome

Allow checklist items marked “Needs Follow-up” or “Risk” to create follow-up tasks.

Mobile usability is critical.
```

## Acceptance Criteria

```text
Site visit can be created
Checklist appears
Status updates save
Notes save
Follow-ups can be created
Visit summary generated
Mobile layout usable
```

---

# 18. Prompt 15 — Map Page

## Objective

Build Bangalore project map.

## Codex Prompt

```text
Read:

/docs/08_MAP_AND_LOCATION_REQUIREMENTS.md
/docs/13_COMPONENT_LIBRARY.md
/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md
/docs/16_RESPONSIVE_AND_ACCESSIBILITY_GUIDELINES.md

Build the Map page at:

/map

Use Leaflet + OpenStreetMap.

Important Next.js requirement:
Use dynamic import with SSR disabled for Leaflet components.

Map should show:

- Project pins for projects with coordinates
- Current residence marker if configured
- Primary workplace marker if configured
- Radius circles: 3 km, 5 km, 10 km, 15 km
- City zone filters
- Purpose filters
- Status filters
- Risk filters
- Project popup card
- Fallback list for projects without coordinates

Do not use paid Google Maps API.

Do not place projects without coordinates at fake default coordinates.
```

## Acceptance Criteria

```text
Map loads without SSR errors
Projects with coordinates show pins
Projects without coordinates show fallback list
Residence/workplace markers supported
Filters work
```

---

# 19. Prompt 16 — Financial Analysis Page

## Objective

Build financial analysis views.

## Codex Prompt

```text
Read:

/docs/04_FINANCIAL_FORMULAS.md
/docs/07_DASHBOARD_REQUIREMENTS.md
/docs/12_DESIGN_SYSTEM.md
/docs/13_COMPONENT_LIBRARY.md

Build the Financial Analysis page at:

/financials

Show:

- Builder quote vs total landing cost
- Agreement value breakdown
- GST and registration breakdown
- Possession cost
- Interiors and move-in budget
- True SBA cost
- True carpet cost
- Hidden cost percentage
- EMI and loan estimate
- Rental yield estimate
- Cost completeness score

Use financial formula utilities.

Use charts where useful, but keep numbers readable.

Do not show misleading values when inputs are missing.
```

## Acceptance Criteria

```text
Financial KPIs visible
Total landing cost explained
Hidden cost explained
EMI works
Rental yield works
Missing data visible
```

---

# 20. Prompt 17 — Scoring Engine and Recommendation Logic

## Objective

Implement Living Score, Investment Score, Risk Score, and recommendations.

## Codex Prompt

```text
Read:

/docs/09_SCORING_MODEL.md
/docs/04_FINANCIAL_FORMULAS.md
/docs/08_MAP_AND_LOCATION_REQUIREMENTS.md
/docs/06_SITE_VISIT_CHECKLIST.md

Create:

/src/lib/scoring.ts
/src/lib/risk-engine.ts
/src/lib/completeness.ts

Implement:

- calculateLivingScore
- calculateInvestmentScore
- calculateFinancialScore
- calculateLocationScore
- calculateParkingScore
- calculateLegalScore
- calculateDataCompletenessScore
- calculateOverallRiskLevel
- calculateRecommendationStatus

Use score result object:

{
  score,
  label,
  confidence,
  positiveContributors,
  negativeContributors,
  missingInputs,
  riskCapsApplied
}

Rules:

- Living Score and Investment Score must remain separate.
- Missing data reduces confidence.
- Critical risks cap recommendation.
- Parking unknown caps recommendation.
- RERA missing caps recommendation.
- Final cost sheet missing caps recommendation.
- User manual override should be supported.

Show scores in dashboard, project detail, compare page, and map popup where relevant.
```

## Acceptance Criteria

```text
Living and investment scores separate
Score explanations visible
Risk caps work
Missing data reduces confidence
Recommendation shown
```

---

# 21. Prompt 18 — Follow-Ups, Documents, and Payments

## Objective

Build task, document, and payment tracking.

## Codex Prompt

```text
Read:

/docs/06_SITE_VISIT_CHECKLIST.md
/docs/07_DASHBOARD_REQUIREMENTS.md
/docs/04_FINANCIAL_FORMULAS.md
/docs/13_COMPONENT_LIBRARY.md

Build:

/follow-ups
/documents
/payments

Follow-Ups should support:

- Add task
- Edit task
- Priority
- Owner
- Due date
- Status
- Written confirmation required
- Evidence required
- Close task

Documents should support:

- Add document record
- Project/unit link
- Category
- Source
- Status
- Review status
- File path/link
- Notes

Payments should support:

- Add milestone
- Percentage
- Amount
- GST
- TDS
- Due date
- Paid status
- Receipt status
- Own contribution
- Loan disbursement
- Milestone total percentage validation

Use card layout on mobile and tables on desktop.
```

## Acceptance Criteria

```text
Follow-ups save
Documents save
Payment milestones save
Milestone % validation works
Dashboard can show open follow-ups
```

---

# 22. Prompt 19 — Import / Export

## Objective

Build JSON import/export and CSV export.

## Codex Prompt

```text
Read:

/docs/05_DATA_INGESTION_AND_PROJECT_INTAKE.md
/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md
/docs/17_TESTING_AND_QA_CHECKLIST.md

Build import/export features.

Required:

- Export full Project Pack JSON
- Import Project Pack JSON
- Validate import using Zod
- Show import review
- Show warnings/errors
- Support merge/replace/cancel
- Protect verified data from overwrite without confirmation
- Export Master Comparison CSV
- Export Follow-Ups CSV
- Export Payment Milestones CSV

Do not make Excel import mandatory.

Excel export/import can be left as future TODO.
```

## Acceptance Criteria

```text
JSON export works
Exported JSON re-imports
Invalid JSON fails gracefully
CSV export works
Import review visible
```

---

# 23. Prompt 20 — Settings Page

## Objective

Build settings for assumptions and defaults.

## Codex Prompt

```text
Read:

/docs/04_FINANCIAL_FORMULAS.md
/docs/09_SCORING_MODEL.md
/docs/08_MAP_AND_LOCATION_REQUIREMENTS.md
/docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md

Build the Settings page at:

/settings

Include sections:

- General
- Location
- Tax and Registration
- Home Loan
- Interior Budget
- Scoring Weights
- Display Preferences
- Import/Export

Settings should include:

- Default city
- Default city zone
- Current residence coordinates
- Primary workplace coordinates
- Default GST %
- Default TDS %
- Default stamp duty %
- Default registration %
- Default agreement registration charges
- Default franking/e-stamping
- Default Khata/mutation assumptions
- Default loan-to-value ratio
- Default interest rate
- Default tenure
- Default interior budgets by BHK
- Living score weights
- Investment score weights

Settings should persist locally.
```

## Acceptance Criteria

```text
Settings editable
Settings persist
Formula engine uses settings
Scoring engine uses weights
```

---

# 24. Prompt 21 — Responsive and Accessibility Pass

## Objective

Improve responsive behavior and accessibility.

## Codex Prompt

```text
Read:

/docs/16_RESPONSIVE_AND_ACCESSIBILITY_GUIDELINES.md
/docs/12_DESIGN_SYSTEM.md
/docs/17_TESTING_AND_QA_CHECKLIST.md

Perform responsive and accessibility pass across the app.

Check:

- Desktop dashboard
- Mobile dashboard
- Project list
- Project detail
- Compare page
- Site visit checklist
- Map page
- Financials
- Follow-ups
- Documents
- Payments
- Settings

Requirements:

- Mobile project list uses cards.
- Mobile site visit checklist is comfortable.
- Wide tables scroll only where intentional.
- Forms are single-column on mobile.
- Touch targets are large enough.
- Inputs have labels.
- Buttons have accessible names.
- Badges include text.
- Risk and missing data do not rely only on color.
- Map data has fallback list.
- Charts have readable summaries.
```

## Acceptance Criteria

```text
Mobile site visit is usable
No major accidental horizontal scrolling
Keyboard focus visible
Inputs labeled
Risk/missing data accessible
```

---

# 25. Prompt 22 — QA and Formula Verification

## Objective

Run QA and fix issues.

## Codex Prompt

```text
Read:

/docs/17_TESTING_AND_QA_CHECKLIST.md

Run a QA pass on the application.

Check:

- npm run typecheck
- npm run lint
- npm run build
- financial formula tests
- project creation
- unit creation
- dashboard load
- project detail load
- compare page
- site visit checklist
- follow-up creation
- document creation
- payment milestone validation
- JSON export
- JSON import
- mobile layout
- missing data behavior

Fix all critical and high issues.

Do not ignore formula errors.

Ensure missing values are not shown as zero unless they are genuinely zero.
```

## Acceptance Criteria

```text
Build passes
No TypeScript errors
Critical workflows work
Formula tests pass
No misleading missing values
```

---

# 26. Prompt 23 — UI Polish and Decision Readiness

## Objective

Make the portal feel like a polished decision cockpit.

## Codex Prompt

```text
Read:

/docs/11_UI_UX_DESIGN_DIRECTION.md
/docs/12_DESIGN_SYSTEM.md
/docs/13_COMPONENT_LIBRARY.md
/docs/07_DASHBOARD_REQUIREMENTS.md

Polish the UI to feel like a calm real estate decision cockpit.

Improve:

- Dashboard visual hierarchy
- KPI cards
- Project cards
- Unit cards
- Badges
- Cost breakdown presentation
- Missing data alerts
- Risk alerts
- Follow-up panels
- Comparison table readability
- Financial analysis readability
- Site visit checklist mobile experience
- Empty states
- Error states
- Tooltips

Add tooltips for:

- Agreement Value
- Total Landing Cost
- True Carpet Cost
- RERA Efficiency
- Hidden Cost %
- GST
- TDS
- Stamp Duty
- Registration Fee
- Corpus
- Maintenance
- Floor Rise
- PLC

Do not add unnecessary animations or decorative UI.
```

## Acceptance Criteria

```text
UI feels consistent
Financial hierarchy clear
Risks visible
Next actions visible
Tooltips useful
Dashboard supports real decision-making
```

---

# 27. Prompt 24 — Final Release Review

## Objective

Prepare first usable version.

## Codex Prompt

```text
Read all /docs files and review the implementation against them.

Create a final release checklist.

Verify:

- App builds
- Docs are included
- Seed projects load
- User can add project
- User can add unit
- User can enter costs
- User can see total landing cost
- User can compare units
- User can create site visit
- User can create follow-ups
- User can track documents
- User can track payment milestones
- User can export JSON backup
- User can import JSON backup
- Map works
- Settings persist
- Missing data is visible
- Parking is prominent
- Legal/RERA is prominent
- Living and investment scores are separate

Fix any final blockers.
```

## Acceptance Criteria

```text
First usable local version is ready
No major decision-breaking bugs
Data can be backed up
Core workflows usable
```

---

# 28. Debugging Prompts

Use these when Codex introduces issues.

## 28.1 Formula Bug Prompt

```text
The financial formula output appears incorrect. Read /docs/04_FINANCIAL_FORMULAS.md and /docs/17_TESTING_AND_QA_CHECKLIST.md. Review /src/lib/financial-formulas.ts. Fix the formula without changing UI code. Add or update tests for the failing case.
```

## 28.2 Missing Data Bug Prompt

```text
The UI is showing missing values incorrectly, possibly as ₹0, null, undefined, or NaN. Read /docs/12_DESIGN_SYSTEM.md, /docs/13_COMPONENT_LIBRARY.md, and /docs/17_TESTING_AND_QA_CHECKLIST.md. Fix display components so missing data is shown clearly and safely.
```

## 28.3 State Persistence Bug Prompt

```text
Local data is not persisting or is being overwritten. Read /docs/15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md. Review Zustand persistence and seed loading logic. Ensure seed data loads only when no local data exists.
```

## 28.4 Map SSR Bug Prompt

```text
The map is failing due to SSR or browser-only APIs. Read /docs/08_MAP_AND_LOCATION_REQUIREMENTS.md and /docs/14_FRONTEND_ENGINEERING_GUIDELINES.md. Use dynamic import with SSR disabled for Leaflet map components.
```

## 28.5 Mobile Site Visit Bug Prompt

```text
The site visit checklist is not usable on mobile. Read /docs/06_SITE_VISIT_CHECKLIST.md and /docs/16_RESPONSIVE_AND_ACCESSIBILITY_GUIDELINES.md. Convert dense checklist rows into mobile-friendly cards or collapsible sections with large tap targets.
```

## 28.6 Scoring Bug Prompt

```text
Living Score and Investment Score are being mixed or recommendation is not respecting risk caps. Read /docs/09_SCORING_MODEL.md. Fix scoring logic so Living Score and Investment Score remain separate and critical risks cap recommendation.
```

---

# 29. Prompt Execution Strategy

## 29.1 Do Not Run All Prompts Together

Run prompts in sequence.

After each phase:

1. Build
2. Test
3. Review UI
4. Fix issues
5. Commit
6. Continue

## 29.2 Recommended Commit Pattern

```text
commit 01: app scaffold and docs
commit 02: types and schemas
commit 03: formula engine
commit 04: local store and seed data
commit 05: core components
commit 06: dashboard
commit 07: project pages and forms
commit 08: comparison
commit 09: site visits
commit 10: map
commit 11: scoring
commit 12: follow-ups documents payments
commit 13: import export
commit 14: QA and polish
```

---

# 30. Final Codex Principle

Codex should build the portal like a product, not like a demo.

Every implementation step should preserve:

* Data correctness
* Formula transparency
* Missing-data safety
* Decision clarity
* Reusable architecture
* Local-first persistence
* UI consistency
* Future extensibility

The goal is not just to create screens.

The goal is to create a reliable real estate decision cockpit that the user can trust from project discovery to possession.
