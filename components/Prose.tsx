import type { ReactNode } from 'react';

export default function Prose({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl pt-12 sm:pt-16">
      <h1 className="text-3xl font-normal tracking-tight text-fg sm:text-4xl">{title}</h1>
      <div data-stagger className="mt-8 space-y-6 text-[15px] leading-7 text-fg-2 [&_h2]:mt-10 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-fg">
        {children}
      </div>
    </article>
  );
}
