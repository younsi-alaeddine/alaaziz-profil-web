#!/usr/bin/env python3
"""Write remaining Next.js portfolio files for Alaeddine & Aziz."""
import base64
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(os.path.dirname(__file__), "_files.json")


def w(rel: str, content: str) -> None:
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("ok", rel)


def main() -> None:
    with open(MANIFEST, encoding="utf-8") as f:
        data = json.load(f)
    for rel, b64 in data.items():
        w(rel, base64.b64decode(b64).decode("utf-8"))


if __name__ == "__main__":
    main()
