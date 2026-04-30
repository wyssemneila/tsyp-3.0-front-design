import type { Ratings, LikedVideo } from './types'

const RATINGS_KEY = 'vif_ratings'
const LIKED_KEY   = 'vif_liked'

function safe<T>(fn: () => T, fallback: T): T {
  try { return fn() } catch { return fallback }
}

export function getRatings(): Ratings {
  if (typeof window === 'undefined') return {}
  return safe(() => JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}'), {})
}

export function saveRating(videoId: string, liked: boolean): void {
  const r = getRatings()
  r[videoId] = liked
  localStorage.setItem(RATINGS_KEY, JSON.stringify(r))
}

export function getLikedVideos(): LikedVideo[] {
  if (typeof window === 'undefined') return []
  return safe(() => JSON.parse(localStorage.getItem(LIKED_KEY) || '[]'), [])
}

export function saveLikedVideo(video: LikedVideo): void {
  const list = getLikedVideos()
  const idx  = list.findIndex(v => v.id === video.id)
  if (idx >= 0) list[idx] = video
  else list.unshift(video)
  localStorage.setItem(LIKED_KEY, JSON.stringify(list))
}

export function removeLikedVideo(videoId: string): void {
  const list = getLikedVideos().filter(v => v.id !== videoId)
  localStorage.setItem(LIKED_KEY, JSON.stringify(list))
}
