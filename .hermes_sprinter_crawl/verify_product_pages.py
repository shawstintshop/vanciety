#!/usr/bin/env python3
import json,re,requests
from bs4 import BeautifulSoup
from pathlib import Path
UA='Mozilla/5.0 (compatible; VancietyVanIntelligence/1.0)'
urls=[
('Van Compass SLICE 17x8 wheel','tires_wheels','https://vancompass.com/products/slice-17x8-wheel-in-satin-black-by-van-compass'),
('Owl Vans Sprinter Tire Package BFG KO3','tires_wheels','https://owlvans.com/products/sprinter-tire-package-bfg-ko3'),
('Pioneer DMH-W2770NEX/B','audio_stereo','https://usa.pioneer/products/dmh-w2770nex-b'),
('Alpine iLX-W670 Digital Multimedia Receiver','audio_stereo','https://www.alpine-usa.com/product/ilx-w670'),
('Van Compass 4.3 Stage 3 Suspension System Sprinter 4x4','suspension_performance','https://vancompass.com/products/van-compass-4-3-stage-3-suspension-system-2019-mercedes-sprinter-4x4'),
]
out=[]
for title,cat,url in urls:
 try:
  r=requests.get(url,headers={'User-Agent':UA},timeout=30)
  soup=BeautifulSoup(r.text,'html.parser')
  text=re.sub(r'\s+',' ',soup.get_text(' ',strip=True))
  h1=soup.find('h1')
  page_title=h1.get_text(' ',strip=True) if h1 else (soup.title.get_text(' ',strip=True) if soup.title else title)
  prices=[]
  for p in re.findall(r'\$\s?[0-9][0-9,]*(?:\.\d{2})?', text):
    if p not in prices: prices.append(p.replace(' ',''))
  out.append({'title':page_title,'category':cat,'url':url,'status':r.status_code,'prices':prices[:8],'snippet':text[:350]})
 except Exception as e:
  out.append({'title':title,'category':cat,'url':url,'error':repr(e)})
path=Path('/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/.hermes_sprinter_crawl/product_verify_latest.json')
path.write_text(json.dumps(out,indent=2),encoding='utf-8')
print(path)
print(json.dumps(out,indent=2))
