import '../globals.css'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Notion on Next.js',
  description: 'This is template app',
}

export default function PageLayout({children}: {
  children: React.ReactNode
}) {
  return (
      <html lang='ja'>
      <body>{children}</body>
      </html>
  )
}
