# 07_DASHBOARD_REQUIREMENTS.md

# Real Estate Decision Portal — Dashboard Requirements

## 1. Purpose of This Document

This document defines the dashboard, pages, views, tables, cards, filters, and user actions required for the Real Estate Decision Portal.

The portal should not feel like a raw spreadsheet. It should feel like a structured decision cockpit that helps the user move from project discovery to comparison, site visit, negotiation, booking, registration, and possession.

The dashboard should help the user answer:

* Which projects am I evaluating?
* Which projects are shortlisted?
* Which units are worth comparing?
* What is the true landing cost?
* What is the true cost per carpet sq.ft?
* Which project is best for living?
* Which project is best for investment?
* Which project has legal, parking, cost, or possession risks?
* What data is missing?
* What follow-ups are open?
* What should I do next?

---

## 2. Dashboard Design Philosophy

The portal should be:

* Clean
* Visual
* Decision-oriented
* Financially transparent
* Easy to update
* Easy to filter
* Useful during site visits
* Useful for family discussion
* Useful for negotiation
* Useful until possession

The user should not need to open Excel to understand the current status.

The dashboard should show:

1. Current shortlist
2. True cost comparison
3. Living vs investment suitability
4. Missing data
5. Risks
6. Follow-ups
7. Next actions

---

## 3. Main Navigation Structure

The application should have the following primary navigation sections:

```text
1. Home / Master Dashboard
2. Projects
3. Compare Units
4. Map
5. Site Visits
6. Financial Analysis
7. Payment Milestones
8. Documents
9. Follow-Ups
10. Settings
```

Optional later-stage navigation:

```text
11. Possession Tracker
12. Snagging
13. Reports / Exports
```

---

# 4. Page 1 — Home / Master Comparison Dashboard

## 4.1 Purpose

The Master Dashboard is the landing page.

It should show the user a clear summary of all active real estate evaluations.

It should combine project status, cost, risk, follow-up, shortlist, and next action information.

## 4.2 Primary Dashboard Sections

The landing dashboard should include:

1. Summary KPI cards
2. Shortlisted units table
3. Project status overview
4. Cost comparison chart
5. Living vs investment score matrix
6. Missing data alerts
7. Risk alerts
8. Open follow-ups
9. Upcoming site visits
10. Recommended next actions

---

## 4.3 Dashboard KPI Cards

Show the following cards:

| Card                   | Description                                     |
| ---------------------- | ----------------------------------------------- |
| Total Projects Tracked | Count of all projects                           |
| Active Projects        | Projects not rejected or closed                 |
| Shortlisted Projects   | Projects marked Shortlisted or Strong Shortlist |
| Units Under Comparison | Units selected for comparison                   |
| Lowest Landing Cost    | Lowest total landing cost among selected units  |
| Highest Landing Cost   | Highest total landing cost among selected units |
| Best True Carpet Cost  | Lowest true cost per carpet sq.ft               |
| Best RERA Efficiency   | Highest carpet/SBA ratio                        |
| Best Living Score      | Highest living score                            |
| Best Investment Score  | Highest investment score                        |
| Open Follow-Ups        | Count of pending tasks                          |
| Critical Risks         | Count of high/critical risk items               |
| Site Visits Planned    | Upcoming visits                                 |
| Data Missing Items     | Count of critical missing fields                |

---

## 4.4 Shortlisted Units Table

This table should show units selected for serious comparison.

Columns:

| Column             | Description                             |
| ------------------ | --------------------------------------- |
| Project            | Project name                            |
| Builder            | Builder name                            |
| Area               | Micro-market                            |
| Zone               | East/North/South/West/Central Bangalore |
| BHK                | BHK configuration                       |
| Tower/Wing         | Tower or wing                           |
| Unit               | Unit number                             |
| Floor              | Floor number                            |
| Facing             | Facing                                  |
| SBA                | Super built-up area                     |
| Carpet             | RERA carpet area                        |
| Efficiency %       | Carpet / SBA                            |
| Base Rate          | Base price per sq.ft                    |
| Agreement Value    | Core agreement value                    |
| Total Landing Cost | Full practical cost                     |
| True SBA Cost      | Landing cost / SBA                      |
| True Carpet Cost   | Landing cost / carpet                   |
| Parking            | Parking included/count                  |
| Possession         | RERA/builder possession date            |
| Living Score       | 0–100                                   |
| Investment Score   | 0–100                                   |
| Risk               | Low/Medium/High/Critical                |
| Status             | Shortlisted, Watchlist, Rejected, etc.  |
| Next Action        | Immediate action needed                 |

## 4.5 Required Table Features

The table should support:

* Sort by any numeric column
* Filter by project
* Filter by builder
* Filter by BHK
* Filter by area
* Filter by city zone
* Filter by budget
* Filter by living/investment purpose
* Filter by possession date
* Filter by risk
* Select/deselect units for comparison
* Inline notes
* Open project detail page
* Open unit detail page

---

## 4.6 Project Status Overview

Show project cards grouped by status:

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
Rejected
Watchlist
On Hold
```

Each project card should show:

* Project name
* Builder
* Area
* Starting price or selected unit cost
* BHK options
* Status
* Missing data count
* Open follow-up count
* Risk level
* Next action

---

## 4.7 Cost Comparison Chart

Show visual comparison of selected units.

Recommended chart types:

1. Bar chart: Total Landing Cost by Unit
2. Bar chart: True Cost per SBA Sq.Ft
3. Bar chart: True Cost per Carpet Sq.Ft
4. Waterfall chart: Quoted Cost to Landing Cost
5. Stacked cost breakdown: Basic cost, GST, registration, corpus, maintenance, interiors

The chart should help the user see why one project is actually more expensive than another.

---

## 4.8 Living vs Investment Matrix

Show a 2x2 style decision matrix:

```text
X-axis: Investment Score
Y-axis: Living Score
```

Quadrants:

| Quadrant                      | Meaning                             |
| ----------------------------- | ----------------------------------- |
| High Living + High Investment | Best overall options                |
| High Living + Low Investment  | Good future home, weaker investment |
| Low Living + High Investment  | Good investment, weaker self-use    |
| Low Living + Low Investment   | Avoid or deprioritize               |

Each project/unit should appear as a point.

Clicking a point should open the unit detail.

---

## 4.9 Missing Data Alerts

Show critical missing information across active projects.

Examples:

* Carpet area missing
* GST treatment unknown
* Parking not confirmed
* Registration estimate missing
* Corpus missing
* Maintenance missing
* RERA not verified
* Possession date missing
* Payment schedule missing
* Legal documents pending

Each alert should link to the relevant project/unit.

---

## 4.10 Risk Alerts

Show high and critical risks.

Risk categories:

* Financial risk
* Legal risk
* Parking risk
* Possession risk
* Builder credibility risk
* Location risk
* Construction quality risk
* Water/power risk
* Hidden cost risk
* Rental/investment risk

Each risk should show:

* Project
* Unit, if applicable
* Risk category
* Severity
* Description
* Next action

---

## 4.11 Open Follow-Ups

Show pending tasks.

Columns:

| Column                        | Description                     |
| ----------------------------- | ------------------------------- |
| Project                       | Project name                    |
| Unit                          | Unit, if applicable             |
| Task                          | Follow-up task                  |
| Category                      | Financial/Legal/Parking/etc.    |
| Priority                      | Low/Medium/High/Critical        |
| Owner                         | User/Builder/Legal/Bank/Family  |
| Due Date                      | Due date                        |
| Status                        | Open/In Progress/Waiting/Closed |
| Written Confirmation Required | Yes/No                          |

---

## 4.12 Recommended Next Actions

The portal should show a simple “What should I do next?” section.

Examples:

* Confirm parking dimensions for DSR The Address.
* Add carpet area for Myhna Orchid.
* Schedule site visit for The Earthscape.
* Upload final cost sheet for Sanjeevini Adwaith.
* Verify RERA phase for DSR Courtyard.
* Compare shortlisted 3BHK units.
* Review affordability for units above ₹2 Cr.
* Get written negotiated quote from builder.

---

# 5. Page 2 — Projects List

## 5.1 Purpose

The Projects List page should show all projects in the system.

This page is used for browsing, filtering, adding, editing, and managing projects.

## 5.2 Project List Columns

| Column                   | Description                            |
| ------------------------ | -------------------------------------- |
| Project Name             | Name                                   |
| Builder                  | Builder                                |
| Area                     | Micro-market                           |
| Zone                     | City zone                              |
| Purpose                  | Living / Investment / Both / Undecided |
| BHK Options              | Available configurations               |
| Starting SBA             | Smallest known unit                    |
| Starting Landing Cost    | Lowest known landing cost              |
| Starting True Cost/Sq.Ft | Lowest true SBA cost                   |
| RERA                     | Available / Missing / Verified         |
| Possession               | Date/status                            |
| Site Visit               | Not Planned / Planned / Completed      |
| Status                   | Project status                         |
| Risk                     | Risk level                             |
| Next Action              | Next required step                     |

## 5.3 Project List Filters

Filters:

* Builder
* Area / micro-market
* City zone
* Project status
* Purpose
* BHK
* Budget range
* Possession timeline
* RERA verified
* Site visit status
* Risk level
* Shortlist status

## 5.4 Project List Actions

Actions:

* Add project
* Edit project
* Duplicate project
* Archive project
* Mark shortlisted
* Mark rejected
* Add site visit
* Add unit
* Open project detail
* Export filtered projects

---

# 6. Page 3 — Individual Project Detail Page

## 6.1 Purpose

Each project should have a detailed page that consolidates all project-level and unit-level information.

## 6.2 Project Header

The top section should show:

* Project name
* Builder
* Area
* City zone
* Purpose tag
* Status
* Risk level
* Living score
* Investment score
* RERA number
* Possession date
* Last updated date
* Next action

## 6.3 Project Tabs

Recommended tabs:

```text
1. Overview
2. Units
3. Costs
4. Parking
5. Legal/RERA
6. Amenities
7. Location
8. Site Visits
9. Documents
10. Follow-Ups
11. Payment Schedule
12. Notes
```

---

## 6.4 Overview Tab

Show:

* Project summary
* Builder summary
* Location summary
* Available BHKs
* Construction stage
* Possession date
* Project scale
* Current decision status
* Key positives
* Key concerns
* Missing critical data
* Open follow-ups
* Recommendation

---

## 6.5 Units Tab

Show all units for the project.

Columns:

* BHK
* Unit type
* Tower
* Floor
* Unit number
* Facing
* SBA
* Carpet
* Efficiency
* Base rate
* Agreement value
* Total landing cost
* True SBA cost
* True carpet cost
* Parking count
* Living score
* Investment score
* Status

Actions:

* Add unit
* Edit unit
* Duplicate unit
* Delete unit
* Select for comparison
* Mark shortlisted
* Mark rejected

---

## 6.6 Costs Tab

Show cost breakup for each selected unit.

Sections:

1. Basic cost
2. Core builder charges
3. GST
4. Stamp duty and registration
5. Legal/franking
6. Corpus and maintenance
7. Possession charges
8. Interiors and move-in
9. Total landing cost
10. True value analysis

The cost tab should show:

* Amount
* Treatment
* Source
* Confidence
* Notes
* Manual override status

---

## 6.7 Parking Tab

Show project/unit-level parking details.

Fields:

* Parking included
* Number of slots
* Parking type
* Parking level
* Slot number
* Dimensions
* Independent/tandem
* Visitor parking
* EV charging
* Additional parking availability
* Additional parking cost
* Parking allotment status
* Parking risk notes

Parking should be visually highlighted because it is a major decision factor.

---

## 6.8 Legal/RERA Tab

Show:

* RERA number
* RERA verified status
* RERA possession date
* Builder promised handover date
* OC status
* CC status
* Approved plan
* Land title
* Khata status
* Bank approvals
* Draft agreement
* Cancellation policy
* Delay penalty clause
* Litigation disclosure
* Legal review status
* Legal notes

---

## 6.9 Amenities Tab

Show amenities grouped by category:

* Fitness
* Sports
* Kids
* Community
* Utility
* Security
* Convenience
* Pet
* Senior citizen
* Other

Each amenity should show:

* Available
* Included in cost
* Readiness status
* Delivery date
* Quality rating
* Notes

---

## 6.10 Location Tab

Show:

* Map location
* Exact/approximate pin
* Address
* Micro-market
* City zone
* Distance to current residence
* Distance to workplace
* Distance to metro
* Distance to ORR
* Distance to school
* Distance to hospital
* Road access quality
* Traffic bottlenecks
* Waterlogging risk
* Social infrastructure
* Rental demand
* Future infrastructure notes

---

## 6.11 Site Visits Tab

Show all visits for the project.

Each visit card should show:

* Visit date
* Salesperson
* Units discussed
* Documents collected
* Visit outcome
* Key positives
* Key risks
* Follow-ups created
* Link to full visit checklist

Actions:

* Add new visit
* Edit visit
* Duplicate visit checklist
* Generate visit summary

---

## 6.12 Documents Tab

Show all documents linked to the project/unit.

Columns:

* Document name
* Category
* Status
* Source
* Collected date
* Review status
* Notes

Actions:

* Add document record
* Mark reviewed
* Mark risk
* Link to file/path
* Add follow-up

---

## 6.13 Follow-Ups Tab

Show all project/unit follow-ups.

Actions:

* Add follow-up
* Assign owner
* Set due date
* Mark waiting
* Mark closed
* Attach evidence
* Update project/unit data from response

---

## 6.14 Payment Schedule Tab

Show project/unit payment milestones.

Columns:

* Milestone order
* Milestone name
* Percentage
* Amount
* GST
* TDS
* Due date
* Own contribution
* Loan disbursement
* Paid amount
* Receipt status
* Status

Validation:

* Total milestone % must equal 100%.
* Alert if milestone schedule is incomplete.

---

# 7. Page 4 — Compare Units

## 7.1 Purpose

This page allows side-by-side comparison of selected units.

It should support comparison across projects and within the same project.

## 7.2 Comparison Modes

Supported modes:

1. Project vs project
2. Unit vs unit
3. Same project multiple units
4. Living-focused comparison
5. Investment-focused comparison
6. Financial-only comparison
7. Legal/risk comparison

## 7.3 Comparison Table Sections

The comparison table should be grouped by:

1. Project and unit metadata
2. Space and efficiency
3. Core cost
4. Statutory and registration
5. Maintenance and possession
6. Interiors and move-in
7. Total cost KPIs
8. Parking
9. Legal/RERA
10. Location
11. Living score
12. Investment score
13. Risks and follow-ups
14. Decision notes

## 7.4 Highlighting Rules

The comparison table should highlight:

* Lowest landing cost
* Lowest true SBA cost
* Lowest true carpet cost
* Highest carpet efficiency
* Best living score
* Best investment score
* Earliest possession
* Parking risk
* Legal risk
* Missing data

## 7.5 Actions

Actions:

* Add/remove unit from comparison
* Save comparison set
* Export comparison
* Mark winning option
* Mark rejected option
* Add notes
* Create follow-up
* Move to shortlist

---

# 8. Page 5 — Map Page

## 8.1 Purpose

The Map page should help the user understand project location, area spread, commute convenience, and city-zone coverage.

Detailed map requirements are defined in:

```text
08_MAP_AND_LOCATION_REQUIREMENTS.md
```

## 8.2 Dashboard-Level Map Summary

The map page should show:

* All project pins
* Current residence marker
* Workplace marker
* Optional family/work markers
* Coverage circles
* Zone filters
* Project cards on click
* Projects without coordinates in fallback list

---

# 9. Page 6 — Site Visits

## 9.1 Purpose

This page lists and manages all site visits across projects.

Detailed site visit checklist requirements are defined in:

```text
06_SITE_VISIT_CHECKLIST.md
```

## 9.2 Site Visit List Columns

| Column              | Description                      |
| ------------------- | -------------------------------- |
| Project             | Project name                     |
| Builder             | Builder                          |
| Visit Date          | Date                             |
| Visit Type          | First/Revisit/Family/Negotiation |
| Salesperson         | Contact                          |
| Outcome             | Interested/Revisit/Rejected/etc. |
| Documents Collected | Count                            |
| Follow-Ups Created  | Count                            |
| Critical Risks      | Count                            |
| Next Action         | Next action                      |

## 9.3 Actions

* Add site visit
* Edit site visit
* Open checklist
* Generate visit summary
* Create follow-ups
* Update project/unit data
* Export visit summary

---

# 10. Page 7 — Financial Analysis

## 10.1 Purpose

This page provides deeper financial analysis across projects and units.

## 10.2 Sections

1. Total landing cost comparison
2. True cost per SBA sq.ft
3. True cost per carpet sq.ft
4. Hidden cost analysis
5. Registration and statutory charges
6. Corpus and maintenance comparison
7. Parking cost comparison
8. Interior budget comparison
9. EMI estimate
10. Own contribution estimate
11. Rental yield estimate
12. Cost completeness score

## 10.3 True Value Analysis

For each unit, show:

* Builder quoted cost
* Basic flat cost
* Agreement value
* GST
* Stamp duty
* Registration
* Legal/franking
* Corpus
* Maintenance
* Possession charges
* Interiors
* Total landing cost
* Difference from quoted cost
* Hidden cost percentage
* Main contributors to cost increase

## 10.4 Charts

Recommended charts:

* Total landing cost bar chart
* True carpet cost bar chart
* Hidden cost percentage chart
* Cost breakup stacked bar
* EMI comparison
* Rental yield comparison
* Cash-flow timeline

---

# 11. Page 8 — Payment Milestones

## 11.1 Purpose

This page tracks payment schedules and cash flow, especially after booking.

## 11.2 Views

1. Project-level payment schedule
2. Unit-level payment schedule
3. Upcoming payments
4. Paid vs pending
5. Own contribution required
6. Loan disbursement expected
7. Receipt tracking

## 11.3 Validation

The portal should alert if:

* Milestone percentages do not total 100%
* Due date is missing
* Payment is overdue
* Receipt not uploaded/recorded
* Loan disbursement is pending
* Own contribution is high

---

# 12. Page 9 — Documents

## 12.1 Purpose

This page tracks documents collected, reviewed, pending, or risky.

## 12.2 Document Categories

* Cost sheet
* Brochure
* Floor plan
* Master plan
* RERA
* Legal
* Agreement
* Payment schedule
* Parking
* Bank approval
* Possession
* Snagging
* Other

## 12.3 Document Table Columns

| Column         | Description                              |
| -------------- | ---------------------------------------- |
| Project        | Project                                  |
| Unit           | Unit, if applicable                      |
| Document Name  | Name                                     |
| Category       | Category                                 |
| Status         | Required/Collected/Reviewed/Pending/Risk |
| Source         | Builder/RERA/Bank/User/etc.              |
| Collected Date | Date                                     |
| Review Status  | Not Reviewed/In Review/Cleared/Risk      |
| Notes          | Notes                                    |

## 12.4 Actions

* Add document record
* Mark collected
* Mark reviewed
* Mark risk
* Add note
* Create follow-up

---

# 13. Page 10 — Follow-Ups

## 13.1 Purpose

This page consolidates all pending tasks and builder/legal/bank/family follow-ups.

## 13.2 Views

1. All open follow-ups
2. Critical follow-ups
3. Overdue follow-ups
4. Waiting for builder
5. Waiting for legal review
6. Waiting for bank
7. Waiting for family
8. Closed follow-ups

## 13.3 Follow-Up Columns

| Column                        | Description                     |
| ----------------------------- | ------------------------------- |
| Project                       | Project                         |
| Unit                          | Unit if applicable              |
| Task                          | Follow-up title                 |
| Category                      | Financial/Legal/Parking/etc.    |
| Priority                      | Low/Medium/High/Critical        |
| Owner                         | Owner                           |
| Due Date                      | Due date                        |
| Status                        | Open/In Progress/Waiting/Closed |
| Risk                          | Risk level                      |
| Written Confirmation Required | Yes/No                          |
| Notes                         | Notes                           |

## 13.4 Actions

* Add task
* Edit task
* Mark closed
* Add evidence
* Update project/unit field
* Convert checklist item to follow-up

---

# 14. Page 11 — Settings

## 14.1 Purpose

Settings control assumptions used across the portal.

## 14.2 Settings Sections

1. General
2. Location
3. Tax and registration
4. Home loan
5. Interior budgets
6. Scoring weights
7. Display preferences
8. Import/export

## 14.3 General Settings

Fields:

* Default city
* Default city zone focus
* Default currency
* Date format
* Number format

## 14.4 Location Settings

Fields:

* Current residence label
* Current residence coordinates
* Primary workplace label
* Primary workplace coordinates
* Optional secondary workplace
* Optional family reference location

## 14.5 Tax and Registration Settings

Fields:

* Default GST %
* Default TDS %
* Default stamp duty %
* Default sale deed registration %
* Default agreement registration charge
* Default franking/e-stamping charge
* Default Khata transfer charge
* Default mutation charge
* Default cess/surcharge %
* Whether TDS is additive or cash-flow only
* Whether loan setup costs are included in landing cost

## 14.6 Home Loan Settings

Fields:

* Default loan-to-value ratio
* Default annual interest rate
* Default tenure
* Default processing fee %
* Default MODT %
* Default bank legal/technical charge
* EMI comfort threshold
* Stretch threshold

## 14.7 Interior Budget Settings

Fields:

* Default 2BHK interior budget
* Default 2.5BHK interior budget
* Default 3BHK interior budget
* Default 3.5BHK interior budget
* Default 4BHK interior budget
* Default appliance budget
* Default move-in budget

## 14.8 Scoring Weight Settings

Allow user to adjust weights for:

* Living Score
* Investment Score

Detailed scoring model is defined in:

```text
09_SCORING_MODEL.md
```

---

# 15. Optional Later Page — Possession Tracker

## 15.1 Purpose

Once a unit is booked, this page tracks possession readiness.

## 15.2 Sections

* RERA possession date
* Builder handover date
* Revised possession date
* OC/CC status
* Final demand
* Maintenance/corpus payment
* Utility readiness
* Parking allotment
* Access cards
* Keys
* Snagging
* Handover documents
* Final possession status

---

# 16. Optional Later Page — Snagging

## 16.1 Purpose

Track defects during handover.

## 16.2 Fields

* Room/area
* Issue category
* Description
* Severity
* Photo reference
* Reported date
* Builder response
* Target closure date
* Actual closure date
* Status
* Notes

---

# 17. Global UI Components

The application should include reusable components.

## 17.1 KPI Card

Used for:

* Total landing cost
* True cost per sq.ft
* Living score
* Investment score
* Risk count
* Follow-up count

## 17.2 Cost Breakdown Card

Shows:

* Cost component
* Amount
* Treatment
* Source
* Confidence
* Notes

## 17.3 Risk Badge

Risk levels:

* Low
* Medium
* High
* Critical
* Unknown

## 17.4 Data Missing Badge

Show when critical data is missing.

Examples:

* Carpet Missing
* Parking Unknown
* GST Unknown
* RERA Missing
* Registration Estimate Missing

## 17.5 Status Badge

Show project/unit status.

Examples:

* New Lead
* Data Pending
* Site Visited
* Shortlisted
* Negotiation
* Booking Ready
* Rejected

## 17.6 Score Badge

Show:

* Living Score
* Investment Score
* Risk Score

## 17.7 Editable Field

Every important data field should be editable.

The component should support:

* Current value
* Source
* Confidence
* Notes
* Last updated date

## 17.8 Comparison Table

Reusable table for selected units.

Must support:

* Sorting
* Filtering
* Column groups
* Sticky headers
* Export
* Highlight best/worst values

---

# 18. Global Filters

The dashboard should support global filters.

Filters:

* Project
* Builder
* Area
* City zone
* BHK
* Budget range
* Total landing cost range
* True SBA cost range
* True carpet cost range
* Possession timeline
* Purpose: Living / Investment / Both
* RERA verified
* Parking included
* Legal risk level
* Data completeness
* Shortlist status
* Site visit status

---

# 19. Global Search

The portal should include search across:

* Project name
* Builder name
* Area
* Unit number
* BHK
* Salesperson
* Notes
* Follow-ups
* Documents

---

# 20. Data Completeness Dashboard

The portal should show completeness by section.

Sections:

* Project identity
* Location
* Unit details
* Cost
* Parking
* Legal/RERA
* Amenities
* Site visit
* Financial planning
* Investment assumptions

Each section should show:

* Complete
* Partially complete
* Missing
* Critical missing

---

# 21. Risk Dashboard

The portal should show risks across projects.

Risk categories:

* Financial
* Legal
* Parking
* Possession
* Construction
* Location
* Water/power
* Builder
* Investment
* Documentation

Each risk should have:

* Severity
* Description
* Project
* Unit
* Owner
* Follow-up task
* Status

---

# 22. Export Requirements

The portal should support exporting:

## 22.1 JSON Export

Primary backup format.

Should include full project database.

## 22.2 CSV Export

For:

* Master comparison
* Shortlisted units
* Follow-ups
* Documents
* Payment milestones

## 22.3 Excel Export

For family/bank/advisor sharing.

Suggested sheets:

* Master Comparison
* Project Summary
* Unit Comparison
* Cost Breakdown
* Follow-Ups
* Documents
* Payment Schedule

---

# 23. Import Requirements

Preferred import:

* Structured JSON Project Pack

Optional:

* Excel migration import
* CSV import
* Document/image extraction later

The dashboard should not depend on Excel as the long-term source of truth.

---

# 24. Responsive Design Requirements

The portal is desktop-first but should be usable on mobile for site visits.

## 24.1 Desktop Priority

Desktop should support:

* Wide comparison tables
* Multiple columns
* Charts
* Map view
* Financial dashboards

## 24.2 Mobile Priority

Mobile should support:

* Site visit checklist
* Quick notes
* Project lookup
* Follow-up creation
* Photo/document reference
* Quick status update

---

# 25. Visual Design Requirements

The visual style should be:

* Clean
* Professional
* Light dashboard style
* Executive-friendly
* Low clutter
* Clear grouping
* Strong financial readability
* Clear risk indicators
* Clear missing-data indicators

Avoid:

* Overly decorative UI
* Too many colors
* Spreadsheet-like clutter
* Dense forms without grouping
* Hidden calculations

---

# 26. Recommended Route Structure

Suggested routes:

```text
/
  Master Dashboard

/projects
  Project list

/projects/[projectId]
  Project detail

/projects/[projectId]/units/[unitId]
  Unit detail

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
  Payment milestones

/documents
  Document tracker

/follow-ups
  Follow-up tracker

/settings
  Settings
```

Future routes:

```text
/possession
/snagging
/reports
```

---

# 27. Dashboard Acceptance Criteria

The dashboard module is complete when:

1. The user can see all projects.
2. The user can filter projects by builder, area, zone, BHK, purpose, and status.
3. The user can see selected units side by side.
4. The user can see total landing cost.
5. The user can see true cost per SBA sq.ft.
6. The user can see true cost per carpet sq.ft.
7. The user can see parking details separately.
8. The user can see missing data warnings.
9. The user can see open follow-ups.
10. The user can see risks.
11. The user can open project detail pages.
12. The user can open site visit checklists.
13. The user can add/edit project and unit information.
14. The user can export comparison data.
15. The dashboard does not break when values are missing.
16. The dashboard is usable for real decision-making.

---

# 28. Final Dashboard Principle

The dashboard should convert complex, incomplete, and inconsistent real estate information into a clear decision system.

It should not only show data.

It should help the user decide:

* Which projects to visit
* Which projects to reject
* Which units to compare
* Which costs are hidden
* Which legal items are pending
* Which parking details are unclear
* Which follow-ups are urgent
* Which option is best for living
* Which option is best for investment
* Which project is ready for booking
* What action should be taken next

The dashboard is the command center of the Real Estate Decision Portal.
