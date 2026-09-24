import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { iconSvg } from './icon-design.js';

// Regenerates every app icon from scripts/icon-design.js:
//   public/icon.svg, PWA PNGs, favicon, and Android launcher icons (legacy + adaptive layers).

const render = (svg, size) => sharp(Buffer.from(svg), { density: 72 * (size / 512) * 2 }).resize(size, size).png();

async function writePng(svg, size, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await render(svg, size).toFile(file);
  console.log('Created', path.relative(process.cwd(), file));
}

async function generateIcons() {
  const tile = iconSvg.tile();
  const maskable = iconSvg.maskable();

  fs.writeFileSync('public/icon.svg', tile);
  console.log('Created public/icon.svg');

  // PWA / web
  await writePng(tile, 192, 'public/pwa-192x192.png');
  await writePng(tile, 512, 'public/pwa-512x512.png');
  await writePng(maskable, 512, 'public/pwa-maskable-512x512.png');
  await writePng(maskable, 180, 'public/apple-touch-icon.png'); // iOS rounds the corners itself
  await writePng(tile, 64, 'public/favicon.ico');

  // Android launcher. Legacy icons (API < 26) are 48dp; adaptive layers are 108dp.
  const res = 'android/app/src/main/res';
  const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  const roundMask = Buffer.from('<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="#fff"/></svg>');

  for (const [density, scale] of Object.entries(densities)) {
    const dir = `${res}/mipmap-${density}`;
    const legacy = Math.round(48 * scale);
    const layer = Math.round(108 * scale);

    await writePng(tile, legacy, `${dir}/ic_launcher.png`);

    // sharp resizes before compositing, so mask at full size first, then scale down.
    const round = await sharp(await render(maskable, 512).toBuffer())
      .composite([{ input: roundMask, blend: 'dest-in' }]).png().toBuffer();
    await sharp(round).resize(legacy, legacy).png().toFile(`${dir}/ic_launcher_round.png`);
    console.log('Created', `${dir}/ic_launcher_round.png`);

    await writePng(iconSvg.adaptiveBackground(), layer, `${dir}/ic_launcher_background.png`);
    await writePng(iconSvg.adaptiveForeground(), layer, `${dir}/ic_launcher_foreground.png`);
    await writePng(iconSvg.adaptiveMonochrome(), layer, `${dir}/ic_launcher_monochrome.png`);
  }

  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
`;
  for (const name of ['ic_launcher', 'ic_launcher_round']) {
    fs.writeFileSync(`${res}/mipmap-anydpi-v26/${name}.xml`, adaptiveXml);
  }
  console.log('Updated Android adaptive icon definitions');
  console.log('All icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
