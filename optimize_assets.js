const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'assets');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.svg')) {
    const p = path.join(dir, file);
    const content = fs.readFileSync(p, 'utf8');
    const match = content.match(/xlink:href="data:image\/(jpeg|png|webp);base64,([^"]+)"/);
    if (match) {
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const base = path.parse(file).name;
      const buf = Buffer.from(match[2], 'base64');
      const outP = path.join(dir, base + '.' + ext);
      fs.writeFileSync(outP, buf);
      console.log(`${file} (${(fs.statSync(p).size/1024/1024).toFixed(2)} MB) -> ${base}.${ext} (${(buf.length/1024/1024).toFixed(2)} MB)`);
    }
  }
});
