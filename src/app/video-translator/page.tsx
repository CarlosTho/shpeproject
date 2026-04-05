'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VideoTranslatorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if hackathon app is accessible on either port
    const checkApp = async () => {
      try {
        // Try port 5173 first
        const response1 = await fetch('http://localhost:5173', { mode: 'no-cors' })
        setIsLoading(false)
        return
      } catch (error) {
        try {
          // Fallback to port 5174
          const response2 = await fetch('http://localhost:5174', { mode: 'no-cors' })
          setIsLoading(false)
          return
        } catch (error2) {
          console.log('Hackathon app not accessible on either port, redirecting to 5173...')
          window.location.href = 'http://localhost:5173'
        }
      }
    }
    
    const timer = setTimeout(() => setIsLoading(false), 2000)
    checkApp()
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <main className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 mx-auto"></div>
          <p className="text-sm text-slate-600">Loading video translator...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen flex flex-col">
      {/* Minimal header */}
      <header className="flex-shrink-0 px-4 py-2 border-b border-slate-200 bg-white">
        <h1 className="text-lg font-semibold text-slate-900">
          Video Translator
        </h1>
      </header>

      {/* Full-height embedded app */}
      <div className="flex-1 min-h-0">
        <iframe
          src="http://localhost:5173?embedded=true"
          className="w-full h-full border-0"
          title="Video Translator App"
          allow="microphone; camera; fullscreen; autoplay; encrypted-media"
          style={{
            height: 'calc(100vh - 60px)',
            minHeight: 'calc(100vh - 60px)'
          }}
        />
      </div>
    </main>
  )
}
