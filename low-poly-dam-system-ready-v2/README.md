# Low-Poly Dam — System-Ready Water Level Model

This version keeps the smooth low-poly dam artwork, but the **reservoir is now a separately controllable layer**. The full-water image is covered by a generated dry basin and then re-revealed with precomputed reservoir masks, so the level can be driven by your application or by a real sensor value.

## Run

```bash
npm install
npm run dev
```

## React integration

Use `DamModel` directly in your system:

```jsx
import DamModel from './DamModel.jsx'

export default function Dashboard({ reservoirPercent }) {
  return (
    <DamModel
      waterLevel={reservoirPercent} // 0 to 100
      showReadout={false}
    />
  )
}
```

### Real sensor value

If your sensor sends an actual level, for example 18.2 m to 31.5 m:

```jsx
<DamModel
  sensorValue={currentLevelMeters}
  minSensor={18.2}
  maxSensor={31.5}
  unit="m"
/>
```

The component converts the real measurement into a 0–100% visual reservoir level.

## Non-React / existing system API

The demo app exposes:

```js
window.damModel.setWaterLevel(72)
```

Sensor-style input:

```js
window.damModel.setWaterLevelFromSensor(26.4, 18.2, 31.5)
```

Read current state:

```js
window.damModel.getState()
// { waterLevel: 72 }
```

You can also dispatch an event:

```js
window.dispatchEvent(
  new CustomEvent('dam:set-water-level', {
    detail: { value: 64 }
  })
)
```

Listen for changes:

```js
window.addEventListener('dam:state-changed', (event) => {
  console.log(event.detail.waterLevel)
})
```

## iframe / embedded dashboard integration

Parent application -> dam iframe:

```js
damFrame.contentWindow.postMessage({
  type: 'DAM_SET_WATER_LEVEL',
  value: 75
}, '*')
```

For a sensor value:

```js
damFrame.contentWindow.postMessage({
  type: 'DAM_SET_SENSOR_LEVEL',
  value: 26.4,
  min: 18.2,
  max: 31.5
}, '*')
```

In production, replace `'*'` with your actual allowed origin.

## Query-string startup value

You can start the demo at a particular value:

```text
http://localhost:5173/?waterLevel=55
```

## Files that matter

- `src/DamModel.jsx` — reusable visualization component.
- `src/App.jsx` — demo + browser/iframe integration bridge.
- `public/dam-smooth.png` — the smooth low-poly artwork.
- `public/dry-basin.png` — generated exposed reservoir bed.
- `public/masks/` — precomputed water silhouettes in 5% steps; adjacent masks are cross-faded so continuous sensor values still look smooth.

## Important implementation note

This is a **visual level representation**, not a hydraulic simulation. Your system remains the source of truth for the actual water-level measurement. Feed the validated sensor/SCADA/API value into `DamModel` and the visualization will follow it.
