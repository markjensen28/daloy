Yes. The cleanest way to approach this is to treat every establishment as a **configurable demand object** that can be placed into a municipality and then plugged into the water simulation.

The core idea is:

> **Place establishment → calculate its water demand → add that demand to the municipality → recalculate supply, reserve, allocation, risk, and economics → update every visualization.**

So the Development Planner is not just a 3D decoration system. It becomes another input source for your entire Water Economics Platform.

A good overall flow is:

```text
Choose municipality
      ↓
Open Development Planner
      ↓
Choose establishment from Asset Library
      ↓
Configure establishment
      ↓
Drag/place 3D model on planning terrain
      ↓
Calculate water requirement
      ↓
Add demand to municipality
      ↓
Check if supply can meet demand
      ↓
Recalculate allocations + reserve + risk
      ↓
Update reservoir, flows, charts, economics
      ↓
Save as scenario
```

The first thing I would build is the **Asset Library**.

Do not make it only malls. Group establishments by type.

For example:

```text
DEVELOPMENT ASSET LIBRARY

Residential
• Subdivision
• Apartment / condominium
• Socialized housing project

Commercial
• Shopping mall
• Supermarket
• Public market
• Restaurant
• Office building
• Commercial complex

Tourism
• Hotel
• Resort
• Convention facility

Public / Institutional
• Hospital
• School
• University
• Government office
• Evacuation center

Industrial
• Factory
• Processing facility
• Warehouse
• Ice plant

Agriculture / Livelihood
• Poultry farm
• Piggery
• Aquaculture facility
• Agricultural processing facility

Water Infrastructure
• Water treatment plant
• Reservoir
• Pump station
• Rainwater collection facility
```

For the hackathon, though, I would not implement all of those. Start with around **8–10 assets**.

A practical MVP set would be:

```text
Mall
Subdivision
Hospital
School
Hotel
Public Market
Factory
Poultry Farm
Government Facility
Evacuation Center
```

That already demonstrates several different demand patterns.

The next step is to define what makes each asset unique.

A mall should not use the same input form as a hospital.

For example:

```text
MALL

Floor area
Employees
Visitors/day
Operating hours
Restaurants/food court
Water efficiency
Rainwater harvesting
```

A hospital:

```text
HOSPITAL

Number of beds
Employees
Patients/day
Visitors/day
Laundry facility
Operating hours
```

A hotel:

```text
HOTEL

Number of rooms
Occupancy rate
Employees
Restaurant capacity
Pool/spa
Laundry
```

A subdivision:

```text
SUBDIVISION

Housing units
Average household size
Occupancy rate
Common facilities
Landscaping demand
```

A school:

```text
SCHOOL

Students
Teachers/staff
Operating days
School hours
Canteen
```

A poultry farm:

```text
POULTRY FARM

Number of birds
Cleaning frequency
Processing activity
Worker count
```

A factory:

```text
FACTORY

Employees
Production capacity
Operating hours
Process-water requirement
Cooling requirement
```

This is why I would make each asset have a **profile schema**.

Conceptually:

```ts
AssetTemplate {
  id
  name
  category
  modelPath

  inputs[]
  demandFormula

  defaultValues
}
```

Then the user selects an establishment and edits its assumptions.

For example:

```text
PROPOSED SHOPPING MALL

Floor Area
18,000 m²

Employees
350

Visitors
4,000 / day

Water-efficient fixtures
YES

Rainwater harvesting
NO

Estimated water demand
1.15 ML/day

[ Place Development ]
```

The important thing is that the water-demand number is calculated by your own formula engine.

Gemma does not calculate it.

For example:

```text
Mall Demand =
Floor Area Demand
+ Employee Demand
+ Visitor Demand
+ Food Service Demand
- Water Efficiency Savings
- Rainwater Contribution
```

A subdivision might use:

```text
Subdivision Demand =
Housing Units
× Average Household Size
× Per-Capita Water Requirement
```

Hospital:

```text
Hospital Demand =
Beds × Bed Demand Factor
+ Employees × Staff Factor
+ Outpatient Demand
+ Laundry Demand
```

So each establishment has a slightly different calculation model.

Then comes the 3D placement.

Your asset bank contains the 3D models:

```text
models/
    mall.glb
    hospital.glb
    school.glb
    hotel.glb
    subdivision.glb
    factory.glb
    poultry.glb
```

You drag one from the UI.

The application remembers:

```ts
selectedAsset = mall
```

When you move over the Three.js terrain, you use raycasting.

Conceptually:

```text
Mouse position
     ↓
Three.js Raycaster
     ↓
Intersect terrain
     ↓
Get world coordinates
     ↓
Show ghost model
```

The ghost model can be semi-transparent purple.

If placement is valid:

```text
Purple preview
✓ Release to place
```

If placement is invalid:

```text
Red preview
✕ Cannot place here
```

Once dropped:

```ts
{
  id: "development-001",
  municipality: "Catbalogan",
  assetType: "mall",
  position: [12.4, 0, -4.8],

  inputs: {
    floorArea: 18000,
    employees: 350,
    visitors: 4000
  },

  dailyDemand: 1.15
}
```

Now it becomes part of the simulation.

The next part is the most important.

Each placed establishment should add water demand to a **sector**.

For example:

```text
Mall
→ Commercial

Hotel
→ Tourism / Commercial

Subdivision
→ Residential

Hospital
→ Institutional / Public Service

School
→ Institutional

Factory
→ Industrial

Poultry Farm
→ Agriculture / Livelihood

Public Market
→ Commercial
```

So your municipality demand is not just one number.

You might have:

```text
Residential     24 ML/day
Agriculture     10 ML/day
Commercial       8 ML/day
Institutional    5 ML/day
Industrial       2 ML/day
```

Then place a mall:

```text
Mall
+1.2 ML/day Commercial
```

Now:

```text
Commercial
8.0 → 9.2 ML/day
```

Total demand increases automatically.

Your simulation becomes:

```text
Total Demand =
Residential
+ Agriculture
+ Commercial
+ Institutional
+ Industrial
+ Development Demands
```

Then you compare that with usable supply.

For example:

```text
SUPPLY

Sources               55 ML/day
NRW                   -7 ML/day
Environmental reserve -3 ML/day

Usable supply
45 ML/day
```

Demand:

```text
Existing demand
42 ML/day

New Mall
+1.2

Hospital Expansion
+0.8

Total
44 ML/day
```

Result:

```text
Supply:      45 ML/day
Demand:      44 ML/day

Reserve:
1 ML/day
```

The system can say:

> Demand can currently be met, but only 1 ML/day of reserve remains.

Then the planner places a subdivision:

```text
Subdivision
+2 ML/day
```

Now:

```text
Supply:       45
Demand:       46

Deficit:
1 ML/day
```

Now your allocation system activates.

That shortage should automatically affect your sector allocations.

For example:

```text
Residential       100%
Institutional     100%
Agriculture        92%
Commercial         88%
Industrial         75%
```

depending on the allocation policy selected.

The 3D reservoir should respond too.

Suppose your reservoir contains:

```text
Stored water:
80 ML
```

Before developments:

```text
Daily net deficit:
0 ML
```

After developments:

```text
Daily deficit:
1 ML
```

You now have:

```text
80 days of stored-water coverage
```

or whatever your assumptions say.

As the simulation progresses:

```text
Day 1    79 ML
Day 2    78 ML
Day 3    77 ML
```

The 3D water level should physically decrease.

That is where your centerpiece becomes very useful.

You can visually connect everything.

For example:

```text
Water Sources
      │
      ▼
 Reservoir
      │
      ▼
Municipality
      │
 ┌────┼──────────────┐
 ▼    ▼              ▼
Res. Agriculture Commercial
                    │
              ┌─────┴─────┐
              ▼           ▼
         Existing       Mall
```

If the mall is added, the commercial branch gets thicker.

In your Sankey:

```text
Reservoir
   │
   └════════════ Commercial
                     │
                     └══ Mall
```

The wedge chart changes too.

Before:

```text
Residential     51%
Agriculture     21%
Commercial      17%
Institutional   11%
```

After mall:

```text
Residential     49%
Agriculture     20%
Commercial      20%
Institutional   11%
```

The bubble chart may change the municipality's water-stress position.

The choropleth might move:

```text
LOW → MODERATE
```

So one action propagates through the entire platform.

I would structure the calculation pipeline like this:

```text
PLACED DEVELOPMENT

Mall
Hospital
Subdivision
etc.
        │
        ▼
Development Profile
        │
        ▼
Water Demand Calculator
        │
        ▼
Sector Demand
        │
        ▼
Municipality Total Demand
        │
        ▼
Supply vs Demand
        │
        ├──── Reservoir Storage
        ├──── Allocation Engine
        ├──── Water Flow Diagram
        ├──── Sankey
        ├──── Wedge Chart
        ├──── Economic Impact
        ├──── Affordability
        └──── Shortage Risk
```

Then Gemma sits after the calculations.

```text
Simulation Results
        ↓
Gemma 4 E4B
        ↓
Interpretation
```

For example, Gemma could say:

> The proposed mall and subdivision increase Catbalogan's total demand by 3.2 ML/day. Baseline supply remains sufficient, but available reserve falls from 4.5 to 1.3 ML/day. Under the moderate drought scenario, demand exceeds supply by 5.8 ML/day, primarily affecting agriculture and commercial allocations.

But those numbers are calculated by your system.

The AI only explains them.

I would also let users test **multiple developments together**.

For example:

```text
CURRENT DEVELOPMENT PLAN

Shopping Mall
+1.2 ML/day

Hotel
+0.4 ML/day

Subdivision
+2.1 ML/day

Hospital
+0.7 ML/day

TOTAL NEW DEMAND
+4.4 ML/day
```

Then the planner can toggle assets on/off.

```text
☑ Mall
☑ Hotel
☑ Subdivision
☐ Hospital
```

That lets them compare:

```text
Scenario A
Mall only

Scenario B
Mall + subdivision

Scenario C
Mall + subdivision + hospital
```

That is very useful for planning.

I would also give every placed development three states:

```text
PROPOSED
purple

APPROVED
blue/teal

EXISTING
gray
```

Then the 3D terrain can visually distinguish them.

The Development Planner UI could therefore be:

```text
┌─────────────────────────────────────────────────────────────┐
│ DEVELOPMENT PLANNER                                        │
├───────────────┬──────────────────────────────┬──────────────┤
│               │                              │              │
│ ASSET LIBRARY │      3D PLANNING MAP         │ IMPACT       │
│               │                              │              │
│ Search...     │       ░░░ terrain ░░░       │ Supply       │
│               │                              │ Demand       │
│ Commercial    │          🏢                  │ Reserve      │
│ Mall          │      proposed mall           │ Risk         │
│ Hotel         │                              │ Cost         │
│ Market        │                              │              │
│               │                              │              │
│ Residential   │                              │              │
│ Subdivision   │                              │              │
│ Apartment     │                              │              │
│               │                              │              │
│ Public        │                              │              │
│ Hospital      │                              │              │
│ School        │                              │              │
│               │                              │              │
└───────────────┴──────────────────────────────┴──────────────┘
```

One design choice I strongly recommend:

Do not make the establishment model itself extremely detailed.

Your system is analytical.

Use simple low-poly models.

For example:

```text
Mall
simple 2–3 storey block

Hospital
block + cross silhouette

School
long low building

Subdivision
cluster of small houses

Factory
rectangular shed + chimney

Hotel
simple tower
```

This will fit much better with your monochrome planning-map style.

For implementation, I would build it in this order:

1. Create asset templates.
2. Create editable forms.
3. Create the demand formulas.
4. Make the municipality calculation accept `developmentDemand`.
5. Connect that to the existing reservoir/supply simulation.
6. Add Three.js drag-and-drop placement.
7. Update water-flow visualizations.
8. Add scenario saving/comparison.
9. Add Gemma interpretation last.

Don't start with drag-and-drop first.

The most important thing is that this works:

```text
Add Hospital
        ↓
+0.8 ML/day
        ↓
Demand changes
        ↓
Supply balance changes
```

Once the logic works, then attach the 3D placement interface to it.

That way, even if the 3D interaction has bugs during the hackathon, the **actual simulation engine is already solid**.