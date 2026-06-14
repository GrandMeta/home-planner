# 00_PRODUCT_VISION.md

# Real Estate Decision Portal — Product Vision

## 1. Product Name

**Real Estate Decision Portal**

Working name: **Home Decision Cockpit**

This portal is a personal real estate decision system designed to help evaluate, compare, shortlist, negotiate, track, and finally close apartment purchases in Bangalore.

The first focus area is **East Bangalore**, since that is where the user currently resides and is actively evaluating residential projects. However, the system should be designed to support future expansion to North Bangalore, South Bangalore, West Bangalore, Central Bangalore, and eventually any city or region.

---

## 2. Core Vision

The portal should not be treated as a simple Excel replacement.

The long-term vision is to create an end-to-end apartment buying command center that supports the entire journey:

1. Discover projects.
2. Capture project information.
3. Import builder cost sheets.
4. Normalize different pricing formats.
5. Compare true financial cost.
6. Evaluate living suitability.
7. Evaluate investment potential.
8. Conduct structured site visits.
9. Track missing information.
10. Compare units side by side.
11. Validate parking, amenities, legal, RERA, and construction status.
12. Track negotiation and builder commitments.
13. Plan home loan and own contribution.
14. Track payment milestones.
15. Prepare for registration and possession.
16. Maintain a final decision history.

The portal should help the user move from confusion to clarity.

The end goal is to make the complete apartment buying journey — from first project discovery to final possession — structured, transparent, comparable, and decision-ready.

---

## 3. Why This Portal Is Needed

Buying an apartment is difficult because each builder presents information differently.

Some builders provide detailed cost sheets. Some provide only high-level numbers. Some include car parking in the base cost. Others show it separately. Some bundle BWSSB, BESCOM, clubhouse, amenities, EV infrastructure, corpus, maintenance, legal, and GST into different buckets. Some provide carpet area clearly. Others only provide super built-up area. Some give RERA carpet. Others provide balcony and utility separately. Some mention floor rise clearly. Others add it later during negotiation.

This makes direct comparison misleading.

A flat that looks cheaper on the builder sheet may become more expensive after adding:

* GST
* Stamp duty
* Registration
* Corpus fund
* Maintenance advance
* Legal charges
* Franking
* Clubhouse charges
* BWSSB/BESCOM
* Power backup
* EV charger provision
* Floor rise
* PLC
* Car parking
* Additional parking
* Interiors
* Move-in cost

Therefore, the portal must calculate the **true cost**, not just the quoted cost.

---

## 4. Primary Product Objective

The portal must answer one central question:

> “Which apartment project and unit gives the best overall value for my purpose — future living, investment, or both?”

To answer this, the portal must combine:

* Financial analysis
* Location analysis
* Unit-level comparison
* Carpet efficiency analysis
* Legal/RERA readiness
* Parking clarity
* Possession timeline
* Builder credibility
* Amenities and lifestyle value
* Commute suitability
* Rental/investment potential
* Risk visibility
* Family suitability
* Follow-up readiness

---

## 5. Current Seed Projects

The portal will start with five projects extracted from builder documents and a prepared Excel workbook:

1. **The Earthscape**
2. **DSR Courtyard**
3. **Myhna Orchid**
4. **DSR The Address**
5. **Sanjeevini Adwaith / The Adwaith**

These are only the seed projects. The portal must not be hardcoded around these five projects. It should support unlimited future projects.

---

## 6. Initial Geography

The initial focus is:

* Bangalore
* Primarily East Bangalore
* User’s current residence side
* Projects around the user’s live/work/family convenience zones

The portal should later support multiple Bangalore zones:

* East Bangalore
* North Bangalore
* South Bangalore
* West Bangalore
* Central Bangalore
* Other custom micro-markets

The system should allow tagging projects by:

* Area
* Micro-market
* City zone
* Distance from current residence
* Distance from workplace
* Distance from metro
* Distance from ORR
* Distance from schools
* Distance from hospitals
* Traffic and access conditions
* Future infrastructure potential

---

## 7. Key Personas

### 7.1 Primary User

The primary user is an individual or family evaluating apartment purchases for either:

* Future self-living
* Investment
* A combination of both

The user wants clarity, not just data.

The user needs to understand:

* What is the actual cost?
* What are the hidden charges?
* Which project is better?
* Which builder is more transparent?
* Which unit is financially sensible?
* Which unit is better for living?
* Which unit is better for investment?
* What questions are still unanswered?
* What needs to be checked before booking?
* What needs to be tracked before possession?

### 7.2 Family Decision Stakeholders

The portal should help communicate the decision to family members by showing:

* Shortlisted projects
* Cost comparison
* Location comparison
* Pros and cons
* Parking clarity
* Amenities
* Safety and living comfort
* Final recommendation status

### 7.3 Financial Decision Maker

The portal should support financial planning by showing:

* Agreement value
* Total landing cost
* Own contribution
* Loan component
* EMI
* Payment schedule
* Registration cost
* Possession cost
* Interior budget
* Rental yield, if evaluated as investment

---

## 8. Product Philosophy

The portal should follow five principles.

### 8.1 Normalize Everything

All builder data must be converted into a standardized format.

Even if builders provide different pricing formats, the portal should map all costs into common cost heads.

If a cost is unavailable, the system should not break. Instead:

* Numeric fields should safely default to zero for formulas.
* Important missing fields should visually show “Data Missing”.
* The user should be able to update missing data after a site visit.

### 8.2 Make Hidden Costs Visible

The system must show the difference between:

* Builder quoted cost
* Agreement value
* Total sunk acquisition cost
* Total landing cost

The user should clearly see how a quoted ₹1.6 Cr property may become ₹1.85 Cr or ₹2 Cr after adding taxes, parking, registration, maintenance, interiors, and possession charges.

### 8.3 Compare Liveable Space, Not Just Saleable Area

The portal must calculate:

* Cost per super built-up area
* Cost per carpet area
* RERA efficiency ratio

The carpet-area cost is critical because it exposes the true price of usable/liveable space.

### 8.4 Track the Full Buying Journey

The portal should not stop after comparison.

It should continue supporting:

* Site visit notes
* Builder follow-ups
* Document collection
* Negotiation commitments
* Loan planning
* Payment milestones
* Registration readiness
* Possession checklist

### 8.5 Support Living and Investment Decisions Separately

A project good for living may not be the best investment.

A project good for investment may not be ideal for family living.

Therefore, the portal should have separate scoring models:

* Living Score
* Investment Score

Each score should be transparent, weighted, and editable.

---

## 9. Core Decision Views

The portal should eventually provide the following views.

### 9.1 Master Comparison Dashboard

A side-by-side comparison of selected units across projects.

This should show:

* Project name
* Builder
* BHK
* Unit size
* Carpet area
* Efficiency ratio
* Base rate
* Agreement value
* Total landing cost
* True cost per SBA sq.ft
* True cost per carpet sq.ft
* Parking details
* Possession date
* Distance to workplace
* Distance to metro
* Living score
* Investment score
* Decision status

### 9.2 Project Explorer

A searchable and filterable list of all projects.

The user should be able to view projects by:

* Builder
* Area
* Micro-market
* City zone
* BHK availability
* Budget
* Amenities
* Possession timeline
* Living suitability
* Investment potential
* Shortlist status

### 9.3 Individual Project Page

Each project should have its own detailed page.

This page should include:

* Project summary
* Builder details
* Location details
* Available units
* Cost breakup
* Parking information
* Amenities
* Legal/RERA information
* Construction status
* Payment schedule
* Site visit notes
* Follow-up items
* Documents collected
* Decision status

### 9.4 Unit Comparison Page

The user should be able to compare multiple units across the same or different projects.

Example comparisons:

* 3BHK in DSR Courtyard vs 3BHK in The Earthscape
* 3BHK Plus vs 3.5BHK in the same project
* East-facing unit vs North-facing unit
* Lower-floor unit vs higher-floor unit
* Living option vs investment option

### 9.5 Map View

The portal should show projects on a Bangalore map.

The map should support:

* Project pins
* Current residence marker
* Workplace marker
* Zone filters
* Coverage radius circles
* Projects without coordinates in a fallback list
* Clickable project summary cards

This should help the user understand spatial spread, commute impact, micro-market clustering, and location convenience.

### 9.6 Site Visit Checklist

The site visit checklist should convert unstructured site visits into structured data.

Every visit should capture:

* Salesperson details
* Unit details
* Financial clarifications
* Parking details
* Legal/RERA checks
* Construction quality
* Amenities readiness
* Water/power details
* Location conditions
* Follow-ups
* Final visit outcome

### 9.7 Financial Analysis Page

This page should show:

* True value analysis
* Hidden cost percentage
* EMI estimate
* Loan requirement
* Own contribution
* Payment milestone cash flow
* Rental yield
* Investment return assumptions

### 9.8 Possession Tracker

The long-term vision includes a possession tracker.

This should eventually support:

* Payment milestones
* Registration readiness
* Document checklist
* Interior readiness
* Utility connection readiness
* Snagging checklist
* Handover checklist
* OC/CC/Khata status
* Final possession closure

---

## 10. Core Data Organization

The portal should structure data across the following major objects:

1. Builder
2. Project
3. Unit
4. Cost Breakup
5. Parking Details
6. Location Details
7. Amenity Details
8. Legal/RERA Details
9. Site Visit Record
10. Checklist Item
11. Payment Milestone
12. Document Record
13. Follow-up Task
14. Scorecard
15. Decision Status

This separation is important because:

* One builder can have many projects.
* One project can have many units.
* One unit can have a specific cost breakup.
* One project can have multiple site visits.
* One project can have multiple payment milestones.
* One unit can have specific parking details.
* One project can be evaluated differently for living and investment.

---

## 11. Financial Decision Framework

The portal must calculate and expose the following financial KPIs:

### 11.1 Agreement Value

The agreement value should include the core builder charges before statutory and possession costs.

Formula:

Agreement Value =
Basic Flat Cost

* Car Parking Charges
* Clubhouse / Amenities Charges
* Infrastructure Charges
* BWSSB Charges
* BESCOM Charges
* Power Backup Charges
* EV Charger Charges
* PLC Charges
* Corner Premium
* Facing Premium
* Floor Rise Premium
* Other Core Charges

### 11.2 Total Sunk Acquisition Cost

This is the cost to legally acquire the property.

Formula:

Total Sunk Acquisition Cost =
Agreement Value

* GST Amount
* Stamp Duty
* Registration
* Legal Charges
* Franking
* Khata / Mutation Charges
* Other Government Charges

### 11.3 Total Possession Cost

This captures costs payable around possession.

Formula:

Total Possession Cost =
Corpus Fund

* Advance Maintenance
* Gas Connection
* Water Meter Charges
* Electricity Meter Charges
* Possession Charges

### 11.4 Total Landing Cost

This is the true practical cost of owning and preparing the unit.

Formula:

Total Landing Cost =
Total Sunk Acquisition Cost

* Total Possession Cost
* Interior Fit-Out Budget
* Appliance Budget
* Move-In Budget

### 11.5 True Cost per SBA Sq.Ft

Formula:

True Cost per SBA Sq.Ft =
Total Landing Cost / Super Built-up Area

### 11.6 True Cost per Carpet Sq.Ft

Formula:

True Cost per Carpet Sq.Ft =
Total Landing Cost / Carpet Area

This is one of the most important KPIs because it shows the real cost of liveable space.

---

## 12. Hidden Cost Philosophy

The portal should expose the gap between the advertised or quoted cost and the actual landing cost.

Hidden Cost Percentage:

Hidden Cost % =
Total Landing Cost - Basic Flat Cost
divided by
Basic Flat Cost

The dashboard should show:

* Builder quoted cost
* Agreement value
* Total acquisition cost
* Total possession cost
* Interior budget
* Total landing cost
* Hidden cost percentage

Suggested risk indicators:

* Green: Hidden cost below 10%
* Amber: Hidden cost between 10% and 20%
* Red: Hidden cost above 20%

---

## 13. Parking Philosophy

Parking must be treated as a dedicated decision parameter, not a small note.

The portal should capture:

* Is parking included?
* How many parking slots are included?
* What type of parking is provided?
* Basement, stilt, open, covered, mechanical, or tandem?
* What is the slot number?
* What is the parking level?
* What are the dimensions?
* Is EV charging included?
* Is EV charging only provisioned?
* Is additional parking available?
* What is the cost of additional parking?
* Are registration charges applicable on parking?
* Is one parking enough for this unit and family usage?
* Is visitor parking available?

This matters because different builders present parking differently. Some give one slot, some give two slots for premium units, some charge extra, and some do not clearly mention dimensions.

---

## 14. Living Suitability Framework

The Living Score should help answer:

> “Can I realistically live here with my family?”

Important parameters:

* Commute to workplace
* Distance from current residence/familiar area
* Metro access
* School access
* Hospital access
* Road width and traffic bottlenecks
* Water source
* Power backup
* Parking adequacy
* Unit layout
* Carpet efficiency
* Ventilation
* Natural light
* Balcony usability
* Project density
* Open space
* Amenities
* Builder delivery credibility
* Possession certainty
* Family comfort
* Budget comfort

---

## 15. Investment Suitability Framework

The Investment Score should help answer:

> “Is this a good asset to buy for rental yield, appreciation, or resale?”

Important parameters:

* Entry price attractiveness
* True cost per sq.ft
* Rental yield
* Expected rent
* Tenant demand
* Builder brand liquidity
* Resale demand
* Metro/infra upside
* Area development potential
* Competing supply nearby
* Possession timeline
* Hidden cost risk
* Maintenance burden
* Micro-market risk
* Exit liquidity

---

## 16. Site Visit Philosophy

Every site visit should become structured data.

The portal should guide the user to collect missing details during a site visit instead of relying on memory, WhatsApp messages, brochures, or scattered notes.

A site visit should capture:

* What was promised?
* What was shown?
* Which unit was discussed?
* What was the exact quote?
* What was included?
* What was excluded?
* What is negotiable?
* What is pending?
* What needs follow-up?
* What are the risks?
* Should this project remain shortlisted?

Each visit should have a final outcome:

* Interested
* Not Interested
* Revisit Required
* Family Review Required
* Financial Review Required
* Legal Review Required
* Watchlist
* Rejected

---

## 17. Document Management Vision

The portal should eventually track collected documents.

Examples:

* Cost sheet
* Floor plan
* Master plan
* Brochure
* RERA certificate
* Approved plan
* Occupancy Certificate
* Commencement Certificate
* Draft agreement
* Payment schedule
* Parking allotment document
* Amenities specification
* Legal opinion
* Bank approval list
* Construction progress images

Each document should track:

* Document name
* Project
* Date collected
* Source
* Status
* Notes
* Whether reviewed or pending

---

## 18. Follow-Up and Negotiation Vision

The portal should support follow-up tracking.

Examples:

* Confirm final negotiated base rate
* Confirm GST treatment
* Confirm parking dimensions
* Confirm second parking availability
* Confirm RERA possession date
* Confirm OC timeline
* Confirm floor rise
* Confirm corpus calculation
* Confirm maintenance tenure
* Confirm legal charges
* Confirm cancellation policy
* Confirm payment schedule
* Confirm clubhouse readiness
* Confirm water source

Each follow-up should capture:

* Task
* Project
* Owner
* Due date
* Status
* Notes
* Risk level

---

## 19. Decision Status Model

Every project and unit should have a clear decision status.

Suggested statuses:

* New Lead
* Data Pending
* Site Visit Planned
* Site Visited
* Under Comparison
* Shortlisted
* Strong Shortlist
* Negotiation
* Legal Review
* Financial Review
* Family Review
* Booking Ready
* Booked
* Rejected
* Watchlist
* On Hold

The portal should allow reason codes for rejection or shortlisting.

Examples:

* Too expensive
* Poor carpet efficiency
* Location not suitable
* Parking unclear
* Legal concerns
* Possession delayed
* Good investment
* Good living option
* Better negotiation possible
* Strong builder
* Good location upside

---

## 20. Product Experience Goal

The portal should feel like a calm, structured decision cockpit.

It should not feel like a raw spreadsheet.

The design should be:

* Clean
* Visual
* Filterable
* Editable
* Structured
* Decision-oriented
* Financially transparent
* Easy to update after site visits
* Useful for family discussion
* Useful for negotiation
* Useful until possession

The user should be able to open the portal and immediately understand:

* Which projects are being evaluated
* Which are shortlisted
* Which are risky
* Which need follow-up
* Which are best for living
* Which are best for investment
* What the real cost is
* What data is still missing
* What action is needed next

---

## 21. Initial Implementation Direction

The application should be built in phases.

The first phase should create documentation and schema.

The second phase should create the app scaffold.

The third phase should import the Excel workbook.

The fourth phase should create the dashboard and project comparison views.

The later phases should add:

* Site visit checklist
* Map view
* Financial engine
* Scoring engine
* Payment planner
* Document tracker
* Export/import
* UI polish

The system must be expandable and should not be limited to the current Excel structure.

---

## 22. Non-Negotiable Product Requirements

1. The system must support unlimited projects.
2. The system must support multiple units per project.
3. The system must normalize builder cost sheets.
4. Missing values must not break formulas.
5. Important missing values must be clearly visible.
6. Parking must be captured as a dedicated section.
7. The system must calculate true landing cost.
8. The system must calculate true carpet cost.
9. The system must separate living and investment evaluation.
10. The system must support site visit data capture.
11. The system must support map-based project visualization.
12. The system must support follow-up tracking.
13. The system must eventually support the journey until possession.
14. The system must be practical for real decision-making, not just technically complete.

---

## 23. Final Product Statement

The Real Estate Decision Portal is a personal command center for making a high-value apartment purchase decision in Bangalore.

It converts scattered builder sheets, handwritten notes, site visit observations, legal checks, location factors, parking details, and financial calculations into one structured decision system.

The portal should help the user confidently answer:

* What am I really paying?
* What am I getting?
* What is missing?
* What is risky?
* What is negotiable?
* Which project is best for living?
* Which project is best for investment?
* Which unit should I shortlist?
* What should I do next?

The final goal is to make the real estate buying journey seamless from discovery to possession.