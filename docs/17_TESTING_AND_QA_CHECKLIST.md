# 17_TESTING_AND_QA_CHECKLIST.md

# Real Estate Decision Portal — Testing and QA Checklist

## 1. Purpose of This Document

This document defines the testing and QA checklist for the Real Estate Decision Portal.

The portal will support high-value real estate decisions. Therefore, calculations, data handling, missing-value behavior, forms, dashboards, and comparisons must be tested carefully.

The goal is not only to check whether the app loads. The goal is to ensure that the user can trust the portal for:

* Cost comparison
* Total landing cost calculation
* True carpet cost calculation
* Registration and statutory cost handling
* Parking clarity
* Site visit capture
* Follow-up tracking
* Living score
* Investment score
* Risk visibility
* JSON import/export
* Local data persistence

---

## 2. QA Philosophy

The portal should be tested as a decision system, not just as a UI.

Every test should answer:

```text
Does this help the user make a clearer property decision?
Does the app handle incomplete real estate data safely?
Does the app avoid misleading financial output?
Does the app show missing and risky data clearly?
```

The portal must never silently convert unknown values into confident-looking numbers.

---

# 3. Testing Layers

Testing should happen across these layers:

```text
1. TypeScript type safety
2. Formula unit tests
3. Validation tests
4. Store/state tests
5. Component tests
6. Page-level UI tests
7. Responsive tests
8. Accessibility tests
9. Import/export tests
10. Manual QA with seed projects
```

---

# 4. Recommended Testing Stack

Recommended tools:

| Area                               | Tool                            |
| ---------------------------------- | ------------------------------- |
| Unit tests                         | Vitest                          |
| Component tests                    | React Testing Library           |
| Schema validation tests            | Vitest + Zod                    |
| End-to-end testing, optional later | Playwright                      |
| Accessibility checks               | axe / browser checks            |
| Manual browser QA                  | Chrome, Safari, mobile viewport |
| Type checking                      | TypeScript                      |
| Linting                            | ESLint                          |
| Formatting                         | Prettier                        |

Version 1 should at minimum include:

* TypeScript compile checks
* Formula tests
* Validation tests
* Manual UI QA

---

# 5. TypeScript QA

## 5.1 Required Checks

Run:

```text
npm run typecheck
npm run lint
npm run build
```

## 5.2 Acceptance Criteria

The app should pass:

* No TypeScript errors
* No critical lint errors
* Production build succeeds
* No major console runtime errors

## 5.3 Type Safety Rules

Check that:

* No major real estate entity uses `any`.
* Formula functions have typed inputs and outputs.
* Store actions have typed parameters.
* Component props are typed.
* Import/export functions use typed Project Pack structure.
* Enums/status values are centralized.

---

# 6. Financial Formula Tests

Financial formulas are the most critical test area.

Core formula file:

```text
/src/lib/financial-formulas.ts
```

## 6.1 Basic Flat Cost Test

Formula:

```text
Basic Flat Cost = SBA × Base Price per Sq.Ft
```

Test case:

```text
SBA = 1800
Base Rate = 9500
Expected Basic Flat Cost = 1,71,00,000
```

Acceptance:

* Correct output.
* Missing SBA returns cannot-calculate result.
* Missing base rate returns cannot-calculate result.
* Zero is not confused with missing.

---

## 6.2 Floor Rise Premium Test

Formula:

```text
Floor Rise Premium = SBA × Floor Rise Rate × Chargeable Floors
```

Test cases:

```text
SBA = 1800
Floor = 10
Start Floor = 4
Rate = 30
Mode = Inclusive
Expected chargeable floors = 7
Expected premium = 3,78,000
```

```text
SBA = 1800
Floor = 10
Start Floor = 4
Rate = 30
Mode = Above Baseline
Expected chargeable floors = 6
Expected premium = 3,24,000
```

Acceptance:

* Supports inclusive and above-baseline modes.
* Missing floor number creates warning.
* Manual override is respected.

---

## 6.3 Agreement Value Test

Formula:

```text
Agreement Value =
Basic Flat Cost
+ Parking
+ Amenities
+ Infrastructure
+ BWSSB
+ BESCOM
+ Power Backup
+ EV
+ PLC
+ Floor Rise
+ Other Core Charges
```

Acceptance:

* Adds all separate cost components.
* Treats missing numeric values safely.
* Does not add costs marked “Included” unless amount is separately provided.
* Does not add “Unknown” as meaningful value.
* Produces warning if critical cost fields are unknown.

---

## 6.4 GST Test

Formula:

```text
GST = GST Base × GST %
```

Test cases:

```text
Agreement Value = 1,50,00,000
GST = 5%
Expected GST = 7,50,000
```

Acceptance:

* Uses unit-specific GST if present.
* Uses settings default if unit-specific GST missing.
* GST included treatment does not double count.
* GST unknown shows warning.
* GST not applicable returns zero with correct treatment.

---

## 6.5 TDS Test

Formula:

```text
TDS = TDS Base × TDS %
```

Acceptance:

* Calculates TDS correctly.
* Shows TDS separately from additive total cost.
* Does not add TDS into Total Landing Cost by default.
* Includes TDS in payment milestone cash-flow view.

---

## 6.6 Stamp Duty and Registration Test

Test:

```text
Agreement Value = 1,50,00,000
Stamp Duty = 5%
Registration = 1%
Expected Stamp Duty = 7,50,000
Expected Registration = 1,50,000
Expected Combined = 9,00,000
```

Acceptance:

* Stamp duty and registration are separate rows.
* Uses settings defaults.
* Allows manual override.
* Does not hardcode rates permanently.
* Can use alternate registration base if entered.

---

## 6.7 Total Statutory Charges Test

Formula:

```text
Total Statutory Charges =
GST
+ Stamp Duty
+ Registration
+ Agreement Registration
+ Franking / E-Stamping
+ Khata Transfer
+ Mutation
+ Cess / Surcharge
+ Other Government Charges
```

Acceptance:

* Adds all applicable charges.
* Excludes TDS by default from additive cost.
* Handles missing optional fields safely.
* Flags missing critical statutory assumptions.

---

## 6.8 Total Sunk Acquisition Cost Test

Formula:

```text
Total Sunk Acquisition Cost =
Agreement Value
+ GST
+ Stamp Duty
+ Registration
+ Agreement Registration
+ Franking
+ Legal Documentation
+ Khata / Mutation
+ Other Government Charges
```

Acceptance:

* Correct sum.
* Legal/documentation charges included.
* Bank loan setup charges excluded unless setting says include.
* Missing fields create warnings.

---

## 6.9 Advance Maintenance Test

Formula:

```text
Advance Maintenance =
SBA × Maintenance Rate per Sq.Ft per Month × Tenure Months
```

Test:

```text
SBA = 1800
Rate = ₹4
Tenure = 24 months
Expected = 1,72,800
```

Alternative:

```text
Maintenance = ₹96 per sq.ft for 2 years
SBA = 1800
Expected = 1,72,800
```

Acceptance:

* Supports monthly rate × tenure.
* Supports lump sum.
* Supports per-sq.ft total maintenance.
* Adds maintenance GST if applicable.

---

## 6.10 Total Landing Cost Test

Formula:

```text
Total Landing Cost =
Total Sunk Acquisition Cost
+ Total Possession Sunk Cost
+ Total Post-Possession Budget
```

Acceptance:

* Correct sum.
* Interior budget included.
* Possession charges included.
* Missing interior budget creates warning, not crash.
* Total Landing Cost is shown as the primary practical cost.

---

## 6.11 True SBA Cost Test

Formula:

```text
True Cost per SBA Sq.Ft =
Total Landing Cost / SBA
```

Acceptance:

* Correct calculation.
* Missing SBA shows “Data Missing”.
* SBA zero does not create divide-by-zero error.

---

## 6.12 True Carpet Cost Test

Formula:

```text
True Cost per Carpet Sq.Ft =
Total Landing Cost / RERA Carpet Area
```

Acceptance:

* Correct calculation.
* Missing carpet area shows “Carpet Area Missing”.
* Carpet zero does not create divide-by-zero error.
* True carpet cost appears prominently in comparison.

---

## 6.13 RERA Efficiency Test

Formula:

```text
RERA Efficiency =
Carpet Area / SBA
```

Acceptance:

* Correct percentage.
* Missing carpet or SBA shows missing.
* Efficiency is displayed as percentage.
* Highest efficiency can be highlighted in comparison.

---

## 6.14 Hidden Cost Percentage Test

Formula:

```text
Hidden Cost % =
(Total Landing Cost - Basic Flat Cost) / Basic Flat Cost
```

Acceptance:

* Correct percentage.
* Missing basic flat cost shows cannot calculate.
* Hidden cost risk bands work.
* Top contributors are shown.

---

## 6.15 EMI Test

Formula:

```text
EMI =
P × r × (1 + r)^n / ((1 + r)^n - 1)
```

Acceptance:

* EMI calculates correctly.
* Zero interest case handled.
* Missing loan amount/interest/tenure shows clear error.
* Monthly interest conversion is correct.

---

## 6.16 Rental Yield Test

Formulas:

```text
Gross Rental Yield = Annual Rent / Total Landing Cost
Net Rental Yield = Net Annual Rental Income / Total Landing Cost
```

Acceptance:

* Gross yield works.
* Net yield deducts maintenance/property tax/vacancy.
* Missing rent shows missing.
* Rental yield is not shown as confident if rent is only an estimate.

---

# 7. Payment Milestone Tests

## 7.1 Milestone Percentage Test

Check:

```text
Sum of milestone percentages = 100%
```

Acceptance:

* If total is 100%, no warning.
* If total is less than 100%, warning.
* If total is more than 100%, warning.

## 7.2 Milestone Amount Test

Formula:

```text
Milestone Amount = Agreement Value × Milestone %
```

Acceptance:

* Correct amount.
* GST and TDS calculated separately.
* Own contribution and loan disbursement calculated.
* Missing agreement value shows warning.

## 7.3 Payment Status Test

Statuses:

```text
Upcoming
Due
Paid
Overdue
Not Applicable
Unknown
```

Acceptance:

* Overdue status works when due date has passed and unpaid.
* Paid milestone shows receipt status.
* Payment summary totals paid/pending correctly.

---

# 8. Scoring Tests

Core scoring file:

```text
/src/lib/scoring.ts
```

## 8.1 Living Score Test

Acceptance:

* Living Score calculated separately from Investment Score.
* Uses configured weights.
* Missing non-critical values reduce confidence.
* Critical risk caps recommendation.
* Output includes positive and negative contributors.

## 8.2 Investment Score Test

Acceptance:

* Investment Score calculated separately.
* Rental yield affects score.
* Entry price affects score.
* Hidden cost affects score.
* Possession timeline affects score.
* Maintenance burden affects score.

## 8.3 Risk Level Test

Acceptance:

* Any critical risk creates Critical overall risk.
* One high risk creates High overall risk.
* Multiple medium risks create Medium risk.
* Low risk shown when no major issues exist.

## 8.4 Recommendation Test

Acceptance:

* Strong score without critical risk can show Strong Shortlist.
* High score with RERA missing does not show Strong Shortlist.
* Parking unknown caps recommendation to Revisit.
* Data completeness below threshold caps recommendation.
* Manual recommendation override works and stores reason.

## 8.5 Score Confidence Test

Acceptance:

* High completeness gives High confidence.
* Estimated values reduce confidence.
* Missing critical fields reduce confidence.
* Score explanation shows missing inputs.

---

# 9. Data Completeness Tests

Core file:

```text
/src/lib/completeness.ts
```

## 9.1 Project Completeness

Test categories:

* Project identity
* Location
* Legal/RERA
* Amenities
* Site visit
* Documents

Acceptance:

* Completeness score calculates correctly.
* Missing critical fields are listed.
* Section-level breakdown works.

## 9.2 Unit Completeness

Test categories:

* Unit details
* Space
* Cost
* Parking
* Financial
* Investment
* Living suitability

Acceptance:

* Missing carpet area flagged.
* Missing parking flagged.
* Missing GST/registration flagged.
* Missing maintenance/corpus flagged.
* Missing final cost sheet flagged.

---

# 10. Validation Tests

Core schema files:

```text
/src/schemas/project-schema.ts
/src/schemas/unit-schema.ts
/src/schemas/project-pack-schema.ts
/src/schemas/settings-schema.ts
```

## 10.1 Project Creation Validation

Required fields:

```text
Project Name
Builder Name
City
City Zone
Purpose Tag
Status
```

Acceptance:

* Project cannot be created without required fields.
* Optional fields can be missing.
* Invalid enum values rejected.
* Valid partial project accepted.

## 10.2 Unit Creation Validation

Required fields:

```text
Project ID
BHK Configuration
SBA or approximate SBA
```

Acceptance:

* Unit cannot exist without project reference.
* Unit allows missing carpet area.
* Unit allows missing cost details initially.
* Invalid numeric values rejected.

## 10.3 Project Pack Validation

Acceptance:

* Valid Project Pack imports.
* Invalid Project Pack shows errors.
* Unsupported version shows warning.
* Missing required collections handled safely.
* Invalid enum values reported.

## 10.4 Settings Validation

Acceptance:

* Percentages must be valid numbers.
* Loan tenure must be positive.
* Interior budgets must be non-negative.
* Scoring weights must be valid numbers.

---

# 11. Store and Persistence Tests

Core store:

```text
/src/store/real-estate-store.ts
```

## 11.1 Project Store Tests

Acceptance:

* Add project works.
* Update project works.
* Delete project works.
* Deleting project handles linked units/follow-ups safely.
* Project persists after reload.

## 11.2 Unit Store Tests

Acceptance:

* Add unit under project works.
* Update unit works.
* Delete unit works.
* Select unit for comparison works.
* Remove unit from comparison works.
* Selected unit IDs persist.

## 11.3 Site Visit Store Tests

Acceptance:

* Add site visit works.
* Update checklist item works.
* Site visit can create follow-up.
* Visit summary can be generated.
* Visit persists after reload.

## 11.4 Follow-Up Store Tests

Acceptance:

* Add follow-up works.
* Update follow-up works.
* Close follow-up works.
* Overdue status works.
* Critical follow-ups appear on dashboard.

## 11.5 Document Store Tests

Acceptance:

* Add document record works.
* Update review status works.
* Documents link to project/unit.
* Document metadata persists.

## 11.6 Payment Store Tests

Acceptance:

* Add milestone works.
* Update milestone works.
* Payment totals recalculate.
* Receipt status persists.

---

# 12. Import / Export QA

## 12.1 JSON Export Test

Acceptance:

* Export includes all projects.
* Export includes all units.
* Export includes site visits.
* Export includes follow-ups.
* Export includes documents metadata.
* Export includes payment milestones.
* Export includes settings.
* Export includes Project Pack version.
* Exported JSON can be re-imported.

## 12.2 JSON Import Test

Acceptance:

* Valid JSON imports.
* Invalid JSON fails gracefully.
* Schema errors shown clearly.
* User can choose merge/replace/cancel.
* Existing verified data is not overwritten without confirmation.
* Import summary is shown.

## 12.3 CSV Export Test

Acceptance:

* Master comparison CSV exports.
* Follow-ups CSV exports.
* Payment milestones CSV exports.
* Currency values export as numbers or clearly formatted strings.
* Missing data exports as blank or “Data Missing”, consistently.

---

# 13. Component QA

## 13.1 MoneyValue

Acceptance:

* Displays INR in Indian format.
* Handles compact mode.
* Missing value shows Data Missing.
* Does not show `NaN`.
* Does not show `₹0` for unknown.

## 13.2 AreaValue

Acceptance:

* Displays sq.ft correctly.
* Missing value shows configured label.
* Zero handled safely.

## 13.3 StatusBadge

Acceptance:

* All statuses render.
* Unknown status has safe fallback.
* Text is readable.

## 13.4 RiskBadge

Acceptance:

* Low, Medium, High, Critical, Unknown render correctly.
* Badge includes text, not only color.

## 13.5 DataMissingBadge

Acceptance:

* Warning and critical states render distinctly.
* Text is readable.

## 13.6 ProjectCard

Acceptance:

* Shows project identity.
* Shows status and risk.
* Handles missing starting cost.
* Opens project page.

## 13.7 UnitCard

Acceptance:

* Shows unit details.
* Handles missing carpet/cost.
* Compare toggle works.
* Parking status visible.

## 13.8 FollowUpCard

Acceptance:

* Shows task, priority, owner, due date.
* Critical/overdue visible.
* Close action works.

---

# 14. Page-Level QA

## 14.1 Dashboard Page

Acceptance:

* KPI cards load.
* Active project count correct.
* Selected units table works.
* Missing data alerts visible.
* Risk alerts visible.
* Follow-ups visible.
* Recommended next actions visible.
* No crash with empty store.

## 14.2 Projects Page

Acceptance:

* Projects listed.
* Filters work.
* Search works.
* Add project works.
* Edit project works.
* Status/risk badges visible.
* Empty state works.

## 14.3 Project Detail Page

Acceptance:

* Project header visible.
* Tabs/sections load.
* Units shown.
* Costs shown.
* Parking shown separately.
* Legal/RERA shown.
* Follow-ups shown.
* Documents shown.
* Missing data visible.

## 14.4 Compare Page

Acceptance:

* User can select units.
* Side-by-side comparison works.
* Best/worst values highlighted.
* Missing data shown.
* Horizontal scroll works on desktop/tablet.
* Mobile section comparison works or degrades gracefully.

## 14.5 Site Visit Page

Acceptance:

* Site visit can be created.
* Default checklist appears.
* Checklist statuses update.
* Notes save.
* Follow-ups can be created.
* Visit summary works.
* Mobile usability is acceptable.

## 14.6 Map Page

Acceptance:

* Projects with coordinates appear.
* Projects without coordinates appear in fallback list.
* Current residence marker appears if configured.
* Workplace marker appears if configured.
* Radius circles work.
* Filters work.
* Popup card opens project.

## 14.7 Financials Page

Acceptance:

* Total landing cost shown.
* Cost breakdown shown.
* Hidden cost shown.
* EMI shown.
* Rental yield shown.
* Missing financial inputs shown clearly.

## 14.8 Follow-Ups Page

Acceptance:

* Follow-ups listed.
* Filters work.
* Priority visible.
* Status update works.
* Closed tasks move correctly.

## 14.9 Documents Page

Acceptance:

* Documents listed.
* Status and review state visible.
* Add/edit document record works.
* Document links/paths display safely.

## 14.10 Settings Page

Acceptance:

* Defaults can be edited.
* Tax/registration assumptions saved.
* Loan assumptions saved.
* Interior budget assumptions saved.
* Scoring weights saved.
* Settings persist after reload.

---

# 15. Responsive QA

Test at:

```text
390px mobile
430px large mobile
768px tablet
1280px laptop
1440px desktop
```

## 15.1 Mobile Acceptance

* Navigation usable.
* Project cards readable.
* Site visit checklist comfortable.
* Forms are single-column.
* No accidental horizontal scroll except intended tables.
* Tap targets are large enough.
* Follow-ups use cards.
* Map has bottom sheet/list fallback.

## 15.2 Tablet Acceptance

* Dashboard cards in two columns.
* Tables scroll horizontally where needed.
* Forms readable.
* Map usable with collapsible side panel.

## 15.3 Desktop Acceptance

* Sidebar visible.
* Dashboard uses multi-column layout.
* Comparison table uses wide layout.
* Project detail tabs visible.
* Financial charts and tables readable.

---

# 16. Accessibility QA

## 16.1 Form Accessibility

Acceptance:

* Every input has visible label.
* Error messages are clear.
* Required fields identified.
* Keyboard navigation works.
* Focus state visible.

## 16.2 Button Accessibility

Acceptance:

* Buttons have accessible names.
* Icon-only buttons have labels.
* Destructive actions confirm.

## 16.3 Table Accessibility

Acceptance:

* Tables have headers.
* Important tables have captions or section titles.
* Row actions are keyboard reachable.

## 16.4 Color Accessibility

Acceptance:

* Risk does not rely only on color.
* Missing data does not rely only on color.
* Badge text readable.
* Important values have sufficient contrast.

## 16.5 Map and Chart Accessibility

Acceptance:

* Map data also available in list/table.
* Chart data also available in summary/table.
* Tooltips not required to understand core data.

---

# 17. Manual QA With Seed Projects

Use the seed projects:

```text
The Earthscape
DSR Courtyard
Myhna Orchid
DSR The Address
Sanjeevini Adwaith / The Adwaith
```

## 17.1 Seed Data QA

Acceptance:

* All seed projects load.
* Each project has a detail page.
* Known costs display.
* Missing fields are flagged.
* User can edit seed data.
* User can add units.
* User can select units for comparison.

## 17.2 Financial QA With Seed Data

Acceptance:

* DSR Courtyard-style maintenance formula works.
* The Adwaith-style per-sq.ft maintenance formula works.
* The Earthscape payment milestone total validates to 100%.
* Floor rise rules can be represented.
* Parking included/unknown states visible.

---

# 18. Regression QA Checklist

Before every release or major feature merge, check:

```text
App builds
Dashboard loads
Projects load
Project detail opens
Unit comparison works
Total landing cost works
True carpet cost handles missing carpet
Site visit checklist saves
Follow-ups save
Settings persist
JSON export works
JSON import works
Map does not crash
Mobile site visit page works
```

---

# 19. Bug Severity Definitions

## Critical

Blocks real use or creates misleading decision data.

Examples:

* Wrong total landing cost
* Wrong registration calculation
* App crashes on dashboard
* Missing values shown as zero
* Data loss after reload
* Import overwrites verified data without confirmation

## High

Major workflow issue.

Examples:

* Cannot add project
* Cannot add unit
* Cannot save site visit
* Comparison page broken
* Parking not visible
* Follow-ups not saving

## Medium

Usability or clarity issue.

Examples:

* Bad table alignment
* Filter not working
* Missing tooltip
* Mobile layout awkward
* Chart labels unclear

## Low

Minor polish.

Examples:

* Spacing issue
* Copy improvement
* Icon mismatch
* Minor visual inconsistency

---

# 20. Definition of Done

A feature is done only when:

1. It follows the relevant `/docs` file.
2. It works with seed data.
3. It handles missing data.
4. It does not display misleading zero values.
5. It is responsive enough for its use case.
6. It has clear empty/error states.
7. It has basic accessibility support.
8. It does not break existing flows.
9. It builds without TypeScript errors.
10. It improves actual property decision-making.

---

# 21. Final QA Principle

Testing should protect the user from bad decisions.

A visual bug is inconvenient.
A formula bug can mislead a high-value financial decision.
A missing-data bug can create false confidence.
A persistence bug can lose weeks of property research.

Therefore, the portal should be tested with discipline.

The app is ready only when the user can trust the data, calculations, warnings, and next actions.
