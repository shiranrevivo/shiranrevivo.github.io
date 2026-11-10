#!/bin/bash
# Saves the social templates from brand-book.html as PNGs in design-system/exports/
#   bash design-system/tools/export-social.sh          → all
#   bash design-system/tools/export-social.sh story    → one
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$DIR/exports"
declare -a ALL=("post:1080,1350" "quote:1080,1080" "carousel:1080,1350" "story:1080,1920" "banner:1584,396" "share:1200,630")
for entry in "${ALL[@]}"; do
  id="${entry%%:*}"; size="${entry#*:}"
  [ -n "$1" ] && [ "$1" != "$id" ] && continue
  "$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=4000 \
    --window-size="$size" --screenshot="$DIR/exports/$id.png" "file://$DIR/brand-book.html?only=$id" >/dev/null 2>&1
  echo "✓ exports/$id.png ($size)"
done
