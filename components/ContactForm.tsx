'use client';

import { useState, type FormEvent } from 'react';
import { Bug, Check, Copy, Handshake, Lightbulb, Mail, Send } from 'lucide-react';
import { CONTACT_EMAIL, mailto } from '@/lib/contact';
import { Button } from './ui';
import { cn } from '@/lib/utils';

const TOPICS = [
  { value: 'Öneri', icon: Lightbulb, text: 'Yeni özellik ve iyileştirme fikirleri' },
  { value: 'Hata bildirimi', icon: Bug, text: 'Çalışmayan bir dönüşüm veya sorun' },
  { value: 'İş birliği', icon: Handshake, text: 'Reklam, ortaklık ve diğer talepler' },
];

const field =
  'w-full rounded-2xl border border-line bg-white px-4 text-[15px] text-fg outline-none placeholder:text-fg-2/70 focus:border-primary focus:ring-2 focus:ring-primary/20';

export default function ContactForm() {
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      window.prompt('E-posta adresini kopyalayın:', CONTACT_EMAIL);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = name ? `${message}\n\n— ${name}` : message;
    window.location.href = mailto(`[Lux Convert] ${topic}`, body);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div data-stagger className="space-y-4">
        <div className="rounded-3xl bg-ink p-6 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
            <Mail className="h-5 w-5" />
          </span>
          <p className="mt-4 text-sm text-white/65">E-posta</p>
          <a href={mailto()} className="mt-0.5 block text-lg font-medium break-all hover:underline">
            {CONTACT_EMAIL}
          </a>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={mailto()}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-ink transition-shadow hover:shadow-lg"
            >
              <Send className="h-4 w-4" />
              E-posta gönder
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-white/85 ring-1 ring-white/20 hover:bg-white/10"
            >
              {copied ? <Check className="h-4 w-4 text-[#81c995]" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Kopyalandı' : 'Adresi kopyala'}
            </button>
          </div>
        </div>
        <p className="px-1 text-sm leading-relaxed text-fg-2">Genellikle 1–2 iş günü içinde yanıt veriyoruz.</p>
      </div>

      <form onSubmit={submit} className="rounded-3xl border border-line bg-white p-6 shadow-[0_2px_12px_rgb(60_64_67/0.06)]">
        <p className="text-sm font-medium text-fg">Konu</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Konu">
          {TOPICS.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={topic === t.value}
              onClick={() => setTopic(t.value)}
              className={cn(
                'rounded-2xl border p-3 text-left transition-colors',
                topic === t.value ? 'border-ink bg-surface-2' : 'border-line hover:bg-surface'
              )}
            >
              <t.icon className={cn('h-4 w-4', topic === t.value ? 'text-ink' : 'text-fg-2')} />
              <p className="mt-2 text-sm font-medium text-fg">{t.value}</p>
              <p className="mt-0.5 text-xs leading-snug text-fg-2">{t.text}</p>
            </button>
          ))}
        </div>
        <label className="mt-5 block text-sm font-medium text-fg" htmlFor="c-name">
          Adınız <span className="font-normal text-fg-2">(isteğe bağlı)</span>
        </label>
        <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} className={cn(field, 'mt-2 h-11')} placeholder="Adınız" />
        <label className="mt-4 block text-sm font-medium text-fg" htmlFor="c-msg">
          Mesajınız
        </label>
        <textarea
          id="c-msg"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(field, 'mt-2 resize-y py-3')}
          placeholder="Size nasıl yardımcı olabiliriz?"
        />
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-2">Gönder’e basınca e-posta uygulamanız mesajla birlikte açılır.</p>
          <Button type="submit" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
            Gönder
          </Button>
        </div>
      </form>
    </div>
  );
}
