#!/usr/bin/env python3
"""Download TFT Set 18 champion square icons into assets/champs/.
Run locally:  python3 scripts/fetch-champ-icons.py
Or trigger the GitHub Action: .github/workflows/fetch-champ-icons.yml
"""
from __future__ import annotations
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "champs"

SPECIAL = {
    "pebbles": "tft18_sentry",
    "sentry": "tft18_sentry",
    "krug": "tft18_krug",
    "cinderling": "tft18_cinderling",
    "scuttlecrab": "tft18_scuttlecrab",
    "gromp": "tft18_gromp",
    "brambleback": "tft18_brambleback",
    "murkwolf": "tft18_murkwolf",
    "mamabeak": "tft18_raptor",
    "sentinel": "tft18_sentinel",
    "ancientsentinel": "tft18_sentinel",
    "elderdragon": "tft18_elderdragon",
    "kobuko": "tft18_kobuko",
    "yunara": "tft18_yunara",
    "willump": "tft18_willump",
    "alune": "tft18_alune",
}

TFT18 = [
    "akali", "camille", "cinderling", "karma", "kobuko", "leona", "ornn", "pebbles", "rakan", "reksai",
    "varus", "veigar", "xayah", "yorick", "alistar", "caitlyn", "elise", "gromp", "kayle", "leblanc",
    "murkwolf", "scuttlecrab", "sejuani", "shen", "teemo", "warwick", "yunara", "azir", "cassiopeia",
    "diana", "fiddlesticks", "hecarim", "khazix", "kogmaw", "krug", "masteryi", "rammus", "mamabeak",
    "rengar", "tristana", "vi", "ahri", "amumu", "aphelios", "brambleback", "ezreal", "lillia",
    "malphite", "morgana", "nidalee", "sett", "sentinel", "sivir", "soraka", "zyra", "alune", "ashe",
    "draven", "elderdragon", "gnar", "ivern", "kennen", "lux", "maokai", "taric", "ancientsentinel",
]

def ids() -> set[str]:
    s = set(SPECIAL.values())
    for n in TFT18:
        s.add(SPECIAL[n] if n in SPECIAL else f"tft18_{n}")
    return s

def urls_for(cid: str) -> list[str]:
    return [
        f"https://raw.communitydragon.org/latest/game/assets/characters/{cid}/{cid}_square.png",
        f"https://raw.communitydragon.org/latest/game/assets/characters/{cid}/hud/{cid}_square.png",
        f"https://raw.communitydragon.org/pbe/game/assets/characters/{cid}/{cid}_square.png",
    ]

def fetch_one(cid: str) -> bool:
    dest = OUT / f"{cid}.png"
    if dest.exists() and dest.stat().st_size > 500:
        print(f"skip {cid}")
        return True
    last = "unknown"
    for u in urls_for(cid):
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "MokaTroyTFT/1.0"})
            data = urllib.request.urlopen(req, timeout=90).read()
            if data[:4] == b"\x89PNG" and len(data) > 200:
                dest.write_bytes(data)
                print(f"ok   {cid} ({len(data)} bytes)")
                return True
        except Exception as e:
            last = e
    print(f"fail {cid}: {last}")
    return False

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ok = fail = 0
    for cid in sorted(ids()):
        if fetch_one(cid):
            ok += 1
        else:
            fail += 1
        time.sleep(0.05)
    print(f"done ok={ok} fail={fail} -> {OUT}")

if __name__ == "__main__":
    main()
