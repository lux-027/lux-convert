export const CONTACT_EMAIL = 'lux.studio.tr@gmail.com';

export const mailto = (subject?: string, body?: string) => {
  const q = new URLSearchParams();
  if (subject) q.set('subject', subject);
  if (body) q.set('body', body);
  const s = q.toString().replace(/\+/g, '%20');
  return `mailto:${CONTACT_EMAIL}${s ? `?${s}` : ''}`;
};
