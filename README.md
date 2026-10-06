# Water Economics

A visualization-first frontend prototype for water planning in Catbalogan City, Pinabacdao, and Calbayog. React, TypeScript, Vite, React Three Fiber / Three.js, and D3 geographic projection.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5173. On Windows with a trusted enterprise certificate chain, Node 24 can use the system trust store with `$env:NODE_USE_SYSTEM_CA='1'` before installing.

```powershell
npm.cmd run build
npm.cmd test
```

## Demo walkthrough

1. Start in Combined MVP and explore the 3D reservoir by dragging or zooming.
2. Select Pinabacdao and choose Severe drought. Observe inflow, closing storage, and sector coverage.
3. Open Policies and enable supplementary supply or essential-needs protection.
4. Save a named scenario, then compare it under Scenarios.
5. Open Spatial view to see active pilot boundaries. Inactive municipalities are excluded from calculations.
6. Edit sector demand and household income in Data; export the current calculated results as CSV.

## Important model details

This is a **single-day deterministic simulation**, not forecasting. Daily rates are ML/day; stored volume is ML. Each LGU starts with a fixed illustrative opening storage. Allocations are capped by inflow plus opening storage and use weighted demand. Optional essential-needs protection reserves institutional needs first, then 80% of residential demand as water permits. Excess beyond reservoir capacity spills. Municipal water is never implicitly pooled between LGUs.

The immutable baseline factory seeds 76 ML/day supply and 85 ML/day demand, a 9 ML/day inflow gap. Opening storage covers that baseline gap. Supply gap and actual unmet demand are deliberately separate indicators. The methodology view explains every calculation, including household assistance and affordability.

All numerical values are **demonstration data, not official LGU statistics**. Calbayog's provider uses a configurable placeholder because the brief's Calbiga/Calbayog relationship is unverified. Supplemental supply illustrates a possible configurable partnership and does not assert a real service relationship. AI and forecasting remain disabled placeholders.

## Structure

- `src/engine/simulation.ts`: typed municipality data, scenario inputs, pure calculation functions.
- `src/engine/simulation.test.ts`: active-area exclusion, conservation, drought, policy, and assistance tests.
- `src/Reservoir.tsx`: animated 3D infrastructure scene with damped water-level transitions, camera controls, reduced-motion support, and a WebGL error fallback.
- `src/Visuals.tsx`: municipal boundary map and proportional flow ribbons.
- `src/App.tsx`: shared scenario state and interactive workspace, comparisons, editable data, methodology.
- `src/styles.css`: responsive application design.

Saved scenario copies use browser local storage on this device. Subsequent edits remain in memory until saved as another copy. There is no backend, authentication, cross-device synchronization, or official data feed.

## Geographic attribution

The bundled `public/samar.json` contains all 26 Samar municipality/city boundaries from [faeldon/philippines-json-maps](https://github.com/faeldon/philippines-json-maps), the **2011 low-resolution Samar dataset**. MIT license is included at `public/map-LICENSE.txt`. These boundaries are historical visual context, not verified current legal boundaries.

## Skills

Installed the user-provided `frontend-design` and `ui-ux-pro-max` skills into the user Codex skills directory. Both were applied to this build. The provided UI/UX package contained only `SKILL.md`; its referenced search scripts and design database were not supplied. `DESIGN.md` records the resulting design direction.
