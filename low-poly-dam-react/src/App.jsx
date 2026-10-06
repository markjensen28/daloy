import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const WHITE = '#f5f5f7'
const ROCK = '#dfe1e7'
const ROCK_DARK = '#c7cad2'
const ROCK_SHADOW = '#afb4bf'
const WATER = '#25d5de'
const WATER_LIGHT = '#7df7f8'
const WATER_DARK = '#11b9c6'
const TREE = '#214b3f'
const TREE_LIGHT = '#376859'
const TRUNK = '#605a50'
const DAM = '#ececf0'
const DAM_EDGE = '#d5d7dd'
const DAM_DARK = '#b7bcc7'

function seededRandom(seed) {
  let s = seed >>> 0
  return () => {
    s += 0x6D2B79F5
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function LowPolyRock({ position, scale, color = ROCK, rotation = [0, 0, 0], detail = 1 }) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <icosahedronGeometry args={[1, detail]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0} flatShading />
    </mesh>
  )
}

function PineTree({ position, scale = 1, rotation = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.055, 0.07, 0.42, 6]} />
        <meshStandardMaterial color={TRUNK} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.31, 0.67, 5]} />
        <meshStandardMaterial color={TREE} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.22, 0.5, 5]} />
        <meshStandardMaterial color={TREE_LIGHT} roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

function FacetedWaterGrid({ width = 6, depth = 4.3, y = 1.84, x = 0, z = -2.25, cols = 12, rows = 9 }) {
  const geometry = useMemo(() => {
    const rand = seededRandom(12)
    const positions = []
    const colors = []
    const palette = [
      new THREE.Color('#16cbd6'),
      new THREE.Color('#24d7df'),
      new THREE.Color('#48e3e6'),
      new THREE.Color('#35c8d2'),
      new THREE.Color('#65e8eb'),
    ]

    const pushTri = (a, b, c, color) => {
      positions.push(...a, ...b, ...c)
      for (let i = 0; i < 3; i++) colors.push(color.r, color.g, color.b)
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = -width / 2 + (c / cols) * width
        const x1 = -width / 2 + ((c + 1) / cols) * width
        const z0 = -depth / 2 + (r / rows) * depth
        const z1 = -depth / 2 + ((r + 1) / rows) * depth
        const j = () => (rand() - 0.5) * 0.04
        const a = [x0, j(), z0]
        const b = [x1, j(), z0]
        const c1 = [x1, j(), z1]
        const d = [x0, j(), z1]
        const cA = palette[Math.floor(rand() * palette.length)]
        const cB = palette[Math.floor(rand() * palette.length)]
        if ((r + c) % 2 === 0) {
          pushTri(a, b, c1, cA)
          pushTri(a, c1, d, cB)
        } else {
          pushTri(a, b, d, cA)
          pushTri(b, c1, d, cB)
        }
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [width, depth, cols, rows])

  return (
    <mesh geometry={geometry} position={[x, y, z]} receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.18}
        metalness={0.02}
        transparent
        opacity={0.96}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function RiverWater() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-1.65, 0.15)
    shape.lineTo(1.55, 0.0)
    shape.lineTo(2.35, 1.75)
    shape.lineTo(2.85, 4.35)
    shape.lineTo(0.85, 4.8)
    shape.lineTo(-1.8, 3.55)
    shape.lineTo(-2.0, 1.45)
    shape.closePath()
    return new THREE.ShapeGeometry(shape, 4)
  }, [])

  return (
    <group position={[0.35, 0.05, 0.2]} rotation={[-Math.PI / 2, 0, -0.12]}>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color={WATER} roughness={0.2} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry} position={[0, 0, 0.012]}>
        <meshBasicMaterial color={WATER_LIGHT} transparent opacity={0.2} wireframe />
      </mesh>
    </group>
  )
}

function DamBody() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-3.35, 0)
    shape.lineTo(3.35, 0)
    shape.lineTo(3.18, 2.28)
    shape.lineTo(-3.18, 2.28)
    shape.closePath()
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.48,
      bevelEnabled: false,
      steps: 1,
    })
    g.translate(0, 0, -0.24)
    return g
  }, [])

  return (
    <group position={[0, 0.35, -0.1]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={DAM} roughness={0.88} flatShading />
      </mesh>

      {/* top cap */}
      <mesh position={[0, 2.28, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[6.9, 0.14, 0.7]} />
        <meshStandardMaterial color="#fafafa" roughness={0.75} flatShading />
      </mesh>

      {/* angular end wings */}
      <LowPolyRock position={[-3.4, 1.08, -0.06]} scale={[0.65, 1.15, 0.65]} color={DAM_EDGE} rotation={[0.05, 0.2, 0.04]} detail={0} />
      <LowPolyRock position={[3.4, 1.08, -0.06]} scale={[0.65, 1.15, 0.65]} color={DAM_EDGE} rotation={[0.08, -0.15, -0.05]} detail={0} />

      {/* three dark gates */}
      {[-1.25, 0, 1.25].map((gx) => (
        <mesh key={`gate-${gx}`} position={[gx, 1.49, 0.255]} castShadow>
          <boxGeometry args={[0.62, 0.9, 0.06]} />
          <meshStandardMaterial color="#455b62" roughness={0.9} flatShading />
        </mesh>
      ))}

      {/* concrete piers */}
      {[-1.88, -0.63, 0.63, 1.88].map((px) => (
        <mesh key={`pier-${px}`} position={[px, 0.93, 0.43]} rotation={[-0.03, 0, px < 0 ? -0.11 : 0.11]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 1.85, 0.6]} />
          <meshStandardMaterial color={DAM_EDGE} roughness={0.9} flatShading />
        </mesh>
      ))}

      {/* lower base lip */}
      <mesh position={[0, 0.07, 0.31]} castShadow receiveShadow>
        <boxGeometry args={[6.15, 0.16, 0.7]} />
        <meshStandardMaterial color={DAM_DARK} roughness={0.95} flatShading />
      </mesh>
    </group>
  )
}

function Waterfall({ x }) {
  const ref = useRef()
  const phase = x * 1.7

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.material.opacity = 0.74 + Math.sin(t * 2.6 + phase) * 0.06
  })

  const geom = useMemo(() => {
    const w = 0.56
    const h = 1.45
    const cols = 4
    const rows = 10
    const positions = []
    const uvs = []
    const indices = []

    for (let r = 0; r <= rows; r++) {
      const v = r / rows
      for (let c = 0; c <= cols; c++) {
        const u = c / cols
        const xx = (u - 0.5) * w
        const yy = h / 2 - v * h
        const zz = Math.sin(v * Math.PI * 2.2 + u * 2.1) * 0.035 + v * 0.18
        positions.push(xx, yy, zz)
        uvs.push(u, v)
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * (cols + 1) + c
        const a = i
        const b = i + 1
        const d = i + (cols + 1)
        const cc = d + 1
        indices.push(a, b, d, b, cc, d)
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    g.setIndex(indices)
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <group position={[x, 1.22, 0.57]}>
      <mesh ref={ref} geometry={geom} castShadow>
        <meshPhysicalMaterial
          color={WATER_LIGHT}
          transparent
          opacity={0.78}
          roughness={0.12}
          transmission={0.05}
          thickness={0.08}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>
      <mesh position={[0, -0.71, 0.16]} scale={[1.05, 0.22, 0.32]}>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial color="#ddffff" transparent opacity={0.78} roughness={0.25} flatShading />
      </mesh>
    </group>
  )
}

function FoamCluster() {
  const bubbles = useMemo(() => {
    const rand = seededRandom(73)
    return Array.from({ length: 34 }, (_, i) => ({
      key: i,
      p: [
        -1.55 + rand() * 3.2,
        0.2 + rand() * 0.25,
        0.9 + rand() * 1.55,
      ],
      s: 0.08 + rand() * 0.18,
    }))
  }, [])

  return bubbles.map((b) => (
    <mesh key={b.key} position={b.p} scale={b.s} castShadow>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#edffff" transparent opacity={0.9} roughness={0.35} flatShading />
    </mesh>
  ))
}

function Terrain() {
  return (
    <group>
      {/* floating base */}
      <LowPolyRock position={[0, -1.45, -0.3]} scale={[5.55, 2.0, 4.65]} color={ROCK_DARK} rotation={[0.02, 0.1, 0.02]} detail={1} />
      <LowPolyRock position={[-3.4, -0.45, 0.8]} scale={[2.7, 1.5, 2.35]} color={ROCK} rotation={[0.05, 0.2, -0.08]} detail={1} />
      <LowPolyRock position={[3.35, -0.38, 0.75]} scale={[2.55, 1.45, 2.25]} color={ROCK} rotation={[-0.04, -0.15, 0.06]} detail={1} />

      {/* back mountain ring */}
      <LowPolyRock position={[-3.75, 1.38, -2.7]} scale={[1.75, 1.45, 1.35]} color={WHITE} rotation={[0.03, 0.15, 0.08]} />
      <LowPolyRock position={[-2.35, 1.72, -4.3]} scale={[1.55, 1.55, 1.2]} color={ROCK} rotation={[0.1, -0.22, 0.03]} />
      <LowPolyRock position={[-0.75, 2.05, -4.72]} scale={[1.65, 1.75, 1.3]} color={ROCK} rotation={[0.05, 0.05, -0.03]} />
      <LowPolyRock position={[1.0, 1.9, -4.55]} scale={[1.55, 1.55, 1.25]} color={ROCK} rotation={[-0.02, 0.18, 0.03]} />
      <LowPolyRock position={[2.7, 1.6, -4.12]} scale={[1.6, 1.45, 1.25]} color={WHITE} rotation={[0.08, -0.1, -0.05]} />
      <LowPolyRock position={[4.05, 1.33, -2.82]} scale={[1.85, 1.6, 1.4]} color={ROCK} rotation={[0.02, -0.28, 0.02]} />
      <LowPolyRock position={[4.45, 0.92, -1.18]} scale={[1.75, 1.35, 1.6]} color={WHITE} rotation={[0.06, -0.08, 0.02]} />

      {/* side foreground rock faces */}
      <LowPolyRock position={[-4.05, 0.62, -0.25]} scale={[1.8, 1.55, 1.4]} color={WHITE} rotation={[0.04, 0.2, 0.04]} />
      <LowPolyRock position={[-4.55, -0.15, 1.55]} scale={[1.85, 1.35, 1.55]} color={ROCK_DARK} rotation={[0.02, 0.18, -0.08]} />
      <LowPolyRock position={[4.25, 0.38, 1.45]} scale={[1.9, 1.35, 1.45]} color={ROCK} rotation={[-0.04, -0.2, 0.02]} />
      <LowPolyRock position={[3.55, -0.3, 2.8]} scale={[1.9, 1.25, 1.7]} color={ROCK_DARK} rotation={[0.08, -0.12, 0.05]} />

      {/* angular shoreline shelves */}
      <LowPolyRock position={[-2.55, 1.32, -1.95]} scale={[1.0, 0.55, 0.9]} color="#f8f8fa" detail={0} />
      <LowPolyRock position={[2.55, 1.32, -2.0]} scale={[1.0, 0.55, 0.9]} color="#f8f8fa" detail={0} />
    </group>
  )
}

function Trees() {
  const specs = [
    [-4.0, 1.65, -2.6, 0.8, 0.4],
    [-3.25, 1.48, -1.45, 0.9, -0.2],
    [-2.6, 1.42, -0.55, 0.85, 0.5],
    [-4.15, 0.88, 0.05, 0.82, -0.5],
    [-2.85, 0.7, 1.85, 0.82, 0.3],
    [-1.25, 2.52, -4.45, 0.65, 0.1],
    [-3.4, 2.12, -4.0, 0.62, -0.2],
    [3.42, 2.05, -3.45, 0.7, 0.25],
    [4.28, 1.25, -1.6, 0.72, -0.4],
    [4.18, 0.78, 0.55, 0.95, 0.2],
    [3.45, 0.58, 1.7, 0.84, 0.35],
    [2.85, 0.2, 2.6, 0.66, -0.1],
  ]
  return specs.map(([x, y, z, s, r], i) => <PineTree key={i} position={[x, y, z]} scale={s} rotation={r} />)
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.25} />
      <hemisphereLight skyColor="#ffffff" groundColor="#bbc1ca" intensity={1.1} />
      <directionalLight
        castShadow
        position={[-4, 10, 8]}
        intensity={2.15}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      <group position={[0, -0.1, 0]} rotation={[0, -0.03, 0]}>
        <Terrain />
        <FacetedWaterGrid />
        <RiverWater />
        <DamBody />
        <Waterfall x={-1.25} />
        <Waterfall x={0} />
        <Waterfall x={1.25} />
        <FoamCluster />
        <Trees />
      </group>

      <ContactShadows position={[0, -2.72, 0]} opacity={0.24} scale={13} blur={2.7} far={7} />
    </>
  )
}

export default function App() {
  return (
    <main className="scene-shell">
      <Canvas
        shadows
        dpr={[1, 2]}
        orthographic
        camera={{ position: [8.3, 6.4, 9.6], zoom: 76, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.12
        }}
      >
        <Scene />
        <OrbitControls
          makeDefault
          target={[0, 0.4, -0.65]}
          enablePan={false}
          minZoom={58}
          maxZoom={105}
          minPolarAngle={0.65}
          maxPolarAngle={1.28}
          minAzimuthAngle={-0.95}
          maxAzimuthAngle={0.95}
        />
      </Canvas>
      <div className="scene-hint">Drag to rotate · Scroll to zoom</div>
    </main>
  )
}
