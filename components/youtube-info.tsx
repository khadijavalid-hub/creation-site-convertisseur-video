'use client'

import { useState } from 'react'
import { Download, ExternalLink, Link2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { THUMBNAIL_QUALITIES, thumbnailUrl, type VideoInfo } from '@/lib/youtube'

export function YoutubeInfo() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [downloadingVideo, setDownloadingVideo] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/youtube?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInfo(data)
    } catch (err) {
      setInfo(null)
      setError(err instanceof Error && err.message ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="yt-url" className="sr-only">
          Lien de la vidéo YouTube
        </label>
        <div className="relative flex-1">
          <Link2
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="yt-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="h-12 w-full rounded-lg border bg-background pl-10 pr-3 text-base outline-none transition-shadow focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30"
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-6 text-base" disabled={loading || !url.trim()}>
          {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Analyser
        </Button>
      </form>

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {info ? (
        <div className="flex flex-col gap-4">
          <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${info.id}`}
              title={info.title}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-pretty font-semibold leading-snug">{info.title}</h3>
            <a
              href={info.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              {info.authorName}
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t">
             <Button
                size="lg"
                className="w-full h-12 text-base"
                disabled={downloadingVideo}
                onClick={async () => {
                  setDownloadingVideo(true)
                  try {
                    const res = await fetch(`/api/youtube/download?url=${encodeURIComponent(url)}`)
                    if (!res.ok) {
                      const data = await res.json()
                      throw new Error(data.error || 'Erreur lors du téléchargement')
                    }
                    const blob = await res.blob()
                    const downloadUrl = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.style.display = 'none'
                    a.href = downloadUrl
                    const contentDisposition = res.headers.get('content-disposition')
                    let filename = `${info.title.replace(/[^\w\s]/gi, '')}.mp4`
                    if (contentDisposition && contentDisposition.includes('filename=')) {
                        const match = contentDisposition.match(/filename="?([^"]+)"?/)
                        if (match?.[1]) filename = match[1]
                    }
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(downloadUrl)
                    a.remove()
                  } catch (err) {
                    setError(err instanceof Error && err.message ? err.message : 'Une erreur est survenue.')
                  } finally {
                    setDownloadingVideo(false)
                  }
                }}
             >
                {downloadingVideo ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Download className="mr-2 size-5" />}
                Télécharger la vidéo (MP4)
             </Button>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t">
            <p className="text-sm font-medium text-muted-foreground">Télécharger la miniature</p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {THUMBNAIL_QUALITIES.map((q) => (
                <li key={q.key}>
                  <a
                    href={`/api/thumbnail?id=${info.id}&q=${q.key}`}
                    download
                    className="group flex flex-col overflow-hidden rounded-lg border transition-colors hover:border-primary"
                  >
                    <img
                      src={thumbnailUrl(info.id, 'mqdefault')}
                      alt=""
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                    <span className="flex items-center justify-between gap-1 px-2.5 py-2">
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">{q.label}</span>
                        <span className="text-xs text-muted-foreground">{q.size}</span>
                      </span>
                      <Download
                        className="size-4 text-muted-foreground group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          Titre, chaîne, lecteur intégré et miniatures HD via l&apos;API officielle de YouTube.
        </p>
      )}
    </div>
  )
}
