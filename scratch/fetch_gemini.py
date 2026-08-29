import urllib.request
import urllib.parse
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = 'https://gemini.google.com/share/7ef73b6f8dce?skid=2519aeca-0eb6-4430-b61e-1ae5eccb0b86'
req_html = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
})

html = urllib.request.urlopen(req_html).read().decode('utf-8')

indices = [m.start() for m in re.finditer(r'7ef73b6f8dce', html)]
print("Indices of 7ef73b6f8dce:", indices)
for idx in indices:
    print("Context around match:")
    print(html[max(0, idx-200):min(len(html), idx+300)])
    print("="*50)
