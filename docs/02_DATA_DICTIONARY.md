# 02_DATA_DICTIONARY.md

# Real Estate Decision Portal — Data Dictionary

## 1. Purpose of This Document

This document defines the complete set of data parameters required for the Real Estate Decision Portal.

The goal is to create one standardized data dictionary that can handle:

* Multiple builders
* Multiple projects
* Multiple units per project
* Different builder pricing formats
* Site visit data
* Parking details
* Legal/RERA checks
* Location and commute parameters
* Living suitability
* Investment suitability
* Financial planning
* Payment milestones
* Possession tracking
* Follow-ups and documents

This data dictionary should be treated as the foundation for:

* Database schema
* TypeScript interfaces
* Form fields
* Dashboard filters
* Excel import mapping
* Comparison tables
* Scoring models
* Export formats

The system should support incomplete data. Missing data is expected during early stages of evaluation.

---

# 2. Global Data Handling Rules

## 2.1 Missing Data Rule

The portal must distinguish between:

1. **Zero value**
2. **Unknown value**
3. **Not applicable value**
4. **Bundled value**
5. **Manually overridden value**

Examples:

* If car parking is included but cost is not separately mentioned, the field should not be treated as zero cost without a note. It should be marked as “Included / Bundled”.
* If carpet area is not available, it should show “Data Missing”, not zero.
* If GST is not applicable, it should show “Not Applicable”.
* If a calculated value has been manually overridden, it should be clearly marked.

## 2.2 Formula Safety Rule

For calculations:

* Missing numeric values may be treated as zero to prevent formula errors.
* But important missing fields must be visibly flagged.
* The dashboard should not hide missing data behind a calculated number.

## 2.3 Data Source Rule

Every important field should ideally support a source reference:

* Builder cost sheet
* Brochure
* Salesperson confirmation
* Site visit note
* RERA website
* Legal document
* User estimate
* Manual assumption

Fields that are estimated should be tagged as “Estimated”.

Fields confirmed in writing should be tagged as “Confirmed”.

## 2.4 Editable Data Rule

All imported values should be editable.

The Excel workbook is seed data, not the final source forever.

---

# 3. Project Identity Fields

These fields identify the project at the highest level.

| Field Name          |   Type | Required | Description                                                              |
| ------------------- | -----: | -------: | ------------------------------------------------------------------------ |
| projectId           | string |      Yes | Unique internal ID for the project                                       |
| projectName         | string |      Yes | Name of the residential project                                          |
| builderId           | string | Optional | Internal reference to builder                                            |
| builderName         | string |      Yes | Name of the builder/developer                                            |
| projectDisplayName  | string | Optional | Clean display name for UI                                                |
| projectShortName    | string | Optional | Short name used in tables/charts                                         |
| projectType         |   enum | Optional | Apartment / Villa / Plot / Mixed Use                                     |
| projectStatus       |   enum |      Yes | New Lead / Data Pending / Under Comparison / Shortlisted / Rejected etc. |
| projectPurposeTag   |   enum |      Yes | Living / Investment / Both / Undecided                                   |
| city                | string |      Yes | City name, default Bangalore                                             |
| cityZone            |   enum | Optional | East / North / South / West / Central / Other                            |
| microMarket         | string | Optional | Area or micro-market, e.g., Whitefield, Varthur, Sarjapur Road           |
| locality            | string | Optional | More specific locality                                                   |
| address             | string | Optional | Full address                                                             |
| sourceOfLead        | string | Optional | Website, referral, broker, ad, drive-by, etc.                            |
| sourceUrl           | string | Optional | Website or listing URL                                                   |
| firstDiscoveredDate |   date | Optional | Date project was first added                                             |
| lastUpdatedDate     |   date | Optional | Last update timestamp                                                    |
| projectNotes        |   text | Optional | General notes                                                            |

---

# 4. Builder Details Fields

These fields describe the builder/developer.

| Field Name                    |    Type | Required | Description                                  |
| ----------------------------- | ------: | -------: | -------------------------------------------- |
| builderId                     |  string |      Yes | Unique builder ID                            |
| builderName                   |  string |      Yes | Builder/developer name                       |
| builderGroupName              |  string | Optional | Parent group if applicable                   |
| builderWebsite                |  string | Optional | Official website                             |
| builderContactNumber          |  string | Optional | General contact number                       |
| builderEmail                  |  string | Optional | General email                                |
| salesContactName              |  string | Optional | Salesperson name                             |
| salesContactPhone             |  string | Optional | Salesperson phone                            |
| salesContactEmail             |  string | Optional | Salesperson email                            |
| crmContactName                |  string | Optional | CRM contact after booking                    |
| crmContactPhone               |  string | Optional | CRM phone                                    |
| builderCredibilityRating      |  number | Optional | User score from 0 to 10                      |
| pastDeliveryReputation        |    text | Optional | Notes on delivery history                    |
| constructionQualityReputation |    text | Optional | Notes from reviews/visits                    |
| resaleLiquidityPerception     |    enum | Optional | High / Medium / Low / Unknown                |
| builderRiskNotes              |    text | Optional | Risks related to builder                     |
| builderDocumentsReviewed      | boolean | Optional | Whether builder documents have been reviewed |

---

# 5. Location Details Fields

These fields define location, map, commute, and city-zone context.

| Field Name                         |    Type | Required | Description                                   |
| ---------------------------------- | ------: | -------: | --------------------------------------------- |
| locationId                         |  string |      Yes | Unique location record ID                     |
| projectId                          |  string |      Yes | Linked project ID                             |
| latitude                           |  number | Optional | Project latitude                              |
| longitude                          |  number | Optional | Project longitude                             |
| mapPinConfirmed                    | boolean | Optional | Whether map pin is confirmed                  |
| approximateLocationOnly            | boolean | Optional | True if exact coordinates unknown             |
| cityZone                           |    enum | Optional | East / North / South / West / Central / Other |
| microMarket                        |  string | Optional | Whitefield, Varthur, Sarjapur, etc.           |
| nearestLandmark                    |  string | Optional | Known landmark                                |
| distanceToCurrentResidenceKm       |  number | Optional | Distance to current residence                 |
| distanceToPrimaryWorkplaceKm       |  number | Optional | Distance to primary workplace                 |
| distanceToSecondaryWorkplaceKm     |  number | Optional | Optional additional workplace distance        |
| nearestMetroStationName            |  string | Optional | Nearest functional/planned metro station      |
| distanceToNearestFunctionalMetroKm |  number | Optional | Distance to operational metro station         |
| distanceToNearestPlannedMetroKm    |  number | Optional | Distance to upcoming metro                    |
| distanceToORRKm                    |  number | Optional | Distance to Outer Ring Road                   |
| distanceToMainRoadKm               |  number | Optional | Distance to major road                        |
| distanceToSchoolKm                 |  number | Optional | Distance to preferred school                  |
| distanceToHospitalKm               |  number | Optional | Distance to hospital                          |
| distanceToAirportKm                |  number | Optional | Distance to airport                           |
| peakCommuteTimeMinutes             |  number | Optional | Estimated peak commute                        |
| nonPeakCommuteTimeMinutes          |  number | Optional | Estimated non-peak commute                    |
| roadAccessQuality                  |    enum | Optional | Excellent / Good / Average / Poor / Unknown   |
| roadWidth                          |  string | Optional | Road width if known                           |
| trafficBottlenecks                 |    text | Optional | Known traffic issues                          |
| floodingWaterloggingRisk           |    enum | Optional | Low / Medium / High / Unknown                 |
| publicTransportAccess              |    enum | Optional | Good / Average / Poor / Unknown               |
| socialInfrastructureScore          |  number | Optional | User score from 0 to 10                       |
| locationGrowthPotential            |    enum | Optional | High / Medium / Low / Unknown                 |
| rentalDemandPerception             |    enum | Optional | High / Medium / Low / Unknown                 |
| locationNotes                      |    text | Optional | General location notes                        |

---

# 6. Project Scale and Master Plan Fields

These fields capture the physical size and density of the project.

| Field Name                 |    Type | Required | Description                    |
| -------------------------- | ------: | -------: | ------------------------------ |
| totalLandAreaAcres         |  number | Optional | Total project land area        |
| totalNumberOfUnits         |  number | Optional | Total apartment units          |
| totalNumberOfTowers        |  number | Optional | Number of towers               |
| totalNumberOfFloors        |  number | Optional | Number of floors               |
| basementLevels             |  number | Optional | Number of basement levels      |
| openSpacePercentage        |  number | Optional | Open space %                   |
| projectDensityUnitsPerAcre |  number | Optional | Units per acre                 |
| phaseName                  |  string | Optional | Project phase                  |
| currentPhase               |  string | Optional | Current phase under evaluation |
| phaseWiseDelivery          | boolean | Optional | Whether delivery is phase-wise |
| towerConfiguration         |    text | Optional | Tower and floor structure      |
| liftsPerTower              |  number | Optional | Number of lifts per tower      |
| serviceLiftsAvailable      | boolean | Optional | Service lift availability      |
| unitsPerFloor              |  number | Optional | Density per floor              |
| masterPlanCollected        | boolean | Optional | Whether master plan collected  |
| floorPlanCollected         | boolean | Optional | Whether floor plan collected   |
| brochureCollected          | boolean | Optional | Whether brochure collected     |

---

# 7. Unit Details Fields

Each project can have multiple units. These fields capture unit-level data.

| Field Name            |    Type | Required | Description                                               |
| --------------------- | ------: | -------: | --------------------------------------------------------- |
| unitId                |  string |      Yes | Unique unit ID                                            |
| projectId             |  string |      Yes | Linked project ID                                         |
| unitLabel             |  string | Optional | Display label like “Tower A - 1204”                       |
| bhkConfiguration      |    enum |      Yes | 1BHK / 2BHK / 2.5BHK / 3BHK / 3.5BHK / 4BHK / Other       |
| unitType              |  string | Optional | Builder-specific unit type                                |
| towerOrWing           |  string | Optional | Tower or wing                                             |
| floorNumber           |  number | Optional | Floor number                                              |
| unitNumber            |  string | Optional | Flat/unit number                                          |
| facing                |    enum | Optional | East / West / North / South / NE / NW / SE / SW / Unknown |
| vastuCompliance       |    enum | Optional | Good / Average / Poor / Not Checked                       |
| viewType              |  string | Optional | Garden / Road / Pool / Clubhouse / Open / Other           |
| cornerUnit            | boolean | Optional | Whether it is a corner unit                               |
| premiumUnit           | boolean | Optional | Whether premium charges apply                             |
| selectedForComparison | boolean | Optional | Whether unit is selected in dashboard                     |
| unitDecisionStatus    |    enum | Optional | Shortlisted / Rejected / Watchlist / Under Review         |
| unitNotes             |    text | Optional | General unit notes                                        |

---

# 8. Space Efficiency Fields

These fields calculate how efficiently the unit converts saleable area into liveable area.

| Field Name                  |       Type | Required | Description                     |
| --------------------------- | ---------: | -------: | ------------------------------- |
| superBuiltUpAreaSqft        |     number |      Yes | SBA / saleable area             |
| carpetAreaReraSqft          |     number | Optional | Carpet area as per RERA         |
| carpetAreaUsableSqft        |     number | Optional | Usable carpet area if different |
| balconyUtilityAreaSqft      |     number | Optional | Balcony and utility area        |
| externalWallsAreaSqft       |     number | Optional | External wall area              |
| internalWallAreaSqft        |     number | Optional | Internal wall area if available |
| commonAreaLoadingSqft       |     number | Optional | Common area loading             |
| udsSqft                     |     number | Optional | Undivided share of land         |
| reraEfficiencyRatio         | calculated | Optional | Carpet area / SBA               |
| usableEfficiencyRatio       | calculated | Optional | Usable carpet / SBA             |
| balconyPercentage           | calculated | Optional | Balcony area / SBA              |
| commonAreaLoadingPercentage | calculated | Optional | Common area loading / SBA       |
| spaceEfficiencyNotes        |       text | Optional | Notes on layout efficiency      |

---

# 9. Core Cost Fields

These fields capture builder-level core price components.

| Field Name                      |              Type | Required | Description                                       |
| ------------------------------- | ----------------: | -------: | ------------------------------------------------- |
| costId                          |            string |      Yes | Unique cost record ID                             |
| unitId                          |            string |      Yes | Linked unit ID                                    |
| basePricePerSqft                |            number | Optional | Base rate per SBA sq.ft                           |
| negotiatedBasePricePerSqft      |            number | Optional | Negotiated rate if available                      |
| basicFlatCost                   |            number | Optional | Base price × SBA or builder quoted basic cost     |
| carParkingCharges               |            number | Optional | Base car parking charges                          |
| clubhouseAmenitiesMembershipFee |            number | Optional | Clubhouse/amenity charges                         |
| infrastructureDevelopmentCost   |            number | Optional | Infra development cost                            |
| bwssbCharges                    |            number | Optional | BWSSB/water charges                               |
| bescomCharges                   |            number | Optional | BESCOM/electricity charges                        |
| powerBackupCharges              |            number | Optional | Power backup charges                              |
| dgGeneratorCharges              |            number | Optional | Generator charges                                 |
| stpCharges                      |            number | Optional | STP/sewage treatment charges                      |
| evChargerProvisionCharges       |            number | Optional | EV charging provision cost                        |
| plcCharges                      |            number | Optional | Preferred location charges                        |
| cornerFlatPremium               |            number | Optional | Corner flat premium                               |
| facingPremium                   |            number | Optional | Facing premium                                    |
| floorRiseRatePerSqft            |            number | Optional | Floor rise rate per sq.ft                         |
| floorRiseStartFloor             |            number | Optional | Floor from which floor rise starts                |
| floorRisePremium                | calculated/manual | Optional | Calculated or entered floor rise                  |
| otherCoreCharges                |            number | Optional | Any other builder core charges                    |
| agreementValue                  | calculated/manual |      Yes | Core cost before statutory and possession charges |
| coreCostNotes                   |              text | Optional | Notes about bundled/missing charges               |

---

# 10. Taxes and Statutory Charges Fields

These fields capture GST, TDS, stamp duty, registration, and related statutory charges.

| Field Name                   |              Type | Required | Description                              |
| ---------------------------- | ----------------: | -------: | ---------------------------------------- |
| gstPercentage                |            number | Optional | GST % applicable                         |
| gstAmount                    | calculated/manual | Optional | GST amount                               |
| gstIncludedInQuote           |           boolean | Optional | Whether GST is included in builder quote |
| gstNotes                     |              text | Optional | Notes on GST treatment                   |
| tdsApplicable                |           boolean | Optional | Whether TDS applies                      |
| tdsPercentage                |            number | Optional | Usually 1% where applicable              |
| tdsDeductible                | calculated/manual | Optional | TDS amount                               |
| stampDutyPercentage          |            number | Optional | Assumed stamp duty %                     |
| stampDutyAmount              | calculated/manual | Optional | Stamp duty estimate                      |
| registrationPercentage       |            number | Optional | Registration % or rule                   |
| registrationAmount           | calculated/manual | Optional | Registration amount                      |
| stampDutyRegistrationCharges | calculated/manual | Optional | Combined stamp duty + registration       |
| frankingCharges              |            number | Optional | Franking cost                            |
| agreementRegistrationFees    |            number | Optional | Agreement registration charges           |
| khataTransferMutationCharges |            number | Optional | Khata/mutation charges                   |
| otherGovernmentCharges       |            number | Optional | Other statutory charges                  |
| statutoryChargesNotes        |              text | Optional | Notes on statutory charges               |

---

# 11. Legal and Documentation Charges Fields

These fields capture builder documentation and legal costs.

| Field Name                |   Type | Required | Description                       |
| ------------------------- | -----: | -------: | --------------------------------- |
| legalDocumentationCharges | number | Optional | Legal/documentation charges       |
| agreementDraftCharges     | number | Optional | Drafting charges if separate      |
| advocateReviewCost        | number | Optional | User’s external legal review cost |
| documentHandlingCharges   | number | Optional | Builder document handling charges |
| miscellaneousLegalCharges | number | Optional | Other legal charges               |
| legalChargesNotes         |   text | Optional | Legal cost notes                  |

---

# 12. Maintenance, Corpus, and Possession Cost Fields

These fields capture amounts usually payable at or before possession.

| Field Name                            |              Type | Required | Description                        |
| ------------------------------------- | ----------------: | -------: | ---------------------------------- |
| corpusFundDeposit                     |            number | Optional | One-time corpus deposit            |
| corpusRatePerSqft                     |            number | Optional | Corpus rate per sq.ft              |
| corpusCalculationBasis                |              enum | Optional | SBA / Carpet / Lump Sum / Unknown  |
| advanceMaintenanceRatePerSqftPerMonth |            number | Optional | Monthly maintenance rate per sq.ft |
| advanceMaintenanceTenureMonths        |            number | Optional | Advance maintenance tenure         |
| advanceMaintenanceLumpSum             |            number | Optional | Lump sum if provided directly      |
| totalAdvanceMaintenanceCost           | calculated/manual | Optional | Maintenance total                  |
| maintenanceGstApplicable              |           boolean | Optional | Whether GST applies on maintenance |
| gasPipelineConnectionCharges          |            number | Optional | Gas pipeline or meter charges      |
| waterMeterCharges                     |            number | Optional | Water meter charges                |
| electricityMeterCharges               |            number | Optional | Electricity meter charges          |
| sanitationCharges                     |            number | Optional | Sanitation-related charges         |
| possessionCharges                     |            number | Optional | Other possession charges           |
| handoverCharges                       |            number | Optional | Handover/admin charges             |
| totalPossessionSunkCost               | calculated/manual | Optional | Total possession-related sunk cost |
| maintenancePossessionNotes            |              text | Optional | Notes                              |

---

# 13. Post-Possession Budget Fields

These fields capture practical costs after purchase but before full move-in or rental readiness.

| Field Name                        |   Type | Required | Description                                        |
| --------------------------------- | -----: | -------: | -------------------------------------------------- |
| estimatedInteriorFitOutBudget     | number | Optional | Woodwork, kitchen, wardrobes, electricals          |
| estimatedApplianceBudget          | number | Optional | Appliances                                         |
| estimatedMoveInBudget             | number | Optional | Moving and setup cost                              |
| estimatedRepairModificationBudget | number | Optional | Civil/electrical/plumbing modifications            |
| estimatedRentalReadinessBudget    | number | Optional | If bought for rental                               |
| interiorBudgetBasis               |   enum | Optional | User estimate / per BHK / per sq.ft / vendor quote |
| interiorNotes                     |   text | Optional | Interior assumptions                               |

---

# 14. Total Cost and KPI Fields

These fields are calculated from other cost fields.

| Field Name                 |              Type | Required | Description                                   |
| -------------------------- | ----------------: | -------: | --------------------------------------------- |
| agreementValue             | calculated/manual |      Yes | Core builder/agreement value                  |
| totalSunkAcquisitionCost   | calculated/manual |      Yes | Agreement + statutory + legal/franking        |
| totalPossessionSunkCost    | calculated/manual | Optional | Corpus + maintenance + utilities + possession |
| totalLandingCost           | calculated/manual |      Yes | Total practical cost including interiors      |
| trueCostPerSbaSqft         |        calculated |      Yes | Total landing cost / SBA                      |
| trueCostPerCarpetSqft      |        calculated | Optional | Total landing cost / carpet area              |
| builderQuotedCost          |            number | Optional | Original builder quoted cost                  |
| differenceFromBuilderQuote |        calculated | Optional | Landing cost - quoted cost                    |
| hiddenCostPercentage       |        calculated | Optional | Hidden costs as % of basic cost               |
| costCompletenessScore      |        calculated | Optional | Completeness of cost data                     |
| costRiskLevel              |              enum | Optional | Low / Medium / High / Critical                |

---

# 15. Parking Fields

Parking must be treated as a dedicated section.

| Field Name                           |              Type | Required | Description                                                       |
| ------------------------------------ | ----------------: | -------: | ----------------------------------------------------------------- |
| parkingId                            |            string |      Yes | Unique parking record                                             |
| unitId                               |            string |      Yes | Linked unit                                                       |
| parkingIncludedFlag                  |           boolean | Optional | Whether parking is included                                       |
| numberOfCarParksIncluded             |            number | Optional | Number of slots included                                          |
| parkingType                          |              enum | Optional | Basement / Stilt / Open / Covered / Mechanical / Tandem / Unknown |
| parkingLevel                         |            string | Optional | Basement level or parking floor                                   |
| parkingSlotNumber                    |            string | Optional | Slot number                                                       |
| parkingDimensions                    |            string | Optional | Length × width                                                    |
| parkingAreaSqft                      |            number | Optional | Area of parking slot                                              |
| independentParking                   |           boolean | Optional | Independent vs tandem/shared                                      |
| tandemParking                        |           boolean | Optional | Whether tandem parking                                            |
| visitorParkingAvailable              |           boolean | Optional | Visitor parking availability                                      |
| evChargingIncludedFlag               |           boolean | Optional | Whether EV charging included                                      |
| evChargingProvisionType              |              enum | Optional | Full charger / Provision only / Not available / Unknown           |
| additionalParkingAvailableFlag       |           boolean | Optional | Whether extra parking can be purchased                            |
| additionalParkingCostPerSlot         |            number | Optional | Extra parking cost                                                |
| additionalParkingRegistrationCharges |            number | Optional | Registration/statutory charges on extra parking                   |
| secondParkingRequiredFlag            |           boolean | Optional | Whether user wants additional parking                             |
| totalParkingCost                     | calculated/manual | Optional | Base + additional parking costs                                   |
| parkingClarityStatus                 |              enum | Optional | Clear / Partially Clear / Unclear / Risk                          |
| parkingNotes                         |              text | Optional | Notes                                                             |

---

# 16. Amenities Fields

Amenities should be captured both as available features and as readiness/delivery status.

| Field Name             |    Type | Required | Description                                                      |
| ---------------------- | ------: | -------: | ---------------------------------------------------------------- |
| amenityId              |  string |      Yes | Unique amenity record                                            |
| projectId              |  string |      Yes | Linked project                                                   |
| amenityName            |  string |      Yes | Name of amenity                                                  |
| amenityCategory        |    enum | Optional | Fitness / Sports / Kids / Community / Utility / Security / Other |
| amenityAvailable       | boolean | Optional | Whether promised/available                                       |
| amenityIncludedInCost  | boolean | Optional | Whether included in cost                                         |
| amenityReadinessStatus |    enum | Optional | Ready / Under Construction / Planned / Unknown                   |
| amenityDeliveryDate    |    date | Optional | Expected delivery date                                           |
| amenityQualityRating   |  number | Optional | User rating from 0 to 10                                         |
| amenityNotes           |    text | Optional | Notes                                                            |

Suggested amenity names:

* Clubhouse
* Swimming pool
* Gym
* Indoor games
* Outdoor sports courts
* Children’s play area
* Senior citizen zone
* Jogging track
* Party hall
* Co-working space
* Pet park
* Mini theatre
* Convenience store
* Security system
* CCTV
* Access control
* Visitor parking
* EV charging
* Power backup
* STP
* Rainwater harvesting

---

# 17. Legal and RERA Fields

These fields track legal readiness and regulatory compliance.

| Field Name                    |    Type | Required | Description                                    |
| ----------------------------- | ------: | -------: | ---------------------------------------------- |
| legalInfoId                   |  string |      Yes | Unique legal record                            |
| projectId                     |  string |      Yes | Linked project                                 |
| reraRegistrationNumber        |  string | Optional | RERA registration number                       |
| reraVerifiedFlag              | boolean | Optional | Whether RERA verified                          |
| reraPossessionDate            |    date | Optional | Possession date as per RERA                    |
| builderPromisedHandoverDate   |    date | Optional | Builder promised date                          |
| possessionDelayRisk           |    enum | Optional | Low / Medium / High / Unknown                  |
| occupancyCertificateStatus    |    enum | Optional | Available / Pending / Not Applicable / Unknown |
| commencementCertificateStatus |    enum | Optional | Available / Pending / Unknown                  |
| approvedPlanAvailable         | boolean | Optional | Whether approved plan collected                |
| landTitleClarityStatus        |    enum | Optional | Clear / Pending Review / Risk / Unknown        |
| khataStatus                   |    enum | Optional | A Khata / B Khata / Pending / Unknown          |
| bankApprovals                 |    text | Optional | Approved banks                                 |
| litigationDisclosed           | boolean | Optional | Whether litigation disclosed                   |
| litigationNotes               |    text | Optional | Litigation notes                               |
| phaseClarityStatus            |    enum | Optional | Clear / Unclear / Risk                         |
| delayPenaltyClauseAvailable   | boolean | Optional | Whether delay penalty clause exists            |
| cancellationPolicyReviewed    | boolean | Optional | Whether cancellation terms reviewed            |
| agreementDraftReceived        | boolean | Optional | Whether draft agreement received               |
| legalReviewStatus             |    enum | Optional | Not Started / In Progress / Cleared / Risk     |
| legalNotes                    |    text | Optional | Legal notes                                    |

---

# 18. Construction and Quality Fields

These fields capture construction status and quality observations.

| Field Name                     |    Type | Required | Description                                       |
| ------------------------------ | ------: | -------: | ------------------------------------------------- |
| constructionStatusId           |  string |      Yes | Unique construction record                        |
| projectId                      |  string |      Yes | Linked project                                    |
| currentConstructionStage       |  string | Optional | Foundation / Structure / Finishing / Ready / etc. |
| constructionProgressPercentage |  number | Optional | Estimated progress %                              |
| lastConstructionUpdateDate     |    date | Optional | Last checked date                                 |
| actualFlatVisitAllowed         | boolean | Optional | Whether actual flat visit allowed                 |
| modelFlatAvailable             | boolean | Optional | Whether model flat available                      |
| modelFlatQualityRating         |  number | Optional | Rating 0 to 10                                    |
| structureQualityRating         |  number | Optional | Rating 0 to 10                                    |
| wallQualityRating              |  number | Optional | Rating 0 to 10                                    |
| flooringBrand                  |  string | Optional | Flooring brand/spec                               |
| bathroomFittingsBrand          |  string | Optional | Bathroom fittings brand                           |
| electricalBrand                |  string | Optional | Electrical fittings brand                         |
| windowQuality                  |  string | Optional | Window quality/spec                               |
| ceilingHeightFeet              |  number | Optional | Ceiling height                                    |
| ventilationRating              |  number | Optional | Rating 0 to 10                                    |
| naturalLightRating             |  number | Optional | Rating 0 to 10                                    |
| noiseLevelRating               |  number | Optional | Rating 0 to 10                                    |
| waterproofingAssurance         |  string | Optional | Waterproofing details                             |
| constructionQualityNotes       |    text | Optional | Notes                                             |

---

# 19. Utilities and Infrastructure Fields

These fields capture practical living infrastructure.

| Field Name                   |    Type | Required | Description                                   |
| ---------------------------- | ------: | -------: | --------------------------------------------- |
| waterSource                  |    enum | Optional | Borewell / Cauvery / Tanker / Mixed / Unknown |
| cauveryConnectionAvailable   | boolean | Optional | Cauvery water availability                    |
| borewellCount                |  number | Optional | Number of borewells                           |
| tankerDependencyRisk         |    enum | Optional | Low / Medium / High / Unknown                 |
| powerBackupCoverage          |    enum | Optional | 100% / Common Areas Only / Limited / Unknown  |
| powerBackupKvaPerUnit        |  number | Optional | Backup allocation                             |
| stpAvailable                 | boolean | Optional | Sewage treatment plant                        |
| rainwaterHarvestingAvailable | boolean | Optional | RWH availability                              |
| wasteManagementSystem        |  string | Optional | Waste management details                      |
| pipedGasAvailable            | boolean | Optional | Piped gas availability                        |
| internetProvidersAvailable   |    text | Optional | Internet providers                            |
| securitySystemDetails        |    text | Optional | Security/CCTV/access control                  |
| utilityNotes                 |    text | Optional | Notes                                         |

---

# 20. Financial Planning and Loan Fields

These fields support home loan and cash-flow planning.

| Field Name                  |              Type | Required | Description                                       |
| --------------------------- | ----------------: | -------: | ------------------------------------------------- |
| financialPlanId             |            string |      Yes | Unique financial plan record                      |
| unitId                      |            string |      Yes | Linked unit                                       |
| homeLoanEligibilityFlag     |              enum | Optional | Yes / No / To Check                               |
| targetLoanComponentAmount   |            number | Optional | Target home loan amount                           |
| loanToValueRatio            |            number | Optional | Loan amount / agreement value                     |
| interestRateAnnual          |            number | Optional | Annual interest rate                              |
| loanTenureYears             |            number | Optional | Loan tenure                                       |
| estimatedMonthlyEmi         | calculated/manual | Optional | EMI estimate                                      |
| processingFee               |            number | Optional | Bank processing fee                               |
| selectedBank                |            string | Optional | Preferred bank                                    |
| loanSanctionStatus          |              enum | Optional | Not Started / In Progress / Sanctioned / Rejected |
| ownContributionRequired     | calculated/manual | Optional | Amount to be funded by user                       |
| registrationCashRequirement |            number | Optional | Registration-time cash requirement                |
| emergencyBufferRequired     |            number | Optional | Buffer for unexpected costs                       |
| affordabilityStatus         |              enum | Optional | Comfortable / Stretch / Risk / Not Evaluated      |
| financialNotes              |              text | Optional | Notes                                             |

---

# 21. Investment Assumption Fields

These fields support investment evaluation.

| Field Name                           |              Type | Required | Description                            |
| ------------------------------------ | ----------------: | -------: | -------------------------------------- |
| expectedMonthlyRent                  |            number | Optional | Expected rent                          |
| expectedAnnualRent                   |        calculated | Optional | Monthly rent × 12                      |
| expectedMaintenancePaidByOwner       |            number | Optional | Annual owner maintenance burden        |
| expectedPropertyTaxAnnual            |            number | Optional | Annual property tax estimate           |
| expectedVacancyMonthsPerYear         |            number | Optional | Expected vacancy                       |
| grossRentalYield                     |        calculated | Optional | Annual rent / total landing cost       |
| netRentalYield                       |        calculated | Optional | Net annual income / total landing cost |
| expectedAnnualAppreciationPercentage |            number | Optional | Expected capital appreciation          |
| expectedHoldingPeriodYears           |            number | Optional | Expected holding period                |
| expectedResaleValue                  | calculated/manual | Optional | Estimated future resale value          |
| tenantDemandScore                    |            number | Optional | Score 0 to 10                          |
| resaleLiquidityScore                 |            number | Optional | Score 0 to 10                          |
| microMarketSupplyRisk                |              enum | Optional | Low / Medium / High / Unknown          |
| investmentNotes                      |              text | Optional | Notes                                  |

---

# 22. Living Suitability Fields

These fields support future-home evaluation.

| Field Name                |   Type | Required | Description   |
| ------------------------- | -----: | -------: | ------------- |
| familySuitabilityScore    | number | Optional | Score 0 to 10 |
| commuteSuitabilityScore   | number | Optional | Score 0 to 10 |
| schoolAccessScore         | number | Optional | Score 0 to 10 |
| hospitalAccessScore       | number | Optional | Score 0 to 10 |
| dailyConvenienceScore     | number | Optional | Score 0 to 10 |
| unitLayoutScore           | number | Optional | Score 0 to 10 |
| ventilationLightScore     | number | Optional | Score 0 to 10 |
| parkingAdequacyScore      | number | Optional | Score 0 to 10 |
| communityQualityScore     | number | Optional | Score 0 to 10 |
| amenitiesSuitabilityScore | number | Optional | Score 0 to 10 |
| budgetComfortScore        | number | Optional | Score 0 to 10 |
| livingSuitabilityNotes    |   text | Optional | Notes         |

---

# 23. Site Visit Fields

Each project can have multiple site visits.

| Field Name             |    Type | Required | Description                                                                             |
| ---------------------- | ------: | -------: | --------------------------------------------------------------------------------------- |
| siteVisitId            |  string |      Yes | Unique site visit ID                                                                    |
| projectId              |  string |      Yes | Linked project                                                                          |
| visitDate              |    date |      Yes | Site visit date                                                                         |
| visitTime              |  string | Optional | Visit time                                                                              |
| visitedBy              |  string | Optional | User/family member                                                                      |
| salespersonName        |  string | Optional | Salesperson met                                                                         |
| salespersonPhone       |  string | Optional | Salesperson phone                                                                       |
| salespersonEmail       |  string | Optional | Salesperson email                                                                       |
| unitsDiscussed         |    text | Optional | Units discussed                                                                         |
| quoteCollected         | boolean | Optional | Whether quote/cost sheet collected                                                      |
| brochureCollected      | boolean | Optional | Whether brochure collected                                                              |
| floorPlanCollected     | boolean | Optional | Whether floor plan collected                                                            |
| masterPlanCollected    | boolean | Optional | Whether master plan collected                                                           |
| actualFlatVisited      | boolean | Optional | Whether actual flat visited                                                             |
| modelFlatVisited       | boolean | Optional | Whether model flat visited                                                              |
| familyVisited          | boolean | Optional | Whether family joined                                                                   |
| overallVisitImpression |    enum | Optional | Excellent / Good / Average / Poor                                                       |
| visitOutcome           |    enum | Optional | Interested / Not Interested / Revisit / Family Review / Financial Review / Legal Review |
| siteVisitNotes         |    text | Optional | General visit notes                                                                     |

---

# 24. Checklist Item Fields

Checklist items should be reusable across site visits and project due diligence.

| Field Name       |    Type | Required | Description                                                            |
| ---------------- | ------: | -------: | ---------------------------------------------------------------------- |
| checklistItemId  |  string |      Yes | Unique checklist item                                                  |
| projectId        |  string |      Yes | Linked project                                                         |
| siteVisitId      |  string | Optional | Linked site visit                                                      |
| category         |    enum |      Yes | Financial / Legal / Parking / Construction / Location / Amenities etc. |
| itemName         |  string |      Yes | Checklist item                                                         |
| status           |    enum |      Yes | Not Checked / Checked / Needs Follow-up / Risk / Not Applicable        |
| priority         |    enum | Optional | Low / Medium / High / Critical                                         |
| notes            |    text | Optional | Notes                                                                  |
| followUpRequired | boolean | Optional | Whether follow-up needed                                               |
| followUpOwner    |  string | Optional | Owner                                                                  |
| followUpDate     |    date | Optional | Due date                                                               |
| evidenceRequired | boolean | Optional | Whether written proof/document needed                                  |
| evidenceReceived | boolean | Optional | Whether proof received                                                 |
| lastUpdatedDate  |    date | Optional | Last update                                                            |

---

# 25. Payment Milestone Fields

These fields support construction-linked or builder-specific payment schedules.

| Field Name               |              Type | Required | Description                                      |
| ------------------------ | ----------------: | -------: | ------------------------------------------------ |
| milestoneId              |            string |      Yes | Unique milestone ID                              |
| projectId                |            string |      Yes | Linked project                                   |
| unitId                   |            string | Optional | Linked unit if unit-specific                     |
| milestoneOrder           |            number |      Yes | Sequence                                         |
| milestoneName            |            string |      Yes | Milestone name                                   |
| milestonePercentage      |            number | Optional | % of agreement value                             |
| milestoneAmount          | calculated/manual | Optional | Payment amount                                   |
| gstApplicable            |           boolean | Optional | Whether GST applies                              |
| gstAmount                | calculated/manual | Optional | GST on milestone                                 |
| tdsApplicable            |           boolean | Optional | Whether TDS applies                              |
| tdsAmount                | calculated/manual | Optional | TDS for milestone                                |
| expectedDueDate          |              date | Optional | Expected due date                                |
| actualDemandDate         |              date | Optional | Builder demand date                              |
| paymentDueDate           |              date | Optional | Due date                                         |
| paidAmount               |            number | Optional | Amount paid                                      |
| paymentDate              |              date | Optional | Payment date                                     |
| loanDisbursementExpected |            number | Optional | Loan amount expected                             |
| ownContributionRequired  |            number | Optional | Own contribution                                 |
| receiptReceived          |           boolean | Optional | Whether receipt received                         |
| milestoneStatus          |              enum | Optional | Upcoming / Due / Paid / Overdue / Not Applicable |
| milestoneNotes           |              text | Optional | Notes                                            |

---

# 26. Document Record Fields

These fields track documents collected and reviewed.

| Field Name       |   Type | Required | Description                                                              |
| ---------------- | -----: | -------: | ------------------------------------------------------------------------ |
| documentId       | string |      Yes | Unique document ID                                                       |
| projectId        | string |      Yes | Linked project                                                           |
| unitId           | string | Optional | Linked unit if unit-specific                                             |
| documentName     | string |      Yes | Document name                                                            |
| documentCategory |   enum | Optional | Cost Sheet / Brochure / Legal / RERA / Floor Plan / Payment / Possession |
| documentStatus   |   enum | Optional | Required / Collected / Reviewed / Pending / Not Applicable               |
| collectedDate    |   date | Optional | Collection date                                                          |
| source           | string | Optional | Builder / Salesperson / RERA / Bank / Legal                              |
| filePathOrUrl    | string | Optional | File or URL reference                                                    |
| reviewedBy       | string | Optional | Reviewer                                                                 |
| reviewStatus     |   enum | Optional | Not Reviewed / In Review / Cleared / Risk                                |
| documentNotes    |   text | Optional | Notes                                                                    |

---

# 27. Follow-Up Task Fields

These fields track open questions, pending confirmations, and negotiation items.

| Field Name                  |    Type | Required | Description                                                   |
| --------------------------- | ------: | -------: | ------------------------------------------------------------- |
| followUpId                  |  string |      Yes | Unique follow-up ID                                           |
| projectId                   |  string |      Yes | Linked project                                                |
| unitId                      |  string | Optional | Linked unit                                                   |
| siteVisitId                 |  string | Optional | Linked site visit                                             |
| taskTitle                   |  string |      Yes | Follow-up title                                               |
| taskDescription             |    text | Optional | Detailed task                                                 |
| category                    |    enum | Optional | Financial / Legal / Parking / Builder / Loan / Family / Other |
| owner                       |  string | Optional | Responsible person                                            |
| dueDate                     |    date | Optional | Due date                                                      |
| priority                    |    enum | Optional | Low / Medium / High / Critical                                |
| status                      |    enum |      Yes | Open / In Progress / Waiting / Closed / Dropped               |
| riskLevel                   |    enum | Optional | Low / Medium / High / Critical                                |
| writtenConfirmationRequired | boolean | Optional | Whether written confirmation required                         |
| writtenConfirmationReceived | boolean | Optional | Whether received                                              |
| closureDate                 |    date | Optional | Date closed                                                   |
| followUpNotes               |    text | Optional | Notes                                                         |

---

# 28. Negotiation Fields

These fields track pricing discussions and builder commitments.

| Field Name                |       Type | Required | Description                                     |
| ------------------------- | ---------: | -------: | ----------------------------------------------- |
| negotiationId             |     string |      Yes | Unique negotiation record                       |
| unitId                    |     string |      Yes | Linked unit                                     |
| initialQuotedBaseRate     |     number | Optional | First quoted base rate                          |
| currentQuotedBaseRate     |     number | Optional | Current quote                                   |
| negotiatedBaseRate        |     number | Optional | Negotiated rate                                 |
| discountAmount            |     number | Optional | Discount amount                                 |
| discountPercentage        | calculated | Optional | Discount %                                      |
| waivedCharges             |       text | Optional | Charges waived                                  |
| freebiesOffered           |       text | Optional | Freebies or add-ons                             |
| paymentFlexibilityOffered |       text | Optional | Flexible payment terms                          |
| quoteValidityDate         |       date | Optional | Quote validity                                  |
| commitmentWrittenFlag     |    boolean | Optional | Whether commitment written                      |
| negotiationStatus         |       enum | Optional | Not Started / In Progress / Best Offer / Closed |
| negotiationNotes          |       text | Optional | Notes                                           |

---

# 29. Scoring Fields

The portal should calculate separate scores for living and investment.

| Field Name            |              Type | Required | Description                                                |
| --------------------- | ----------------: | -------: | ---------------------------------------------------------- |
| scorecardId           |            string |      Yes | Unique scorecard ID                                        |
| projectId             |            string |      Yes | Linked project                                             |
| unitId                |            string | Optional | Linked unit                                                |
| livingScore           | calculated/manual | Optional | Overall living score, 0 to 100                             |
| investmentScore       | calculated/manual | Optional | Overall investment score, 0 to 100                         |
| financialRiskScore    | calculated/manual | Optional | Risk score                                                 |
| legalRiskScore        | calculated/manual | Optional | Legal risk                                                 |
| locationScore         | calculated/manual | Optional | Location score                                             |
| parkingScore          | calculated/manual | Optional | Parking score                                              |
| constructionRiskScore | calculated/manual | Optional | Construction risk                                          |
| recommendationStatus  |              enum | Optional | Strong Shortlist / Shortlist / Revisit / Watchlist / Avoid |
| scoreNotes            |              text | Optional | Explanation                                                |

---

# 30. Decision Status Fields

These fields track the user’s decision progress.

| Field Name         |     Type | Required | Description                                            |
| ------------------ | -------: | -------: | ------------------------------------------------------ |
| decisionStatusId   |   string |      Yes | Unique decision record                                 |
| projectId          |   string |      Yes | Linked project                                         |
| unitId             |   string | Optional | Linked unit                                            |
| status             |     enum |      Yes | New Lead / Shortlisted / Rejected / Booking Ready etc. |
| statusDate         |     date | Optional | Date of status change                                  |
| reasonCodes        | string[] | Optional | Reasons for status                                     |
| decisionOwner      |   string | Optional | User/family/financial/legal                            |
| finalDecisionNotes |     text | Optional | Notes                                                  |
| nextAction         |   string | Optional | Next action required                                   |
| nextActionDueDate  |     date | Optional | Due date                                               |

Suggested statuses:

* New Lead
* Data Pending
* Site Visit Planned
* Site Visited
* Under Comparison
* Family Review Required
* Financial Review Required
* Legal Review Required
* Watchlist
* Shortlisted
* Strong Shortlist
* Negotiation
* Booking Ready
* Booked
* Loan In Progress
* Payment Tracking
* Registration Pending
* Registered
* Possession Pending
* Possession Received
* Rejected
* On Hold
* Closed

---

# 31. Possession Tracking Fields

These fields support the later possession journey.

| Field Name                  |    Type | Required | Description                                          |
| --------------------------- | ------: | -------: | ---------------------------------------------------- |
| possessionTrackerId         |  string |      Yes | Unique possession record                             |
| unitId                      |  string |      Yes | Linked unit                                          |
| reraPossessionDate          |    date | Optional | RERA date                                            |
| builderHandoverDate         |    date | Optional | Builder promised handover                            |
| revisedPossessionDate       |    date | Optional | Revised date                                         |
| ocReceived                  | boolean | Optional | Occupancy certificate received                       |
| ccVerified                  | boolean | Optional | Commencement certificate verified                    |
| finalDemandReceived         | boolean | Optional | Final demand received                                |
| finalPaymentCompleted       | boolean | Optional | Final payment completed                              |
| maintenancePaid             | boolean | Optional | Maintenance paid                                     |
| corpusPaid                  | boolean | Optional | Corpus paid                                          |
| utilityConnectionsReady     | boolean | Optional | Utilities ready                                      |
| gasConnectionReady          | boolean | Optional | Gas ready                                            |
| waterMeterReady             | boolean | Optional | Water meter ready                                    |
| electricityMeterReady       | boolean | Optional | Electricity meter ready                              |
| parkingAllotted             | boolean | Optional | Parking allotted                                     |
| accessCardsReceived         | boolean | Optional | Access cards received                                |
| keysReceived                | boolean | Optional | Keys received                                        |
| snaggingInspectionCompleted | boolean | Optional | Snagging done                                        |
| snaggingItemsOpen           |  number | Optional | Open snag items                                      |
| snaggingItemsClosed         |  number | Optional | Closed snag items                                    |
| handoverDocumentsReceived   | boolean | Optional | Handover documents received                          |
| possessionStatus            |    enum | Optional | Not Started / In Progress / Ready / Completed / Risk |
| possessionNotes             |    text | Optional | Notes                                                |

---

# 32. Snagging Fields

These fields track defects during possession.

| Field Name        |   Type | Required | Description                                                              |
| ----------------- | -----: | -------: | ------------------------------------------------------------------------ |
| snagId            | string |      Yes | Unique snag ID                                                           |
| unitId            | string |      Yes | Linked unit                                                              |
| roomOrArea        | string | Optional | Room/area                                                                |
| snagCategory      |   enum | Optional | Civil / Electrical / Plumbing / Flooring / Window / Door / Paint / Other |
| issueDescription  |   text |      Yes | Snag description                                                         |
| severity          |   enum | Optional | Low / Medium / High / Critical                                           |
| photoReference    | string | Optional | Photo/file reference                                                     |
| reportedDate      |   date | Optional | Date reported                                                            |
| builderResponse   |   text | Optional | Builder response                                                         |
| targetClosureDate |   date | Optional | Target closure                                                           |
| actualClosureDate |   date | Optional | Actual closure                                                           |
| snagStatus        |   enum | Optional | Open / In Progress / Closed / Rejected                                   |
| snagNotes         |   text | Optional | Notes                                                                    |

---

# 33. User Settings Fields

These fields store global assumptions.

| Field Name                    |   Type | Required | Description                         |
| ----------------------------- | -----: | -------: | ----------------------------------- |
| defaultGstPercentage          | number | Optional | Default GST assumption              |
| defaultStampDutyPercentage    | number | Optional | Default stamp duty assumption       |
| defaultRegistrationPercentage | number | Optional | Default registration assumption     |
| defaultLoanInterestRate       | number | Optional | Default home loan rate              |
| defaultLoanTenureYears        | number | Optional | Default tenure                      |
| defaultLoanToValueRatio       | number | Optional | Default LTV                         |
| defaultInteriorBudget2Bhk     | number | Optional | Interior budget for 2BHK            |
| defaultInteriorBudget3Bhk     | number | Optional | Interior budget for 3BHK            |
| defaultInteriorBudget4Bhk     | number | Optional | Interior budget for 4BHK            |
| currentResidenceLatitude      | number | Optional | Residence latitude                  |
| currentResidenceLongitude     | number | Optional | Residence longitude                 |
| primaryWorkplaceLatitude      | number | Optional | Workplace latitude                  |
| primaryWorkplaceLongitude     | number | Optional | Workplace longitude                 |
| defaultCityZoneFocus          |   enum | Optional | East Bangalore / etc.               |
| livingScoreWeights            | object | Optional | Adjustable living score weights     |
| investmentScoreWeights        | object | Optional | Adjustable investment score weights |

---

# 34. Important Enums

## 34.1 Project Purpose

* Living
* Investment
* Both
* Undecided

## 34.2 City Zone

* East Bangalore
* North Bangalore
* South Bangalore
* West Bangalore
* Central Bangalore
* Other

## 34.3 Data Confidence

* Unknown
* Estimated
* Builder Provided
* Site Visit Confirmed
* Written Confirmation
* Legal Verified
* User Assumption

## 34.4 Checklist Status

* Not Checked
* Checked
* Needs Follow-up
* Risk
* Not Applicable

## 34.5 Risk Level

* Low
* Medium
* High
* Critical
* Unknown

## 34.6 Recommendation Status

* Strong Shortlist
* Shortlist
* Revisit
* Watchlist
* Avoid for Now
* Rejected
* On Hold

## 34.7 Cost Treatment

* Separate
* Included
* Bundled
* Not Applicable
* Unknown
* Estimated
* Manual Override

---

# 35. Data Completeness Framework

The portal should calculate or display data completeness by section.

Suggested completeness categories:

## 35.1 Project Completeness

* Project name
* Builder
* Location
* RERA
* Possession
* BHK types
* Contact

## 35.2 Cost Completeness

* Base cost
* Agreement value
* GST
* Registration
* Parking
* Maintenance
* Corpus
* Legal
* Interiors

## 35.3 Legal Completeness

* RERA
* OC/CC
* Approved plan
* Bank approvals
* Agreement draft
* Cancellation policy

## 35.4 Parking Completeness

* Number of slots
* Type
* Dimensions
* EV readiness
* Extra parking cost

## 35.5 Location Completeness

* Map pin
* Workplace distance
* Metro distance
* Road access
* Social infrastructure

Completeness should help the user know what is still missing before making a decision.

---

# 36. Final Data Dictionary Principle

This portal should be designed for progressive data maturity.

At first, a project may only have a name, location, and approximate price.

After a site visit, it may have detailed unit, cost, parking, and legal data.

Before booking, it should have verified cost, legal, loan, and payment data.

Before possession, it should have handover, utility, snagging, and document tracking data.

The data model must support this journey without forcing all information at once.
