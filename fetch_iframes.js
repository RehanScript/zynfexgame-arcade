const urls = [
  'https://iogames.space/gamepop',
  'https://iogames.space/kart-bros',
  'https://dashmetry.com/icy-dash'
];

async function extractIframe(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const regex = /<iframe[^>]+src=[\"']([^\"']+)[\"']/gi;
    let match;
    console.log('--- ' + url + ' ---');
    while ((match = regex.exec(html)) !== null) {
      console.log('Found iframe src:', match[1]);
    }
  } catch(e) {
    console.log('Error', url, e.message);
  }
}

async function run() {
  for (const u of urls) {
    await extractIframe(u);
  }
}
run();
