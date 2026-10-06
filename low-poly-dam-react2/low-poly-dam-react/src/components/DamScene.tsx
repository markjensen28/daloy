import { OrbitControls, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface DamSceneProps {
  waterLevel: number
}

const TERRAIN = '#343b37'
const TERRAIN_TOP = '#596a55'
const CONCRETE = '#d7d4d0'
const CONCRETE_DARK = '#8d9092'
const WATER = '#3d78a6'
const WATER_SHALLOW = '#5aa7c9'

function LowPolyHill({
  position,
  scale = [1, 1, 1],
  color = TERRAIN_TOP,
}: {
  position: [number, number, number]
  scale?: [number, number, number]
  color?: string
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <coneGeometry args={[1, 1.8, 6]} />
      <meshStandardMaterial color={color} roughness={1} flatShading />
    </mesh>
  )
}

function Pine({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.055, 0.44, 6]} />
        <meshStandardMaterial color="#453d34" flatShading />
      </mesh>
      <mesh position={[0, 0.56, 0]} castShadow>
        <coneGeometry args={[0.22, 0.55, 7]} />
        <meshStandardMaterial color="#244833" flatShading roughness={1} />
      </mesh>
      <mesh position={[0, 0.83, 0]} castShadow>
        <coneGeometry args={[0.16, 0.45, 7]} />
        <meshStandardMaterial color="#2e5a3c" flatShading roughness={1} />
      </mesh>
    </group>
  )
}

function AnimatedWater({
  position,
  size,
  opacity = 0.85,
}: {
  position: [number, number, number]
  size: [number, number]
  opacity?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(size[0], size[1], 32, 32), [size])
  const original = useMemo(() => {
    const attr = geometry.attributes.position
    return Float32Array.from(attr.array as ArrayLike<number>)
  }, [geometry])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const attr = geometry.attributes.position as THREE.BufferAttribute
    const t = clock.getElapsedTime()

    for (let i = 0; i < attr.count; i += 1) {
      const baseX = original[i * 3]
      const baseY = original[i * 3 + 1]
      const wave =
        Math.sin(baseX * 1.65 + t * 0.85) * 0.028 +
        Math.cos(baseY * 1.35 + t * 0.7) * 0.018
      attr.setZ(i, wave)
    }

    attr.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      receiveShadow
    >
      <meshPhysicalMaterial
        color={WATER}
        transparent
        opacity={opacity}
        roughness={0.24}
        metalness={0.05}
        transmission={0.08}
        clearcoat={0.65}
        clearcoatRoughness={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function DamWall() {
  const segments = useMemo(() => {
    const count = 17
    const width = 0.56
    const radius = 6.7
    const spread = 1.12

    return Array.from({ length: count }, (_, index) => {
      const t = index / (count - 1)
      const angle = (t - 0.5) * spread
      const x = Math.sin(angle) * radius
      const z = 1.25 - Math.cos(angle) * 1.6
      const rotation = -angle
      const centerBias = 1 - Math.abs(t - 0.5) * 0.75
      const height = 2.75 + centerBias * 0.6

      return { x, z, rotation, height, width }
    })
  }, [])

  return (
    <group position={[0, 0.52, 0.25]}>
      {segments.map((segment, index) => (
        <RoundedBox
          key={index}
          args={[segment.width, segment.height, 0.5]}
          radius={0.05}
          smoothness={1}
          position={[segment.x, segment.height / 2, segment.z]}
          rotation={[0, segment.rotation, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={CONCRETE} roughness={0.88} />
        </RoundedBox>
      ))}

      <mesh position={[0, 3.78, -0.18]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 0.14, 0.36]} />
        <meshStandardMaterial color="#b7b7b4" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Spillways() {
  const lanes = [-0.74, 0, 0.74]

  return (
    <group position={[0, 0, -0.1]}>
      {lanes.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 2.0, 0.52]} rotation={[-0.42, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 2.8, 0.24]} />
            <meshStandardMaterial color={CONCRETE_DARK} roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.75, -0.15]} rotation={[-0.33, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 2.7, 0.18]} />
            <meshStandardMaterial color="#c4c5c4" roughness={0.94} />
          </mesh>
          <mesh position={[0, 0.94, -0.09]} rotation={[-0.33, 0, 0]}>
            <boxGeometry args={[0.26, 2.5, 0.035]} />
            <meshStandardMaterial color={WATER_SHALLOW} roughness={0.35} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.15, -1.35]} receiveShadow>
        <boxGeometry args={[3.25, 0.24, 1.65]} />
        <meshStandardMaterial color="#bfc0bf" roughness={0.95} />
      </mesh>
    </group>
  )
}

function IslandBase() {
  return (
    <group>
      <RoundedBox args={[10.4, 1.35, 8.4]} radius={0.18} smoothness={2} position={[0, -0.82, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={TERRAIN} roughness={1} flatShading />
      </RoundedBox>

      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[9.7, 0.32, 7.7]} />
        <meshStandardMaterial color="#4f5e4f" roughness={1} flatShading />
      </mesh>

      <LowPolyHill position={[-3.65, 0.72, 1.8]} scale={[1.45, 1.25, 1.45]} />
      <LowPolyHill position={[-3.35, 0.62, -2.15]} scale={[1.35, 1.15, 1.35]} color="#50634e" />
      <LowPolyHill position={[3.55, 0.68, 1.82]} scale={[1.45, 1.2, 1.45]} />
      <LowPolyHill position={[3.4, 0.54, -2.15]} scale={[1.25, 1.0, 1.25]} color="#50634e" />

      <mesh position={[0, 0.16, 2.46]} receiveShadow>
        <boxGeometry args={[7.2, 0.35, 2.15]} />
        <meshStandardMaterial color="#4b5c4c" roughness={1} flatShading />
      </mesh>

      <mesh position={[0, 0.08, -2.9]} receiveShadow>
        <boxGeometry args={[6.15, 0.18, 1.25]} />
        <meshStandardMaterial color="#465446" roughness={1} flatShading />
      </mesh>
    </group>
  )
}

function Trees() {
  const trees: Array<[number, number, number, number]> = [
    [-4.0, 0.75, 2.7, 1.05],
    [-3.4, 0.65, 2.95, 0.9],
    [-2.95, 0.55, 3.0, 0.72],
    [3.95, 0.7, 2.68, 1.0],
    [3.42, 0.58, 2.92, 0.82],
    [3.05, 0.52, 3.05, 0.68],
    [-4.05, 0.48, -2.42, 0.9],
    [-3.55, 0.38, -2.72, 0.75],
    [4.0, 0.48, -2.35, 0.9],
    [3.55, 0.4, -2.7, 0.72],
    [2.76, 0.38, 1.95, 0.75],
    [-2.8, 0.38, 1.95, 0.75],
  ]

  return (
    <group>
      {trees.map(([x, y, z, scale], index) => (
        <Pine key={index} position={[x, y, z]} scale={scale} />
      ))}
    </group>
  )
}

function DamModel({ waterLevel }: DamSceneProps) {
  const reservoirY = 0.55 + (waterLevel / 100) * 1.45
  const waterScaleZ = 2.9 + (waterLevel / 100) * 0.35

  return (
    <group rotation={[0, -0.08, 0]}>
      <IslandBase />

      <AnimatedWater position={[0, reservoirY, 2.02]} size={[6.7, waterScaleZ]} opacity={0.86} />
      <AnimatedWater position={[0, 0.32, -2.45]} size={[5.5, 1.8]} opacity={0.8} />

      <DamWall />
      <Spillways />
      <Trees />
    </group>
  )
}

export default function DamScene({ waterLevel }: DamSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [9.2, 7.4, 10.7], fov: 34, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#f5f3f8']} />
      <fog attach="fog" args={['#f5f3f8', 16, 28]} />

      <ambientLight intensity={1.2} />
      <hemisphereLight args={['#ffffff', '#6c6a78', 1.35]} />
      <directionalLight
        castShadow
        position={[6, 10, 7]}
        intensity={2.3}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <DamModel waterLevel={waterLevel} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={10}
        maxDistance={20}
        minPolarAngle={0.72}
        maxPolarAngle={1.35}
        target={[0, 0.65, 0.2]}
      />
    </Canvas>
  )
}
