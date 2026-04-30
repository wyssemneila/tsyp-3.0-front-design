'use client'

import { Component, Suspense, useRef, useMemo, useEffect, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ── Error boundary ───────────────────────────────────────────────────────────
class FaceErrorBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() {
    if (this.state.err) return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ede8df' }}>
        <p style={{ color: 'rgba(0,0,0,0.3)', fontSize: 11, textAlign: 'center', maxWidth: 160 }}>
          Drop robot.jpg + human.jpg into /public
        </p>
      </div>
    )
    return this.props.children
  }
}

// ── Vertex shader ────────────────────────────────────────────────────────────
const vert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ── Fragment shader ──────────────────────────────────────────────────────────
// The robot face appears in scattered organic PATCHES over the human face.
// Each patch is determined by a large-scale noise value vs a threshold.
// The noise DRIFTS slowly → patches shift position over time (never fully wipes).
// Mouse adds a depth parallax: robot layer moves slightly different from human.
const frag = /* glsl */`
  precision highp float;

  uniform sampler2D uHuman;   // base: human face
  uniform sampler2D uRobot;   // overlay: robot face (appears in patches)
  uniform sampler2D uNoise;   // large blob noise
  uniform sampler2D uDepth;   // depth map for parallax
  uniform float     uTime;    // elapsed seconds
  uniform vec2      uMouse;   // normalized mouse -1..1

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // ── Mouse depth parallax ──
    // Human face stays still; robot layer moves with mouse (feels closer/in-front)
    float depth = texture2D(uDepth, uv).r;
    vec2 robotUv = clamp(uv + uMouse * depth * 0.045, 0.001, 0.999);
    vec2 humanUv = clamp(uv + uMouse * depth * 0.012, 0.001, 0.999);

    vec4 human = texture2D(uHuman, humanUv);
    vec4 robot  = texture2D(uRobot,  robotUv);

    // ── Drifting large-scale noise ──
    // Two octaves drifting in slightly different directions = living patches
    vec2 drift1 = vec2(uTime * 0.028,  uTime * 0.018);
    vec2 drift2 = vec2(-uTime * 0.015, uTime * 0.022);

    float n1 = texture2D(uNoise, uv * 0.9 + drift1).r;          // big blobs
    float n2 = texture2D(uNoise, uv * 1.7 + drift2 + 0.4).r;    // medium blobs
    float noise = n1 * 0.70 + n2 * 0.30;

    // ── Hard patch threshold (no blend — sharp edges like the screenshots) ──
    // threshold 0.5 → ~half the patches show robot at any moment
    float threshold = 0.50;
    float edge      = 0.03;   // tiny softness only at the very border
    float mask = smoothstep(threshold - edge, threshold + edge, noise);

    // ── Composite: human base + robot patches ──
    vec4 color = mix(human, robot, mask);

    // ── Thin chromatic glitch line exactly at patch borders ──
    float border = 1.0 - abs(mask * 2.0 - 1.0);
    border = pow(border, 6.0);   // very narrow
    vec2 ca = vec2(0.006, 0.0);
    color.r += texture2D(uRobot, clamp(robotUv + ca, 0.001, 0.999)).r * border * 0.6;
    color.b += texture2D(uHuman, clamp(humanUv - ca, 0.001, 0.999)).b * border * 0.6;

    gl_FragColor = color;
  }
`

// ── Large organic blob noise (repeating) ─────────────────────────────────────
function makeNoiseTex(): THREE.CanvasTexture {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#444'
  ctx.fillRect(0, 0, S, S)
  // Fewer, LARGER blobs → big organic patches (not fine grain)
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * S
    const y = Math.random() * S
    const r = 60 + Math.random() * 140        // large blobs
    const v = Math.round(Math.random() * 255)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0,   `rgba(${v},${v},${v},1)`)
    g.addColorStop(0.6, `rgba(${v},${v},${v},0.6)`)
    g.addColorStop(1,   `rgba(68,68,68,0)`)
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.minFilter = THREE.LinearFilter
  return t
}

// ── Depth map: bright center = closer (more parallax shift) ──────────────────
function makeDepthTex(): THREE.CanvasTexture {
  const S = 256
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(S / 2, S * 0.42, 0, S / 2, S / 2, S * 0.62)
  g.addColorStop(0.0, '#fff')
  g.addColorStop(0.5, '#aaa')
  g.addColorStop(1.0, '#000')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return new THREE.CanvasTexture(c)
}

// ── Shader mesh ───────────────────────────────────────────────────────────────
function FaceMesh({ robotUrl, humanUrl }: { robotUrl: string; humanUrl: string }) {
  const [humanTex, robotTex] = useTexture([humanUrl, robotUrl])
  const { viewport, gl } = useThree()

  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const mouse  = useRef(new THREE.Vector2(0, 0))
  const tMouse = useRef(new THREE.Vector2(0, 0))

  const { noiseTex, depthTex } = useMemo(() => ({
    noiseTex: makeNoiseTex(),
    depthTex:  makeDepthTex(),
  }), [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = gl.domElement.getBoundingClientRect()
      tMouse.current.x =  ((e.clientX - r.left) / r.width  - 0.5) * 2
      tMouse.current.y = -((e.clientY - r.top)  / r.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [gl])

  const uniforms = useMemo(() => ({
    uHuman: { value: humanTex },
    uRobot: { value: robotTex },
    uNoise: { value: noiseTex },
    uDepth: { value: depthTex },
    uTime:  { value: 0.0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [humanTex, robotTex, noiseTex, depthTex])

  useFrame(({ clock }, dt) => {
    const mat = matRef.current
    if (!mat) return
    mouse.current.lerp(tMouse.current, 1 - Math.exp(-5 * dt))
    mat.uniforms.uMouse.value.copy(mouse.current)
    mat.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// ── Public export ─────────────────────────────────────────────────────────────
export default function FaceReveal({
  robotUrl = '/robot-placeholder.svg',
  humanUrl = '/human-placeholder.svg',
}: {
  robotUrl?: string
  humanUrl?: string
}) {
  return (
    <FaceErrorBoundary>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <FaceMesh robotUrl={robotUrl} humanUrl={humanUrl} />
        </Suspense>
      </Canvas>
    </FaceErrorBoundary>
  )
}
