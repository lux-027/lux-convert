type FileProps = { x: number; y: number; w?: number; color: string; tint: string; label: string; children?: React.ReactNode };

function FileCard({ x, y, w = 80, color, tint, label, children }: FileProps) {
  const h = w * 1.25;
  const f = w * 0.26;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M12 0H${w - f}L${w} ${f}V${h - 12}a12 12 0 0 1-12 12H12A12 12 0 0 1 0 ${h - 12}V12A12 12 0 0 1 12 0Z`}
        fill="#fff"
        stroke={color}
        strokeWidth="1.75"
      />
      <path d={`M${w - f} 0V${f - 6}a6 6 0 0 0 6 6H${w}`} fill="none" stroke={color} strokeWidth="1.75" />
      <g transform={`translate(${w / 2} ${h * 0.4})`} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
      <rect x={w * 0.18} y={h * 0.7} width={w * 0.64} height={h * 0.16} rx={h * 0.08} fill={tint} />
      <text x={w / 2} y={h * 0.7 + h * 0.115} textAnchor="middle" fontSize={w * 0.14} fontWeight="600" fill={color} fontFamily="system-ui, sans-serif" letterSpacing=".5">
        {label}
      </text>
    </g>
  );
}

const ImageGlyph = () => (
  <>
    <rect x="-13" y="-10" width="26" height="20" rx="4" />
    <path d="M-9 6l7-7 5 5 3-3 5 5" />
    <circle cx="5" cy="-4" r="2" />
  </>
);
const MusicGlyph = () => (
  <>
    <path d="M-4 7V-10l12-2.5V5" />
    <circle cx="-7.5" cy="7" r="3.5" />
    <circle cx="4.5" cy="5" r="3.5" />
  </>
);
const VideoGlyph = () => (
  <>
    <rect x="-13" y="-10" width="26" height="20" rx="4" />
    <path d="M-3-4l7 4-7 4Z" />
  </>
);
const DocGlyph = () => <path d="M-10-8h20M-10-1h20M-10 6h13" />;

const BLUE = { color: '#1a73e8', tint: '#e8f0fe' };
const RED = { color: '#d93025', tint: '#fce8e6' };
const AMBER = { color: '#e37400', tint: '#fef7e0' };
const GREEN = { color: '#188038', tint: '#e6f4ea' };
const PURPLE = { color: '#9334e6', tint: '#f3e8fd' };

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 420" className={className} role="img" aria-label="Dosya dönüştürme illüstrasyonu">
      <circle cx="260" cy="210" r="190" fill="#f8fafd" />
      <circle cx="260" cy="210" r="190" fill="none" stroke="#e3e8ef" />
      <circle cx="260" cy="210" r="128" fill="none" stroke="#e3e8ef" strokeDasharray="3 6" />
      <g fill="none" stroke="#c4d3ea" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round">
        <path d="M150 120L218 176" />
        <path d="M370 120L302 176" />
        <path d="M150 300L218 244" />
        <path d="M370 300L302 244" />
      </g>
      <rect x="208" y="158" width="104" height="104" rx="28" fill="#fff" stroke="#1a73e8" strokeWidth="1.75" />
      <g transform="translate(260 210)" fill="none" stroke="#1a73e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-22 0a22 22 0 0 1 38.4-14.6L22-9" />
        <path d="M22-23v14h-14" />
        <path d="M22 0a22 22 0 0 1-38.4 14.6L-22 9" />
        <path d="M-22 23v-14h14" />
      </g>
      <FileCard x={86} y={40} w={72} label="JPG" {...BLUE}>
        <ImageGlyph />
      </FileCard>
      <FileCard x={362} y={40} w={72} label="MP3" {...RED}>
        <MusicGlyph />
      </FileCard>
      <FileCard x={86} y={290} w={72} label="MP4" {...AMBER}>
        <VideoGlyph />
      </FileCard>
      <FileCard x={362} y={290} w={72} label="PDF" {...GREEN}>
        <DocGlyph />
      </FileCard>
      <circle cx="260" cy="82" r="4" fill="#1a73e8" />
      <circle cx="260" cy="338" r="4" fill="#1a73e8" opacity=".4" />
      <circle cx="132" cy="210" r="3" fill="#fbbc04" />
      <circle cx="388" cy="210" r="3" fill="#34a853" />
    </svg>
  );
}

export function ConvertArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <FileCard x={36} y={30} w={64} label="PNG" {...BLUE}>
        <ImageGlyph />
      </FileCard>
      <FileCard x={140} y={30} w={64} label="WEBP" {...PURPLE}>
        <ImageGlyph />
      </FileCard>
      <g fill="none" stroke="#1a73e8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M108 70h24" />
        <path d="M126 64l6 6-6 6" />
      </g>
    </svg>
  );
}

export function CompressArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <FileCard x={34} y={24} w={72} label="12 MB" {...GREEN}>
        <DocGlyph />
      </FileCard>
      <FileCard x={156} y={56} w={48} label="2 MB" {...GREEN} />
      <g fill="none" stroke="#188038" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M118 80h26" />
        <path d="M138 74l6 6-6 6" />
      </g>
    </svg>
  );
}

export function CropArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <rect x="44" y="24" width="152" height="112" rx="14" fill="#fff" stroke="#e37400" strokeWidth="1.75" />
      <circle cx="160" cy="54" r="9" fill="none" stroke="#e37400" strokeWidth="1.75" />
      <path d="M44 114l40-38 28 26 18-16 66 50" fill="none" stroke="#e37400" strokeWidth="1.75" strokeLinejoin="round" />
      <rect x="70" y="42" width="100" height="76" rx="3" fill="#fef7e0" fillOpacity=".55" stroke="#e37400" strokeWidth="1.25" strokeDasharray="4 4" />
      <g stroke="#e37400" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M70 54V42h12M158 42h12v12M170 106v12h-12M82 118H70v-12" />
      </g>
    </svg>
  );
}

const line = { fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function FaqArt({ className }: { className?: string }) {
  const c = PURPLE.color;
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <path d="M48 30h96a14 14 0 0 1 14 14v42a14 14 0 0 1-14 14H86l-20 18v-18H48a14 14 0 0 1-14-14V44a14 14 0 0 1 14-14Z" fill="#fff" stroke={c} strokeWidth="1.75" strokeLinejoin="round" />
      <g {...line} stroke={c}>
        <path d="M86 56a10 10 0 1 1 14 9.2c-2.6 1.1-4 3-4 5.8v2" />
      </g>
      <circle cx="96" cy="82" r="2" fill={c} />
      <path d="M140 74h50a12 12 0 0 1 12 12v30a12 12 0 0 1-12 12h-8v14l-16-14h-26a12 12 0 0 1-12-12V86a12 12 0 0 1 12-12Z" fill={PURPLE.tint} stroke={c} strokeWidth="1.75" strokeLinejoin="round" />
      <g {...line} stroke={c}>
        <path d="M144 94h42M144 106h28" />
      </g>
    </svg>
  );
}

export function ContactArt({ className }: { className?: string }) {
  const c = BLUE.color;
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <rect x="40" y="46" width="120" height="84" rx="14" fill="#fff" stroke={c} strokeWidth="1.75" />
      <g {...line} stroke={c}>
        <path d="M44 54l56 40 56-40" />
        <path d="M44 124l40-32M156 124l-40-32" strokeOpacity=".45" />
      </g>
      <path d="M172 30l34-12-12 34-8-14Z" fill={BLUE.tint} stroke={c} strokeWidth="1.75" strokeLinejoin="round" />
      <g {...line} stroke={c}>
        <path d="M186 38l20-20" />
        <path d="M150 52c6-6 14-10 22-12" strokeDasharray="3 5" />
      </g>
    </svg>
  );
}

export function AboutArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <FileCard x={26} y={40} w={60} label="JPG" {...BLUE}>
        <ImageGlyph />
      </FileCard>
      <FileCard x={90} y={22} w={60} label="MP3" {...RED}>
        <MusicGlyph />
      </FileCard>
      <FileCard x={154} y={40} w={60} label="PDF" {...GREEN}>
        <DocGlyph />
      </FileCard>
      <g {...line} stroke={AMBER.color}>
        <path d="M120 120v12M114 126h12" />
        <path d="M200 22v8M196 26h8M36 24v8M32 28h8" strokeOpacity=".7" />
      </g>
    </svg>
  );
}

export function PrivacyArt({ className }: { className?: string }) {
  const c = GREEN.color;
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <FileCard x={40} y={36} w={72} label="DOSYA" {...GREEN}>
        <DocGlyph />
      </FileCard>
      <path d="M160 26l42 14v32c0 28-18 46-42 56-24-10-42-28-42-56V40Z" fill="#fff" stroke={c} strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M160 38l30 10v24c0 20-12 34-30 42" fill="none" stroke={c} strokeWidth="1.25" strokeOpacity=".35" />
      <rect x="146" y="70" width="28" height="22" rx="5" fill={GREEN.tint} stroke={c} strokeWidth="1.75" />
      <g {...line} stroke={c}>
        <path d="M152 70v-6a8 8 0 0 1 16 0v6" />
        <path d="M160 79v5" />
      </g>
    </svg>
  );
}
