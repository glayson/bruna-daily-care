import { useMemo } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Citrus,
  Droplets,
  Dumbbell,
  GlassWater,
  Info,
  Pill,
  RotateCcw,
  Snowflake,
  Utensils,
  Wind,
  X,
} from 'lucide-react';
import { Card, SectionTitle, StarRating, StatusPill } from './ui.jsx';
import { MEALS, OFF_PLAN_ID, OTHER_OPTION_ID } from '../data/meals.js';
import { PROFILE } from '../data/profile.js';
import { SUPPLEMENT_INFO } from '../data/supplements.js';
import {
  ACTIVITIES,
  BOTTLE_ML,
  GLASS_ML,
  MAX_RESTS_PER_WEEK,
  WATER_FULL_ML,
  WATER_GOAL_ML,
  WATER_HALF_ML,
  emptyDay,
  feedback,
  inBiotinPause,
  restsBefore,
  restsInWeek,
  scoreDay,
  waterTotal,
} from '../lib/scoring.js';
import { diffDays, fmtLong, fmtNumber, fmtWeekday, lastDays, parseKey } from '../lib/dates.js';

export default function TodayTab({ todayKey, selectedKey, onSelectDate, days, setDays, settings, toast }) {
  const dayKeys = useMemo(() => lastDays(todayKey, 7), [todayKey]);
  const isToday = selectedKey === todayKey;
  const day = { ...emptyDay(), ...days[selectedKey] };
  const collectionKey = settings.nextCollection || null;

  const scoreFor = (k) =>
    scoreDay(days[k], { days, dayKey: k, isPast: k < todayKey, collectionKey });
  const score = scoreFor(selectedKey);

  const update = (fn) =>
    setDays((prev) => ({
      ...prev,
      [selectedKey]: fn({ ...emptyDay(), ...prev[selectedKey] }),
    }));

  const pauseWindow = inBiotinPause(selectedKey, collectionKey);
  const daysToCollection = collectionKey ? diffDays(selectedKey, collectionKey) : null;

  return (
    <>
      {/* ---------- Header fixo de desempenho ---------- */}
      <header className="pt-safe sticky top-0 z-30 bg-gradient-to-b from-teal-700 to-teal-600 text-white shadow-md">
        <div className="px-4 pt-3">
          <div className="flex items-baseline justify-between">
            <h1 className="text-lg font-bold">Olá, {PROFILE.firstName} 👋</h1>
            <span className="text-xs text-teal-100">
              {fmtLong(selectedKey).replace(/^./, (c) => c.toUpperCase())}
            </span>
          </div>

          <div
            className="mt-2 grid grid-cols-8 gap-1 pb-1"
            role="group"
            aria-label="Escolher dia (hoje e últimos 7 dias)"
          >
            {dayKeys.map((k) => {
              const s = scoreFor(k);
              const active = k === selectedKey;
              const hasData = Boolean(days[k]);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => onSelectDate(k)}
                  aria-pressed={active}
                  className={`flex min-w-0 flex-col items-center rounded-xl py-1.5 text-[11px] transition-colors ${
                    active ? 'bg-white text-teal-800 shadow' : 'bg-teal-800/30 text-teal-50 hover:bg-teal-800/50'
                  }`}
                >
                  <span className="capitalize">{k === todayKey ? 'Hoje' : fmtWeekday(k)}</span>
                  <span className="text-sm font-bold">{parseKey(k).getDate()}</span>
                  <span className={`text-[10px] ${active ? 'text-amber-500' : 'text-amber-200'}`}>
                    {hasData ? `${fmtNumber(s.total, 1, 1)}★` : '–'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 pt-2 pb-3">
          <StarRating value={score.total} size={30} />
          <div className="leading-tight">
            <p className="text-2xl font-extrabold tabular-nums" aria-live="polite">
              {fmtNumber(score.total, 1, 2)}
            </p>
            {isToday && score.total < 5 && (
              <p className="text-[11px] text-teal-100">máx. possível: {fmtNumber(score.potential, 1, 2)}</p>
            )}
          </div>
        </div>
        <p className="bg-teal-800/40 px-4 py-2 text-sm font-medium">
          {feedback(score.total, { isToday, potential: score.potential })}
        </p>
      </header>

      <main className="space-y-4 p-4">
        {/* ---------- Painel dos 5 critérios ---------- */}
        <Card>
          <SectionTitle icon={Check}>Suas 5 estrelas</SectionTitle>
          <ul className="space-y-2">
            {score.criteria.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3">
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    c.earned >= 1
                      ? 'bg-amber-400 text-white'
                      : c.lost > 0
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="font-medium">{c.label}</span>
                    <span className="tabular-nums text-slate-600">
                      {fmtNumber(c.earned, 1, 2)}/1,0 ⭐
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ${
                        c.earned >= 1 ? 'bg-amber-400' : 'bg-teal-500'
                      }`}
                      style={{ width: `${c.earned * 100}%` }}
                    />
                  </div>
                  <p className={`mt-0.5 text-xs ${c.lost > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                    {c.detail}
                    {c.lost > 0 && ` · −${fmtNumber(c.lost, 1, 2)} ⭐`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {collectionKey && daysToCollection >= 0 && daysToCollection <= 7 && (
          <div
            role="alert"
            className={`flex gap-3 rounded-2xl p-4 text-sm ring-1 ${
              pauseWindow ? 'bg-rose-50 text-rose-800 ring-rose-200' : 'bg-amber-50 text-amber-900 ring-amber-200'
            }`}
          >
            <AlertTriangle className="shrink-0" size={20} aria-hidden="true" />
            <p>
              <strong>
                Coleta de sangue {daysToCollection === 0 ? 'hoje' : `em ${daysToCollection} dia${daysToCollection > 1 ? 's' : ''}`}.
              </strong>{' '}
              {pauseWindow
                ? 'Você está na janela de 72h: suspenda o suplemento (biotina interfere na quimioluminescência). Marque "Pausa pré-exame" para manter a estrela.'
                : 'Lembre-se: suspender o suplemento 72h antes da coleta.'}
            </p>
          </div>
        )}

        <HydrationCard day={day} update={update} toast={toast} />
        <SupplementCard day={day} update={update} pauseWindow={pauseWindow} />

        <section aria-labelledby="meals-title" className="space-y-3">
          <h2 id="meals-title" className="flex items-center gap-2 px-1 text-base font-semibold">
            <Utensils size={18} className="text-teal-600" aria-hidden="true" />
            Plano Alimentar
          </h2>
          {MEALS.map((meal) => (
            <MealCard key={meal.id} meal={meal} day={day} update={update} dayKey={selectedKey} />
          ))}
        </section>

        <ActivityCard day={day} update={update} days={days} dayKey={selectedKey} />

        <p className="px-2 pb-2 text-center text-xs text-slate-400">
          As orientações do app não substituem o acompanhamento médico e nutricional.
        </p>
      </main>
    </>
  );
}

/* ================= Hidratação ================= */
function HydrationCard({ day, update, toast }) {
  const ml = waterTotal(day);
  const pct = Math.min(100, (ml / WATER_GOAL_ML) * 100);
  const glasses = Math.floor(ml / GLASS_ML);

  const add = (v) => {
    update((d) => ({ ...d, waterLog: [...d.waterLog, v] }));
    const next = ml + v;
    if (ml < WATER_FULL_ML && next >= WATER_FULL_ML) toast('💧 Meta de hidratação batida! +1,0 ⭐');
  };
  const undo = () => update((d) => ({ ...d, waterLog: d.waterLog.slice(0, -1) }));

  return (
    <Card>
      <SectionTitle
        icon={Droplets}
        right={
          <span className="text-sm font-semibold tabular-nums text-sky-700">
            {ml.toLocaleString('pt-BR')} / {WATER_GOAL_ML.toLocaleString('pt-BR')} mL
          </span>
        }
      >
        Hidratação
      </SectionTitle>

      <div className="relative">
        <div
          className="h-4 overflow-hidden rounded-full bg-sky-100"
          role="progressbar"
          aria-label="Água ingerida hoje"
          aria-valuemin={0}
          aria-valuemax={WATER_GOAL_ML}
          aria-valuenow={Math.min(ml, WATER_GOAL_ML)}
          aria-valuetext={`${ml} mililitros`}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${
              ml >= WATER_FULL_ML ? 'bg-gradient-to-r from-sky-400 to-teal-400' : 'bg-sky-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {[WATER_HALF_ML, WATER_FULL_ML].map((m) => (
          <span
            key={m}
            className="absolute top-0 h-4 w-0.5 bg-white/90"
            style={{ left: `${(m / WATER_GOAL_ML) * 100}%` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="relative mt-1 h-4 text-[10px] text-slate-500" aria-hidden="true">
        <span className="absolute left-0">0</span>
        <span className="absolute -translate-x-1/2" style={{ left: '50%' }}>1,5 L (½⭐)</span>
        <span className="absolute -translate-x-1/2" style={{ left: `${(WATER_FULL_ML / WATER_GOAL_ML) * 100}%` }}>
          2,5 L ⭐
        </span>
        <span className="absolute right-0">3 L</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1" aria-label={`${glasses} copos de 250 mL`}>
        {Array.from({ length: 12 }, (_, i) => (
          <GlassWater
            key={i}
            size={22}
            aria-hidden="true"
            className={i < glasses ? 'text-sky-500' : 'text-slate-200'}
            fill={i < glasses ? 'currentColor' : 'none'}
            fillOpacity={0.25}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
        <button
          type="button"
          onClick={() => add(GLASS_ML)}
          className="rounded-xl bg-sky-500 px-3 py-3 text-sm font-semibold text-white shadow-sm active:scale-95 hover:bg-sky-600"
        >
          +250 mL <span className="block text-[11px] font-normal opacity-90">1 copo</span>
        </button>
        <button
          type="button"
          onClick={() => add(BOTTLE_ML)}
          className="rounded-xl bg-sky-600 px-3 py-3 text-sm font-semibold text-white shadow-sm active:scale-95 hover:bg-sky-700"
        >
          +500 mL <span className="block text-[11px] font-normal opacity-90">1 garrafinha</span>
        </button>
        <button
          type="button"
          onClick={undo}
          disabled={!day.waterLog.length}
          aria-label="Desfazer último registro de água"
          className="flex items-center justify-center rounded-xl bg-slate-100 px-4 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
        >
          <RotateCcw size={20} aria-hidden="true" />
        </button>
      </div>
    </Card>
  );
}

/* ================= Suplemento ================= */
function SupplementCard({ day, update, pauseWindow }) {
  const taken = day.supplement === 'taken';
  const paused = day.supplement === 'paused';
  const set = (v) => update((d) => ({ ...d, supplement: d.supplement === v ? null : v }));

  return (
    <Card className={taken || paused ? 'ring-2 ring-teal-400' : ''}>
      <SectionTitle icon={Pill}>Suplemento Refrigerado</SectionTitle>
      <button
        type="button"
        role="checkbox"
        aria-checked={taken}
        onClick={() => set('taken')}
        className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors ${
          taken ? 'border-teal-500 bg-teal-50' : 'border-dashed border-slate-300 hover:border-teal-400'
        }`}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
            taken ? 'animate-pop bg-teal-500 text-white' : 'bg-slate-100 text-transparent'
          }`}
        >
          <Check size={20} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold">
          Tomei minha fórmula manipulada{' '}
          <span className="whitespace-nowrap text-sky-600">
            (Guardar na Geladeira <Snowflake size={14} className="inline" aria-hidden="true" />)
          </span>
        </span>
      </button>

      {pauseWindow && (
        <button
          type="button"
          role="checkbox"
          aria-checked={paused}
          onClick={() => set('paused')}
          className={`mt-2 flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left text-sm ${
            paused ? 'border-rose-400 bg-rose-50' : 'border-dashed border-rose-200'
          }`}
        >
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
              paused ? 'bg-rose-500 text-white' : 'bg-rose-50 text-transparent'
            }`}
          >
            <Check size={20} aria-hidden="true" />
          </span>
          <span>
            <strong>Pausa pré-exame (72h)</strong> — suspendi por causa da biotina. Conta como estrela.
          </span>
        </button>
      )}

      <p className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-900">
        <Info size={16} className="shrink-0" aria-hidden="true" />
        {SUPPLEMENT_INFO.intakeTip}
      </p>
    </Card>
  );
}

/* ================= Refeições ================= */
function MealCard({ meal, day, update, dayKey }) {
  const value = day.meals?.[meal.id] ?? null;
  const offPlan = value === OFF_PLAN_ID;
  const chosen = meal.options.find((o) => o.id === value);
  const isLunch = meal.id === 'almoco';

  const setMeal = (v) =>
    update((d) => {
      const meals = { ...d.meals };
      if (v == null) delete meals[meal.id];
      else meals[meal.id] = v;
      return { ...d, meals };
    });
  const setIron = (v) => update((d) => ({ ...d, ironRule: d.ironRule === v ? null : v }));

  let pill = meal.optional ? null : <StatusPill tone="slate">Pendente</StatusPill>;
  if (offPlan) pill = <StatusPill tone="red">Furo −0,25 ⭐</StatusPill>;
  else if (value) pill = <StatusPill tone="green"><Check size={12} aria-hidden="true" /> No plano</StatusPill>;

  const name = `${dayKey}-${meal.id}`;

  return (
    <details className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 open:ring-teal-200">
      <summary className="flex items-center gap-3 p-4">
        <span className="text-2xl" aria-hidden="true">{meal.emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">
            {meal.name}
            {meal.optional && <span className="font-normal text-slate-500"> [Opcional]</span>}
          </span>
          <span className="block truncate text-xs text-slate-500">
            {chosen ? chosen.title : value === OTHER_OPTION_ID ? 'Outra opção saudável' : offPlan ? 'Fora do plano' : meal.focus}
          </span>
        </span>
        {pill}
        {isLunch && day.ironRule === 'ok' && <span aria-label="Regra do ferro cumprida">🍋</span>}
        <ChevronDown size={18} className="chevron shrink-0 text-slate-400 transition-transform" aria-hidden="true" />
      </summary>

      <div className="space-y-3 border-t border-slate-100 px-4 pt-3 pb-4">
        <p className={`rounded-lg p-2.5 text-xs ${isLunch ? 'bg-rose-50 font-medium text-rose-800' : 'bg-teal-50 text-teal-800'}`}>
          {meal.focus}
        </p>

        <fieldset className="space-y-2">
          <legend className="sr-only">Opção escolhida para {meal.name}</legend>
          {[...meal.options, { id: OTHER_OPTION_ID, title: 'Outra opção saudável dentro da meta', description: '' }].map(
            (opt, idx) => {
              const checked = value === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors ${
                    checked ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={name}
                    value={opt.id}
                    checked={checked}
                    onChange={() => setMeal(opt.id)}
                    className="mt-0.5 size-4 shrink-0 accent-teal-600"
                  />
                  <span className="text-sm">
                    <span className="font-semibold">
                      {opt.id === OTHER_OPTION_ID ? opt.title : `Opção ${idx + 1} — ${opt.title}`}
                    </span>
                    {opt.description && (
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">{opt.description}</span>
                    )}
                  </span>
                </label>
              );
            },
          )}
        </fieldset>

        <div className="flex gap-2">
          <button
            type="button"
            aria-pressed={offPlan}
            onClick={() => setMeal(offPlan ? null : OFF_PLAN_ID)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold ${
              offPlan ? 'border-rose-500 bg-rose-500 text-white' : 'border-rose-200 text-rose-600 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle size={16} aria-hidden="true" />
            Furei a dieta nesta refeição (−0,25 ⭐)
          </button>
          {value && (
            <button
              type="button"
              onClick={() => setMeal(null)}
              aria-label={`Limpar seleção de ${meal.name}`}
              className="rounded-xl bg-slate-100 px-3 text-slate-500 hover:bg-slate-200"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>

        {isLunch && (
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50/60 p-3">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900">
              <Citrus size={18} aria-hidden="true" /> Estrela 4 — Regra do Ferro
            </p>
            <div className="grid gap-2">
              <button
                type="button"
                aria-pressed={day.ironRule === 'ok'}
                onClick={() => setIron('ok')}
                className={`flex items-center gap-2 rounded-lg border-2 p-2.5 text-left text-sm font-medium ${
                  day.ironRule === 'ok'
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <Check size={18} className="shrink-0" aria-hidden="true" />
                Almocei sem laticínios + usei limão/fruta cítrica (+1,0 ⭐)
              </button>
              <button
                type="button"
                aria-pressed={day.ironRule === 'fail'}
                onClick={() => setIron('fail')}
                className={`flex items-center gap-2 rounded-lg border-2 p-2.5 text-left text-sm font-medium ${
                  day.ironRule === 'fail'
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-rose-200 bg-white text-rose-700 hover:bg-rose-50'
                }`}
              >
                <X size={18} className="shrink-0" aria-hidden="true" />
                Misturei queijo/laticínio ou fiquei sem ferro vegetal + cítrico (−1,0 ⭐)
              </button>
            </div>
            <p className="mt-2 text-xs text-amber-900/80">
              O cálcio dos laticínios compete com o ferro vegetal; a vitamina C do limão multiplica sua
              absorção. Objetivo: subir a ferritina de 18,2 ng/mL.
            </p>
          </div>
        )}
      </div>
    </details>
  );
}

/* ================= Atividade física ================= */
function ActivityCard({ day, update, days, dayKey }) {
  const usedBefore = restsBefore(days, dayKey);
  const usedWeek = restsInWeek(days, dayKey);
  const limitReached = usedBefore >= MAX_RESTS_PER_WEEK;
  const set = (v) => update((d) => ({ ...d, activity: d.activity === v ? null : v }));

  return (
    <Card>
      <SectionTitle
        icon={Dumbbell}
        right={
          <StatusPill tone={usedWeek >= MAX_RESTS_PER_WEEK ? 'yellow' : 'slate'}>
            Descansos: {usedWeek}/{MAX_RESTS_PER_WEEK} na semana
          </StatusPill>
        }
      >
        Atividade Física
      </SectionTitle>
      <p className="mb-3 text-xs text-slate-500">Pelo menos 30 minutos de exercício ou descanso programado.</p>

      <fieldset className="grid grid-cols-2 gap-2">
        <legend className="sr-only">Atividade do dia</legend>
        {ACTIVITIES.map((a) => {
          const checked = day.activity === a.id;
          const isFail = a.kind === 'fail';
          const isRest = a.kind === 'rest';
          const full = isFail || isRest;
          return (
            <label
              key={a.id}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 p-2.5 text-sm font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-teal-500 ${
                full ? 'col-span-2' : ''
              } ${
                checked
                  ? isFail
                    ? 'border-rose-500 bg-rose-50 text-rose-800'
                    : 'border-teal-500 bg-teal-50 text-teal-900'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <input
                type="radio"
                name={`${dayKey}-atividade`}
                checked={checked}
                onChange={() => set(a.id)}
                onClick={() => checked && set(a.id)}
                className="sr-only"
              />
              <span className="text-lg" aria-hidden="true">{a.emoji}</span>
              <span className="flex-1">
                {a.label}
                {isRest && limitReached && (
                  <span className="block text-xs font-normal text-amber-700">
                    Limite semanal atingido — não vale estrela hoje.
                  </span>
                )}
              </span>
              {checked && <Check size={16} aria-hidden="true" />}
            </label>
          );
        })}
      </fieldset>

      <p className="mt-3 flex gap-2 rounded-lg bg-sky-50 p-2.5 text-xs text-sky-900">
        <Wind size={16} className="shrink-0" aria-hidden="true" />
        <span>
          <strong>Segurança para a pressão arterial:</strong> nos exercícios de força, solte o ar ao fazer
          esforço e nunca prenda a respiração (apneia).
        </span>
      </p>
    </Card>
  );
}
