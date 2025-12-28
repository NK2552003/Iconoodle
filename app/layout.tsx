import './globals.css'
import SiteHeader from '../components/site-header'

const metadataBase = new URL('https://nk2552003.github.io/Iconoodle/')

export const metadata = {
  title: 'Iconoodle',
  description: 'Iconoodle — Free, editable doodles, icons, and illustrations (SVGs)',
  metadataBase,
  openGraph: {
    title: 'Iconoodle',
    description: 'Free, editable doodles, icons, and illustrations (SVGs)',
    url: metadataBase.toString(),
    images: [new URL('iconoodle.svg', metadataBase).toString()],
  },
  twitter: {
    card: 'summary',
    title: 'Iconoodle',
    images: [new URL('iconoodle.svg', metadataBase).toString()],
  },
  icons: {
    icon: new URL('iconoodle.svg', metadataBase).toString(),
    shortcut: new URL('iconoodle.svg', metadataBase).toString(),
    apple: new URL('iconoodle.svg', metadataBase).toString(),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
