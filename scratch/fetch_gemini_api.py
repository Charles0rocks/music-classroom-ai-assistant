import urllib.request
import urllib.parse
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

share_id = "7ef73b6f8dce"

rpc_ids = ["h0j4ed", "vy", "Q7k8", "f7btTe", "u4g7r", "K22Uhf"]

for rpc in rpc_ids:
    url = f"https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids={rpc}&bl=boq-bard-web_20240101.00_p0&_reqid=100000&rt=c"
    
    payload = [[rpc, json.dumps([share_id, None, None, 2]), None, "generic"]]
    body_data = urllib.parse.urlencode({'f.req': json.dumps(payload)}).encode('utf-8')
    
    req = urllib.request.Request(url, data=body_data, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    })
    
    try:
        res = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        print(f"RPC {rpc} response len:", len(res))
        chinese = re.findall(r'[\u4e00-\u9fa5]{2,}', res)
        if chinese:
            print(f"RPC {rpc} Chinese words:", chinese[:30])
        else:
            # Check for unicode escapes
            decoded = res.encode('utf-8').decode('unicode-escape', errors='ignore')
            c_dec = re.findall(r'[\u4e00-\u9fa5]{2,}', decoded)
            if c_dec:
                print(f"RPC {rpc} Decoded Chinese words:", c_dec[:30])
    except Exception as e:
        print(f"RPC {rpc} error:", e)
