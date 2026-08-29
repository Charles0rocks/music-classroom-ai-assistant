const { execSync } = require('child_process');
const path = require('path');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const targetUrl = "https://gemini.google.com/share/7ef73b6f8dce?skid=2519aeca-0eb6-4430-b61e-1ae5eccb0b86";
const outPath = path.resolve(__dirname, 'gemini_share.png');

console.log("Taking Edge screenshot with user profile...");
try {
  execSync(`"${edgePath}" --headless=new --window-size=1280,1600 --screenshot="${outPath}" "${targetUrl}"`);
  console.log("Screenshot taken successfully!");
} catch (e) {
  console.error("Screenshot error:", e.message);
}
