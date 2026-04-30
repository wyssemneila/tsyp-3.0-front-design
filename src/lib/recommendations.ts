import type { Video, LikedVideo } from './types'

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
}

export function scoreVideos(
  videos: Video[],
  likedVideos: LikedVideo[],
  totalRatings: number,
): Video[] {
  if (totalRatings < 5 || likedVideos.length === 0) {
    return videos.map(v => ({ ...v, confidence: 50 }))
  }

  const kw: Record<string, number> = {}
  const ch: Record<string, number> = {}

  for (const v of likedVideos) {
    tokenize(v.title).forEach(w => { kw[w] = (kw[w] || 0) + 2 })
    ch[v.channel] = (ch[v.channel] || 0) + 3
  }

  const raw = videos.map(v => {
    const words = tokenize(v.title)
    return words.reduce((s, w) => s + (kw[w] || 0), 0) + (ch[v.channel] || 0)
  })

  const max = Math.max(...raw, 1)

  return videos.map((v, i) => ({
    ...v,
    confidence: Math.min(Math.max(Math.round((raw[i] / max) * 84 + 15), 10), 99),
  }))
}
