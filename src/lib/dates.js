// Utilitários de data — sempre no fuso LOCAL do aparelho (nunca toISOString, que usa UTC
// e faria o "dia" virar antes da meia-noite no Brasil).

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const dt = parseKey(key);
  dt.setDate(dt.getDate() + n);
  return dateKey(dt);
}

/** Diferença em dias inteiros (b - a). */
export function diffDays(aKey, bKey) {
  const a = parseKey(aKey);
  const b = parseKey(bKey);
  return Math.round((b - a) / 86_400_000);
}

/** Segunda-feira da semana do dia informado. */
export function weekStart(key) {
  const dt = parseKey(key);
  const dow = (dt.getDay() + 6) % 7; // 0 = segunda
  dt.setDate(dt.getDate() - dow);
  return dateKey(dt);
}

/** Hoje + histórico dos últimos 7 dias (do mais antigo para hoje). */
export function lastDays(todayKey, count = 7) {
  const out = [];
  for (let i = count; i >= 0; i--) out.push(addDays(todayKey, -i));
  return out;
}

const weekdayFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
const longFmt = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});
const shortFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const fmtWeekday = (key) => weekdayFmt.format(parseKey(key)).replace('.', '');
export const fmtLong = (key) => longFmt.format(parseKey(key));
export const fmtShort = (key) => shortFmt.format(parseKey(key));

export function fmtNumber(n, min = 1, max = 2) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: min, maximumFractionDigits: max });
}

