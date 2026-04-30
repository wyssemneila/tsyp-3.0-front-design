import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Video Inspiration — AI-Powered YouTube Recommendations',
  description: 'Discover videos you love. Rate videos to train your personal AI recommendation engine.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
