<template>
  <svg class="scene" viewBox="0 0 520 420" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="scene-bg" x1="60" y1="28" x2="458" y2="402" gradientUnits="userSpaceOnUse">
        <stop stop-color="#193057" />
        <stop offset="1" stop-color="#0b1830" />
      </linearGradient>
      <linearGradient id="scene-floor" x1="132" y1="310" x2="431" y2="392" gradientUnits="userSpaceOnUse">
        <stop stop-color="#17284b" />
        <stop offset="1" stop-color="#0f1d38" />
      </linearGradient>
      <linearGradient id="scene-window" x1="388" y1="82" x2="510" y2="82" gradientUnits="userSpaceOnUse">
        <stop stop-color="#d8e5ff" stop-opacity=".9" />
        <stop offset="1" stop-color="#ffffff" stop-opacity=".15" />
      </linearGradient>
      <radialGradient id="scene-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(347 164) rotate(90) scale(118 102)">
        <stop stop-color="#88b6ff" stop-opacity=".8" />
        <stop offset="1" stop-color="#88b6ff" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="scene-mist" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(190 288) rotate(-5) scale(154 64)">
        <stop stop-color="#d6e8ff" stop-opacity=".72" />
        <stop offset="1" stop-color="#d6e8ff" stop-opacity="0" />
      </radialGradient>
    </defs>

    <rect x="16" y="16" width="488" height="388" rx="28" fill="url(#scene-bg)" />
    <rect x="380" y="36" width="108" height="160" rx="22" fill="url(#scene-window)" opacity=".6" />
    <rect x="48" y="70" width="158" height="18" rx="9" fill="#23395d" />
    <rect x="56" y="110" width="126" height="14" rx="7" fill="#2d4670" />
    <rect x="52" y="264" width="134" height="40" rx="20" fill="#1e3456" />
    <path d="M64 314c38-22 96-36 168-36 98 0 158 24 230 52v42H64v-58Z" fill="url(#scene-floor)" />
    <ellipse cx="348" cy="164" rx="102" ry="118" fill="url(#scene-glow)" />
    <ellipse cx="192" cy="288" rx="164" ry="66" fill="url(#scene-mist)" />

    <g opacity=".82">
      <rect x="92" y="292" width="126" height="56" rx="20" fill="#223a61" />
      <rect x="108" y="270" width="100" height="38" rx="18" fill="#27456e" />
      <rect x="124" y="312" width="24" height="44" rx="12" fill="#1a2f51" />
      <rect x="170" y="312" width="24" height="44" rx="12" fill="#1a2f51" />
    </g>

    <g>
      <path d="M315 146c0-30 23-54 52-54 28 0 48 20 48 48 0 24-16 44-38 50l-6 24h-46l-10-34Z" fill="#f8fbff" />
      <path d="M288 198c10-20 35-32 61-32 39 0 70 24 79 61l18 74h-58l-10-44-7 112h-68l-10-108-18 72h-52l20-81c6-24 20-43 45-54Z" fill="#f2f8ff" />
      <path d="M336 130c0-11 9-20 20-20h20c11 0 20 9 20 20v10c0 11-9 20-20 20h-20c-11 0-20-9-20-20v-10Z" fill="#15243f" />
      <circle cx="349" cy="135" r="12" fill="#202f4a" />
      <circle cx="383" cy="135" r="12" fill="#202f4a" />
      <rect x="356" y="128" width="20" height="14" rx="7" fill="#202f4a" />
      <path d="M350 150c4 8 10 12 16 12 6 0 12-4 16-12" stroke="#213551" stroke-width="7" stroke-linecap="round" />
      <path d="M301 344h30v30h-36l6-30Zm56 0h30l8 30h-38v-30Z" fill="#0f172c" />
      <path d="M412 208c18 12 31 36 33 59 1 10-7 18-17 18h-48l-8-56 40-20Z" fill="#f0f6ff" />
      <path d="M416 229h34c10 0 18 8 18 18v17h-48l-4-35Z" fill="#c7d7ea" />
      <path d="M428 233h28v23h-28z" fill="#8b98ab" />
      <path d="M448 258c-46 6-90 22-132 48" stroke="#1c2b45" stroke-width="9" stroke-linecap="round" />
      <path d="M342 220c-9 22-11 44-7 67" stroke="#d8e4f5" stroke-width="10" stroke-linecap="round" />
      <path d="M309 256c3 12 5 24 5 37" stroke="#d8e4f5" stroke-width="10" stroke-linecap="round" />
      <path d="M297 333c18 9 62 14 92 10 18-3 34-9 48-16" stroke="#dbe7f8" stroke-width="8" stroke-linecap="round" opacity=".55" />
    </g>
  </svg>
</template>
