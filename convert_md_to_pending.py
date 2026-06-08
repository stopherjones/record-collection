import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / 'data'
OUTPUT_FILE = ROOT / 'pending.json'

LINK_RE = re.compile(r'\[([^\]]+)\]\((https?://[^)]+)\)')

entries = []
for md_file in sorted(DATA_DIR.glob('*.md')):
    text = md_file.read_text(encoding='utf-8')
    for match in LINK_RE.finditer(text):
        title = match.group(1).strip()
        url = match.group(2).strip()
        if url:
            entries.append({
                'title': title,
                'url': url,
                'tags': ['XXX']
            })

OUTPUT_FILE.write_text(json.dumps(entries, indent=2), encoding='utf-8')
print(f'Wrote {len(entries)} entries to {OUTPUT_FILE}')
