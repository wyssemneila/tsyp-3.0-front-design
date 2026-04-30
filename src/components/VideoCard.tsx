'use client'

import type { Video } from '@/lib/types'

interface Props {
  video: Video
  rating: boolean | undefined
  onRate: (liked: boolean) => void
  isTrained: boolean
}

export default function VideoCard({ video, rating, onRate, isTrained }: Props) {
  const confColor =
    video.confidence >= 70 ? '#22c55e' :
    video.confidence >= 50 ? '#ffaa00' : '#ff6b6b'

  return (
    <div
      className="video-card"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'transform 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,68,68,0.35)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      {/* Thumbnail */}
      <div
        style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#1a1a1a', cursor: 'pointer' }}
        onClick={() => window.open(video.url, '_blank')}
      >
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0)',
          transition: 'background 0.2s',
        }} />
        {isTrained && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.88)',
            borderRadius: 12, padding: '3px 9px',
            fontSize: 12, fontWeight: 700, color: confColor,
            border: `1px solid ${confColor}44`,
          }}>
            {video.confidence}% match
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div
          onClick={() => window.open(video.url, '_blank')}
          style={{
            fontSize: 14, fontWeight: 500, lineHeight: 1.4,
            color: '#e8e8e8', marginBottom: 6, cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </div>

        <div style={{ display: 'flex', gap: 6, color: '#777', fontSize: 12, marginBottom: 10 }}>
          <span>{video.channel}</span>
          <span>·</span>
          <span>{video.views}</span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onRate(true)}
            style={{
              flex: 1, padding: '7px 0', borderRadius: 20,
              border: `1px solid ${rating === true ? '#22c55e' : '#2a2a2a'}`,
              background: rating === true ? 'rgba(34,197,94,0.15)' : '#161616',
              color: rating === true ? '#22c55e' : '#aaa',
              cursor: 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all 0.2s',
            }}
          >
            👍 {rating === true ? 'Liked' : 'Like'}
          </button>
          <button
            onClick={() => onRate(false)}
            style={{
              flex: 1, padding: '7px 0', borderRadius: 20,
              border: `1px solid ${rating === false ? '#ff4444' : '#2a2a2a'}`,
              background: rating === false ? 'rgba(255,68,68,0.12)' : '#161616',
              color: rating === false ? '#ff6b6b' : '#aaa',
              cursor: 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all 0.2s',
            }}
          >
            👎 {rating === false ? 'Disliked' : 'Dislike'}
          </button>
        </div>
      </div>
    </div>
  )
}
