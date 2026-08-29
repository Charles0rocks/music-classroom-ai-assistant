const { execSync } = require('child_process');
const fs = require('fs');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const targetUrl = "https://gemini.google.com/share/7ef73b6f8dce?skid=2519aeca-0eb6-4430-b61e-1ae5eccb0b86";

console.log("Launching Edge headless...");
try {
  const html = execSync(`"${edgePath}" --headless --disable-gpu --virtual-time-budget=10000 --dump-dom "${targetUrl}"`, {
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024
  });
  console.log("HTML length:", html.length);
  fs.writeFileSync('scratch/gemini_rendered.html', html, 'utf-8');
  
  // Extract text inside message containers or all paragraphs
  const chineseMatches = html.match(/[\u4e00-\u9fa5]{2,}/g);
  if (chineseMatches) {
    const unique = [...new Set(chineseMatches)];
    console.log("Found unique Chinese words:", unique.length);
    console.log(unique.filter(w => w.length > 2).slice(0, 50));
  } else {
    console.log("No Chinese matches in rendered DOM.");
  }
} catch (e) {
  console.error("Error executing Edge:", e.message);
}
