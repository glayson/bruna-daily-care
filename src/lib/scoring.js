// Regras de negócio da gamificação (Seção 2): 5 estrelas diárias, 1,0 ⭐ por critério.
import { BASE_MEAL_IDS, OFF_PLAN_ID } from '../data/meals.js';
import { diffDays, weekStart } from './dates.js';

export const WATER_GOAL_ML = 3000;
export const WATER_FULL_ML = 2500; // 10 copos de 250 mL — ganha a estrela inteira
export const WATER_HALF_ML = 1500; // de 1,5 L até abaixo de 2,5 L — perde 0,5 ⭐
export const GLASS_ML = 250;
export const BOTTLE_ML = 500;
export const MAX_RESTS_PER_WEEK = 2;
export const BIOTIN_PAUSE_DAYS = 3; // 72 horas

export const ACTIVITIES = [
  { id: 'caminhada', label: 'Caminhada Acelerada', kind: 'exercise', emoji: '🚶‍♀️' },
  { id: 'pilates', label: 'Pilates', kind: 'exercise', emoji: '🧘‍♀️' },
  { id: 'musculacao', label: 'Musculação', kind: 'exercise', emoji: '🏋️‍♀️' },
  { id: 'bike', label: 'Bicicleta/Natação', kind: 'exercise', emoji: '🚴‍♀️' },
  { id: 'hidro', label: 'Hidroginástica', kind: 'exercise', emoji: '🏊‍♀️' },
  { id: 'descanso', label: 'Descanso Programado (máx. 2x/sem)', kind: 'rest', emoji: '😴' },
  { id: 'faltei', label: 'Não consegui treinar hoje (-1,0 ⭐)', kind: 'fail', emoji: '🚫' },
];

export function emptyDay() {
  return {
    waterLog: [], // cada entrada em mL — permite "desfazer"
    supplement: null, // 'taken' | 'paused' | null
    meals: {}, // { [mealId]: optionId | 'outra' | 'furo' }
    ironRule: null, // 'ok' | 'fail' | null
    activity: null, // id de ACTIVITIES | null
  };
}

export const waterTotal = (day) => (day?.waterLog ?? []).reduce((s, v) => s + v, 0);

/** Está dentro da janela de 72h antes de uma coleta de sangue agendada? */
export function inBiotinPause(dayKey, collectionKey) {
  if (!collectionKey) return false;
  const d = diffDays(dayKey, collectionKey);
  return d >= 0 && d <= BIOTIN_PAUSE_DAYS;
}

/** Descansos programados já usados na semana (seg–dom) ANTES do dia informado. */
export function restsBefore(days, dayKey) {
  const ws = weekStart(dayKey);
  return Object.entries(days).filter(
    ([k, v]) => v?.activity === 'descanso' && k < dayKey && weekStart(k) === ws,
  ).length;
}

export function restsInWeek(days, dayKey) {
  const ws = weekStart(dayKey);
  return Object.entries(days).filter(
    ([k, v]) => v?.activity === 'descanso' && weekStart(k) === ws,
  ).length;
}

/**
 * Calcula a nota do dia.
 * Retorna, por critério: earned (conquistado), lost (perdido por falha explícita
 * ou dia encerrado) e status textual. `isPast` encerra pendências (vira perda).
 */
export function scoreDay(day, { days, dayKey, isPast, collectionKey }) {
  const d = day ?? emptyDay();

  // 1. Hidratação
  const ml = waterTotal(d);
  let hydEarned = 0;
  if (ml >= WATER_FULL_ML) hydEarned = 1;
  else if (ml >= WATER_HALF_ML) hydEarned = 0.5;
  const hydration = {
    id: 'hidratacao',
    label: 'Hidratação',
    earned: hydEarned,
    lost: isPast ? 1 - hydEarned : 0,
    detail:
      ml >= WATER_FULL_ML
        ? `${(ml / 1000).toLocaleString('pt-BR')} L — meta batida!`
        : `${(ml / 1000).toLocaleString('pt-BR')} L de 2,5–3,0 L`,
    pending: ml < WATER_FULL_ML,
  };

  // 2. Suplemento
  const pauseOk = d.supplement === 'paused' && inBiotinPause(dayKey, collectionKey);
  const suppEarned = d.supplement === 'taken' || pauseOk ? 1 : 0;
  const supplement = {
    id: 'suplemento',
    label: 'Suplemento',
    earned: suppEarned,
    lost: isPast ? 1 - suppEarned : 0,
    detail:
      d.supplement === 'taken'
        ? 'Tomado ❄️'
        : pauseOk
          ? 'Pausa pré-exame (72h)'
          : 'Ainda não marcado',
    pending: !suppEarned,
  };

  // 3. Adesão às 4 refeições base (0,25 ⭐ cada) — furo no lanche opcional também desconta.
  let mealsEarned = 0;
  let mealsLost = 0;
  let done = 0;
  for (const id of BASE_MEAL_IDS) {
    const v = d.meals?.[id];
    if (v && v !== OFF_PLAN_ID) {
      mealsEarned += 0.25;
      done++;
    } else if (v === OFF_PLAN_ID || isPast) {
      mealsLost += 0.25;
    }
  }
  const snackOff = d.meals?.lancheManha === OFF_PLAN_ID;
  if (snackOff) {
    const cut = Math.min(0.25, mealsEarned);
    mealsEarned -= cut;
    mealsLost = Math.min(1, mealsLost + 0.25);
  }
  const furos = BASE_MEAL_IDS.filter((id) => d.meals?.[id] === OFF_PLAN_ID).length + (snackOff ? 1 : 0);
  const meals = {
    id: 'refeicoes',
    label: 'Refeições do Plano',
    earned: mealsEarned,
    lost: Math.min(1 - mealsEarned, mealsLost),
    detail: `${done}/4 no plano${furos ? ` · ${furos} furo${furos > 1 ? 's' : ''}` : ''}`,
    pending: done + BASE_MEAL_IDS.filter((id) => d.meals?.[id] === OFF_PLAN_ID).length < 4,
  };

  // 4. Regra do Ferro no Almoço
  const ironEarned = d.ironRule === 'ok' ? 1 : 0;
  const iron = {
    id: 'ferro',
    label: 'Regra do Ferro',
    earned: ironEarned,
    lost: d.ironRule === 'fail' || (isPast && !ironEarned) ? 1 : 0,
    detail:
      d.ironRule === 'ok'
        ? 'Almoço sem laticínios + cítrico'
        : d.ironRule === 'fail'
          ? 'Laticínio no almoço / sem cítrico'
          : 'Marcar no card do Almoço',
    pending: d.ironRule == null,
  };

  // 5. Atividade física & pressão
  const act = ACTIVITIES.find((a) => a.id === d.activity);
  let actEarned = 0;
  let actDetail = 'Ainda não registrada';
  let overLimit = false;
  if (act?.kind === 'exercise') {
    actEarned = 1;
    actDetail = `${act.label} (30 min+)`;
  } else if (act?.kind === 'rest') {
    const before = restsBefore(days, dayKey);
    overLimit = before >= MAX_RESTS_PER_WEEK;
    actEarned = overLimit ? 0 : 1;
    actDetail = overLimit ? 'Descanso acima do limite semanal' : 'Descanso programado';
  } else if (act?.kind === 'fail') {
    actDetail = 'Não treinou';
  }
  const activity = {
    id: 'atividade',
    label: 'Atividade Física',
    earned: actEarned,
    lost: act?.kind === 'fail' || overLimit || (isPast && !actEarned) ? 1 : 0,
    detail: actDetail,
    pending: !act,
    overLimit,
  };

  const criteria = [hydration, supplement, meals, iron, activity];
  const total = criteria.reduce((s, c) => s + c.earned, 0);
  const lost = criteria.reduce((s, c) => s + c.lost, 0);
  return {
    criteria,
    total: round2(total),
    potential: round2(5 - lost),
    lost: round2(lost),
  };
}

const round2 = (n) => Math.round(n * 100) / 100;

export function feedback(score, { isToday, potential }) {
  if (score >= 5) return '5,0 ⭐ — Dia Perfeito! Seu fígado e sua tireoide agradecem!';
  if (isToday && potential >= 5)
    return 'Você ainda pode fechar o dia com 5,0 ⭐ — continue registrando!';
  if (score >= 4) return 'Quase perfeito! Mais um detalhe e o dia fica nota máxima.';
  if (score >= 3) return 'Bom dia de cuidado! Cada hábito conta para a ferritina e o fígado.';
  if (score >= 2) return 'Dia de recomeço: um copo de água e um prato do plano já ajudam.';
  if (isToday) return 'Bora começar! Água, suplemento e um café da manhã proteico. 💪';
  return 'Dia difícil acontece. Amanhã é uma nova chance de 5 estrelas! 💚';
}

