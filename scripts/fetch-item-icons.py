#!/usr/bin/env python3
"""Download TFT item hexcore icons into assets/items/.
Run: python3 scripts/fetch-item-icons.py
Or GitHub Action: Fetch item icons
"""
from __future__ import annotations
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "items"

SLUGS = [
    "tft_item_guinsoosrageblade", "tft_item_bloodthirster", "tft_item_lastwhisper",
    "tft_item_madredsbloodrazor", "tft_item_infinityedge", "tft_item_unstableconcoction",
    "tft_item_spearofshojin", "tft_item_bluebuff", "tft_item_rabadonsdeathcap",
    "tft_item_jeweledgauntlet", "tft_item_morellonomicon", "tft_item_redbuff",
    "tft_item_gargoylestoneplate", "tft_item_warmogsarmor", "tft_item_bramblevest",
    "tft_item_dragonsclaw", "tft_item_titansresolve", "tft_item_steraksgage",
    "tft_item_deathblade", "tft_item_ionicspark", "tft_item_guardianangel",
    "tft_item_archangelsstaff", "tft_item_hextechgunblade", "tft_item_crownguard",
    "tft_item_protectorsvow", "tft_item_spiritvisage", "tft_item_adaptivehelm",
    "tft_item_evenshroud", "tft_item_steadfastheart", "tft_item_nashorstooth",
    "tft_item_voidstaff", "tft_item_krakensfury", "tft_item_bfsword",
    "tft_item_recurvebow", "tft_item_needlesslylargerod", "tft_item_tearofthegoddess",
    "tft_item_chainvest", "tft_item_negatroncloak", "tft_item_giantsbelt",
    "tft_item_sparringgloves", "tft_item_spatula", "tft_item_fryingpan",
    "tft_item_quicksilver", "tft_item_runaanshurricane", "tft_item_statikkshiv",
    "tft_item_thiefsgloves", "tft_item_guardbreaker", "tft_item_strikersflail",
    "tft_item_nightharvester", "tft_item_rapidfirecannon",
]

BASE = "https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore"

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
