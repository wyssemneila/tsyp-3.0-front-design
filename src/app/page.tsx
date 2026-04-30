'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const SpeedLines = dynamic(() => import('@/components/SpeedLines'), { ssr: false })

/* ── data ─────────────────────────────────────────────────── */

const STATS = [
  { value: '04',  label: 'Car Number',      sub: 'McLaren Racing' },
  { value: '3',   label: 'Race Victories',  sub: '2024 Season'    },
  { value: '9',   label: 'Podium Finishes', sub: '2024 Season'    },
  { value: '279', label: 'Championship Pts',sub: '2024 Final'     },
]

const RACES = [
  { gp: 'Bahrain Grand Prix',  pos: 'P4',  win: false },
  { gp: 'Monaco Grand Prix',   pos: 'P4',  win: false },
  { gp: 'British Grand Prix',  pos: 'P1',  win: true  },
  { gp: 'Hungarian GP',        pos: 'P1',  win: true  },
  { gp: 'Singapore GP',        pos: 'P1',  win: true  },
  { gp: 'Las Vegas GP',        pos: 'P1',  win: true  },
]

const OFF_ITEMS = [
  {
    tag: 'ESPORTS · CONTENT',
    title: 'QUADRANT',
    body: 'Founder of the UK esports and content collective. Gaming, vlogs, and behind-the-scenes racing life.',
    accent: '#C8FF00',
  },
  {
    tag: 'LIVE STREAMING',
    title: 'LIVE',
    body: 'Catch Lando live on Twitch — F1 replays, game sessions, and unfiltered reactions to the grid.',
    accent: '#FF4444',
  },
  {
    tag: 'OFFICIAL STORE',
    title: 'LN4 DROPS',
    body: 'Exclusive LN4 merchandise, McLaren collaboration pieces, and limited edition collector releases.',
    accent: '#FF8C00',
  },
]

const HELMETS = [
  { name: 'ROOKIE SEASON',   year: '2019', hue: '#FFD700' },
  { name: 'PAPAYA SPIRIT',   year: '2020', hue: '#FF8700' },
  { name: 'TROPICAL VIBES',  year: '2021', hue: '#00CFFF' },
  { name: 'MIAMI VICE',      year: '2022', hue: '#FF4490' },
  { name: 'CHAMPIONSHIP RUN',year: '2023', hue: '#C8FF00' },
  { name: 'LN4 ICON',        year: '2024', hue: '#C8FF00' },
]

const PARTNERS = [
  'McLAREN', 'LEGO', 'CISCO', 'NORTON', 'FANATEC',
  'BELL HELMETS', 'ALPINESTARS', 'OMP', 'QUADRANT', 'G2 ESPORTS',
]

const SOCIALS = ['Instagram', 'X (Twitter)', 'TikTok', 'YouTube', 'Twitch']
const NAV_LINKS = ['ON TRACK', 'OFF TRACK', 'HELMETS', 'PARTNERS']

/* ── helpers ──────────────────────────────────────────────── */

const LN = '#C8FF00'

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 6,
      color: LN, textTransform: 'uppercase', marginBottom: 14,
    }}>{text}</p>
  )
}

function BigHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 'clamp(2.8rem, 8vw, 8rem)',
      fontWeight: 900, letterSpacing: '-0.04em',
      textTransform: 'uppercase', lineHeight: 0.88,
      color: '#fff',
    }}>{children}</h2>
  )
}

/* ── page ─────────────────────────────────────────────────── */

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main style={{ background: '#080808', color: '#fff', overflowX: 'hidden' }}>

      {/* ══ NAVBAR ══════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64, padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,8,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid #161616' : 'none',
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: LN, letterSpacing: -1 }}>LN4</span>

        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {NAV_LINKS.map(lnk => (
            <a
              key={lnk}
              href={`#${lnk.toLowerCase().replace(' ', '-')}`}
              style={{ color: '#555', fontSize: 11, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#555')}
            >{lnk}</a>
          ))}
        </div>

        <a
          href="#partners"
          style={{
            padding: '9px 20px', background: LN, color: '#080808',
            fontWeight: 900, fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', borderRadius: 1,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >STORE</a>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section style={{
        position: 'relative', height: '100dvh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 48px 88px',
      }}>
        {/* Three.js speed lines */}
        <SpeedLines />

        {/* Subtle vignette over lines */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, #080808 100%)',
          pointerEvents: 'none',
        }} />

        {/* Giant background number */}
        <div style={{
          position: 'absolute', right: '-2vw', top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(220px, 38vw, 520px)',
          fontWeight: 900, lineHeight: 0.82,
          WebkitTextStroke: '1.5px rgba(200,255,0,0.06)',
          color: 'transparent',
          letterSpacing: -20,
          userSelect: 'none', pointerEvents: 'none',
          zIndex: 1,
        }}>04</div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <p style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 7,
            color: LN, textTransform: 'uppercase', marginBottom: 20,
          }}>
            McLaren Formula One Team &nbsp;·&nbsp; 2025
          </p>

          <h1 style={{
            fontSize: 'clamp(3.5rem, 18vw, 16rem)',
            fontWeight: 900, lineHeight: 0.86,
            letterSpacing: '-0.05em', textTransform: 'uppercase',
          }}>
            LANDO<br />
            <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>
              NORRIS
            </span>
          </h1>

          <p style={{ marginTop: 28, fontSize: 14, color: '#555', maxWidth: 380, lineHeight: 1.6 }}>
            Formula One driver. On the limit every single lap. On track. Off track. No limits.
          </p>

          <div style={{ display: 'flex', gap: 14, marginTop: 36 }}>
            <a
              href="#on-track"
              style={{
                padding: '14px 30px', background: LN, color: '#080808',
                fontWeight: 900, fontSize: 12, letterSpacing: 1.5,
                textTransform: 'uppercase', borderRadius: 1,
                transition: 'transform 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >ON TRACK →</a>
            <a
              href="#off-track"
              style={{
                padding: '14px 30px', background: 'transparent',
                border: '1px solid #222', color: '#888',
                fontWeight: 700, fontSize: 12, letterSpacing: 1.5,
                textTransform: 'uppercase', borderRadius: 1,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = LN; e.currentTarget.style.color = LN }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888' }}
            >OFF TRACK</a>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 40, right: 48, zIndex: 10,
          fontSize: 9, color: '#333', letterSpacing: 4,
          textTransform: 'uppercase', writingMode: 'vertical-rl',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          SCROLL
          <span style={{ width: 1, height: 40, background: '#222', display: 'inline-block' }} />
        </div>
      </section>

      {/* ══ STATS STRIP ═════════════════════════════════════ */}
      <section style={{ background: LN, padding: '52px 48px' }}>
        <div style={{ display: 'flex' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(0,0,0,0.18)' : 'none',
              padding: '0 16px',
            }}>
              <div style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)',
                fontWeight: 900, color: '#080808',
                lineHeight: 1, letterSpacing: '-0.04em',
              }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#1a1a1a', letterSpacing: 2.5, marginTop: 10, textTransform: 'uppercase' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 10, color: '#3a3a00', marginTop: 5, letterSpacing: 1 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ON TRACK ════════════════════════════════════════ */}
      <section id="on-track" style={{ padding: '110px 48px', background: '#0a0a0a' }}>
        <div style={{ marginBottom: 60 }}>
          <SectionLabel text="Results · 2024 Season" />
          <BigHeading>ON<br />TRACK</BigHeading>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 2,
        }}>
          {RACES.map((r, i) => (
            <div
              key={i}
              style={{
                background: '#0f0f0f',
                borderLeft: `3px solid ${r.win ? LN : '#1c1c1c'}`,
                padding: '32px 26px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#151515')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0f0f0f')}
            >
              <div style={{ fontSize: 9, color: '#444', letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase' }}>
                Grand Prix
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#e8e8e8', marginBottom: 16, letterSpacing: -0.3 }}>{r.gp}</div>
              <span style={{
                display: 'inline-block',
                fontSize: 12, fontWeight: 900, letterSpacing: 1,
                color: r.win ? LN : '#555',
                background: r.win ? 'rgba(200,255,0,0.07)' : 'rgba(255,255,255,0.04)',
                padding: '5px 12px', borderRadius: 1,
                border: `1px solid ${r.win ? 'rgba(200,255,0,0.15)' : '#1e1e1e'}`,
              }}>{r.pos}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ DIVIDER ═════════════════════════════════════════ */}
      <div style={{
        height: 1, background: 'linear-gradient(90deg, transparent, #1e1e1e 20%, #1e1e1e 80%, transparent)',
      }} />

      {/* ══ OFF TRACK ═══════════════════════════════════════ */}
      <section id="off-track" style={{ padding: '110px 48px', background: '#080808' }}>
        <div style={{ marginBottom: 60 }}>
          <SectionLabel text="Beyond Racing" />
          <BigHeading>OFF<br />TRACK</BigHeading>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 2,
        }}>
          {OFF_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                background: '#0c0c0c',
                borderTop: `3px solid ${item.accent}`,
                padding: '40px 32px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#131313')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0c0c0c')}
            >
              <div style={{ fontSize: 9, color: item.accent, fontWeight: 800, letterSpacing: 3, marginBottom: 18, textTransform: 'uppercase' }}>
                {item.tag}
              </div>
              <div style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
                fontWeight: 900, letterSpacing: -1,
                color: '#fff', marginBottom: 16,
                textTransform: 'uppercase',
              }}>{item.title}</div>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HELMETS ═════════════════════════════════════════ */}
      <section id="helmets" style={{ padding: '110px 48px', background: '#0a0a0a' }}>
        <div style={{ marginBottom: 64 }}>
          <SectionLabel text="Evolution of a Racer" />
          <BigHeading>HALL OF<br />HELMETS</BigHeading>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 2,
        }}>
          {HELMETS.map((h, i) => (
            <div
              key={i}
              style={{
                background: '#0d0d0d',
                overflow: 'hidden',
                transition: 'transform 0.25s',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Helmet visual */}
              <div style={{
                height: 220,
                background: `linear-gradient(135deg, #0f0f0f 0%, ${h.hue}18 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderBottom: `1px solid ${h.hue}30`,
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Decorative helmet shape */}
                <div style={{
                  width: 110, height: 110,
                  borderRadius: '50% 50% 42% 42% / 55% 55% 45% 45%',
                  background: `linear-gradient(145deg, ${h.hue}ee, ${h.hue}55)`,
                  boxShadow: `0 0 60px ${h.hue}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {/* Visor cutout */}
                  <div style={{
                    width: 70, height: 28,
                    borderRadius: 4,
                    background: 'rgba(0,0,0,0.5)',
                    position: 'absolute', top: '38%',
                  }} />
                  <span style={{
                    fontSize: 20, fontWeight: 900,
                    color: '#080808', position: 'absolute', bottom: 14,
                    letterSpacing: -1,
                  }}>04</span>
                </div>
                {/* Corner label */}
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  fontSize: 9, fontWeight: 800, color: h.hue,
                  letterSpacing: 2, opacity: 0.8,
                }}>{h.year}</div>
              </div>

              <div style={{ padding: '20px 22px' }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {h.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PARTNERS ════════════════════════════════════════ */}
      <section id="partners" style={{ padding: '110px 0', background: '#080808', overflow: 'hidden' }}>
        <div style={{ padding: '0 48px', marginBottom: 60 }}>
          <SectionLabel text="Collaboration & Trust" />
          <BigHeading>PARTNERS</BigHeading>
        </div>

        <div style={{ borderTop: '1px solid #141414', borderBottom: '1px solid #141414', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            animation: 'marquee 22s linear infinite',
            width: 'max-content',
          }}>
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
              <div
                key={i}
                style={{
                  padding: '30px 52px',
                  fontSize: 12, fontWeight: 900, letterSpacing: 4,
                  color: '#2a2a2a', textTransform: 'uppercase',
                  borderRight: '1px solid #141414', whiteSpace: 'nowrap',
                  transition: 'color 0.25s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = LN)}
                onMouseLeave={e => (e.currentTarget.style.color = '#2a2a2a')}
              >{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUOTE BAND ══════════════════════════════════════ */}
      <section style={{
        background: LN, padding: '72px 48px',
        textAlign: 'center',
      }}>
        <blockquote style={{
          fontSize: 'clamp(1.4rem, 4vw, 3.5rem)',
          fontWeight: 900, color: '#080808',
          letterSpacing: '-0.03em', textTransform: 'uppercase',
          lineHeight: 1.1, maxWidth: 900, margin: '0 auto',
        }}>
          "THERE IS NO FEELING LIKE BEING COMPLETELY ON THE LIMIT."
        </blockquote>
        <p style={{ marginTop: 18, fontSize: 11, fontWeight: 700, color: '#1a1a1a', letterSpacing: 3 }}>
          — LANDO NORRIS
        </p>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer style={{
        background: '#050505',
        borderTop: '1px solid #0f0f0f',
        padding: '56px 48px 40px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: LN, letterSpacing: -2, marginBottom: 8 }}>LN4</div>
            <p style={{ fontSize: 12, color: '#333', maxWidth: 260, lineHeight: 1.6 }}>
              McLaren Formula One Team driver. Quadrant founder. Always on the limit.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 48 }}>
            <div>
              <p style={{ fontSize: 9, color: '#444', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Navigate</p>
              {NAV_LINKS.map(lnk => (
                <a
                  key={lnk}
                  href={`#${lnk.toLowerCase().replace(' ', '-')}`}
                  style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 10, fontWeight: 600, letterSpacing: 0.5, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#444')}
                >{lnk}</a>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 9, color: '#444', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Social</p>
              {SOCIALS.map(s => (
                <a
                  key={s}
                  href="#"
                  style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 10, fontWeight: 600, letterSpacing: 0.5, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = LN)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#444')}
                >{s}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: 24, borderTop: '1px solid #0f0f0f',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: 11, color: '#2a2a2a' }}>© 2025 Lando Norris. All rights reserved.</p>
          <p style={{ fontSize: 11, color: '#2a2a2a' }}>Built with Next.js &amp; Three.js</p>
        </div>
      </footer>

    </main>
  )
}
