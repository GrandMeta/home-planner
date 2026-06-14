# 16_RESPONSIVE_AND_ACCESSIBILITY_GUIDELINES.md

# Real Estate Decision Portal — Responsive and Accessibility Guidelines

## 1. Purpose of This Document

This document defines responsive design and accessibility guidelines for the Real Estate Decision Portal.

The portal will be used in two very different contexts:

1. **Desktop / laptop** — for deep comparison, financial analysis, dashboards, map review, and family discussion.
2. **Mobile / tablet** — for site visits, quick notes, follow-ups, project lookup, and checklist updates.

The application must be desktop-first for analysis, but mobile-capable for real-world site visit usage.

The portal should remain usable, readable, and stable across:

* Desktop
* Laptop
* Tablet
* Mobile browser
* Large external display

---

## 2. Core Responsive Philosophy

The application should follow this principle:

> Desktop is for decision analysis. Mobile is for field capture.

Desktop should prioritize:

* Wide dashboards
* Comparison tables
* Financial charts
* Map analysis
* Project detail review
* Export and reporting

Mobile should prioritize:

* Site visit checklist
* Quick project lookup
* Quick notes
* Follow-up creation
* Status update
* Document/reference capture
* Simple project/unit review

Do not force desktop-style wide comparison tables onto mobile.

---

# 3. Breakpoint Strategy

Use Tailwind-compatible breakpoints.

Recommended breakpoints:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## 3.1 Mobile

```text
< 768px
```

Use for:

* Site visit checklist
* Card-based project lists
* Collapsed filters
* Single-column forms
* Simplified navigation

## 3.2 Tablet

```text
768px to 1023px
```

Use for:

* Two-column layouts where possible
* Project cards
* Basic dashboard review
* Site visit capture
* Map with collapsible side panel

## 3.3 Desktop

```text
1024px and above
```

Use for:

* Sidebar navigation
* Multi-column dashboards
* Wide tables
* Comparison matrices
* Charts
* Map + side panel

## 3.4 Large Desktop

```text
1280px and above
```

Use for:

* 4-card dashboard rows
* Full-width comparison tables
* Multi-panel financial analysis
* Split-screen map and project cards

---

# 4. App Shell Responsiveness

## 4.1 Desktop App Shell

Desktop layout:

```text
Sidebar Navigation | Main Content
```

Recommended:

* Sidebar width: 240px to 280px
* Main content full width
* Page padding: 24px
* Section gap: 24px

Sidebar should show:

* Dashboard
* Projects
* Compare
* Map
* Site Visits
* Financials
* Payments
* Documents
* Follow-Ups
* Settings

## 4.2 Tablet App Shell

Tablet layout:

```text
Compact Sidebar or Top Navigation
Main Content
```

Recommended:

* Sidebar may collapse to icons.
* Page padding: 16px to 20px.
* Tables should scroll horizontally.
* Forms should become one or two columns depending on width.

## 4.3 Mobile App Shell

Mobile layout:

```text
Top Header
Main Content
Bottom Navigation or Menu Drawer
```

Recommended primary mobile navigation:

```text
Dashboard
Projects
Site Visits
Follow-Ups
More
```

The “More” menu can contain:

```text
Compare
Map
Financials
Payments
Documents
Settings
```

---

# 5. Page-Level Responsive Behavior

## 5.1 Dashboard

### Desktop

Dashboard should show:

* KPI cards in 4-column grid
* Selected units table
* Charts
* Risk/missing/follow-up panels in multiple columns

### Tablet

Dashboard should show:

* KPI cards in 2-column grid
* Tables with horizontal scroll
* Charts stacked vertically
* Risk/follow-up panels stacked

### Mobile

Dashboard should show:

* KPI cards in single column
* Top 3 active alerts
* Top 3 follow-ups
* Simplified shortlist cards
* Link to full comparison instead of wide table

Mobile dashboard should not show dense comparison tables by default.

---

## 5.2 Projects Page

### Desktop

Use table view by default.

Columns:

* Project
* Builder
* Area
* Zone
* Purpose
* BHK
* Starting cost
* Status
* Risk
* Next action

### Tablet

Allow table or card toggle.

### Mobile

Use project cards.

Each mobile project card should show:

* Project name
* Builder
* Area
* Status
* Risk
* Starting cost
* Next action

Avoid showing too many columns on mobile.

---

## 5.3 Project Detail Page

### Desktop

Use:

* Project header
* Score cards
* Tabs
* Two-column sections where useful

### Tablet

Use:

* Project header
* Tabs or horizontal scroll tabs
* Single/two-column mixed layout

### Mobile

Use:

* Sticky compact project header if useful
* Accordion sections instead of wide tabs
* Cards instead of tables
* Quick action buttons

Mobile project detail sections:

```text
Overview
Units
Costs
Parking
Legal
Location
Site Visits
Follow-Ups
Documents
```

---

## 5.4 Compare Units Page

### Desktop

Use wide comparison matrix.

Features:

* Sticky first column
* Sticky header
* Horizontal scroll
* Grouped rows
* Highlight best/worst values

### Tablet

Use horizontal scroll table.

### Mobile

Do not force a wide table as the primary experience.

Use:

* Unit comparison cards
* One section at a time
* “Compare Cost”
* “Compare Parking”
* “Compare Location”
* “Compare Scores”

Mobile comparison should allow selecting two units and comparing them section by section.

---

## 5.5 Map Page

### Desktop

Use split view:

```text
Map | Project Side Panel
```

Map should occupy majority of screen.

### Tablet

Use:

```text
Map
Collapsible project list
```

### Mobile

Use:

```text
Map
Bottom sheet project card
```

Mobile map should support:

* Tap marker
* Open bottom sheet
* Open project
* Show location summary

Filters should be collapsed into a drawer.

---

## 5.6 Site Visit Checklist Page

This is the most important mobile page.

### Desktop

Can show:

* Visit header
* Checklist in sections
* Follow-up panel
* Visit summary

### Mobile

Must show:

* Large tap targets
* Collapsible checklist sections
* Quick status buttons
* Notes input
* Follow-up toggle
* Evidence toggle
* Save button
* Final outcome section

Mobile site visit checklist should avoid dense table layouts.

Recommended mobile checklist item:

```text
[Item Name]
Priority: High
Status: [Not Checked] [Checked] [Follow-up] [Risk] [N/A]
Notes
Follow-up Required toggle
Evidence Required toggle
```

---

## 5.7 Financial Analysis Page

### Desktop

Use:

* Financial KPI cards
* Cost waterfall
* Cost breakdown charts
* EMI section
* Rental yield section
* Detailed tables

### Mobile

Use:

* Financial summary cards
* Expandable cost layers
* Simplified charts
* Key calculations only
* Link to full detail view

Mobile should show:

* Total Landing Cost
* Agreement Value
* Registration + GST
* Interiors
* True Carpet Cost
* EMI
* Hidden Cost %

---

## 5.8 Follow-Ups Page

### Desktop

Use task table.

### Mobile

Use task cards.

Each mobile card should show:

* Task title
* Project
* Priority
* Owner
* Due date
* Status
* Action button

---

## 5.9 Documents Page

### Desktop

Use document table.

### Mobile

Use document cards.

Each mobile card should show:

* Document name
* Project
* Category
* Status
* Review status
* Notes/action

---

# 6. Table Responsiveness

## 6.1 Desktop Tables

Desktop tables should support:

* Sticky headers
* Sticky first column for comparison
* Sort
* Filter
* Search
* Column grouping
* Horizontal scroll where required

## 6.2 Mobile Tables

Avoid wide tables on mobile.

Use card transformation for:

* Project list
* Unit list
* Follow-ups
* Documents
* Payment milestones
* Site visits

## 6.3 Comparison Tables

Comparison tables can horizontally scroll on mobile, but should also have card/section comparison mode.

Recommended mobile comparison pattern:

```text
Select 2 Units
→ Compare Cost
→ Compare Space
→ Compare Parking
→ Compare Legal
→ Compare Location
→ Compare Scores
```

## 6.4 Table Cell Priority

For responsive tables, define priority:

### High Priority

* Project name
* Unit
* Total landing cost
* Status
* Risk
* Next action

### Medium Priority

* Builder
* Area
* BHK
* True carpet cost
* Parking
* Living score
* Investment score

### Low Priority

* Detailed cost components
* Notes
* Secondary dates
* Source/confidence metadata

Low-priority columns can be hidden on smaller screens.

---

# 7. Form Responsiveness

## 7.1 Desktop Forms

Desktop forms can use:

* Two-column grids
* Section cards
* Inline metadata
* Side notes

## 7.2 Mobile Forms

Mobile forms should use:

* Single-column layout
* Clear section headers
* Large inputs
* Sticky save button where useful
* Minimal required fields
* Collapsible optional sections

## 7.3 Field Grouping

Group forms by decision area.

Project form:

```text
Basics
Builder
Location
Legal
Notes
```

Unit form:

```text
Unit
Space
Cost
Parking
Legal
Financial
Notes
```

Site visit form:

```text
Visit Header
Checklist
Documents
Follow-Ups
Outcome
```

## 7.4 Long Forms

Long forms should support:

* Save draft
* Resume later
* Progress indication
* Section completeness
* Missing critical fields summary

---

# 8. Mobile Site Visit UX

## 8.1 Primary Mobile Use Case

During a site visit, the user should be able to:

* Open project quickly.
* Start or continue visit.
* Mark checklist items.
* Add notes.
* Create follow-ups.
* Record quote/cost updates.
* Capture parking/legal questions.
* Record final impression.
* Save summary.

## 8.2 Mobile Checklist Requirements

Checklist sections should be collapsible:

```text
Project Identity
Unit Selection
Financial
Parking
Legal/RERA
Construction
Amenities
Water/Power
Location
Living
Investment
Documents
Follow-Ups
Final Outcome
```

## 8.3 Quick Status Controls

Use large segmented controls:

```text
Not Checked
Checked
Follow-up
Risk
N/A
```

## 8.4 Fast Note Capture

Each checklist item should allow:

* Short note
* Expand full note
* Optional voice/photo reference later

## 8.5 Sticky Bottom Actions

On mobile site visit page, use sticky bottom actions:

```text
Save
Add Follow-Up
Finish Visit
```

## 8.6 Offline Tolerance

Version 1 local-first architecture should allow site visit notes to be captured without backend.

If the browser remains open and local storage works, data should persist locally.

---

# 9. Touch Target Guidelines

All mobile interactive elements should have sufficient size.

Recommended minimum:

```text
44px × 44px
```

Applies to:

* Buttons
* Checklist status controls
* Dropdowns
* Table row actions
* Map markers
* Accordion headers
* Form inputs
* Toggle switches

Spacing between touch targets should avoid accidental taps.

---

# 10. Accessibility Principles

The portal should be accessible enough for real use, even if not certified to a formal compliance level in version 1.

Core principles:

1. Keyboard usable
2. Screen-reader friendly labels
3. Sufficient contrast
4. Color is not the only signal
5. Forms have labels
6. Errors are clear
7. Tables have headers
8. Dialogs manage focus
9. Interactive elements have accessible names
10. Motion is minimal

---

# 11. Keyboard Accessibility

## 11.1 Required Keyboard Support

The user should be able to navigate using keyboard for:

* Navigation menu
* Buttons
* Links
* Forms
* Tabs
* Dialogs
* Dropdowns
* Checkboxes
* Radio buttons
* Accordions

## 11.2 Focus State

Every interactive element must have visible focus state.

Recommended focus style:

```text
2px outline or ring using primary color
```

## 11.3 Tab Order

Tab order should follow visual order.

Avoid hidden focus traps.

## 11.4 Dialog Focus

When dialog opens:

* Focus should move into dialog.
* Escape should close where appropriate.
* Focus should return to triggering element when closed.

---

# 12. Screen Reader Accessibility

## 12.1 Labels

Every form input must have a label.

Bad:

```text
Placeholder only: "Project Name"
```

Good:

```text
Label: Project Name
Input placeholder: Enter project name
```

## 12.2 Buttons

Buttons should have clear names.

Bad:

```text
Icon-only button with no label
```

Good:

```text
Icon button with aria-label="Edit project"
```

## 12.3 Badges

Badges should include text.

Do not rely only on color.

Good:

```text
High Risk
Parking Unknown
Legal Verified
```

## 12.4 Tables

Tables should have:

* Column headers
* Row headers where useful
* Caption/description for complex tables

---

# 13. Color and Contrast

## 13.1 Contrast Rule

Important text should have strong contrast.

Avoid using very light grey for:

* Costs
* Status
* Risk
* Missing data
* Follow-up due dates
* Form labels

## 13.2 Color Independence

Do not communicate risk only through color.

Use both color and text:

```text
High Risk
Critical
Data Missing
Verified
```

## 13.3 Badge Contrast

Ensure badge text is readable on badge background.

---

# 14. Error Accessibility

## 14.1 Form Errors

Form errors should:

* Appear near the field
* Explain the issue clearly
* Be associated with field programmatically where possible

Example:

```text
Base rate must be a valid number.
```

## 14.2 Calculation Errors

Show human-readable messages.

Example:

```text
True carpet cost cannot be calculated because carpet area is missing.
```

## 14.3 Import Errors

Show:

* Error summary
* Specific row/field issue
* Recommended action

---

# 15. Motion and Reduced Motion

Use minimal motion.

Allowed:

* Simple accordion open/close
* Small hover transitions
* Loading skeletons
* Toast fade

Avoid:

* Large animated transitions
* Constant moving elements
* Animation-heavy dashboards

Respect reduced motion settings where practical.

---

# 16. Map Accessibility

Maps are inherently visual, so the portal must provide non-map alternatives.

## 16.1 Project List Alternative

Every project shown on map should also appear in a list.

## 16.2 Popup Content

Map popup data should be accessible through a regular project card/list as well.

## 16.3 Keyboard Access

Map filters and project list should be keyboard accessible.

## 16.4 Missing Coordinates

Projects without coordinates should be visible in fallback list.

---

# 17. Chart Accessibility

Charts should not be the only way to understand data.

For every important chart, provide:

* Summary text
* Tooltip values
* Table alternative or source data
* Clear labels

Example:

For total landing cost chart, also show comparison table.

---

# 18. Status and Risk Accessibility

Use text labels consistently.

Examples:

```text
Status: Shortlisted
Risk: High
Parking: Unknown
GST: To Confirm
RERA: Verified
```

Do not show only icons.

Icons may support the label but should not replace it.

---

# 19. Responsive Component Rules

## 19.1 Cards

Cards should stack on mobile.

Desktop:

```text
4 cards per row
```

Tablet:

```text
2 cards per row
```

Mobile:

```text
1 card per row
```

## 19.2 Tabs

Desktop:

* Use horizontal tabs.

Mobile:

* Use scrollable tabs or accordion sections.

## 19.3 Filters

Desktop:

* Show filter bar.

Mobile:

* Use filter drawer or collapsible filter panel.

## 19.4 Modals

Large modals should become full-screen sheets on mobile.

## 19.5 Side Drawers

Side drawers should become bottom sheets or full-screen views on mobile.

---

# 20. Mobile Priority Actions

On mobile, prioritize these actions:

```text
Open Project
Start Site Visit
Continue Site Visit
Add Follow-Up
Add Note
Update Status
Confirm Parking
Confirm Cost
Save Visit
```

Deprioritize:

```text
Wide comparison
Detailed charts
Bulk export
Complex settings
Large financial breakdowns
```

---

# 21. Tablet Priority Actions

On tablet, support both review and capture:

```text
Review dashboard
Review projects
Use site visit checklist
View map
Edit forms
Basic comparison
```

---

# 22. Desktop Priority Actions

On desktop, prioritize full analytical workflows:

```text
Compare multiple units
Review financials
Review map
Export data
Manage settings
Analyze scores
Family discussion
Payment planning
```

---

# 23. Accessibility Testing Checklist

Before considering UI complete, verify:

## 23.1 Keyboard

* Can navigate sidebar using keyboard.
* Can open project page using keyboard.
* Can tab through forms.
* Can operate dropdowns.
* Can close dialogs.
* Can submit forms.

## 23.2 Labels

* All inputs have labels.
* Icon buttons have accessible labels.
* Tables have headers.
* Badges include text.

## 23.3 Color

* Risk states readable.
* Missing-data states readable.
* Financial values readable.
* Text contrast acceptable.

## 23.4 Mobile

* Tap targets are large enough.
* Site visit checklist is easy to use.
* Forms do not require horizontal scrolling.
* Cards are readable.
* Navigation is accessible.

## 23.5 Data States

* Missing data does not show as zero.
* Errors are human-readable.
* Empty states are helpful.
* Charts have textual summary.

---

# 24. Device Testing Checklist

Test on:

```text
Desktop: 1440px width
Laptop: 1280px width
Tablet: 768px width
Mobile: 390px width
Large mobile: 430px width
```

Check:

* Dashboard layout
* Project list
* Project detail
* Compare page
* Site visit checklist
* Follow-ups
* Map
* Forms
* Dialogs
* Tables

---

# 25. Responsive Acceptance Criteria

The responsive design is acceptable when:

1. Dashboard works on desktop and mobile.
2. Project list becomes cards on mobile.
3. Site visit checklist is comfortable on mobile.
4. Wide comparison tables scroll on desktop/tablet.
5. Mobile comparison has card/section mode.
6. Forms are single-column on mobile.
7. Navigation is usable on mobile.
8. Map has list alternative.
9. Follow-ups are card-based on mobile.
10. No page requires horizontal scrolling except intentional comparison tables.
11. Touch targets are large enough.
12. Missing data and risks remain visible on all screen sizes.

---

# 26. Accessibility Acceptance Criteria

The accessibility baseline is acceptable when:

1. All form inputs have labels.
2. All buttons have readable text or accessible labels.
3. Keyboard focus is visible.
4. Dialogs are keyboard usable.
5. Risk is communicated through text and color.
6. Missing data is communicated through text and color.
7. Important charts have text/table alternatives.
8. Map data is also available outside the map.
9. Error messages are clear.
10. The UI does not rely only on color or icons.
11. Financial values are readable.
12. Site visit checklist can be operated comfortably on mobile.

---

# 27. Final Responsive and Accessibility Principle

The portal should work where the user actually needs it.

On desktop, it should support deep thinking.

On mobile, it should support fast field capture.

Across all devices, it should remain clear, readable, and trustworthy.

Responsive design is not only about screen size. It is about matching the user’s context:

```text
Desktop = analyze and decide
Mobile = capture and confirm
Tablet = review and update
```

Accessibility is not optional polish. It improves clarity for every user, especially in a data-heavy decision tool.
