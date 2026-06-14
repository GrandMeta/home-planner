# 05_DATA_INGESTION_AND_PROJECT_INTAKE.md

# Real Estate Decision Portal — Data Ingestion and Project Intake

## 1. Purpose of This Document

This document defines how project, unit, cost, legal, location, parking, and site visit information should enter the Real Estate Decision Portal.

The portal should not depend on Excel as the long-term workflow.

Excel may be used only for:

1. Initial migration of seed data.
2. Backup export.
3. Sharing comparison tables externally.
4. Offline analysis, if required.

The long-term source of truth should be the portal’s structured data model.

The preferred future intake methods are:

1. Manual project entry form.
2. Structured JSON import.
3. Site visit checklist form.
4. Cost sheet/document extraction.
5. Online enrichment.
6. Follow-up updates.
7. Possession-stage updates.

---

## 2. Core Data Philosophy

The portal should follow this principle:

> Excel is an input/output convenience. JSON and the application database are the source of truth.

The application should store data in a structured format that matches the normalized schema defined in:

* `02_DATA_DICTIONARY.md`
* `03_PROJECT_AND_UNIT_SCHEMA.md`
* `04_FINANCIAL_FORMULAS.md`

This avoids being locked into spreadsheets.

---

## 3. Recommended Long-Term Workflow

The recommended project intake journey is:

```text
Project Lead
→ Basic Project Form
→ Unit Form
→ Cost Breakup Form
→ Parking Form
→ Legal/RERA Form
→ Location Form
→ Amenities Form
→ Site Visit Checklist
→ Financial Calculation
→ Comparison Dashboard
→ Follow-Up Tracker
→ Shortlist / Rejection
→ Booking / Possession Tracker
```

The user should be able to start with minimum information and progressively enrich the project.

---

# 4. Intake Method 1: Manual Project Form

## 4.1 Purpose

The manual project form should be the primary way to add new projects.

The user may discover a project from a builder website, broker, ad, real estate portal, drive-by visit, family reference, or site visit.

At the early stage, the user may not have all details.

The form should allow incomplete data.

## 4.2 Minimum Required Fields

To create a project, only the following fields should be required:

* Project name
* Builder name
* City
* City zone
* Project purpose tag
* Status

Default values:

```text
City = Bangalore
City Zone = East Bangalore, unless changed
Project Purpose = Undecided
Status = New Lead
```

## 4.3 Recommended Optional Fields

The form should also allow entering:

* Micro-market
* Locality
* Address
* RERA number
* Indicative price range
* Available BHKs
* Possession timeline
* Contact person
* Source of lead
* Notes

## 4.4 Expected UI Behavior

After submission:

* A project page should be created.
* Project status should be “New Lead” or “Data Pending”.
* Missing important fields should be shown.
* The user should be guided to add units, cost details, and site visit data.

---

# 5. Intake Method 2: Unit Entry Form

## 5.1 Purpose

Every project can have multiple units.

The portal must support comparing specific units, not only projects.

## 5.2 Unit Entry Fields

The unit form should capture:

* BHK configuration
* Unit type
* Tower / wing
* Floor number
* Unit number
* Facing
* View type
* Corner unit flag
* Premium unit flag
* SBA
* Carpet area
* Balcony / utility area
* External wall area
* Unit notes

## 5.3 Minimum Required Fields

To create a unit:

* Project
* BHK configuration
* SBA or approximate SBA

Everything else may be added later.

## 5.4 Expected UI Behavior

After unit creation:

* The unit should appear under the project page.
* The unit should be available for comparison.
* Missing cost, carpet, parking, and legal fields should be flagged.

---

# 6. Intake Method 3: Cost Breakup Form

## 6.1 Purpose

The cost breakup form is used to normalize builder pricing.

Different builders present costs differently. The form should capture all possible cost heads, while allowing blanks and bundled values.

## 6.2 Cost Sections

The form should be divided into:

1. Basic Cost
2. Core Builder Charges
3. Parking
4. GST
5. Stamp Duty and Registration
6. Legal and Documentation
7. Corpus and Maintenance
8. Possession Charges
9. Interiors and Move-in Budget
10. Loan and EMI Assumptions

## 6.3 Cost Treatment

Every cost field should support treatment:

* Separate
* Included
* Bundled
* Not Applicable
* Unknown
* Estimated
* Manual Override

## 6.4 Example

If parking is included but not separately priced:

```json
{
  "carParkingCharges": {
    "amount": 0,
    "currency": "INR",
    "treatment": "Included",
    "notes": "Parking included in builder quote but not separately disclosed."
  }
}
```

If EV charger cost is unknown:

```json
{
  "evChargerProvisionCharges": {
    "amount": 0,
    "currency": "INR",
    "treatment": "Unknown",
    "notes": "Confirm EV charging cost during site visit."
  }
}
```

---

# 7. Intake Method 4: Structured JSON Import

## 7.1 Purpose

Structured JSON should become the preferred bulk import format.

Instead of relying on Excel, the portal should support importing a validated JSON file.

This is useful when:

* Data is prepared externally.
* AI extracts data from images or PDFs.
* Multiple projects are added at once.
* The user wants to back up and restore data.
* Another system generates project data.

## 7.2 JSON Structure

The JSON should support:

```json
{
  "version": "1.0",
  "source": "manual-prepared-json",
  "createdAt": "2026-06-14",
  "projects": []
}
```

Each project should include:

```json
{
  "projectName": "",
  "builderName": "",
  "projectPurposeTag": "",
  "city": "Bangalore",
  "cityZone": "",
  "microMarket": "",
  "locationInfo": {},
  "legalInfo": {},
  "amenities": [],
  "units": [],
  "siteVisits": [],
  "documents": [],
  "followUps": []
}
```

Each unit should include:

```json
{
  "bhkConfiguration": "",
  "towerOrWing": "",
  "floorNumber": null,
  "unitNumber": "",
  "facing": "",
  "spaceDetails": {},
  "costBreakup": {},
  "statutoryCharges": {},
  "maintenancePossessionCosts": {},
  "postPossessionBudget": {},
  "parkingDetails": {},
  "financialPlan": {},
  "investmentAssumptions": {},
  "livingSuitability": {},
  "scoreCard": {}
}
```

## 7.3 Validation Requirement

JSON import must validate:

* Required project fields
* Required unit fields
* Numeric field types
* Date formats
* Enum values
* Cost treatment values
* Formula dependencies

Invalid data should not crash the app.

The import screen should show:

* Import success
* Import warnings
* Import errors
* Fields requiring manual review

## 7.4 Recommended Validation Library

When implemented in TypeScript, use a schema validation library such as:

* Zod
* Valibot
* Yup

Preferred: **Zod**

---

# 8. Intake Method 5: Site Visit Checklist

## 8.1 Purpose

The site visit checklist should become the main method for enriching project data after physical visits.

During visits, the user may collect:

* Updated quote
* Unit availability
* Parking confirmation
* Hidden charges
* Legal answers
* Amenities status
* Construction quality observations
* Location observations
* Salesperson commitments
* Documents
* Follow-up items

## 8.2 Site Visit Data Flow

```text
Site Visit Form
→ Checklist Items
→ Follow-Up Tasks
→ Project Updates
→ Unit Updates
→ Cost Recalculation
→ Dashboard Refresh
```

## 8.3 Checklist Result Options

Each checklist item should support:

* Not Checked
* Checked
* Needs Follow-up
* Risk
* Not Applicable

## 8.4 Updating Master Data

The site visit form should allow certain fields to update the master project/unit record.

Example:

If the salesperson confirms second parking cost:

* Update ParkingDetails
* Add note
* Create data confidence as “Site Visit Confirmed”
* Recalculate total landing cost

If written proof is required:

* Create FollowUpTask
* Mark evidenceRequired as true

---

# 9. Intake Method 6: Document, Image, and PDF Extraction

## 9.1 Purpose

In the future, the user may upload:

* Builder cost sheet image
* PDF brochure
* Excel cost sheet
* WhatsApp screenshot
* Floor plan image
* RERA certificate
* Payment schedule PDF

The portal should eventually support AI-assisted extraction from these documents.

## 9.2 Extraction Workflow

Recommended flow:

```text
Upload Document/Image/PDF
→ Extract Raw Data
→ Map to Normalized Schema
→ Show Review Screen
→ User Confirms / Edits
→ Save to Project
```

## 9.3 Human Review Required

AI extraction should not directly update final data without user review.

The portal should show:

* Extracted value
* Suggested schema field
* Confidence
* Source document
* User confirmation required

## 9.4 Example

If the uploaded builder image contains:

```text
Base Rate: ₹9,599
Car Parking: ₹3,00,000
Legal: ₹40,000
Maintenance: ₹4 per sq.ft per month for 24 months
```

The review screen should map:

```json
{
  "basePricePerSqft": 9599,
  "carParkingCharges": 300000,
  "legalDocumentationCharges": 40000,
  "advanceMaintenanceRatePerSqftPerMonth": 4,
  "advanceMaintenanceTenureMonths": 24
}
```

The user should approve before saving.

---

# 10. Intake Method 7: Online Enrichment

## 10.1 Purpose

Some details can be collected from online sources.

Potential online enrichment areas:

* RERA registration information
* Builder website data
* Project address
* Map coordinates
* Distance to metro
* Distance to workplace
* Nearby schools
* Nearby hospitals
* Rental estimates
* Area/micro-market notes
* Future infrastructure notes

## 10.2 Important Rule

Online data should not automatically override user-confirmed or document-verified data.

Online data should be stored as:

```text
Source = Online
Confidence = Needs Verification
```

## 10.3 Enrichment Review

The user should review and approve online-enriched data before it becomes primary project data.

## 10.4 Map Data

For location, the portal should support:

* Manual lat/long entry
* Search by address
* Approximate pin
* Confirmed pin
* Current residence marker
* Workplace marker

---

# 11. Intake Method 8: Follow-Up Updates

## 11.1 Purpose

Many real estate details are clarified over time.

The portal should allow updating project data from follow-up responses.

Examples:

* Builder confirms parking dimensions.
* Builder sends revised quote.
* Builder confirms possession date.
* Builder shares payment schedule.
* Legal advisor confirms document risk.
* Bank confirms loan eligibility.

## 11.2 Follow-Up Update Flow

```text
Follow-Up Task
→ Response Received
→ Update Relevant Data Field
→ Attach Evidence
→ Mark Confidence
→ Close Follow-Up
```

## 11.3 Written Confirmation

If a builder confirms something only verbally, mark:

```text
Confidence = Site Visit Confirmed
```

If builder confirms in writing, mark:

```text
Confidence = Written Confirmation
```

---

# 12. Intake Method 9: Possession-Stage Updates

## 12.1 Purpose

Once a unit is booked, the portal should continue tracking progress until possession.

## 12.2 Possession Data Sources

Data may come from:

* Builder demand letters
* Payment receipts
* Construction updates
* CRM emails
* Site visits
* Registration documents
* OC/CC updates
* Handover checklist
* Snagging inspection

## 12.3 Possession Data Flow

```text
Booked Unit
→ Payment Milestones
→ Registration Preparation
→ Possession Checklist
→ Snagging
→ Final Handover
→ Closure
```

---

# 13. One-Time Excel Migration

## 13.1 Purpose

The current Excel workbook should be treated as seed data only.

The portal may include an optional Excel import utility to migrate the initial five projects.

Seed projects:

1. The Earthscape
2. DSR Courtyard
3. Myhna Orchid
4. DSR The Address
5. Sanjeevini Adwaith / The Adwaith

## 13.2 Excel Import Scope

The Excel importer is not the main future workflow.

It should support:

* Reading project tabs
* Creating projects
* Creating units
* Mapping obvious cost fields
* Flagging missing values
* Allowing manual review

## 13.3 Excel Import Review

After Excel import, the user should see a review screen:

* Imported projects
* Imported units
* Mapped fields
* Missing fields
* Warnings
* Errors
* Manual corrections needed

## 13.4 Excel Import Rule

Excel import should not overwrite existing confirmed data unless the user approves.

---

# 14. Recommended Source of Truth Hierarchy

When the same field has multiple sources, use this hierarchy:

```text
1. Legal verified document
2. Written builder confirmation
3. Official builder cost sheet
4. RERA record
5. Site visit confirmation
6. Online source
7. User estimate
8. Unknown
```

The portal should preserve source history where possible.

---

# 15. Data Confidence Model

Every important value should support confidence status.

Suggested statuses:

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

Examples:

```json
{
  "reraRegistrationNumber": {
    "value": "PRM/KA/RERA/...",
    "confidence": "Document Verified",
    "source": "RERA certificate"
  }
}
```

```json
{
  "parkingDimensions": {
    "value": "",
    "confidence": "Unknown",
    "notes": "Ask builder during next site visit."
  }
}
```

---

# 16. Data Review States

Newly ingested data should have a review state.

```text
Draft
Imported
Needs Review
Reviewed
Approved
Rejected
Superseded
```

This is important for AI extraction and online enrichment.

---

# 17. Project Intake Wizard

The portal should eventually include a guided project intake wizard.

## 17.1 Wizard Steps

1. Project Basics
2. Location
3. Builder Contact
4. Available BHKs
5. Unit Details
6. Cost Breakup
7. Parking
8. Legal/RERA
9. Amenities
10. Possession Timeline
11. Notes and Status

## 17.2 Progressive Save

The wizard should allow save-and-exit at any step.

The user should not be forced to complete all details.

## 17.3 Missing Data Summary

At the end, show:

* Completed sections
* Missing sections
* Follow-up required
* Ready for comparison: Yes / No

---

# 18. JSON Project Pack Format

The portal should support a portable JSON file called a “Project Pack”.

## 18.1 Project Pack Purpose

A Project Pack can contain:

* One project
* Multiple projects
* Multiple units
* Cost details
* Parking details
* Site visit notes
* Follow-up tasks
* Documents metadata

## 18.2 Project Pack Example

```json
{
  "projectPackVersion": "1.0",
  "packName": "East Bangalore Shortlist",
  "createdAt": "2026-06-14",
  "source": "manual",
  "projects": [
    {
      "projectName": "Example Project",
      "builderName": "Example Builder",
      "projectPurposeTag": "Both",
      "city": "Bangalore",
      "cityZone": "East Bangalore",
      "microMarket": "Varthur",
      "projectStatus": "Data Pending",
      "units": [
        {
          "bhkConfiguration": "3BHK",
          "floorNumber": 12,
          "facing": "East",
          "spaceDetails": {
            "superBuiltUpAreaSqft": 1650,
            "carpetAreaReraSqft": 1155
          },
          "costBreakup": {
            "basePricePerSqft": {
              "amount": 9500,
              "currency": "INR",
              "treatment": "Separate"
            }
          }
        }
      ]
    }
  ]
}
```

---

# 19. Form to JSON Principle

Every form in the portal should save data into the same normalized JSON structure.

Forms should not create separate incompatible data.

Example:

The parking form should update:

```text
Unit.parkingDetails
```

The cost form should update:

```text
Unit.costBreakup
Unit.statutoryCharges
Unit.maintenancePossessionCosts
Unit.postPossessionBudget
```

The site visit form should update:

```text
Project.siteVisits
ChecklistItem[]
FollowUpTask[]
```

---

# 20. Data Export Strategy

The portal should export data in multiple ways.

## 20.1 JSON Export

Primary backup/export format.

Should include:

* Projects
* Units
* Costs
* Parking
* Legal
* Location
* Site visits
* Follow-ups
* Scores
* Settings

## 20.2 CSV Export

Useful for simple comparisons.

Export options:

* Master comparison table
* Shortlisted units
* Follow-up tasks
* Site visit checklist
* Payment milestones

## 20.3 Excel Export

Useful for sharing with family, banker, or external advisor.

Excel export should generate:

* Master comparison dashboard
* Project detail sheets
* Cost breakup
* Payment schedule
* Follow-up list

Excel export is output, not the source of truth.

---

# 21. Data Import Priority

Recommended implementation priority:

## Phase 1

* Manual project form
* Manual unit form
* Manual cost form
* Local JSON persistence

## Phase 2

* JSON import/export
* Seed project JSON file
* Dashboard reads from JSON

## Phase 3

* Site visit checklist form
* Follow-up task generation

## Phase 4

* Excel migration utility for the current workbook

## Phase 5

* Document/image/PDF assisted extraction

## Phase 6

* Online enrichment and map geocoding

---

# 22. Seed Data Strategy

The initial five projects should be converted into a structured JSON seed file.

Suggested file:

```text
/data/seed-projects.json
```

This file should contain:

* The Earthscape
* DSR Courtyard
* Myhna Orchid
* DSR The Address
* Sanjeevini Adwaith / The Adwaith

The JSON may be manually prepared from the current Excel workbook.

This is better than forcing Excel parsing into the first version of the portal.

---

# 23. Recommended Implementation Decision

The best approach is:

```text
Do not make Excel import the foundation.
Use JSON as the canonical data layer.
Use forms for future data entry.
Use Excel only as migration/export.
Use AI/document extraction later as assisted intake.
```

This gives the portal a cleaner architecture and avoids spreadsheet dependency.

---

# 24. Final Principle

The portal should help the user progressively build a reliable property decision database.

A project may start with only a name and location.

After a visit, it may have quote details, parking confirmation, legal checks, and documents.

After negotiation, it may have revised costs and commitments.

After booking, it becomes a payment and possession tracker.

Therefore, the intake system must support gradual enrichment, source confidence, and structured updates over time.
