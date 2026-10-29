import { useCallback, useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

/** 5 estrelas com preenchimento fracionado (passos de 0,25). */
export function StarRating({ value, size = 28, className = '' }) {
  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`${value.toLocaleString('pt-BR')} de 5 estrelas`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-amber-200" strokeWidth={1.5} />
            <span
              className="absolute inset-0 overflow-hidden transition-[width] duration-500"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={size}
                className="text-amber-400"
                fill="currentColor"
                strokeWidth={1.5}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function Card({ children, className = '', flush = false, ...rest }) {
  // Só aplica fundo/borda padrão se o chamador não definir os seus (evita conflito de classes).
  const bg = /(^|\s)bg-/.test(className) ? '' : 'bg-white';
  const ring = /(^|\s)ring-(?!\d|inset)/.test(className) ? '' : 'ring-slate-900/5';
  return (
    <section
      className={`rounded-2xl shadow-sm ring-1 ${bg} ${ring} ${flush ? 'overflow-hidden' : 'p-4'} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}

export function SectionTitle({ icon: Icon, children, right }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
        {Icon && <Icon size={18} className="text-teal-600" aria-hidden="true" />}
        {children}
      </h2>
      {right}
    </div>
  );
}

/** Toast simples, anunciado por leitores de tela. */
export function useToast() {
  const [msg, setMsg] = useState(null);
  const timer = useRef();
  const show = useCallback((text) => {
    clearTimeout(timer.current);
    setMsg(text);
    timer.current = setTimeout(() => setMsg(null), 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const node = (
    <div aria-live="polite" className="pointer-events-none">
      {msg && (
        <div className="toast fixed bottom-24 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {msg}
        </div>
      )}
    </div>
  );
  return [node, show];
}

export function StatusPill({ tone = 'slate', children }) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    yellow: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    red: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    slate: 'bg-slate-100 text-slate-600 ring-slate-500/10',
    teal: 'bg-teal-50 text-teal-700 ring-teal-600/20',
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
