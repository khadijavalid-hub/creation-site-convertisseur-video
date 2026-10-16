import { Innertube, UniversalCache } from 'youtubei.js'
import vm from 'vm'

async function test() {
    const yt = await Innertube.create({
      clientType: 'IOS',
    })

    const { Platform } = await import('youtubei.js/dist/src/utils/Utils.js')

    Platform.shim.eval = (code, env) => {
       return vm.runInNewContext(code.output || code, env);
    }

    const info = await yt.getBasicInfo('dQw4w9WgXcQ')
    const format = info.chooseFormat({
      type: 'video+audio',
      quality: 'best'
    })

    let finalUrl = format.url;
    if (!finalUrl && format.signature_cipher) {
        finalUrl = await format.decipher(yt.session.player);
    }
    console.log(finalUrl);
}
test().catch(console.error);
