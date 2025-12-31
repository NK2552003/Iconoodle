'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Star, Share2, Code } from 'lucide-react'

const REPO = 'https://github.com/nk2552003/Iconoodle'
const SITE_URL = 'https://nk2552003.github.io/Iconoodle/'

export default function SiteHeader() {
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Iconoodle', text: 'Iconoodle — Doodles & icons', url: SITE_URL })
        setFeedback('Shared!')
      } else {
        await navigator.clipboard.writeText(SITE_URL)
        setFeedback('Link copied!')
      }
    } catch (err) {
      setFeedback('Could not share')
    }

    window.setTimeout(() => setFeedback(null), 2000)
  }

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border md:hidden block ">
      <div className="md:mx-4 px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-accent-foreground shadow">
            {/* Simple inline logo */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 13c1.333-1 2-3 4-3 1.5 0 2.5 1 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 8h2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-lg font-bold text-foreground">Iconoodle</span>
        </Link>

        <div className="flex items-center gap-1">
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
            aria-label="Open Iconoodle GitHub repository"
          >
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Star</span>
          </a>

          <a
            href={`${REPO}/blob/master/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
            aria-label="How to contribute to Iconoodle"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Contribute</span>
          </a>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
            aria-label="Share Iconoodle site"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {feedback ? (
            <span className="ml-2 text-sm text-muted-foreground">{feedback}</span>
          ) : null}
        </div>
      </div>
    </header>
  )
}
