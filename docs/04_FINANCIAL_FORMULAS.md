# 04_FINANCIAL_FORMULAS.md

# Real Estate Decision Portal — Financial Formulas

## 1. Purpose of This Document

This document defines the financial calculation engine for the Real Estate Decision Portal.

The purpose is to normalize different builder pricing formats into one consistent financial model so that every project and unit can be compared on a true cost basis.

The portal should not only show the builder’s quoted price. It must calculate:

* Agreement Value
* GST Amount
* TDS
* Stamp Duty
* Registration Charges
* Agreement Registration Charges
* Franking / E-Stamping
* Khata / Mutation Charges
* Legal Charges
* Corpus Fund
* Advance Maintenance
* Parking Cost
* Interior Budget
* Loan Amount
* EMI
* Rental Yield
* Total Landing Cost
* True Cost per SBA Sq.Ft
* True Cost per Carpet Sq.Ft
* Hidden Cost Percentage
* Payment Milestone Cash Flow

The financial engine must be transparent, configurable, and safe even when some data is missing.

---

## 2. Core Financial Philosophy

Builders do not present costs consistently.

Some builders provide a clean cost sheet. Others split charges across multiple heads. Some include parking, clubhouse, infrastructure, or GST in the quoted amount. Others show them separately. Some quote only the basic flat cost, while the true cost increases materially after statutory, maintenance, and interior costs.

Therefore, the portal must separate costs into clear layers:

1. **Basic Flat Cost**
2. **Agreement Value**
3. **Statutory and Acquisition Costs**
4. **Possession Costs**
5. **Post-Possession Costs**
6. **Total Landing Cost**

This layered approach allows the user to understand how the final cost builds up.

---

## 3. Formula Safety Rules

## 3.1 Missing Value Rule

For calculation safety:

```text
Missing numeric value = 0 inside formulas
```

However, the UI must not silently hide missing information.

Example:

If carpet area is missing:

* Formula should not crash.
* True Carpet Cost should show “Data Missing”.
* The project should show a missing-data warning.

## 3.2 Not Applicable Rule

If a charge is genuinely not applicable, it should be marked as:

```text
Not Applicable
```

Example:

* GST may not apply on a completed resale unit.
* Floor rise may not apply on lower floors.
* EV charging may not be offered.

## 3.3 Bundled Cost Rule

If a cost is included in another amount but not separately disclosed, mark it as:

```text
Bundled / Included
```

Example:

If parking is included in total cost but no separate parking charge is shown:

```text
parking.amount = 0
parking.treatment = "Included"
parking.notes = "Included in builder quote but not separately disclosed."
```

Do not treat this as “free parking” unless confirmed.

## 3.4 Manual Override Rule

Every major calculated value should allow manual override.

A calculated value should have:

* Calculated amount
* Manual override amount
* Final amount
* Override flag
* Notes

Example:

```text
finalAmount =
manualOverrideAmount if isManualOverride = true
else calculatedAmount
```

## 3.5 Currency Rule

All monetary values should use:

```text
Currency = INR
Format = Indian numbering system
Example = ₹1,83,26,994
```

---

# 4. Cost Layer Structure

## 4.1 Layer 1: Basic Flat Cost

This is the base residential unit cost before additional builder charges.

### Formula

```text
Basic Flat Cost =
Super Built-up Area × Base Price per Sq.Ft
```

### Alternative

If builder provides a flat amount directly:

```text
Basic Flat Cost = Builder Provided Basic Cost
```

### Rule

If both are available:

* Use builder-provided basic cost as final value.
* Keep the calculated value for validation.
* Show variance if the two do not match.

### Variance Formula

```text
Basic Cost Variance =
Builder Provided Basic Cost - Calculated Basic Cost
```

---

## 4.2 Layer 2: Core Builder Charges

Core builder charges include cost components that usually form the agreement value or builder payable amount.

Fields:

* Basic Flat Cost
* Car Parking Charges
* Clubhouse / Amenities Charges
* Infrastructure Development Charges
* BWSSB Charges
* BESCOM Charges
* Power Backup Charges
* DG / Generator Charges
* STP Charges
* EV Charging Provision Charges
* PLC Charges
* Corner Flat Premium
* Facing Premium
* Floor Rise Premium
* Other Core Charges

---

## 4.3 Layer 3: Agreement Value

Agreement Value is the main builder/agreement amount before statutory registration, possession, and post-possession costs.

### Formula

```text
Agreement Value =
Basic Flat Cost
+ Car Parking Charges
+ Clubhouse / Amenities Charges
+ Infrastructure Development Charges
+ BWSSB Charges
+ BESCOM Charges
+ Power Backup Charges
+ DG / Generator Charges
+ STP Charges
+ EV Charging Provision Charges
+ PLC Charges
+ Corner Flat Premium
+ Facing Premium
+ Floor Rise Premium
+ Other Core Charges
```

### UI Requirement

Show Agreement Value as a major KPI.

Also show a cost breakup waterfall:

```text
Basic Cost → Parking → Amenities → Infra → PLC/Floor Rise → Agreement Value
```

---

# 5. Floor Rise Formula

Floor rise calculation must support different builder rules.

Examples:

* DSR Courtyard: floor rise from 4th floor onward at ₹30/Sq.Ft
* The Adwaith: floor rise above 8th floor at ₹25 per floor/Sq.Ft

## 5.1 Generic Floor Rise Formula

```text
Chargeable Floors =
max(0, Floor Number - Floor Rise Start Floor + 1)
```

```text
Floor Rise Premium =
SBA × Floor Rise Rate per Sq.Ft × Chargeable Floors
```

## 5.2 Alternative Interpretation

Some builders may mean floor rise starts only above the baseline floor.

In that case:

```text
Chargeable Floors =
max(0, Floor Number - Floor Rise Start Floor)
```

## 5.3 Required Portal Behavior

Because builder wording can vary, the portal must allow:

* Floor rise start floor
* Floor rise rate per sq.ft
* Calculation mode:

  * Inclusive baseline
  * Above baseline only
* Manual override amount
* Notes

## 5.4 UI Warning

If floor number is missing but floor rise rule exists, show:

```text
Floor Rise Cannot Be Calculated — Floor Number Missing
```

---

# 6. GST Formula

GST treatment depends on property status and builder quote format.

## 6.1 GST Amount

```text
GST Amount =
GST Applicable Base × GST Percentage
```

## 6.2 GST Applicable Base

Default:

```text
GST Applicable Base = Agreement Value
```

However, the portal should allow GST base override because some builders may calculate GST only on specific components.

## 6.3 GST Treatment Types

GST field must support:

* Separate
* Included
* Not Applicable
* Unknown
* Estimated
* Manual Override

## 6.4 GST Formula

```text
GST Amount =
Agreement Value × GST Percentage
```

## 6.5 If GST Included in Builder Quote

If GST is included:

```text
GST Amount = Extracted or Builder Provided GST
```

If not separately available:

```text
GST Amount = 0 for additive calculation
GST Treatment = Included
```

UI should show:

```text
GST included in quote, not separately disclosed.
```

## 6.6 UI Warning

If GST treatment is unknown:

```text
GST Treatment Missing — Confirm with Builder
```

---

# 7. TDS Formula

TDS is a buyer-side tax deduction requirement where applicable.

## 7.1 TDS Applicability

TDS should be flagged when the property value crosses the applicable threshold.

The portal should not hardcode the threshold permanently. It should be configurable in Settings.

## 7.2 Formula

```text
TDS Amount =
TDS Applicable Base × TDS Percentage
```

Default assumption:

```text
TDS Applicable Base = Agreement Value
TDS Percentage = Settings.defaultTdsPercentage
```

## 7.3 Important UI Note

TDS is not an additional cost in the same way as GST or registration. It is usually deducted from the amount payable to the seller/builder and deposited with the government.

The portal should show it separately so that the user understands the cash-flow and compliance impact.

## 7.4 UI Display

Show:

* TDS Applicable: Yes / No / To Check
* TDS %
* TDS Amount
* Payment milestone where TDS is deducted
* TDS payment status
* TDS certificate status

---

# 8. Stamp Duty and Registration Formula

Stamp duty and registration are major statutory acquisition costs.

These must be explicit and configurable.

## 8.1 Stamp Duty Amount

```text
Stamp Duty Amount =
Stamp Duty Base × Stamp Duty Percentage
```

Default:

```text
Stamp Duty Base = Agreement Value
```

But the portal must allow override if actual government valuation or registration value differs.

## 8.2 Sale Deed Registration Amount

```text
Sale Deed Registration Amount =
Registration Base × Sale Deed Registration Percentage
```

Default:

```text
Registration Base = Agreement Value
```

## 8.3 Combined Stamp Duty and Registration

```text
Stamp Duty + Sale Deed Registration =
Stamp Duty Amount + Sale Deed Registration Amount
```

## 8.4 Settings-Driven Rates

The following values must come from Settings:

* Default stamp duty %
* Default sale deed registration %
* Default registration base assumption
* Default minimum charge, if any
* Default surcharge/cess, if any

## 8.5 Manual Override

Allow manual override when:

* Builder gives exact estimate
* Legal advisor gives exact estimate
* Government calculator gives exact value
* Registration value differs from agreement value

## 8.6 UI Requirement

Show stamp duty and registration as separate rows, not just combined.

Display:

* Stamp Duty
* Sale Deed Registration Fee
* Agreement Registration Charges
* Franking / E-Stamping
* Khata / Mutation
* Other statutory charges

---

# 9. Agreement Registration, Franking, and E-Stamping

These are additional document execution costs.

## 9.1 Agreement Registration Charges

```text
Agreement Registration Charges =
Builder Provided Amount or Settings Default
```

## 9.2 Franking / E-Stamping Charges

```text
Franking / E-Stamping Charges =
Builder Provided Amount or Settings Default
```

## 9.3 Treatment

These should be shown under:

```text
Statutory and Documentation Costs
```

They should be included in Total Sunk Acquisition Cost.

---

# 10. Khata Transfer and Mutation Charges

Khata and mutation costs should be tracked separately because they may occur later and may not appear in initial builder cost sheets.

## 10.1 Formula

```text
Khata / Mutation Charges =
Khata Transfer Charges
+ Mutation Charges
```

## 10.2 Treatment

If unknown:

```text
Show as Data Missing / To Be Confirmed
```

If not applicable yet:

```text
Show as Future Cost / Post-Registration
```

## 10.3 Inclusion

These charges should be included in Total Sunk Acquisition Cost or shown as a separately flagged post-registration statutory cost, depending on user settings.

Default:

```text
Include in Total Sunk Acquisition Cost
```

---

# 11. Mortgage, MODT, and Bank Charges

If home loan is used, additional bank and mortgage-related charges may apply.

## 11.1 Bank Charges

Track:

* Bank processing fee
* Bank legal verification charges
* Bank technical valuation charges
* MODT charges
* Mortgage registration charges
* Insurance linked to loan, if any

## 11.2 Bank Processing Fee Formula

```text
Bank Processing Fee =
Loan Amount × Bank Processing Fee Percentage
```

or

```text
Bank Processing Fee = Bank Provided Fixed Amount
```

## 11.3 MODT Formula

```text
MODT Charges =
Loan Amount × MODT Percentage
```

## 11.4 Inclusion Rule

Bank charges may be shown separately from property acquisition cost.

Dashboard should support both views:

1. **Property Landing Cost** — excludes loan processing costs.
2. **Total Cash Outflow Including Loan Setup** — includes bank charges.

## 11.5 Recommended Default

For the main real estate comparison:

```text
Total Landing Cost excludes loan setup charges by default.
```

But the financial planning page should include:

```text
Total Funding Requirement Including Loan Setup
```

---

# 12. Legal and Documentation Charges

## 12.1 Formula

```text
Total Legal and Documentation Charges =
Legal Documentation Charges
+ Agreement Draft Charges
+ Advocate Review Cost
+ Document Handling Charges
+ Miscellaneous Legal Charges
```

## 12.2 Inclusion

Legal and documentation charges should be included in:

```text
Total Sunk Acquisition Cost
```

---

# 13. Total Statutory Charges

## 13.1 Formula

```text
Total Statutory Charges =
GST Amount
+ Stamp Duty Amount
+ Sale Deed Registration Amount
+ Agreement Registration Charges
+ Franking / E-Stamping Charges
+ Khata Transfer Charges
+ Mutation Charges
+ Cess / Surcharge Charges
+ Other Government Charges
```

## 13.2 Optional Additions

Depending on settings, include or exclude:

* TDS
* Bank processing charges
* MODT
* Mortgage registration charges

## 13.3 TDS Handling

Default:

```text
TDS is shown separately and excluded from additive total cost,
because it is usually a deduction from payment, not an incremental cost.
```

But it must still appear in cash-flow planning.

---

# 14. Total Sunk Acquisition Cost

This is the cost to legally acquire the property, excluding possession and interior costs.

## 14.1 Formula

```text
Total Sunk Acquisition Cost =
Agreement Value
+ GST Amount
+ Stamp Duty Amount
+ Sale Deed Registration Amount
+ Agreement Registration Charges
+ Franking / E-Stamping Charges
+ Legal Documentation Charges
+ Advocate Review Cost
+ Khata Transfer Charges
+ Mutation Charges
+ Other Government Charges
```

## 14.2 Optional Formula Including Loan Setup

```text
Total Acquisition Cost Including Loan Setup =
Total Sunk Acquisition Cost
+ Bank Processing Fee
+ Bank Legal / Technical Charges
+ MODT Charges
+ Mortgage Registration Charges
```

---

# 15. Corpus Fund Formula

Corpus fund can be either lump sum or per sq.ft.

## 15.1 Per Sq.Ft Formula

```text
Corpus Fund =
SBA × Corpus Rate per Sq.Ft
```

## 15.2 Lump Sum Formula

```text
Corpus Fund =
Builder Provided Corpus Lump Sum
```

## 15.3 Rule

If both are available, use builder provided lump sum as final amount and show calculated value for validation.

---

# 16. Advance Maintenance Formula

Advance maintenance may be shown monthly or as a lump sum.

## 16.1 Monthly Rate Formula

```text
Total Advance Maintenance =
SBA × Maintenance Rate per Sq.Ft per Month × Maintenance Tenure in Months
```

## 16.2 Lump Sum Formula

```text
Total Advance Maintenance =
Builder Provided Maintenance Lump Sum
```

## 16.3 Maintenance GST

If GST applies on maintenance:

```text
Maintenance GST =
Total Advance Maintenance × Maintenance GST Percentage
```

## 16.4 Final Maintenance Cost

```text
Final Advance Maintenance Cost =
Total Advance Maintenance + Maintenance GST
```

## 16.5 Examples from Seed Data

DSR Courtyard:

```text
Maintenance = SBA × ₹4 × 24 months
```

Sanjeevini Adwaith:

```text
Maintenance = ₹96 per Sq.Ft for 2 years
```

Interpretation:

```text
Total Advance Maintenance = SBA × ₹96
```

This should be stored with notes because the builder format is different from monthly rate.

---

# 17. Possession Cost Formula

## 17.1 Formula

```text
Total Possession Sunk Cost =
Corpus Fund
+ Final Advance Maintenance Cost
+ Gas Pipeline Connection Charges
+ Water Meter Charges
+ Electricity Meter Charges
+ Sanitation Charges
+ Possession Charges
+ Handover Charges
```

## 17.2 Notes

These costs may not be part of the initial agreement value, but they are real cash outflows.

They should be clearly shown because they affect total landing cost.

---

# 18. Post-Possession Budget Formula

These are user-side costs after purchase.

## 18.1 Formula

```text
Total Post-Possession Budget =
Interior Fit-Out Budget
+ Appliance Budget
+ Move-In Budget
+ Repair / Modification Budget
+ Rental Readiness Budget
```

## 18.2 Interior Budget Logic

Interior budget can be entered as:

* Fixed amount
* Per BHK default
* Per sq.ft assumption
* Vendor quote

## 18.3 Suggested Formula

```text
Interior Fit-Out Budget =
Default Interior Budget by BHK
```

or

```text
Interior Fit-Out Budget =
SBA × Interior Cost per Sq.Ft
```

or

```text
Interior Fit-Out Budget =
Manual Vendor Quote
```

The portal should allow manual override.

---

# 19. Total Landing Cost Formula

Total Landing Cost is the most important practical cost metric.

## 19.1 Formula

```text
Total Landing Cost =
Total Sunk Acquisition Cost
+ Total Possession Sunk Cost
+ Total Post-Possession Budget
```

Expanded:

```text
Total Landing Cost =
Agreement Value
+ GST
+ Stamp Duty
+ Sale Deed Registration
+ Agreement Registration
+ Franking / E-Stamping
+ Legal Documentation
+ Khata / Mutation
+ Other Government Charges
+ Corpus
+ Advance Maintenance
+ Gas / Water / Electricity / Possession Charges
+ Interiors
+ Appliances
+ Move-In Budget
```

## 19.2 UI Requirement

The portal should show Total Landing Cost prominently in:

* Master Dashboard
* Unit Comparison
* Project Detail Page
* Financial Analysis Page

---

# 20. True Cost per SBA Sq.Ft

This normalizes cost using super built-up area.

## 20.1 Formula

```text
True Cost per SBA Sq.Ft =
Total Landing Cost / Super Built-up Area
```

## 20.2 Rule

If SBA is missing or zero:

```text
Show “Data Missing”
```

---

# 21. True Cost per Carpet Sq.Ft

This exposes the real cost of liveable space.

## 21.1 Formula

```text
True Cost per Carpet Sq.Ft =
Total Landing Cost / Carpet Area as per RERA
```

## 21.2 Rule

If carpet area is missing:

```text
Show “Carpet Area Missing”
```

## 21.3 Importance

True Carpet Cost is one of the most important comparison KPIs.

A project with lower SBA price may still be expensive if carpet efficiency is poor.

---

# 22. RERA Efficiency Ratio

## 22.1 Formula

```text
RERA Efficiency Ratio =
Carpet Area as per RERA / Super Built-up Area
```

## 22.2 Percentage Format

```text
RERA Efficiency % =
RERA Efficiency Ratio × 100
```

## 22.3 Rule

If carpet area is missing:

```text
Show “Data Missing”
```

## 22.4 Interpretation

Higher efficiency generally means more liveable area for the same saleable area.

Example:

```text
Unit A:
SBA = 1800
Carpet = 1260
Efficiency = 70%

Unit B:
SBA = 1800
Carpet = 1080
Efficiency = 60%

Unit A gives more usable space.
```

---

# 23. Hidden Cost Percentage

This shows how much the actual landing cost exceeds the basic flat cost.

## 23.1 Formula

```text
Hidden Cost Percentage =
(Total Landing Cost - Basic Flat Cost) / Basic Flat Cost
```

## 23.2 Percentage Format

```text
Hidden Cost % =
Hidden Cost Percentage × 100
```

## 23.3 Risk Band

Suggested risk bands:

```text
Green  = Hidden Cost below 10%
Amber  = Hidden Cost between 10% and 20%
Red    = Hidden Cost above 20%
```

## 23.4 Rule

If basic flat cost is missing or zero:

```text
Show “Cannot Calculate”
```

## 23.5 UI Requirement

The portal should explain why the hidden cost increased.

Show top contributors:

* GST
* Stamp duty and registration
* Parking
* Corpus
* Maintenance
* Interiors
* Legal/franking
* Infrastructure charges

---

# 24. Cost Completeness Score

This score shows how reliable the cost comparison is.

## 24.1 Suggested Required Fields

Critical fields:

* Basic Flat Cost
* Agreement Value
* GST Treatment
* Stamp Duty / Registration Assumption
* Parking Inclusion
* Corpus
* Maintenance
* Legal / Franking
* Interior Budget

## 24.2 Formula

```text
Cost Completeness Score =
Number of completed critical cost fields / Total critical cost fields × 100
```

## 24.3 Interpretation

```text
80% to 100% = Good
60% to 79%  = Needs Review
Below 60%   = Incomplete
```

---

# 25. Loan Amount Formula

## 25.1 Formula

```text
Target Loan Amount =
Agreement Value × Loan-To-Value Ratio
```

## 25.2 Alternative Formula

Some banks may consider eligible loan amount on agreement value plus selected statutory components.

The portal should allow:

```text
Loan Base =
Agreement Value
or
Agreement Value + GST
or
Manual Eligible Value
```

## 25.3 Own Contribution

```text
Own Contribution =
Total Landing Cost - Target Loan Amount
```

## 25.4 Registration Cash Requirement

Registration and stamp duty are often self-funded.

Track separately:

```text
Registration Cash Requirement =
Stamp Duty
+ Registration
+ Franking
+ Agreement Registration
+ Other Registration-Time Charges
```

---

# 26. EMI Formula

## 26.1 Monthly Interest Rate

```text
Monthly Interest Rate =
Annual Interest Rate / 12
```

If annual rate is entered as percentage:

```text
Monthly Interest Rate =
(Annual Interest Rate / 100) / 12
```

## 26.2 Number of Monthly Payments

```text
Number of Payments =
Loan Tenure in Years × 12
```

## 26.3 EMI Formula

```text
EMI =
P × r × (1 + r)^n / ((1 + r)^n - 1)
```

Where:

```text
P = Loan Principal
r = Monthly Interest Rate
n = Number of Monthly Payments
```

## 26.4 Zero Interest Rule

If interest rate is zero:

```text
EMI = Loan Principal / Number of Payments
```

## 26.5 UI Requirement

Show:

* Loan amount
* Interest rate
* Tenure
* EMI
* Own contribution
* Registration cash requirement
* Total first-year cash outflow

---

# 27. Rental Yield Formula

Investment evaluation requires rental yield calculations.

## 27.1 Expected Annual Rent

```text
Expected Annual Rent =
Expected Monthly Rent × 12
```

## 27.2 Gross Rental Yield

```text
Gross Rental Yield =
Expected Annual Rent / Total Landing Cost
```

## 27.3 Net Annual Rental Income

```text
Net Annual Rental Income =
Expected Annual Rent
- Annual Maintenance Paid by Owner
- Annual Property Tax
- Vacancy Loss
- Other Annual Owner Costs
```

## 27.4 Vacancy Loss

```text
Vacancy Loss =
Expected Monthly Rent × Expected Vacancy Months Per Year
```

## 27.5 Net Rental Yield

```text
Net Rental Yield =
Net Annual Rental Income / Total Landing Cost
```

## 27.6 UI Requirement

Show both gross and net yield.

Do not show only gross yield because it may overstate investment attractiveness.

---

# 28. Appreciation and Future Value Formula

## 28.1 Future Resale Value

```text
Expected Resale Value =
Total Landing Cost × (1 + Expected Annual Appreciation %) ^ Holding Period Years
```

## 28.2 Capital Gain

```text
Expected Capital Gain =
Expected Resale Value - Total Landing Cost
```

## 28.3 Total Return

```text
Total Return =
Expected Capital Gain + Total Net Rental Income During Holding Period
```

## 28.4 Simple ROI

```text
Simple ROI =
Total Return / Total Landing Cost
```

## 28.5 Note

This is a planning estimate, not guaranteed return.

The portal should label appreciation assumptions clearly as user assumptions.

---

# 29. Payment Milestone Formula

Payment milestones can be builder-specific.

## 29.1 Milestone Amount

```text
Milestone Amount =
Agreement Value × Milestone Percentage
```

## 29.2 GST on Milestone

```text
Milestone GST =
Milestone Amount × GST Percentage
```

## 29.3 TDS on Milestone

```text
Milestone TDS =
Milestone Amount × TDS Percentage
```

## 29.4 Net Payable to Builder

```text
Net Builder Payment =
Milestone Amount + Milestone GST - Milestone TDS
```

## 29.5 Total Milestone Percentage Check

```text
Total Milestone Percentage =
Sum of all milestone percentages
```

Validation:

```text
If Total Milestone Percentage != 100%, show warning.
```

## 29.6 Cash Flow Split

```text
Loan Disbursement =
Milestone Amount × Loan Funding Percentage
```

```text
Own Contribution =
Milestone Amount + GST - TDS - Loan Disbursement
```

## 29.7 UI Requirement

Show:

* Milestone list
* Percentage
* Amount
* GST
* TDS
* Own contribution
* Loan disbursement
* Due date
* Paid status
* Receipt status

---

# 30. Builder-Specific Payment Schedule Notes

## 30.1 The Earthscape

Payment schedule:

```text
10% Booking
10% Agreement
7% Footing
7% Lower Basement Slab
7% Ground Floor Slab
7% Fourth Floor Slab
7% Eighth Floor Slab
7% Twelfth Floor Slab
7% Sixteenth Floor Slab
7% Twentieth Floor Slab
7% Terrace Slab
6% Flooring
6% Internal Painting
5% Possession / OC
```

Validation:

```text
Total = 100%
```

## 30.2 Myhna Orchid

Payment plan includes a major booking/agreement down-payment milestone.

The current known requirement is:

```text
20% booking/agreement down-payment milestone
```

The exact remaining milestone structure should be imported from the workbook or entered manually.

## 30.3 Other Builders

For DSR Courtyard, DSR The Address, and Sanjeevini Adwaith, payment schedules should be captured if present in the workbook or during site visits.

---

# 31. Parking Cost Formula

Parking has both financial and practical implications.

## 31.1 Total Parking Cost

```text
Total Parking Cost =
Base Car Parking Charges
+ Additional Parking Cost
+ Additional Parking Registration Charges
```

## 31.2 Additional Parking Logic

```text
Additional Parking Cost =
Additional Parking Cost per Slot
if Second Parking Required = true
else 0
```

## 31.3 Parking Clarity Risk

Parking clarity should be scored based on:

* Number of slots included
* Slot type known
* Dimensions known
* Slot number known
* EV status known
* Extra parking cost known

## 31.4 UI Requirement

Show parking separately from cost table:

* Parking included?
* Number of slots
* Type
* Dimensions
* EV readiness
* Extra parking availability
* Extra parking cost
* Clarity status

---

# 32. True Value Analysis

The True Value Analysis panel should compare quoted vs actual cost.

## 32.1 Display Values

Show:

* Builder Quoted Cost
* Basic Flat Cost
* Agreement Value
* GST
* Stamp Duty
* Registration
* Legal / Franking
* Corpus
* Maintenance
* Parking Extras
* Interiors
* Total Landing Cost
* Difference from Builder Quote
* Hidden Cost Percentage
* True SBA Cost
* True Carpet Cost

## 32.2 Difference from Builder Quote

```text
Difference from Builder Quote =
Total Landing Cost - Builder Quoted Cost
```

## 32.3 Difference Percentage

```text
Difference % =
Difference from Builder Quote / Builder Quoted Cost
```

## 32.4 Explanation Logic

The UI should explain:

```text
Your total landing cost is higher mainly because of:
1. Stamp duty and registration
2. GST
3. Interiors
4. Maintenance and corpus
5. Parking or infrastructure charges
```

The top contributors should be sorted by amount.

---

# 33. Living Budget Comfort Formula

This is a user-specific affordability score.

## 33.1 EMI-to-Income Ratio

```text
EMI to Monthly Income Ratio =
Estimated Monthly EMI / Monthly Net Income
```

Monthly net income may be entered in Settings.

## 33.2 Risk Bands

Suggested:

```text
Comfortable = EMI below 30% of monthly net income
Stretch     = EMI between 30% and 45%
Risk        = EMI above 45%
```

The thresholds should be configurable.

## 33.3 Cash Buffer Rule

The portal should also track whether the user has enough liquidity for:

* Booking amount
* Agreement payment
* Registration
* Interiors
* Emergency buffer

---

# 34. Investment Comparison Metrics

For investment comparison, show:

* Total Landing Cost
* Expected Monthly Rent
* Gross Rental Yield
* Net Rental Yield
* Expected Appreciation
* Expected Resale Value
* Maintenance Burden
* Rental Demand Score
* Resale Liquidity Score
* Investment Score

## 34.1 Maintenance Burden

```text
Maintenance Burden % =
Annual Maintenance Paid by Owner / Expected Annual Rent
```

High maintenance burden can reduce investment attractiveness.

---

# 35. Project-Level Financial Aggregations

For a project with multiple units, show:

## 35.1 Starting Price

```text
Starting Price =
Minimum Total Landing Cost among available units
```

## 35.2 Average True SBA Cost

```text
Average True SBA Cost =
Average of True Cost per SBA Sq.Ft across selected units
```

## 35.3 Average True Carpet Cost

```text
Average True Carpet Cost =
Average of True Cost per Carpet Sq.Ft across units with carpet data
```

## 35.4 Lowest Entry Unit

The unit with the lowest total landing cost.

## 35.5 Best Efficiency Unit

The unit with the highest RERA efficiency ratio.

## 35.6 Best Living Unit

The unit with highest Living Score.

## 35.7 Best Investment Unit

The unit with highest Investment Score.

---

# 36. Formula Dependency Order

The calculation engine should compute in this order:

1. Basic Flat Cost
2. Floor Rise Premium
3. Agreement Value
4. GST
5. TDS
6. Stamp Duty
7. Registration
8. Agreement Registration / Franking
9. Legal Charges
10. Total Statutory Charges
11. Total Sunk Acquisition Cost
12. Corpus
13. Advance Maintenance
14. Possession Cost
15. Post-Possession Budget
16. Total Landing Cost
17. True Cost per SBA
18. True Cost per Carpet
19. Hidden Cost Percentage
20. Loan Amount
21. EMI
22. Rental Yield
23. Payment Milestone Amounts
24. Score Inputs

---

# 37. Financial Warnings and Flags

The portal should show warnings for:

## 37.1 Missing Critical Inputs

* SBA missing
* Carpet area missing
* Basic cost missing
* GST treatment unknown
* Stamp duty assumption missing
* Registration assumption missing
* Parking unknown
* Corpus missing
* Maintenance missing
* Possession date missing

## 37.2 High Cost Risks

* Hidden cost above 20%
* True carpet cost materially higher than true SBA cost
* Corpus unusually high
* Maintenance unusually high
* Parking cost unclear
* Floor rise not calculated
* Registration/stamp duty missing
* Interior budget missing

## 37.3 Cash Flow Risks

* High upfront payment
* Milestone percentage not totaling 100%
* Registration cash requirement high
* EMI affordability risk
* Loan amount not sufficient
* Own contribution shortfall

---

# 38. Settings Required for Financial Engine

The Settings page should include:

## 38.1 Tax and Registration Settings

* Default GST %
* Default TDS %
* Default TDS threshold
* Default stamp duty %
* Default sale deed registration %
* Default agreement registration charge
* Default franking/e-stamping charge
* Default Khata transfer charge
* Default mutation charge
* Default cess/surcharge %

## 38.2 Loan Settings

* Default loan-to-value ratio
* Default annual interest rate
* Default loan tenure
* Default bank processing fee %
* Default MODT %
* Default mortgage registration assumption
* Default bank legal/technical charge

## 38.3 Interior Settings

* Default 2BHK interior budget
* Default 2.5BHK interior budget
* Default 3BHK interior budget
* Default 3.5BHK interior budget
* Default 4BHK interior budget
* Default appliance budget
* Default move-in budget

## 38.4 Affordability Settings

* Monthly net income
* Comfortable EMI threshold
* Stretch EMI threshold
* Emergency buffer target

---

# 39. UI Display Requirements

The financial UI should be organized into layered sections.

## 39.1 Recommended Display Blocks

1. Builder Quote
2. Core Agreement Cost
3. Statutory and Registration Cost
4. Possession Cost
5. Interiors and Move-In Cost
6. Total Landing Cost
7. Cost per Sq.Ft
8. Loan and EMI
9. Rental / Investment
10. Payment Milestones

## 39.2 Every Cost Field Should Show

* Amount
* Treatment
* Source
* Confidence
* Notes
* Last updated date, where available

---

# 40. Final Formula Principle

The portal must help the user understand the real financial picture.

It should not answer only:

> “What is the builder quoting?”

It should answer:

> “What will I actually pay from booking to possession, registration, interiors, and move-in — and how does that compare across projects?”

The financial engine is the core of the portal’s decision value.
