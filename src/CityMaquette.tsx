import { Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const palette = {
  model: "#e8e8e5",
  modelDark: "#d4d4d1",
  road: "#c9c9c6",
  water: "#58c7cf",
  treatment: "#41989b",
  homes: "#249f9a",
  agriculture: "#5e9a55",
  business: "#df9a35",
  critical: "#6673d3",
};

type SectorName = string;
type SectorDatum = { name: SectorName; value: number; allocation: number; coverage: number; color: string };
const sectorRoles: Record<SectorName, string> = {
  Households: "Homes and residential demand",
  "Agriculture + fisheries": "Farm plots and fisheries",
  "Business + tourism": "Shops, lodging, and local business",
  "Critical services": "Schools, health, and civic facilities",
};
const statusColor = (coverage: number, color: string) => coverage >= .999 ? color : coverage >= .5 ? "#e2b13c" : "#d95757";

type Layout = {
  reservoir: [number, number];
  treatment: [number, number];
  homes: [number, number];
  farm: [number, number];
  homeSpacing: number;
  school: [number, number];
  government: [number, number];
  commercial: [number, number];
  clinic: [number, number];
  streetZ: number;
  streetX: number;
};

const layouts: Record<string, Layout> = {
  catbalogan: {
    reservoir: [-4.15, -3.25], treatment: [-.2, -2.25], homes: [-3.9, .1], farm: [4.65, -2.9], homeSpacing: .88,
    school: [3.2, -2.15], government: [1.55, 1.45], commercial: [4.65, .8], clinic: [3.75, 3.15], streetZ: .15, streetX: 1.2,
  },
  pinabacdao: {
    reservoir: [-4.8, -2.75], treatment: [-1.45, -1.65], homes: [-4.35, .85], farm: [4.55, -2.65], homeSpacing: .72,
    school: [3.5, -1.55], government: [.75, 1.15], commercial: [4.6, 2.1], clinic: [2.6, 3.05], streetZ: -.35, streetX: .45,
  },
  calbayog: {
    reservoir: [-4.65, -3.2], treatment: [-.75, -2.55], homes: [-4.45, .95], farm: [4.45, -2.8], homeSpacing: .94,
    school: [2.7, -2.55], government: [1.35, 1.15], commercial: [4.75, .05], clinic: [3.6, 3.2], streetZ: .55, streetX: 1.75,
  },
};

function Box({ position, size, color = palette.model, rotation, highlighted = false, onClick, onHover }: {
  position: [number, number, number]; size: [number, number, number]; color?: string;
  rotation?: [number, number, number]; highlighted?: boolean; onClick?: () => void; onHover?: (active: boolean) => void;
}) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onClick?.(); }} onPointerEnter={(e) => { e.stopPropagation(); onHover?.(true); }} onPointerLeave={() => onHover?.(false)}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} emissive={highlighted ? color : "#000000"} emissiveIntensity={highlighted ? .18 : 0} roughness={0.92} flatShading />
  </mesh>;
}

function House({ x, z, accent, highlighted = false, onClick, onHover }: { x: number; z: number; accent?: string; highlighted?: boolean; onClick?: () => void; onHover?: (active: boolean) => void }) {
  const wall = accent || palette.model;
  return <group position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); onClick?.(); }} onPointerEnter={(e) => { e.stopPropagation(); onHover?.(true); }} onPointerLeave={() => onHover?.(false)}>
    <Box position={[0, .24, 0]} size={[.55, .44, .48]} color={wall} highlighted={highlighted} onClick={onClick} onHover={onHover} />
    <mesh position={[0, .53, 0]} rotation={[0, Math.PI / 4, 0]} castShadow onClick={(e) => { e.stopPropagation(); onClick?.(); }} onPointerEnter={(e) => { e.stopPropagation(); onHover?.(true); }} onPointerLeave={() => onHover?.(false)}>
      <coneGeometry args={[.46, .3, 4]} /><meshStandardMaterial color={accent || palette.modelDark} emissive={highlighted ? accent || palette.modelDark : "#000000"} emissiveIntensity={highlighted ? .18 : 0} flatShading />
    </mesh>
  </group>;
}

function Building({ x, z, h = 1.1, color = palette.model, highlighted = false, onClick, onHover }: { x: number; z: number; h?: number; color?: string; highlighted?: boolean; onClick?: () => void; onHover?: (active: boolean) => void }) {
  return <group position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); onClick?.(); }} onPointerEnter={(e) => { e.stopPropagation(); onHover?.(true); }} onPointerLeave={() => onHover?.(false)}>
    <Box position={[0, h / 2, 0]} size={[.72, h, .65]} color={color} highlighted={highlighted} onClick={onClick} onHover={onHover} />
    {[.18, .48, .78].filter(y => y < h).map((y) => <Box key={y} position={[0, y, .332]} size={[.42, .08, .016]} color={color === palette.model ? "#f7f7f4" : "#ffffff"} />)}
  </group>;
}

function Tree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return <group position={[x, 0, z]} scale={s}>
    <mesh position={[0, .2, 0]}><cylinderGeometry args={[.035, .045, .4, 6]} /><meshStandardMaterial color="#bcbcb7" /></mesh>
    <mesh position={[0, .58, 0]} castShadow><coneGeometry args={[.22, .68, 7]} /><meshStandardMaterial color="#d1d1cd" flatShading /></mesh>
  </group>;
}

function Camera() {
  const { camera, size } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.position.set(10, 10, 12);
      camera.zoom = Math.min(size.width / 16, size.height / 10.2);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.height, size.width]);
  return null;
}

function DistributionLeak({ position, rate }: { position: [number, number, number]; rate: number }) {
  const droplets = useRef<THREE.Group>(null);
  const severity = Math.max(0, Math.min(1, rate / 60));
  useFrame(({ clock }) => {
    const group = droplets.current;
    if (!group) return;
    group.visible = rate > 1;
    group.scale.setScalar(.45 + severity * .8);
    group.children.forEach((drop, index) => {
      const phase = (clock.elapsedTime * .85 + index / 3) % 1;
      drop.position.y = .42 - phase * (.18 + severity * .55);
      drop.scale.setScalar(.65 + severity * .55);
    });
  });
  return <group position={position}>
    <mesh position={[0,.07,0]} rotation={[-Math.PI/2,0,0]} scale={[.6 + severity * 1.1, .6 + severity * 1.1, 1]}>
      <ringGeometry args={[.08,.2,8]} /><meshBasicMaterial color="#dfa23d" transparent opacity={severity * (.28 + severity * .48)} side={THREE.DoubleSide} />
    </mesh>
    <group ref={droplets}>
      {[0,1,2].map((index) => <mesh key={index} position={[index % 2 ? .055 : -.045,.35,0]}>
        <sphereGeometry args={[.055,6,5]} /><meshStandardMaterial color="#39c2cd" emissive="#1ba8b4" emissiveIntensity={.2} roughness={.22} />
      </mesh>)}
    </group>
  </group>;
}

function Model({ layout, sectors, focusedSector, onSectorHover, onSelectSector, nrw }: {
  layout: Layout;
  sectors: SectorDatum[];
  focusedSector: string | null;
  onSectorHover: (name: string | null) => void;
  onSelectSector: (name: string) => void;
  nrw: number;
}) {
  const [hovered, setHovered] = useState<SectorName | null>(null);
  const hoveredSector = sectors.find((sector) => sector.name === hovered);
  const sector = (name: SectorName) => sectors.find((item) => item.name === name);
  // The selected sector keeps its live coverage color while the other sectors
  // fade back, making the relationship between a card and its buildings clear.
  const color = (name: SectorName) => {
    const item = sector(name);
    if (!item) return palette.model;
    if (focusedSector && focusedSector !== name) return "#d8ddda";
    return statusColor(item.coverage, item.color);
  };
  const isFocused = (name: SectorName) => focusedSector === name;
  const setSectorHover = (name: SectorName) => (active: boolean) => {
    setHovered(active ? name : null);
    onSectorHover(active ? name : null);
  };
  const selectSector = (name: SectorName) => () => onSelectSector(name);
  const houses = useMemo(() => Array.from({ length: 29 }, (_, i) => ({
    x: layout.homes[0] + (i % 7) * layout.homeSpacing + (Math.floor(i / 7) % 2) * .15,
    z: layout.homes[1] + Math.floor(i / 7) * .82,
  })), [layout]);
  const generic = useMemo(() => Array.from({ length: 19 }, (_, i) => ({
    x: -2.5 + (i % 6) * 1.05,
    z: -2.75 + Math.floor(i / 6) * .75,
    h: .45 + (i % 3) * .18,
  })), []);
  const trees = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    x: -6 + (i * 2.13) % 12,
    z: -4.1 + (i * 1.71) % 8.1,
    s: .72 + (i % 4) * .12,
  })), []);
  return <>
    <Camera />
    <color attach="background" args={["#f5f5f2"]} />
    <ambientLight intensity={2.2} />
    <directionalLight position={[-6, 12, 7]} intensity={2.8} castShadow shadow-mapSize={[1024, 1024]} />
    <group position={[0, -.85, 0]}>
      <Box position={[0, -.22, 0]} size={[13.4, .42, 9.5]} color="#dededb" />
      <Box position={[0, .01, 0]} size={[13.2, .08, 9.3]} color="#efefec" />

      {/* Low-poly mountain backdrop */}
      {[-5.8,-4.7,-3.6,-2.4,-1.1,.2,1.5,2.8,4.1,5.4].map((x, i) => <mesh key={x} position={[x, .75 + (i % 3) * .18, -4.05]} castShadow>
        <coneGeometry args={[1.25 + (i % 2) * .3, 1.8 + (i % 3) * .42, 5]} />
        <meshStandardMaterial color={i % 2 ? "#d8d8d5" : "#e1e1de"} flatShading />
      </mesh>)}

      {/* Reservoir carved into terrain */}
      <mesh position={[layout.reservoir[0], .1, layout.reservoir[1]]} rotation={[-Math.PI / 2, 0, .12]}>
        <circleGeometry args={[1.2, 10]} /><meshStandardMaterial color={palette.water} roughness={.25} />
      </mesh>
      <Box position={[layout.reservoir[0] + .95, .24, layout.reservoir[1] + .27]} size={[1.3, .35, .18]} color="#c8c8c5" rotation={[0, -.18, 0]} />

      {/* Roads */}
      <Box position={[0, .09, layout.streetZ]} size={[12.2, .06, .42]} color={palette.road} />
      <Box position={[layout.streetX, .095, -.8]} size={[.42, .06, 7.25]} color={palette.road} rotation={[0, .08, 0]} />
      <Box position={[-2.8, .095, .8]} size={[.35, .06, 6.2]} color={palette.road} rotation={[0, -.23, 0]} />
      <Box position={[4.3, .095, 1.5]} size={[.35, .06, 5.6]} color={palette.road} rotation={[0, .18, 0]} />

      {/* Treatment plant and tanks */}
      <group position={[layout.treatment[0], 0, layout.treatment[1]]}>
        {[0,.7,1.4,2.1].map((x, i) => <group key={x} position={[x,0, i % 2 ? .2 : -.12]}>
          <mesh position={[0,.5,0]} castShadow><cylinderGeometry args={[.28,.32,.9,12]} /><meshStandardMaterial color={i === 1 ? palette.treatment : "#d7d7d4"} flatShading /></mesh>
          <mesh position={[0,.97,0]}><cylinderGeometry args={[.31,.31,.06,12]} /><meshStandardMaterial color="#eef5fb" /></mesh>
        </group>)}
      </group>

      {/* Pipeline from reservoir through plant into city */}
      <Line points={[[layout.reservoir[0] + .8,.3,layout.reservoir[1] + .15],[layout.treatment[0] - .8,.3,layout.treatment[1] - .4],[layout.treatment[0],.3,layout.treatment[1]],[layout.streetX,.3,-1],[layout.streetX,.3,layout.streetZ],[3.8,.3,2.1]]} color={palette.water} lineWidth={4} />
      {/* A simplified distribution branch makes NRW visible in the town model. */}
      <Line points={[[layout.streetX,.32,layout.streetZ],[layout.streetX - .45,.32,1.25],[layout.streetX - .95,.32,1.85],[2.65,.32,1.85]]} color={palette.water} lineWidth={3} />
      <DistributionLeak position={[layout.streetX - .95,.32,1.85]} rate={nrw} />

      {generic.map((b, i) => <Building key={i} {...b} />)}
      {houses.map((h, i) => <House key={i} {...h} accent={color("Households")} highlighted={isFocused("Households")} onClick={selectSector("Households")} onHover={setSectorHover("Households")} />)}

      {/* Farm plots and fish ponds represent the agriculture and fisheries channel. */}
      <group position={[layout.farm[0], 0, layout.farm[1]]}>
        <Box position={[0,.11,0]} size={[2.15,.16,1.55]} color="#b9c7a3" highlighted={isFocused("Agriculture + fisheries")} onClick={selectSector("Agriculture + fisheries")} onHover={setSectorHover("Agriculture + fisheries")} />
        {[-.5,-.15,.2,.55].map((z) => <Box key={z} position={[0,.205,z]} size={[1.9,.035,.075]} color={color("Agriculture + fisheries")} highlighted={isFocused("Agriculture + fisheries")} onClick={selectSector("Agriculture + fisheries")} onHover={setSectorHover("Agriculture + fisheries")} />)}
        <mesh position={[.72,.19,.48]} rotation={[-Math.PI/2,0,0]} onClick={selectSector("Agriculture + fisheries")} onPointerEnter={() => setSectorHover("Agriculture + fisheries")(true)} onPointerLeave={() => setSectorHover("Agriculture + fisheries")(false)}>
          <circleGeometry args={[.28,8]} /><meshStandardMaterial color={palette.water} />
        </mesh>
      </group>

      {/* School campus */}
      <group position={[layout.school[0],0,layout.school[1]]}>
        <Box position={[0,.48,0]} size={[1.45,.88,.75]} color={color("Critical services")} highlighted={isFocused("Critical services")} onClick={selectSector("Critical services")} onHover={setSectorHover("Critical services")} />
        <Box position={[0,.95,0]} size={[1.58,.1,.86]} color={color("Critical services")} highlighted={isFocused("Critical services")} onClick={selectSector("Critical services")} onHover={setSectorHover("Critical services")} />
        <Box position={[.95,.08,.2]} size={[.9,.035,1.4]} color="#d8ded5" />
      </group>

      {/* City hall */}
      <group position={[layout.government[0],0,layout.government[1]]}>
        <Box position={[0,.42,0]} size={[1.45,.65,.8]} color={color("Critical services")} highlighted={isFocused("Critical services")} onClick={selectSector("Critical services")} onHover={setSectorHover("Critical services")} />
        {[-.48,-.16,.16,.48].map(x => <Box key={x} position={[x,.42,.43]} size={[.11,.72,.11]} color={color("Critical services")} highlighted={isFocused("Critical services")} onClick={selectSector("Critical services")} onHover={setSectorHover("Critical services")} />)}
      </group>

      {/* Commercial towers */}
      <group>
        <Building x={layout.commercial[0]} z={layout.commercial[1]} h={1.65} color={color("Business + tourism")} highlighted={isFocused("Business + tourism")} onClick={selectSector("Business + tourism")} onHover={setSectorHover("Business + tourism")} />
        <Building x={layout.commercial[0] + .77} z={layout.commercial[1] + .35} h={1.22} color={color("Business + tourism")} highlighted={isFocused("Business + tourism")} onClick={selectSector("Business + tourism")} onHover={setSectorHover("Business + tourism")} />
      </group>

      {/* Clinic */}
      <group position={[layout.clinic[0],0,layout.clinic[1]]}>
        <Box position={[0,.42,0]} size={[1.05,.76,.72]} color={color("Critical services")} highlighted={isFocused("Critical services")} onClick={selectSector("Critical services")} onHover={setSectorHover("Critical services")} />
        <Box position={[0,.85,0]} size={[1.15,.12,.82]} color={color("Critical services")} highlighted={isFocused("Critical services")} onClick={selectSector("Critical services")} onHover={setSectorHover("Critical services")} />
        <Box position={[0,.48,.37]} size={[.32,.09,.025]} color="white" onClick={selectSector("Critical services")} onHover={setSectorHover("Critical services")} />
        <Box position={[0,.48,.37]} size={[.09,.32,.025]} color="white" onClick={selectSector("Critical services")} onHover={setSectorHover("Critical services")} />
      </group>

      {trees.map((t, i) => <Tree key={i} {...t} />)}
      {hoveredSector && <Html position={[0, 3.15, .3]} center style={{ pointerEvents: "none" }}>
        <div className="maquette-tooltip" style={{ "--tooltip": color(hoveredSector.name) } as CSSProperties}>
          <strong>{hoveredSector.name}</strong><span>{sectorRoles[hoveredSector.name]}</span><b>{hoveredSector.allocation.toLocaleString("en-US", { maximumFractionDigits: 1 })} / {hoveredSector.value.toLocaleString("en-US", { maximumFractionDigits: 1 })} ML/day</b><span>{Math.round(hoveredSector.coverage * 100)}% demand covered</span>
        </div>
      </Html>}
    </group>
    <ContactShadows position={[0,-1.04,0]} opacity={.32} scale={18} blur={2.8} far={6} />
    <OrbitControls makeDefault enablePan={false} enableDamping minZoom={30} maxZoom={92} minPolarAngle={.35} maxPolarAngle={1.28} target={[0,0,-.2]} />
  </>;
}

export default function CityMaquette({ municipality, drought = 0, nrw = 28, sectors, focusedSector, onSectorHover, onSelectSector }: {
  municipality: string;
  drought?: number;
  nrw?: number;
  sectors: SectorDatum[];
  focusedSector: string | null;
  onSectorHover: (name: string | null) => void;
  onSelectSector: (name: string) => void;
}) {
  const layoutKey = municipality.toLowerCase().replace(/\s+city$/, "");
  const layout = layouts[layoutKey] || layouts.calbayog;
  return <div className="maquette-wrap">
    <Canvas orthographic shadows dpr={[1, 1.5]} camera={{ position: [10,10,12], zoom: 52 }} aria-label={`Interactive low-poly water planning model for ${municipality}. Drag to rotate and scroll to zoom. Current NRW assumption: ${nrw} percent. ${drought ? `${drought} percent supply reduction.` : "Baseline scenario."}`}>
      <Suspense fallback={null}><Model layout={layout} sectors={sectors} focusedSector={focusedSector} onSectorHover={onSectorHover} onSelectSector={onSelectSector} nrw={nrw} /></Suspense>
    </Canvas>
  </div>;
}
