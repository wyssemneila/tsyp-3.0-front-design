'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Video, LikedVideo } from '@/lib/types'
import {
  getRatings, saveRating,
  getLikedVideos, saveLikedVideo, removeLikedVideo,
} from '@/lib/store'
import { scoreVideos } from '@/lib/recommendations'
import VideoCard from '@/components/VideoCard'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })

const TOPICS = [
  'machine learning',
  'web development',
  'coding tutorial',
  'artificial intelligence',
  'data science',
  'open source',
]

export default function Home() {
  const [videos,      setVideos]      = useState<Video[]>([])
  const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([])
  const [ratings,     setRatings]     = useState<Record<string, boolean>>({})
  const [view,        setView]        = useState<'rating' | 'liked'>('rating')
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [note,        setNote]        = useState<string | null>(null)
  const [topic,       setTopic]       = useState(TOPICS[0])

  const toast = useCallback((msg: string) => {
    setNote(msg)
    setTimeout(() => setNote(null), 3200)
  }, [])

  const loadVideos = useCallback(async (q: string) => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to load')

      const r   = getRatings()
      const lv  = getLikedVideos()
      const scored = scoreVideos(data.videos as Video[], lv, Object.keys(r).length)
      const sorted = Object.keys(r).length >= 5
        ? [...scored].sort((a, b) => b.confidence - a.confidence)
        : scored
      setVideos(sorted)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setRatings(getRatings())
    setLikedVideos(getLikedVideos())
    loadVideos(topic)
  }, [loadVideos, topic])

  const handleRate = useCallback((video: Video, liked: boolean) => {
    saveRating(video.id, liked)

    if (liked) {
      saveLikedVideo({ ...video, ratedAt: Date.now() })
      toast('Video liked! 👍 AI is learning your taste…')
    } else {
      removeLikedVideo(video.id)
      toast('Video disliked 👎')
    }

    const newR  = getRatings()
    const newLv = getLikedVideos()
    setRatings(newR)
    setLikedVideos(newLv)

    const scored = scoreVideos(
      videos.map(v => v.id === video.id ? { ...v, confidence: v.confidence } : v),
      newLv,
      Object.keys(newR).length,
    )
    const sorted = Object.keys(newR).length >= 5
      ? [...scored].sort((a, b) => b.confidence - a.confidence)
      : scored
    setVideos(sorted)

    if (Object.keys(newR).length === 5) {
      toast('🤖 AI activated! Videos now ranked by your taste!')
    }
  }, [videos, toast])

  const totalRatings = Object.keys(ratings).length
  const isTrained    = totalRatings >= 5

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#e8e8e8', position: 'relative' }}>
      <ParticleBackground />

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(15,15,15,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1e1e1e',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #ff0000, #cc0000)',
            borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 900, letterSpacing: -0.5, color: '#fff',
          }}>VI</div>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Video Inspiration</span>
        </div>

        {/* Status */}
        <div style={{
          flex: 1, textAlign: 'center', fontSize: 13,
          color: isTrained ? '#22c55e' : '#ffaa00',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: isTrained ? '#22c55e' : '#ffaa00',
            display: 'inline-block',
            boxShadow: `0 0 6px ${isTrained ? '#22c55e' : '#ffaa00'}`,
          }} />
          {isTrained
            ? `AI Active — Trained on ${totalRatings} ratings`
            : `Learning Mode — Rate ${Math.max(0, 5 - totalRatings)} more videos to activate AI`}
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {(['rating', 'liked'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '7px 15px', borderRadius: 20,
              border: `1px solid ${view === v ? '#ff3333' : '#272727'}`,
              background: view === v ? 'rgba(255,51,51,0.12)' : '#141414',
              color: view === v ? '#ff5555' : '#888',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              transition: 'all 0.2s',
            }}>
              {v === 'rating' ? '📝 Rate Videos' : '🎯 MyTube'}
            </button>
          ))}
        </div>
      </header>

      {/* ── Topic chips ── */}
      {view === 'rating' && (
        <div style={{
          display: 'flex', gap: 8, padding: '10px 20px',
          overflowX: 'auto', background: '#0a0a0a',
          borderBottom: '1px solid #181818',
        }}>
          {TOPICS.map(t => (
            <button key={t} onClick={() => setTopic(t)} style={{
              padding: '5px 13px', borderRadius: 20, whiteSpace: 'nowrap',
              border: `1px solid ${topic === t ? '#ff4444' : '#252525'}`,
              background: topic === t ? 'rgba(255,68,68,0.12)' : '#141414',
              color: topic === t ? '#ff6666' : '#777',
              cursor: 'pointer', fontSize: 12,
              transition: 'all 0.18s',
            }}>{t}</button>
          ))}
          <button onClick={() => loadVideos(topic)} style={{
            padding: '5px 13px', borderRadius: 20, whiteSpace: 'nowrap',
            border: '1px solid #252525', background: '#141414',
            color: '#666', cursor: 'pointer', fontSize: 12,
          }}>↻ Refresh</button>
        </div>
      )}

      {/* ── Main content ── */}
      <main style={{ padding: '26px 20px', position: 'relative', zIndex: 10 }}>
        {view === 'rating' ? (
          <>
            {loading && (
              <div style={{ textAlign: 'center', padding: '70px 20px', color: '#555' }}>
                <div className="spinner" />
                <p>Loading AI-curated videos…</p>
              </div>
            )}

            {!loading && error && (
              <div style={{
                background: '#130000', border: '1px solid #3a0000',
                borderRadius: 10, padding: '22px 24px',
                color: '#ff8080', maxWidth: 540, margin: '20px auto',
              }}>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>⚠️ Could not load videos</p>
                <p style={{ fontSize: 13, color: '#aa6060', lineHeight: 1.5 }}>{error}</p>
                {error.includes('API key') && (
                  <p style={{ marginTop: 10, fontSize: 12, color: '#666', lineHeight: 1.5 }}>
                    → Add <code style={{ background: '#1a0000', padding: '2px 5px', borderRadius: 4 }}>YOUTUBE_API_KEY</code> to your
                    Vercel environment variables and redeploy.
                  </p>
                )}
              </div>
            )}

            {!loading && !error && videos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '70px', color: '#555' }}>
                No videos found for "{topic}".
              </div>
            )}

            {!loading && !error && videos.length > 0 && (
              <>
                <h2 style={{
                  fontSize: 15, fontWeight: 600, color: '#999',
                  marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {isTrained ? 'Recommended for you' : 'Popular videos'}
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                    background: 'linear-gradient(90deg, #ff4444, #ff8800)',
                    padding: '3px 8px', borderRadius: 10, color: '#fff',
                  }}>
                    {isTrained ? 'AI PERSONALIZED' : 'AI LEARNING'}
                  </span>
                </h2>
                <div className="video-grid">
                  {videos.map(v => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      rating={ratings[v.id]}
                      onRate={liked => handleRate(v, liked)}
                      isTrained={isTrained}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {likedVideos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#444' }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>🎯</div>
                <p style={{ fontSize: 15, color: '#666' }}>No videos curated yet.</p>
                <p style={{ marginTop: 8, fontSize: 13, color: '#444' }}>
                  Rate videos in the Rate tab and the AI will learn what you love.
                </p>
              </div>
            ) : (
              <>
                <h2 style={{
                  fontSize: 15, fontWeight: 600, color: '#999',
                  marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  MyTube — Videos I know you&apos;ll love
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    background: 'linear-gradient(90deg, #ff4444, #ff8800)',
                    padding: '3px 8px', borderRadius: 10, color: '#fff',
                  }}>AI CURATED</span>
                </h2>
                <div className="video-grid">
                  {likedVideos.map(v => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      rating={true}
                      onRate={liked => {
                        if (!liked) {
                          removeLikedVideo(v.id)
                          saveRating(v.id, false)
                          setLikedVideos(getLikedVideos())
                          setRatings(getRatings())
                          toast('Removed from MyTube 👎')
                        }
                      }}
                      isTrained={true}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* ── Toast notification ── */}
      {note && (
        <div style={{
          position: 'fixed', top: 74, right: 18, zIndex: 999,
          background: '#1a1a1a', border: '1px solid #333',
          borderRadius: 9, padding: '11px 16px',
          color: '#e8e8e8', fontSize: 13,
          boxShadow: '0 6px 28px rgba(0,0,0,0.6)',
          animation: 'slideIn 0.3s ease',
        }}>
          {note}
        </div>
      )}
    </div>
  )
}
