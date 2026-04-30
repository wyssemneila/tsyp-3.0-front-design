'use client'

import dynamic from 'next/dynamic'

const FaceReveal = dynamic(() => import('@/components/FaceReveal'), { ssr: false })

const stats = [
  { value: '500+', label: 'Participants' },
  { value: '3 Days', label: 'Of Innovation' },
  { value: '20+',   label: 'Countries' },
]

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden" style={{ background: '#05050e' }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center">

        {/* dot grid */}
        <div className="bg-grid absolute inset-0 pointer-events-none" />

        {/* ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', left: '28%', top: '45%', transform: 'translate(-50%,-50%)',
            width: 640, height: 640, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', right: '18%', top: '50%', transform: 'translateY(-50%)',
            width: 440, height: 440, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)',
          }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

          {/* ── 3D Face Widget ── */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 420, height: 420, flexShrink: 0 }}>

              {/* spinning conic ring */}
              <div className="ring-spin" style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #2563eb, #06b6d4, #7c3aed, #ec4899, #2563eb)',
                padding: 4,
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#05050e' }} />
              </div>

              {/* canvas clip circle */}
              <div style={{
                position: 'absolute', inset: 9, borderRadius: '50%',
                overflow: 'hidden', zIndex: 2,
                boxShadow: '0 0 60px rgba(37,99,235,0.2), inset 0 0 40px rgba(0,0,0,0.6)',
              }}>
                <FaceReveal />
              </div>

              {/* scanlines overlay */}
              <div className="scanlines" style={{
                position: 'absolute', inset: 9, borderRadius: '50%',
                zIndex: 3, pointerEvents: 'none', opacity: 0.4,
              }} />

              {/* image swap hint badge */}
              <div style={{
                position: 'absolute', bottom: 14, right: 14, zIndex: 4,
                background: 'rgba(5,5,14,0.85)', border: '1px solid rgba(37,99,235,0.4)',
                borderRadius: 8, padding: '5px 10px', fontSize: 11,
                color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)',
              }}>
                Add robot.jpg + human.jpg → /public
              </div>
            </div>
          </div>

          {/* ── Text ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 5,
              textTransform: 'uppercase', color: '#2563eb',
            }}>
              IEEE · TSYP 3.0 · 2026
            </span>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.02em', margin: 0,
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #b8d0ff 60%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                The Future
              </span>
              <br />
              <span style={{
                background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Has a Face.
              </span>
            </h1>

            <p style={{
              fontSize: '1.05rem', color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.75, maxWidth: 420, margin: 0,
            }}>
              Where human ingenuity and artificial intelligence converge.
              Join the next generation of technology leaders shaping tomorrow.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#register" className="btn-primary">Register Now →</a>
              <a href="#about" className="btn-ghost">▷ Watch Demo</a>
            </div>

            {/* stats */}
            <div style={{
              display: 'flex', gap: 36,
              paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              {stats.map(s => (
                <div key={s.label}>
                  <p style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#fff' }}>
                    {s.value}
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 3 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* online status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="dot-pulse" style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#22c55e', display: 'inline-block', flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
                AI system online · Registrations open
              </span>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
