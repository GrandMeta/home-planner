# 12_DESIGN_SYSTEM.md

# Real Estate Decision Portal — Design System

## 1. Purpose of This Document

This document defines the visual design system for the Real Estate Decision Portal.

The portal should look and feel like a clean personal decision cockpit for real estate evaluation. It should not look like a broker website, marketing landing page, or raw spreadsheet.

The design system should guide:

* Colors
* Typography
* Spacing
* Layout
* Cards
* Tables
* Badges
* Forms
* Charts
* Map pins
* Risk indicators
* Missing-data states
* Responsive behavior

The goal is to create a consistent UI that is calm, readable, financially clear, and decision-oriented.

---

## 2. Design System Principles

## 2.1 Clarity Over Decoration

The design should prioritize:

* Readability
* Financial clarity
* Data comparison
* Risk visibility
* Next action visibility

Avoid unnecessary visual effects.

Avoid making the UI look like a property advertisement.

---

## 2.2 Calm and Professional

The design should feel professional and controlled.

Preferred style:

* Light background
* Clean cards
* Subtle borders
* Soft shadows
* Clear typography
* Minimal color usage
* Strong information hierarchy

---

## 2.3 Financial Data Must Be Easy to Scan

Financial values should be highly readable.

Examples:

```text
₹1.83 Cr
₹9,599 / sq.ft
₹14,250 / carpet sq.ft
₹3,00,000 parking
```

Use Indian number formatting.

Right-align currency and numeric values in tables.

---

## 2.4 Risk and Missing Data Must Be Visible

Missing data, risk, and follow-ups must not be hidden.

Use consistent badges and alert states for:

* Data Missing
* To Confirm
* Risk
* Critical Risk
* Legal Review Pending
* Parking Unclear
* Cost Incomplete
* Written Confirmation Required

---

## 2.5 Tables Should Be Powerful but Not Overwhelming

Tables are necessary, but they should be designed carefully.

Use:

* Sticky headers
* Column grouping
* Compact density
* Sort/filter/search
* Horizontal scroll for wide comparisons
* Highlighting for best/worst/missing/risk values

---

# 3. Recommended Technology Alignment

The design system should work well with:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
TanStack Table
Recharts
Leaflet
React Hook Form
Zod
```

Recommended UI approach:

* Use shadcn/ui components where suitable.
* Customize tokens through Tailwind.
* Keep components reusable.
* Avoid inline one-off styling where possible.
* Use consistent class patterns.

---

# 4. Color System

## 4.1 Base Palette

Use a light, neutral dashboard palette.

| Token            | Usage                     | Suggested Value |
| ---------------- | ------------------------- | --------------- |
| `background`     | Main app background       | `#F8FAFC`       |
| `surface`        | Cards, panels             | `#FFFFFF`       |
| `surface-muted`  | Subtle section background | `#F1F5F9`       |
| `border`         | Card/table borders        | `#E2E8F0`       |
| `border-strong`  | Emphasis border           | `#CBD5E1`       |
| `text-primary`   | Main text                 | `#0F172A`       |
| `text-secondary` | Secondary text            | `#475569`       |
| `text-muted`     | Muted labels              | `#64748B`       |
| `text-disabled`  | Disabled text             | `#94A3B8`       |

## 4.2 Brand / Primary Color

Use a restrained professional blue.

| Token           | Usage                       | Suggested Value |
| --------------- | --------------------------- | --------------- |
| `primary`       | Primary buttons, active nav | `#2563EB`       |
| `primary-hover` | Hover state                 | `#1D4ED8`       |
| `primary-light` | Light background            | `#DBEAFE`       |
| `primary-text`  | Text on primary             | `#FFFFFF`       |

## 4.3 Financial Positive / Negative Colors

Use colors carefully.

| Token            | Usage                            | Suggested Value |
| ---------------- | -------------------------------- | --------------- |
| `positive`       | Good value, verified, complete   | `#16A34A`       |
| `positive-light` | Positive badge background        | `#DCFCE7`       |
| `warning`        | Needs attention                  | `#D97706`       |
| `warning-light`  | Warning badge background         | `#FEF3C7`       |
| `danger`         | High risk, missing critical data | `#DC2626`       |
| `danger-light`   | Danger badge background          | `#FEE2E2`       |
| `info`           | Neutral information              | `#0284C7`       |
| `info-light`     | Info badge background            | `#E0F2FE`       |

## 4.4 Purpose Colors

Use purpose colors for quick project intent.

| Purpose    | Color Token  |
| ---------- | ------------ |
| Living     | `info`       |
| Investment | `positive`   |
| Both       | `primary`    |
| Undecided  | `text-muted` |

## 4.5 Risk Colors

| Risk Level | Text      | Background |
| ---------- | --------- | ---------- |
| Low        | `#166534` | `#DCFCE7`  |
| Medium     | `#92400E` | `#FEF3C7`  |
| High       | `#991B1B` | `#FEE2E2`  |
| Critical   | `#7F1D1D` | `#FECACA`  |
| Unknown    | `#475569` | `#E2E8F0`  |

## 4.6 Data Confidence Colors

| Confidence           | Suggested Treatment |
| -------------------- | ------------------- |
| Unknown              | Grey badge          |
| User Estimate        | Amber badge         |
| Online Source        | Blue-grey badge     |
| Builder Provided     | Blue badge          |
| Site Visit Confirmed | Teal badge          |
| Written Confirmation | Green badge         |
| Document Verified    | Dark green badge    |
| Legal Verified       | Purple badge        |
| Manual Override      | Orange badge        |

---

# 5. Typography

## 5.1 Font

Use a clean system font stack.

Recommended:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

If Inter is not installed, system font is acceptable.

## 5.2 Type Scale

| Token       | Size | Usage                    |
| ----------- | ---: | ------------------------ |
| `text-xs`   | 12px | Badges, metadata         |
| `text-sm`   | 14px | Table text, field labels |
| `text-base` | 16px | Normal body              |
| `text-lg`   | 18px | Section titles           |
| `text-xl`   | 20px | Card/page subsection     |
| `text-2xl`  | 24px | Page title               |
| `text-3xl`  | 30px | Major dashboard headline |

## 5.3 Font Weights

| Weight | Usage                        |
| ------ | ---------------------------- |
| 400    | Body text                    |
| 500    | Labels, table headers        |
| 600    | Card titles, section headers |
| 700    | Page titles, major KPIs      |

## 5.4 Typography Rules

* Page titles should be clear but not oversized.
* Financial KPIs should use `font-semibold` or `font-bold`.
* Table labels should be small and readable.
* Avoid all-caps except for very small badges.
* Use muted text for helper descriptions and secondary metadata.

---

# 6. Spacing System

Use Tailwind spacing scale consistently.

## 6.1 Page Spacing

| Area                      | Recommended Spacing         |
| ------------------------- | --------------------------- |
| Page container padding    | `p-6` desktop, `p-4` mobile |
| Section gap               | `gap-6`                     |
| Card internal padding     | `p-4` or `p-5`              |
| Dense table cell padding  | `px-3 py-2`                 |
| Normal table cell padding | `px-4 py-3`                 |

## 6.2 Layout Width

* Main dashboard should use full available width.
* Project details can use full width with tabs.
* Forms should use max-width where appropriate for readability.
* Comparison tables should allow horizontal scroll.

---

# 7. Border Radius and Shadows

## 7.1 Radius

| Token          | Usage                         |
| -------------- | ----------------------------- |
| `rounded-md`   | Inputs, small buttons         |
| `rounded-lg`   | Cards, panels                 |
| `rounded-xl`   | KPI cards, dashboard sections |
| `rounded-full` | Badges, pills                 |

## 7.2 Shadows

Use subtle shadows only.

| Token               | Usage                                    |
| ------------------- | ---------------------------------------- |
| `shadow-sm`         | Cards                                    |
| `shadow`            | Floating panels                          |
| Avoid heavy shadows | Do not use strong marketing-card shadows |

Cards should mostly rely on border + subtle shadow.

---

# 8. Layout System

## 8.1 App Shell

Desktop layout:

```text
Sidebar Navigation | Main Content Area
```

Suggested dimensions:

* Sidebar width: 240px to 280px
* Main content: fluid
* Top page header inside main area

Mobile layout:

```text
Top Header
Main Content
Bottom Navigation or Collapsed Menu
```

## 8.2 Page Header

Every page should have a consistent header.

Page header includes:

* Page title
* Short description
* Primary action button
* Optional secondary actions
* Optional filter/search controls

Example:

```text
Projects
Track, compare, and manage all real estate projects.

[Add Project] [Import Project Pack]
```

## 8.3 Dashboard Grid

Use responsive grid.

Suggested:

```text
Desktop: 4 KPI cards per row
Tablet: 2 KPI cards per row
Mobile: 1 card per row
```

## 8.4 Content Sections

Use section cards with:

* Section title
* Optional description
* Main content
* Empty state if no data

---

# 9. Card System

## 9.1 Base Card

Base card style:

```text
Background: white
Border: slate-200
Radius: xl
Shadow: sm
Padding: 4 or 5
```

## 9.2 KPI Card

KPI card should contain:

* Small label
* Large value
* Subtext
* Optional badge
* Optional icon

Example:

```text
Total Landing Cost
₹1.83 Cr
Includes registration + interiors
```

## 9.3 Project Card

Project card should contain:

* Project name
* Builder
* Area / micro-market
* Status badge
* Purpose badge
* Starting cost
* BHK options
* Risk badge
* Missing data count
* Next action

## 9.4 Unit Card

Unit card should contain:

* BHK
* Tower/floor/facing
* SBA and carpet
* RERA efficiency
* Total landing cost
* True carpet cost
* Parking status
* Living score
* Investment score
* Action: Compare / Shortlist / Open

## 9.5 Alert Card

Alert cards should be used for:

* Critical missing data
* High risk
* Overdue follow-up
* Legal review pending
* Parking unclear

Alert card should include:

* Severity
* Project/unit
* Description
* Next action

---

# 10. Badge System

## 10.1 Badge Shape

Use pill-shaped badges:

```text
rounded-full
px-2.5
py-0.5
text-xs
font-medium
```

## 10.2 Status Badges

| Status             | Suggested Style |
| ------------------ | --------------- |
| New Lead           | Grey            |
| Data Pending       | Amber           |
| Site Visit Planned | Blue            |
| Site Visited       | Teal            |
| Under Comparison   | Indigo          |
| Shortlisted        | Green           |
| Strong Shortlist   | Dark green      |
| Negotiation        | Purple          |
| Booking Ready      | Blue-green      |
| Rejected           | Red             |
| On Hold            | Grey            |

## 10.3 Risk Badges

Use the risk color system from Section 4.5.

## 10.4 Missing Data Badges

Examples:

```text
Carpet Missing
Parking Unknown
GST Unknown
RERA Missing
Registration Missing
Maintenance Missing
```

Style:

* Amber for important missing data
* Red for critical missing data

## 10.5 Verification Badges

Examples:

```text
Builder Provided
Site Visit Confirmed
Written Confirmation
Document Verified
Legal Verified
```

Style should use confidence colors.

---

# 11. Button System

## 11.1 Button Types

| Type        | Usage                       |
| ----------- | --------------------------- |
| Primary     | Main page action            |
| Secondary   | Supporting action           |
| Ghost       | Low-priority action         |
| Destructive | Delete/reject               |
| Outline     | Filters, secondary controls |

## 11.2 Button Examples

Primary:

```text
Add Project
Add Unit
Create Site Visit
Import Project Pack
```

Secondary:

```text
Export
Save Draft
Duplicate Unit
Add Follow-Up
```

Destructive:

```text
Delete Project
Reject Unit
Clear Data
```

## 11.3 Button Rules

* Only one primary button per section when possible.
* Destructive actions must require confirmation.
* Avoid using too many buttons in a table row; use row menu if needed.

---

# 12. Form System

## 12.1 Form Layout

Use grouped sections.

Project form sections:

```text
Project Basics
Builder Details
Location
RERA / Legal
Amenities
Notes
```

Unit form sections:

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

Site visit form sections:

```text
Visit Header
Checklist Sections
Documents
Follow-Ups
Final Outcome
```

## 12.2 Input Style

Inputs should be:

* Clear label
* Optional helper text
* Error message if invalid
* Source/confidence selector for important fields
* Notes field for important sections

## 12.3 Required Fields

Use minimal required fields.

Project creation required:

```text
Project Name
Builder Name
City
City Zone
Purpose Tag
Status
```

Unit creation required:

```text
Project
BHK Configuration
SBA or approximate SBA
```

## 12.4 Progressive Save

Forms should allow:

* Save draft
* Continue later
* Partial completion
* Missing field summary

Do not force all details in one sitting.

---

# 13. Table System

## 13.1 Table Types

The portal will use several table types:

1. Project list table
2. Unit list table
3. Master comparison table
4. Cost breakup table
5. Follow-up table
6. Document table
7. Payment milestone table
8. Site visit checklist table
9. Unit comparison matrix

## 13.2 Table Base Style

Use:

```text
White background
Subtle border
Sticky header
Small readable text
Alternating row hover
Clear column grouping
```

## 13.3 Numeric Alignment

| Data Type  | Alignment      |
| ---------- | -------------- |
| Currency   | Right          |
| Percent    | Right          |
| Sq.Ft      | Right          |
| Scores     | Center         |
| Badges     | Center         |
| Names/text | Left           |
| Dates      | Left or center |

## 13.4 Table Highlighting

Highlight:

* Lowest total landing cost
* Lowest true carpet cost
* Highest carpet efficiency
* Highest living score
* Highest investment score
* Missing data
* High risk
* Manual override

## 13.5 Sticky Columns

For wide comparison tables:

* Freeze project/unit name column.
* Keep headers sticky.
* Allow horizontal scroll.

---

# 14. Chart System

## 14.1 Chart Style

Charts should be simple and readable.

Use Recharts.

Avoid over-designed charts.

## 14.2 Required Chart Types

| Chart                | Usage                            |
| -------------------- | -------------------------------- |
| Bar Chart            | Total landing cost comparison    |
| Bar Chart            | True carpet cost comparison      |
| Stacked Bar          | Cost component comparison        |
| Waterfall-like Chart | Builder quote to landing cost    |
| Scatter Plot         | Living vs investment matrix      |
| Line/Area Chart      | Payment cash flow over time      |
| Donut/Pie            | Cost composition, only if useful |

## 14.3 Chart Rules

* Always show values or tooltips.
* Use INR formatting for currency.
* Avoid too many colors.
* Use consistent colors for cost categories.
* Missing data should be shown clearly.

## 14.4 Cost Category Colors

Suggested:

| Cost Category            | Color Intent |
| ------------------------ | ------------ |
| Basic Flat Cost          | Primary blue |
| Parking                  | Teal         |
| Amenities/Infrastructure | Indigo       |
| GST                      | Amber        |
| Stamp Duty/Registration  | Orange       |
| Corpus/Maintenance       | Purple       |
| Interiors                | Green        |
| Other Charges            | Grey         |

---

# 15. Map Marker System

## 15.1 Project Pin States

| State              | Suggested Marker |
| ------------------ | ---------------- |
| New/Data Pending   | Grey             |
| Watchlist          | Amber            |
| Shortlisted        | Blue             |
| Strong Shortlist   | Green            |
| Rejected           | Red              |
| Investment-focused | Purple           |
| Living-focused     | Teal             |

## 15.2 Marker Confidence

| Location Confidence | Treatment                 |
| ------------------- | ------------------------- |
| Confirmed Pin       | Solid marker              |
| Approximate Pin     | Dashed/outlined marker    |
| Missing Coordinates | Fallback list, no map pin |

## 15.3 Special Markers

| Marker                 | Treatment             |
| ---------------------- | --------------------- |
| Current Residence      | Home icon             |
| Primary Workplace      | Office icon           |
| School/Hospital/Family | Optional future icons |

## 15.4 Radius Circles

Radius circles:

```text
3 km
5 km
10 km
15 km
```

Use subtle translucent circles. Do not overpower project pins.

---

# 16. Score Display System

## 16.1 Score Badge

Scores should be shown as:

```text
82 / 100
Good
```

## 16.2 Score Color Bands

|    Score | Label        | Style      |
| -------: | ------------ | ---------- |
|   85–100 | Excellent    | Green      |
|    70–84 | Good         | Blue/green |
|    55–69 | Needs Review | Amber      |
|    40–54 | Weak         | Orange     |
| Below 40 | Poor         | Red        |

## 16.3 Score Cards

Show:

* Living Score
* Investment Score
* Risk Level
* Confidence

Example:

```text
Living Score
82 / 100
Good — Medium Confidence
```

## 16.4 Score Explanation

Every score detail view should show:

* Positive contributors
* Negative contributors
* Missing inputs
* Risk caps
* Manual overrides

---

# 17. Data Missing System

## 17.1 Missing Data Visual Treatment

Use clear, consistent missing indicators.

Examples:

```text
Data Missing
To Confirm
Not Available
Not Applicable
Unknown
```

## 17.2 Missing vs Zero

Do not show unknown numeric values as `₹0`.

Instead:

```text
Data Missing
```

Inside formulas, missing numbers may be treated as zero for safety, but the UI should show missing state.

## 17.3 Critical Missing Data

Use red badge when missing data blocks decision-making.

Critical examples:

* RERA number missing
* Parking inclusion unknown
* Final cost sheet missing
* GST treatment unknown
* Carpet area missing
* Agreement value missing
* Possession date missing

---

# 18. Risk Display System

## 18.1 Risk Card

Risk card should show:

* Risk severity
* Risk category
* Project/unit
* Description
* Why it matters
* Next action
* Owner
* Due date, if follow-up exists

## 18.2 Risk Severity

| Severity | UI Treatment |
| -------- | ------------ |
| Low      | Green subtle |
| Medium   | Amber        |
| High     | Red          |
| Critical | Strong red   |

## 18.3 Risk Iconography

Use simple icons:

* Warning triangle for high/critical risk
* Info icon for unknown
* Check icon for verified
* Clock icon for pending
* Document icon for evidence required

---

# 19. Empty State System

## 19.1 Empty State Structure

Each empty state should include:

* Short title
* Helpful explanation
* Primary action
* Optional secondary action

Example:

```text
No projects added yet
Start by adding your first project or importing a project pack.

[Add Project]
```

## 19.2 Common Empty States

| Page        | Empty State                  |
| ----------- | ---------------------------- |
| Projects    | No projects added            |
| Units       | No units added               |
| Compare     | No units selected            |
| Map         | No projects with coordinates |
| Site Visits | No site visits recorded      |
| Documents   | No documents tracked         |
| Follow-Ups  | No open follow-ups           |
| Payments    | No payment milestones added  |

---

# 20. Loading and Error States

## 20.1 Loading States

Use subtle skeletons for:

* Dashboard cards
* Tables
* Project detail sections
* Charts
* Map

## 20.2 Error States

Use plain-language errors.

Bad:

```text
NaN returned by formula
```

Good:

```text
True carpet cost cannot be calculated because carpet area is missing.
```

## 20.3 Recoverability

Error states should suggest action.

Example:

```text
Add carpet area to calculate true carpet cost.
```

---

# 21. Tooltip System

Tooltips should explain financial and real estate terms.

Required tooltips:

```text
Agreement Value
Total Sunk Acquisition Cost
Total Landing Cost
True Cost per SBA Sq.Ft
True Cost per Carpet Sq.Ft
RERA Efficiency
Hidden Cost %
GST
TDS
Stamp Duty
Registration Fee
Franking / E-Stamping
Khata Transfer
MODT
Corpus Fund
Advance Maintenance
PLC
Floor Rise
Carpet Area
SBA
UDS
```

Tooltips should be short and direct.

Example:

```text
Total Landing Cost: The estimated total cost including agreement value, taxes, registration, possession costs, interiors, and move-in budget.
```

---

# 22. Responsive Design

## 22.1 Desktop

Desktop is primary for:

* Dashboard
* Comparison tables
* Financial analysis
* Map
* Project detail pages

Use wide layouts and multi-column views.

## 22.2 Tablet

Tablet should support:

* Project browsing
* Dashboard review
* Site visit entry
* Basic comparison

## 22.3 Mobile

Mobile is important for:

* Site visit checklist
* Quick project lookup
* Quick notes
* Follow-up creation
* Status update

On mobile:

* Avoid wide tables.
* Use cards.
* Collapse sections.
* Use large tap targets.
* Keep forms short and grouped.

---

# 23. Accessibility Guidelines

## 23.1 Contrast

Text must have sufficient contrast.

Avoid low-contrast grey text for important values.

## 23.2 Keyboard Navigation

Forms, tables, buttons, filters, and dialogs should be keyboard accessible.

## 23.3 Color Independence

Do not rely only on color to communicate state.

For example, a risk badge should include text:

```text
High Risk
```

not just red color.

## 23.4 Form Labels

Every input must have a label.

Placeholder text is not a substitute for labels.

## 23.5 Error Messages

Errors should be tied to fields and written clearly.

---

# 24. Icon System

Use simple line icons.

Recommended icon style:

* Lucide icons
* 16px or 20px
* Consistent stroke width
* Minimal decorative use

Common icons:

| Icon Use    | Example              |
| ----------- | -------------------- |
| Dashboard   | Layout/dashboard     |
| Projects    | Building             |
| Compare     | Columns              |
| Map         | Map pin              |
| Site Visits | Clipboard check      |
| Financials  | Indian rupee / chart |
| Payments    | Calendar / wallet    |
| Documents   | File text            |
| Follow-Ups  | Check circle         |
| Settings    | Gear                 |
| Risk        | Alert triangle       |
| Verified    | Check circle         |
| Missing     | Circle alert         |
| Parking     | Car                  |
| Legal       | Scale / file check   |

---

# 25. Motion and Interaction

Use minimal motion.

Allowed:

* Smooth accordion open/close
* Tab transitions
* Hover states
* Loading skeletons
* Toast confirmations

Avoid:

* Large animations
* Marketing motion
* Distracting transitions
* Animated numbers everywhere

---

# 26. Toast and Notification System

Use toast messages for quick feedback.

Examples:

```text
Project saved.
Unit added to comparison.
Follow-up created.
JSON import completed with 3 warnings.
Parking details updated.
```

Error toast example:

```text
Import failed. Please check the JSON format.
```

---

# 27. Confirmation Dialogs

Use confirmation dialogs for important actions.

Required for:

* Delete project
* Delete unit
* Reject project
* Overwrite verified data
* Import data over existing project
* Clear local data
* Close critical follow-up without evidence

Dialog should clearly state consequence.

Example:

```text
Reject this project?
You can move it back to Watchlist later, but it will be removed from active comparison.
```

---

# 28. Design Tokens Summary

Recommended token names:

```text
--color-background
--color-surface
--color-surface-muted
--color-border
--color-text-primary
--color-text-secondary
--color-text-muted
--color-primary
--color-positive
--color-warning
--color-danger
--radius-card
--radius-button
--shadow-card
--spacing-page
--spacing-section
```

Tailwind should map to these through theme configuration where practical.

---

# 29. Implementation Notes for Codex

When implementing UI:

1. Use reusable components.
2. Do not hardcode colors repeatedly.
3. Use design tokens or Tailwind semantic classes.
4. Keep cards, tables, badges, and forms consistent.
5. Use Indian currency formatting.
6. Do not show missing financial values as zero.
7. Use badges for status, risk, and confidence.
8. Use tooltips for financial terms.
9. Build desktop-first but ensure site visit pages work on mobile.
10. Avoid overly decorative UI.
11. Keep dashboard visual hierarchy clean.
12. Make next actions visible.
13. Make calculations explainable.
14. Separate living and investment scores visually.

---

# 30. Design Acceptance Criteria

The design system is correctly applied when:

1. The app looks consistent across all pages.
2. Dashboard cards use the same visual language.
3. Tables are readable and scannable.
4. Financial values are formatted correctly.
5. Missing data is clearly visible.
6. Risk states are clearly visible.
7. Parking has visible dedicated treatment.
8. Forms are grouped and not overwhelming.
9. Scores are easy to understand.
10. Map markers and statuses are visually distinct.
11. Site visit checklist is usable on mobile.
12. The UI feels like a real estate decision cockpit, not an Excel clone.

---

# 31. Final Design System Principle

The design system should make complex real estate data feel controlled.

The user should always know:

* What this project costs
* What is missing
* What is risky
* What is verified
* What is pending
* What should be done next

Good design in this portal means better decisions, not just better visuals.