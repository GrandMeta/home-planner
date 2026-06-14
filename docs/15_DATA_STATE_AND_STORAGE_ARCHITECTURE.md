# 15_DATA_STATE_AND_STORAGE_ARCHITECTURE.md

# Real Estate Decision Portal — Data, State, and Storage Architecture

## 1. Purpose of This Document

This document defines how the Real Estate Decision Portal should manage data, state, persistence, import/export, validation, and future storage migration.

The portal should be built as a local-first decision system.

The application should not depend on Excel as the source of truth. Excel may be used only for migration, backup, or export.

The long-term data source should be:

```text
Structured app state
+
Validated JSON Project Pack
+
Local persistence
```

The storage architecture should support:

* Projects
* Builders
* Units
* Cost breakups
* Parking details
* Legal/RERA information
* Site visits
* Checklist items
* Documents
* Follow-ups
* Payment milestones
* Scoring
* Settings
* Import/export
* Future backend migration

---

## 2. Core Storage Philosophy

The application should follow this principle:

> JSON and the app data model are the canonical source of truth. Excel is only an optional input/output format.

The portal should work even if the user never opens Excel again.

The user should be able to:

* Add a project manually.
* Add units manually.
* Enter cost and parking details.
* Capture site visit observations.
* Track follow-ups.
* Import a structured JSON Project Pack.
* Export the complete database as JSON.
* Export comparison views as CSV or Excel later.
* Continue using the portal locally without backend dependency.

---

# 3. State Architecture Overview

## 3.1 Recommended State Layers

The application should have three data layers:

```text
1. Source Data Layer
   Raw project/unit data entered or imported by user.

2. Derived Data Layer
   Calculated financials, scores, risks, completeness, recommendations.

3. UI State Layer
   Filters, selected units, active tabs, expanded sections, temporary form state.
```

These layers should not be mixed.

---

## 3.2 Source Data Layer

This includes persisted user data.

Examples:

* Builders
* Projects
* Units
* Cost breakups
* Parking details
* Legal info
* Location info
* Site visits
* Follow-ups
* Documents
* Payments
* Settings

This data should be saved to local persistence.

---

## 3.3 Derived Data Layer

Derived data should be calculated from source data.

Examples:

* Agreement value
* Total landing cost
* True SBA cost
* True carpet cost
* Hidden cost %
* EMI
* Rental yield
* Living score
* Investment score
* Risk level
* Data completeness
* Recommendation status

Derived values should not be manually edited unless an explicit override exists.

---

## 3.4 UI State Layer

UI state includes temporary interface state.

Examples:

* Active tab
* Current filter
* Search query
* Table sort state
* Selected units for comparison
* Open modal
* Expanded accordion
* Map zoom
* Map selected project

Some UI state may be persisted if useful, but it should not be mixed with project data.

---

# 4. Recommended State Management

## 4.1 Preferred Library

Use:

```text
Zustand
```

Reason:

* Lightweight
* Easy local persistence
* Works well with React
* Simple action-based state management
* Better than over-engineering Redux for this app

---

## 4.2 Store Files

Recommended store structure:

```text
/src/store
  real-estate-store.ts
  settings-store.ts
  ui-store.ts
```

## 4.3 Store Responsibilities

### real-estate-store.ts

Stores core real estate data:

* Builders
* Projects
* Units
* Site visits
* Follow-ups
* Documents
* Payment milestones
* Selected unit IDs

### settings-store.ts

Stores app-level settings:

* Default city
* Default city zone
* Tax assumptions
* Registration assumptions
* Loan assumptions
* Interior budget assumptions
* Scoring weights
* Location anchors

### ui-store.ts

Stores UI-only preferences:

* Sidebar collapsed
* Dashboard filters
* Project list view mode
* Comparison table density
* Map filters
* Last opened project

---

# 5. Canonical Data Structure

## 5.1 Project Pack

The complete application database should be exportable as a Project Pack.

Suggested shape:

```json
{
  "projectPackVersion": "1.0",
  "packName": "Real Estate Decision Portal Backup",
  "createdAt": "2026-06-14T00:00:00.000Z",
  "updatedAt": "2026-06-14T00:00:00.000Z",
  "source": "real-estate-decision-portal",
  "builders": [],
  "projects": [],
  "units": [],
  "siteVisits": [],
  "followUps": [],
  "documents": [],
  "paymentMilestones": [],
  "settings": {}
}
```

## 5.2 Why Flat Collections Are Recommended

Even though project pages may show nested data, storage should use flat collections for easier updates.

Recommended:

```text
projects[]
units[]
siteVisits[]
followUps[]
documents[]
paymentMilestones[]
```

Each child record references parent IDs.

Example:

```json
{
  "unitId": "unit_dsr_courtyard_3bhk_a1204",
  "projectId": "project_dsr_courtyard"
}
```

Benefits:

* Easier updates
* Easier filtering
* Easier import/export
* Easier future database migration
* Avoids deep object mutation issues

---

# 6. Entity Relationships

## 6.1 Primary Relationships

```text
Builder
  → has many Projects

Project
  → has many Units
  → has many Site Visits
  → has many Follow-Ups
  → has many Documents
  → has many Payment Milestones

Unit
  → belongs to Project
  → has CostBreakup
  → has ParkingDetails
  → has FinancialPlan
  → has ScoreCard
  → has Follow-Ups
  → has Documents
  → has Payment Milestones

SiteVisit
  → belongs to Project
  → may reference Unit
  → has ChecklistItems
  → may generate Follow-Ups

FollowUp
  → belongs to Project
  → may belong to Unit
  → may belong to SiteVisit

Document
  → belongs to Project
  → may belong to Unit

PaymentMilestone
  → belongs to Project
  → may belong to Unit
```

---

# 7. Recommended Data Collections

## 7.1 Builders Collection

```ts
builders: Builder[]
```

Stores builder-level information.

## 7.2 Projects Collection

```ts
projects: Project[]
```

Stores project-level information.

## 7.3 Units Collection

```ts
units: Unit[]
```

Stores unit-level information.

## 7.4 Site Visits Collection

```ts
siteVisits: SiteVisit[]
```

Stores visit header, checklist items, observations, and outcomes.

## 7.5 Follow-Ups Collection

```ts
followUps: FollowUpTask[]
```

Stores open, waiting, closed, and critical follow-up tasks.

## 7.6 Documents Collection

```ts
documents: DocumentRecord[]
```

Stores metadata about documents. In version 1, files may be linked by path/reference only.

## 7.7 Payment Milestones Collection

```ts
paymentMilestones: PaymentMilestone[]
```

Stores project/unit payment schedules.

## 7.8 Settings Object

```ts
settings: AppSettings
```

Stores tax, loan, scoring, location, and display assumptions.

---

# 8. Store Shape

Recommended Zustand store shape:

```ts
type RealEstateStore = {
  builders: Builder[]
  projects: Project[]
  units: Unit[]
  siteVisits: SiteVisit[]
  followUps: FollowUpTask[]
  documents: DocumentRecord[]
  paymentMilestones: PaymentMilestone[]

  selectedUnitIds: string[]

  addBuilder: (builder: Builder) => void
  updateBuilder: (builderId: string, patch: Partial<Builder>) => void
  deleteBuilder: (builderId: string) => void

  addProject: (project: Project) => void
  updateProject: (projectId: string, patch: Partial<Project>) => void
  deleteProject: (projectId: string) => void

  addUnit: (projectId: string, unit: Unit) => void
  updateUnit: (unitId: string, patch: Partial<Unit>) => void
  deleteUnit: (unitId: string) => void

  addSiteVisit: (visit: SiteVisit) => void
  updateSiteVisit: (siteVisitId: string, patch: Partial<SiteVisit>) => void
  deleteSiteVisit: (siteVisitId: string) => void

  addFollowUp: (followUp: FollowUpTask) => void
  updateFollowUp: (followUpId: string, patch: Partial<FollowUpTask>) => void
  closeFollowUp: (followUpId: string) => void

  addDocument: (document: DocumentRecord) => void
  updateDocument: (documentId: string, patch: Partial<DocumentRecord>) => void
  deleteDocument: (documentId: string) => void

  addPaymentMilestone: (milestone: PaymentMilestone) => void
  updatePaymentMilestone: (milestoneId: string, patch: Partial<PaymentMilestone>) => void
  deletePaymentMilestone: (milestoneId: string) => void

  selectUnitForComparison: (unitId: string) => void
  removeUnitFromComparison: (unitId: string) => void
  clearSelectedUnits: () => void

  importProjectPack: (projectPack: ProjectPack) => void
  exportProjectPack: () => ProjectPack
  resetStore: () => void
}
```

---

# 9. ID Strategy

## 9.1 ID Requirements

Every major record must have a stable unique ID.

Required IDs:

```text
builderId
projectId
unitId
siteVisitId
checklistItemId
followUpId
documentId
paymentMilestoneId
snagId
```

## 9.2 Recommended ID Format

Use readable generated IDs.

Examples:

```text
project_dsr_courtyard
unit_dsr_courtyard_3bhk_a1204
visit_dsr_courtyard_2026_06_14
followup_dsr_courtyard_parking_dimensions
document_dsr_courtyard_cost_sheet
```

Alternatively, use UUIDs.

Readable IDs are better for debugging and JSON review.

## 9.3 ID Collision Handling

During import, if an ID already exists, the system should detect conflict and offer:

```text
Skip
Replace
Merge
Create Copy
Cancel Import
```

---

# 10. Local Persistence Strategy

## 10.1 Phase 1 Persistence

Use:

```text
Zustand persist middleware + localStorage
```

This is enough for the first version.

## 10.2 Phase 2 Persistence

Use:

```text
IndexedDB
```

Recommended when:

* Data becomes larger
* Document metadata increases
* Visit notes grow
* Offline-first robustness becomes important

## 10.3 Phase 3 Persistence

Use backend/cloud only later.

Possible future options:

* Supabase
* Firebase
* PostgreSQL + Prisma
* SQLite local desktop wrapper
* Private server

Do not introduce backend in version 1 unless necessary.

---

# 11. localStorage Persistence

## 11.1 What to Store

Store:

* Projects
* Units
* Builders
* Site visits
* Follow-ups
* Documents metadata
* Payment milestones
* Settings
* Selected units

## 11.2 What Not to Store in localStorage

Avoid storing:

* Large files
* Images
* PDFs
* Raw document binaries
* Large extracted text

Use document references or metadata only in version 1.

## 11.3 Persistence Key

Use a clear key:

```text
real-estate-decision-portal-store-v1
```

Settings key:

```text
real-estate-decision-portal-settings-v1
```

UI preferences key:

```text
real-estate-decision-portal-ui-v1
```

---

# 12. Data Versioning

## 12.1 Why Versioning Is Needed

The schema will evolve.

The Project Pack should include version:

```json
{
  "projectPackVersion": "1.0"
}
```

## 12.2 Version Compatibility

When importing:

* If version matches, import normally.
* If version is older, run migration.
* If version is newer, show warning.

## 12.3 Migration Functions

Create migration utilities:

```text
/src/lib/migrations
  migrate-project-pack.ts
  v1-to-v2.ts
```

Suggested migration interface:

```ts
type MigrationResult = {
  migratedPack: ProjectPack
  warnings: string[]
}
```

---

# 13. Seed Data Strategy

## 13.1 Seed Data File

Use:

```text
/src/data/seed-projects.json
```

or:

```text
/data/seed-projects.json
```

## 13.2 Seed Projects

Initial seed projects:

```text
The Earthscape
DSR Courtyard
Myhna Orchid
DSR The Address
Sanjeevini Adwaith / The Adwaith
```

## 13.3 Seed Data Rule

Seed data does not need to be perfect.

It should:

* Create project records.
* Add known unit/cost fields where available.
* Mark uncertain fields as missing.
* Include source notes.
* Allow editing after load.

## 13.4 First-Time Load Behavior

When the app loads for the first time:

```text
If no local data exists:
  Load seed-projects.json
Else:
  Load persisted local data
```

Do not overwrite existing local user data automatically.

---

# 14. JSON Project Pack Import

## 14.1 Import Flow

```text
Select JSON file
→ Parse file
→ Validate Project Pack schema
→ Show import review
→ Show warnings/errors
→ User confirms import
→ Merge or replace data
→ Save to local store
```

## 14.2 Import Modes

Support:

```text
Merge
Replace All
Import as Copy
Cancel
```

## 14.3 Merge Behavior

Merge should:

* Add new records.
* Update existing records only after user confirmation.
* Detect conflicts.
* Preserve verified data unless user overrides.
* Show summary.

## 14.4 Replace All Behavior

Replace all should:

* Warn user clearly.
* Require confirmation.
* Create automatic backup export before replace if possible.

## 14.5 Import Review Screen

Show:

* Number of projects
* Number of units
* Number of site visits
* Number of follow-ups
* Number of documents
* Number of payment milestones
* Validation warnings
* Conflicts
* Missing critical fields

---

# 15. JSON Project Pack Export

## 15.1 Export Purpose

JSON export is the primary backup method.

## 15.2 Export Should Include

* Project Pack version
* Export timestamp
* Builders
* Projects
* Units
* Site visits
* Follow-ups
* Documents metadata
* Payment milestones
* Settings
* Selected units, optional

## 15.3 Export Filename

Recommended filename:

```text
real-estate-project-pack-YYYY-MM-DD.json
```

Example:

```text
real-estate-project-pack-2026-06-14.json
```

---

# 16. CSV Export

## 16.1 Purpose

CSV export is useful for sharing selected views.

## 16.2 Required CSV Exports

```text
Master comparison
Shortlisted units
Follow-ups
Documents
Payment milestones
```

## 16.3 CSV Export Rule

CSV export is view-based, not full backup.

Full backup should always be JSON.

---

# 17. Excel Export

## 17.1 Purpose

Excel export is useful for family, bank, or advisor sharing.

## 17.2 Suggested Sheets

```text
Master Comparison
Project Summary
Unit Comparison
Cost Breakdown
Follow-Ups
Documents
Payment Schedule
```

## 17.3 Excel Export Priority

Excel export is lower priority than:

1. JSON backup
2. CSV export
3. Portal UI

---

# 18. Excel Import

## 18.1 Role of Excel Import

Excel import is optional.

It should not be the primary workflow.

## 18.2 Initial Use

Excel may be used one time to migrate the existing workbook data into the portal.

## 18.3 Better Approach

Prefer manually preparing:

```text
/data/seed-projects.json
```

from the current Excel workbook rather than building a complex Excel parser in version 1.

## 18.4 Future Excel Import

Future Excel import can support:

* Project rows
* Unit rows
* Cost rows
* Follow-up rows

But it should still map into the same canonical JSON structure.

---

# 19. Validation Architecture

## 19.1 Validation Levels

Validation should happen at multiple levels.

```text
1. Schema Validation
2. Record Validation
3. Decision Readiness Validation
4. Booking Readiness Validation
5. Import Validation
```

---

## 19.2 Schema Validation

Uses Zod.

Checks:

* Required fields
* Data types
* Enum values
* Date format
* Numeric values

---

## 19.3 Record Validation

Checks whether a project/unit is structurally valid.

Example:

Project requires:

```text
projectName
builderName
city
cityZone
status
```

Unit requires:

```text
projectId
bhkConfiguration
approximate or actual SBA
```

---

## 19.4 Decision Readiness Validation

Checks whether project/unit is ready for serious comparison.

Required:

* Basic cost
* Agreement value
* GST treatment
* Stamp duty/registration estimate
* Carpet area
* Parking status
* RERA number
* Possession date
* Maintenance/corpus
* Location

---

## 19.5 Booking Readiness Validation

Checks whether project/unit is ready for booking.

Required:

* Final cost sheet
* Unit number
* Tower/floor/facing
* Parking confirmation
* RERA verification
* Draft agreement
* Cancellation policy
* Payment schedule
* Registration estimate
* Written commitments
* Legal review status

---

## 19.6 Validation Output Type

```ts
type ValidationIssue = {
  id: string
  entityType: "Project" | "Unit" | "SiteVisit" | "FollowUp" | "Document" | "Payment"
  entityId: string
  category: string
  field?: string
  severity: "Info" | "Warning" | "Critical"
  message: string
  recommendedAction?: string
}
```

---

# 20. Data Completeness Architecture

## 20.1 Completeness Purpose

Completeness indicates how reliable a project/unit comparison is.

## 20.2 Completeness Categories

Track completeness for:

```text
Project Identity
Unit Details
Space Details
Cost Details
Parking
Legal/RERA
Location
Amenities
Site Visit
Financial Planning
Investment Assumptions
Documents
Follow-Ups
```

## 20.3 Completeness Function

Create:

```ts
calculateDataCompleteness(entity): CompletenessResult
```

Suggested result:

```ts
type CompletenessResult = {
  score: number
  completeFields: number
  totalFields: number
  missingCriticalFields: string[]
  missingRecommendedFields: string[]
  sectionBreakdown: {
    section: string
    score: number
    missingFields: string[]
  }[]
}
```

---

# 21. Derived Selector Architecture

## 21.1 Why Selectors Are Needed

Dashboards need derived values from multiple entities.

Example:

A dashboard row may need:

* Project name
* Unit data
* Cost calculation
* Parking status
* Legal status
* Score
* Risk
* Follow-up count

This should be created through selectors/utilities, not duplicated in components.

---

## 21.2 Recommended Selectors

Create:

```text
/src/hooks
  useDashboardMetrics.ts
  useProjectSummary.ts
  useUnitFinancialSummary.ts
  useSelectedUnits.ts
  useOpenFollowUps.ts
  useRiskSummary.ts
  useMissingDataSummary.ts
```

## 21.3 Example Selector Output

```ts
type MasterComparisonRow = {
  projectId: string
  unitId: string
  projectName: string
  builderName: string
  microMarket?: string
  bhkConfiguration: string
  sbaSqft?: number
  carpetSqft?: number
  reraEfficiency?: number
  agreementValue?: number
  totalLandingCost?: number
  trueSbaCost?: number
  trueCarpetCost?: number
  parkingSummary?: string
  livingScore?: number
  investmentScore?: number
  riskLevel?: string
  status?: string
  nextAction?: string
}
```

---

# 22. Derived Data Storage Rule

## 22.1 Do Not Persist Most Derived Values

Do not persist values that can be recalculated from source data.

Examples not to persist by default:

* Total landing cost
* Hidden cost %
* True cost per carpet
* EMI
* Rental yield
* Score

## 22.2 Exceptions

Persist only when:

* User manually overrides calculated value.
* Calculation is expensive and cached.
* External verified value must be retained.
* Historical snapshot is needed.

## 22.3 Snapshot Use Case

Later, the portal can support snapshots:

```text
Quote Snapshot
Negotiation Snapshot
Booking Snapshot
```

This can preserve how values looked at a point in time.

Not required in version 1.

---

# 23. Conflict Resolution

## 23.1 When Conflict Occurs

Conflict may occur when:

* JSON import has same project ID with different values.
* Site visit data conflicts with existing verified data.
* User imports older backup.
* Document extraction suggests different cost.
* Online enrichment gives different RERA/date/location.

## 23.2 Conflict Resolution UI

Show:

```text
Existing Value
New Value
Existing Source
New Source
Existing Confidence
New Confidence
Actions:
- Keep Existing
- Replace
- Save New Value as Note
- Create Follow-Up
```

## 23.3 Verified Data Protection

Do not automatically overwrite:

* Legal verified data
* Document verified data
* Written confirmations
* Manual overrides

Require confirmation.

---

# 24. Data Source and Confidence

## 24.1 Important Fields Should Have Source

Important fields should support:

* Source type
* Source name
* Source date
* Confidence
* Notes

## 24.2 Confidence Hierarchy

Recommended hierarchy:

```text
1. Legal Verified
2. Document Verified
3. Written Confirmation
4. Builder Provided
5. Site Visit Confirmed
6. Online Source
7. User Estimate
8. Unknown
```

## 24.3 Usage

When two conflicting values exist, the higher-confidence source should be recommended, but user should decide.

---

# 25. Document Storage Architecture

## 25.1 Version 1

Version 1 should store document metadata only.

Example:

```ts
type DocumentRecord = {
  documentId: string
  projectId: string
  unitId?: string
  documentName: string
  documentCategory: string
  documentStatus: string
  source: string
  filePathOrUrl?: string
  collectedDate?: string
  reviewStatus: string
  notes?: string
}
```

## 25.2 File Handling

Do not build full document upload storage in version 1 unless required.

Allow the user to store:

* File path
* Google Drive link
* Local filename
* Note saying where document exists

## 25.3 Future Version

Future version may support:

* File upload
* IndexedDB blob storage
* Cloud document storage
* OCR/extraction
* Document preview

---

# 26. Site Visit Data Update Architecture

## 26.1 Site Visit Records

A site visit should be stored as a separate record.

Do not overwrite project data directly without confirmation.

## 26.2 Update Flow

```text
Site Visit Checklist Completed
→ User chooses fields to update
→ Conflict check
→ Project/unit source data updated
→ Confidence updated
→ Follow-ups created
→ Scores recalculated
```

## 26.3 Checklist to Follow-Up

Any checklist item marked:

```text
Needs Follow-up
Risk
```

should be able to create a FollowUpTask.

---

# 27. Settings Architecture

## 27.1 Settings Categories

Settings should include:

```text
General
Location
Tax and Registration
Loan
Interior Budget
Scoring Weights
Display Preferences
Import/Export
```

## 27.2 Settings Usage

Settings provide defaults for formulas.

Examples:

* Default GST %
* Default stamp duty %
* Default registration %
* Default loan interest rate
* Default loan tenure
* Default interior budget by BHK
* Living score weights
* Investment score weights

## 27.3 Settings Override

Unit-level values should override settings.

Example:

```text
If unit-specific GST percentage exists:
  Use unit-specific GST
Else:
  Use settings.defaultGstPercentage
```

---

# 28. Backup and Restore

## 28.1 Backup Requirement

The user should be able to export a full JSON backup at any time.

## 28.2 Restore Requirement

The user should be able to restore from a previous JSON backup.

## 28.3 Backup Reminder

Optional later feature:

```text
Show reminder if no backup exported in last 30 days.
```

## 28.4 Before Dangerous Operations

Before:

* Replace all data
* Clear store
* Import over existing records

The app should suggest exporting a backup.

---

# 29. Data Reset

## 29.1 Reset Options

Settings should include:

```text
Clear all local data
Reset only UI preferences
Reset settings to default
Reload seed data
```

## 29.2 Confirmation

Clearing all local data requires confirmation.

Example:

```text
This will delete all locally stored projects, units, site visits, follow-ups, documents, and settings from this browser.
Export a backup before continuing.
```

---

# 30. Future Backend Migration

## 30.1 Migration Readiness

The local data model should be designed so it can migrate to backend later.

That means:

* Stable IDs
* Flat collections
* ISO dates
* Numeric money values
* Source/confidence fields
* Schema versioning
* Project Pack export/import

## 30.2 Possible Backend Tables

Future backend can map to:

```text
builders
projects
units
site_visits
checklist_items
follow_ups
documents
payment_milestones
settings
score_snapshots
quote_snapshots
```

## 30.3 Backend Not Required Initially

Do not block first version by designing full backend.

---

# 31. Privacy and Data Control

The portal may contain sensitive financial and property data.

## 31.1 Version 1 Privacy Principle

Data stays in the user’s browser unless the user exports/imports.

Do not send data to external services.

## 31.2 External Services

Do not connect to external APIs in version 1 unless explicitly required.

Map tiles from OpenStreetMap are acceptable.

Future online enrichment should be optional and reviewed.

---

# 32. Storage Acceptance Criteria

The data/state/storage layer is complete when:

1. App uses structured data, not Excel, as source of truth.
2. Data is stored locally.
3. Projects can be added, edited, and persisted.
4. Units can be added, edited, and persisted.
5. Site visits can be saved.
6. Follow-ups can be saved.
7. Documents metadata can be saved.
8. Payment milestones can be saved.
9. Settings can be saved.
10. JSON export works.
11. JSON import validates data.
12. Invalid import does not crash the app.
13. Missing values are allowed.
14. Derived financial values are calculated from source data.
15. Derived scores are calculated from source data.
16. Verified data is protected from accidental overwrite.
17. The app can later migrate to backend without redesigning everything.

---

# 33. Final Architecture Principle

The portal should behave like a reliable personal real estate database.

It should allow the user to progressively build truth about each project:

* What the builder said
* What the documents prove
* What was observed during site visit
* What is still missing
* What is risky
* What is confirmed
* What changed over time

The data architecture should preserve clarity, trust, and future flexibility.
