import { extractVideoId, type VideoInfo } from '@/lib/youtube'

export async function GET(request: Request) {
  const input = new URL(request.url).searchParams.get('url') ?? ''
  const id = extractVideoId(input)

  if (!id) {
    return Response.json({ error: 'Lien YouTube invalide.' }, { status: 400 })
  }

  const oembed = new URL('https://www.youtube.com/oembed')
  oembed.searchParams.set('url', `https://www.youtube.com/watch?v=${id}`)
  oembed.searchParams.set('format', 'json')

  const res = await fetch(oembed, { next: { revalidate: 3600 } })

  if (!res.ok) {
    return Response.json(
      { error: 'Vidéo introuvable, privée ou non intégrable.' },
      { status: 404 },
    )
  }

  const data = (await res.json()) as { title: string; author_name: string; author_url: string }
  const info: VideoInfo = {
    id,
    title: data.title,
    authorName: data.author_name,
    authorUrl: data.author_url,
  }

  return Response.json(info)
}
