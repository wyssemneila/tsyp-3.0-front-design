import { NextRequest, NextResponse } from 'next/server'

const YT = 'https://www.googleapis.com/youtube/v3'

function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K views`
  return `${n} views`
}

export async function GET(req: NextRequest) {
  const q   = req.nextUrl.searchParams.get('q') || 'programming tutorial'
  const key = process.env.YOUTUBE_API_KEY

  if (!key) {
    return NextResponse.json(
      { success: false, error: 'YouTube API key not configured. Add YOUTUBE_API_KEY to your environment variables.' },
      { status: 500 },
    )
  }

  try {
    const searchRes = await fetch(
      `${YT}/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=20&relevanceLanguage=en&key=${key}`,
    )
    const searchData = await searchRes.json()

    if (!searchRes.ok) {
      const msg = searchData?.error?.message || 'YouTube API error'
      return NextResponse.json({ success: false, error: msg }, { status: 400 })
    }

    const items: Array<{ id: { videoId: string }; snippet: Record<string, unknown> }> =
      searchData.items || []
    const ids = items.map(i => i.id.videoId).join(',')

    const statsRes  = await fetch(`${YT}/videos?part=statistics&id=${ids}&key=${key}`)
    const statsData = await statsRes.json()

    const statsMap: Record<string, { viewCount?: string }> = {}
    for (const item of statsData.items || []) {
      statsMap[item.id] = item.statistics
    }

    const videos = items.map(item => {
      const s       = item.snippet as Record<string, unknown>
      const thumbs  = s.thumbnails as Record<string, { url: string }> | undefined
      const thumb   = thumbs?.medium?.url || thumbs?.default?.url || ''
      const stats   = statsMap[item.id.videoId] || {}
      return {
        id:         item.id.videoId,
        title:      String(s.title ?? ''),
        channel:    String(s.channelTitle ?? ''),
        thumbnail:  thumb,
        url:        `https://www.youtube.com/watch?v=${item.id.videoId}`,
        views:      fmtViews(parseInt(stats.viewCount || '0')),
        confidence: 50,
      }
    })

    return NextResponse.json({ success: true, videos })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
