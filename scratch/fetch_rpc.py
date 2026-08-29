import urllib.request
import urllib.parse
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Gemini batchexecute RPC endpoint
url = "https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=h0j4ed&bl=boq-bard-web_20240101.00_p0&_reqid=100000&rt=c"

# The request payload for batchexecute
# RPC format: [[[rpc_id, json_payload_str, null, "generic"]]]
payload_data = [
    ["h0j4ed", json.dumps(["7ef73b6f8dce"]), None, "generic"]
]

body = urllib.parse.urlencode({
    'f.req': json.dumps(payload_data),
    'at': ''
}).encode('utf-8')

req = urllib.request.Request(url, data=body, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
})

try:
    res = urllib.request.urlopen(req).read().decode('utf-8')
    print("Response length:", len(res))
    print("Response snippet:", res[:1000])
    # Search for Chinese text
    chinese = re.findall(r'[\u4e00-\u9fa5]{2,}', res)
    print("Chinese found:", chinese[:30])
except Exception as e:
    print("RPC Error:", e)
