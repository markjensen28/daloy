import { useState } from 'react'
import DamScene from './components/DamScene'

export default function App() {
  const [waterLevel, setWaterLevel] = useState(72)

  return (
    <main className="app-shell">
      <section className="scene-card">
        <div className="scene-header">
          <div>
            <p className="eyebrow">WATER RESOURCE MODEL</p>
            <h1>Reservoir & Dam</h1>
          </div>

          <div className="water-stat">
            <span>Reservoir level</span>
            <strong>{waterLevel}%</strong>
          </div>
        </div>

        <div className="scene-wrap">
          <DamScene waterLevel={waterLevel} />
        </div>

        <div className="control-row">
          <label htmlFor="waterLevel">Water level</label>
          <input
            id="waterLevel"
            type="range"
            min="15"
            max="100"
            value={waterLevel}
            onChange={(event) => setWaterLevel(Number(event.target.value))}
          />
          <span>{waterLevel}%</span>
        </div>
      </section>
    </main>
  )
}
