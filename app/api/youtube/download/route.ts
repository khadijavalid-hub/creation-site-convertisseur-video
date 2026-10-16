import { NextRequest, NextResponse } from 'next/server'
import { Innertube, UniversalCache } from 'youtubei.js'
import { extractVideoId } from '@/lib/youtube'
import vm from 'vm'

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
      clientType: 'IOS',
    })

    const youtubeiExports = await import('youtubei.js');
    let Platform = (youtubeiExports as any).Utils?.Platform;
    if (!Platform && youtubeiExports.default) {
       Platform = (youtubeiExports.default as any).Utils?.Platform;
    }

    // Explicitly setup node runtime `vm` eval for Next.js Server Components since they don't seem to load it by default
    if (Platform && Platform.shim) {
      Platform.shim.eval = (code: any, env: any) => {
         let scriptToRun = code.output || code;

         // Youtubei.js typically provides code that has a `return process(...)` at the end
         // vm.runInNewContext throws "Illegal return statement" if there is a top-level return.
         // Let's wrap it in an IIFE
         if (typeof scriptToRun === 'string' && scriptToRun.includes('return ')) {
             scriptToRun = `(() => { ${scriptToRun} })()`;
         }

         return vm.runInNewContext(scriptToRun, env);
      }
    }

    const info = await yt.getBasicInfo(videoId)
    const format = info.chooseFormat({
      type: 'video+audio',
      quality: 'best'
    })

    let finalUrl = format.url;
    if (!finalUrl && format.signature_cipher) {
        finalUrl = await format.decipher(yt.session.player);
    }

    if (!finalUrl) {
        throw new Error("No format found")
    }

    return NextResponse.redirect(finalUrl)
  } catch (error: any) {
    console.error('Erreur de téléchargement YouTube:', error)
    return NextResponse.json({ error: 'Impossible de télécharger la vidéo. La protection bot de YouTube bloque peut-être la requête.' }, { status: 500 })
  }
}
