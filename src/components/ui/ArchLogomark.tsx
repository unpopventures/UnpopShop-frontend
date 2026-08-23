interface Props {
  className?: string;
}

export default function ArchLogomark({ className }: Props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="9" fill="#123526" />
      <path
        d="M11 30V18.5C11 12.7 14.9 9 20 9C25.1 9 29 12.7 29 18.5V30"
        stroke="#C0923D"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="14.5" r="2" fill="#C0923D" />
      <path d="M11 30H29" stroke="#C0923D" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
