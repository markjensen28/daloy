# Low-Poly Dam React + Vite

A procedural low-poly dam/reservoir scene built with React, TypeScript, Vite, Three.js, React Three Fiber, and Drei.

## Run

```bash
npm install
npm run dev
```

Then open the Vite URL, normally `http://localhost:5173`.

## Main files

- `src/components/DamScene.tsx` — complete 3D dam, terrain, trees and animated water.
- `src/App.tsx` — reservoir-level state and slider.
- `src/styles.css` — page/card styling.

## Data integration

The 3D reservoir is controlled by the `waterLevel` prop (15–100). Replace the slider state in `App.tsx` with real API, simulation, drought, demand or supply data when you are ready.
