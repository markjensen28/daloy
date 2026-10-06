import React from 'react'

const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0))
const mask=(n)=>`/masks/water-${String(n).padStart(3,'0')}.png`

export default function DamModel({waterLevel=100,showReadout=true}){
 const level=clamp(waterLevel,0,100)
 const low=Math.floor(level/5)*5
 const high=Math.min(100,low+5)
 const mix=(level-low)/5
 const flow=level/100

 const styleLow={WebkitMaskImage:`url(${mask(low)})`,maskImage:`url(${mask(low)})`,opacity:1-mix}
 const styleHigh={WebkitMaskImage:`url(${mask(high)})`,maskImage:`url(${mask(high)})`,opacity:mix}

 return <section className="dam-model" data-level={level}>
   <img className="dam-base" src="/dam-smooth.png" />
   <img className="dry-basin" src="/dry-basin.png" />

   <div className="water-copy" style={styleLow}><img src="/dam-smooth.png"/></div>
   <div className="water-copy" style={styleHigh}><img src="/dam-smooth.png"/></div>

   {/* The illustration includes a full river. Fade that baked-in water out before
       adding the level-driven downstream effects, so both sides stay in sync. */}
   <div className="downstream-dryout" style={{opacity:1-flow}} aria-hidden="true"></div>

   {showReadout && <div className="level-readout"><span>Reservoir</span><strong>{Math.round(level)} %</strong><small>System water level</small></div>}
 </section>
}
