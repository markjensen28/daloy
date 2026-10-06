You are a senior full-stack software engineer, UI/UX designer, data-visualization engineer, GIS developer, and simulation-system architect.

Your task is to design and build a functional MVP web application called:

# WATER ECONOMICS

This application is an LGU-oriented water economics planning and decision-support platform for Samar Province.

The system should help local government planners understand the relationship between:

- Available water supply
- Water sources
- Municipal demand
- Sector demand
- Household consumption
- Water allocation
- Water affordability
- Water prices/service costs
- Livelihood dependence
- Economic activity
- Public assistance
- Drought conditions
- Supply disruptions
- Water-management policies

The system must primarily function as an interactive simulation environment rather than a conventional dashboard.

The MVP will focus specifically on:

- Catbalogan City
- Pinabacdao
- Calbayog

Other municipalities within Samar Province may appear on the map or exist in the system architecture, but they must initially be inactive and excluded from all simulation calculations.

Forecasting and AI interpretation are future modules only and must remain placeholders for now.

---

# 1. GEOGRAPHIC MVP SCOPE

The application represents Samar Province geographically, but the functional MVP must only calculate water-economic scenarios for three pilot LGUs:

## ACTIVE MVP MUNICIPALITIES

### Catbalogan City
Status:
ACTIVE

Included in:
- Water supply calculations
- Demand calculations
- Allocation simulation
- Household affordability analysis
- Economic analysis
- Policy simulation
- Scenario comparison
- Equity analysis

### Pinabacdao
Status:
ACTIVE

Included in:
- Water supply calculations
- Demand calculations
- Allocation simulation
- Household affordability analysis
- Economic analysis
- Policy simulation
- Scenario comparison
- Equity analysis

### Calbayog
Status:
ACTIVE

Included in:
- Water supply calculations
- Demand calculations
- Allocation simulation
- Household affordability analysis
- Economic analysis
- Policy simulation
- Scenario comparison
- Equity analysis

---

# 2. NON-MVP SAMAR MUNICIPALITIES

The rest of Samar Province should be architecturally supported but NOT included in MVP calculations.

These areas can appear on the Samar map for geographical context.

Display them as:

Inactive
Coming Soon
Not Included in Current Simulation

Use visually muted styling.

For example:

- Gray or low-opacity municipality polygons
- Disabled interaction
- Lock or inactive indicator
- Tooltip:

"Not included in the current MVP simulation."

Do NOT:

- Add their demand to provincial totals
- Add their supply to provincial totals
- Include them in affordability calculations
- Include them in equity calculations
- Include them in scenario comparison
- Include them in allocation calculations

The architecture should make them easy to activate later.

Example municipality structure:

Municipality {
    id
    name
    activeInSimulation
    population
    households
    communities
    sectors
    waterSources
}

For the MVP:

Catbalogan:
activeInSimulation = true

Pinabacdao:
activeInSimulation = true

Calbayog:
activeInSimulation = true

Other Samar municipalities:
activeInSimulation = false

All core calculations must filter municipalities using:

activeInSimulation === true

---

# 3. LOCAL WATER UTILITY CONTEXT

Water supply within Samar Province is not necessarily managed by one centralized provincial utility.

Water utility requirements are typically handled through independent local utilities and water-service providers.

Relevant examples include:

### Catbalogan Water District

Represent this as an important water utility/service provider associated with Catbalogan City.

Possible system relationship:

Catbalogan City
↓
Catbalogan Water District
↓
Water Sources
↓
Distribution
↓
Communities / Economic Sectors

---

### Calbiga Water District

Represent this as an important local water utility/service provider associated with any near areas to it.

Possible relationship:

Calbayog
↓
Calbiga Water District
↓
Water Sources
↓
Distribution
↓
Communities / Economic Sectors

---

### Balibago Waterworks System, Inc.

The provincial government has also partnered with private utility firm Balibago Waterworks System, Inc. in addressing water-supply shortages.

Represent Balibago Waterworks as an example of:

- Private utility involvement
- Additional supply partnership
- Alternative/augmentation source
- Emergency or supplementary supply provider

Do NOT assume that Balibago automatically supplies every MVP municipality.

Structure the system so utility relationships can be configured from the underlying data.

For example:

UtilityProvider {
    id
    name
    type
    municipalitiesServed
    sources
    operatingCapacity
    currentOutput
    serviceCost
}

Provider types could include:

- Water District
- LGU-operated utility
- Private utility
- Provincial partnership
- Cooperative
- Other

---

# 4. PINABACDAO PROVIDER HANDLING

Do not invent a specific water utility provider for Pinabacdao unless verified data is later provided.

For the MVP, represent its provider using a neutral configurable structure such as:

"Pinabacdao Local Water Supply"

or

"Local Water Supply System"

Clearly mark it as demo/configurable data if no verified utility dataset has yet been supplied.

The architecture must allow it to be replaced later with verified provider information without rewriting the simulation engine.

---

# 5. CORE PRODUCT IDEA

WATER ECONOMICS creates a shared economic view of water resources.

It combines:

- Available water supply
- Water-source capacity
- Municipality demand
- Sector demand
- Household demand
- Agricultural demand
- Commercial demand
- Institutional demand
- Water allocation
- Population served
- Water price/service cost
- Household affordability
- Household income indicators
- Livelihood dependence
- Government assistance budgets
- Utility operating costs
- Infrastructure capacity
- Drought conditions
- Supply disruptions
- Policy interventions

An LGU planner can modify assumptions and immediately see how the water-economic system changes.

The system must emphasize transparency.

Avoid unexplained scores.

Avoid black-box decisions.

Every important output should be traceable to:

- Visible inputs
- Formulas
- Scenario assumptions
- Configurable weights
- Source data

---

# 6. MAIN DESIGN PHILOSOPHY

Do NOT create a conventional analytics dashboard filled with cards and charts.

Create a spatial interactive planning environment.

The system should feel like:

"SimCity-style resource visualization combined with an LGU water economics planning simulator."

The interface may still contain charts, statistics, tables, and indicators, but these elements should support the simulation rather than dominate it.

Primary visual hierarchy:

1. Dynamic water simulation
2. Municipality relationships
3. Supply versus demand
4. Water allocation
5. Economic consequences
6. Policy scenarios
7. Supporting analytics
8. Detailed data

The user should visually understand what is happening before needing to inspect detailed numerical tables.

---

# 7. MAIN SIMULATION WORKSPACE

Create a large interactive workspace.

Recommended layout:

LEFT PANEL

- Municipality selector
- Water sources
- Utility providers
- Demand sectors
- Communities
- Scenario controls
- Policy controls

CENTER

- Dynamic 3D water visualization
- Municipality relationship
- Source inflows
- Allocation outflows
- Water flow connections
- Spatial context

RIGHT PANEL

- Selected municipality
- Selected utility
- Selected source
- Selected community
- Selected sector
- Allocation information
- Economic indicators
- Affordability
- Livelihood impact

BOTTOM / COLLAPSIBLE PANEL

- Scenario comparison
- Supply-demand charts
- Allocation chart
- Economic indicators
- Detailed data

The central simulation should remain the largest component.

---

# 8. MUNICIPALITY SELECTOR

Provide a clear municipality selector.

Active options:

Catbalogan City
Pinabacdao
Calbayog

Example:

[ Catbalogan ]
[ Pinabacdao ]
[ Calbayog ]

The user should be able to:

- View individual municipality conditions
- Modify municipality assumptions
- Inspect local supply
- Inspect local demand
- Change local allocation
- Apply municipal policies
- Compare municipalities

Also provide:

"Combined MVP"

This combines ONLY:

Catbalogan
Pinabacdao
Calbayog

Do not call this "Entire Samar" because the other municipalities are not part of the active calculation.

Example:

VIEW:

Catbalogan
Pinabacdao
Calbayog
Combined MVP

---

# 9. SAMAR MAP

Include a geographic map of Samar Province.

Show municipal boundaries where available.

Use two visual states.

ACTIVE:

Catbalogan
Pinabacdao
Calbayog

INACTIVE:

All remaining Samar municipalities.

Active areas should have strong visual emphasis.

Inactive municipalities should remain muted.

Example:

Active:
Water-related thematic coloring

Inactive:
Gray

Hover over an inactive municipality:

"Future expansion area — currently excluded from simulation."

This communicates that the platform is designed for eventual province-wide deployment without pretending that the MVP already contains complete provincial data.

---

# 10. CENTRAL 3D WATER MODEL

One of the most important visual components is a dynamic three-dimensional body of water.

Create a literal 3D pool/reservoir representation.

Do NOT use:

- Basic progress bars
- Cylinders pretending to be reservoirs
- Flat gauges
- Static images

The water should look like an actual contained body of water viewed from an isometric or slightly elevated perspective.

Avoid unnecessary backgrounds.

The water visualization should be visually clean and capable of standing independently inside the application.

Its water surface must:

- Rise when supply increases
- Fall when demand increases
- Fall when allocation increases
- Drop during drought scenarios
- Recover when sources improve
- Respond to new supply
- Animate smoothly
- Display subtle water motion

The water level must be connected directly to application state.

Conceptually:

Current Water
+ Source Inflows
- Allocation
- Consumption
= Remaining Available Water

Water volume:

0 <= CurrentVolume <= MaximumCapacity

Example:

Capacity:
100 ML/day

Available:
72 ML/day

Demand:
65 ML/day

Reserve:
7 ML/day

---

# 11. MUNICIPAL WATER REPRESENTATION

The user should be able to switch the central water visualization between municipalities.

Example:

Catbalogan selected:
3D pool represents Catbalogan's available water.

Calbayog selected:
3D pool transitions to Calbayog's available water.

Combined MVP selected:
The visualization represents total active MVP supply.

Clearly label which scope is currently displayed.

Example:

CATBALOGAN WATER SYSTEM

or:

COMBINED MVP WATER BALANCE
Catbalogan + Pinabacdao + Calbayog

Never include inactive municipalities in this combined calculation.

---

# 12. OPTIONAL THREE-POOL VISUALIZATION

If performance and development time allow, add an optional mode displaying three water pools simultaneously.

Example:

CATBALOGAN
[Water Pool]

PINABACDAO
[Water Pool]

Calbayog
[Water Pool]

The pools should have visibly different water levels depending on municipality conditions.

This could become a strong comparison visualization during the hackathon presentation.

However:

Prioritize one highly polished dynamic water pool first.

Only implement three simultaneous pools after the main interaction works properly.

---

# 13. WATER SOURCES

Each municipality may contain multiple water sources.

Possible source types:

- Reservoir
- River intake
- Spring
- Deep well
- Groundwater
- Rainwater collection
- Treatment facility output
- Imported/interconnected supply
- Emergency source

Each source should contain:

- Name
- Municipality
- Utility provider
- Type
- Maximum capacity
- Current output
- Availability
- Reliability
- Operating cost
- Area served
- Seasonal condition

Changing a source should immediately update:

- Municipality supply
- 3D water level
- Supply-demand balance
- Available allocations

---

# 14. UTILITY PROVIDERS

Create a provider layer separating:

Municipality

from:

Water Utility / Service Provider

from:

Water Source

Example:

Catbalogan City
↓
Catbalogan Water District
↓
Source A
Source B
Source C

Calbayog
↓
Calbiga Water District
↓
Source A
Source B

Potential augmentation:
Balibago Waterworks System, Inc.

This is important because water economics should be capable of modeling not only physical water supply but also service structures.

Provider data may include:

- Provider name
- Provider type
- Municipalities served
- Water sources
- Operating capacity
- Current output
- Service cost
- Number of connections
- Population served
- Availability

Use sample values if verified numbers are unavailable.

Clearly label them as illustrative.

---

# 15. WATER FLOW VISUALIZATION

Represent water movement visually.

Possible flow:

WATER SOURCE
↓
UTILITY
↓
MUNICIPAL AVAILABLE SUPPLY
↓
SECTOR ALLOCATION
↓
COMMUNITY / ECONOMIC USE

A Sankey visualization is strongly recommended.

Example:

Deep Well ────┐
Spring ───────┼→ Catbalogan Water District
Reservoir ────┘
                       ↓
                Available Water
                 ↙      ↓      ↘
Residential   Agriculture   Commercial

Flow thickness should represent volume.

When inputs change, the flow should react immediately.

---

# 16. DEMAND SECTORS

At minimum include:

Residential
Agriculture
Commercial
Institutional

Optional:

Industrial
Tourism
Other

Each sector should contain:

- Municipality
- Current demand
- Allocation
- Number of users
- Population served
- Water cost
- Economic importance
- Livelihood dependence
- Priority
- Shortage
- Percentage demand satisfied

Example:

CATBALOGAN

Residential
Demand: 24 ML
Allocation: 22 ML
Coverage: 91.7%

Commercial
Demand: 8 ML
Allocation: 7 ML
Coverage: 87.5%

Institutional
Demand: 5 ML
Allocation: 5 ML
Coverage: 100%

---

# 17. WATER EQUITY AND POLICY SIMULATOR

This should be the central planning functionality.

The simulator must be deterministic and explainable.

Allow modification of:

SUPPLY

- Source output
- Source availability
- Additional temporary supply
- Utility capacity
- Drought severity

DEMAND

- Household demand
- Agricultural demand
- Commercial demand
- Institutional demand
- Population assumptions
- Demand growth/reduction

ALLOCATION

- Allocation per sector
- Minimum household allocation
- Priority levels
- Critical-service protection

ECONOMIC VARIABLES

- Service price
- Household income
- Assistance amount
- Assistance budget
- Livelihood dependence
- Economic importance

POLICIES

- Reallocate water
- Protect residential minimum
- Prioritize critical services
- Introduce temporary source
- Restrict non-essential consumption
- Adjust assistance
- Change sector priorities

Every control should update results immediately.

---

# 18. MUNICIPALITY-SPECIFIC POLICIES

Policies should be applicable to:

One municipality

or:

All active MVP municipalities

Example:

Apply drought adjustment to:

○ Catbalogan
○ Pinabacdao
○ Calbayog
○ All Active MVP Areas

Do NOT allow:

"Entire Samar"

unless the UI clearly means only the active MVP scope.

Prefer the label:

"All Active MVP Areas"

---

# 19. WATER EQUITY

Water equity means communities have a fair opportunity to access safe and affordable water while sharing the benefits and burdens of water-management decisions.

Do not reduce this concept to one unexplained number.

Display interpretable measures:

- Household demand met
- Low-income household coverage
- Population below minimum allocation
- Affordability burden
- Assistance coverage
- Sector shortages
- Community shortages
- Distribution imbalance
- Critical service coverage

If an aggregate score is used, expose its components and calculation.

---

# 20. AFFORDABILITY ANALYSIS

Calculate:

Water Affordability Burden =
Estimated Monthly Water Cost /
Estimated Monthly Household Income

Display:

- Monthly water expense
- Average household income
- Percentage of income spent on water
- Households affected
- Population affected
- Affordability category

Possible demonstration categories:

Low
Moderate
High
Critical

Clearly indicate that thresholds are configurable demonstration assumptions unless sourced from official policies.

---

# 21. LIVELIHOOD DEPENDENCE

Represent communities and economic sectors whose livelihoods depend significantly on water.

Examples:

- Agriculture
- Fisheries
- Markets
- Food processing
- Tourism
- Small businesses

Provide a configurable:

Livelihood Dependence Indicator

Example:

Calbayog Agriculture

Water demand:
12 ML

Allocation:
8 ML

Coverage:
66.7%

Potential livelihood exposure:
Elevated

Avoid claiming exact monetary losses without sufficient supporting data.

---

# 22. PUBLIC ASSISTANCE SIMULATOR

Allow LGUs to test assistance budgets.

Example:

Assistance Budget:
₱2,000,000

Potential beneficiaries:

- Low-income households
- Drought-affected communities
- High-affordability-burden households
- Water-dependent livelihood groups

Display:

- Households assisted
- Population assisted
- Average assistance
- Total expenditure
- Remaining budget
- Coverage percentage
- Affordability improvement

Allow municipal-specific assistance.

Example:

Provincial assistance:
₱2,000,000

Catbalogan:
₱900,000

Pinabacdao:
₱500,000

Calbayog:
₱600,000

---

# 23. DROUGHT / SUPPLY SHOCK SIMULATION

Provide clearly visible drought controls.

Example presets:

Normal
100%

Moderate
80%

Severe
60%

Extreme
40%

Also support manual adjustment.

The user should be able to apply drought individually.

Example:

Catbalogan:
80%

Pinabacdao:
60%

Calbayog:
90%

This enables localized scenarios.

When drought changes:

- Source output decreases
- Water level decreases
- Allocation pressure increases
- Coverage changes
- Shortage changes
- Economic indicators react

The transition should visually animate.

---

# 24. SCENARIO SYSTEM

Allow creation of scenarios such as:

Baseline
Scenario A
Scenario B
Scenario C

Example:

Baseline:
Normal supply

Scenario A:
Severe drought in Pinabacdao

Scenario B:
Catbalogan demand increase

Scenario C:
Regional drought + household protection policy

Support:

- Duplicate
- Rename
- Reset
- Compare
- Switch active scenario

Each scenario must preserve its own data.

---

# 25. MUNICIPAL SCENARIO COMPARISON

Scenario comparison should support both:

SCENARIO COMPARISON

and:

MUNICIPALITY COMPARISON

Example:

              Catbalogan   Pinabacdao   Calbayog
Supply            40           14          18
Demand            44           17          20
Shortage           4            3           2
Residential %     92%          84%         91%

Also compare:

- Affordability burden
- Assistance coverage
- Livelihood exposure
- Population affected
- Essential services protected

---

# 26. SPATIAL VIEW

Use a Samar Province map.

Provide selectable visualization layers:

- Water availability
- Demand pressure
- Supply-demand gap
- Household affordability
- Allocation coverage
- Drought exposure
- Assistance coverage

Only:

Catbalogan
Pinabacdao
Calbayog

should receive active simulation colors in the MVP.

Other municipalities should remain visually subdued.

Provide legend:

ACTIVE MVP AREA

INACTIVE / FUTURE EXPANSION

---

# 27. INTERACTIVE COMMUNITIES / ENTITIES

Where practical, visually represent:

- Residential communities
- Farms
- Markets
- Hospitals
- Schools
- Government centers
- Commercial areas
- Utility facilities

Selecting an entity should display:

- Municipality
- Name
- Category
- Demand
- Allocation
- Demand satisfied
- Priority
- Population/users
- Affordability
- Livelihood information

Do not prioritize elaborate 3D city-building features over simulation functionality.

---

# 28. VISUAL ANALYTICS

Use analytics selectively.

Recommended:

1. 3D Water Pool
Main physical metaphor

2. Sankey Diagram
Source → Utility → Municipality → Sector

3. Samar Map
Municipality-level context

4. Bubble Chart
Community comparison

5. Stacked Allocation Chart
Sector distribution

6. Scenario Comparison
Policy evaluation

7. Supply-Demand Timeline
Historical or demonstration series

Do not clutter the interface.

---

# 29. DATA WORKSPACE

Support:

- Manual data entry
- Editable tables
- Sample dataset
- CSV import if feasible

Organize into:

Municipalities
Utilities
Water Sources
Communities
Sectors
Population
Income
Demand
Water Cost
Assistance Budget
Livelihood Dependence
Infrastructure Capacity

Clearly mark:

DEMO DATA
SIMULATED DATA
USER-PROVIDED DATA
VERIFIED DATA

---

# 30. MUNICIPALITY DATA MODEL

Example:

Municipality {
    id: string
    name: string
    activeInSimulation: boolean

    population: number
    households: number

    utilityProviders: string[]
    waterSources: string[]
    communities: string[]
    sectors: string[]

    assistanceBudget: number
    droughtFactor: number
}

---

# 31. UTILITY DATA MODEL

UtilityProvider {
    id
    name
    type
    municipalityIds
    sourceIds

    maximumCapacity
    currentOutput
    operatingCost
    serviceCost

    status
    dataSourceType
}

Example providers:

Catbalogan Water District

Calbiga Water District

Balibago Waterworks System, Inc.

Pinabacdao Local Water Supply
Demo/configurable placeholder

---

# 32. WATER SOURCE DATA MODEL

WaterSource {
    id
    municipalityId
    providerId

    name
    type

    maximumCapacity
    normalOutput
    currentOutput

    availability
    reliability
    operatingCost

    status
}

---

# 33. COMMUNITY DATA MODEL

Community {
    id
    municipalityId

    name

    population
    households
    averageIncome

    waterDemand
    currentAllocation

    priority
    livelihoodDependence
    sectorMix
}

---

# 34. SECTOR DATA MODEL

Sector {
    id
    municipalityId

    name

    demand
    allocation

    priority
    economicWeight
    livelihoodDependence
}

---

# 35. SCENARIO DATA MODEL

Scenario {
    id
    name

    municipalityAdjustments

    sourceAdjustments
    demandAdjustments
    allocations

    droughtConditions
    prices
    subsidyBudgets
    policySettings
}

---

# 36. SIMULATION RESULT MODEL

SimulationResult {
    scope

    totalSupply
    totalDemand
    totalAllocation

    waterRemaining
    shortage

    municipalityResults

    sectorCoverage

    affordabilityResults

    populationAffected
    livelihoodExposure

    subsidyCoverage
    equityIndicators
}

---

# 37. SIMULATION ENGINE

Separate calculations from interface components.

Suggested structure:

engine/
    municipalityFilter
    waterBalance
    demandCalculator
    allocationEngine
    affordabilityCalculator
    subsidyCalculator
    equityCalculator
    scenarioComparator

CRITICAL RULE:

Every calculation begins by retrieving:

active municipalities

where:

activeInSimulation === true

The engine must therefore calculate using only:

Catbalogan
Pinabacdao
Calbayog

during the MVP.

Inactive Samar municipalities must not affect numerical results.

---

# 38. WATER BALANCE

For each municipality:

Available Water =
Sum of Active Water Source Outputs

Adjusted Supply =
Available Water × Drought Factor

Total Demand =
Sum of Sector Demands

Remaining Water =
Adjusted Supply - Total Allocation

Shortage =
max(Total Demand - Adjusted Supply, 0)

Sector Coverage =
Sector Allocation / Sector Demand

Combined MVP:

Combined Supply =
Catbalogan Supply
+ Pinabacdao Supply
+ Calbayog Supply

Combined Demand =
Catbalogan Demand
+ Pinabacdao Demand
+ Calbayog Demand

Never include inactive municipalities.

---

# 39. EXPLAINABILITY

Every important output should support explanations.

Example:

"Why did Pinabacdao residential coverage decrease?"

Answer using deterministic calculation logic:

"Residential coverage decreased from 91% to 76% because available municipal supply declined by 5 ML/day while residential demand remained unchanged."

Do not require an AI model for this.

Generate explanations using rules and simulation results.

---

# 40. AI DATA INTERPRETATION — PLACEHOLDER ONLY

Create an interface placeholder for:

AI Data Interpretation & Analysis

Future target:

Gemma 4 E4B

Do NOT integrate it yet.

Possible future functionality:

- Interpret scenario results
- Explain patterns
- Summarize municipality differences
- Generate human-readable planning insights
- Highlight notable economic impacts

Current MVP:

- UI placeholder only
- Disabled
- No API calls
- No LLM inference
- No fabricated AI responses

Label appropriately:

"AI Analysis — Future Integration"

---

# 41. FORECASTING / PREDICTION — PLACEHOLDER ONLY

Provide a placeholder for:

Forecasting & Prediction

Potential future functions:

- Demand forecasting
- Seasonal demand
- Source availability forecasting
- Supply projections
- Drought scenario projections
- Shortage probability
- Confidence intervals

Do NOT implement forecasting yet.

Do NOT generate fake predictions.

Do NOT use the language model for numerical forecasting.

Future forecasting should use an independent statistical or machine-learning model.

For now:

- Module shell only
- UI placeholder only
- Service/interface definitions if useful
- No generated predictions

---

# 42. INTERFACE DESIGN

The application should look like a professional planning platform.

Avoid:

- Generic admin dashboards
- Excessive metric cards
- Excessive gradients
- Cartoon interfaces
- Sci-fi HUD designs
- Neon overload
- Tiny text
- Visual clutter

Preferred feel:

- Professional
- Modern
- Spatial
- Technical
- Government-appropriate
- Data-rich
- Sophisticated
- Interactive

Water should serve as the dominant visual theme.

---

# 43. MAIN SIMULATION SCREEN

Suggested navigation:

WATER ECONOMICS

[Simulation]
[Scenarios]
[Spatial View]
[Data]
[Methodology]

Secondary:

Municipality:

[Catbalogan]
[Pinabacdao]
[Calbayog]
[Combined MVP]

Scenario:

[Baseline ▼]

Main workspace:

LEFT
Sources
Utilities
Demand
Policies

CENTER
3D Water Model
Flows

RIGHT
Inspector

BOTTOM
Comparison / Analytics drawer

---

# 44. METHODOLOGY PAGE

Explain:

- Active MVP areas
- Inactive municipalities
- Water-balance formula
- Allocation calculation
- Affordability calculation
- Equity indicators
- Livelihood indicators
- Assistance calculations
- Scenario assumptions
- Demo-data limitations
- Utility relationships

Include a prominent statement:

"The current MVP calculates scenarios only for Catbalogan City, Pinabacdao, and Calbayog. Other Samar municipalities are reserved for future expansion and are not included in calculated results."

---

# 45. SAMPLE MVP DATA

Create coherent DEMONSTRATION DATA for the three municipalities.

Do not claim these numbers are official.

Example structure:

CATBALOGAN

Supply:
42 ML/day

Demand:
46 ML/day

Provider:
Catbalogan Water District

Primary demand:
Residential + Commercial + Institutional

---

PINABACDAO

Supply:
15 ML/day

Demand:
18 ML/day

Provider:
Local Water Supply System
Demo placeholder

Primary demand:
Residential + Agriculture

---

Calbayog

Supply:
19 ML/day

Demand:
21 ML/day

Provider:
Calbiga Water District

Primary demand:
Residential + Agriculture

---

Combined MVP:

Supply:
76 ML/day

Demand:
85 ML/day

Shortage:
9 ML/day

These numbers are illustrative only.

Display:

"Illustrative demonstration data — not official LGU statistics."

---

# 46. BALIBAGO DEMO USE

Balibago Waterworks System, Inc. can be used to demonstrate an additional-supply scenario.

Example policy:

"Activate supplementary private supply"

OFF

→

ON

Example demonstration:

Additional:
+5 ML/day

Provider:
Balibago Waterworks System, Inc.

The simulation may then show:

Supply increases
Water pool rises
Shortages decrease
Sector coverage improves
Potential service cost changes

Do not assume a specific real-world capacity without verified data.

Use the feature as a configurable demo scenario.

---

# 47. DEMONSTRATION STORY

Design the prototype around a clear live presentation.

STEP 1

Open Samar spatial view.

Show all Samar municipalities.

Most appear muted.

Highlight:

Catbalogan
Pinabacdao
Calbayog

Explain:

"These are the three municipalities included in the MVP."

---

STEP 2

Switch to Combined MVP.

Show:

Available water
Demand
Shortage
Allocation

Display the central 3D water body.

---

STEP 3

Select Pinabacdao.

Apply severe drought.

Source inflow decreases.

3D water level drops.

Residential and agricultural coverage decline.

---

STEP 4

Inspect economic impacts.

Show:

- Households affected
- Agricultural shortage
- Livelihood exposure
- Affordability pressure

---

STEP 5

Apply policy.

Possible response:

Protect minimum residential allocation.

Introduce assistance.

Enable supplementary supply.

---

STEP 6

Water level partially recovers.

Coverage improves.

Show trade-offs.

---

STEP 7

Compare:

Baseline

vs.

Drought

vs.

Policy Response

---

STEP 8

Return to Samar map.

Show three pilot municipalities with updated conditions while remaining Samar municipalities stay inactive.

This communicates scalability without pretending the entire province has already been modeled.

---

# 48. RESPONSIVENESS

Primary presentation devices:

1366×768
1440×900
1920×1080

Optimize heavily for desktop and projector use.

Tablet compatibility is useful.

Mobile support is secondary.

---

# 49. PERFORMANCE

The 3D simulation should remain smooth.

Avoid excessive geometry.

Use optimized meshes.

Avoid unnecessary rerenders.

Use smooth interpolation for water-level changes.

Do not reconstruct the entire Three.js scene every time values change.

---

# 50. TECHNICAL STACK

Recommended:

React
TypeScript
Vite
Tailwind CSS

State:
Zustand

3D:
Three.js
React Three Fiber

Charts:
ECharts
Recharts
or D3 where appropriate

Map:
MapLibre GL
or Leaflet

Architecture:

src/
    components/
    simulation/
    municipalities/
    utilities/
    three/
    charts/
    map/
    scenarios/
    data/
    methodology/
    placeholders/
    store/
    services/
    engine/
    types/
    utils/

---

# 51. STATE MANAGEMENT

Central state should include:

activeMunicipality

activeScenario

municipalities

utilityProviders

waterSources

communities

sectors

policies

scenarios

simulationResults

selectedEntity

visualizationMode

When input changes:

User input
↓
Scenario state
↓
Simulation engine
↓
Municipality calculations
↓
Combined MVP calculation
↓
UI update
↓
3D water animation

---

# 52. WHAT MUST ACTUALLY WORK

The MVP must support:

1. Samar Province map
2. Active highlighting of Catbalogan, Pinabacdao, and Calbayog
3. Disabled/inactive remaining municipalities
4. Municipality switching
5. Combined MVP mode
6. Dynamic 3D water visualization
7. Water-source controls
8. Utility-provider visualization
9. Supply adjustment
10. Demand adjustment
11. Drought simulation
12. Water allocation
13. Sector coverage
14. Household affordability
15. Livelihood exposure
16. Assistance budget
17. Scenario creation
18. Scenario comparison
19. Municipality comparison
20. Sankey-style flow visualization
21. Data workspace
22. Methodology page
23. Reset simulation

The implemented features should share the same underlying state.

Avoid fake buttons.

---

# 53. DEVELOPMENT PRIORITY

PHASE 1

Application shell

Municipality model

Catbalogan
Pinabacdao
Calbayog

Inactive Samar municipalities

Demo data

Simulation engine

---

PHASE 2

Dynamic Three.js water visualization

Municipality switching

Water-level animation

Supply-demand connection

---

PHASE 3

Utility relationships

Water sources

Sector demand

Allocation controls

Drought simulation

---

PHASE 4

Affordability

Livelihood exposure

Assistance

Equity indicators

---

PHASE 5

Samar GIS map

Water-flow visualization

Scenario comparison

Municipality comparison

---

PHASE 6

UI polish

Animations

Tooltips

Demo flow

Methodology

---

PHASE 7

Placeholder only:

AI Interpretation

Forecasting

---

# 54. FIRST IMPLEMENTATION TARGET

Do not try to build the entire platform at once.

First produce one polished vertical slice containing:

- App shell
- Catbalogan
- Pinabacdao
- Calbayog
- Active/inactive municipality architecture
- Main municipality selector
- Combined MVP mode
- One functional 3D water pool
- Three to five example water sources
- Utility-provider relationships
- Four demand sectors
- Supply slider
- Demand controls
- Drought control
- Allocation control
- Live water-level update
- Sector coverage calculation
- Baseline scenario
- Scenario A
- Basic scenario comparison
- Basic Sankey/flow visualization

Once this entire slice functions end-to-end, continue with affordability, economic analysis, assistance, mapping, and advanced visualization.

---

# 55. DATA INTEGRITY

Never present demonstration figures as official.

Clearly distinguish:

VERIFIED

USER-PROVIDED

SIMULATED

DEMONSTRATION

If official data for Catbalogan, Pinabacdao, or Calbayog is unavailable:

Use plausible values only for prototype demonstration.

Every appropriate section should show:

"Illustrative demonstration data — not official LGU statistics."

---

# 56. DECISION-SUPPORT PRINCIPLE

The platform must not automatically decide who receives water.

Its role is to:

- Visualize constraints
- Calculate consequences
- Expose trade-offs
- Compare policies
- Support human planning

Use terminology such as:

Scenario Result

Potential Impact

Planning Indicator

Estimated Exposure

Allocation Comparison

Avoid:

Correct Allocation

AI-Decided Allocation

Automatically Optimal Distribution

Best Municipality

The human planner remains responsible for policy decisions.

---

# 57. FINAL PRODUCT FEEL

When someone sees WATER ECONOMICS, they should not think:

"This is just another government dashboard."

They should understand:

"I can actually see what happens to our water system when supply, demand, allocation, drought, utility availability, and policy change."

The main physical metaphor is simple:

More supply
→ water rises.

Higher demand
→ water falls.

Drought
→ inflow falls and water drops.

Supplementary supply
→ water recovers.

Higher allocation
→ stronger outflows.

Shortage
→ affected sectors and municipalities become visually stressed.

Policy intervention
→ distribution and economic indicators change.

The MVP should combine:

3D WATER VISUALIZATION

+

CATBALOGAN, PINABACDAO, AND Calbayog

+

LOCAL WATER UTILITIES

+

SUPPLY-DEMAND MODELING

+

WATER ALLOCATION

+

ECONOMIC ANALYSIS

+

WATER EQUITY

+

POLICY SIMULATION

+

SCENARIO COMPARISON

+

SAMAR SPATIAL CONTEXT

into one coherent interactive planning environment.

Samar Province should be represented as the eventual deployment scope.

However, the actual MVP simulation must calculate only:

CATBALOGAN CITY

PINABACDAO

CALBAYOG

All other Samar municipalities remain inactive and excluded from calculations until future expansion.

Begin development by establishing this municipality-aware architecture and then create the first complete vertical slice around the functioning 3D water simulation.

Do not begin by building every page.

Make the core water-economic simulation work end-to-end first.