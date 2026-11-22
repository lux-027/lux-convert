import Link from 'next/link';

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="lux-logo-g" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4c8df6" />
          <stop offset="1" stopColor="#0b57d0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#lux-logo-g)" />
      <g fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 24a11 11 0 0 1 19.2-7.3L35 19.5" />
        <path d="M35 12.5v7h-7" />
        <path d="M35 24a11 11 0 0 1-19.2 7.3L13 28.5" />
        <path d="M13 35.5v-7h7" />
      </g>
      <circle cx="24" cy="24" r="3" fill="#fff" />
    </svg>
  );
}

export default function Logo({ dark }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-full pr-2 outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <LogoMark />
      <span className={`text-[19px] tracking-tight ${dark ? 'text-white' : 'text-fg'}`}>
        <span className="font-medium">Lux</span> <span className={dark ? 'text-white/70' : 'text-fg-2'}>Convert</span>
      </span>
    </Link>
  );
}
