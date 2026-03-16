import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Syne } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const syne = Syne({ subsets: ['latin'], variable: '--font-display' })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Trading Course',
  description: 'Interactive Forex trading education platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${syne.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
