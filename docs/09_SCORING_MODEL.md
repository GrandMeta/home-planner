# 09_SCORING_MODEL.md

# Real Estate Decision Portal — Scoring Model

## 1. Purpose of This Document

This document defines the scoring model for the Real Estate Decision Portal.

The portal must evaluate projects and units from two separate perspectives:

1. **Living Score** — How suitable is this project/unit as a future home?
2. **Investment Score** — How attractive is this project/unit as a financial asset?

A project can be excellent for living but average for investment.
A project can be strong for investment but inconvenient for self-living.
The portal must keep these two evaluations separate.

The scoring model should help the user answer:

* Which project is best for my family to live in?
* Which project has the best investment potential?
* Which project is financially risky?
* Which project has legal or possession risk?
* Which project has hidden cost risk?
* Which unit should be shortlisted?
* Which unit should be avoided?
* What data is missing before making a decision?

---

## 2. Scoring Philosophy

The scoring system should be:

* Transparent
* Editable
* Weight-based
* Explainable
* Not overly complex
* Useful for decision-making
* Supportive, not blindly deterministic

The score should not make the final decision automatically. It should guide the user by showing strengths, weaknesses, risks, and missing data.

The portal should always show the reason behind a score.

Example:

```text
Living Score: 78 / 100

Strengths:
- Good carpet efficiency
- Parking included
- Strong amenities
- Acceptable commute

Weaknesses:
- Metro distance is high
- Registration estimate missing
- Water source not confirmed
```

---

## 3. Scoring Scale

All major scores should use a 0 to 100 scale.

| Score Range | Interpretation         |
| ----------: | ---------------------- |
|      85–100 | Excellent              |
|       70–84 | Good                   |
|       55–69 | Average / Needs Review |
|       40–54 | Weak                   |
|    Below 40 | Poor / Avoid           |

The score should be shown with an interpretation label.

Example:

```text
Living Score: 82 — Good
Investment Score: 67 — Needs Review
```

---

## 4. Recommendation Labels

Based on combined scores and risks, the portal should show a recommendation label.

Suggested labels:

| Recommendation   | Meaning                                       |
| ---------------- | --------------------------------------------- |
| Strong Shortlist | Excellent candidate, worth active pursuit     |
| Shortlist        | Good candidate, compare seriously             |
| Revisit          | Needs more data or another site visit         |
| Watchlist        | Keep tracking but do not prioritize yet       |
| Avoid for Now    | Major concern or poor fit                     |
| Rejected         | User has rejected the option                  |
| On Hold          | Paused due to timing, budget, or missing data |

The recommendation should not be based only on score. It should also consider critical risks.

Example:

```text
If Living Score is 86 but RERA is missing, do not show Strong Shortlist.
Show: Revisit / Legal Review Required.
```

---

# 5. Score Types

The portal should calculate the following scores.

## 5.1 Primary Scores

1. Living Score
2. Investment Score

## 5.2 Supporting Scores

1. Financial Score
2. Location Score
3. Parking Score
4. Legal/RERA Score
5. Possession Confidence Score
6. Construction Quality Score
7. Amenities Score
8. Data Completeness Score
9. Risk Score

## 5.3 Usage

Primary scores appear prominently in:

* Master Dashboard
* Project Detail Page
* Unit Comparison
* Map Popup
* Financial Analysis Page

Supporting scores appear in detail views and score breakdown panels.

---

# 6. Score Calculation Method

## 6.1 Weighted Average Formula

Each score should be calculated using weighted parameters.

```text
Score =
Sum(Parameter Score × Parameter Weight) / Sum(Parameter Weights)
```

Each parameter score should be between 0 and 100.

Each parameter weight should be configurable.

## 6.2 Missing Parameter Rule

If a parameter is missing:

Option 1 — Recommended default:

```text
Exclude missing parameter from score calculation,
but reduce Data Completeness Score.
```

Option 2 — Conservative mode:

```text
Treat missing critical parameter as a low score.
```

The user should be able to choose scoring mode in Settings.

Default:

```text
Missing non-critical data is excluded from score calculation.
Missing critical data creates a warning and reduces recommendation confidence.
```

## 6.3 Critical Risk Override

Certain risks should override high scores.

Examples:

* RERA not available
* Parking not confirmed
* Legal risk marked high
* Possession date unclear
* Final cost sheet missing
* Major hidden cost above threshold
* Water source unclear in a high-risk area

If critical risk exists, recommendation should be capped.

Example:

```text
If Legal Risk = Critical,
maximum recommendation = Revisit / Legal Review Required.
```

---

# 7. Living Score Model

## 7.1 Objective

Living Score answers:

```text
Can I realistically live here with my family?
```

It should evaluate daily life, comfort, commute, layout, parking, utilities, amenities, and family suitability.

## 7.2 Living Score Parameters

| Parameter                         | Default Weight | Description                               |
| --------------------------------- | -------------: | ----------------------------------------- |
| Commute Convenience               |             15 | Distance/time to primary workplace        |
| Location and Daily Convenience    |             10 | Grocery, schools, hospitals, access roads |
| Metro and Public Transport Access |              7 | Functional/planned metro usability        |
| Carpet Efficiency                 |             10 | Carpet area vs SBA                        |
| Unit Layout Suitability           |             10 | Practical layout, room sizes, ventilation |
| Parking Adequacy                  |              8 | Number/type/clarity of parking            |
| Water and Power Infrastructure    |              8 | Water source, backup, STP, utilities      |
| Amenities Usefulness              |              7 | Useful amenities for family life          |
| Community and Density             |              7 | Total units, open space, lifts, crowding  |
| Builder and Construction Quality  |              8 | Quality, delivery confidence              |
| Possession Certainty              |              5 | RERA/handover confidence                  |
| Budget Comfort                    |              5 | Affordability and EMI comfort             |

Total default weight:

```text
100
```

---

## 7.3 Living Score Parameter Details

### 7.3.1 Commute Convenience

Inputs:

* Distance to primary workplace
* Peak commute time
* Non-peak commute time
* Traffic bottlenecks
* Route quality
* Metro alternative

Suggested scoring:

| Condition                     |  Score |
| ----------------------------- | -----: |
| Peak commute below 30 minutes | 90–100 |
| 30–45 minutes                 |  75–89 |
| 45–60 minutes                 |  55–74 |
| 60–75 minutes                 |  35–54 |
| Above 75 minutes              |   0–34 |

Adjust down if:

* Road is poor
* Last-mile access is bad
* Route has severe bottlenecks

Adjust up if:

* Functional metro is practical
* Multiple route options exist

---

### 7.3.2 Location and Daily Convenience

Inputs:

* Grocery access
* Hospital access
* School access
* Main road distance
* Retail ecosystem
* Safety perception
* Area maturity

Suggested scoring:

| Condition                                     |  Score |
| --------------------------------------------- | -----: |
| Mature location with strong daily convenience | 85–100 |
| Good but still developing                     |  70–84 |
| Basic convenience available                   |  55–69 |
| Weak convenience                              |  35–54 |
| Poor daily infrastructure                     |   0–34 |

---

### 7.3.3 Metro and Public Transport Access

Inputs:

* Distance to functional metro
* Distance to planned metro
* Last-mile feasibility
* Public transport availability

Suggested scoring:

| Condition                            |                        Score |
| ------------------------------------ | ---------------------------: |
| Functional metro within 1 km         |                       90–100 |
| Functional metro within 1–3 km       |                        75–89 |
| Functional metro within 3–5 km       |                        55–74 |
| Only planned metro nearby            | 40–70 depending on certainty |
| No meaningful metro/public transport |                         0–39 |

Important:

Planned metro should not receive the same score as operational metro.

---

### 7.3.4 Carpet Efficiency

Formula:

```text
RERA Efficiency Ratio = Carpet Area / Super Built-up Area
```

Suggested scoring:

| Efficiency    |  Score |
| ------------- | -----: |
| 75% and above | 90–100 |
| 70%–74.9%     |  80–89 |
| 65%–69.9%     |  65–79 |
| 60%–64.9%     |  45–64 |
| Below 60%     |   0–44 |

If carpet area is missing:

```text
Score = Missing
Show: Carpet Area Missing
```

---

### 7.3.5 Unit Layout Suitability

Inputs:

* Room sizes
* Kitchen usability
* Utility size
* Balcony usability
* Wasted passage area
* Ventilation
* Natural light
* Vastu preference, if relevant
* Privacy from adjacent units/towers

Suggested scoring:

| Condition                          |  Score |
| ---------------------------------- | -----: |
| Excellent practical layout         | 85–100 |
| Good layout with minor compromises |  70–84 |
| Average layout                     |  55–69 |
| Weak layout                        |  35–54 |
| Poor/unusable layout               |   0–34 |

---

### 7.3.6 Parking Adequacy

Inputs:

* Number of slots included
* Parking type
* Slot dimensions
* Independent/tandem
* EV readiness
* Extra parking availability
* Visitor parking

Suggested scoring:

| Condition                                               |  Score |
| ------------------------------------------------------- | -----: |
| Required parking included, clear, independent, EV-ready | 90–100 |
| Parking included and mostly clear                       |  75–89 |
| Parking included but dimensions/allotment unclear       |  55–74 |
| Parking count inadequate or tandem/mechanical risk      |  35–54 |
| Parking not confirmed                                   |   0–34 |

Critical risk:

```text
If parking inclusion is unknown, cap Living Score recommendation to Revisit.
```

---

### 7.3.7 Water and Power Infrastructure

Inputs:

* Water source
* Cauvery connection
* Borewell
* Tanker dependency
* STP
* Rainwater harvesting
* Power backup coverage
* Piped gas
* Security systems

Suggested scoring:

| Condition                                  |  Score |
| ------------------------------------------ | -----: |
| Strong water + power backup clarity        | 85–100 |
| Good infrastructure with minor uncertainty |  70–84 |
| Average infrastructure                     |  55–69 |
| High tanker or backup uncertainty          |  35–54 |
| Major water/power risk                     |   0–34 |

---

### 7.3.8 Amenities Usefulness

Inputs:

* Clubhouse
* Gym
* Pool
* Play area
* Walking/jogging track
* Senior citizen area
* Co-working
* Pet area
* Amenities readiness
* Maintenance burden

Suggested scoring:

| Condition                            |  Score |
| ------------------------------------ | -----: |
| Useful amenities ready or credible   | 85–100 |
| Good promised amenities              |  70–84 |
| Average amenities                    |  55–69 |
| Weak amenities or delayed            |  35–54 |
| Amenities only marketing, no clarity |   0–34 |

---

### 7.3.9 Community and Density

Inputs:

* Total units
* Units per acre
* Lifts per tower
* Units per floor
* Open space
* Common area crowding
* Parking circulation
* Visitor parking

Suggested scoring:

| Condition                                   |  Score |
| ------------------------------------------- | -----: |
| Low/comfortable density and good open space | 85–100 |
| Good community planning                     |  70–84 |
| Average density                             |  55–69 |
| High density                                |  35–54 |
| Very crowded / poor planning                |   0–34 |

---

### 7.3.10 Builder and Construction Quality

Inputs:

* Builder reputation
* Past delivery
* Model flat quality
* Actual flat visit
* Materials
* Finishing
* Construction progress
* Quality observations

Suggested scoring:

| Condition                              |  Score |
| -------------------------------------- | -----: |
| Strong builder + good quality evidence | 85–100 |
| Good builder/quality                   |  70–84 |
| Average                                |  55–69 |
| Weak confidence                        |  35–54 |
| Major concern                          |   0–34 |

---

### 7.3.11 Possession Certainty

Inputs:

* RERA possession date
* Builder handover date
* Current construction stage
* Progress vs timeline
* OC/CC status
* Phase clarity

Suggested scoring:

| Condition                                |  Score |
| ---------------------------------------- | -----: |
| Ready/near-ready with clear documents    | 90–100 |
| Under construction but timeline credible |  70–89 |
| Timeline moderate uncertainty            |  50–69 |
| High delay risk                          |  25–49 |
| No credible possession clarity           |   0–24 |

---

### 7.3.12 Budget Comfort

Inputs:

* Total landing cost
* EMI estimate
* Own contribution
* Registration cash requirement
* Interior budget
* Emergency buffer

Suggested scoring:

| Condition                     |  Score |
| ----------------------------- | -----: |
| Comfortable within budget     | 85–100 |
| Slight stretch but manageable |  70–84 |
| Moderate stretch              |  55–69 |
| High stretch                  |  35–54 |
| Financially risky             |   0–34 |

---

# 8. Investment Score Model

## 8.1 Objective

Investment Score answers:

```text
Is this project/unit a good financial asset?
```

It should evaluate entry price, rental yield, appreciation potential, resale liquidity, location upside, possession risk, hidden costs, and maintenance burden.

---

## 8.2 Investment Score Parameters

| Parameter                          | Default Weight | Description                                |
| ---------------------------------- | -------------: | ------------------------------------------ |
| Entry Price Attractiveness         |             15 | Cost relative to area and alternatives     |
| True Cost per SBA/Carpet           |             12 | Normalized true cost                       |
| Rental Yield Potential             |             12 | Expected gross/net yield                   |
| Appreciation Potential             |             12 | Future area/project upside                 |
| Location and Employment Demand     |             10 | Tenant demand, tech corridor, connectivity |
| Metro/Infrastructure Upside        |              8 | Future infra growth                        |
| Builder Brand and Resale Liquidity |             10 | Resale confidence                          |
| Possession Timeline                |              7 | Time to rental/resale readiness            |
| Hidden Cost Risk                   |              7 | Additional cost burden                     |
| Maintenance Burden                 |              4 | Maintenance vs rent                        |
| Micro-Market Supply Risk           |              3 | Competing supply risk                      |

Total default weight:

```text
100
```

---

## 8.3 Investment Score Parameter Details

### 8.3.1 Entry Price Attractiveness

Inputs:

* Base rate per sq.ft
* Total landing cost
* Area benchmark price
* Competing project prices
* Negotiated discount
* Builder brand premium

Suggested scoring:

| Condition                             |  Score |
| ------------------------------------- | -----: |
| Clearly below comparable market value | 85–100 |
| Fair price                            |  70–84 |
| Slightly expensive                    |  55–69 |
| Expensive                             |  35–54 |
| Very expensive                        |   0–34 |

---

### 8.3.2 True Cost per SBA/Carpet

Inputs:

* True cost per SBA sq.ft
* True cost per carpet sq.ft
* Carpet efficiency
* Hidden charges

Suggested scoring:

| Condition                                |  Score |
| ---------------------------------------- | -----: |
| Low true cost and good carpet efficiency | 85–100 |
| Fair true cost                           |  70–84 |
| Average                                  |  55–69 |
| High true cost                           |  35–54 |
| Very high true cost                      |   0–34 |

---

### 8.3.3 Rental Yield Potential

Formula:

```text
Gross Rental Yield = Expected Annual Rent / Total Landing Cost
```

```text
Net Rental Yield = Net Annual Rental Income / Total Landing Cost
```

Suggested scoring:

| Gross Yield |  Score |
| ----------- | -----: |
| Above 4.0%  | 85–100 |
| 3.5%–4.0%   |  70–84 |
| 3.0%–3.5%   |  55–69 |
| 2.5%–3.0%   |  35–54 |
| Below 2.5%  |   0–34 |

Adjust using net yield if owner maintenance, vacancy, or property tax is high.

---

### 8.3.4 Appreciation Potential

Inputs:

* Area development
* Future infrastructure
* Metro
* Road improvements
* Employment growth
* Builder brand
* Entry price
* Land scarcity
* Upcoming competing supply

Suggested scoring:

| Condition            |  Score |
| -------------------- | -----: |
| Strong future upside | 85–100 |
| Good upside          |  70–84 |
| Moderate upside      |  55–69 |
| Limited upside       |  35–54 |
| Weak upside          |   0–34 |

---

### 8.3.5 Location and Employment Demand

Inputs:

* Distance to tech parks/employment hubs
* Tenant profile
* Rental demand
* Corporate catchment
* Connectivity
* Social infrastructure

Suggested scoring:

| Condition                       |  Score |
| ------------------------------- | -----: |
| Strong tenant/employment demand | 85–100 |
| Good demand                     |  70–84 |
| Moderate demand                 |  55–69 |
| Weak demand                     |  35–54 |
| Poor rental catchment           |   0–34 |

---

### 8.3.6 Metro/Infrastructure Upside

Inputs:

* Functional metro
* Planned metro
* Road projects
* Flyovers
* Business corridors
* Public infrastructure

Suggested scoring:

| Condition                                   |  Score |
| ------------------------------------------- | -----: |
| Confirmed infrastructure already functional | 85–100 |
| High-confidence upcoming infrastructure     |  70–84 |
| Moderate expected infrastructure            |  55–69 |
| Uncertain future infra                      |  35–54 |
| No meaningful infra upside                  |   0–34 |

---

### 8.3.7 Builder Brand and Resale Liquidity

Inputs:

* Builder reputation
* Past projects
* Resale demand
* Construction quality
* Community quality
* Buyer trust

Suggested scoring:

| Condition                                 |  Score |
| ----------------------------------------- | -----: |
| Strong builder with high resale liquidity | 85–100 |
| Good builder                              |  70–84 |
| Average builder                           |  55–69 |
| Weak brand                                |  35–54 |
| Low resale confidence                     |   0–34 |

---

### 8.3.8 Possession Timeline

Inputs:

* Ready-to-move vs under-construction
* Construction stage
* RERA date
* Expected rental start date
* Delay risk

Suggested scoring:

| Condition                       |  Score |
| ------------------------------- | -----: |
| Ready or near possession        | 85–100 |
| Possession within 12 months     |  70–84 |
| 12–24 months                    |  55–69 |
| 24–36 months                    |  35–54 |
| More than 36 months / uncertain |   0–34 |

Investment logic:

Longer possession delays reduce near-term rental yield and increase risk.

---

### 8.3.9 Hidden Cost Risk

Formula:

```text
Hidden Cost % =
(Total Landing Cost - Basic Flat Cost) / Basic Flat Cost
```

Suggested scoring:

| Hidden Cost % |  Score |
| ------------- | -----: |
| Below 10%     | 85–100 |
| 10%–15%       |  70–84 |
| 15%–20%       |  55–69 |
| 20%–30%       |  35–54 |
| Above 30%     |   0–34 |

---

### 8.3.10 Maintenance Burden

Formula:

```text
Maintenance Burden % =
Annual Maintenance Paid by Owner / Expected Annual Rent
```

Suggested scoring:

| Maintenance Burden |  Score |
| ------------------ | -----: |
| Below 8% of rent   | 85–100 |
| 8%–12%             |  70–84 |
| 12%–18%            |  55–69 |
| 18%–25%            |  35–54 |
| Above 25%          |   0–34 |

---

### 8.3.11 Micro-Market Supply Risk

Inputs:

* Number of competing projects
* Unsold inventory
* Future supply
* Rental competition
* Similar units nearby

Suggested scoring:

| Condition           |  Score |
| ------------------- | -----: |
| Low supply risk     | 85–100 |
| Manageable supply   |  70–84 |
| Moderate supply     |  55–69 |
| High supply         |  35–54 |
| Oversupplied market |   0–34 |

---

# 9. Financial Score

Financial Score is a supporting score used in both Living and Investment scoring.

## 9.1 Inputs

* Total landing cost
* True cost per SBA
* True cost per carpet
* Hidden cost percentage
* EMI
* Own contribution
* Registration cash requirement
* Interior budget
* Cost completeness
* Negotiation potential

## 9.2 Suggested Interpretation

| Condition                    |  Score |
| ---------------------------- | -----: |
| Transparent and comfortable  | 85–100 |
| Mostly clear and manageable  |  70–84 |
| Some missing/uncertain costs |  55–69 |
| High hidden cost or stretch  |  35–54 |
| Financially risky            |   0–34 |

---

# 10. Legal/RERA Score

## 10.1 Inputs

* RERA number
* RERA verification
* RERA possession date
* Phase clarity
* Approved plan
* CC/OC status
* Draft agreement
* Cancellation policy
* Land title clarity
* Bank approvals
* Litigation disclosure
* Delay penalty clause

## 10.2 Suggested Scoring

| Condition                     |  Score |
| ----------------------------- | -----: |
| Legal data verified and clean | 85–100 |
| Most legal items available    |  70–84 |
| Some items pending            |  55–69 |
| Major documents pending       |  35–54 |
| Legal red flags               |   0–34 |

## 10.3 Critical Overrides

If any of these are high risk:

* RERA missing
* RERA phase unclear
* Land title risk
* Litigation concern
* Draft agreement unavailable before booking

Then recommendation should be capped at:

```text
Legal Review Required
```

---

# 11. Parking Score

## 11.1 Inputs

* Parking included
* Number of car parks
* Parking type
* Parking dimensions
* Independent/tandem
* EV charging
* Visitor parking
* Additional parking availability
* Written allotment clarity

## 11.2 Suggested Scoring

| Condition                          |  Score |
| ---------------------------------- | -----: |
| Fully clear and adequate           | 85–100 |
| Included but minor details pending |  70–84 |
| Included but unclear               |  55–69 |
| Inadequate or risky                |  35–54 |
| Not confirmed                      |   0–34 |

---

# 12. Data Completeness Score

## 12.1 Objective

Data Completeness Score shows how reliable the comparison is.

A project with high score but low data completeness should not be trusted fully.

## 12.2 Completeness Categories

Track completeness for:

* Project identity
* Unit details
* Space details
* Cost details
* Parking
* Legal/RERA
* Location
* Amenities
* Site visit
* Financial planning
* Investment assumptions

## 12.3 Formula

```text
Data Completeness Score =
Completed Important Fields / Total Important Fields × 100
```

## 12.4 Critical Missing Fields

Critical missing fields include:

* Final cost sheet
* Basic flat cost
* Agreement value
* GST treatment
* Registration estimate
* Carpet area
* Parking inclusion
* Parking count
* RERA number
* RERA possession date
* Possession date
* Maintenance/corpus
* Legal documents
* Payment schedule

## 12.5 Score Interpretation

| Completeness | Meaning               |
| -----------: | --------------------- |
|       85–100 | Reliable for decision |
|        70–84 | Mostly reliable       |
|        55–69 | Needs review          |
|        35–54 | Incomplete            |
|     Below 35 | Not decision-ready    |

---

# 13. Risk Score

## 13.1 Objective

Risk Score should summarize risk exposure.

Unlike other scores, higher risk should mean worse condition.

Recommended display:

```text
Risk Level: Low / Medium / High / Critical
```

Instead of showing “Risk Score: 82”, show:

```text
Overall Risk: High
```

## 13.2 Risk Categories

* Financial risk
* Legal risk
* Parking risk
* Possession risk
* Construction risk
* Location risk
* Water/power risk
* Builder risk
* Documentation risk
* Investment risk

## 13.3 Risk Severity Values

| Severity   | Numeric Value |
| ---------- | ------------: |
| None / Low |             1 |
| Medium     |             2 |
| High       |             3 |
| Critical   |             4 |

## 13.4 Overall Risk Logic

Suggested logic:

```text
If any Critical risk exists → Overall Risk = Critical
Else if two or more High risks exist → Overall Risk = High
Else if one High risk exists → Overall Risk = High
Else if two or more Medium risks exist → Overall Risk = Medium
Else → Overall Risk = Low
```

---

# 14. Recommendation Logic

## 14.1 Base Recommendation

Use Living Score and Investment Score depending on purpose.

If project purpose is Living:

```text
Primary Score = Living Score
```

If project purpose is Investment:

```text
Primary Score = Investment Score
```

If project purpose is Both:

```text
Primary Score = average of Living Score and Investment Score
```

## 14.2 Score-Based Recommendation

| Primary Score | Base Recommendation |
| ------------: | ------------------- |
|        85–100 | Strong Shortlist    |
|         70–84 | Shortlist           |
|         55–69 | Revisit             |
|         40–54 | Watchlist           |
|      Below 40 | Avoid for Now       |

## 14.3 Risk-Based Cap

Apply caps:

| Risk Condition             | Maximum Recommendation          |
| -------------------------- | ------------------------------- |
| Critical legal risk        | Legal Review Required / Revisit |
| Parking unknown            | Revisit                         |
| Final cost sheet missing   | Data Pending                    |
| Agreement value unknown    | Data Pending                    |
| RERA missing               | Legal Review Required           |
| High hidden cost           | Revisit                         |
| Possession date unknown    | Watchlist                       |
| Data completeness below 50 | Data Pending                    |

## 14.4 Manual Override

The user should be able to manually set recommendation status.

Manual override should store:

* Manual recommendation
* Override reason
* Date
* Notes

---

# 15. Living vs Investment Matrix

The dashboard should show a matrix.

```text
Y-axis = Living Score
X-axis = Investment Score
```

## 15.1 Quadrants

| Quadrant                      | Meaning                 |
| ----------------------------- | ----------------------- |
| High Living + High Investment | Best overall            |
| High Living + Low Investment  | Good home, weaker asset |
| Low Living + High Investment  | Good asset, weaker home |
| Low Living + Low Investment   | Avoid / deprioritize    |

## 15.2 Threshold

Default threshold:

```text
High = 70 and above
Low = below 70
```

This should be configurable.

---

# 16. Score Explanation Requirements

Every score should include explanation.

## 16.1 Explanation Fields

For each score, show:

* Overall score
* Score label
* Top positive contributors
* Top negative contributors
* Missing critical data
* Risk caps applied
* Manual overrides
* Last updated date

## 16.2 Example

```text
Investment Score: 74 — Good

Positive contributors:
- Good rental demand in micro-market
- Fair entry price
- Metro upside
- Strong builder brand

Negative contributors:
- Maintenance cost is high
- Possession is more than 24 months away
- True carpet cost is above preferred range

Missing data:
- Exact expected rent not confirmed
```

---

# 17. Weight Settings

The user should be able to adjust weights.

## 17.1 Living Weight Settings

Default:

| Parameter                         | Weight |
| --------------------------------- | -----: |
| Commute Convenience               |     15 |
| Location and Daily Convenience    |     10 |
| Metro and Public Transport Access |      7 |
| Carpet Efficiency                 |     10 |
| Unit Layout Suitability           |     10 |
| Parking Adequacy                  |      8 |
| Water and Power Infrastructure    |      8 |
| Amenities Usefulness              |      7 |
| Community and Density             |      7 |
| Builder and Construction Quality  |      8 |
| Possession Certainty              |      5 |
| Budget Comfort                    |      5 |

## 17.2 Investment Weight Settings

Default:

| Parameter                          | Weight |
| ---------------------------------- | -----: |
| Entry Price Attractiveness         |     15 |
| True Cost per SBA/Carpet           |     12 |
| Rental Yield Potential             |     12 |
| Appreciation Potential             |     12 |
| Location and Employment Demand     |     10 |
| Metro/Infrastructure Upside        |      8 |
| Builder Brand and Resale Liquidity |     10 |
| Possession Timeline                |      7 |
| Hidden Cost Risk                   |      7 |
| Maintenance Burden                 |      4 |
| Micro-Market Supply Risk           |      3 |

## 17.3 Weight Validation

Weights do not need to total exactly 100 if weighted-average formula is used.

However, the UI should show total weight for clarity.

---

# 18. Manual Scoring Support

Some parameters may require manual user judgement.

Examples:

* Layout quality
* Family comfort
* Builder credibility
* Construction quality
* Area growth potential
* Resale liquidity
* Tenant demand

Manual scores should support:

* Score from 0 to 100
* Notes
* Source
* Last updated date

---

# 19. Automatic Scoring Support

Some parameters can be automatically calculated.

Examples:

* Carpet efficiency
* True cost per sq.ft
* Hidden cost %
* EMI comfort
* Rental yield
* Distance to workplace
* Distance to metro
* Data completeness
* Payment schedule completeness

Automatic scores should be explainable.

---

# 20. Site Visit Integration

Site visit checklist data should update scoring inputs.

Examples:

* Parking unclear → Parking Score reduces.
* Water source confirmed as tanker-heavy → Infrastructure Score reduces.
* Good natural light → Layout Score improves.
* Actual flat visit not allowed → Construction confidence reduces.
* Salesperson avoids legal questions → Legal risk increases.
* Cost sheet collected → Data completeness improves.

The portal should allow user review before site visit data overwrites existing scores.

---

# 21. Map Integration

Location data should update scoring inputs.

Examples:

* Distance to workplace improves commute score.
* Functional metro proximity improves living and investment score.
* Planned metro improves investment score with lower confidence.
* Poor road access reduces living score.
* High rental demand improves investment score.
* Waterlogging risk reduces living and investment score.

---

# 22. Financial Integration

Financial formulas should update scoring inputs.

Examples:

* High hidden cost reduces investment score.
* High EMI-to-income ratio reduces budget comfort.
* Low true carpet cost improves investment score.
* High registration/corpus/maintenance reduces financial attractiveness.
* High rental yield improves investment score.
* Low data completeness reduces confidence.

---

# 23. Score Confidence

Scores should have confidence levels.

## 23.1 Confidence Levels

| Confidence | Meaning                          |
| ---------- | -------------------------------- |
| High       | Most required data available     |
| Medium     | Some important data missing      |
| Low        | Many inputs estimated or missing |
| Very Low   | Not decision-ready               |

## 23.2 Confidence Formula

Suggested:

```text
Score Confidence =
Data Completeness Score adjusted by source confidence
```

If many values are user estimates or unknown, confidence should be lower.

## 23.3 UI Display

Example:

```text
Living Score: 78 / 100
Confidence: Medium
Reason: Parking confirmed, cost mostly available, but carpet area and water source need confirmation.
```

---

# 24. Decision Readiness Score

Optional but useful.

## 24.1 Objective

Decision Readiness shows whether a project/unit has enough verified information to move forward.

## 24.2 Inputs

* Cost completeness
* Legal completeness
* Parking completeness
* Location completeness
* Site visit completion
* Document collection
* Follow-up closure
* Critical risk status

## 24.3 Interpretation

|    Score | Meaning             |
| -------: | ------------------- |
|   85–100 | Ready for decision  |
|    70–84 | Mostly ready        |
|    55–69 | More review needed  |
|    35–54 | Not ready           |
| Below 35 | Data too incomplete |

---

# 25. Score Display Requirements

## 25.1 Master Dashboard

Show:

* Living Score
* Investment Score
* Recommendation
* Risk level
* Confidence

## 25.2 Project Detail Page

Show:

* Overall score cards
* Detailed breakdown
* Strengths
* Weaknesses
* Missing data
* Risk caps
* Manual notes

## 25.3 Unit Comparison Page

Show:

* Score columns
* Highlight highest living score
* Highlight highest investment score
* Show score confidence
* Show recommendation

## 25.4 Map Popup

Show:

* Living Score
* Investment Score
* Location score
* Risk level
* Recommendation

---

# 26. Score Update Triggers

Scores should recalculate when the following changes:

* Cost data
* Carpet area
* Parking data
* Location data
* Commute data
* RERA/legal status
* Possession date
* Maintenance/corpus
* Amenities
* Construction quality
* Site visit notes
* Follow-up closure
* Manual score inputs
* Settings weights

---

# 27. Scoring Acceptance Criteria

The scoring module is complete when:

1. Living Score is calculated separately.
2. Investment Score is calculated separately.
3. Score weights are configurable.
4. Score explanations are visible.
5. Missing data reduces confidence.
6. Critical risks cap recommendations.
7. Parking affects both living and risk scoring.
8. Legal/RERA affects recommendation status.
9. Financial formulas feed investment scoring.
10. Location data feeds both living and investment scoring.
11. Site visit data can update scoring inputs.
12. The dashboard shows score, confidence, and recommendation.
13. The user can manually override recommendation with notes.
14. Scores do not break when values are missing.

---

# 28. Final Scoring Principle

The scoring model should not replace human judgement.

It should help the user think clearly.

The portal should not simply say:

```text
Project A is best.
```

It should explain:

```text
Project A is best for living because commute, layout, and parking are strong.

Project B is better for investment because entry price, rental demand, and future infrastructure upside are stronger.

Project C should be avoided for now because legal data and parking clarity are missing.
```

The scoring engine should make the real estate decision more transparent, structured, and confident.
