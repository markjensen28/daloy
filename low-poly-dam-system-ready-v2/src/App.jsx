import React, { useEffect, useRef, useState } from 'react'
import DamModel from './DamModel.jsx'

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0))

export default function App() {
  const [waterLevel, setWaterLevel] = useState(() => {
    const query = new URLSearchParams(window.location.search)
    return clamp(query.get('waterLevel') ?? 100)
  })
  const levelRef = useRef(waterLevel)

  useEffect(() => {
    levelRef.current = waterLevel
  }, [waterLevel])

  useEffect(() => {
    const setLevel = (value) => setWaterLevel(clamp(value))
    const setFromSensor = (value, min, max) => {
      const lo = Number(min)
      const hi = Number(max)
      const current = Number(value)
      if (!Number.isFinite(current) || !Number.isFinite(lo) || !Number.isFinite(hi) || hi <= lo) return
      setLevel(((current - lo) / (hi - lo)) * 100)
    }

    const customEventHandler = (event) => setLevel(event.detail?.value ?? event.detail)
    const messageHandler = (event) => {
      const data = event.data
      if (!data || typeof data !== 'object') return
      if (data.type === 'DAM_SET_WATER_LEVEL') setLevel(data.value)
      if (data.type === 'DAM_SET_SENSOR_LEVEL') setFromSensor(data.value, data.min, data.max)
      if (data.type === 'DAM_GET_STATE') {
        event.source?.postMessage?.({ type: 'DAM_STATE', waterLevel: levelRef.current }, event.origin || '*')
      }
    }

    window.addEventListener('dam:set-water-level', customEventHandler)
    window.addEventListener('message', messageHandler)

    // Simple integration API for non-React systems.
    window.damModel = {
      setWaterLevel: setLevel,
      setWaterLevelFromSensor: setFromSensor,
      getState: () => ({ waterLevel: levelRef.current }),
    }

    return () => {
      window.removeEventListener('dam:set-water-level', customEventHandler)
      window.removeEventListener('message', messageHandler)
      delete window.damModel
    }
  }, [])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('dam:state-changed', { detail: { waterLevel } }))
  }, [waterLevel])

  return (
    <main className="app-shell">
      <div className="visual-wrap">
        <DamModel waterLevel={waterLevel} showReadout />
      </div>

      <aside className="demo-panel" aria-label="Demo water-level control">
        <div>
          <span>System demo</span>
          <strong>Water level control</strong>
        </div>
        <input
          aria-label="Water level"
          type="range"
          min="0"
          max="100"
          step="1"
          value={waterLevel}
          onChange={(event) => setWaterLevel(Number(event.target.value))}
        />
        <output>{Math.round(waterLevel)}%</output>
      </aside>
    </main>
  )
}
