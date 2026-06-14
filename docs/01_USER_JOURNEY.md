# 01_USER_JOURNEY.md

# Real Estate Decision Portal — User Journey

## 1. Purpose of This Document

This document defines the end-to-end user journey for the Real Estate Decision Portal.

The portal is intended to support the full apartment buying lifecycle, not only project comparison. It should help the user manage every stage from early discovery to final possession.

The journey should be structured enough to support serious financial decision-making, legal tracking, family review, negotiation, and possession readiness.

---

## 2. Core Journey Statement

The user journey can be summarized as:

> Discover projects → Capture data → Visit sites → Normalize costs → Compare units → Evaluate location → Check legal/RERA → Plan finances → Negotiate → Shortlist → Book → Track payments → Prepare for registration → Track possession readiness.

The portal should reduce dependency on memory, scattered brochures, WhatsApp messages, handwritten notes, and complex Excel sheets.

Every important decision, cost, document, follow-up, and risk should be captured in one structured system.

---

## 3. High-Level Journey Stages

The complete journey is divided into the following stages:

1. Project Discovery
2. Initial Project Entry
3. Builder Cost Sheet Import
4. Project Data Normalization
5. Site Visit Planning
6. Site Visit Execution
7. Unit-Level Financial Comparison
8. Location and Map Evaluation
9. Living Suitability Evaluation
10. Investment Evaluation
11. Legal and RERA Verification
12. Builder Follow-Up and Negotiation
13. Family and Financial Review
14. Final Shortlisting
15. Booking Decision
16. Home Loan Planning
17. Payment Milestone Tracking
18. Registration Preparation
19. Possession Readiness
20. Final Handover and Closure

---

# Stage 1: Project Discovery

## 1.1 Objective

The first stage is to capture every project that may be worth evaluating.

The user may discover projects through:

* Builder websites
* Real estate portals
* Site visits
* Friends and family references
* Broker recommendations
* Newspaper ads
* Social media ads
* Drive-by discovery
* WhatsApp forwards
* Existing Excel research
* RERA listings
* Map exploration

The portal should make it easy to add a project even when very little information is available.

## 1.2 Minimum Data to Capture

At discovery stage, the user may only know:

* Project name
* Builder name
* Approximate location
* BHK types available
* Indicative price range
* Possession status
* Contact person
* Source of information
* Initial impression
* Whether it is for living, investment, or both

## 1.3 Expected Portal Behavior

The portal should allow creating a “New Lead” project with incomplete data.

The project should be marked as:

* New Lead
* Data Pending
* Site Visit Required

Missing values should not block saving the project.

## 1.4 Key User Questions

At this stage, the portal should help answer:

* Is this project worth tracking?
* Which area is it in?
* Which builder is behind it?
* What is the starting price?
* Is it relevant to my budget?
* Is it relevant for living, investment, or both?
* Should I plan a visit?

---

# Stage 2: Initial Project Entry

## 2.1 Objective

Once a project looks relevant, the user should enter structured project-level details.

## 2.2 Project-Level Data

Capture:

* Project name
* Builder name
* City
* Zone
* Micro-market
* Address
* Location pin
* RERA number
* Project stage
* Total land area
* Total units
* Number of towers
* Number of floors
* BHK configurations
* Possession date
* Current construction status
* Sales contact
* Source of lead
* Project notes

## 2.3 Expected Portal Behavior

The portal should create a project profile page.

The profile page should show:

* Project summary
* Status
* Missing data
* Available units
* Documents collected
* Follow-up tasks
* Site visit history
* Decision status

## 2.4 Key User Questions

* What do I know about this project?
* What is still missing?
* Have I collected the cost sheet?
* Have I visited the site?
* Is the RERA number known?
* Is this project worth moving to detailed comparison?

---

# Stage 3: Builder Cost Sheet Import

## 3.1 Objective

The user already has builder pricing information in Excel or image-derived tables. The portal should eventually import this data and map it to the normalized schema.

## 3.2 Input Sources

Supported or future-supported sources:

* Excel workbook
* CSV
* Manually entered cost sheet
* PDF-extracted data
* Image-extracted data
* Builder brochure
* WhatsApp shared quotation
* Site visit handwritten notes

## 3.3 Initial Seed Workbook

The first implementation will use the existing Excel workbook containing:

* The Earthscape
* DSR Courtyard
* Myhna Orchid
* DSR The Address
* Sanjeevini Adwaith / The Adwaith

## 3.4 Import Goal

The import process should convert different builder pricing formats into the portal’s common schema.

Examples:

* One builder may show BWSSB separately.
* Another may bundle BWSSB into infrastructure.
* One builder may show car parking separately.
* Another may include it in the total price.
* One builder may show maintenance as per sq.ft per month.
* Another may show it as a lump sum.
* One builder may provide carpet area.
* Another may only provide SBA.

The portal should preserve source data but also map it into normalized fields.

## 3.5 Expected Portal Behavior

After import, the portal should:

* Create projects if they do not already exist.
* Create units under each project.
* Map available cost heads.
* Set missing values to blank or zero safely.
* Flag missing critical data.
* Show source tab/source row if available.
* Allow manual correction.

## 3.6 Key User Questions

* Did the import correctly capture the builder data?
* Which fields are missing?
* Which costs are bundled?
* Which costs are separate?
* Which data needs validation during site visit?

---

# Stage 4: Project Data Normalization

## 4.1 Objective

Normalize all builder formats into one decision-ready structure.

## 4.2 Why Normalization Matters

Builders quote differently. Direct comparison without normalization can be misleading.

For example:

* Project A may quote ₹10,000 per sq.ft but include parking.
* Project B may quote ₹9,500 per sq.ft but add parking, clubhouse, and infrastructure separately.
* Project C may show GST separately.
* Project D may include some statutory charges but exclude corpus and maintenance.
* Project E may show carpet area clearly while another does not.

The portal must normalize all such formats into common cost categories.

## 4.3 Normalized Cost Buckets

The portal should map costs into:

* Basic flat cost
* Car parking
* Clubhouse and amenities
* Infrastructure
* BWSSB
* BESCOM
* Power backup
* EV charging
* PLC
* Floor rise
* Legal
* Franking
* GST
* Stamp duty
* Registration
* Corpus
* Maintenance
* Gas
* Possession charges
* Interiors
* Move-in cost

## 4.4 Expected Portal Behavior

The portal should show both:

1. Builder’s original quoted structure.
2. Normalized financial structure.

This allows the user to understand what changed and why.

## 4.5 Key User Questions

* What is the actual agreement value?
* What is the total landing cost?
* What is the true cost per SBA sq.ft?
* What is the true cost per carpet sq.ft?
* What charges are missing?
* What charges are unusually high?
* Which builder is more transparent?

---

# Stage 5: Site Visit Planning

## 5.1 Objective

Before visiting a project, the portal should help the user plan what to check.

## 5.2 Pre-Visit Preparation

The portal should show:

* Project details
* Location map
* Sales contact
* Appointment date/time
* Pending questions
* Missing cost fields
* Documents to collect
* Parking questions
* Legal questions
* Construction status questions
* Unit options to inspect

## 5.3 Visit Planning Checklist

Before visit, the user should know:

* Which units to ask about
* What is the budget range
* What floor/facing preference to check
* What parking details to confirm
* What documents to request
* What hidden charges to ask for
* What negotiation points to raise
* What family concerns to observe

## 5.4 Expected Portal Behavior

The portal should generate a “Visit Plan” for each project.

The visit plan should include:

* Missing data checklist
* Questions to ask builder
* Documents to collect
* Financial items to verify
* Site observations to capture

## 5.5 Key User Questions

* What do I need to ask during the visit?
* What is still unknown?
* Which unit should I evaluate?
* Which cost heads need confirmation?
* Which documents should I collect?

---

# Stage 6: Site Visit Execution

## 6.1 Objective

During or after the site visit, the user should capture structured observations.

## 6.2 Data to Capture

The site visit should capture:

* Visit date
* Salesperson name
* Salesperson phone/email
* Units discussed
* Current quote
* Negotiated quote
* Payment schedule
* Parking details
* Legal/RERA answers
* Construction status
* Amenities status
* Model flat observations
* Actual flat observations
* Location access observations
* Traffic observations
* Water/power information
* Documents collected
* Follow-up items
* Final visit outcome

## 6.3 Checklist-Based Capture

Each item should support:

* Status
* Notes
* Risk flag
* Follow-up owner
* Follow-up date

Possible statuses:

* Not Checked
* Checked
* Needs Follow-up
* Risk
* Not Applicable

## 6.4 Expected Portal Behavior

The portal should allow the user to record multiple visits per project.

Each visit should remain historically available.

New information from the visit should be usable to update the project and unit data.

## 6.5 Key User Questions

* What did the builder promise?
* What did I verify?
* What is still pending?
* What risks did I observe?
* Should I continue evaluating this project?
* Should I revisit with family?

---

# Stage 7: Unit-Level Financial Comparison

## 7.1 Objective

The user should compare specific units, not just projects.

A project can have multiple unit options with different:

* BHK
* SBA
* Carpet area
* Floor
* Facing
* Tower
* View
* Floor rise
* PLC
* Parking allocation
* Price
* Possession timing

## 7.2 Unit Comparison Metrics

Each unit should be compared on:

* BHK
* SBA
* Carpet area
* RERA efficiency
* Balcony/utility area
* Facing
* Floor
* Unit number
* Base rate
* Basic cost
* Agreement value
* GST
* Registration
* Legal/franking
* Corpus
* Maintenance
* Parking
* Interiors budget
* Total landing cost
* True SBA cost
* True carpet cost
* EMI estimate
* Possession date
* Living score
* Investment score

## 7.3 Expected Portal Behavior

The portal should allow:

* Selecting units for comparison
* Comparing units side-by-side
* Marking units as shortlisted
* Marking units as rejected
* Capturing rejection reason
* Duplicating a unit and editing floor/facing/quote
* Comparing multiple units from the same project

## 7.4 Key User Questions

* Which specific unit gives better value?
* Is a higher-floor unit worth the floor rise?
* Is a larger unit worth the incremental cost?
* Is a 3BHK Plus better than a 3.5BHK?
* Which unit has better liveable-space efficiency?
* Which unit is better for long-term resale?

---

# Stage 8: Location and Map Evaluation

## 8.1 Objective

Location should be evaluated visually and analytically.

The portal should show where each project is located relative to:

* Current residence
* Workplace
* Metro station
* ORR
* Schools
* Hospitals
* Major roads
* Known traffic bottlenecks
* Future infrastructure

## 8.2 Map Features

The map should support:

* Project pins
* Project cards on pin click
* Current residence marker
* Workplace marker
* Coverage circles
* Zone filters
* Area filters
* Fallback list for projects without coordinates

Coverage circles:

* 3 km
* 5 km
* 10 km
* 15 km

## 8.3 Location Metrics

Capture:

* Distance to current residence
* Distance to workplace
* Distance to metro
* Distance to ORR
* Distance to school
* Distance to hospital
* Peak commute time
* Non-peak commute time
* Road access quality
* Waterlogging risk
* Surrounding development
* Rental demand
* Social infrastructure
* Future infra upside

## 8.4 Expected Portal Behavior

The map should help the user understand:

* Which projects are clustered together
* Which are farther away
* Which areas are more convenient
* Which areas are better for future appreciation
* Which projects may be inconvenient despite good pricing

## 8.5 Key User Questions

* Which project is best located for daily life?
* Which project is best positioned for future growth?
* How far is it from workplace?
* How far is it from metro?
* Is the location suitable for family living?
* Is the area good for rental demand?

---

# Stage 9: Living Suitability Evaluation

## 9.1 Objective

The Living Score should evaluate whether the project is suitable as a future family home.

## 9.2 Living Evaluation Factors

Capture and score:

* Commute convenience
* Metro proximity
* Road access
* Family comfort
* Unit size suitability
* Carpet efficiency
* Ventilation
* Natural light
* Balcony usability
* Parking adequacy
* School access
* Hospital access
* Retail/grocery access
* Water source
* Power backup
* Project density
* Open space
* Amenities
* Builder quality
* Possession confidence
* Budget comfort

## 9.3 Expected Portal Behavior

The portal should calculate a Living Score from 0 to 100.

The score should show:

* Overall score
* Parameter-wise breakdown
* Strengths
* Weaknesses
* Risks
* Notes

## 9.4 Key User Questions

* Can I realistically live here?
* Will this work for my family?
* Is commute manageable?
* Is the unit comfortable?
* Is parking adequate?
* Is the community good?
* Is this a better home or only a better investment?

---

# Stage 10: Investment Evaluation

## 10.1 Objective

The Investment Score should evaluate whether the project is financially attractive as an asset.

## 10.2 Investment Evaluation Factors

Capture and score:

* Entry price
* True cost per sq.ft
* True carpet cost
* Rental potential
* Expected rent
* Gross rental yield
* Net rental yield
* Appreciation potential
* Metro/infra upside
* Builder brand liquidity
* Resale demand
* Tenant demand
* Possession timeline
* Maintenance burden
* Hidden cost percentage
* Micro-market supply risk
* Exit liquidity

## 10.3 Expected Portal Behavior

The portal should calculate an Investment Score from 0 to 100.

The score should show:

* Overall score
* Yield estimate
* Appreciation assumptions
* Resale liquidity notes
* Risk indicators
* Investment recommendation

## 10.4 Key User Questions

* Is this a good investment entry price?
* What rental yield can I expect?
* Will this area appreciate?
* Will resale be easy?
* Is maintenance too high?
* Is the project better for rental income or self-use?

---

# Stage 11: Legal and RERA Verification

## 11.1 Objective

The user should not rely only on builder claims. The portal should track legal and regulatory readiness.

## 11.2 Legal Data to Capture

Capture:

* RERA registration number
* RERA possession date
* Builder promised handover date
* OC status
* CC status
* Approved plan availability
* Land title clarity
* Khata status
* Bank approvals
* Draft agreement received
* Payment schedule received
* Parking allotment clarity
* Litigation disclosure
* Phase clarity
* Delay penalty clause
* Cancellation clause

## 11.3 Expected Portal Behavior

The portal should show legal readiness status:

* Not Checked
* Partially Verified
* Verified
* Risk
* Not Applicable

## 11.4 Key User Questions

* Is the project RERA registered?
* Is the possession date realistic?
* Are OC/CC available or pending?
* Is the project approved by major banks?
* Are there legal risks?
* What must be checked before booking?

---

# Stage 12: Builder Follow-Up and Negotiation

## 12.1 Objective

The portal should track all open questions and negotiation items.

## 12.2 Follow-Up Examples

Track:

* Confirm negotiated base rate
* Confirm parking included
* Confirm second parking cost
* Confirm parking dimensions
* Confirm GST treatment
* Confirm floor rise
* Confirm PLC
* Confirm corpus
* Confirm maintenance tenure
* Confirm legal charges
* Confirm RERA date
* Confirm possession date
* Confirm payment schedule
* Confirm cancellation terms
* Confirm water source
* Confirm power backup
* Confirm clubhouse delivery
* Confirm amenities timeline

## 12.3 Negotiation Fields

Capture:

* Initial quoted price
* Negotiated base rate
* Discount amount
* Discount percentage
* Freebies offered
* Waived charges
* Payment flexibility
* Quote validity
* Salesperson commitment
* Written confirmation received
* Negotiation notes

## 12.4 Expected Portal Behavior

The portal should show:

* Open follow-ups
* Due dates
* Risk items
* Builder commitments
* Negotiation history
* Pending written confirmations

## 12.5 Key User Questions

* What did the builder agree to?
* What is pending confirmation?
* What should I ask next?
* Which costs are negotiable?
* Has the quote expired?
* Is the commitment written or verbal?

---

# Stage 13: Family and Financial Review

## 13.1 Objective

Before shortlisting or booking, the user may need to discuss with family and validate affordability.

## 13.2 Family Review Parameters

Capture:

* Spouse/family preference
* Location comfort
* Floor preference
* Facing preference
* Layout preference
* Community preference
* School/hospital convenience
* Budget comfort
* Revisit required
* Family decision notes

## 13.3 Financial Review Parameters

Capture:

* Total landing cost
* Own contribution required
* Loan component
* EMI estimate
* Monthly cash flow impact
* Registration cash requirement
* Interior budget
* Emergency buffer
* Rental assumption if investment
* Opportunity cost

## 13.4 Expected Portal Behavior

The portal should allow projects to be marked as:

* Family Review Required
* Financial Review Required
* Legal Review Required
* Ready for Shortlist

## 13.5 Key User Questions

* Can I afford this comfortably?
* What will EMI be?
* How much cash is required before possession?
* Does the family like the location and unit?
* Should this project move to final shortlist?

---

# Stage 14: Final Shortlisting

## 14.1 Objective

After enough information is collected, the portal should help shortlist the best options.

## 14.2 Shortlist Levels

Suggested shortlist statuses:

* Watchlist
* Shortlisted
* Strong Shortlist
* Negotiation
* Booking Ready
* Rejected
* On Hold

## 14.3 Shortlist Reason Codes

Examples:

* Best value
* Best location
* Best living option
* Best investment option
* Strong builder
* Good carpet efficiency
* Parking clarity
* Better negotiation possible
* Legal risk
* Too expensive
* Poor location
* Poor efficiency
* Possession risk
* Hidden costs high

## 14.4 Expected Portal Behavior

The portal should show:

* Top living options
* Top investment options
* Projects needing follow-up
* Projects rejected with reasons
* Projects ready for negotiation

## 14.5 Key User Questions

* Which project is the current best option?
* Which one is best for living?
* Which one is best for investment?
* Which one should be rejected?
* Which one needs a revisit?
* Which one is ready for negotiation?

---

# Stage 15: Booking Decision

## 15.1 Objective

Before booking, the portal should ensure all critical checks are complete.

## 15.2 Pre-Booking Checklist

Check:

* Final unit number confirmed
* Tower/floor/facing confirmed
* Final cost sheet received
* Parking allocation confirmed
* RERA verified
* Legal documents reviewed
* Payment schedule reviewed
* Cancellation clause reviewed
* Possession date confirmed
* Loan eligibility reviewed
* Own contribution planned
* Builder commitments written
* Family approval completed

## 15.3 Expected Portal Behavior

The portal should show a “Booking Readiness” checklist.

It should flag any critical missing item before booking.

## 15.4 Key User Questions

* Am I ready to book?
* What is still pending?
* Are there any red flags?
* Is the final quote locked?
* Are builder commitments documented?

---

# Stage 16: Home Loan Planning

## 16.1 Objective

The portal should help estimate financing requirements.

## 16.2 Loan Data to Capture

Capture:

* Agreement value
* Loan-to-value ratio
* Target loan amount
* Interest rate
* Tenure
* EMI
* Processing fee
* Bank name
* Sanction status
* Disbursement plan
* Own contribution
* Registration cash requirement
* Interior funding requirement

## 16.3 Expected Portal Behavior

The portal should calculate:

* Loan component
* EMI
* Own contribution
* Milestone-wise own contribution
* Milestone-wise loan disbursement
* Cash shortfall risk

## 16.4 Key User Questions

* What loan amount do I need?
* What will EMI be?
* How much upfront cash is required?
* How much is required at registration?
* Will milestone payments create cash pressure?

---

# Stage 17: Payment Milestone Tracking

## 17.1 Objective

After booking, the portal should track payment obligations.

## 17.2 Milestone Data

Each milestone should capture:

* Milestone name
* Percentage
* Amount
* GST
* TDS
* Due date
* Demand letter received
* Paid amount
* Payment date
* Own contribution
* Loan disbursement
* Receipt received
* Notes

## 17.3 Expected Portal Behavior

The portal should show:

* Total schedule percentage
* Paid amount
* Pending amount
* Upcoming payments
* Overdue items
* Cash flow chart
* Loan disbursement dependency
* Receipt tracking

## 17.4 Key User Questions

* What payment is due next?
* How much have I paid?
* How much is pending?
* Is the builder schedule adding up to 100%?
* What cash is needed in the next 3 months?

---

# Stage 18: Registration Preparation

## 18.1 Objective

Before registration, the portal should track all required documents and charges.

## 18.2 Registration Checklist

Track:

* Final agreement draft
* Sale agreement
* Stamp duty estimate
* Registration estimate
* TDS payment
* PAN details
* Aadhaar details
* Bank sanction letter
* Demand drafts
* Builder NOC
* Parking allotment
* Tax invoices
* Payment receipts
* Khata-related documents
* Legal review clearance

## 18.3 Expected Portal Behavior

The portal should show registration readiness status:

* Not Started
* In Progress
* Ready
* Completed
* Risk

## 18.4 Key User Questions

* Am I ready for registration?
* What documents are missing?
* What payments are pending?
* Has TDS been handled?
* Are legal documents reviewed?

---

# Stage 19: Possession Readiness

## 19.1 Objective

Possession should be treated as a major milestone, not a simple handover.

## 19.2 Possession Checklist

Track:

* OC received
* CC verified
* Final demand received
* Maintenance paid
* Corpus paid
* Utility connections ready
* Gas connection ready
* Water meter ready
* Electricity meter ready
* Parking slot allotted
* Access cards received
* Clubhouse access
* Snagging inspection completed
* Defects list submitted
* Defects closed
* Handover documents received
* Keys received

## 19.3 Expected Portal Behavior

The portal should show:

* Possession readiness score
* Pending builder items
* Snagging items
* Payment pending
* Document pending
* Final handover status

## 19.4 Key User Questions

* Is the unit ready for possession?
* What defects need to be fixed?
* Are utilities ready?
* Is parking allotted?
* Are all documents received?
* Can interiors start?

---

# Stage 20: Final Handover and Closure

## 20.1 Objective

After possession, the portal should close the buying journey with a complete record.

## 20.2 Closure Data

Capture:

* Final total paid
* Final total landing cost
* Final registration cost
* Final possession date
* Documents received
* Pending issues
* Interior start date
* Rental start date if investment
* Final decision notes

## 20.3 Expected Portal Behavior

The project or unit can be marked as:

* Booked
* Registered
* Possession Received
* Interior In Progress
* Ready to Occupy
* Rented
* Closed

## 20.4 Key User Questions

* What was the final total cost?
* What documents do I have?
* What is still pending?
* Is the journey complete?
* What did I learn for future investments?

---

# 21. Cross-Journey Status Model

Every project and unit should have a clear status.

Suggested statuses:

1. New Lead
2. Data Pending
3. Site Visit Planned
4. Site Visited
5. Under Comparison
6. Family Review Required
7. Financial Review Required
8. Legal Review Required
9. Shortlisted
10. Strong Shortlist
11. Negotiation
12. Booking Ready
13. Booked
14. Loan In Progress
15. Payment Tracking
16. Registration Pending
17. Registered
18. Possession Pending
19. Possession Received
20. Rejected
21. Watchlist
22. On Hold
23. Closed

---

# 22. Cross-Journey Risk Model

The portal should allow risk tagging at every stage.

Suggested risk categories:

* Financial Risk
* Legal Risk
* Possession Risk
* Builder Credibility Risk
* Location Risk
* Construction Quality Risk
* Parking Risk
* Hidden Cost Risk
* Liquidity Risk
* Rental Risk
* Family Suitability Risk
* Documentation Risk
* Negotiation Risk

Risk severity:

* Low
* Medium
* High
* Critical

---

# 23. Cross-Journey Follow-Up Model

Every open question should become a follow-up task.

Each follow-up should include:

* Project
* Unit, if applicable
* Task description
* Category
* Owner
* Due date
* Status
* Priority
* Notes
* Evidence required
* Closure date

Suggested follow-up statuses:

* Open
* In Progress
* Waiting for Builder
* Waiting for Family
* Waiting for Bank
* Waiting for Legal Review
* Closed
* Dropped

---

# 24. Key Portal Outcome

At any point, the user should be able to open the portal and know:

* Which projects are being evaluated
* Which projects are shortlisted
* Which projects are risky
* Which units are under consideration
* What the real cost is
* What data is missing
* What follow-ups are open
* What documents are pending
* Which option is best for living
* Which option is best for investment
* What action should be taken next

---

# 25. Journey Design Principle

The portal should not force the user to complete all data at once.

Real estate evaluation happens gradually.

Therefore, the system should support progressive enrichment:

1. Start with basic lead information.
2. Add cost sheet data.
3. Add site visit data.
4. Add financial details.
5. Add legal details.
6. Add negotiation details.
7. Add payment tracking.
8. Add possession tracking.

Incomplete data is expected.

The portal should make incomplete data visible, manageable, and actionable.
