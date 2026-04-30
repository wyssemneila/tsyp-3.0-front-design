import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lando Norris — McLaren F1 Driver',
  description: 'Official portfolio of Lando Norris. On track. Off track. No limits.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
