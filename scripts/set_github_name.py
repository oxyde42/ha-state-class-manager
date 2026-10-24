#!/usr/bin/env python3
"""Replace the placeholder YOUR-GITHUB-NAME in all project files.

Usage:  python3 scripts/set_github_name.py <your-github-name>
"""
import pathlib
import sys

PLACEHOLDER = "YOUR-GITHUB-NAME"

if len(sys.argv) != 2 or not sys.argv[1].strip():
    sys.exit("Usage: python3 scripts/set_github_name.py <your-github-name>")

name = sys.argv[1].strip()
root = pathlib.Path(__file__).resolve().parent.parent
count = 0
for path in list(root.glob("README*.md")) + [
    root / "PUBLISHING.md",
    root / "custom_components" / "state_class_manager" / "manifest.json",
]:
    if path.is_file():
        text = path.read_text(encoding="utf-8")
        if PLACEHOLDER in text:
            path.write_text(text.replace(PLACEHOLDER, name), encoding="utf-8")
            count += 1
            print("updated", path.relative_to(root))
print(f"Done, {count} file(s) changed.")
