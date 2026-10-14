import { NextRequest, NextResponse } from 'next/server'
import ytdl from 'ytdl-core'
import { extractVideoId } from '@/lib/youtube'
import { Readable } from 'stream'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL manquante' }, { status: 400 })
  }

  const videoId = extractVideoId(url)

  if (!videoId) {
    return NextResponse.json({ error: 'URL YouTube invalide' }, { status: 400 })
  }

  try {
    const info = await ytdl.getInfo(videoId)
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '') // Basic sanitization

    // Choose the best video format (with audio if possible, otherwise just highest res)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' })

    // Create a stream
    const stream = ytdl(url, { format: format })
    const webStream = Readable.toWeb(stream)

    // Use NextResponse to return the stream directly
    const res = new NextResponse(webStream as any, {
      headers: {
        'Content-Disposition': `attachment; filename="${title}.mp4"`,
        'Content-Type': 'video/mp4',
      },
    })

    return res
  } catch (error: any) {
    console.error('Erreur de téléchargement YouTube:', error)
    return NextResponse.json({ error: 'Impossible de télécharger la vidéo' }, { status: 500 })
  }
}
