# Low Poly Dam — camera-matched recreation

This version prioritizes visual fidelity to the supplied reference image.

## Why it uses image projection
Only one 2D reference view is available, so the exact hidden 3D geometry cannot be recovered uniquely. The default view therefore uses a pixel-faithful projection of the supplied reference. For interaction, the same reference is split into depth layers (mountains, reservoir, dam, waterfall, foreground) and moved in 2.5D to create subtle parallax. Releasing the mouse returns to the exact camera-matched view.

## Run

With Vite:

```bash
npm install
npm run dev
```

Or serve the folder with any static HTTP server, for example:

```bash
python -m http.server 4173
```

Then open http://localhost:4173
