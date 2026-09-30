const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateIcons() {
  const inputImage = path.join(__dirname, '../public/assets/muhammad-hasil.png');
  const publicDir = path.join(__dirname, '../public');

  if (!fs.existsSync(inputImage)) {
    console.error('Source image not found:', inputImage);
    process.exit(1);
  }

  console.log('Generating crisp responsive favicons and PWA icons from:', inputImage);

  // 1. Standard Favicon PNGs
  await sharp(inputImage)
    .resize(16, 16, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  await sharp(inputImage)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(inputImage)
    .resize(48, 48, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon-48x48.png'));

  // 2. Apple Touch Icons
  await sharp(inputImage)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(inputImage)
    .resize(152, 152, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon-152x152.png'));

  await sharp(inputImage)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon-180x180.png'));

  // 3. PWA Icons (192 & 512)
  await sharp(inputImage)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  await sharp(inputImage)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 4. PWA Maskable Icon with 15% Safe-Zone Padding
  const innerIconSize = Math.round(512 * 0.76); // ~389px inside 512px canvas
  const innerIconBuffer = await sharp(inputImage)
    .resize(innerIconSize, innerIconSize, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 16, g: 14, b: 12, alpha: 1 } // #100e0c brand background
    }
  })
    .composite([
      {
        input: innerIconBuffer,
        gravity: 'center'
      }
    ])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 5. favicon.ico copy (32x32 png as ico fallback)
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all responsive favicon and PWA icons!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
