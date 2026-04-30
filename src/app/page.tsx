'use client'

import dynamic from 'next/dynamic'

const FaceReveal = dynamic(() => import('@/components/FaceReveal'), { ssr: false })

export default function Home() {
  return (
    <main style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: '#ede8df',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── Background watermark shapes ── */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="720" cy="450" rx="520" ry="480" fill="none" stroke="#0a0806" strokeWidth="1.5"/>
        <ellipse cx="720" cy="450" rx="380" ry="360" fill="none" stroke="#0a0806" strokeWidth="1"/>
        <ellipse cx="720" cy="450" rx="240" ry="230" fill="none" stroke="#0a0806" strokeWidth="0.8"/>
        <line x1="200" y1="450" x2="1240" y2="450" stroke="#0a0806" strokeWidth="0.6"/>
        <line x1="720" y1="0" x2="720" y2="900" stroke="#0a0806" strokeWidth="0.6"/>
      </svg>

      {/* ── Top navigation ── */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'flex-start',
        padding: '28px 44px',
        zIndex: 20,
      }}>

        {/* Left: TSYP stacked */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 'clamp(2rem, 3.5vw, 3.4rem)',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            color: '#0a0806',
            textTransform: 'uppercase',
          }}>
            TSYP<br />3.0
          </div>
        </div>

        {/* Center: IEEE monogram */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 2,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 800,
            letterSpacing: 5, color: '#0a0806',
            opacity: 0.55, textTransform: 'uppercase',
          }}>
            IEEE
          </span>
          <span style={{
            fontSize: 28, fontWeight: 900,
            letterSpacing: '-0.05em', lineHeight: 1,
            color: '#0a0806',
          }}>
            IEEE
          </span>
        </div>

        {/* Right: Register button */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <a href="#register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '11px 20px',
            background: '#c5f000',
            color: '#0a0806',
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 0.4,
            borderRadius: 100,
            textDecoration: 'none',
            border: '2px solid #0a0806',
            transition: 'transform 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>⊕</span>
            REGISTER
          </a>
        </div>
      </header>

      {/* ── Large face canvas — center, full height ── */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(300px, 44vw, 680px)',
        zIndex: 10,
      }}>
        <FaceReveal />
      </div>

      {/* ── Left side labels ── */}
      <aside style={{
        position: 'absolute',
        left: 44, bottom: 52,
        zIndex: 20,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <LabelBlock label="NEXT EVENT" value="Tunis · 2026" />
        <LabelBlock label="EDITION" value="3rd Year" />
        <LabelBlock label="PARTICIPANTS" value="500+" />
      </aside>

      {/* ── Right side labels ── */}
      <aside style={{
        position: 'absolute',
        right: 44, bottom: 52,
        zIndex: 20,
        display: 'flex', flexDirection: 'column', gap: 20,
        textAlign: 'right',
      }}>
        <LabelBlock label="COUNTRIES" value="20+" right />
        <LabelBlock label="DURATION" value="3 Days" right />
        <LabelBlock label="IEEE SECTION" value="Tunisia" right />
      </aside>

      {/* ── Bottom center tagline ── */}
      <div style={{
        position: 'absolute',
        bottom: 52, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        <p style={{
          fontSize: 11, fontWeight: 700,
          letterSpacing: 5, textTransform: 'uppercase',
          color: '#0a0806', opacity: 0.4,
        }}>
          Where Human Meets Machine
        </p>
      </div>

    </main>
  )
}

function LabelBlock({ label, value, right }: { label: string; value: string; right?: boolean }) {
  return (
    <div style={{ textAlign: right ? 'right' : 'left' }}>
      <p style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 3,
        textTransform: 'uppercase', color: '#0a0806', opacity: 0.38,
        marginBottom: 3,
      }}>
        {label}
      </p>
      <p style={{
        fontSize: 15, fontWeight: 800,
        color: '#0a0806', letterSpacing: '-0.02em',
      }}>
        {value}
      </p>
    </div>
  )
}
