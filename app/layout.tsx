import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'TinyLink - URL Shortener',
  description: 'Shorten your URLs with ease. Create short links, track clicks, and manage your shortened URLs.',
  generator: 'tiny-link',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
