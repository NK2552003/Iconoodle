import './globals.css'
import SiteHeader from '../components/site-header'

export const metadata = {
  title: 'Iconoodle',
  description: 'Iconoodle — Free, editable doodles and icons (SVGs)',
  metadataBase: new URL('https://nk2552003.github.io/Iconoodle/'),
  openGraph: {
    title: 'Iconoodle',
    description: 'Free, editable doodles and icons (SVGs)',
    url: 'https://nk2552003.github.io/Iconoodle/',
    images: ['/iconoodle.svg'],
  },
  twitter: {
    card: 'summary',
    title: 'Iconoodle',
    images: ['/iconoodle.svg'],
  },
  icons: {
    icon: '/iconoodle.svg',
    shortcut: '/iconoodle.svg',
    apple: '/iconoodle.svg',
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
