'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => obs.disconnect();
}

const isDark = () => document.documentElement.classList.contains('dark');

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      title={dark ? 'Açık tema' : 'Koyu tema'}
      className="grid h-10 w-10 place-items-center rounded-full text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
