import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Download, HeartPulse, ShoppingCart } from 'lucide-react';
import TodayTab from './components/TodayTab.jsx';
import ShoppingTab from './components/ShoppingTab.jsx';
import HealthTab from './components/HealthTab.jsx';
import { useToast } from './components/ui.jsx';
import { STORAGE_KEYS, usePersistentState } from './lib/storage.js';
import { dateKey } from './lib/dates.js';
import { buildInitialPantry } from './data/pantry.js';

const TABS = [
  { id: 'hoje', label: 'Hoje', icon: CalendarCheck },
  { id: 'compras', label: 'Compras', icon: ShoppingCart },
  { id: 'saude', label: 'Saúde & Guia', icon: HeartPulse },
];

/** Garante que itens padrão adicionados em versões futuras apareçam na despensa salva. */
function mergePantry(saved) {
  const defaults = buildInitialPantry();
  if (!Array.isArray(saved)) return defaults;
  const ids = new Set(saved.map((i) => i.id));
  return [...saved, ...defaults.filter((d) => !ids.has(d.id))];
}

export default function App() {
  const [tab, setTab] = useState(() => {
    const h = window.location.hash.slice(1);
    return TABS.some((t) => t.id === h) ? h : 'hoje';
  });
  const [todayKey, setTodayKey] = useState(() => dateKey());
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [days, setDays] = usePersistentState(STORAGE_KEYS.days, {});
  const [pantry, setPantry] = usePersistentState(STORAGE_KEYS.pantry, buildInitialPantry);
  const [settings, setSettings] = usePersistentState(STORAGE_KEYS.settings, {});
  const [installPrompt, setInstallPrompt] = useState(null);
  const [toastNode, toast] = useToast();

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onInstalled = () => setInstallPrompt(null);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  useEffect(() => {
    setPantry((p) => mergePantry(p));
  }, [setPantry]);

  // Vira o dia automaticamente se o app ficar aberto após a meia-noite.
  useEffect(() => {
    const refresh = () => {
      const k = dateKey();
      setTodayKey((prev) => {
        if (prev !== k) setSelectedKey((sel) => (sel === prev ? k : sel));
        return k;
      });
    };
    const id = setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const toBuyCount = useMemo(() => pantry.filter((i) => i.status === 'buy').length, [pantry]);

  const restoreBackup = useCallback(
    (data) => {
      setDays(data.days);
      setPantry(mergePantry(data.pantry));
      setSettings(data.settings);
    },
    [setDays, setPantry, setSettings],
  );

  const changeTab = (id) => {
    if (id !== tab) window.history.pushState(null, '', `#${id}`);
    setTab(id);
    window.scrollTo({ top: 0 });
  };

  // Botão "voltar" do celular navega entre as abas.
  useEffect(() => {
    const onPop = () => {
      const h = window.location.hash.slice(1);
      setTab(TABS.some((t) => t.id === h) ? h : 'hoje');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div className="mx-auto min-h-dvh max-w-md bg-slate-50 pb-24 text-slate-800 shadow-xl shadow-slate-900/5">
      {installPrompt && (
        <div className="flex items-center justify-between gap-2 bg-teal-900 px-4 py-2 text-xs text-white">
          <span>📲 Instale o Bruna Care para usar offline na tela inicial</span>
          <button
            type="button"
            onClick={handleInstall}
            className="flex shrink-0 items-center gap-1 rounded-full bg-amber-400 px-3 py-1 font-bold text-slate-900 shadow-sm hover:bg-amber-300"
          >
            <Download size={14} aria-hidden="true" /> Instalar
          </button>
        </div>
      )}
      {tab === 'hoje' && (
        <TodayTab
          todayKey={todayKey}
          selectedKey={selectedKey}
          onSelectDate={setSelectedKey}
          days={days}
          setDays={setDays}
          settings={settings}
          toast={toast}
        />
      )}
      {tab === 'compras' && <ShoppingTab pantry={pantry} setPantry={setPantry} toast={toast} />}
      {tab === 'saude' && (
        <HealthTab
          settings={settings}
          setSettings={setSettings}
          todayKey={todayKey}
          backupData={{ days, pantry, settings }}
          onRestore={restoreBackup}
          toast={toast}
        />
      )}

      <nav
        aria-label="Navegação principal"
        className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-slate-200 bg-white/95 backdrop-blur"
      >
        <ul className="grid grid-cols-3">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => changeTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full flex-col items-center gap-0.5 pt-2 pb-1 text-xs font-medium transition-colors ${
                    active ? 'text-teal-700' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`relative flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                      active ? 'bg-teal-100' : ''
                    }`}
                  >
                    <Icon size={22} aria-hidden="true" />
                    {id === 'compras' && toBuyCount > 0 && (
                      <span className="absolute -top-1 right-1 min-w-5 rounded-full bg-rose-500 px-1 text-center text-[11px] leading-5 font-bold text-white">
                        {toBuyCount}
                        <span className="sr-only"> itens para comprar</span>
                      </span>
                    )}
                  </span>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {toastNode}
    </div>
  );
}
