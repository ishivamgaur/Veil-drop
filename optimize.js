const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'client', 'public');

const images = [
  'connection_protocol.jpg',
  'privacy_scheme.jpg',
  'cloud_retention.jpg'
];

async function optimize() {
  for (const img of images) {
    const imgPath = path.join(publicDir, img);
    const newName = img.replace('.jpg', '_sm.jpg');
    const newPath = path.join(publicDir, newName);
    
    if (fs.existsSync(imgPath)) {
      const statsBefore = fs.statSync(imgPath);
      console.log(`Optimizing ${img}... (Original: ${(statsBefore.size / 1024).toFixed(2)} KB)`);
      
      const buffer = await sharp(imgPath)
        .resize({ width: 1000 })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
      
      fs.writeFileSync(newPath, buffer);
      console.log(`Saved ${newName} - New size: ${(buffer.length / 1024).toFixed(2)} KB\n`);
    }
  }
}

optimize().catch(console.error);
