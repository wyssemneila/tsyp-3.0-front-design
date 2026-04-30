'use client'

import { Component, Suspense, useRef, useMemo, useEffect, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ── Error boundary ──────────────────────────────────────────────────────────
class FaceErrorBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() {
    if (this.state.err) return (
      <div style={{
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#0a1525,#05050e)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, textAlign: 'center', maxWidth: 150 }}>
          Drop robot.jpg + human.jpg into /public
        </p>
      </div>
    )
    return this.props.children
  }
}

// ── GLSL shaders ────────────────────────────────────────────────────────────
const vert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const frag = /* glsl */`
  precision highp float;

  uniform sampler2D uHuman;
  uniform sampler2D uRobot;
  uniform sampler2D uNoise;
  uniform sampler2D uDepth;
  uniform float     uProgress;
  uniform vec2      uMouse;
  uniform float     uTime;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Faux-depth parallax from mouse
    float depth = texture2D(uDepth, uv).r;
    vec2 displaced = uv + uMouse * depth * 0.038;
    displaced = clamp(displaced, 0.001, 0.999);

    // Sample both faces
    vec4 human = texture2D(uHuman, displaced);
    vec4 robot  = texture2D(uRobot,  displaced);

    // Multi-scale noise for organic wipe
    float n1 = texture2D(uNoise, uv * 1.5).r;
    float n2 = texture2D(uNoise, uv * 3.0 + vec2(0.37, 0.61)).r;
    float noise = n1 * 0.65 + n2 * 0.35;

    // Smooth threshold transition
    float t = smoothstep(uProgress - 0.09, uProgress + 0.09, noise);

    // Blend human → robot
    vec4 color = mix(human, robot, t);

    // Chromatic aberration at the wipe boundary
    float boundary = (1.0 - abs(t * 2.0 - 1.0));
    vec2 ca = vec2(0.007, 0.0) * boundary;
    color.r = mix(color.r, texture2D(uRobot, clamp(displaced + ca, 0.001, 0.999)).r, boundary * 0.45);
    color.b = mix(color.b, texture2D(uHuman, clamp(displaced - ca, 0.001, 0.999)).b, boundary * 0.45);

    // Fade edges to cream background (#ede8df = vec3(0.929, 0.910, 0.875))
    float dist = length(uv - 0.5) * 2.0;
    float fade = smoothstep(0.75, 1.0, dist);
    vec3 cream = vec3(0.929, 0.910, 0.875);
    color.rgb = mix(color.rgb, cream, fade);

    gl_FragColor = color;
  }
`

// ── Procedural textures (client-side only) ──────────────────────────────────
function makeNoiseTex(): THREE.CanvasTexture {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * S
    const y = Math.random() * S
    const r = 10 + Math.random() * 90
    const v = Math.round(Math.random() * 255)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(${v},${v},${v},0.85)`)
    g.addColorStop(1, `rgba(128,128,128,0)`)
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

function makeDepthTex(): THREE.CanvasTexture {
  const S = 256
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(S / 2, S / 2 - S * 0.05, 0, S / 2, S / 2, S * 0.65)
  g.addColorStop(0.0, '#ffffff')
  g.addColorStop(0.6, '#aaaaaa')
  g.addColorStop(1.0, '#000000')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return new THREE.CanvasTexture(c)
}

// ── Main shader mesh ─────────────────────────────────────────────────────────
function FaceMesh({ robotUrl, humanUrl }: { robotUrl: string; humanUrl: string }) {
  const [humanTex, robotTex] = useTexture([humanUrl, robotUrl])
  const { viewport, gl } = useThree()

  const matRef  = useRef<THREE.ShaderMaterial>(null!)
  const mouse   = useRef(new THREE.Vector2(0, 0))
  const tMouse  = useRef(new THREE.Vector2(0, 0))

  const { noiseTex, depthTex } = useMemo(() => ({
    noiseTex: makeNoiseTex(),
    depthTex: makeDepthTex(),
  }), [])

  // Mouse tracking (window-level for responsiveness)
  useEffect(() => {
    const canvas = gl.domElement
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      tMouse.current.x =  ((e.clientX - r.left)  / r.width  - 0.5) * 2
      tMouse.current.y = -((e.clientY - r.top)   / r.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [gl])

  const uniforms = useMemo(() => ({
    uHuman:    { value: humanTex },
    uRobot:    { value: robotTex },
    uNoise:    { value: noiseTex },
    uDepth:    { value: depthTex },
    uProgress: { value: 0.0 },
    uMouse:    { value: new THREE.Vector2(0, 0) },
    uTime:     { value: 0.0 },
  }), [humanTex, robotTex, noiseTex, depthTex])

  useFrame(({ clock }, dt) => {
    const mat = matRef.current
    if (!mat) return

    // Smooth mouse lerp
    mouse.current.lerp(tMouse.current, 1 - Math.exp(-5 * dt))
    mat.uniforms.uMouse.value.copy(mouse.current)
    mat.uniforms.uTime.value = clock.getElapsedTime()

    // Auto-animate progress with held peaks: human → robot → human
    // sin oscillates 0→1→0, smoothstep sharpens the hold at extremes
    const raw = (Math.sin(clock.getElapsedTime() * 0.55) + 1) / 2
    const sharpened = THREE.MathUtils.clamp(
      (raw - 0.15) / 0.7,  // stretch [0.15,0.85] → [0,1] for longer holds
      0, 1
    )
    mat.uniforms.uProgress.value = sharpened
  })

  // Fill the full canvas (portrait: wider than tall possible)
  const w = viewport.width
  const h = viewport.height

  return (
    <mesh>
      <planeGeometry args={[w, h, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// ── Public component ─────────────────────────────────────────────────────────
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
