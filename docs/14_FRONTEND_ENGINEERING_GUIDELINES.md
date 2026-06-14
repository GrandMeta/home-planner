# 14_FRONTEND_ENGINEERING_GUIDELINES.md

# Real Estate Decision Portal — Frontend Engineering Guidelines

## 1. Purpose of This Document

This document defines frontend engineering guidelines for the Real Estate Decision Portal.

The purpose is to ensure that the application is built cleanly, consistently, and maintainably.

The portal must not become a set of disconnected pages with duplicated logic. It should be built using a clear architecture, reusable components, typed data models, isolated formula functions, and predictable state management.

This document should guide Codex during actual implementation.

---

## 2. Engineering Philosophy

The application should follow these principles:

1. Documentation-first development
2. Type-safe data structures
3. Local-first functionality
4. Reusable components
5. Pure formula functions
6. Clear separation between data, logic, and UI
7. Progressive enhancement
8. Safe handling of missing data
9. Minimal over-engineering in version 1
10. Easy future migration to backend/cloud

The first version should focus on being usable, understandable, and extensible.

---

# 3. Recommended Technology Stack

## 3.1 Core Stack

| Layer            | Recommendation                 |
| ---------------- | ------------------------------ |
| Framework        | Next.js                        |
| Language         | TypeScript                     |
| Styling          | Tailwind CSS                   |
| UI Components    | shadcn/ui or custom components |
| Forms            | React Hook Form                |
| Validation       | Zod                            |
| Tables           | TanStack Table                 |
| Charts           | Recharts                       |
| Map              | Leaflet + OpenStreetMap        |
| State Management | Zustand                        |
| Persistence      | Local JSON / IndexedDB         |
| Icons            | Lucide React                   |
| Date Handling    | date-fns                       |
| Testing          | Vitest / React Testing Library |

## 3.2 Version 1 Principle

Do not introduce unnecessary backend complexity in the first version.

Initial version should work as:

```text
Local-first dashboard
+
JSON project database
+
Manual forms
+
Calculated views
```

---

# 4. Source-of-Truth Rule

The `/docs` folder is the product and engineering source of truth.

Codex must read these files before implementing major features:

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
/docs/11_UI_UX_DESIGN_DIRECTION.md
/docs/12_DESIGN_SYSTEM.md
/docs/13_COMPONENT_LIBRARY.md
/docs/14_FRONTEND_ENGINEERING_GUIDELINES.md
```

Implementation must follow the docs unless there is a clear technical issue.

If implementation deviates from docs, the reason should be documented in comments or a changelog.

---

# 5. Recommended App Folder Structure

Suggested structure:

```text
/src
  /app
    /page.tsx
    /projects
      /page.tsx
      /[projectId]
        /page.tsx
    /compare
      /page.tsx
    /map
      /page.tsx
    /site-visits
      /page.tsx
      /[siteVisitId]
        /page.tsx
    /financials
      /page.tsx
    /payments
      /page.tsx
    /documents
      /page.tsx
    /follow-ups
      /page.tsx
    /settings
      /page.tsx

  /components
    /layout
    /navigation
    /cards
    /badges
    /data-display
    /tables
    /forms
    /financial
    /real-estate
    /site-visits
    /map
    /scoring
    /alerts
    /follow-ups
    /documents
    /payments
    /import-export
    /utility

  /types
    real-estate.ts
    enums.ts
    money.ts
    scoring.ts

  /schemas
    project-schema.ts
    unit-schema.ts
    project-pack-schema.ts
    settings-schema.ts

  /lib
    financial-formulas.ts
    scoring.ts
    risk-engine.ts
    completeness.ts
    formatters.ts
    validation.ts
    project-utils.ts
    unit-utils.ts
    map-utils.ts
    import-export.ts

  /store
    real-estate-store.ts
    settings-store.ts

  /data
    seed-projects.json

  /constants
    defaults.ts
    routes.ts
    labels.ts
    checklist-template.ts

  /hooks
    useProjects.ts
    useUnits.ts
    useSelectedUnits.ts
    useDashboardMetrics.ts
    useFinancialSummary.ts
    useScoring.ts

  /styles
    globals.css
```

---

# 6. Routing Guidelines

## 6.1 Required Routes

```text
/
  Master Dashboard

/projects
  Project list

/projects/[projectId]
  Project detail

/compare
  Unit comparison

/map
  Bangalore project map

/site-visits
  Site visit list

/site-visits/[siteVisitId]
  Site visit checklist

/financials
  Financial analysis

/payments
  Payment milestone tracker

/documents
  Document tracker

/follow-ups
  Follow-up tracker

/settings
  App settings
```

## 6.2 Route Behavior

Each route should:

* Use a consistent page header.
* Use app shell navigation.
* Show empty states when data is missing.
* Avoid crashing when store is empty.
* Avoid relying on hardcoded seed projects.

---

# 7. TypeScript Guidelines

## 7.1 Strict Typing

Enable strict TypeScript settings.

Recommended:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## 7.2 Centralized Types

Do not define real estate types directly inside components.

Use:

```text
/src/types/real-estate.ts
/src/types/enums.ts
/src/types/money.ts
```

## 7.3 Important Type Groups

Create types for:

* Builder
* Project
* Unit
* SpaceDetails
* CostBreakup
* StatutoryCharges
* ParkingDetails
* LegalInfo
* LocationInfo
* Amenity
* SiteVisit
* ChecklistItem
* DocumentRecord
* FollowUpTask
* PaymentMilestone
* FinancialPlan
* InvestmentAssumptions
* LivingSuitability
* ScoreCard
* AppSettings
* ProjectPack

## 7.4 Enum Discipline

Use centralized enum/string union types.

Do not randomly repeat strings like:

```text
"Shortlisted"
"Critical"
"Builder Provided"
```

across components.

Use central types/constants.

---

# 8. Data Modeling Rules

## 8.1 IDs

Every major entity should have a stable ID.

Examples:

```text
projectId
unitId
siteVisitId
followUpId
documentId
paymentMilestoneId
```

Use UUID or deterministic generated IDs.

## 8.2 Date Format

Store dates internally as ISO strings.

Display as:

```text
DD-MMM-YYYY
```

## 8.3 Currency

Store currency amounts as numbers.

Do not store formatted strings like:

```text
₹1,83,26,994
```

in data model.

Store:

```json
{
  "amount": 18326994,
  "currency": "INR"
}
```

Format only in UI.

## 8.4 Percentages

Store percentages as numeric values.

Example:

```text
5 means 5%
```

Do not store:

```text
0.05
```

unless the formula explicitly converts.

Formula utilities should clearly convert percentages.

## 8.5 Missing Values

Use:

```text
null
```

or undefined for missing data.

Do not use zero to mean unknown.

Formula utilities may treat missing numeric values as zero internally, but UI must show missing values clearly.

---

# 9. Formula Engineering Rules

## 9.1 Pure Functions

Financial formulas must be pure functions.

They should:

* Take input data.
* Return calculated value.
* Not mutate state.
* Not read UI state directly.
* Not depend on React.

Example:

```ts
calculateAgreementValue(costBreakup): number
```

## 9.2 Formula File

All core financial formulas should live in:

```text
/src/lib/financial-formulas.ts
```

## 9.3 Formula Functions to Implement

Required:

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
```

## 9.4 Calculation Result Pattern

For important formulas, use result objects.

```ts
type CalculationResult = {
  value: number | null
  canCalculate: boolean
  missingFields?: string[]
  warnings?: string[]
  explanation?: string
}
```

This helps the UI show why something cannot be calculated.

## 9.5 Missing Data Handling

Bad:

```ts
return NaN
```

Good:

```ts
return {
  value: null,
  canCalculate: false,
  missingFields: ["carpetAreaReraSqft"],
  explanation: "True carpet cost cannot be calculated because carpet area is missing."
}
```

---

# 10. Scoring Engineering Rules

## 10.1 Scoring File

Scoring logic should live in:

```text
/src/lib/scoring.ts
```

Risk logic may live in:

```text
/src/lib/risk-engine.ts
```

Data completeness may live in:

```text
/src/lib/completeness.ts
```

## 10.2 Score Functions

Required:

```text
calculateLivingScore
calculateInvestmentScore
calculateFinancialScore
calculateLocationScore
calculateParkingScore
calculateLegalScore
calculateDataCompletenessScore
calculateOverallRiskLevel
calculateRecommendationStatus
```

## 10.3 Score Result Pattern

Use:

```ts
type ScoreResult = {
  score: number | null
  label: "Excellent" | "Good" | "Needs Review" | "Weak" | "Poor" | "Missing"
  confidence: "High" | "Medium" | "Low" | "Very Low"
  positiveContributors: string[]
  negativeContributors: string[]
  missingInputs: string[]
  riskCapsApplied: string[]
}
```

## 10.4 Separate Living and Investment

Never merge Living Score and Investment Score into one generic score.

The UI must show them separately.

## 10.5 Risk Overrides

Critical risk should cap recommendation even if score is high.

Examples:

* RERA missing
* Parking unknown
* Final cost sheet missing
* Critical legal risk
* Possession date unclear

---

# 11. State Management Guidelines

## 11.1 Recommended State Library

Use Zustand for app-level local state.

Suggested store file:

```text
/src/store/real-estate-store.ts
```

## 11.2 Store Responsibilities

The store should manage:

* Projects
* Units
* Site visits
* Follow-ups
* Documents
* Payment milestones
* Settings
* Selected units for comparison

## 11.3 Store Should Not Contain Heavy UI Logic

Avoid storing derived dashboard metrics directly unless needed.

Use selectors/hooks to calculate derived values.

## 11.4 Suggested Store Actions

```ts
addProject(project)
updateProject(projectId, patch)
deleteProject(projectId)

addUnit(projectId, unit)
updateUnit(unitId, patch)
deleteUnit(unitId)

selectUnitForComparison(unitId)
removeUnitFromComparison(unitId)

addSiteVisit(projectId, visit)
updateSiteVisit(siteVisitId, patch)

addFollowUp(task)
updateFollowUp(followUpId, patch)
closeFollowUp(followUpId)

addDocument(record)
updateDocument(documentId, patch)

addPaymentMilestone(milestone)
updatePaymentMilestone(milestoneId, patch)

importProjectPack(projectPack)
exportProjectPack()
```

## 11.5 State Persistence

Initial persistence options:

1. Browser local storage for small data.
2. IndexedDB for larger structured data.
3. JSON import/export for backup.

Recommended first build:

```text
Zustand + localStorage persistence
```

Future build:

```text
IndexedDB
```

---

# 12. Validation Guidelines

## 12.1 Zod Schemas

Use Zod schemas for:

* Project
* Unit
* ProjectPack
* Settings
* Import data

Schema files:

```text
/src/schemas/project-schema.ts
/src/schemas/unit-schema.ts
/src/schemas/project-pack-schema.ts
/src/schemas/settings-schema.ts
```

## 12.2 Validation Levels

Use multiple validation levels.

### Basic Validation

Required to create record.

Example:

* Project name
* Builder name
* City
* City zone

### Decision Validation

Required for serious comparison.

Example:

* Cost sheet
* Carpet area
* Parking
* RERA
* Registration estimate

### Booking Readiness Validation

Required before “Booking Ready”.

Example:

* Final cost sheet
* Legal documents
* Payment schedule
* Cancellation policy
* Written commitments

## 12.3 Validation Output

Validation should return:

```ts
type ValidationIssue = {
  field: string
  message: string
  severity: "info" | "warning" | "critical"
  category: string
}
```

---

# 13. Forms Engineering Guidelines

## 13.1 Form Library

Use React Hook Form with Zod resolver.

## 13.2 Progressive Forms

Forms should allow partial save.

Do not force all optional fields.

## 13.3 Large Forms

Break large forms into sections:

* Project basics
* Location
* Legal
* Unit details
* Cost
* Parking
* Maintenance
* Financial planning

## 13.4 Form Default Values

Default values should come from:

* App settings
* Existing record, if editing
* Safe defaults

Example:

```text
City = Bangalore
City Zone = East Bangalore
Project Status = New Lead
Purpose = Undecided
Currency = INR
```

## 13.5 Number Inputs

Number inputs should store numeric values, not formatted strings.

Formatting can appear on blur or display components.

---

# 14. Component Engineering Guidelines

## 14.1 Component Folder

Use the component folders defined in:

```text
13_COMPONENT_LIBRARY.md
```

## 14.2 Component Size

Components should remain focused.

Avoid very large components with too many responsibilities.

If a component grows too large, split it into:

* Container component
* Presentational component
* Utility functions

## 14.3 Props

Props should be typed.

Avoid `any`.

## 14.4 Reusable Display Components

Use shared components for:

* Money
* Area
* Percentage
* Date
* Score
* Status
* Risk
* Missing data

Do not repeat formatting logic.

---

# 15. Table Engineering Guidelines

## 15.1 Table Library

Use TanStack Table.

## 15.2 Required Table Features

For major tables:

* Sorting
* Filtering
* Search
* Sticky headers
* Row actions
* Empty state
* Horizontal scroll for wide comparison

## 15.3 Comparison Table

The comparison table should support:

* Sticky first column
* Grouped row sections
* Highlight best/worst values
* Missing data badges
* Risk indicators

## 15.4 Performance

For first version, dataset is small.

No need for virtualization unless tables become very large.

---

# 16. Map Engineering Guidelines

## 16.1 Map Library

Use:

```text
Leaflet + OpenStreetMap
```

## 16.2 SSR Handling

Leaflet can have SSR issues in Next.js.

Use dynamic import with SSR disabled for map components.

Example approach:

```ts
const ProjectMap = dynamic(() => import("@/components/map/ProjectMap"), {
  ssr: false
})
```

## 16.3 Missing Coordinates

Never place missing-coordinate projects at default coordinates.

Show them in a fallback list.

## 16.4 Marker Data

Map markers should be generated from project data.

Do not hardcode project pins.

---

# 17. Import / Export Guidelines

## 17.1 JSON First

JSON Project Pack is the canonical import/export format.

## 17.2 Excel Not Core

Excel import is optional and should not be the foundation.

## 17.3 Import Validation

Import flow:

```text
Select file
→ Parse JSON
→ Validate schema
→ Show warnings/errors
→ Review import
→ Confirm save
```

## 17.4 Export

Export should support:

* Full JSON backup
* Master comparison CSV
* Follow-up CSV
* Payment milestone CSV

Excel export can come later.

---

# 18. Formatting Utilities

Create centralized utilities:

```text
/src/lib/formatters.ts
```

Required:

```ts
formatInr(amount)
formatInrCompact(amount)
formatNumber(value)
formatSqft(value)
formatPercentage(value)
formatDate(value)
formatScore(value)
```

## 18.1 INR Formatting

Use Indian numbering format.

Examples:

```text
₹1,83,26,994
₹1.83 Cr
₹9,599 / sq.ft
```

## 18.2 Missing Value Formatting

Formatting utilities should handle:

* null
* undefined
* NaN

Return display-safe labels.

---

# 19. Error Handling Guidelines

## 19.1 User-Friendly Errors

Avoid technical messages.

Bad:

```text
TypeError: Cannot read property amount of undefined
```

Good:

```text
Agreement value cannot be calculated because basic flat cost is missing.
```

## 19.2 Formula Errors

Formula functions should return missing field information.

## 19.3 Import Errors

Import errors should show:

* File parsing issue
* Invalid schema
* Missing required fields
* Conflicting project IDs
* Unsupported version

---

# 20. Testing Guidelines

## 20.1 Formula Tests

Prioritize tests for:

* Agreement value
* GST
* Stamp duty
* Registration
* Total landing cost
* True SBA cost
* True carpet cost
* EMI
* Rental yield
* Payment milestones

## 20.2 Component Tests

Test:

* MoneyValue missing display
* RiskBadge
* StatusBadge
* DataMissingBadge
* ProjectCard
* UnitCard
* FollowUpCard

## 20.3 Validation Tests

Test:

* Valid Project Pack
* Invalid Project Pack
* Missing required project fields
* Invalid enum values
* Invalid numeric fields

---

# 21. Performance Guidelines

The first version will likely have limited data volume.

Avoid over-optimization.

Focus on:

* Clean state updates
* Memoized derived calculations where needed
* Avoiding unnecessary recalculations in large tables
* Lazy-loading map component
* Lazy-loading heavy charts if required

---

# 22. Accessibility Guidelines

Follow these basics:

1. Every input must have a label.
2. Buttons must be keyboard accessible.
3. Dialogs must be focus-managed.
4. Do not rely only on color.
5. Badges should contain text.
6. Use sufficient contrast.
7. Tables should have proper headers.
8. Form errors should be readable.

---

# 23. Security and Privacy Guidelines

The portal may contain sensitive personal financial and property decision data.

For first version:

* Keep data local.
* Do not send data to external services.
* Do not require authentication unless backend is added.
* Do not embed API keys in frontend.
* Do not auto-upload documents.
* Warn user before clearing or overwriting data.

Future backend/cloud version should add:

* Authentication
* Encrypted storage
* Secure document handling
* Backup/export control

---

# 24. Development Guardrails for Codex

Codex should follow these rules:

1. Read the docs before implementing.
2. Do not invent new schema fields unless necessary.
3. Do not hardcode only the seed projects.
4. Do not make Excel the main data source.
5. Do not mix formulas inside JSX.
6. Do not duplicate formatting logic.
7. Do not display missing values as zero.
8. Do not merge living and investment scoring.
9. Do not hide parking inside cost only.
10. Do not make legal/RERA optional in booking readiness.
11. Do not introduce paid APIs in first version.
12. Keep components reusable.
13. Keep formulas testable.
14. Keep UI calm and decision-oriented.
15. Build in small phases.

---

# 25. Recommended Development Sequence

Use this implementation order:

```text
1. App shell and routes
2. TypeScript types and enums
3. Formatting utilities
4. Financial formulas
5. Local store
6. Seed JSON
7. Basic dashboard
8. Projects page
9. Project detail page
10. Unit forms
11. Cost forms
12. Comparison page
13. Site visit checklist
14. Follow-ups and documents
15. Map
16. Scoring
17. Financial analysis
18. Import/export
19. UI polish
```

This sequence avoids building advanced UI before the core data model and formulas are stable.

---

# 26. Engineering Acceptance Criteria

The frontend engineering approach is successful when:

1. The app builds without TypeScript errors.
2. Data types are centralized.
3. Formula functions are isolated and testable.
4. Formatting utilities are reused.
5. Components follow the design system.
6. Pages do not duplicate major UI logic.
7. Missing data does not break the app.
8. JSON import/export works safely.
9. Dashboard reads from structured data.
10. Project/unit forms update the store.
11. Comparison uses calculated KPIs.
12. Site visit checklist creates follow-ups.
13. Map handles missing coordinates safely.
14. Scores are calculated separately for living and investment.
15. The app can grow without a major rewrite.

---

# 27. Final Engineering Principle

The frontend should be built like a real decision system, not a prototype glued together with static data.

The application must be:

* Typed
* Modular
* Local-first
* Formula-safe
* Component-driven
* Extensible
* Clear for the user

Good engineering here means the user can trust the calculations, update data confidently, and continue using the portal as the property decision progresses from discovery to possession.
