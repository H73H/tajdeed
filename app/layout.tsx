import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TAJDEED – UAE Renewals',
  description: 'Never miss a renewal again.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-5xl mx-auto px-4 py-6">{children}</body>
    </html>
  )
}
