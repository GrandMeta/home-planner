# 19_SKILLS_AND_ROLE_EXPECTATIONS.md

# Real Estate Decision Portal — Skills and Role Expectations

## 1. Purpose of This Document

This document defines the skills, roles, responsibilities, and quality expectations required to build the Real Estate Decision Portal.

The portal is not a simple CRUD app. It combines:

* Real estate decision workflows
* Financial calculation logic
* Data normalization
* Dashboard design
* Site visit capture
* Map/location intelligence
* Risk tracking
* Scoring models
* Local-first application architecture
* Import/export workflows
* Responsive UI

The team or developer building this system must understand that the goal is not only to create screens. The goal is to create a reliable decision cockpit for a high-value apartment purchase journey.

---

## 2. Required Role Mindset

The application should be built with the mindset of:

```text
Product Manager
+ Real Estate Analyst
+ Financial Modeler
+ UX Designer
+ Frontend Engineer
+ Data Architect
+ QA Analyst
```

Even if one person or Codex builds the first version, the implementation should reflect these disciplines.

---

# 3. Product Owner / Principal Decision Lead

## 3.1 Role Purpose

The Product Owner defines what the portal should solve, what decisions it should support, and what workflows matter most.

## 3.2 Responsibilities

The Product Owner should:

* Define project evaluation priorities.
* Decide what is important for living vs investment.
* Review dashboard usefulness.
* Validate financial logic against real builder cost sheets.
* Confirm site visit checklist coverage.
* Define what makes a project shortlist-worthy.
* Decide which missing data blocks booking readiness.
* Review UX from actual property decision perspective.
* Prioritize roadmap phases.

## 3.3 Required Skills

* Real estate buying process understanding
* Apartment cost sheet interpretation
* Practical site visit experience
* Financial decision-making
* Ability to distinguish must-have vs nice-to-have features
* Ability to review outputs critically

## 3.4 Key Deliverables

* Product vision approval
* Data model approval
* Formula logic approval
* Dashboard review
* Site visit workflow review
* Scoring model review
* Final decision-readiness review

---

# 4. UI/UX Designer

## 4.1 Role Purpose

The UI/UX Designer ensures the portal is usable, clear, calm, and decision-oriented.

The UI should not become a spreadsheet clone.

## 4.2 Responsibilities

The UI/UX Designer should design:

* Dashboard layout
* Project list experience
* Project detail structure
* Unit comparison experience
* Cost breakdown presentation
* Site visit mobile UX
* Map interaction
* Follow-up task workflow
* Missing-data and risk states
* Form structure
* Responsive behavior

## 4.3 Required Skills

* Dashboard design
* Data-heavy UI design
* Financial UX
* Responsive web design
* Form UX
* Mobile checklist UX
* Information architecture
* Progressive disclosure
* Design system thinking

## 4.4 Design Expectations

The UI should feel:

* Professional
* Clean
* Calm
* Structured
* Analytical
* Trustworthy
* Premium but not flashy

Avoid:

* Real estate marketing look
* Broker-listing style cards
* Heavy visual clutter
* Excessive colors
* Decorative animations
* Dense unstructured forms
* Excel-like raw grids

## 4.5 Key Deliverables

* Page layouts
* Dashboard hierarchy
* Component usage patterns
* Form grouping
* Mobile site visit design
* Badge and risk-state treatment
* Empty/error state design
* Responsive behavior review

---

# 5. Frontend Engineer

## 5.1 Role Purpose

The Frontend Engineer builds the application using clean, typed, maintainable React/Next.js architecture.

## 5.2 Responsibilities

The Frontend Engineer should:

* Create the Next.js app structure.
* Implement routes.
* Build reusable components.
* Implement local state management.
* Integrate formula utilities.
* Build forms.
* Build tables.
* Build dashboards.
* Build map view.
* Build import/export features.
* Ensure responsive behavior.
* Maintain TypeScript quality.
* Prevent runtime errors from missing data.

## 5.3 Required Skills

* Next.js App Router
* TypeScript
* React
* Tailwind CSS
* Component architecture
* State management with Zustand
* React Hook Form
* Zod validation
* TanStack Table
* Recharts
* Leaflet integration
* Local persistence
* JSON import/export
* Responsive UI development

## 5.4 Engineering Expectations

The frontend must:

* Use centralized types.
* Use reusable components.
* Keep formulas outside UI.
* Keep scoring outside UI.
* Keep validation outside UI.
* Handle missing values safely.
* Avoid `NaN`, `undefined`, and misleading zero displays.
* Use Indian currency formatting.
* Preserve local data.
* Build cleanly without TypeScript errors.

## 5.5 Key Deliverables

* App shell
* Routes
* Component library
* Forms
* Tables
* Dashboard
* Project pages
* Comparison page
* Site visit checklist
* Map page
* Settings page
* Import/export
* Responsive UI

---

# 6. Data Architect

## 6.1 Role Purpose

The Data Architect ensures that the portal’s data model is clean, extensible, and suitable for future backend migration.

## 6.2 Responsibilities

The Data Architect should:

* Define data entities.
* Maintain normalized schema.
* Separate project-level and unit-level fields.
* Define source/confidence metadata.
* Define validation rules.
* Define JSON Project Pack format.
* Ensure import/export consistency.
* Protect verified data from accidental overwrite.
* Support future backend migration.

## 6.3 Required Skills

* Data modeling
* JSON schema thinking
* TypeScript types
* Validation design
* Entity relationship modeling
* Local-first data architecture
* Import/export design
* Versioning and migration thinking

## 6.4 Key Principles

The data model should:

* Avoid Excel dependency.
* Use JSON as canonical format.
* Support partial data.
* Support multiple units per project.
* Support multiple visits per project.
* Support follow-ups and documents.
* Support future backend tables.
* Preserve confidence and source of important values.

## 6.5 Key Deliverables

* TypeScript schema
* Zod schemas
* Project Pack format
* Store structure
* Validation model
* Data completeness model
* Conflict resolution rules

---

# 7. Financial Logic / Real Estate Calculation Specialist

## 7.1 Role Purpose

This role validates the financial engine and ensures cost calculations are correct, transparent, and not misleading.

## 7.2 Responsibilities

The Financial Logic Specialist should verify:

* Basic flat cost
* Agreement value
* GST
* TDS
* Stamp duty
* Registration fee
* Agreement registration
* Franking/e-stamping
* Khata/mutation
* Bank/MODT assumptions
* Corpus
* Advance maintenance
* Possession charges
* Interior budget
* Total landing cost
* True SBA cost
* True carpet cost
* Hidden cost percentage
* EMI
* Rental yield
* Payment milestones

## 7.3 Required Skills

* Real estate cost sheet interpretation
* Home purchase cost components
* Financial modeling
* EMI calculations
* Rental yield calculations
* Scenario modeling
* Attention to statutory and hidden charges
* Ability to distinguish cost vs cash-flow item

## 7.4 Critical Expectations

The system must not:

* Add TDS as an extra cost by default.
* Hide GST treatment.
* Combine stamp duty and registration without detail.
* Treat missing values as genuine zero in UI.
* Ignore parking cost.
* Ignore corpus and maintenance.
* Ignore interiors and move-in costs.
* Show true carpet cost without carpet area.
* Hardcode statutory rates permanently.

## 7.5 Key Deliverables

* Formula review
* Formula test cases
* Cost-layer verification
* Payment schedule validation
* Financial dashboard review
* Hidden cost review

---

# 8. UI Component Engineer

## 8.1 Role Purpose

The UI Component Engineer builds reusable visual components based on the design system.

## 8.2 Responsibilities

This role should implement:

* KPI cards
* Project cards
* Unit cards
* Risk cards
* Follow-up cards
* Status badges
* Risk badges
* Missing-data badges
* Money display components
* Score display components
* Tables
* Form sections
* Cost breakdown panels
* Site visit checklist items
* Map popup cards
* Import/export dialogs

## 8.3 Required Skills

* React component design
* Props typing
* Tailwind CSS
* Accessibility basics
* Responsive design
* Reusable UI patterns
* Design token discipline

## 8.4 Component Quality Bar

Components should:

* Be reusable.
* Be typed.
* Handle missing values.
* Avoid duplicating formatting logic.
* Follow visual design system.
* Work on mobile where relevant.
* Include accessible labels where interactive.

---

# 9. QA / Test Engineer

## 9.1 Role Purpose

The QA Engineer ensures the portal is reliable enough for high-value decision-making.

## 9.2 Responsibilities

The QA Engineer should test:

* Formula correctness
* Missing-data behavior
* TypeScript build
* Data persistence
* JSON import/export
* Project creation
* Unit creation
* Cost editing
* Parking editing
* Site visit checklist
* Follow-up creation
* Dashboard accuracy
* Comparison accuracy
* Map stability
* Responsive behavior
* Accessibility basics

## 9.3 Required Skills

* Manual QA
* Formula test validation
* UI workflow testing
* Data validation testing
* Responsive testing
* Accessibility testing
* Regression testing

## 9.4 Critical QA Focus

The most important QA areas are:

1. Total landing cost correctness
2. True carpet cost correctness
3. Missing data visibility
4. Parking clarity
5. Legal/RERA visibility
6. Local persistence
7. Import/export safety
8. Site visit mobile usability
9. Score separation between living and investment

## 9.5 Key Deliverables

* QA checklist execution
* Bug report
* Formula test confirmation
* Regression pass
* Responsive review
* Final release readiness review

---

# 10. Codex Operator / AI Development Lead

## 10.1 Role Purpose

The Codex Operator guides Codex through controlled implementation phases.

The operator must not give one giant prompt and expect the whole application to be built correctly.

## 10.2 Responsibilities

The Codex Operator should:

* Provide the docs to Codex.
* Run prompts phase by phase.
* Review generated code.
* Test after each phase.
* Fix issues before moving forward.
* Prevent schema drift.
* Prevent duplicated logic.
* Keep implementation aligned with docs.
* Ensure build passes.
* Ensure core workflows work.

## 10.3 Required Skills

* Prompt engineering
* Code review
* Product understanding
* TypeScript/React familiarity
* Ability to debug Codex output
* Ability to test incrementally
* Ability to prevent overbuilding

## 10.4 Codex Usage Rules

Codex should be instructed to:

* Read `/docs`.
* Build incrementally.
* Avoid inventing product behavior.
* Keep formulas separate.
* Keep UI reusable.
* Use local-first state.
* Avoid paid APIs.
* Avoid Excel-first architecture.
* Avoid hardcoding seed data.
* Test before moving forward.

## 10.5 Key Deliverables

* Prompt execution sequence
* Phase-wise code review
* Build verification
* Bug-fix prompts
* Final release checklist

---

# 11. Product Analyst / Real Estate Research Support

## 11.1 Role Purpose

This role supports gathering and entering real estate data into the portal.

## 11.2 Responsibilities

The Product Analyst should:

* Add new projects.
* Collect builder information.
* Capture cost sheets.
* Enter unit details.
* Capture location data.
* Record parking details.
* Collect RERA information.
* Add documents.
* Track follow-ups.
* Capture site visit observations.
* Update project statuses.
* Maintain micro-market notes.

## 11.3 Required Skills

* Real estate research
* Data entry discipline
* Cost sheet reading
* Builder communication tracking
* Site visit documentation
* Follow-up management

## 11.4 Key Deliverables

* Clean project records
* Updated cost details
* Site visit notes
* Follow-up tasks
* Document records
* Area notes

---

# 12. Role Mapping by Build Phase

## 12.1 Phase 1 — App Scaffold

Main roles:

* Frontend Engineer
* Codex Operator

Supporting roles:

* Product Owner

## 12.2 Phase 2 — Types and Schema

Main roles:

* Data Architect
* Frontend Engineer

Supporting roles:

* Product Owner
* Financial Logic Specialist

## 12.3 Phase 3 — Formula Engine

Main roles:

* Financial Logic Specialist
* Frontend Engineer
* QA Engineer

Supporting roles:

* Product Owner

## 12.4 Phase 4 — Store and Seed Data

Main roles:

* Data Architect
* Frontend Engineer
* Product Analyst

Supporting roles:

* QA Engineer

## 12.5 Phase 5 — Design System and Components

Main roles:

* UI/UX Designer
* UI Component Engineer
* Frontend Engineer

Supporting roles:

* Product Owner

## 12.6 Phase 6 — Dashboard and Project Pages

Main roles:

* Frontend Engineer
* UI/UX Designer
* Product Owner

Supporting roles:

* QA Engineer

## 12.7 Phase 7 — Forms and Intake

Main roles:

* Frontend Engineer
* Data Architect
* UI/UX Designer

Supporting roles:

* Product Analyst
* QA Engineer

## 12.8 Phase 8 — Site Visit Checklist

Main roles:

* UI/UX Designer
* Frontend Engineer
* Product Owner

Supporting roles:

* Product Analyst
* QA Engineer

## 12.9 Phase 9 — Map and Location

Main roles:

* Frontend Engineer
* UI/UX Designer
* Product Analyst

Supporting roles:

* Product Owner

## 12.10 Phase 10 — Scoring

Main roles:

* Product Owner
* Financial Logic Specialist
* Frontend Engineer
* QA Engineer

Supporting roles:

* Data Architect

## 12.11 Phase 11 — Import/Export

Main roles:

* Frontend Engineer
* Data Architect
* QA Engineer

Supporting roles:

* Codex Operator

## 12.12 Phase 12 — Final QA and Polish

Main roles:

* QA Engineer
* UI/UX Designer
* Product Owner
* Codex Operator

Supporting roles:

* Frontend Engineer

---

# 13. Skill Expectations by Feature Area

## 13.1 Dashboard

Needs:

* Information hierarchy
* Financial KPI presentation
* Risk surfacing
* Missing-data visibility
* Table design
* Derived data logic

## 13.2 Project and Unit Pages

Needs:

* Form design
* Data modeling
* Cost display
* Tab structure
* Progressive enrichment
* Detail-page UX

## 13.3 Financial Engine

Needs:

* Pure TypeScript functions
* Formula testing
* Null safety
* Settings-driven assumptions
* Manual override logic

## 13.4 Site Visit Checklist

Needs:

* Mobile-first interaction design
* Checklist architecture
* Follow-up generation
* Quick note capture
* Decision outcome design

## 13.5 Map

Needs:

* Leaflet integration
* SSR-safe dynamic loading
* Marker logic
* Fallback list
* Location scoring inputs

## 13.6 Scoring

Needs:

* Weighted scoring
* Confidence calculation
* Risk caps
* Explainability
* Separation of living and investment logic

## 13.7 Import/Export

Needs:

* JSON schema validation
* Conflict handling
* Backup/restore logic
* CSV generation
* Error-state design

---

# 14. Minimum Viable Team

For a first usable local version, the minimum practical team can be:

```text
1 Product Owner / Decision Lead
1 Frontend Engineer
1 UI/UX Designer, part-time
1 QA Reviewer, part-time
Codex as implementation accelerator
```

If one person is doing all roles, they must consciously switch between:

* Product thinking
* Design thinking
* Engineering thinking
* QA thinking

---

# 15. Ideal Team

For a polished version, the ideal team is:

```text
Product Owner / Principal Lead
UI/UX Designer
Frontend Engineer
Data / Financial Modeler
QA Engineer
Codex Operator
```

Optional later:

```text
Backend Engineer
AI Extraction Engineer
GIS / Map Data Specialist
Real Estate Legal Advisor
```

---

# 16. What Not to Do

The team should avoid:

1. Building everything in one prompt.
2. Starting with backend/cloud before local version works.
3. Making Excel the primary system.
4. Hardcoding only the first five projects.
5. Hiding formulas inside UI components.
6. Showing missing values as zero.
7. Merging living and investment into one score.
8. Treating parking as a minor field.
9. Treating legal/RERA as optional.
10. Overdesigning the UI with decorative elements.
11. Adding paid APIs too early.
12. Ignoring mobile site visit usage.
13. Skipping formula tests.
14. Skipping import/export backup.
15. Building a dashboard that looks good but does not aid decisions.

---

# 17. Review Checklist by Role

## 17.1 Product Owner Review

Check:

* Does the portal support the actual property journey?
* Are the right decisions visible?
* Are living and investment separated?
* Are risks visible?
* Are next actions visible?
* Is the site visit checklist practical?
* Is booking readiness strict enough?

## 17.2 UI/UX Review

Check:

* Is the UI calm and clear?
* Are pages structured well?
* Are forms not overwhelming?
* Are missing data and risks visible?
* Is mobile site visit UX usable?
* Is comparison understandable?
* Is financial hierarchy clear?

## 17.3 Engineering Review

Check:

* Is code typed?
* Are formulas isolated?
* Are components reusable?
* Is state clean?
* Are imports/exports safe?
* Is map SSR-safe?
* Are missing values handled safely?

## 17.4 Financial Review

Check:

* Is total landing cost correct?
* Is GST handled correctly?
* Is registration explicit?
* Is TDS treated correctly?
* Are possession costs included?
* Are interiors included?
* Is true carpet cost calculated correctly?
* Are hidden costs visible?

## 17.5 QA Review

Check:

* Does the app build?
* Do formulas pass tests?
* Does local persistence work?
* Does import/export work?
* Do core workflows work?
* Does mobile site visit work?
* Are critical bugs fixed?

---

# 18. First Release Quality Bar

The first usable release should satisfy:

1. Projects can be added and edited.
2. Units can be added and edited.
3. Cost details can be entered.
4. Total landing cost is calculated.
5. True SBA and true carpet costs are shown.
6. Missing data is clearly visible.
7. Parking is separately visible.
8. Legal/RERA section exists.
9. Site visits can be recorded.
10. Follow-ups can be created.
11. Documents can be tracked as metadata.
12. Units can be compared.
13. JSON backup/export works.
14. JSON import works.
15. Settings persist.
16. Dashboard gives clear next actions.
17. Mobile site visit checklist is usable.
18. Living and investment scores are separate.
19. Formula tests cover critical calculations.
20. No major data-loss risk exists.

---

# 19. Future Skill Requirements

Future versions may require additional skills.

## 19.1 AI Document Extraction

Needed for:

* Builder cost sheet image extraction
* PDF parsing
* Floor plan extraction
* RERA document reading

Skills:

* OCR/document AI
* JSON extraction
* Human-in-the-loop review UX
* Confidence scoring

## 19.2 Backend and Cloud Sync

Needed for:

* Multi-device access
* Authentication
* Cloud backup
* Document storage

Skills:

* Backend architecture
* Database design
* Authentication
* Security
* API design

## 19.3 GIS and Location Intelligence

Needed for:

* Route distance
* Traffic estimate
* Metro overlays
* School/hospital data
* Rental heatmaps
* Flood/waterlogging layers

Skills:

* Maps APIs
* Geocoding
* Geospatial data
* Location scoring

## 19.4 Legal and Real Estate Advisory

Needed for:

* Legal document checklist refinement
* Agreement review workflow
* RERA interpretation
* Registration process refinement

Skills:

* Real estate legal process
* Karnataka property documentation
* Builder agreement review
* Possession/handover documentation

---

# 20. Final Role Principle

This portal should be built with discipline.

It is not a casual property list.

It is a structured personal decision system for one of the largest financial decisions a person can make.

The required mindset is:

```text
Capture truth.
Expose hidden cost.
Show missing data.
Track risk.
Separate living from investment.
Guide next action.
Protect the decision.
```

Every role, every component, every formula, and every screen should support that principle.
