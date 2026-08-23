interface Props {
  className?: string;
}

// A simplified, original geometric peacock silhouette in the brand's
// forest / gold / peacock-teal palette. Used sparingly as the platform's
// signature decorative element (dashboard banners, hero panels, empty states).
export default function PeacockMotif({ className }: Props) {
  return (
    <svg viewBox="0 0 240 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* tail feathers, fanned */}
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = -60 + i * 20;
        const colors = ["#1F6F78", "#3E97A0", "#C0923D", "#2F6D4C", "#C0923D", "#3E97A0", "#1F6F78"];
        return (
          <g key={i} transform={`rotate(${angle} 120 190)`}>
            <ellipse cx="120" cy="70" rx="16" ry="46" fill={colors[i]} opacity="0.85" />
            <circle cx="120" cy="58" r="9" fill="#FAF3E4" opacity="0.9" />
            <circle cx="120" cy="58" r="4.5" fill={colors[i]} />
          </g>
        );
      })}
      {/* body */}
      <ellipse cx="120" cy="196" rx="26" ry="34" fill="#134B52" />
      {/* neck + head */}
      <path d="M120 168 C108 150 108 128 122 112" stroke="#1F6F78" strokeWidth="18" strokeLinecap="round" fill="none" />
      <circle cx="123" cy="106" r="13" fill="#1F6F78" />
      {/* crown feathers */}
      <path d="M118 94 L116 82 M123 92 L123 78 M128 94 L131 82" stroke="#C0923D" strokeWidth="3" strokeLinecap="round" />
      {/* beak */}
      <path d="M133 106 L142 104 L133 110 Z" fill="#C0923D" />
      {/* legs */}
      <path d="M112 226 L108 246 M128 226 L132 246" stroke="#0F2C20" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
