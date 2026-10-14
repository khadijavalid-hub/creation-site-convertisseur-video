const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function isValidVideoId(id: string) {
  return VIDEO_ID_PATTERN.test(id)
}

export function extractVideoId(input: string): string | null {
  const value = input.trim()
  if (isValidVideoId(value)) return value

  let url: URL
  try {
    url = new URL(value.startsWith('http') ? value : `https://${value}`)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '')
  let candidate: string | null = null

  if (host === 'youtu.be') {
    candidate = url.pathname.split('/')[1] ?? null
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') {
      candidate = url.searchParams.get('v')
    } else {
      const match = url.pathname.match(/^\/(shorts|embed|live|v)\/([^/?#]+)/)
      candidate = match?.[2] ?? null
    }
  }

  return candidate && isValidVideoId(candidate) ? candidate : null
}

export const THUMBNAIL_QUALITIES = [
  { key: 'maxresdefault', label: 'Full HD', size: '1280 × 720' },
  { key: 'sddefault', label: 'Standard', size: '640 × 480' },
  { key: 'hqdefault', label: 'Haute qualité', size: '480 × 360' },
  { key: 'mqdefault', label: 'Moyenne', size: '320 × 180' },
] as const

export type ThumbnailQuality = (typeof THUMBNAIL_QUALITIES)[number]['key']

export function thumbnailUrl(id: string, quality: ThumbnailQuality) {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`
}

export type VideoInfo = {
  id: string
  title: string
  authorName: string
  authorUrl: string
}
