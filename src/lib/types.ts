export interface Video {
  id: string
  title: string
  channel: string
  thumbnail: string
  url: string
  views: string
  confidence: number
}

export interface LikedVideo extends Video {
  ratedAt: number
}

export interface Ratings {
  [videoId: string]: boolean
}
