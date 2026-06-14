# 08_MAP_AND_LOCATION_REQUIREMENTS.md

# Real Estate Decision Portal — Map and Location Requirements

## 1. Purpose of This Document

This document defines the map, location, city-zone, commute, and micro-market requirements for the Real Estate Decision Portal.

The portal should not evaluate projects only through cost tables. Location is one of the biggest drivers of both living quality and investment value.

The map module should help the user understand:

* Where each project is located
* Which projects are near the current residence
* Which projects are near the primary workplace
* Which projects are close to metro or major roads
* Which projects are clustered in the same micro-market
* Which areas are suitable for living
* Which areas may have better investment potential
* Which locations create commute, traffic, road, water, or infrastructure risks

The initial geography focus is **East Bangalore**, but the system should support expansion to all Bangalore zones and future cities.

---

## 2. Core Map Vision

The map should act as a spatial decision layer for the apartment buying journey.

The user should be able to open the map and immediately understand:

* Where the projects are
* Which areas are being considered
* Which projects are close to daily-life anchors
* Which projects are too far or inconvenient
* Which projects are in developing areas
* Which projects may benefit from future infrastructure
* Which projects are better for living
* Which projects are better for investment

The map should not be a passive location viewer. It should be a decision support tool.

---

## 3. Recommended Map Technology

Use:

```text
Leaflet + OpenStreetMap
```

Reason:

* No paid Google Maps API dependency
* Good enough for project pin visualization
* Supports markers, popups, layers, and radius circles
* Easy to integrate in a Next.js dashboard
* Suitable for a personal decision portal

The application should not require a paid map API key in the first version.

---

## 4. Primary Map Page

Route:

```text
/map
```

Page name:

```text
Bangalore Project Map
```

The map page should include:

1. Full-width interactive map
2. Project pins
3. Current residence marker
4. Primary workplace marker
5. Optional secondary markers
6. Radius coverage circles
7. City-zone filters
8. Project purpose filters
9. Shortlist filters
10. Project card on pin click
11. Fallback list for projects without coordinates
12. Location comparison panel
13. Map legend

---

# 5. Location Data Model

Each project should have a `LocationInfo` object.

## 5.1 Core Fields

```text
LocationInfo {
  locationId: string
  projectId: string

  latitude?: number
  longitude?: number

  mapPinConfirmed?: boolean
  approximateLocationOnly?: boolean

  city: string
  cityZone: string
  microMarket?: string
  locality?: string
  address?: string
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

  roadAccessQuality?: string
  roadWidth?: string
  trafficBottlenecks?: string

  floodingWaterloggingRisk?: string

  publicTransportAccess?: string
  socialInfrastructureScore?: number
  locationGrowthPotential?: string
  rentalDemandPerception?: string

  locationNotes?: string
}
```

---

# 6. Bangalore City Zone Model

The portal should support projects across Bangalore zones.

## 6.1 Default Zones

```text
East Bangalore
North Bangalore
South Bangalore
West Bangalore
Central Bangalore
Other
Unknown
```

## 6.2 Initial Default

Initial default focus:

```text
East Bangalore
```

This is because the current evaluation is focused on the side where the user currently resides.

## 6.3 Zone Filter

The map should allow filtering by:

* East Bangalore
* North Bangalore
* South Bangalore
* West Bangalore
* Central Bangalore
* All Bangalore
* Custom area

## 6.4 Zone Usage

City zone should be used in:

* Project filters
* Map pin colors
* Project list filters
* Location analysis
* Investment comparison
* Living comparison
* Dashboard grouping

---

# 7. Micro-Market Model

Each project should support a micro-market field.

Examples:

```text
Whitefield
Varthur
Gunjur
Sarjapur Road
Panathur
Kadubeesanahalli
Marathahalli
Bellandur
Hosa Road
Electronic City
Hebbal
Yelahanka
Thanisandra
Devanahalli
Kanakapura Road
Bannerghatta Road
Jayanagar
JP Nagar
Indiranagar
Old Madras Road
```

The portal should allow free-text micro-market entry because Bangalore areas are fluid and builder descriptions can vary.

---

# 8. Project Pin Requirements

Each project with coordinates should appear as a map pin.

## 8.1 Pin Data

Each pin should contain:

* Project ID
* Project name
* Builder name
* Latitude
* Longitude
* City zone
* Micro-market
* Project status
* Purpose tag
* Starting price
* Selected unit total landing cost
* True cost per SBA sq.ft
* True cost per carpet sq.ft
* Living score
* Investment score
* Risk level

## 8.2 Pin Color Logic

Suggested pin color logic:

| Color Meaning | Condition                |
| ------------- | ------------------------ |
| Green         | Strong Shortlist         |
| Blue          | Shortlisted              |
| Amber         | Watchlist / Needs Review |
| Red           | High Risk / Rejected     |
| Grey          | Data Pending             |
| Purple        | Investment-focused       |
| Teal          | Living-focused           |

Do not rely only on color. Also show text labels or tooltips.

## 8.3 Pin Shape / Icon Logic

Suggested optional icon logic:

| Icon    | Meaning            |
| ------- | ------------------ |
| Home    | Living option      |
| Chart   | Investment option  |
| Star    | Strong shortlist   |
| Warning | High risk          |
| Clock   | Possession pending |
| Check   | Ready / verified   |

---

# 9. Project Pin Popup Card

Clicking a project pin should open a popup card.

## 9.1 Popup Card Fields

The popup should show:

* Project name
* Builder name
* Micro-market
* City zone
* Project status
* Purpose tag
* Available BHKs
* Starting price
* Selected unit total landing cost
* True SBA cost
* True carpet cost
* RERA efficiency
* Parking status
* Possession date
* Distance to current residence
* Distance to primary workplace
* Distance to nearest functional metro
* Living score
* Investment score
* Risk level
* Next action

## 9.2 Popup Actions

Actions:

* Open project page
* Add/edit location
* Select for comparison
* Add site visit
* Add follow-up
* Mark shortlisted
* Mark rejected

---

# 10. Current Residence Marker

The map should show the user’s current residence marker.

## 10.1 Fields

Settings should store:

```text
currentResidenceLatitude
currentResidenceLongitude
currentResidenceLabel
```

## 10.2 Usage

Current residence should be used for:

* Distance comparison
* Familiarity-zone evaluation
* Map radius circles
* Living suitability
* Family convenience
* Area transition assessment

## 10.3 UI Behavior

The marker should be visually distinct from project pins.

Suggested label:

```text
Current Residence
```

The user should be able to update it from Settings.

---

# 11. Primary Workplace Marker

The map should show the user’s primary workplace marker.

## 11.1 Fields

Settings should store:

```text
primaryWorkplaceLatitude
primaryWorkplaceLongitude
primaryWorkplaceLabel
```

## 11.2 Usage

Primary workplace should be used for:

* Distance to work
* Peak commute estimate
* Living score
* Daily practicality
* Location comparison

## 11.3 UI Behavior

The marker should be visually distinct from both project pins and current residence marker.

Suggested label:

```text
Primary Workplace
```

---

# 12. Optional Reference Markers

The portal should support optional additional markers later.

Examples:

* Spouse workplace
* Child’s school
* Parent/family location
* Frequent visit location
* Airport
* Preferred hospital
* Preferred school
* Existing owned property

These should not be required in the first version, but the model should support them later.

Suggested schema:

```text
ReferenceMarker {
  markerId: string
  label: string
  type:
    | "Residence"
    | "Workplace"
    | "School"
    | "Hospital"
    | "Family"
    | "Airport"
    | "Custom"

  latitude: number
  longitude: number
  notes?: string
}
```

---

# 13. Coverage Radius Circles

The map should show radius circles around important markers.

## 13.1 Required Radius Options

```text
3 km
5 km
10 km
15 km
```

## 13.2 Circle Centers

Radius circles should be available around:

* Current residence
* Primary workplace
* Selected project
* Custom marker

## 13.3 Usage

Radius circles help answer:

* Which projects are close to current residence?
* Which projects are within reasonable daily range?
* Which projects are near workplace?
* Which projects are in the same micro-market cluster?
* How spread out are the options?

## 13.4 UI Controls

The user should be able to toggle:

* Show/hide residence circles
* Show/hide workplace circles
* Select radius distance
* Show/hide selected project radius

---

# 14. Projects Without Coordinates

Not every project will have a confirmed latitude and longitude.

The system must handle this gracefully.

## 14.1 Behavior

If a project has no coordinates:

* Do not break the map.
* Do not show incorrect default pin.
* Show the project in a fallback list below or beside the map.

## 14.2 Fallback List Fields

Show:

* Project name
* Builder
* Address or locality
* Micro-market
* City zone
* Status
* Action: Add coordinates
* Action: Mark approximate location

## 14.3 Data Status

Projects without coordinates should show:

```text
Location Missing
```

Projects with approximate coordinates should show:

```text
Approximate Location
```

Projects with verified coordinates should show:

```text
Pin Confirmed
```

---

# 15. Map Filters

The map should have filters.

## 15.1 Location Filters

* City zone
* Micro-market
* Locality
* Distance from current residence
* Distance from workplace
* Distance from metro
* Distance from ORR
* Road access quality
* Waterlogging risk

## 15.2 Project Filters

* Builder
* Project status
* Purpose tag
* BHK availability
* Possession timeline
* RERA verified
* Site visit status
* Shortlist status
* Risk level

## 15.3 Financial Filters

* Budget range
* Starting price
* Selected unit total landing cost
* True cost per SBA sq.ft
* True cost per carpet sq.ft
* Hidden cost percentage

## 15.4 Suitability Filters

* Living score range
* Investment score range
* Parking included
* Legal risk level
* Data completeness

---

# 16. Map Layer Controls

The map should support layers.

## 16.1 Required Layers

* All projects
* Shortlisted projects
* Watchlist projects
* Rejected projects
* Living-focused projects
* Investment-focused projects
* Projects with missing location
* Current residence
* Workplace
* Radius circles

## 16.2 Optional Future Layers

* Metro stations
* Major roads
* Schools
* Hospitals
* Tech parks
* Lakes/flood-risk areas
* Rental demand zones
* Future infrastructure corridors

The first version does not need external API-based layers, but the architecture should allow adding them later.

---

# 17. Location Comparison Panel

When multiple projects are selected, the map page should show a location comparison panel.

## 17.1 Comparison Fields

| Field                     | Description                 |
| ------------------------- | --------------------------- |
| Project                   | Project name                |
| Area                      | Micro-market                |
| Zone                      | City zone                   |
| Distance to Residence     | km                          |
| Distance to Workplace     | km                          |
| Distance to Metro         | km                          |
| Distance to ORR           | km                          |
| Peak Commute              | minutes                     |
| Road Quality              | Excellent/Good/Average/Poor |
| Waterlogging Risk         | Low/Medium/High             |
| Rental Demand             | High/Medium/Low             |
| Location Growth Potential | High/Medium/Low             |
| Living Score              | 0–100                       |
| Investment Score          | 0–100                       |

## 17.2 Highlighting

Highlight:

* Shortest distance to work
* Shortest distance to metro
* Best road access
* Lowest waterlogging risk
* Highest location growth score
* Highest living score
* Highest investment score

---

# 18. Location Data Entry

The portal should allow adding and editing location data.

## 18.1 Location Entry Methods

Supported methods:

1. Manual latitude/longitude entry
2. Manual address entry
3. Approximate locality entry
4. Click on map to set pin
5. Future: geocoding/search
6. Future: online enrichment

## 18.2 Required Fields for Basic Location

Minimum:

* City
* City zone
* Micro-market or locality

Coordinates are recommended but not required.

## 18.3 Confirmed Pin Workflow

When user places or updates a pin:

```text
Set Pin
→ Mark as Approximate or Confirmed
→ Save Location
→ Recalculate distances where possible
```

---

# 19. Distance Data

The portal should support both manual and calculated distances.

## 19.1 Manual Distance

The user can enter:

* Distance to workplace
* Distance to residence
* Distance to metro
* Distance to ORR
* Peak commute time
* Non-peak commute time

This is useful when actual driving distance is more relevant than straight-line distance.

## 19.2 Calculated Distance

If coordinates exist, the portal may calculate approximate straight-line distance.

Suggested label:

```text
Approximate aerial distance
```

Do not confuse aerial distance with driving distance.

## 19.3 Distance Confidence

Distance fields should support confidence:

* User estimate
* Map estimate
* Site visit observed
* Verified route
* Unknown

---

# 20. Commute Evaluation

Commute is central to living suitability.

## 20.1 Commute Fields

Capture:

* Distance to workplace in km
* Peak commute time in minutes
* Non-peak commute time in minutes
* Route quality
* Traffic bottlenecks
* Public transport option
* Metro feasibility
* Last-mile issue
* Notes

## 20.2 Commute Score Inputs

Commute should influence Living Score.

Suggested interpretation:

| Commute Condition             | Living Impact   |
| ----------------------------- | --------------- |
| Less than 30 min peak commute | Strong positive |
| 30–45 min peak commute        | Acceptable      |
| 45–60 min peak commute        | Stretch         |
| More than 60 min peak commute | Risk            |
| Route has severe bottlenecks  | Negative        |
| Metro viable                  | Positive        |
| Last-mile issue               | Negative        |

The thresholds should be adjustable in Settings.

---

# 21. Metro Evaluation

Metro access is both a living and investment factor.

## 21.1 Metro Fields

Capture:

* Nearest functional metro station
* Distance to functional metro
* Nearest planned metro station
* Distance to planned metro
* Metro line/phase, if known
* Walkability
* Last-mile access
* Realistic usability
* Metro notes

## 21.2 Metro Suitability

Differentiate between:

```text
Functional Metro
Planned Metro
Theoretical Metro Benefit
```

A project should not get full metro score only because a planned metro is nearby. Planned metro should have lower confidence until operational.

## 21.3 UI Display

Show:

* Functional metro distance
* Planned metro distance
* Metro status
* Confidence

---

# 22. Road Access and Traffic

Road quality can materially affect living comfort.

## 22.1 Road Fields

Capture:

* Main access road
* Road width
* Last-mile road quality
* Approach road condition
* Traffic bottlenecks
* Construction bottlenecks
* Flyover/underpass dependency
* Internal road quality
* Road widening possibility

## 22.2 Risk Flags

Flag risk if:

* Narrow approach road
* Bad last-mile road
* Heavy peak traffic
* Frequent waterlogging
* Dependency on one congested road
* Poor street lighting
* Poor pedestrian access

---

# 23. Waterlogging and Environmental Risk

For Bangalore, waterlogging and lake proximity can matter.

## 23.1 Fields

Capture:

* Waterlogging risk
* Nearby lake/storm-water drain
* Low-lying area concern
* Road flooding history
* Basement flooding concern
* Drainage quality
* Environmental notes

## 23.2 Risk Status

```text
Low
Medium
High
Unknown
```

## 23.3 Site Visit Link

Waterlogging risk should be checked during site visit, especially during or after rain if possible.

---

# 24. Social Infrastructure

Social infrastructure matters for living and rental demand.

## 24.1 Fields

Capture distance and quality for:

* Schools
* Hospitals
* Grocery stores
* Malls
* Restaurants
* Public transport
* Parks/open spaces
* Daily convenience
* Domestic help availability
* Safety perception

## 24.2 Social Infrastructure Score

Suggested score:

```text
0 to 10
```

Factors:

* Daily convenience
* Family suitability
* Healthcare access
* School access
* Mature neighbourhood
* Safety
* Retail ecosystem

---

# 25. Rental Demand and Investment Location Factors

For investment evaluation, the map should also capture rental demand context.

## 25.1 Fields

Capture:

* Expected tenant profile
* Nearby employment hubs
* Tech parks
* Office corridors
* Colleges
* Hospitals
* Rental demand perception
* Competing supply
* Resale liquidity
* Area appreciation potential
* Future infrastructure upside

## 25.2 Investment Location Score

Location should influence Investment Score through:

* Tenant demand
* Entry price vs area
* Metro/future infra
* Employment hub proximity
* Resale liquidity
* Micro-market supply risk
* Area maturity

---

# 26. Area / Micro-Market Notes

The user should be able to maintain notes for each micro-market.

Example:

```text
Varthur:
- Strong East Bangalore demand
- Traffic concerns
- Water concerns in some pockets
- Good IT corridor rental demand
- Multiple competing projects
- Future metro impact to be monitored
```

Suggested schema:

```text
MicroMarketNote {
  microMarketId: string
  name: string
  cityZone: string
  summary?: string
  positives?: string[]
  risks?: string[]
  investmentNotes?: string
  livingNotes?: string
  lastUpdatedDate?: Date
}
```

---

# 27. Location Score

The map module should provide input into both Living Score and Investment Score.

## 27.1 Living Location Inputs

* Distance to workplace
* Peak commute time
* Metro access
* Road quality
* School access
* Hospital access
* Daily convenience
* Waterlogging risk
* Social infrastructure
* Family comfort

## 27.2 Investment Location Inputs

* Rental demand
* Employment hub proximity
* Metro/future infra
* Resale liquidity
* Area appreciation potential
* Competing supply
* Entry price attractiveness
* Micro-market maturity

---

# 28. Map Card Recommendation

Each project popup or card should show a recommendation label.

Suggested labels:

```text
Strong Living Location
Good Living Location
Investment-Oriented Location
Emerging Area
Commute Risk
Location Risk
Data Missing
```

This should be based on available location data and scores.

---

# 29. Map Legend

The map should include a clear legend.

Legend should explain:

* Pin colors
* Pin icons
* Residence marker
* Workplace marker
* Shortlisted project
* Watchlist project
* Rejected project
* Living project
* Investment project
* Approximate pin
* Confirmed pin
* Radius circles
* Missing location

---

# 30. Map Empty States

The map should handle empty states clearly.

## 30.1 No Projects

Show:

```text
No projects added yet. Add a project to view it on the map.
```

## 30.2 No Coordinates

Show:

```text
Projects exist, but none have map coordinates yet. Add location pins to show them on the map.
```

## 30.3 Filter Hides All Projects

Show:

```text
No projects match the selected map filters.
```

---

# 31. Map Acceptance Criteria

The map module is complete when:

1. Projects with coordinates appear as pins.
2. Projects without coordinates appear in a fallback list.
3. Current residence marker is supported.
4. Primary workplace marker is supported.
5. City zone filters work.
6. Project purpose filters work.
7. Shortlist/status filters work.
8. Radius circles can be shown for residence/workplace/project.
9. Clicking a project pin opens a project summary card.
10. Location fields can be edited.
11. Approximate and confirmed pins are visually distinct.
12. Distance-to-work and distance-to-metro fields appear in comparison.
13. Map data feeds Living Score and Investment Score.
14. The map does not require paid Google Maps API.
15. The map works even when some projects have incomplete location data.

---

# 32. Future Enhancements

Future versions can add:

* Address geocoding
* Route-based distance calculation
* Traffic-aware commute estimates
* Metro station overlays
* School/hospital overlays
* Rental heatmap
* Price heatmap
* Flooding/waterlogging layer
* RERA project layer
* Area appreciation layer
* Broker/listing integration
* Mobile location capture during site visits
* Photo pins from site visits

These should not block the first build.

---

# 33. Final Map Principle

The map should help the user understand the spatial reality of the decision.

A project may look good on cost, but fail on commute.

A project may look expensive, but be in a better micro-market.

A project may be suitable for investment, but not ideal for family living.

The map should help answer:

* Where is the project?
* How far is it from daily life?
* Is the commute practical?
* Is the area mature?
* Is the location improving?
* Is rental demand strong?
* Is the project in a risk zone?
* Which location is best for living?
* Which location is best for investment?

The map is the location intelligence layer of the Real Estate Decision Portal.
