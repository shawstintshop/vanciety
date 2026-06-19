#!/usr/bin/env python3
import json, re
from pathlib import Path
import requests
from bs4 import BeautifulSoup

UA='Mozilla/5.0 (compatible; VancietyVanIntelligence/1.0)'
urls = [
'https://www.vanviewer.com/van/2026-mercedes-sprinter-for-sale-in-nicholasville-kentucky/',
'https://www.vanviewer.com/van/2021-mercedes-sprinter-for-sale-in-northfield-vermont/',
'https://www.vanviewer.com/van/2022-mercedes-winnebago-revel-44e-4x4-for-sale-in-incline-village-nevada/',
'https://www.vanviewer.com/van/2023-mercedes-sprinter-for-sale-in-chiefland-florida/',
'https://www.vanviewer.com/van/2025-mercedes-sprinter-for-sale-in-milford-ohio/',
'https://www.vanviewer.com/van/2024-mercedes-sprinter-for-sale-in-bend-oregon-3/',
'https://conversiontrader.com/buy/2026-off-highway-van-davey-jackson-144-pro-2500-awd-sprinter/',
'https://conversiontrader.com/buy/2021-mercedes-benz-3500-170-xd-extended-rwd/',
'https://conversiontrader.com/buy/2021-mercedes-sprinter-170-stealth-off-grid-camper-van/',
'https://conversiontrader.com/buy/2026-doc-holliday-170-pro-by-off-highway-van-mercedes-sprinter-2500-awd/'
]

def meta(soup, prop):
    tag=soup.find('meta', attrs={'property': prop}) or soup.find('meta', attrs={'name': prop})
    return tag.get('content','').strip() if tag else None

def clean(text): return re.sub(r'\s+',' ', text).strip()

items=[]
for url in urls:
    try:
        r=requests.get(url,headers={'User-Agent':UA},timeout=30)
        soup=BeautifulSoup(r.text,'html.parser')
        text=clean(soup.get_text(' ',strip=True))
        title=(soup.find('h1').get_text(' ',strip=True) if soup.find('h1') else None) or meta(soup,'og:title') or url.rstrip('/').split('/')[-1]
        prices=sorted(set(re.findall(r'\$\s?[0-9][0-9,]{3,}', text)), key=lambda x: text.find(x))[:6]
        dates=sorted(set(re.findall(r'(?:Last Modified|Updated|Posted|Listed)\s*:?[ ]*([A-Za-z]+\s+\d{1,2},\s+20\d{2})', text, re.I)))[:3]
        # broad location hints
        locs=[]
        for pat in [r'Location\s*:?[ ]*([^$]{2,80})', r'([A-Z][A-Za-z .-]+,\s*[A-Z][a-z]+(?:\s+\d{5})?)', r'([A-Z][A-Za-z .-]+,\s*[A-Z]{2}\s*\d{5})']:
            m=re.search(pat,text)
            if m: locs.append(clean(m.group(1))[:120])
        items.append({'url':url,'status':r.status_code,'title':clean(title),'prices':prices,'dates':dates,'locations':locs[:3],'og_description':meta(soup,'og:description'), 'text_start': text[:500]})
    except Exception as e:
        items.append({'url':url,'error':repr(e)})
out=Path('/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/.hermes_sprinter_crawl/listing_verify_latest.json')
out.write_text(json.dumps(items,indent=2),encoding='utf-8')
print(out)
print(json.dumps(items,indent=2)[:20000])
