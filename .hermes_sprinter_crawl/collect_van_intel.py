#!/usr/bin/env python3
import json, re, sys, subprocess, time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote_plus, urljoin

import requests
from bs4 import BeautifulSoup
import feedparser

UA = "Mozilla/5.0 (compatible; VancietyVanIntelligence/1.0; public-source monitoring)"
HEADERS = {"User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}
ROOT = Path('/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app')
OUTDIR = ROOT / '.hermes_sprinter_crawl'
OUTDIR.mkdir(exist_ok=True)

def fetch(url, timeout=25):
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
        return {"url": url, "final_url": r.url, "status": r.status_code, "text": r.text, "error": None}
    except Exception as e:
        return {"url": url, "final_url": url, "status": None, "text": "", "error": repr(e)}

def text_of(obj):
    if isinstance(obj, dict):
        if 'simpleText' in obj: return obj.get('simpleText') or ''
        if 'runs' in obj: return ''.join(run.get('text','') for run in obj.get('runs') or [])
    return ''

def find_video_renderers(node, out):
    if isinstance(node, dict):
        if 'videoRenderer' in node:
            out.append(node['videoRenderer'])
        for v in node.values():
            find_video_renderers(v, out)
    elif isinstance(node, list):
        for v in node:
            find_video_renderers(v, out)

def extract_initial_data(html):
    marker = 'var ytInitialData = '
    idx = html.find(marker)
    if idx < 0:
        marker = 'ytInitialData = '
        idx = html.find(marker)
    if idx < 0:
        return None
    start = html.find('{', idx)
    if start < 0: return None
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(html)):
        c = html[i]
        if in_str:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == '"': in_str = False
        else:
            if c == '"': in_str = True
            elif c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return html[start:i+1]
    return None

def youtube_search(query, max_items=6):
    # sp=CAISBAgDEAE is an upload-date-style public search filter observed to surface fresh videos.
    url = f"https://www.youtube.com/results?search_query={quote_plus(query)}&sp=CAISBAgDEAE"
    res = fetch(url, timeout=30)
    items = []
    if res['status'] != 200:
        return {"query": query, "url": url, "status": res['status'], "error": res['error'], "items": []}
    blob = extract_initial_data(res['text'])
    if not blob:
        return {"query": query, "url": url, "status": res['status'], "error": "ytInitialData not found", "items": []}
    try:
        data = json.loads(blob)
    except Exception as e:
        return {"query": query, "url": url, "status": res['status'], "error": f"json parse {e}", "items": []}
    renderers = []
    find_video_renderers(data, renderers)
    seen = set()
    for vr in renderers:
        vid = vr.get('videoId')
        if not vid or vid in seen: continue
        seen.add(vid)
        title = text_of(vr.get('title'))
        channel = text_of(vr.get('ownerText')) or text_of(vr.get('shortBylineText'))
        published = text_of(vr.get('publishedTimeText'))
        views = text_of(vr.get('viewCountText'))
        dur = text_of(vr.get('lengthText'))
        if title:
            items.append({"video_id": vid, "title": title, "url": f"https://www.youtube.com/watch?v={vid}", "channel": channel, "published_text": published, "views_text": views, "duration": dur, "source_query": query})
        if len(items) >= max_items: break
    return {"query": query, "url": url, "status": 200, "items": items, "error": None}

def verify_ytdlp(video):
    # Use yt-dlp metadata as a second public verification layer; if blocked, retain YouTube search metadata only.
    fmt = '%(upload_date)s\t%(title)s\t%(webpage_url)s\t%(uploader)s\t%(view_count)s'
    try:
        cp = subprocess.run(['yt-dlp','--skip-download','--no-warnings','--print',fmt, video['url']], capture_output=True, text=True, timeout=75)
        if cp.returncode == 0 and cp.stdout.strip():
            line = cp.stdout.strip().splitlines()[-1]
            parts = line.split('\t')
            if len(parts) >= 5:
                video['upload_date'] = parts[0] if parts[0] != 'NA' else None
                video['title'] = parts[1] or video['title']
                video['url'] = parts[2] or video['url']
                video['channel'] = parts[3] or video.get('channel')
                video['view_count'] = parts[4] if parts[4] != 'NA' else None
                video['yt_dlp_verified'] = True
        else:
            video['yt_dlp_error'] = (cp.stderr or cp.stdout)[-300:]
            video['yt_dlp_verified'] = False
    except Exception as e:
        video['yt_dlp_error'] = repr(e)
        video['yt_dlp_verified'] = False
    return video

def sprinter_source_rss():
    url = 'https://sprinter-source.com/forums/index.php?forums/-/index.rss'
    fp = feedparser.parse(url, request_headers={'User-Agent': UA})
    entries = []
    for e in fp.entries[:12]:
        entries.append({
            'title': e.get('title'),
            'url': e.get('link'),
            'published': e.get('published'),
            'updated': e.get('updated'),
            'source': 'Sprinter Source RSS',
            'summary': BeautifulSoup(e.get('summary',''), 'html.parser').get_text(' ', strip=True)[:250],
        })
    return {'url': url, 'status': getattr(fp, 'status', None), 'entries': entries, 'bozo': getattr(fp, 'bozo', None)}

def parse_vanviewer():
    urls = [
        'https://www.vanviewer.com/van/?make=Mercedes',
        'https://www.vanviewer.com/van/?s=Winnebago+Revel',
    ]
    all_items = []
    for url in urls:
        res = fetch(url, timeout=35)
        soup = BeautifulSoup(res['text'], 'html.parser')
        seen = set()
        for a in soup.find_all('a', href=True):
            href = urljoin(url, a['href'])
            if '/van/' not in href or href.rstrip('/') in ['https://www.vanviewer.com/van']:
                continue
            if href in seen: continue
            seen.add(href)
            title = a.get_text(' ', strip=True)
            card = a.find_parent(['article','li','div'])
            # climb up a little to capture price/location snippets
            node = card
            for _ in range(2):
                if node and len(node.get_text(' ', strip=True)) < 80:
                    node = node.find_parent(['article','li','div'])
            snippet = (node or a).get_text(' ', strip=True)
            if len(snippet) > 900: snippet = snippet[:900]
            if not title or len(title) < 4:
                mtitle = re.search(r'((?:20\d{2}|19\d{2})\s+[^$|]+?(?:Sprinter|Mercedes|Revel|Winnebago)[^$|]{0,80})', snippet, re.I)
                title = mtitle.group(1).strip() if mtitle else ''
            if re.search(r'(sprinter|mercedes|revel|winnebago)', (title + ' ' + snippet), re.I):
                price = None
                pm = re.search(r'\$\s?[0-9][0-9,]{3,}', snippet)
                if pm: price = pm.group(0).replace(' ', '')
                loc = None
                lm = re.search(r'Location\s*:?\s*([^|$]{3,90})', snippet, re.I)
                if lm: loc = lm.group(1).strip()
                mod = None
                mm = re.search(r'Last Modified\s*:?\s*([A-Za-z]+\s+\d{1,2},\s+20\d{2})', snippet, re.I)
                if mm: mod = mm.group(1)
                all_items.append({'title': title[:180], 'url': href, 'price': price, 'location': loc, 'last_modified': mod, 'snippet': snippet[:300], 'source_page': url, 'status': res['status']})
    # de-dupe preserve order
    out=[]; seen=set()
    for it in all_items:
        if it['url'] not in seen:
            seen.add(it['url']); out.append(it)
    return out[:20]

def parse_conversiontrader_from_sitemap():
    urls=[]
    for sm in ['https://conversiontrader.com/sitemap.xml','https://conversiontrader.com/post-sitemap.xml','https://conversiontrader.com/page-sitemap.xml']:
        res=fetch(sm,timeout=25)
        for loc in re.findall(r'<loc>(.*?)</loc>', res['text']):
            if '/buy/' in loc:
                urls.append(loc)
    urls=list(dict.fromkeys(urls))[:40]
    items=[]
    for url in urls:
        res=fetch(url,timeout=25)
        if res['status'] != 200: continue
        text=BeautifulSoup(res['text'],'html.parser').get_text(' ',strip=True)
        if not re.search(r'(sprinter|mercedes|revel|winnebago)', text, re.I):
            continue
        title=''
        soup=BeautifulSoup(res['text'],'html.parser')
        if soup.find('h1'): title=soup.find('h1').get_text(' ',strip=True)
        if not title:
            mt=re.search(r'((?:20\d{2}|19\d{2})[^|]{0,120}(?:Sprinter|Mercedes|Revel|Winnebago)[^|]{0,120})', text, re.I)
            title=mt.group(1).strip() if mt else url.rstrip('/').split('/')[-1].replace('-',' ').title()
        price=None
        pm=re.search(r'\$\s?[0-9][0-9,]{3,}', text)
        if pm: price=pm.group(0).replace(' ','')
        zipm=re.search(r'([A-Z][A-Za-z .-]+,\s*[A-Z]{2}\s*\d{5})', text)
        items.append({'title': title[:180], 'url': url, 'price': price, 'location': zipm.group(1) if zipm else None, 'snippet': text[:350]})
        time.sleep(0.2)
    return items[:15]

def source_statuses():
    checks = [
        ('eBay Winnebago Revel search', 'https://www.ebay.com/sch/i.html?_nkw=winnebago+revel&_sop=10'),
        ('eBay Sprinter parts search', 'https://www.ebay.com/sch/i.html?_nkw=mercedes+sprinter+van+parts&_sop=10'),
        ('Craigslist SF Bay Sprinter RSS', 'https://sfbay.craigslist.org/search/sss?query=sprinter%20van&sort=date&format=rss'),
        ('Reddit r/SprinterVans public JSON', 'https://www.reddit.com/r/SprinterVans/new.json?limit=5'),
    ]
    out=[]
    for name,url in checks:
        res=fetch(url,timeout=20)
        out.append({'name': name, 'url': url, 'status': res['status'], 'final_url': res['final_url'], 'bytes': len(res['text']), 'error': res['error']})
    return out

def official_event_checks():
    targets=[
        ('Northwest Overland Rally 2026','https://www.nwoverlandrally.com/'),
        ('Adventure Van Expo Hood River','https://www.adventurevanexpo.com/hood-river-or/'),
        ('Adventure Van Expo','https://www.adventurevanexpo.com/'),
        ('Overland Expo PNW','https://www.overlandexpo.com/pacific-northwest/'),
    ]
    out=[]
    for name,url in targets:
        res=fetch(url,timeout=30)
        text=BeautifulSoup(res['text'],'html.parser').get_text(' ',strip=True)
        snippets=[]
        for pat in [r'(June\s+\d{1,2}\s*[–-]\s*\d{1,2},?\s*2026[^.]{0,160})', r'(June\s+\d{1,2}\s*[–-]\s*\d{1,2}[^.]{0,160})', r'(Hood River[^.]{0,160})', r'(Redmond,?\s*OR[^.]{0,160})', r'(Plain,?\s*WA[^.]{0,160})']:
            m=re.search(pat,text,re.I)
            if m: snippets.append(m.group(1)[:220])
        out.append({'title':name,'url':url,'status':res['status'],'snippets':snippets[:3]})
    return out

if __name__ == '__main__':
    now=datetime.now(timezone.utc).strftime('%Y-%m-%dT%H-%M-%SZ')
    queries=['Sprinter van build','Winnebago Revel mods','Sprinter van stereo upgrade','Sprinter van tires wheels','van build accessories','overland van adventure','Adventure Van Expo recap']
    yt=[]
    seen=set()
    for q in queries:
        result=youtube_search(q, max_items=4)
        for item in result.get('items',[]):
            if item['video_id'] not in seen:
                seen.add(item['video_id'])
                yt.append(item)
        time.sleep(0.5)
    # verify top candidates whose search metadata says fresh/relevant plus first 18
    verified=[]
    for item in yt[:18]:
        verified.append(verify_ytdlp(item))
        time.sleep(0.2)
    data={
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'youtube': verified,
        'sprinter_source': sprinter_source_rss(),
        'vanviewer': parse_vanviewer(),
        'conversiontrader': parse_conversiontrader_from_sitemap(),
        'official_events': official_event_checks(),
        'source_statuses': source_statuses(),
    }
    outfile=OUTDIR / f'{now}_scan.json'
    outfile.write_text(json.dumps(data, indent=2), encoding='utf-8')
    print(outfile)
    print(json.dumps(data, indent=2)[:12000])
