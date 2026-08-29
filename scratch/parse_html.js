const fs = require('fs');
const html = fs.readFileSync('scratch/gemini_rendered.html', 'utf-8');

// Search for any unicode escapes and decode them
const decoded = html.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
fs.writeFileSync('scratch/decoded.txt', decoded, 'utf-8');

const chinese = decoded.match(/[\u4e00-\u9fa5]{2,}/g);
if (chinese) {
  console.log("Decoded Chinese words count:", chinese.length);
  console.log("Decoded Chinese words:", [...new Set(chinese)].filter(w => w.length >= 2).slice(0, 100));
} else {
  console.log("Still no Chinese words found in decoded.txt");
}
