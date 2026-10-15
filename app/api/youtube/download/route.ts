import { NextRequest, NextResponse } from 'next/server'
import { Innertube } from 'youtubei.js'
import { extractVideoId } from '@/lib/youtube'

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
    const yt = await Innertube.create({
      client_type: 'ANDROID',
      retrieve_player: true,
    })

    const info = await yt.getBasicInfo(videoId)
    const title = info.basic_info.title?.replace(/[^\w\s]/gi, '') || 'video'

    const format = info.chooseFormat({
      type: 'video+audio',
      quality: 'best'
    })

    if (!format || !format.url) {
        throw new Error("No format found")
    }

    // Return a direct redirect to avoid proxying the stream and having fetch failures due to YouTube IP protections
    // Also YouTube's URLs already have the right headers usually
    return NextResponse.redirect(format.url)
  } catch (error: any) {
    console.error('Erreur de téléchargement YouTube:', error)
    return NextResponse.json({ error: 'Impossible de télécharger la vidéo. La protection bot de YouTube bloque peut-être la requête.' }, { status: 500 })
  }
}
