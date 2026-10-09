import { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="pm-bg" x1="0" y1="0" x2="100" y2="100">
          <stop stopColor="#f5d0fe" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
        <linearGradient id="pm-purple" x1="0" y1="0" x2="100" y2="100">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id="pm-pink" x1="0" y1="0" x2="100" y2="100">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#pm-bg)" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />

      {/* Boba cup body */}
      <rect x="30" y="36" width="40" height="34" rx="5" fill="white" opacity="0.85" />
      {/* Lid */}
      <rect x="27" y="32" width="46" height="7" rx="3.5" fill="url(#pm-purple)" opacity="0.9" />
      {/* Straw */}
      <rect x="46" y="18" width="5" height="22" rx="2.5" fill="url(#pm-purple)" />

      {/* Milk splash top */}
      <ellipse cx="50" cy="32" rx="12" ry="4" fill="white" opacity="0.5" />

      {/* Boba pearls */}
      <circle cx="40" cy="57" r="4" fill="url(#pm-purple)" />
      <circle cx="51" cy="61" r="4" fill="url(#pm-purple)" />
      <circle cx="62" cy="57" r="4" fill="url(#pm-purple)" />
      <circle cx="45" cy="65" r="3.5" fill="url(#pm-pink)" />
      <circle cx="57" cy="65" r="3.5" fill="url(#pm-pink)" />

      {/* Sparkles */}
      <path d="M22 24 L23.5 27 L27 28.5 L23.5 30 L22 33 L20.5 30 L17 28.5 L20.5 27 Z" fill="#f472b6" opacity="0.8" />
      <path d="M76 20 L77 22 L79 23 L77 24 L76 26 L75 24 L73 23 L75 22 Z" fill="#a855f7" opacity="0.7" />
      <circle cx="81" cy="36" r="2" fill="#f9a8d4" opacity="0.8" />
      <circle cx="18" cy="42" r="1.5" fill="#c084fc" opacity="0.7" />

      {/* Brand text PM */}
      <text x="50" y="90" fontFamily="'Fredoka One', cursive" fontSize="13" fontWeight="900"
        fill="url(#pm-purple)" textAnchor="middle" letterSpacing="1">PAT-MILK</text>
    </svg>
  );
}
