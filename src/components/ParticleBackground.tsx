'use client'

import { useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const N    = 60
const D2   = 3.2 * 3.2

function NeuralField() {
  const ptsGeo = useMemo(() => new THREE.BufferGeometry(), [])
  const lnsGeo = useMemo(() => new THREE.BufferGeometry(), [])

  const pos = useMemo(() => {
    const a = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      a[i*3]   = (Math.random() - 0.5) * 26
      a[i*3+1] = (Math.random() - 0.5) * 18
      a[i*3+2] = (Math.random() - 0.5) * 2
    }
    return a
  }, [])

  const vel = useMemo(() => {
    const a = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      a[i*3]   = (Math.random() - 0.5) * 0.007
      a[i*3+1] = (Math.random() - 0.5) * 0.007
    }
    return a
  }, [])

  const lineBuf = useMemo(() => new Float32Array(N * N * 3), [])

  useEffect(() => {
    const pa = new THREE.BufferAttribute(pos, 3)
    pa.setUsage(THREE.DynamicDrawUsage)
    ptsGeo.setAttribute('position', pa)

    const la = new THREE.BufferAttribute(lineBuf, 3)
    la.setUsage(THREE.DynamicDrawUsage)
    lnsGeo.setAttribute('position', la)
  }, [ptsGeo, lnsGeo, pos, lineBuf])

  useFrame(() => {
    for (let i = 0; i < N; i++) {
      pos[i*3]   += vel[i*3]
      pos[i*3+1] += vel[i*3+1]
      if (pos[i*3]   >  13) pos[i*3]   = -13
      if (pos[i*3]   < -13) pos[i*3]   =  13
      if (pos[i*3+1] >   9) pos[i*3+1] =  -9
      if (pos[i*3+1] <  -9) pos[i*3+1] =   9
    }
    ;(ptsGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true

    let idx = 0
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pos[i*3] - pos[j*3]
        const dy = pos[i*3+1] - pos[j*3+1]
        if (dx*dx + dy*dy < D2) {
          lineBuf[idx++] = pos[i*3];   lineBuf[idx++] = pos[i*3+1]; lineBuf[idx++] = pos[i*3+2]
          lineBuf[idx++] = pos[j*3];   lineBuf[idx++] = pos[j*3+1]; lineBuf[idx++] = pos[j*3+2]
        }
      }
    }
    const la = lnsGeo.attributes.position as THREE.BufferAttribute
    la.needsUpdate = true
    lnsGeo.setDrawRange(0, idx / 3)
  })

  return (
    <>
      <points geometry={ptsGeo}>
        <pointsMaterial color="#ff3333" size={0.065} transparent opacity={0.75} sizeAttenuation />
      </points>
      <lineSegments geometry={lnsGeo}>
        <lineBasicMaterial color="#ff4444" transparent opacity={0.18} />
      </lineSegments>
    </>
  )
}

export default function ParticleBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }} style={{ background: 'transparent' }}>
        <NeuralField />
      </Canvas>
    </div>
  )
}
