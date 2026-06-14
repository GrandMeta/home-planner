# 13_COMPONENT_LIBRARY.md

# Real Estate Decision Portal — Component Library

## 1. Purpose of This Document

This document defines the reusable frontend components required for the Real Estate Decision Portal.

The portal should not be built as disconnected pages with repeated UI code. It should use a clean component system so that dashboards, project pages, forms, comparison tables, maps, financial analysis, site visits, follow-ups, and documents all feel consistent.

This document should guide Codex when building reusable React components.

The component library should support:

* Project tracking
* Unit comparison
* Financial analysis
* Parking clarity
* Legal/RERA tracking
* Site visit checklist
* Map view
* Follow-ups
* Documents
* Payment milestones
* Scoring
* Risk and missing-data visibility

---

## 2. Component Design Principles

## 2.1 Reusable Before Page-Specific

Build reusable components first wherever practical.

Examples:

* `KpiCard`
* `StatusBadge`
* `RiskBadge`
* `MoneyValue`
* `DataMissingBadge`
* `SectionCard`
* `ComparisonTable`
* `ProjectCard`
* `UnitCard`
* `FollowUpCard`

Do not create slightly different versions of the same UI in every page.

---

## 2.2 Data-Aware Components

Many components should understand the difference between:

* Zero
* Missing
* Not applicable
* Included
* Bundled
* Estimated
* Manual override

For example, a money field component should not show `₹0` when the actual value is unknown.

---

## 2.3 Decision-Oriented Components

Components should help the user decide.

Every major component should communicate one or more of:

* What is the value?
* Is it good or bad?
* Is it missing?
* Is it risky?
* Is it verified?
* What is the next action?

---

## 2.4 Consistent States

All components should support consistent states:

```text
default
hover
active
selected
disabled
loading
empty
error
missing
risk
verified
manualOverride
```

---

# 3. Component Categories

The component library should be organized into the following categories:

```text
1. Layout Components
2. Navigation Components
3. Card Components
4. Badge Components
5. Data Display Components
6. Table Components
7. Form Components
8. Financial Components
9. Project and Unit Components
10. Site Visit Components
11. Map Components
12. Scoring Components
13. Risk and Alert Components
14. Follow-Up Components
15. Document Components
16. Payment Components
17. Import / Export Components
18. Utility Components
```

---

# 4. Layout Components

## 4.1 AppShell

### Purpose

Main application layout.

### Should Include

* Sidebar navigation on desktop
* Mobile navigation fallback
* Main content area
* Page container
* Optional top bar

### Props

```ts
type AppShellProps = {
  children: React.ReactNode
}
```

### Behavior

* Sidebar visible on desktop.
* Sidebar collapsible in future.
* Mobile should use hamburger or bottom nav.
* Main content should scroll independently if needed.

---

## 4.2 PageHeader

### Purpose

Consistent header for every major page.

### Props

```ts
type PageHeaderProps = {
  title: string
  description?: string
  primaryAction?: React.ReactNode
  secondaryActions?: React.ReactNode
  badges?: React.ReactNode
}
```

### Usage Examples

* Dashboard title
* Projects page header with Add Project button
* Project detail header
* Site visit page header

---

## 4.3 SectionCard

### Purpose

Reusable card section for dashboards and detail pages.

### Props

```ts
type SectionCardProps = {
  title?: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}
```

### Usage

* Cost summary section
* Legal section
* Parking section
* Follow-up section
* Score breakdown section

---

## 4.4 SplitPanel

### Purpose

Two-column layout for pages like Map, Project Detail, Financial Analysis.

### Props

```ts
type SplitPanelProps = {
  left: React.ReactNode
  right: React.ReactNode
  leftWidth?: string
  rightWidth?: string
}
```

---

## 4.5 EmptyState

### Purpose

Reusable empty state component.

### Props

```ts
type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}
```

### Examples

```text
No projects added yet.
No units selected for comparison.
No open follow-ups.
No documents collected.
No map coordinates available.
```

---

# 5. Navigation Components

## 5.1 SidebarNav

### Purpose

Main desktop navigation.

### Navigation Items

```text
Dashboard
Projects
Compare
Map
Site Visits
Financials
Payments
Documents
Follow-Ups
Settings
```

### Props

```ts
type SidebarNavProps = {
  activeRoute: string
  followUpCount?: number
  riskCount?: number
}
```

---

## 5.2 MobileNav

### Purpose

Mobile-friendly navigation.

### Recommended Behavior

* Hamburger menu or bottom navigation.
* Prioritize:

  * Dashboard
  * Projects
  * Site Visits
  * Follow-Ups
  * More

---

## 5.3 Breadcrumbs

### Purpose

Show navigation hierarchy.

### Example

```text
Projects > DSR Courtyard > Unit 3BHK - Tower A - 1204
```

### Props

```ts
type BreadcrumbItem = {
  label: string
  href?: string
}
```

---

# 6. Card Components

## 6.1 KpiCard

### Purpose

Show dashboard KPI values.

### Props

```ts
type KpiCardProps = {
  label: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  trend?: string
  status?: "default" | "good" | "warning" | "danger" | "info"
}
```

### Examples

* Total Projects Tracked
* Lowest Landing Cost
* Best True Carpet Cost
* Open Follow-Ups
* Critical Risks

---

## 6.2 ProjectCard

### Purpose

Compact project summary card.

### Props

```ts
type ProjectCardProps = {
  projectId: string
  projectName: string
  builderName: string
  microMarket?: string
  cityZone?: string
  status: string
  purposeTag?: string
  startingPrice?: number
  bhkOptions?: string[]
  riskLevel?: string
  missingDataCount?: number
  openFollowUpCount?: number
  nextAction?: string
  onOpen?: () => void
}
```

### Should Show

* Project name
* Builder
* Area
* Status badge
* Purpose badge
* Starting price
* Risk badge
* Missing data count
* Next action

---

## 6.3 UnitCard

### Purpose

Compact unit summary card.

### Props

```ts
type UnitCardProps = {
  unitId: string
  projectName: string
  bhkConfiguration: string
  towerOrWing?: string
  floorNumber?: number
  unitNumber?: string
  facing?: string
  sbaSqft?: number
  carpetSqft?: number
  totalLandingCost?: number
  trueCarpetCost?: number
  parkingSummary?: string
  livingScore?: number
  investmentScore?: number
  status?: string
  selectedForComparison?: boolean
  onCompareToggle?: () => void
  onOpen?: () => void
}
```

---

## 6.4 RiskCard

### Purpose

Show a specific risk and action.

### Props

```ts
type RiskCardProps = {
  title: string
  severity: "Low" | "Medium" | "High" | "Critical" | "Unknown"
  category: string
  projectName?: string
  unitLabel?: string
  description?: string
  nextAction?: string
  dueDate?: string
}
```

---

## 6.5 FollowUpCard

### Purpose

Show task-level follow-up.

### Props

```ts
type FollowUpCardProps = {
  taskTitle: string
  projectName?: string
  unitLabel?: string
  category: string
  priority: "Low" | "Medium" | "High" | "Critical"
  owner?: string
  dueDate?: string
  status: string
  writtenConfirmationRequired?: boolean
  onOpen?: () => void
  onClose?: () => void
}
```

---

# 7. Badge Components

## 7.1 StatusBadge

### Purpose

Show project/unit workflow status.

### Inputs

```text
New Lead
Data Pending
Site Visit Planned
Site Visited
Under Comparison
Shortlisted
Strong Shortlist
Negotiation
Booking Ready
Booked
Rejected
On Hold
Closed
```

### Props

```ts
type StatusBadgeProps = {
  status: string
}
```

---

## 7.2 RiskBadge

### Purpose

Show risk level.

### Props

```ts
type RiskBadgeProps = {
  level: "Low" | "Medium" | "High" | "Critical" | "Unknown"
}
```

---

## 7.3 DataMissingBadge

### Purpose

Show missing information clearly.

### Props

```ts
type DataMissingBadgeProps = {
  label?: string
  severity?: "warning" | "critical"
}
```

### Examples

```text
Carpet Missing
GST Unknown
Parking Unknown
RERA Missing
Registration Missing
```

---

## 7.4 PurposeBadge

### Purpose

Show project purpose.

### Inputs

```text
Living
Investment
Both
Undecided
```

---

## 7.5 ConfidenceBadge

### Purpose

Show data confidence.

### Inputs

```text
Unknown
User Estimate
Online Source
Builder Provided
Site Visit Confirmed
Written Confirmation
Document Verified
Legal Verified
Manual Override
```

---

## 7.6 ParkingBadge

### Purpose

Show parking clarity.

### Examples

```text
1 Parking Included
2 Parkings Included
Parking Unknown
Extra Parking Available
EV Ready
Tandem Parking
```

---

# 8. Data Display Components

## 8.1 MoneyValue

### Purpose

Display INR values safely.

### Props

```ts
type MoneyValueProps = {
  amount?: number | null
  compact?: boolean
  showMissing?: boolean
  missingLabel?: string
  suffix?: string
}
```

### Behavior

* If amount is null/undefined and showMissing is true, show `Data Missing`.
* Use Indian number formatting.
* Compact mode can show `₹1.83 Cr`.
* Full mode can show `₹1,83,26,994`.

---

## 8.2 AreaValue

### Purpose

Display square foot values.

### Props

```ts
type AreaValueProps = {
  sqft?: number | null
  missingLabel?: string
}
```

### Example

```text
1,825 sq.ft
Carpet Missing
```

---

## 8.3 PercentageValue

### Purpose

Display percentages.

### Props

```ts
type PercentageValueProps = {
  value?: number | null
  decimals?: number
  missingLabel?: string
}
```

---

## 8.4 DateValue

### Purpose

Display dates consistently.

### Format

```text
DD-MMM-YYYY
```

### Behavior

If date missing:

```text
Date Missing
```

---

## 8.5 ScoreValue

### Purpose

Display score with label.

### Props

```ts
type ScoreValueProps = {
  score?: number | null
  label?: string
  showBand?: boolean
}
```

### Example

```text
82 / 100
Good
```

---

## 8.6 FieldWithMeta

### Purpose

Display a value with source/confidence/notes.

### Props

```ts
type FieldWithMetaProps = {
  label: string
  value: React.ReactNode
  confidence?: string
  source?: string
  notes?: string
  isManualOverride?: boolean
}
```

---

# 9. Table Components

## 9.1 DataTable

### Purpose

Generic table wrapper using TanStack Table.

### Features

* Sort
* Filter
* Search
* Pagination optional
* Sticky header
* Row actions
* Empty state
* Loading state

### Props

```ts
type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
}
```

---

## 9.2 ProjectTable

### Purpose

List all projects.

### Columns

```text
Project
Builder
Area
Zone
Purpose
BHK Options
Starting Landing Cost
RERA
Possession
Site Visit
Status
Risk
Next Action
```

---

## 9.3 UnitTable

### Purpose

List units within a project.

### Columns

```text
BHK
Tower
Floor
Unit
Facing
SBA
Carpet
Efficiency
Base Rate
Agreement Value
Total Landing Cost
True Carpet Cost
Parking
Living Score
Investment Score
Status
```

---

## 9.4 MasterComparisonTable

### Purpose

Main selected-unit comparison table.

### Required Features

* Wide horizontal scroll
* Sticky project/unit column
* Highlight best/worst values
* Missing-data badges
* Risk badges
* Export later

---

## 9.5 CostBreakupTable

### Purpose

Display cost components.

### Columns

```text
Cost Component
Amount
Treatment
Source
Confidence
Notes
```

### Must Support

* Included
* Bundled
* Unknown
* Manual override

---

## 9.6 FollowUpTable

### Purpose

Track tasks.

### Columns

```text
Project
Unit
Task
Category
Priority
Owner
Due Date
Status
Written Confirmation
Actions
```

---

## 9.7 DocumentTable

### Purpose

Track project/unit documents.

### Columns

```text
Project
Unit
Document Name
Category
Status
Source
Collected Date
Review Status
Notes
```

---

## 9.8 PaymentMilestoneTable

### Purpose

Track payment milestones.

### Columns

```text
Milestone
Percentage
Amount
GST
TDS
Due Date
Own Contribution
Loan Disbursement
Paid Amount
Receipt
Status
```

---

# 10. Form Components

## 10.1 FormSection

### Purpose

Group related fields.

### Props

```ts
type FormSectionProps = {
  title: string
  description?: string
  children: React.ReactNode
}
```

---

## 10.2 MoneyInput

### Purpose

Input for INR amounts.

### Behavior

* Accept raw number.
* Display formatted value where practical.
* Store numeric value.
* Support helper text.

---

## 10.3 AreaInput

### Purpose

Input for sq.ft values.

---

## 10.4 PercentageInput

### Purpose

Input for percentages.

### Rule

Store as numeric percent value.

Example:

```text
5 means 5%
```

---

## 10.5 ConfidenceSelector

### Purpose

Select data confidence.

### Options

```text
Unknown
User Estimate
Builder Provided
Site Visit Confirmed
Written Confirmation
Document Verified
Legal Verified
Manual Override
```

---

## 10.6 CostTreatmentSelector

### Purpose

Select cost treatment.

### Options

```text
Separate
Included
Bundled
Not Applicable
Unknown
Estimated
Manual Override
```

---

## 10.7 StatusSelector

### Purpose

Select project/unit/follow-up status.

---

## 10.8 RiskSelector

### Purpose

Select risk level.

---

## 10.9 NotesTextarea

### Purpose

Reusable notes input.

---

## 10.10 ProgressiveSaveBar

### Purpose

Show save status.

### States

```text
Unsaved changes
Saving
Saved
Error saving
```

---

# 11. Financial Components

## 11.1 FinancialSummaryCard

### Purpose

Show major financial summary for a unit.

### Should Show

* Builder quoted cost
* Agreement value
* Total sunk acquisition cost
* Total possession cost
* Total landing cost
* True SBA cost
* True carpet cost
* Hidden cost percentage

---

## 11.2 CostLayerBreakdown

### Purpose

Show layered cost build-up.

### Layers

```text
Basic Flat Cost
Core Builder Charges
GST
Stamp Duty and Registration
Legal / Documentation
Corpus and Maintenance
Possession Charges
Interiors and Move-In
Total Landing Cost
```

---

## 11.3 CostWaterfall

### Purpose

Visualize builder quote to total landing cost.

### Should Use

* Recharts or custom bar layout
* Clear labels
* INR formatting

---

## 11.4 TrueCostPanel

### Purpose

Show true SBA and carpet costs.

### Should Show

```text
True Cost per SBA Sq.Ft
True Cost per Carpet Sq.Ft
RERA Efficiency
```

---

## 11.5 EmiCalculatorCard

### Purpose

Show loan and EMI assumptions.

### Inputs

* Loan amount
* Interest rate
* Tenure
* Loan-to-value ratio

### Outputs

* EMI
* Own contribution
* Registration cash requirement

---

## 11.6 RentalYieldCard

### Purpose

Show investment yield.

### Inputs

* Expected monthly rent
* Maintenance paid by owner
* Property tax
* Vacancy

### Outputs

* Gross yield
* Net yield
* Maintenance burden

---

## 11.7 HiddenCostCard

### Purpose

Explain hidden cost.

### Should Show

* Basic flat cost
* Total landing cost
* Difference
* Hidden cost %
* Top contributors

---

# 12. Project and Unit Components

## 12.1 ProjectHeader

### Purpose

Header for project detail page.

### Should Show

* Project name
* Builder
* Area
* Status
* Purpose
* Risk
* Living score
* Investment score
* Next action

---

## 12.2 UnitHeader

### Purpose

Header for unit detail page or drawer.

### Should Show

* BHK
* Tower
* Floor
* Unit number
* Facing
* SBA
* Carpet
* Total landing cost
* Parking
* Status

---

## 12.3 ProjectTabs

### Tabs

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

---

## 12.4 UnitSelector

### Purpose

Select units for comparison or forms.

---

## 12.5 UnitComparisonSelector

### Purpose

Manage selected units for comparison.

### Should Show

* Selected units
* Add/remove controls
* Clear selection

---

# 13. Site Visit Components

## 13.1 SiteVisitHeader

### Purpose

Show visit metadata.

### Should Include

* Project
* Visit date/time
* Visit type
* Salesperson
* Overall impression
* Outcome

---

## 13.2 ChecklistSection

### Purpose

Group checklist items.

### Props

```ts
type ChecklistSectionProps = {
  title: string
  description?: string
  items: ChecklistItem[]
}
```

---

## 13.3 ChecklistItemRow

### Purpose

Single checklist item.

### Should Include

* Item name
* Status selector
* Priority
* Notes
* Follow-up toggle
* Evidence toggle

---

## 13.4 ChecklistStatusToggle

### Options

```text
Not Checked
Checked
Needs Follow-up
Risk
Not Applicable
```

---

## 13.5 VisitSummaryCard

### Purpose

Generate and display visit summary.

### Should Show

* Overall impression
* Visit outcome
* Key positives
* Key concerns
* Documents collected
* Follow-ups created
* Recommended next action

---

# 14. Map Components

## 14.1 ProjectMap

### Purpose

Main Leaflet map.

### Should Show

* Project pins
* Residence marker
* Workplace marker
* Radius circles
* Filters

---

## 14.2 ProjectMapPin

### Purpose

Individual project marker.

### Should Reflect

* Status
* Purpose
* Risk
* Pin confidence

---

## 14.3 MapPopupCard

### Purpose

Project summary inside map popup.

### Should Show

* Project
* Builder
* Area
* Total landing cost
* Living score
* Investment score
* Risk
* Distance to workplace
* Action to open project

---

## 14.4 LocationFallbackList

### Purpose

Show projects without coordinates.

### Should Include

* Project name
* Area
* Status
* Add coordinates action

---

## 14.5 RadiusCircleControl

### Purpose

Toggle radius circles.

Options:

```text
3 km
5 km
10 km
15 km
```

---

# 15. Scoring Components

## 15.1 ScoreCard

### Purpose

Show score and label.

### Props

```ts
type ScoreCardProps = {
  title: string
  score?: number | null
  confidence?: string
  description?: string
}
```

---

## 15.2 ScoreBreakdownPanel

### Purpose

Show score contributors.

### Should Show

* Parameter
* Score
* Weight
* Weighted score
* Notes

---

## 15.3 LivingInvestmentMatrix

### Purpose

Scatter plot of living vs investment.

### Should Show

* X-axis: Investment Score
* Y-axis: Living Score
* Project/unit points
* Quadrant labels

---

## 15.4 RecommendationCard

### Purpose

Explain recommendation.

### Should Show

* Recommendation label
* Why
* Risks
* Missing data
* Next action

---

# 16. Risk and Alert Components

## 16.1 MissingDataPanel

### Purpose

Show missing critical data.

### Should Group By

* Project
* Unit
* Category
* Severity

---

## 16.2 RiskAlertPanel

### Purpose

Show active risks.

---

## 16.3 NextActionPanel

### Purpose

Show recommended next actions.

### Should Include

* Action title
* Project/unit
* Priority
* Due date
* Open action

---

## 16.4 ConflictResolutionDialog

### Purpose

When new data conflicts with existing verified data.

### Should Show

```text
Existing value
New value
Existing source
New source
Existing confidence
New confidence
Actions: Keep Existing / Replace / Save as Note
```

---

# 17. Follow-Up Components

## 17.1 FollowUpForm

### Purpose

Create/edit follow-up task.

### Fields

* Task title
* Description
* Project
* Unit
* Category
* Owner
* Priority
* Status
* Due date
* Written confirmation required
* Evidence required
* Notes

---

## 17.2 FollowUpStatusMenu

### Statuses

```text
Open
In Progress
Waiting for Builder
Waiting for Legal Review
Waiting for Bank
Waiting for Family
Closed
Dropped
```

---

## 17.3 FollowUpPriorityBadge

### Priorities

```text
Low
Medium
High
Critical
```

---

# 18. Document Components

## 18.1 DocumentRecordForm

### Purpose

Create/edit document metadata.

### Fields

* Document name
* Category
* Project
* Unit
* Status
* Source
* Collected date
* Review status
* File path/link
* Notes

---

## 18.2 DocumentStatusBadge

### Statuses

```text
Required
Requested
Collected
Reviewed
Pending
Not Applicable
Risk
```

---

## 18.3 DocumentReviewBadge

### Statuses

```text
Not Reviewed
In Review
Cleared
Risk
Not Applicable
```

---

# 19. Payment Components

## 19.1 PaymentMilestoneForm

### Purpose

Create/edit payment milestone.

### Fields

* Project
* Unit
* Milestone name
* Milestone order
* Percentage
* Amount
* GST
* TDS
* Due date
* Paid amount
* Receipt status
* Notes

---

## 19.2 PaymentTimeline

### Purpose

Visual timeline of milestones.

### Should Show

* Upcoming
* Due
* Paid
* Overdue

---

## 19.3 PaymentSummaryCard

### Purpose

Show payment summary.

### Should Show

* Total payable
* Paid amount
* Pending amount
* Upcoming due
* Own contribution required
* Loan disbursement expected

---

# 20. Import / Export Components

## 20.1 JsonImportDialog

### Purpose

Import Project Pack JSON.

### Should Include

* File selector
* Validation result
* Errors
* Warnings
* Import confirmation

---

## 20.2 JsonExportButton

### Purpose

Export full project database.

---

## 20.3 CsvExportButton

### Purpose

Export tables as CSV.

---

## 20.4 ImportReviewPanel

### Purpose

Review imported data before saving.

### Should Show

* Imported projects
* Imported units
* Mapped fields
* Missing fields
* Warnings
* Conflicts

---

# 21. Utility Components

## 21.1 TooltipInfo

### Purpose

Show small financial/data explanations.

### Use For

* Agreement Value
* Total Landing Cost
* True Carpet Cost
* GST
* TDS
* Registration
* Corpus
* Floor Rise

---

## 21.2 ConfirmDialog

### Purpose

Confirm destructive or important actions.

### Use For

* Delete project
* Delete unit
* Reject project
* Overwrite verified data
* Import over existing data
* Close critical follow-up

---

## 21.3 SearchInput

### Purpose

Reusable search field.

---

## 21.4 FilterBar

### Purpose

Reusable filters for pages.

### Should Support

* Builder
* Area
* Zone
* Status
* Risk
* Purpose
* BHK
* Budget
* Site visit status

---

## 21.5 SortControl

### Purpose

Reusable sort dropdown.

---

## 21.6 ViewToggle

### Purpose

Switch between table/card/map views where required.

---

# 22. Recommended Component Folder Structure

```text
/src
  /components
    /layout
      AppShell.tsx
      PageHeader.tsx
      SectionCard.tsx
      EmptyState.tsx

    /navigation
      SidebarNav.tsx
      MobileNav.tsx
      Breadcrumbs.tsx

    /cards
      KpiCard.tsx
      ProjectCard.tsx
      UnitCard.tsx
      RiskCard.tsx
      FollowUpCard.tsx

    /badges
      StatusBadge.tsx
      RiskBadge.tsx
      DataMissingBadge.tsx
      PurposeBadge.tsx
      ConfidenceBadge.tsx
      ParkingBadge.tsx

    /data-display
      MoneyValue.tsx
      AreaValue.tsx
      PercentageValue.tsx
      DateValue.tsx
      ScoreValue.tsx
      FieldWithMeta.tsx

    /tables
      DataTable.tsx
      ProjectTable.tsx
      UnitTable.tsx
      MasterComparisonTable.tsx
      CostBreakupTable.tsx
      FollowUpTable.tsx
      DocumentTable.tsx
      PaymentMilestoneTable.tsx

    /forms
      FormSection.tsx
      MoneyInput.tsx
      AreaInput.tsx
      PercentageInput.tsx
      ConfidenceSelector.tsx
      CostTreatmentSelector.tsx
      StatusSelector.tsx
      RiskSelector.tsx
      NotesTextarea.tsx
      ProgressiveSaveBar.tsx

    /financial
      FinancialSummaryCard.tsx
      CostLayerBreakdown.tsx
      CostWaterfall.tsx
      TrueCostPanel.tsx
      EmiCalculatorCard.tsx
      RentalYieldCard.tsx
      HiddenCostCard.tsx

    /real-estate
      ProjectHeader.tsx
      UnitHeader.tsx
      ProjectTabs.tsx
      UnitSelector.tsx
      UnitComparisonSelector.tsx

    /site-visits
      SiteVisitHeader.tsx
      ChecklistSection.tsx
      ChecklistItemRow.tsx
      ChecklistStatusToggle.tsx
      VisitSummaryCard.tsx

    /map
      ProjectMap.tsx
      ProjectMapPin.tsx
      MapPopupCard.tsx
      LocationFallbackList.tsx
      RadiusCircleControl.tsx

    /scoring
      ScoreCard.tsx
      ScoreBreakdownPanel.tsx
      LivingInvestmentMatrix.tsx
      RecommendationCard.tsx

    /alerts
      MissingDataPanel.tsx
      RiskAlertPanel.tsx
      NextActionPanel.tsx
      ConflictResolutionDialog.tsx

    /follow-ups
      FollowUpForm.tsx
      FollowUpStatusMenu.tsx
      FollowUpPriorityBadge.tsx

    /documents
      DocumentRecordForm.tsx
      DocumentStatusBadge.tsx
      DocumentReviewBadge.tsx

    /payments
      PaymentMilestoneForm.tsx
      PaymentTimeline.tsx
      PaymentSummaryCard.tsx

    /import-export
      JsonImportDialog.tsx
      JsonExportButton.tsx
      CsvExportButton.tsx
      ImportReviewPanel.tsx

    /utility
      TooltipInfo.tsx
      ConfirmDialog.tsx
      SearchInput.tsx
      FilterBar.tsx
      SortControl.tsx
      ViewToggle.tsx
```

---

# 23. Component Implementation Rules

## 23.1 Formatting

All components showing money should use centralized formatting.

Do not manually format INR inside each component.

Use:

```ts
formatInr(amount)
formatInrCompact(amount)
```

## 23.2 Missing Data

Components must not show raw `undefined`, `null`, `NaN`, or `₹0` for missing data.

Use:

```text
Data Missing
Not Available
To Confirm
```

depending on context.

## 23.3 Enums

Badges and selectors should use centralized enum definitions.

Do not duplicate status strings randomly.

## 23.4 Styling

Use design tokens and shared visual rules from:

```text
12_DESIGN_SYSTEM.md
```

## 23.5 Accessibility

Interactive components should:

* Have labels
* Support keyboard focus
* Use readable contrast
* Not rely only on color

---

# 24. Component Acceptance Criteria

The component library is successful when:

1. Pages reuse common components.
2. Cards, tables, badges, and forms are visually consistent.
3. Financial values are formatted consistently.
4. Missing data is handled consistently.
5. Risk and status states are consistent.
6. Forms support progressive data entry.
7. Site visit checklist is mobile-friendly.
8. Comparison table supports wide real estate data.
9. Map components are reusable and isolated.
10. Scoring components clearly explain scores.
11. Follow-up and document components are reusable across pages.
12. Components follow the design system.

---

# 25. Final Component Principle

The component library should make the application easier to build, maintain, and extend.

The user experience should feel unified across:

* Dashboard
* Projects
* Units
* Financials
* Map
* Site Visits
* Documents
* Follow-Ups
* Payments
* Settings

Every component should help the user understand the property decision more clearly.
