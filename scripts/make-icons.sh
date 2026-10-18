#!/usr/bin/env bash
# Builds the home-screen icons from public/rocket.png on the theme-color square.
# Needs rsvg-convert (brew install librsvg). Re-run after changing the rocket or the color.
set -euo pipefail
cd "$(dirname "$0")/.."

BG="#0a1931" # keep in sync with theme-color in index.html and manifest.webmanifest
B64=$(base64 < public/rocket.png | tr -d '\n')

# Rocket is 188x312; 66% of the canvas height keeps it inside the maskable safe zone (centered 80% circle).
render() { # size output
  local s=$1 out=$2 h w x y
  h=$(( s * 66 / 100 )); w=$(( h * 188 / 312 ))
  x=$(( (s - w) / 2 )); y=$(( (s - h) / 2 ))
  rsvg-convert -w "$s" -h "$s" -o "$out" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="$s" height="$s" viewBox="0 0 $s $s">
  <rect width="$s" height="$s" fill="$BG"/>
  <image x="$x" y="$y" width="$w" height="$h" xlink:href="data:image/png;base64,$B64"/>
</svg>
SVG
}

render 180 public/apple-touch-icon.png
render 192 public/icon-192.png
render 512 public/icon-512.png
