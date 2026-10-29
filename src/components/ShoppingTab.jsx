import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCopy,
  Home,
  MessageCircle,
  Plus,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Trash2,
  Undo2,
} from 'lucide-react';
import { Card } from './ui.jsx';
import { ALL_CATEGORIES, OTHER_CATEGORY } from '../data/pantry.js';
import { copyText } from '../lib/clipboard.js';
import { dateKey, fmtShort } from '../lib/dates.js';

const normalize = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function buildWhatsAppText(pantry) {
  const toBuy = pantry.filter((i) => i.status === 'buy');
  const lines = [`🛒 *Lista de Compras — Bruna Daily Care*`, `_${fmtShort(dateKey())}_`, ''];
  for (const cat of ALL_CATEGORIES) {
    const items = toBuy.filter((i) => i.category === cat.id);
    if (!items.length) continue;
    lines.push(`${cat.emoji} *${cat.name}*`);
    items.forEach((i) => lines.push(`• ${i.name}`));
    lines.push('');
  }
  lines.push(`Total: ${toBuy.length} ${toBuy.length === 1 ? 'item' : 'itens'}`);
  return lines.join('\n');
}

export default function ShoppingTab({ pantry, setPantry, toast }) {
  const [mode, setMode] = useState('casa'); // 'casa' | 'comprar'
  const [query, setQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState(OTHER_CATEGORY.id);

  const toBuy = useMemo(() => pantry.filter((i) => i.status === 'buy'), [pantry]);

  const setStatus = (id, status) =>
    setPantry((p) => p.map((i) => (i.id === id ? { ...i, status } : i)));

  const removeItem = (id) => setPantry((p) => p.filter((i) => i.id !== id));

  const addItem = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const existing = pantry.find((i) => normalize(i.name) === normalize(name));
    if (existing) {
      setStatus(existing.id, 'buy');
      toast(`"${existing.name}" já existia — foi para a lista 🛒`);
    } else {
      setPantry((p) => [
        ...p,
        { id: `custom-${Date.now()}`, name, category: newCat, status: 'buy', custom: true },
      ]);
      toast(`"${name}" adicionado à lista 🛒`);
    }
    setNewName('');
  };

  const copyList = async () => {
    const ok = await copyText(buildWhatsAppText(pantry));
    toast(ok ? '📋 Lista copiada! É só colar no WhatsApp.' : 'Não foi possível copiar 😕');
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(buildWhatsAppText(pantry))}`;

  const q = normalize(query.trim());
  const visible = (items) => (q ? items.filter((i) => normalize(i.name).includes(q)) : items);

  return (
    <>
      <header className="pt-safe sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur">
        <div className="px-4 pt-3 pb-3">
          <h1 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <ShoppingBasket className="text-teal-600" aria-hidden="true" /> Compras & Despensa
          </h1>
          <div
            className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
            role="group"
            aria-label="Modo da lista"
          >
            {[
              { id: 'casa', label: 'Em Casa', icon: Home },
              { id: 'comprar', label: 'Para Comprar', icon: ShoppingCart, count: toBuy.length },
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                type="button"
                aria-pressed={mode === id}
                onClick={() => setMode(id)}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  mode === id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
                {count > 0 && (
                  <span className="rounded-full bg-rose-500 px-1.5 text-xs leading-5 text-white">{count}</span>
                )}
              </button>
            ))}
          </div>
          {mode === 'casa' && (
            <label className="relative mt-3 block">
              <span className="sr-only">Buscar item</span>
              <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar ingrediente…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </label>
          )}
        </div>
      </header>

      <main className="space-y-4 p-4">
        {mode === 'casa' ? (
          <>
            <p className="px-1 text-xs text-slate-500">
              Toque em <strong>“Acabou 🛒”</strong> quando um item terminar — ele vai direto para a lista de compras.
            </p>
            {ALL_CATEGORIES.map((cat) => {
              const items = visible(pantry.filter((i) => i.category === cat.id));
              if (!items.length) return null;
              return (
                <Card key={cat.id} flush>
                  <div className="border-b border-slate-100 px-4 py-3">
                    <h2 className="font-semibold">
                      <span aria-hidden="true">{cat.emoji}</span> {cat.name}
                    </h2>
                    {cat.note && <p className="text-xs text-slate-500">{cat.note}</p>}
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const out = item.status === 'buy';
                      return (
                        <li key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                          <span className={`flex-1 text-sm ${out ? 'text-slate-400 line-through' : ''}`}>
                            {item.name}
                          </span>
                          {out ? (
                            <button
                              type="button"
                              onClick={() => setStatus(item.id, 'home')}
                              className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                              aria-label={`${item.name} está na lista. Desfazer`}
                            >
                              <Undo2 size={14} aria-hidden="true" /> Na lista
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setStatus(item.id, 'buy')}
                              className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-rose-300 hover:bg-rose-50 active:scale-95"
                              aria-label={`${item.name} acabou`}
                            >
                              Acabou 🛒
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              );
            })}
            {q && !pantry.some((i) => normalize(i.name).includes(q)) && (
              <p className="py-8 text-center text-sm text-slate-500">Nenhum item encontrado para “{query}”.</p>
            )}
          </>
        ) : (
          <>
            <Card>
              <form onSubmit={addItem} className="space-y-2">
                <label htmlFor="new-item" className="text-sm font-semibold">
                  Adicionar item avulso
                </label>
                <div className="flex gap-2">
                  <input
                    id="new-item"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex.: Papel-toalha"
                    autoComplete="off"
                    enterKeyHint="done"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="submit"
                    disabled={!newName.trim()}
                    className="flex items-center gap-1 rounded-xl bg-teal-600 px-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-40"
                  >
                    <Plus size={18} aria-hidden="true" /> Add
                  </button>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  Categoria:
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </form>
            </Card>

            {toBuy.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-400" aria-hidden="true" />
                <p className="font-semibold text-slate-700">Despensa completa!</p>
                <p className="text-sm">Marque “Acabou 🛒” na aba Em Casa quando algo terminar.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={copyList}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-95"
                  >
                    <ClipboardCopy size={18} aria-hidden="true" /> Copiar Lista para WhatsApp
                  </button>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 px-3 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    <MessageCircle size={18} aria-hidden="true" /> Enviar no WhatsApp
                  </a>
                </div>

                {ALL_CATEGORIES.map((cat) => {
                  const items = toBuy.filter((i) => i.category === cat.id);
                  if (!items.length) return null;
                  return (
                    <Card key={cat.id} flush>
                      <h2 className="border-b border-slate-100 px-4 py-3 font-semibold">
                        <span aria-hidden="true">{cat.emoji}</span> {cat.name}
                        <span className="ml-2 text-xs font-normal text-slate-500">({items.length})</span>
                      </h2>
                      <ul className="divide-y divide-slate-100">
                        {items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2 px-4 py-2.5">
                            <span className="flex-1 text-sm">{item.name}</span>
                            {item.custom && (
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Excluir ${item.name}`}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                              >
                                <Trash2 size={16} aria-hidden="true" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setStatus(item.id, 'home');
                                toast(`✅ ${item.name} de volta à despensa`);
                              }}
                              className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100 active:scale-95"
                            >
                              Comprado ✅
                            </button>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  );
                })}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
