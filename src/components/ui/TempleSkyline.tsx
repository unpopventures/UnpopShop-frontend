interface Props {
  className?: string;
}

// A quiet decorative skyline (temple silhouette + palms + a low sun) that
// sits behind the dashboard greeting header. Kept subtle and low-contrast
// so it never competes with the stat cards below it.
export default function TempleSkyline({ className }: Props) {
  return (
    <svg viewBox="0 0 800 140" preserveAspectRatio="xMidYMax slice" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="620" cy="46" r="28" fill="#EAD8B4" opacity="0.9" />
      {/* water line */}
      <rect x="0" y="118" width="800" height="22" fill="#EAD8B4" opacity="0.35" />
      {/* palms */}
      {[70, 130, 700, 750].map((x, i) => (
        <g key={i} transform={`translate(${x} 0)`} opacity="0.55">
          <path d="M0 118 L4 78" stroke="#5f9273" strokeWidth="4" strokeLinecap="round" />
          <path d="M4 82 C-10 70 -18 76 -22 68 M4 80 C18 68 26 74 30 66 M4 78 C-6 60 -4 50 -14 46 M4 78 C14 60 12 50 22 46"
            stroke="#2f6d4c" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* central temple silhouette */}
      <g transform="translate(340 0)" opacity="0.85">
        <rect x="30" y="90" width="60" height="30" fill="#C99A3E" opacity="0.5" />
        <rect x="42" y="60" width="36" height="30" fill="#C99A3E" opacity="0.6" />
        <rect x="52" y="34" width="16" height="26" fill="#C99A3E" opacity="0.7" />
        <polygon points="60,14 74,34 46,34" fill="#C99A3E" opacity="0.8" />
        <circle cx="60" cy="10" r="3" fill="#C99A3E" />
      </g>
      {/* boat */}
      <path d="M170 122 L210 122 L200 132 L180 132 Z" fill="#134B52" opacity="0.4" />
    </svg>
  );
}
