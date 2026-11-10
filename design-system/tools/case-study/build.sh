#!/bin/bash
# Compiles the case-study image tools into design-system/tools/case-study/bin/ (macOS, Swift — no PIL / ImageMagick needed).
# bash design-system/tools/case-study/build.sh
set -e
cd "$(dirname "$0")"
mkdir -p bin
for f in *.swift; do swiftc -O -o "bin/${f%.swift}" "$f"; done
echo "built: $(ls bin | tr '\n' ' ')"
