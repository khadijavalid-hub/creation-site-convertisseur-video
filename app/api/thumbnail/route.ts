import { isValidVideoId, THUMBNAIL_QUALITIES, thumbnailUrl } from '@/lib/youtube'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const id = params.get('id') ?? ''
  const quality = params.get('q') ?? 'hqdefault'

  const startIndex = THUMBNAIL_QUALITIES.findIndex((q) => q.key === quality)
  if (!isValidVideoId(id) || startIndex === -1) {
    return new Response('Paramètres invalides', { status: 400 })
  }

  for (const { key } of THUMBNAIL_QUALITIES.slice(startIndex)) {
    const res = await fetch(thumbnailUrl(id, key))
    if (res.ok) {
      return new Response(res.body, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="miniature-${id}-${key}.jpg"`,
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }
  }

  return new Response('Miniature introuvable', { status: 404 })
}
