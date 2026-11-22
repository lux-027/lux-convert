'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const REVEAL_MS = 750;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function smoothScrollTo(y: number) {
  const startY = window.scrollY;
  const dist = y - startY;
  const start = performance.now();
  const duration = Math.min(2400, Math.max(1600, 1000 + Math.abs(dist) * 0.6));
  let raf = 0;
  const stop = () => cancelAnimationFrame(raf);
  window.addEventListener('wheel', stop, { once: true, passive: true });
  window.addEventListener('touchstart', stop, { once: true, passive: true });
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + dist * ease(p));
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

function expand(el: HTMLElement): HTMLElement[] {
  const split = el.hasAttribute('data-stagger') || (el.classList.contains('grid') && el.children.length > 1);
  return split ? (Array.from(el.children) as HTMLElement[]).flatMap(expand) : [el];
}

function revealTargets(root: ParentNode, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).flatMap(expand);
}

function reveal(els: HTMLElement[], rootMargin = '0px 0px -8% 0px') {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        el.setAttribute('data-in', '');
        window.setTimeout(() => {
          el.removeAttribute('data-reveal');
          el.removeAttribute('data-in');
          el.style.removeProperty('--d');
        }, REVEAL_MS + 600);
      });
    },
    { rootMargin }
  );
  els.forEach((el) => {
    const i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--d', `${Math.min(i, 5) * 80}ms`);
    el.setAttribute('data-reveal', '');
    io.observe(el);
  });
  return io;
}

export default function Motion() {
  const pathname = usePathname();
  const pathRef = useRef<string | null>(null);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || reduced()) return;
    const io = reveal(revealTargets(footer, ':scope > div > *'), '0px');
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.pathname !== window.location.pathname || !a.hash) return;
      const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - margin;
      if (reduced()) window.scrollTo(0, y);
      else smoothScrollTo(y);
      history.pushState(null, '', a.hash);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    const main = document.querySelector('main');
    pathRef.current = pathname;
    document.documentElement.classList.add('motion-ready');
    if (!main || reduced()) return;

    const els = revealTargets(main, ':scope > section > *, :scope > div > *, :scope > article > *');
    const io = reveal(els);

    const mo = new MutationObserver((records) => {
      if (window.location.pathname !== pathRef.current) return;
      records.forEach((r) =>
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement) || n.closest('[data-reveal]')) return;
          n.setAttribute('data-appear', '');
          n.addEventListener('animationend', () => n.removeAttribute('data-appear'), { once: true });
        })
      );
    });
    mo.observe(main, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
