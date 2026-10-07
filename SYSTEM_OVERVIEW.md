# DALOY - Economy Decision Sandbox: System Overview

This document explains the current root application in technical terms: what it does, how its parts connect, how its water calculations work, and what assumptions a reviewer should keep in mind.

## 1. What the system is

DALOY - Economy Decision Sandbox is a visualization-first, browser-based planning prototype for exploring water supply and allocation scenarios in three Samar pilot local government units (LGUs): Catbalogan City, Pinabacdao, and Calbayog. A user changes assumptions, sees the calculated effects immediately, compares saved scenarios, and can add proposed developments that contribute demand.

The app is a **single-day deterministic scenario calculator**. It does not forecast future conditions, optimize policy, or operate a real water utility. Every displayed number is derived from the selected scenario inputs and illustrative values embedded in the application.

## 2. Technology stack

| Layer | Technology | Role |
|---|---|---|
| Language | TypeScript, TSX | Typed application, simulation, and component code |
| UI | React 19 | Interactive views and application state |
| Build and local server | Vite 6 | Development server and production asset build |
| 3D | Three.js, React Three Fiber, Drei | Reservoir and low-poly town scenes |
| Geographic projection | D3 Geo | Projects bundled Samar GeoJSON boundaries into the map view |
| Icons | Lucide React | Interface icons |
| Styling | CSS | Layout, theme, responsive behavior, and visual states |
| Browser persistence | `localStorage` | Saved scenario copies and appearance preference on this device |
| Unit tests | Node test runner via `tsx` | Exercises pure simulation calculations |

The main app is defined by the root `package.json` and `src/`. The `low-poly-dam-*` directories are neighboring experiments/prototypes rather than the root Vite application described here.

## 3. Main application areas

### Simulation workspace

The Simulation page is the main working view. It holds the currently selected scenario and scope, exposes controls for source assumptions, sector demand/allocation, and policies/affordability, and renders the current calculated result. The same results can be viewed through summary/impact components, water-flow visuals, a municipal boundary map, and the 3D scenes.

The scope can be combined (the three active LGUs) or a single active LGU. Combined mode sums the results of independently calculated LGUs; it does not connect their reservoirs or transfer water between them.

### Scenarios

The Scenarios page compares named scenario copies and can compare municipalities. The built-in baseline and drought scenarios are initialized in memory. A user can save a named copy of the current scenario; saved copies are written to local browser storage. Editing a selected scenario changes its in-memory state. Saving creates a new copy rather than syncing with a server.

### Data

The Data page exposes selected municipal assumptions such as sector demand and household income. The export action creates a CSV of the current calculated results for the current scope. The CSV is explicitly labeled demonstration data.

### Methodology

The Methodology page describes the model boundaries and assumptions in the interface: single-day calculations, supply and storage, allocation, essential-needs protection, affordability, household impact, provider placeholders, mapping source, and disabled future modules.

### Spatial and development planning

The spatial view provides municipal context and interactive 3D town/reservoir visuals. Each pilot has a larger, distinct illustrative scene: a coastal edge for Catbalogan, terraced upland river terrain for Pinabacdao, and a steeper river-valley landscape for Calbayog. These are visual concepts, not surveyed topography or georeferenced layouts. The Development planner lets a user place and configure illustrative assets in a selected active LGU. Each active asset adds water demand to one of the four demand sectors. The user can pause an asset or change its status; status (`proposed`, `approved`, `existing`) is for visual planning context. Every active asset contributes demand regardless of status.

### DALOY scenario reading

DALOY is a rule-based explanation panel in the client. Its responses are assembled from the current calculated values and scenario assumptions. There is no connected AI model or Gemma endpoint, and it does not generate forecasts.

## 4. Data model and state

Core types are in [`src/engine/simulation.ts`](src/engine/simulation.ts) and [`src/engine/developments.ts`](src/engine/developments.ts).

- A **Municipality** contains a stable id, name, active flag, illustrative household/income values, reservoir capacity and opening volume, provider label, source list, and four baseline demand values.
- **Inputs** are scenario controls for supply scaling, drought reduction, demand scaling, allocation target, non-revenue water (NRW), protected reserve, supplementary supply, essential-needs protection, price, income, assistance budget, per-source outputs, four sector demands, and four sector allocation shares.
- A **Scenario** contains an id, a display name, an input object keyed by active municipality id, and optional development placements.
- A **Development** contains its municipality, profile id, map position, editable numeric profile inputs, active/paused state, and visual planning status.
- A **Result** is returned by the simulation functions and consumed by the React views. It includes supply, demand, allocation, coverage, storage, spill, unmet demand, household impact and affordability values, plus sector and development breakdowns.

`src/App.tsx` owns the shared interactive application state. It calls the pure functions in the engine and passes results and callbacks to view components. The code uses React state and memoization; there is no separate application server or database.

## 5. Calculation flow

The core calculation is in `simulateMunicipality` in [`src/engine/simulation.ts`](src/engine/simulation.ts). It runs separately for each selected active LGU, and `simulate` aggregates the resulting values for combined scope.

### Units

- Inflow, demand, delivery, and shortfall rates are **ML/day**.
- Reservoir volumes are **ML**.
- NRW, drought, reserve, and allocation controls are percentages.
- Household monthly use is assumed to be 15 m³ per month for the affordability calculation.

### Step-by-step

1. **Calculate source inflow.** Each configured source output is multiplied by the overall supply percentage and by the remaining supply after drought reduction. The optional supplementary supply toggle adds a fixed 5 ML/day to that municipality.
2. **Calculate required demand.** Each sector's base demand is multiplied by the demand percentage. Active development profiles calculate demand in liters/day, convert it to ML/day, and add it to their mapped sector.
3. **Set the protected storage volume.** The reserve percentage is applied to that LGU's reservoir capacity. The current default is 22% of capacity.
4. **Calculate allocable delivered water.** In simplified equation form:

   `allocable = max(0, opening storage + inflow - protected reserve volume) × (1 - NRW)`

   The current default NRW is 28%. The implementation clamps NRW to 0–80% and reserve to 0–90%.
5. **Calculate sector targets.** Required demand is multiplied by the allocation target percentage. Actual allocation cannot exceed either the allocable amount or the sum of sector targets.
6. **Apply optional essential-needs protection.** If enabled, the calculator gives priority to critical services up to their target, then households up to 80% of their target, as water permits.
7. **Distribute remaining water.** The remaining targets are served according to the user-configured sector allocation shares. A sector cannot receive more than its target; unused share is redistributed among sectors that still need water. If all active shares are zero, remaining water is distributed according to remaining demand.
8. **Calculate closing storage and spill.** Delivered allocation is converted to physical reservoir withdrawal by dividing by `(1 - NRW)`. The result is subtracted from opening storage plus inflow. Closing storage is capped at reservoir capacity; excess is reported as spill. A reserve shortfall is reported if closing storage ends below the protected reserve volume.
9. **Calculate indicators.** Sector coverage is allocation divided by required demand. Unmet demand is demand minus allocation. The supply gap is demand minus current inflow (floored at zero), so it does not include opening storage. Household impact is an equivalent count derived from the household-sector coverage rate, not a list of identified households.
10. **Calculate affordability indicators.** Monthly expense is `15 m³ × price`. Assistance covers up to the number of households affordable at ₱300 each within the scenario budget. Burden is the remaining assumed expense divided by monthly income. Combined burden is weighted by household count.

### Baseline values

The baseline factory sets supply and demand multipliers and allocation target to 100%, drought to 0%, NRW to 28%, reserve to 22%, no supplementary supply, no essential-needs protection, and equal 25% sector shares. Its embedded active-area source and demand totals are 76 ML/day and 85 ML/day. Opening storage is fixed per LGU. Thus the baseline supply gap is 9 ML/day, while the actual shortage also depends on storage, reserve, NRW, and allocation.

### Development demand

There are ten editable illustrative profiles: shopping mall, subdivision, hospital, school, hotel, public market, factory, poultry farm, government facility, and evacuation center. Each profile has its own inputs and water-use formula in `src/engine/developments.ts`. These are assumptions chosen for demonstration, not sourced official consumption standards. Industrial demand currently maps to the Business + tourism sector. An active subdivision also increases the modeled household count using units and occupancy.

## 6. Visualization and interaction architecture

- [`src/main.tsx`](src/main.tsx) mounts the React application and imports the global stylesheets.
- [`src/App.tsx`](src/App.tsx) manages navigation, scenario selection, scope, input editing, save/export actions, and composition of the views.
- [`src/Visuals.tsx`](src/Visuals.tsx) contains the Samar map and flow diagram. The map uses D3 Geo to project the bundled `public/samar.json` boundary data.
- [`src/Reservoir.tsx`](src/Reservoir.tsx) renders the reservoir and its water-level visualization using the Three.js React ecosystem.
- [`src/CityMaquette.tsx`](src/CityMaquette.tsx) renders the interactive low-poly municipality scene and supports selecting/planning assets.
- [`src/DevelopmentPlanner.tsx`](src/DevelopmentPlanner.tsx) edits asset profiles and placement plans.
- [`src/styles.css`](src/styles.css) and [`src/palette.css`](src/palette.css) control the application presentation.

The 3D views are visualization surfaces, not hydraulic simulations. The numerical model runs in TypeScript in the browser; views display the returned values.

## 7. Persistence and export

The app reads and writes two local storage keys:

- `water-economics-scenarios-v1`: saved scenario copies and their inputs/developments.
- `water-economics-appearance-v1`: day/night appearance selection.

Saved data stays in the current browser profile and device. There is no account, server persistence, cross-device sync, or concurrent editing. A CSV is generated client-side from the current result and downloaded by the browser.

## 8. Geographic and numerical data provenance

The municipality boundaries come from the bundled `public/samar.json`, described by the project as a 2011 low-resolution Samar dataset from `faeldon/philippines-json-maps`; its MIT license is included at `public/map-LICENSE.txt`. The boundaries are visual context and are not verified current legal boundaries.

All numerical water, household, income, price, provider, capacity, opening-storage, demand, and development assumptions are demonstration values. Calbayog uses a configurable placeholder provider, and the app does not assert an actual provider relationship. Supplementary supply is a configurable illustrative 5 ML/day assumption, not a confirmed service agreement.

## 9. What is outside the current system

- No backend API, database, account system, or permissions model.
- No live meter, utility, weather, reservoir, or official statistical data connection.
- No multi-day time steps, hydrological model, forecast, optimization, or uncertainty analysis.
- No water transfers or shared reservoir network between municipalities.
- No AI inference behind DALOY; no prediction module is active.
- No operational water-service recommendation should be inferred from these illustrative outputs.

## 10. Reviewer orientation

For a technical review, a useful reading order is:

1. [`src/engine/simulation.ts`](src/engine/simulation.ts) — model inputs, formulas, conservation behavior, and aggregation.
2. [`src/engine/developments.ts`](src/engine/developments.ts) — development demand profile formulas and validation.
3. [`src/engine/simulation.test.ts`](src/engine/simulation.test.ts) — existing checks for mass balance, drought, policies, NRW, active-area exclusion, assistance, and development behavior.
4. [`src/App.tsx`](src/App.tsx) — application state, controls, persistence, CSV export, and page composition.
5. Visualization components — confirm that displays communicate the model outputs and assumptions as intended.

To run locally, use `npm install` and `npm run dev`. The project also defines `npm run build` and `npm test` scripts in `package.json`.
