const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'assests');
const outDir = path.join(__dirname, 'public', 'assets');

const files = fs.readdirSync(srcDir);

files.forEach(file => {
  if (file.endsWith('.svg')) {
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/xlink:href="data:image\/(jpeg|png);base64,([^"]+)"/);
    if (match) {
      const ext = match[1] === 'png' ? 'png' : 'jpg';
      const baseName = file.replace('.svg', '').replace(/[\s\(\)]+/g, '_');
      const outPath = path.join(outDir, baseName + '.' + ext);
      fs.writeFileSync(outPath, Buffer.from(match[2], 'base64'));
      console.log(`Extracted: ${file} -> ${baseName}.${ext}`);
    }
  }
});

// Copy photo_6010464546872561768_y (1) 1.svg explicitly as center-tall.jpg
const specialFile = path.join(srcDir, 'photo_6010464546872561768_y (1) 1.svg');
if (fs.existsSync(specialFile)) {
  const content = fs.readFileSync(specialFile, 'utf8');
  const match = content.match(/xlink:href="data:image\/(jpeg|png);base64,([^"]+)"/);
  if (match) {
    fs.writeFileSync(path.join(outDir, 'center-tall.jpg'), Buffer.from(match[2], 'base64'));
    console.log('Saved center-tall.jpg');
  }
}
