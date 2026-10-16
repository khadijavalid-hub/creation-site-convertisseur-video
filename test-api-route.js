const { Innertube } = require('youtubei.js');

async function run() {
    const yt = await Innertube.create();
    const info = await yt.getBasicInfo('dQw4w9WgXcQ');
    const format = info.chooseFormat({ type: 'video+audio', quality: 'best' });
    const url = await format.decipher(yt.session.player);
    console.log("Success deciphering natively:", !!url);
}

run().catch(console.error);
