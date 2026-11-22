type FileProps = { x: number; y: number; w?: number; c1: string; c2: string; label: string; id: string; rotate?: number; children?: React.ReactNode };

function File3D({ x, y, w = 92, c1, c2, label, id, rotate = 0, children }: FileProps) {
  const h = w * 1.25;
  const f = w * 0.28;
  const d = w * 0.09;
  const body = `M0 14a14 14 0 0 1 14-14H${w - f}L${w} ${f}V${h - 14}a14 14 0 0 1-14 14H14a14 14 0 0 1-14-14Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} ${w / 2} ${h / 2})`}>
      <defs>
        <linearGradient id={`${id}-f`} x1="0" y1="0" x2={w} y2={h} gradientUnits="userSpaceOnUse">
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <ellipse cx={w / 2 + d} cy={h + d + 14} rx={w * 0.48} ry={7} fill="#0b2a5b" opacity=".12" />
      <path d={body} transform={`translate(${d} ${d})`} fill={c2} />
      <path d={body} transform={`translate(${d} ${d})`} fill="#000" opacity=".18" />
      <path d={body} fill={`url(#${id}-f)`} />
      <path d={`M${w - f} 0V${f - 8}a8 8 0 0 0 8 8H${w}Z`} fill="#fff" opacity=".45" />
      <path d={`M10 14a6 6 0 0 1 6-6H${w * 0.55}`} stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" fill="none" />
      <g transform={`translate(${w / 2} ${h * 0.42})`} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
      <rect x={w * 0.16} y={h * 0.7} width={w * 0.68} height={h * 0.17} rx={h * 0.085} fill="#fff" opacity=".95" />
      <text x={w / 2} y={h * 0.7 + h * 0.125} textAnchor="middle" fontSize={w * 0.15} fontWeight="700" fill={c2} fontFamily="system-ui, sans-serif">
        {label}
      </text>
    </g>
  );
}

const ImageGlyph = () => (
  <>
    <rect x="-16" y="-13" width="32" height="26" rx="5" />
    <path d="M-12 9l9-9 6 6 4-4 7 7" />
    <circle cx="7" cy="-5" r="2.5" fill="#fff" />
  </>
);
const MusicGlyph = () => (
  <>
    <path d="M-5 9V-12l15-3v19" />
    <circle cx="-9" cy="9" r="4.5" fill="#fff" />
    <circle cx="6" cy="5" r="4.5" fill="#fff" />
  </>
);
const VideoGlyph = () => (
  <>
    <rect x="-16" y="-12" width="32" height="24" rx="5" />
    <path d="M-3-5l8 5-8 5Z" fill="#fff" />
  </>
);
const DocGlyph = () => (
  <>
    <path d="M-12-12h24M-12-3h24M-12 6h16" />
  </>
);

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 480" className={className} role="img" aria-label="Dosya dönüştürme illüstrasyonu">
      <defs>
        <radialGradient id="h-bg" cx="50%" cy="45%" r="55%">
          <stop stopColor="#d2e3fc" />
          <stop offset="1" stopColor="#d2e3fc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h-top" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e8f0fe" />
        </linearGradient>
        <linearGradient id="h-side" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#aecbfa" />
          <stop offset="1" stopColor="#8ab4f8" />
        </linearGradient>
        <linearGradient id="h-cube" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4c8df6" />
          <stop offset="1" stopColor="#0b57d0" />
        </linearGradient>
        <filter id="h-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <circle cx="280" cy="220" r="230" fill="url(#h-bg)" />
      {/* platform */}
      <ellipse cx="280" cy="392" rx="190" ry="34" fill="#0b2a5b" opacity=".12" filter="url(#h-blur)" />
      <path d="M90 352c0-19 85-46 190-46s190 27 190 46v22c0 19-85 46-190 46S90 393 90 374Z" fill="url(#h-side)" />
      <ellipse cx="280" cy="352" rx="190" ry="46" fill="url(#h-top)" />
      <ellipse cx="280" cy="352" rx="150" ry="34" fill="none" stroke="#aecbfa" strokeDasharray="4 8" strokeWidth="2" />
      {/* connectors */}
      <g fill="none" stroke="#1a73e8" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" opacity=".55">
        <path d="M150 150C190 170 210 190 236 210" />
        <path d="M420 140C380 165 350 190 324 210" />
        <path d="M135 300C180 300 210 285 236 268" />
        <path d="M430 300C385 300 352 285 324 268" />
      </g>
      {/* center cube */}
      <ellipse cx="280" cy="330" rx="62" ry="12" fill="#0b2a5b" opacity=".2" filter="url(#h-blur)" />
      <rect x="226" y="190" width="120" height="120" rx="30" fill="#0842a0" />
      <rect x="214" y="178" width="120" height="120" rx="30" fill="url(#h-cube)" />
      <path d="M232 196a20 20 0 0 1 20-14h46" stroke="#fff" strokeOpacity=".35" strokeWidth="5" strokeLinecap="round" fill="none" />
      <g transform="translate(274 238)" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-28 0a28 28 0 0 1 48.9-18.6L28-11" />
        <path d="M28-29v18h-18" />
        <path d="M28 0a28 28 0 0 1-48.9 18.6L-28 11" />
        <path d="M-28 29v-18h18" />
      </g>
      <circle cx="274" cy="238" r="7" fill="#fff" />
      {/* files */}
      <File3D id="hf1" x={70} y={40} c1="#6ea8fe" c2="#1a73e8" label="JPG" rotate={-10}>
        <ImageGlyph />
      </File3D>
      <File3D id="hf2" x={400} y={36} c1="#ff8a80" c2="#d93025" label="MP3" rotate={9}>
        <MusicGlyph />
      </File3D>
      <File3D id="hf3" x={40} y={238} w={84} c1="#fdd663" c2="#e37400" label="MP4" rotate={6}>
        <VideoGlyph />
      </File3D>
      <File3D id="hf4" x={432} y={236} w={84} c1="#81c995" c2="#188038" label="PDF" rotate={-7}>
        <DocGlyph />
      </File3D>
      {/* sparkles */}
      <g fill="#1a73e8">
        <path d="M268 92l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" opacity=".8" />
        <path d="M480 200l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" opacity=".5" />
        <path d="M44 200l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" opacity=".5" />
      </g>
      <circle cx="350" cy="110" r="5" fill="#fbbc04" />
      <circle cx="200" cy="120" r="4" fill="#34a853" />
      <circle cx="380" cy="430" r="4" fill="#ea4335" opacity=".7" />
    </svg>
  );
}

export function ConvertArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <File3D id="ca1" x={34} y={26} w={68} c1="#6ea8fe" c2="#1a73e8" label="PNG" rotate={-8}>
        <ImageGlyph />
      </File3D>
      <File3D id="ca2" x={140} y={26} w={68} c1="#a142f4" c2="#7627bb" label="WEBP" rotate={8}>
        <ImageGlyph />
      </File3D>
      <g fill="none" stroke="#1a73e8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M100 40c12-12 30-12 42 0" />
        <path d="M134 32l8 8-10 3" />
      </g>
    </svg>
  );
}

export function CompressArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <File3D id="cp1" x={30} y={22} w={76} c1="#81c995" c2="#188038" label="12 MB">
        <DocGlyph />
      </File3D>
      <File3D id="cp2" x={160} y={58} w={46} c1="#81c995" c2="#188038" label="2 MB">
        <path d="M-6-6h12" strokeWidth="2.5" />
      </File3D>
      <g fill="none" stroke="#188038" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M118 82h30" />
        <path d="M140 74l8 8-8 8" />
      </g>
    </svg>
  );
}

export function CropArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fdd663" />
          <stop offset="1" stopColor="#fa903e" />
        </linearGradient>
      </defs>
      <ellipse cx="124" cy="146" rx="80" ry="7" fill="#0b2a5b" opacity=".12" />
      <rect x="50" y="26" width="148" height="110" rx="16" fill="#c26401" />
      <rect x="42" y="18" width="148" height="110" rx="16" fill="url(#cr-sky)" />
      <circle cx="150" cy="50" r="12" fill="#fff" opacity=".9" />
      <path d="M42 108l40-40 30 30 18-18 60 50v-2a16 16 0 0 1-16 16H58a16 16 0 0 1-16-16Z" fill="#e37400" />
      <rect x="68" y="38" width="96" height="70" rx="4" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5 5" />
      <g stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M68 52V38h14M150 38h14v14M164 94v14h-14M82 108H68V94" />
      </g>
    </svg>
  );
}
