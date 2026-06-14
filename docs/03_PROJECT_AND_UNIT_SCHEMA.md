# 03_PROJECT_AND_UNIT_SCHEMA.md

# Real Estate Decision Portal — Project and Unit Schema

## 1. Purpose of This Document

This document defines the normalized data model for the Real Estate Decision Portal.

The portal must support:

* Unlimited builders
* Unlimited projects
* Multiple units per project
* Multiple cost sheets per project
* Multiple site visits per project
* Multiple payment schedules per project/unit
* Multiple documents per project/unit
* Multiple follow-ups per project/unit
* Living and investment scoring
* Future possession tracking

The schema must not be designed only around the first five seed projects.

Current seed projects are:

1. The Earthscape
2. DSR Courtyard
3. Myhna Orchid
4. DSR The Address
5. Sanjeevini Adwaith / The Adwaith

These projects are only initial data. The portal should be able to support future Bangalore projects across East, North, South, West, and Central Bangalore.

---

## 2. Schema Design Principles

### 2.1 Normalized but Practical

The schema should separate major entities clearly:

* Builder
* Project
* Unit
* CostBreakup
* ParkingDetails
* LocationInfo
* LegalInfo
* Amenity
* SiteVisit
* ChecklistItem
* PaymentMilestone
* DocumentRecord
* FollowUpTask
* ScoreCard
* DecisionStatus
* PossessionTracker

This avoids mixing everything into one large flat table.

However, the UI can still show joined views like dashboards and comparison tables.

---

### 2.2 Project-Level vs Unit-Level Data

Some data belongs to the project.

Examples:

* Builder
* RERA number
* Location
* Total towers
* Total units
* Amenities
* Legal status
* Construction status
* Project-level possession date

Some data belongs to a specific unit.

Examples:

* BHK
* SBA
* Carpet area
* Floor
* Facing
* Unit number
* Cost breakup
* Parking allocation
* Floor rise
* PLC
* Unit-specific quote
* EMI estimate
* Unit-level shortlist status

The schema must avoid duplicating project-level information unnecessarily across every unit.

---

### 2.3 Missing Data Must Be Allowed

Real estate data is incomplete during early evaluation.

The schema must allow:

* Empty text fields
* Null dates
* Unknown enum values
* Zero numeric fields for calculation safety
* Data confidence indicators
* Notes for assumptions
* Manual override flags

The application should not fail because data is missing.

---

### 2.4 Every Important Field Should Support Data Confidence

Where possible, critical fields should carry a confidence or source status.

Suggested statuses:

* Unknown
* User Estimate
* Builder Provided
* Site Visit Confirmed
* Written Confirmation
* Document Verified
* Legal Verified
* Manual Override

This is especially important for:

* Total cost
* Parking
* RERA
* Possession date
* Carpet area
* Maintenance
* Corpus
* GST
* Registration charges
* Builder commitments

---

### 2.5 Calculated Fields Should Be Transparent

Calculated fields should be stored or derived consistently.

Each calculated value should support:

* calculatedValue
* manualOverrideValue
* isManualOverride
* calculationNotes

This allows the user to override a formula when the builder gives a confirmed value.

---

# 3. Entity Relationship Overview

## 3.1 Core Relationships

```text
Builder
  └── Project
        ├── LocationInfo
        ├── LegalInfo
        ├── Amenity[]
        ├── Unit[]
        │     ├── SpaceDetails
        │     ├── CostBreakup
        │     ├── StatutoryCharges
        │     ├── ParkingDetails
        │     ├── FinancialPlan
        │     ├── InvestmentAssumptions
        │     ├── LivingSuitability
        │     ├── ScoreCard
        │     └── PossessionTracker
        ├── SiteVisit[]
        │     └── ChecklistItem[]
        ├── PaymentMilestone[]
        ├── DocumentRecord[]
        ├── FollowUpTask[]
        └── DecisionStatus
```

## 3.2 Why This Structure Matters

This structure allows the user to:

* Compare different projects.
* Compare multiple units within the same project.
* Track project-level due diligence.
* Track unit-level financial details.
* Store multiple site visit observations.
* Track legal and possession readiness.
* Handle different builder formats without breaking formulas.

---

# 4. Shared Base Fields

All major records should include the following base fields.

```text
BaseRecord {
  id: string
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
  notes?: string
}
```

## 4.1 Data Confidence Object

Use this where fields require confidence tracking.

```text
DataConfidence {
  status:
    | "Unknown"
    | "User Estimate"
    | "Builder Provided"
    | "Site Visit Confirmed"
    | "Written Confirmation"
    | "Document Verified"
    | "Legal Verified"
    | "Manual Override"

  source?: string
  sourceDate?: Date
  sourceNotes?: string
}
```

## 4.2 Money Field Object

Use this for important monetary fields where value source matters.

```text
MoneyField {
  amount: number
  currency: "INR"
  treatment:
    | "Separate"
    | "Included"
    | "Bundled"
    | "Not Applicable"
    | "Unknown"
    | "Estimated"
    | "Manual Override"

  confidence?: DataConfidence
  notes?: string
}
```

## 4.3 Calculated Money Field Object

```text
CalculatedMoneyField {
  calculatedAmount: number
  manualOverrideAmount?: number
  isManualOverride: boolean
  finalAmount: number
  currency: "INR"
  formulaName?: string
  calculationNotes?: string
}
```

## 4.4 Numeric Field Object

```text
NumericField {
  value: number | null
  unit?: string
  confidence?: DataConfidence
  notes?: string
}
```

---

# 5. Builder Schema

The Builder entity stores details about the developer.

```text
Builder {
  builderId: string

  builderName: string
  builderGroupName?: string
  builderWebsite?: string

  generalContactNumber?: string
  generalEmail?: string

  primarySalesContactName?: string
  primarySalesContactPhone?: string
  primarySalesContactEmail?: string

  crmContactName?: string
  crmContactPhone?: string
  crmContactEmail?: string

  builderCredibilityRating?: number
  pastDeliveryReputation?: string
  constructionQualityReputation?: string
  resaleLiquidityPerception?: "High" | "Medium" | "Low" | "Unknown"

  builderRiskLevel?: "Low" | "Medium" | "High" | "Critical" | "Unknown"
  builderRiskNotes?: string

  projects?: Project[]
}
```

## 5.1 Builder Usage

A builder can have many projects.

Examples:

* DSR can have DSR Courtyard and DSR The Address.
* Future DSR projects should link to the same Builder record.

---

# 6. Project Schema

The Project entity represents the residential development.

```text
Project {
  projectId: string

  projectName: string
  projectDisplayName?: string
  projectShortName?: string

  builderId?: string
  builderName: string

  projectType:
    | "Apartment"
    | "Villa"
    | "Plot"
    | "Mixed Use"
    | "Unknown"

  projectPurposeTag:
    | "Living"
    | "Investment"
    | "Both"
    | "Undecided"

  projectStatus:
    | "New Lead"
    | "Data Pending"
    | "Site Visit Planned"
    | "Site Visited"
    | "Under Comparison"
    | "Family Review Required"
    | "Financial Review Required"
    | "Legal Review Required"
    | "Watchlist"
    | "Shortlisted"
    | "Strong Shortlist"
    | "Negotiation"
    | "Booking Ready"
    | "Booked"
    | "Loan In Progress"
    | "Payment Tracking"
    | "Registration Pending"
    | "Registered"
    | "Possession Pending"
    | "Possession Received"
    | "Rejected"
    | "On Hold"
    | "Closed"

  city: string
  cityZone:
    | "East Bangalore"
    | "North Bangalore"
    | "South Bangalore"
    | "West Bangalore"
    | "Central Bangalore"
    | "Other"
    | "Unknown"

  microMarket?: string
  locality?: string
  address?: string

  sourceOfLead?: string
  sourceUrl?: string

  firstDiscoveredDate?: Date
  lastUpdatedDate?: Date

  totalLandAreaAcres?: number
  totalNumberOfUnits?: number
  totalNumberOfTowers?: number
  totalNumberOfFloors?: number
  basementLevels?: number
  openSpacePercentage?: number
  projectDensityUnitsPerAcre?: number

  phaseName?: string
  currentPhase?: string
  phaseWiseDelivery?: boolean

  towerConfiguration?: string
  liftsPerTower?: number
  serviceLiftsAvailable?: boolean
  unitsPerFloor?: number

  projectNotes?: string

  locationInfo?: LocationInfo
  legalInfo?: LegalInfo
  amenities?: Amenity[]
  units?: Unit[]
  siteVisits?: SiteVisit[]
  paymentMilestones?: PaymentMilestone[]
  documents?: DocumentRecord[]
  followUps?: FollowUpTask[]
  decisionStatus?: DecisionStatus
}
```

---

# 7. LocationInfo Schema

The LocationInfo entity stores map and commute data.

```text
LocationInfo {
  locationId: string
  projectId: string

  latitude?: number
  longitude?: number
  mapPinConfirmed?: boolean
  approximateLocationOnly?: boolean

  cityZone:
    | "East Bangalore"
    | "North Bangalore"
    | "South Bangalore"
    | "West Bangalore"
    | "Central Bangalore"
    | "Other"
    | "Unknown"

  microMarket?: string
  locality?: string
  nearestLandmark?: string

  distanceToCurrentResidenceKm?: number
  distanceToPrimaryWorkplaceKm?: number
  distanceToSecondaryWorkplaceKm?: number

  nearestFunctionalMetroStationName?: string
  distanceToNearestFunctionalMetroKm?: number

  nearestPlannedMetroStationName?: string
  distanceToNearestPlannedMetroKm?: number

  distanceToORRKm?: number
  distanceToMainRoadKm?: number
  distanceToSchoolKm?: number
  distanceToHospitalKm?: number
  distanceToAirportKm?: number

  peakCommuteTimeMinutes?: number
  nonPeakCommuteTimeMinutes?: number

  roadAccessQuality:
    | "Excellent"
    | "Good"
    | "Average"
    | "Poor"
    | "Unknown"

  roadWidth?: string
  trafficBottlenecks?: string

  floodingWaterloggingRisk:
    | "Low"
    | "Medium"
    | "High"
    | "Unknown"

  publicTransportAccess:
    | "Good"
    | "Average"
    | "Poor"
    | "Unknown"

  socialInfrastructureScore?: number
  locationGrowthPotential:
    | "High"
    | "Medium"
    | "Low"
    | "Unknown"

  rentalDemandPerception:
    | "High"
    | "Medium"
    | "Low"
    | "Unknown"

  locationNotes?: string
}
```

---

# 8. Unit Schema

The Unit entity represents a specific apartment/unit option.

One project can have many units.

```text
Unit {
  unitId: string
  projectId: string

  unitLabel?: string

  bhkConfiguration:
    | "1BHK"
    | "2BHK"
    | "2.5BHK"
    | "3BHK"
    | "3BHK Plus"
    | "3.5BHK"
    | "4BHK"
    | "Other"
    | "Unknown"

  unitType?: string
  towerOrWing?: string
  floorNumber?: number
  unitNumber?: string

  facing:
    | "East"
    | "West"
    | "North"
    | "South"
    | "North-East"
    | "North-West"
    | "South-East"
    | "South-West"
    | "Unknown"

  vastuCompliance:
    | "Good"
    | "Average"
    | "Poor"
    | "Not Checked"
    | "Unknown"

  viewType?: string
  cornerUnit?: boolean
  premiumUnit?: boolean

  selectedForComparison?: boolean

  unitDecisionStatus:
    | "New"
    | "Under Review"
    | "Selected for Comparison"
    | "Watchlist"
    | "Shortlisted"
    | "Strong Shortlist"
    | "Negotiation"
    | "Booking Ready"
    | "Booked"
    | "Rejected"
    | "On Hold"

  rejectionReasonCodes?: string[]
  shortlistReasonCodes?: string[]

  spaceDetails?: SpaceDetails
  costBreakup?: CostBreakup
  statutoryCharges?: StatutoryCharges
  maintenancePossessionCosts?: MaintenancePossessionCosts
  postPossessionBudget?: PostPossessionBudget
  parkingDetails?: ParkingDetails
  financialPlan?: FinancialPlan
  investmentAssumptions?: InvestmentAssumptions
  livingSuitability?: LivingSuitability
  scoreCard?: ScoreCard
  possessionTracker?: PossessionTracker

  unitNotes?: string
}
```

---

# 9. SpaceDetails Schema

SpaceDetails captures SBA, carpet area, balcony, utility, wall area, and efficiency.

```text
SpaceDetails {
  unitId: string

  superBuiltUpAreaSqft?: number
  carpetAreaReraSqft?: number
  carpetAreaUsableSqft?: number
  balconyUtilityAreaSqft?: number
  externalWallsAreaSqft?: number
  internalWallAreaSqft?: number
  commonAreaLoadingSqft?: number
  udsSqft?: number

  reraEfficiencyRatio?: number
  usableEfficiencyRatio?: number
  balconyPercentage?: number
  commonAreaLoadingPercentage?: number

  carpetAreaConfidence?: DataConfidence
  sbaConfidence?: DataConfidence

  spaceEfficiencyNotes?: string
}
```

## 9.1 Formula Notes

```text
reraEfficiencyRatio = carpetAreaReraSqft / superBuiltUpAreaSqft

usableEfficiencyRatio = carpetAreaUsableSqft / superBuiltUpAreaSqft

balconyPercentage = balconyUtilityAreaSqft / superBuiltUpAreaSqft
```

If SBA or carpet area is missing, the UI should show “Data Missing”.

---

# 10. CostBreakup Schema

CostBreakup captures core builder charges before statutory, registration, legal, possession, and interior costs.

```text
CostBreakup {
  costId: string
  unitId: string

  basePricePerSqft?: MoneyField
  negotiatedBasePricePerSqft?: MoneyField

  basicFlatCost?: MoneyField

  carParkingCharges?: MoneyField
  clubhouseAmenitiesMembershipFee?: MoneyField

  infrastructureDevelopmentCost?: MoneyField
  bwssbCharges?: MoneyField
  bescomCharges?: MoneyField
  powerBackupCharges?: MoneyField
  dgGeneratorCharges?: MoneyField
  stpCharges?: MoneyField
  evChargerProvisionCharges?: MoneyField

  plcCharges?: MoneyField
  cornerFlatPremium?: MoneyField
  facingPremium?: MoneyField

  floorRiseRatePerSqft?: number
  floorRiseStartFloor?: number
  floorRisePremium?: CalculatedMoneyField

  otherCoreCharges?: MoneyField

  builderQuotedCost?: MoneyField

  agreementValue?: CalculatedMoneyField

  costCompletenessScore?: number
  coreCostRiskLevel?: "Low" | "Medium" | "High" | "Critical" | "Unknown"

  coreCostNotes?: string
}
```

## 10.1 Agreement Value Formula

```text
Agreement Value =
Basic Flat Cost
+ Car Parking Charges
+ Clubhouse / Amenities Charges
+ Infrastructure Development Cost
+ BWSSB Charges
+ BESCOM Charges
+ Power Backup Charges
+ DG / Generator Charges
+ STP Charges
+ EV Charger Provision Charges
+ PLC Charges
+ Corner Flat Premium
+ Facing Premium
+ Floor Rise Premium
+ Other Core Charges
```

## 10.2 Important Cost Treatment Logic

A cost field should not only store amount. It should also indicate treatment:

* Separate
* Included
* Bundled
* Not Applicable
* Unknown
* Estimated
* Manual Override

Example:

If car parking is included but no separate cost is shown:

```text
carParkingCharges.amount = 0
carParkingCharges.treatment = "Included"
carParkingCharges.notes = "Included in builder quoted price; not separately disclosed."
```

If the builder did not mention EV charging:

```text
evChargerProvisionCharges.amount = 0
evChargerProvisionCharges.treatment = "Unknown"
```

---

# 11. StatutoryCharges Schema

This schema captures GST, TDS, stamp duty, registration, agreement registration, franking, Khata, mutation, MODT, and bank-related statutory/processing charges.

This section must be explicit because these charges can materially change the actual acquisition cost.

```text
StatutoryCharges {
  statutoryChargesId: string
  unitId: string

  gstPercentage?: number
  gstAmount?: CalculatedMoneyField
  gstIncludedInQuote?: boolean
  gstTreatment:
    | "Separate"
    | "Included"
    | "Not Applicable"
    | "Unknown"
    | "Estimated"
  gstNotes?: string

  tdsApplicable?: boolean
  tdsPercentage?: number
  tdsAmount?: CalculatedMoneyField
  tdsNotes?: string

  stampDutyPercentage?: number
  stampDutyAmount?: CalculatedMoneyField

  saleDeedRegistrationPercentage?: number
  saleDeedRegistrationAmount?: CalculatedMoneyField

  stampDutyRegistrationCharges?: CalculatedMoneyField

  agreementRegistrationCharges?: MoneyField
  frankingOrEStampingCharges?: MoneyField

  khataTransferCharges?: MoneyField
  mutationCharges?: MoneyField

  mortgageRegistrationCharges?: MoneyField
  modtCharges?: MoneyField

  bankLegalTechnicalCharges?: MoneyField
  bankProcessingFee?: MoneyField

  cessOrSurchargeCharges?: MoneyField
  otherGovernmentCharges?: MoneyField

  totalStatutoryCharges?: CalculatedMoneyField

  statutoryChargesNotes?: string
}
```

## 11.1 Important Registration Charge Categories

The portal should separately track:

1. Stamp duty
2. Sale deed registration fee
3. Agreement registration charges
4. Franking or e-stamping
5. TDS
6. Khata transfer
7. Mutation charges
8. MODT / mortgage-related charges, where applicable
9. Bank legal and technical charges
10. Bank processing fee
11. Any cess/surcharge/local body charge
12. Other government charges

## 11.2 Configurability

Statutory rates should not be permanently hardcoded.

They should come from Settings unless unit-specific override exists.

Examples:

* Default GST %
* Default stamp duty %
* Default sale deed registration %
* Default TDS %
* Default MODT %
* Default bank processing fee assumption

---

# 12. MaintenancePossessionCosts Schema

This captures costs generally payable at or near possession.

```text
MaintenancePossessionCosts {
  maintenancePossessionId: string
  unitId: string

  legalDocumentationCharges?: MoneyField

  corpusFundDeposit?: MoneyField
  corpusRatePerSqft?: number
  corpusCalculationBasis:
    | "SBA"
    | "Carpet"
    | "Lump Sum"
    | "Unknown"

  advanceMaintenanceRatePerSqftPerMonth?: number
  advanceMaintenanceTenureMonths?: number
  advanceMaintenanceLumpSum?: MoneyField
  totalAdvanceMaintenanceCost?: CalculatedMoneyField

  maintenanceGstApplicable?: boolean
  maintenanceGstAmount?: CalculatedMoneyField

  gasPipelineConnectionCharges?: MoneyField
  waterMeterCharges?: MoneyField
  electricityMeterCharges?: MoneyField
  sanitationCharges?: MoneyField
  possessionCharges?: MoneyField
  handoverCharges?: MoneyField

  totalPossessionSunkCost?: CalculatedMoneyField

  maintenancePossessionNotes?: string
}
```

## 12.1 Formula Notes

```text
Total Advance Maintenance Cost =
SBA × Maintenance Rate per Sq.Ft per Month × Tenure in Months
```

If builder gives maintenance as a lump sum, use the lump sum and mark formula as manual override.

---

# 13. PostPossessionBudget Schema

This captures interior, appliance, and move-in cost assumptions.

```text
PostPossessionBudget {
  postPossessionBudgetId: string
  unitId: string

  estimatedInteriorFitOutBudget?: MoneyField
  estimatedApplianceBudget?: MoneyField
  estimatedMoveInBudget?: MoneyField
  estimatedRepairModificationBudget?: MoneyField
  estimatedRentalReadinessBudget?: MoneyField

  interiorBudgetBasis:
    | "User Estimate"
    | "Per BHK Default"
    | "Per Sq.Ft"
    | "Vendor Quote"
    | "Unknown"

  postPossessionBudgetNotes?: string
}
```

---

# 14. TotalCostSummary Schema

This may be generated as a derived object for dashboard display.

```text
TotalCostSummary {
  unitId: string

  agreementValue: number
  totalStatutoryCharges: number
  totalSunkAcquisitionCost: number
  totalPossessionSunkCost: number
  totalPostPossessionBudget: number
  totalLandingCost: number

  trueCostPerSbaSqft?: number
  trueCostPerCarpetSqft?: number

  builderQuotedCost?: number
  differenceFromBuilderQuote?: number
  hiddenCostPercentage?: number

  costCompletenessScore?: number
  missingCriticalCostFields?: string[]

  costRiskLevel:
    | "Low"
    | "Medium"
    | "High"
    | "Critical"
    | "Unknown"

  explanation?: string[]
}
```

## 14.1 Total Sunk Acquisition Cost Formula

```text
Total Sunk Acquisition Cost =
Agreement Value
+ GST Amount
+ Stamp Duty
+ Sale Deed Registration Amount
+ Agreement Registration Charges
+ Franking / E-Stamping
+ Legal Documentation Charges
+ Khata Transfer Charges
+ Mutation Charges
+ Other Government Charges
```

## 14.2 Total Landing Cost Formula

```text
Total Landing Cost =
Total Sunk Acquisition Cost
+ Total Possession Sunk Cost
+ Interior Fit-Out Budget
+ Appliance Budget
+ Move-In Budget
+ Rental Readiness Budget
```

---

# 15. ParkingDetails Schema

Parking must be a dedicated unit-level object.

```text
ParkingDetails {
  parkingId: string
  unitId: string

  parkingIncludedFlag?: boolean
  numberOfCarParksIncluded?: number

  parkingType:
    | "Basement"
    | "Stilt"
    | "Open"
    | "Covered"
    | "Mechanical"
    | "Tandem"
    | "Unknown"

  parkingLevel?: string
  parkingSlotNumber?: string

  parkingDimensions?: string
  parkingLengthFeet?: number
  parkingWidthFeet?: number
  parkingAreaSqft?: number

  independentParking?: boolean
  tandemParking?: boolean
  visitorParkingAvailable?: boolean

  evChargingIncludedFlag?: boolean

  evChargingProvisionType:
    | "Full Charger Included"
    | "Provision Only"
    | "At Extra Cost"
    | "Not Available"
    | "Unknown"

  additionalParkingAvailableFlag?: boolean
  additionalParkingCostPerSlot?: MoneyField
  additionalParkingRegistrationCharges?: MoneyField

  secondParkingRequiredFlag?: boolean

  totalParkingCost?: CalculatedMoneyField

  parkingClarityStatus:
    | "Clear"
    | "Partially Clear"
    | "Unclear"
    | "Risk"
    | "Unknown"

  parkingNotes?: string
}
```

## 15.1 Parking Logic

The portal should show clear indicators:

* Parking included
* Number of slots included
* Additional parking available
* Additional parking cost
* Parking dimensions confirmed
* EV charging status
* Parking clarity risk

Parking should not be hidden inside the cost breakup only.

---

# 16. Amenity Schema

Amenities are project-level but can influence living and investment scores.

```text
Amenity {
  amenityId: string
  projectId: string

  amenityName: string

  amenityCategory:
    | "Fitness"
    | "Sports"
    | "Kids"
    | "Community"
    | "Utility"
    | "Security"
    | "Convenience"
    | "Pet"
    | "Senior Citizen"
    | "Other"

  amenityAvailable?: boolean
  amenityIncludedInCost?: boolean

  amenityReadinessStatus:
    | "Ready"
    | "Under Construction"
    | "Planned"
    | "Promised"
    | "Unknown"

  amenityDeliveryDate?: Date

  amenityQualityRating?: number
  amenityImportanceForLiving?: number
  amenityImportanceForInvestment?: number

  amenityNotes?: string
}
```

---

# 17. LegalInfo Schema

LegalInfo is primarily project-level.

Some documents may be unit-specific, but legal readiness starts at project level.

```text
LegalInfo {
  legalInfoId: string
  projectId: string

  reraRegistrationNumber?: string
  reraVerifiedFlag?: boolean
  reraPossessionDate?: Date

  builderPromisedHandoverDate?: Date
  revisedPossessionDate?: Date

  possessionDelayRisk:
    | "Low"
    | "Medium"
    | "High"
    | "Critical"
    | "Unknown"

  occupancyCertificateStatus:
    | "Available"
    | "Pending"
    | "Not Applicable"
    | "Unknown"

  commencementCertificateStatus:
    | "Available"
    | "Pending"
    | "Unknown"

  approvedPlanAvailable?: boolean
  approvedPlanReviewed?: boolean

  landTitleClarityStatus:
    | "Clear"
    | "Pending Review"
    | "Risk"
    | "Unknown"

  khataStatus:
    | "A Khata"
    | "B Khata"
    | "Pending"
    | "Unknown"

  bankApprovals?: string[]

  litigationDisclosed?: boolean
  litigationNotes?: string

  phaseClarityStatus:
    | "Clear"
    | "Unclear"
    | "Risk"
    | "Unknown"

  delayPenaltyClauseAvailable?: boolean
  cancellationPolicyReviewed?: boolean

  agreementDraftReceived?: boolean
  agreementDraftReviewed?: boolean

  legalReviewStatus:
    | "Not Started"
    | "In Progress"
    | "Cleared"
    | "Risk"
    | "Unknown"

  legalNotes?: string
}
```

---

# 18. ConstructionQuality Schema

This can be project-level with optional site-visit references.

```text
ConstructionQuality {
  constructionQualityId: string
  projectId: string

  currentConstructionStage?: string
  constructionProgressPercentage?: number
  lastConstructionUpdateDate?: Date

  actualFlatVisitAllowed?: boolean
  modelFlatAvailable?: boolean

  modelFlatQualityRating?: number
  structureQualityRating?: number
  wallQualityRating?: number
  flooringQualityRating?: number
  bathroomFittingsQualityRating?: number
  electricalQualityRating?: number
  windowQualityRating?: number

  flooringBrand?: string
  bathroomFittingsBrand?: string
  electricalBrand?: string
  windowSpecification?: string

  ceilingHeightFeet?: number

  ventilationRating?: number
  naturalLightRating?: number
  noiseLevelRating?: number

  waterproofingAssurance?: string

  constructionQualityNotes?: string
}
```

---

# 19. UtilityInfrastructure Schema

```text
UtilityInfrastructure {
  utilityInfrastructureId: string
  projectId: string

  waterSource:
    | "Borewell"
    | "Cauvery"
    | "Tanker"
    | "Mixed"
    | "Unknown"

  cauveryConnectionAvailable?: boolean
  borewellCount?: number

  tankerDependencyRisk:
    | "Low"
    | "Medium"
    | "High"
    | "Unknown"

  powerBackupCoverage:
    | "100%"
    | "Common Areas Only"
    | "Limited"
    | "Unknown"

  powerBackupKvaPerUnit?: number

  stpAvailable?: boolean
  rainwaterHarvestingAvailable?: boolean

  wasteManagementSystem?: string

  pipedGasAvailable?: boolean
  internetProvidersAvailable?: string[]

  securitySystemDetails?: string

  utilityNotes?: string
}
```

---

# 20. SiteVisit Schema

Each project can have multiple site visits.

```text
SiteVisit {
  siteVisitId: string
  projectId: string

  visitDate: Date
  visitTime?: string

  visitedBy?: string
  familyVisited?: boolean

  salespersonName?: string
  salespersonPhone?: string
  salespersonEmail?: string

  unitsDiscussed?: string[]
  quoteCollected?: boolean
  brochureCollected?: boolean
  floorPlanCollected?: boolean
  masterPlanCollected?: boolean
  legalDocumentsCollected?: boolean

  actualFlatVisited?: boolean
  modelFlatVisited?: boolean

  overallVisitImpression:
    | "Excellent"
    | "Good"
    | "Average"
    | "Poor"
    | "Not Rated"

  visitOutcome:
    | "Interested"
    | "Not Interested"
    | "Revisit Required"
    | "Family Review Required"
    | "Financial Review Required"
    | "Legal Review Required"
    | "Watchlist"
    | "Rejected"

  checklistItems?: ChecklistItem[]

  siteVisitNotes?: string
}
```

---

# 21. ChecklistItem Schema

Checklist items support structured due diligence.

```text
ChecklistItem {
  checklistItemId: string

  projectId: string
  unitId?: string
  siteVisitId?: string

  category:
    | "Project Identity"
    | "Sales Contact"
    | "Unit Selection"
    | "Financial Confirmation"
    | "Parking"
    | "Legal / RERA"
    | "Construction Quality"
    | "Amenities"
    | "Water / Power / Infrastructure"
    | "Location"
    | "Community / Living"
    | "Investment"
    | "Documents"
    | "Follow-Up"
    | "Possession"

  itemName: string

  status:
    | "Not Checked"
    | "Checked"
    | "Needs Follow-up"
    | "Risk"
    | "Not Applicable"

  priority:
    | "Low"
    | "Medium"
    | "High"
    | "Critical"

  notes?: string

  followUpRequired?: boolean
  followUpOwner?: string
  followUpDate?: Date

  evidenceRequired?: boolean
  evidenceReceived?: boolean
  evidenceReference?: string

  lastUpdatedDate?: Date
}
```

---

# 22. PaymentMilestone Schema

Payment schedules can be project-level or unit-level.

```text
PaymentMilestone {
  milestoneId: string

  projectId: string
  unitId?: string

  milestoneOrder: number
  milestoneName: string

  milestonePercentage?: number
  milestoneAmount?: CalculatedMoneyField

  gstApplicable?: boolean
  gstAmount?: CalculatedMoneyField

  tdsApplicable?: boolean
  tdsAmount?: CalculatedMoneyField

  expectedDueDate?: Date
  actualDemandDate?: Date
  paymentDueDate?: Date

  paidAmount?: MoneyField
  paymentDate?: Date

  loanDisbursementExpected?: MoneyField
  ownContributionRequired?: MoneyField

  receiptReceived?: boolean
  receiptDocumentId?: string

  milestoneStatus:
    | "Upcoming"
    | "Due"
    | "Paid"
    | "Overdue"
    | "Not Applicable"
    | "Unknown"

  milestoneNotes?: string
}
```

## 22.1 Payment Schedule Validation

The portal should validate:

```text
Total milestone percentage should equal 100%.
```

If not, show warning.

---

# 23. FinancialPlan Schema

This captures home loan and affordability assumptions.

```text
FinancialPlan {
  financialPlanId: string
  unitId: string

  homeLoanEligibilityFlag:
    | "Yes"
    | "No"
    | "To Check"
    | "Unknown"

  agreementValueForLoan?: number

  loanToValueRatio?: number
  targetLoanComponentAmount?: CalculatedMoneyField

  interestRateAnnual?: number
  loanTenureYears?: number

  estimatedMonthlyEmi?: CalculatedMoneyField

  processingFee?: MoneyField
  selectedBank?: string

  loanSanctionStatus:
    | "Not Started"
    | "In Progress"
    | "Sanctioned"
    | "Rejected"
    | "Unknown"

  ownContributionRequired?: CalculatedMoneyField
  registrationCashRequirement?: MoneyField
  emergencyBufferRequired?: MoneyField

  affordabilityStatus:
    | "Comfortable"
    | "Stretch"
    | "Risk"
    | "Not Evaluated"

  financialNotes?: string
}
```

---

# 24. InvestmentAssumptions Schema

```text
InvestmentAssumptions {
  investmentAssumptionId: string
  unitId: string

  expectedMonthlyRent?: MoneyField
  expectedAnnualRent?: CalculatedMoneyField

  expectedMaintenancePaidByOwner?: MoneyField
  expectedPropertyTaxAnnual?: MoneyField
  expectedVacancyMonthsPerYear?: number

  grossRentalYield?: number
  netRentalYield?: number

  expectedAnnualAppreciationPercentage?: number
  expectedHoldingPeriodYears?: number
  expectedResaleValue?: CalculatedMoneyField

  tenantDemandScore?: number
  resaleLiquidityScore?: number

  microMarketSupplyRisk:
    | "Low"
    | "Medium"
    | "High"
    | "Unknown"

  investmentNotes?: string
}
```

---

# 25. LivingSuitability Schema

```text
LivingSuitability {
  livingSuitabilityId: string
  unitId: string

  familySuitabilityScore?: number
  commuteSuitabilityScore?: number
  schoolAccessScore?: number
  hospitalAccessScore?: number
  dailyConvenienceScore?: number
  unitLayoutScore?: number
  ventilationLightScore?: number
  parkingAdequacyScore?: number
  communityQualityScore?: number
  amenitiesSuitabilityScore?: number
  budgetComfortScore?: number

  spouseFamilyPreference?: string
  floorPreferenceNotes?: string
  facingPreferenceNotes?: string
  layoutPreferenceNotes?: string

  livingSuitabilityNotes?: string
}
```

---

# 26. ScoreCard Schema

The ScoreCard stores living and investment scores.

```text
ScoreCard {
  scorecardId: string

  projectId: string
  unitId?: string

  livingScore?: number
  investmentScore?: number

  financialRiskScore?: number
  legalRiskScore?: number
  locationScore?: number
  parkingScore?: number
  constructionRiskScore?: number
  possessionRiskScore?: number

  recommendationStatus:
    | "Strong Shortlist"
    | "Shortlist"
    | "Revisit"
    | "Watchlist"
    | "Avoid for Now"
    | "Rejected"
    | "On Hold"
    | "Unknown"

  scoreBreakdown?: ScoreBreakdown[]

  scoreNotes?: string
}
```

```text
ScoreBreakdown {
  parameterName: string
  parameterCategory: "Living" | "Investment" | "Risk" | "Financial" | "Location"
  rawScore: number
  weight: number
  weightedScore: number
  notes?: string
}
```

---

# 27. DocumentRecord Schema

Documents can be project-level or unit-level.

```text
DocumentRecord {
  documentId: string

  projectId: string
  unitId?: string

  documentName: string

  documentCategory:
    | "Cost Sheet"
    | "Brochure"
    | "Floor Plan"
    | "Master Plan"
    | "Legal"
    | "RERA"
    | "Agreement"
    | "Payment"
    | "Parking"
    | "Bank"
    | "Possession"
    | "Snagging"
    | "Other"

  documentStatus:
    | "Required"
    | "Collected"
    | "Reviewed"
    | "Pending"
    | "Not Applicable"
    | "Risk"

  collectedDate?: Date

  source:
    | "Builder"
    | "Salesperson"
    | "RERA"
    | "Bank"
    | "Legal Advisor"
    | "User"
    | "Other"

  filePathOrUrl?: string

  reviewedBy?: string

  reviewStatus:
    | "Not Reviewed"
    | "In Review"
    | "Cleared"
    | "Risk"
    | "Not Applicable"

  documentNotes?: string
}
```

---

# 28. FollowUpTask Schema

Follow-ups track all pending questions and actions.

```text
FollowUpTask {
  followUpId: string

  projectId: string
  unitId?: string
  siteVisitId?: string

  taskTitle: string
  taskDescription?: string

  category:
    | "Financial"
    | "Legal"
    | "Parking"
    | "Builder"
    | "Loan"
    | "Family"
    | "Location"
    | "Construction"
    | "Documents"
    | "Possession"
    | "Other"

  owner?: string
  dueDate?: Date

  priority:
    | "Low"
    | "Medium"
    | "High"
    | "Critical"

  status:
    | "Open"
    | "In Progress"
    | "Waiting for Builder"
    | "Waiting for Family"
    | "Waiting for Bank"
    | "Waiting for Legal Review"
    | "Closed"
    | "Dropped"

  riskLevel:
    | "Low"
    | "Medium"
    | "High"
    | "Critical"
    | "Unknown"

  writtenConfirmationRequired?: boolean
  writtenConfirmationReceived?: boolean

  closureDate?: Date
  followUpNotes?: string
}
```

---

# 29. Negotiation Schema

```text
Negotiation {
  negotiationId: string
  projectId: string
  unitId: string

  initialQuotedBaseRate?: MoneyField
  currentQuotedBaseRate?: MoneyField
  negotiatedBaseRate?: MoneyField

  initialQuotedTotalCost?: MoneyField
  negotiatedTotalCost?: MoneyField

  discountAmount?: CalculatedMoneyField
  discountPercentage?: number

  waivedCharges?: string[]
  freebiesOffered?: string[]

  paymentFlexibilityOffered?: string
  quoteValidityDate?: Date

  commitmentWrittenFlag?: boolean
  writtenCommitmentDocumentId?: string

  negotiationStatus:
    | "Not Started"
    | "In Progress"
    | "Best Offer Received"
    | "Closed"
    | "Dropped"

  negotiationNotes?: string
}
```

---

# 30. DecisionStatus Schema

```text
DecisionStatus {
  decisionStatusId: string

  projectId: string
  unitId?: string

  status:
    | "New Lead"
    | "Data Pending"
    | "Site Visit Planned"
    | "Site Visited"
    | "Under Comparison"
    | "Family Review Required"
    | "Financial Review Required"
    | "Legal Review Required"
    | "Watchlist"
    | "Shortlisted"
    | "Strong Shortlist"
    | "Negotiation"
    | "Booking Ready"
    | "Booked"
    | "Loan In Progress"
    | "Payment Tracking"
    | "Registration Pending"
    | "Registered"
    | "Possession Pending"
    | "Possession Received"
    | "Rejected"
    | "On Hold"
    | "Closed"

  statusDate?: Date

  reasonCodes?: string[]

  decisionOwner:
    | "User"
    | "Family"
    | "Financial Review"
    | "Legal Review"
    | "Builder"
    | "Other"

  finalDecisionNotes?: string

  nextAction?: string
  nextActionDueDate?: Date
}
```

---

# 31. PossessionTracker Schema

PossessionTracker supports the post-booking and handover journey.

```text
PossessionTracker {
  possessionTrackerId: string
  unitId: string

  reraPossessionDate?: Date
  builderHandoverDate?: Date
  revisedPossessionDate?: Date

  ocReceived?: boolean
  ccVerified?: boolean

  finalDemandReceived?: boolean
  finalPaymentCompleted?: boolean

  maintenancePaid?: boolean
  corpusPaid?: boolean

  utilityConnectionsReady?: boolean
  gasConnectionReady?: boolean
  waterMeterReady?: boolean
  electricityMeterReady?: boolean

  parkingAllotted?: boolean
  parkingSlotConfirmed?: boolean

  accessCardsReceived?: boolean
  keysReceived?: boolean

  snaggingInspectionCompleted?: boolean
  snaggingItemsOpen?: number
  snaggingItemsClosed?: number

  handoverDocumentsReceived?: boolean

  possessionStatus:
    | "Not Started"
    | "In Progress"
    | "Ready"
    | "Completed"
    | "Risk"
    | "Unknown"

  possessionNotes?: string
}
```

---

# 32. Snagging Schema

```text
Snag {
  snagId: string
  unitId: string

  roomOrArea?: string

  snagCategory:
    | "Civil"
    | "Electrical"
    | "Plumbing"
    | "Flooring"
    | "Window"
    | "Door"
    | "Paint"
    | "Bathroom"
    | "Kitchen"
    | "Balcony"
    | "Other"

  issueDescription: string

  severity:
    | "Low"
    | "Medium"
    | "High"
    | "Critical"

  photoReference?: string

  reportedDate?: Date
  builderResponse?: string

  targetClosureDate?: Date
  actualClosureDate?: Date

  snagStatus:
    | "Open"
    | "In Progress"
    | "Closed"
    | "Rejected"

  snagNotes?: string
}
```

---

# 33. AppSettings Schema

Global settings control assumptions used across formulas.

```text
AppSettings {
  defaultCurrency: "INR"

  defaultGstPercentage?: number
  defaultTdsPercentage?: number

  defaultStampDutyPercentage?: number
  defaultSaleDeedRegistrationPercentage?: number

  defaultAgreementRegistrationCharges?: number
  defaultFrankingOrEStampingCharges?: number

  defaultKhataTransferCharges?: number
  defaultMutationCharges?: number

  defaultModtPercentage?: number
  defaultMortgageRegistrationCharges?: number

  defaultBankLegalTechnicalCharges?: number
  defaultBankProcessingFeePercentage?: number

  defaultLoanInterestRate?: number
  defaultLoanTenureYears?: number
  defaultLoanToValueRatio?: number

  defaultInteriorBudget2Bhk?: number
  defaultInteriorBudget25Bhk?: number
  defaultInteriorBudget3Bhk?: number
  defaultInteriorBudget35Bhk?: number
  defaultInteriorBudget4Bhk?: number

  currentResidenceLatitude?: number
  currentResidenceLongitude?: number
  currentResidenceLabel?: string

  primaryWorkplaceLatitude?: number
  primaryWorkplaceLongitude?: number
  primaryWorkplaceLabel?: string

  defaultCityZoneFocus:
    | "East Bangalore"
    | "North Bangalore"
    | "South Bangalore"
    | "West Bangalore"
    | "Central Bangalore"
    | "All Bangalore"

  livingScoreWeights?: ScoreWeights
  investmentScoreWeights?: ScoreWeights
}
```

```text
ScoreWeights {
  [parameterName: string]: number
}
```

---

# 34. ExcelImportSource Schema

This schema tracks imported workbook data.

```text
ExcelImportSource {
  importId: string

  fileName: string
  importDate: Date

  workbookSheetNames: string[]

  importedProjects: string[]

  importStatus:
    | "Pending"
    | "Completed"
    | "Completed with Warnings"
    | "Failed"

  warnings?: string[]
  errors?: string[]

  sourceNotes?: string
}
```

```text
ExcelImportRowMapping {
  mappingId: string
  importId: string

  sheetName: string
  sourceRowNumber?: number

  projectId?: string
  unitId?: string

  rawRowData: object
  normalizedData: object

  mappingConfidence:
    | "High"
    | "Medium"
    | "Low"
    | "Manual Review Required"

  mappingNotes?: string
}
```

---

# 35. Dashboard View Models

These are not primary database entities, but useful derived structures for UI.

## 35.1 MasterComparisonRow

```text
MasterComparisonRow {
  projectName: string
  builderName: string
  cityZone: string
  microMarket: string

  bhkConfiguration: string
  towerOrWing?: string
  floorNumber?: number
  unitNumber?: string
  facing?: string

  superBuiltUpAreaSqft?: number
  carpetAreaReraSqft?: number
  reraEfficiencyRatio?: number

  basePricePerSqft?: number
  basicFlatCost?: number
  agreementValue?: number
  gstAmount?: number
  stampDutyRegistrationCharges?: number
  legalCharges?: number
  corpusFundDeposit?: number
  totalAdvanceMaintenanceCost?: number
  interiorBudget?: number
  totalLandingCost?: number

  trueCostPerSbaSqft?: number
  trueCostPerCarpetSqft?: number

  parkingIncludedFlag?: boolean
  numberOfCarParksIncluded?: number
  additionalParkingCost?: number
  parkingClarityStatus?: string

  reraPossessionDate?: Date
  builderHandoverDate?: Date

  distanceToPrimaryWorkplaceKm?: number
  distanceToNearestFunctionalMetroKm?: number

  livingScore?: number
  investmentScore?: number

  recommendationStatus?: string
  decisionStatus?: string

  missingCriticalFields?: string[]
  notes?: string
}
```

## 35.2 ProjectMapPin

```text
ProjectMapPin {
  projectId: string
  projectName: string
  builderName: string

  latitude?: number
  longitude?: number
  approximateLocationOnly?: boolean

  cityZone?: string
  microMarket?: string

  startingPrice?: number
  selectedUnitTotalLandingCost?: number
  selectedUnitTrueCostPerSba?: number

  livingScore?: number
  investmentScore?: number

  projectPurposeTag?: string
  decisionStatus?: string

  hasCoordinates: boolean
}
```

---

# 36. Data Validation Rules

## 36.1 Project Validation

Required for project creation:

* projectName
* builderName
* city

Recommended for serious comparison:

* RERA number
* location
* possession date
* BHK availability
* at least one unit

## 36.2 Unit Validation

Required for unit creation:

* projectId
* bhkConfiguration
* superBuiltUpAreaSqft or approximate SBA

Recommended for comparison:

* base price
* basic flat cost
* agreement value
* carpet area
* facing
* floor
* parking details

## 36.3 Cost Validation

For financial comparison, flag missing:

* Basic flat cost
* GST treatment
* Stamp duty/registration assumption
* Parking cost/inclusion
* Corpus
* Maintenance
* Legal/franking
* Interior budget

## 36.4 Parking Validation

Flag parking as incomplete if missing:

* Whether parking is included
* Number of slots
* Parking type
* Additional parking availability
* EV charging status

## 36.5 Legal Validation

Flag legal as incomplete if missing:

* RERA number
* RERA possession date
* OC/CC status where relevant
* Approved plan status
* Agreement draft
* Bank approvals

---

# 37. Recommended Database / Storage Direction

Initial implementation can be local-first.

Recommended stages:

## 37.1 Phase 1 Storage

* Local JSON files
* IndexedDB
* Browser local storage for settings
* Import/export through Excel/CSV/JSON

## 37.2 Phase 2 Storage

* SQLite
* Prisma
* Local server or lightweight backend

## 37.3 Phase 3 Storage

* Cloud database
* Authentication
* Document upload
* Multi-device sync

Do not over-engineer storage in the first version.

The schema should still be clean enough to migrate later.

---

# 38. Implementation Notes for Codex

When this schema is converted into code:

1. Use TypeScript interfaces or types.
2. Keep enums centralized.
3. Keep formula functions separate from UI.
4. Keep Excel import mapping separate from core schema.
5. Do not hardcode only the five seed projects.
6. Allow manual override for calculated values.
7. Treat missing numbers as zero only inside formulas.
8. Visually show important missing values as “Data Missing”.
9. Keep source and confidence tracking for important values.
10. Use Indian currency formatting in the UI.
11. Support future expansion to document uploads and possession tracking.

---

# 39. Final Schema Principle

The portal must model the full real estate decision lifecycle.

It should not only answer:

> “Which project is cheaper?”

It should answer:

> “Which project and unit is financially sound, legally safer, practically liveable, investment-worthy, and ready to move through the journey from discovery to possession?”

This schema is the foundation for that decision system.
