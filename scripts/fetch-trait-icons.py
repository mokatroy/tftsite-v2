#!/usr/bin/env python3
"""Download TFT Set 18 trait icons into assets/traits/.
Run: python3 scripts/fetch-trait-icons.py
Or GitHub Action: Fetch trait icons
"""
from __future__ import annotations
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "traits"

SLUGS = ['adaptor', 'apexpredator', 'attuned', 'avatar', 'blossom', 'bountyseeker', 'brawler', 'caustic', 'coven', 'defender', 'elderwood', 'emeraldaspect', 'executioner', 'fae', 'florafatalis', 'greenfather', 'hunter', 'inferno', 'invoker', 'juggernaut', 'lunar', 'monolith', 'oldgrowth', 'primal', 'rapidfire', 'ravager', 'riftbeast', 'rival', 'solar', 'spellweaver', 'sprykin', 'summoner', 'thornmaiden', 'vanguard']

BASE = "https://raw.communitydragon.org/latest/game/assets/ux/traiticons"

def fetch_one(slug: str) -> bool:
    fname = f"trait_icon_18_{slug}.png"
    dest = OUT / fname
    if dest.exists() and dest.stat().st_size > 200:
        print(f"skip {fname}")
        return True
    url = f"{BASE}/{fname}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "MokaTroyTFT/1.0"})
        data = urllib.request.urlopen(req, timeout=90).read()
        if data[:4] == b"\x89PNG" and len(data) > 100:
            dest.write_bytes(data)
            print(f"ok   {fname} ({len(data)})")
            return True
    except Exception as e:
        print(f"fail {fname}: {e}")
        return False
    print(f"fail {fname}: bad content")
    return False

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ok = fail = 0
    for slug in SLUGS:
        if fetch_one(slug):
            ok += 1
        else:
            fail += 1
        time.sleep(0.05)
    print(f"done ok={ok} fail={fail} -> {OUT}")

if __name__ == "__main__":
    main()
