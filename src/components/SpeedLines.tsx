'use client'

import { useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const N = 160

interface Streak { x: number; y: number; len: number; speed: number }

function Lines() {
  const { geo, pos } = useMemo(() => {
    const pos  = new Float32Array(N * 6)
    const attr = new THREE.BufferAttribute(pos, 3)
    attr.setUsage(THREE.DynamicDrawUsage)
    const geo  = new THREE.BufferGeometry()
    geo.setAttribute('position', attr)
    return { geo, pos }
  }, [])

  const streaks = useMemo<Streak[]>(() =>
    Array.from({ length: N }, () => ({
      x:     Math.random() * 50 - 25,
      y:     Math.random() * 30 - 15,
      len:   0.3 + Math.random() * 2.5,
      speed: 10 + Math.random() * 38,
    }))
  , [])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    for (let i = 0; i < N; i++) {
      const s = streaks[i]
      s.x -= s.speed * d
      if (s.x + s.len < -26) {
        s.x     = 26
        s.y     = Math.random() * 30 - 15
        s.speed = 10 + Math.random() * 38
        s.len   = 0.3 + Math.random() * 2.5
      }
      pos[i*6]   = s.x - s.len; pos[i*6+1] = s.y; pos[i*6+2] = 0
      pos[i*6+3] = s.x;         pos[i*6+4] = s.y; pos[i*6+5] = 0
    }
    ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
  })

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#C8FF00" transparent opacity={0.38} />
    </lineSegments>
  )
}

export default function SpeedLines() {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 70 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <Lines />
    </Canvas>
  )
}
