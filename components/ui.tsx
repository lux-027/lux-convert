import { forwardRef, type ButtonHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'filled' | 'tonal' | 'outlined' | 'text';

const variants: Record<Variant, string> = {
  filled: 'bg-primary text-on-primary hover:bg-primary-hover hover:shadow-card',
  tonal: 'bg-primary-container text-on-primary-container hover:brightness-95 dark:hover:brightness-110',
  outlined: 'border border-line text-primary hover:bg-primary-container/60',
  text: 'text-primary hover:bg-primary-container/60',
};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }>(
  function Button({ className, variant = 'filled', type = 'button', ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

export function IconButton({ className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        'grid h-9 w-9 shrink-0 place-items-center rounded-full text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg disabled:pointer-events-none disabled:opacity-40',
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('relative inline-flex', className)}>
      <select
        className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-line bg-bg py-0 pr-8 pl-3 text-sm text-fg outline-none transition-colors hover:border-fg-2 focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-fg-2" />
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex rounded-full border border-line p-0.5', className)} role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors',
            value === o.value ? 'bg-primary-container text-on-primary-container' : 'text-fg-2 hover:text-fg'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl pt-12 pb-8 text-center sm:pt-16">
      <h1 className="text-3xl font-normal tracking-tight text-fg sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 text-base text-fg-2">{subtitle}</p>}
    </div>
  );
}
