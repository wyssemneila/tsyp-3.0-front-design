'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const COLS = 9
const ROWS = 9
const TOTAL = COLS * ROWS
const TW = 1 / COLS
const TH = 1 / ROWS
const GAP = 0.012

function randomOrder(n: number): number[] {
  return [...Array(n).keys()].sort(() => Math.random() - 0.5)
}

interface AnimState {
  phase: 0 | 1 | 2 | 3
  timer: number
  order: number[]
}

function FaceGrid({ robotUrl, humanUrl }: { robotUrl: string; humanUrl: string }) {
  const [robotTex, humanTex] = useTexture([robotUrl, humanUrl])
  const { viewport } = useThree()
  const size = Math.min(viewport.width, viewport.height) * 0.9

  const tiles = useMemo(() =>
    Array.from({ length: TOTAL }, (_, id) => {
      const c = id % COLS
      const r = Math.floor(id / COLS)
      const clone = (base: THREE.Texture) => {
        const t = base.clone()
        t.repeat.set(TW, TH)
        t.offset.set(c * TW, 1 - (r + 1) * TH)
        t.needsUpdate = true
        return t
      }
      return {
        id,
        x: (c + 0.5) * TW - 0.5,
        y: 0.5 - (r + 0.5) * TH,
        robot: clone(robotTex),
        human: clone(humanTex),
      }
    }), [robotTex, humanTex])

  const grps = useRef<(THREE.Group | null)[]>(new Array(TOTAL).fill(null))
  const targets = useRef(new Float32Array(TOTAL))
  const anim = useRef<AnimState>({ phase: 0, timer: 0, order: [] })
  const lightRef = useRef<THREE.PointLight>(null!)

  const STEP = 0.026
  const HOLD = 1.2

  useFrame((state, dt) => {
    const s = anim.current
    s.timer += dt

    // Gently orbit the point light for dynamic reflections
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 2
      lightRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 1.5
    }

    if (s.phase === 0 && s.timer > HOLD) {
      s.order = randomOrder(TOTAL)
      s.phase = 1
      s.timer = 0
    }

    if (s.phase === 1) {
      const n = Math.floor(s.timer / STEP)
      for (let i = 0; i <= n && i < TOTAL; i++) targets.current[s.order[i]] = Math.PI
      if (s.timer > TOTAL * STEP + 0.35) { s.phase = 2; s.timer = 0 }
    }

    if (s.phase === 2 && s.timer > HOLD) {
      s.order = randomOrder(TOTAL)
      s.phase = 3
      s.timer = 0
    }

    if (s.phase === 3) {
      const n = Math.floor(s.timer / STEP)
      for (let i = 0; i <= n && i < TOTAL; i++) targets.current[s.order[i]] = 0
      if (s.timer > TOTAL * STEP + 0.35) { s.phase = 0; s.timer = 0 }
    }

    // Frame-rate independent exponential lerp
    const factor = 1 - Math.exp(-7 * dt)
    grps.current.forEach((g, i) => {
      if (!g) return
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targets.current[i], factor)
      // Tiles pop slightly toward camera during flip for a 3D depth feel
      g.position.z = Math.abs(Math.sin(g.rotation.y)) * 0.04
    })
  })

  return (
    <group scale={[size, size, 1]}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[2, 3, 5]} intensity={1.0} />
      <pointLight ref={lightRef} position={[0, 0, 3]} intensity={0.6} color="#4488ff" />

      {tiles.map((tile, i) => (
        <group
          key={tile.id}
          position={[tile.x, tile.y, 0]}
          ref={el => { if (el) grps.current[i] = el }}
        >
          {/* Front: robot face */}
          <mesh>
            <planeGeometry args={[TW - GAP, TH - GAP]} />
            <meshStandardMaterial
              map={tile.robot}
              side={THREE.FrontSide}
              toneMapped={false}
              metalness={0.1}
              roughness={0.6}
            />
          </mesh>
          {/* Back: human face */}
          <mesh rotation-y={Math.PI}>
            <planeGeometry args={[TW - GAP, TH - GAP]} />
            <meshStandardMaterial
              map={tile.human}
              side={THREE.FrontSide}
              toneMapped={false}
              metalness={0.05}
              roughness={0.7}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function FaceReveal({
  robotUrl = '/robot.jpg',
  humanUrl = '/human.jpg',
}: {
  robotUrl?: string
  humanUrl?: string
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <FaceGrid robotUrl={robotUrl} humanUrl={humanUrl} />
      </Suspense>
    </Canvas>
  )
}
