# Low-Poly Hydroelectric Dam — Vite + React + React Three Fiber

A code-generated 3D recreation of the supplied low-poly dam image. No external 3D assets or textures are required.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
npm run preview
```

## Main file

All model geometry is created in `src/App.jsx` using React Three Fiber / Three.js:

- faceted mountain rocks
- reservoir and river water
- concrete dam wall
- three spillway gates
- animated waterfall sheets
- low-poly foam
- conifer trees
- orthographic camera and soft shadows

The scene is intentionally close to the reference while remaining fully code-generated and easy to edit.
