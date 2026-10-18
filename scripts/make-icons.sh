#!/usr/bin/env bash
# Builds the home-screen icons: public/rocket.png angled up-right (launching) with a drawn SVG flame
# trail, on a navy radial-glow background with a few stars. Everything important stays inside the
# central 80% circle (maskable-safe); the background is full-bleed and opaque.
# Needs rsvg-convert (brew install librsvg). Re-run after changing the rocket or the color.
set -euo pipefail
cd "$(dirname "$0")/.."

BG="#0a1931" # keep in sync with theme-color in index.html and manifest.webmanifest
B64=$(base64 < public/rocket.png | tr -d '\n')

# Authored on a 512 canvas and scaled to each output size. The rocket (188x312) and flame share one
# group, rotated 35 degrees clockwise about their combined center, which sits on the canvas center.
render() { # size output
  local s=$1 out=$2
  rsvg-convert -w "$s" -h "$s" -o "$out" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="$s" height="$s" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="0.55" cy="0.5" r="0.75">
      <stop offset="0" stop-color="#27508f"/>
      <stop offset="0.45" stop-color="#122954"/>
      <stop offset="1" stop-color="$BG"/>
    </radialGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffb347" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#ffb347" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd23f"/>
      <stop offset="0.45" stop-color="#ff8a1f"/>
      <stop offset="1" stop-color="#e8321e" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff3a0"/>
      <stop offset="0.6" stop-color="#ffc233"/>
      <stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.7" stop-color="#fff6c8"/>
      <stop offset="1" stop-color="#fff6c8" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <rect width="512" height="512" fill="$BG"/>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g fill="#fff">
    <circle cx="96" cy="104" r="3.2" opacity="0.9"/>
    <circle cx="410" cy="92" r="2.4" opacity="0.7"/>
    <circle cx="150" cy="190" r="2" opacity="0.6"/>
    <circle cx="438" cy="250" r="2.6" opacity="0.75"/>
    <circle cx="80" cy="330" r="2.4" opacity="0.7"/>
    <circle cx="330" cy="130" r="1.8" opacity="0.6"/>
    <circle cx="400" cy="420" r="2.2" opacity="0.6"/>
  </g>
  <g transform="translate(256 256) rotate(35) scale(0.78) translate(-94 -250)">
    <ellipse cx="94" cy="400" rx="95" ry="150" fill="url(#halo)"/>
    <g filter="url(#soft)" opacity="0.85">
      <path d="M58 296 C50 370 80 430 94 505 C108 430 138 370 130 296 Z" fill="#ff7a1a"/>
    </g>
    <path d="M58 296 C50 370 80 430 94 505 C108 430 138 370 130 296 Z" fill="url(#fo)"/>
    <path d="M70 296 C66 350 84 395 94 460 C104 395 122 350 118 296 Z" fill="url(#fm)"/>
    <path d="M82 296 C80 332 90 358 94 392 C98 358 108 332 106 296 Z" fill="url(#fc)"/>
    <image x="0" y="0" width="188" height="312" xlink:href="data:image/png;base64,$B64"/>
  </g>
</svg>
SVG
}

render 180 public/apple-touch-icon.png
render 192 public/icon-192.png
render 512 public/icon-512.png
