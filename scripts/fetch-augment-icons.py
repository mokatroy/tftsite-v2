#!/usr/bin/env python3
"""Download TFT augment hexcore icons into assets/augments/.
Run: python3 scripts/fetch-augment-icons.py
Or GitHub Action: Fetch augment icons
"""
from __future__ import annotations
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "augments"

SLUGS = [
  'jeweled-lotus-ii','richgetricher2','missing-t2','pandora1','trade2','cybernetic-uplink-ii',
  'binaryairdrop3','componentgrabbag-ii','itemgrabbag1','thrillhunt1','portableforge2','last-stand-ii',
  'hyperroll2','combat-training-ii','newrecruit3','radiantrelic-iii','builtdifferent2','wisespending3'
]

BASE = "https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/augments/hexcore"

def fetch_one(slug: str) -> bool:
    dest = OUT / f"{slug}.png"
    if dest.exists() and dest.stat().st_size > 200:
        print(f"skip {slug}")
        return True
    url = f"{BASE}/{slug}.png"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "MokaTroyTFT/1.0"})
        data = urllib.request.urlopen(req, timeout=90).read()
        if data[:4] == b"\x89PNG" and len(data) > 100:
            dest.write_bytes(data)
            print(f"ok   {slug} ({len(data)})")
            return True
    except Exception as e:
        print(f"fail {slug}: {e}")
        return False
    print(f"fail {slug}: bad content")
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
