import { useRef } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  ChevronDown,
  Download,
  FlaskConical,
  Pill,
  ShieldCheck,
  Snowflake,
  Upload,
  User,
} from 'lucide-react';
import { Card, SectionTitle, StatusPill } from './ui.jsx';
import { EXAMS } from '../data/exams.js';
import { SUPPLEMENT_BLOCKS, SUPPLEMENT_INFO } from '../data/supplements.js';
import { EXAM_COLLECTION_DATE, LAB_NAME, PROFILE, ageOn, bmi } from '../data/profile.js';
import { buildBackup, validateBackup } from '../lib/storage.js';
import { addDays, dateKey, diffDays, fmtNumber, fmtShort } from '../lib/dates.js';

const TONE_BORDER = { red: 'border-l-rose-500', yellow: 'border-l-amber-400', green: 'border-l-emerald-500' };
const BLOCK_COLORS = {
  violet: 'bg-violet-50 text-violet-900 ring-violet-200',
  rose: 'bg-rose-50 text-rose-900 ring-rose-200',
  amber: 'bg-amber-50 text-amber-900 ring-amber-200',
  emerald: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
};

export default function HealthTab({ settings, setSettings, todayKey, backupData, onRestore, toast }) {
  const counts = EXAMS.reduce((acc, e) => ({ ...acc, [e.status]: (acc[e.status] ?? 0) + 1 }), {});

  return (
    <>
      <header className="pt-safe sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur">
        <div className="px-4 py-3">
          <h1 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <FlaskConical className="text-teal-600" aria-hidden="true" /> Saúde & Guia
          </h1>
          <p className="text-xs text-slate-500">
            Exames de {EXAM_COLLECTION_DATE} · {LAB_NAME}
          </p>
        </div>
      </header>

      <main className="space-y-4 p-4">
        <ProfileCard />

        {/* ---------- Banner de confirmação clínica ---------- */}
        <section
          aria-labelledby="hashimoto-title"
          className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-4 text-white shadow-md"
        >
          <p className="text-xs font-semibold tracking-wide text-violet-200 uppercase">Confirmação clínica</p>
          <h2 id="hashimoto-title" className="mt-1 text-lg font-bold">
            🦋 Tireoidite de Hashimoto confirmada
          </h2>
          <p className="mt-2 text-sm text-violet-50">
            A suspeita médica se confirma pelo exame de <strong>Anticorpos Anti-TPO em 400,0 UI/mL</strong>{' '}
            (referência: inferior a 13,8 UI/mL).
          </p>
          <div className="mt-3 rounded-xl bg-white/15 p-3 text-sm">
            <p className="font-semibold">✨ A ótima notícia</p>
            <p className="mt-1 text-violet-50">
              Sua tireoide está funcionando perfeitamente no momento (<strong>estado eutireoideo</strong>), com{' '}
              <strong>TSH em 1,70 microUI/mL</strong> e <strong>T4 Livre em 1,25 ng/dL</strong>.
            </p>
          </div>
          <p className="mt-3 flex gap-2 text-xs text-violet-100">
            <ShieldCheck size={16} className="shrink-0" aria-hidden="true" />
            A coleta de {EXAM_COLLECTION_DATE} foi feita com pausa prévia do suplemento, garantindo que a biotina
            não interferiu nos ensaios de quimioluminescência.
          </p>
        </section>

        {/* ---------- Exames ---------- */}
        <section aria-labelledby="exams-title">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 id="exams-title" className="flex items-center gap-2 text-base font-semibold">
              <FlaskConical size={18} className="text-teal-600" aria-hidden="true" />
              Exames Laboratoriais ({EXAMS.length})
            </h2>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5 px-1">
            <StatusPill tone="red">🔴 {counts.red ?? 0} alvo/confirmado</StatusPill>
            <StatusPill tone="yellow">🟡 {counts.yellow ?? 0} atenção</StatusPill>
            <StatusPill tone="green">🟢 {counts.green ?? 0} normais</StatusPill>
          </div>
          <div className="space-y-2">
            {EXAMS.map((exam) => (
              <ExamItem key={exam.id} exam={exam} />
            ))}
          </div>
        </section>

        {/* ---------- Suplemento ---------- */}
        <section aria-labelledby="supp-title" className="space-y-3">
          <h2 id="supp-title" className="flex items-center gap-2 px-1 text-base font-semibold">
            <Pill size={18} className="text-teal-600" aria-hidden="true" />
            Guia da Fórmula Manipulada
          </h2>
          <Card className="bg-sky-50 ring-sky-200">
            <p className="flex items-center gap-2 text-sm font-semibold text-sky-900">
              <Snowflake size={18} aria-hidden="true" /> {SUPPLEMENT_INFO.form} · {SUPPLEMENT_INFO.doses} doses
            </p>
            <p className="mt-1 text-sm text-sky-900">{SUPPLEMENT_INFO.storage}</p>
            <p className="mt-1 text-xs text-sky-800">{SUPPLEMENT_INFO.intakeTip}</p>
          </Card>

          <BiotinAlert settings={settings} setSettings={setSettings} todayKey={todayKey} />

          {SUPPLEMENT_BLOCKS.map((block, bi) => (
            <Card key={block.id} flush>
              <h3 className={`rounded-t-2xl px-4 py-3 text-sm font-bold ring-1 ring-inset ${BLOCK_COLORS[block.color]}`}>
                <span aria-hidden="true">{block.emoji}</span> {bi + 1}. {block.title}
              </h3>
              <ul className="divide-y divide-slate-100">
                {block.items.map((item) => (
                  <li key={item.name} className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
                    {item.note && (
                      <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
                        <strong>Nota:</strong> {item.note}
                      </p>
                    )}
                    {item.alert && (
                      <p role="note" className="mt-2 flex gap-2 rounded-lg bg-rose-50 p-2 text-xs font-medium text-rose-800">
                        <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />
                        {item.alert}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </section>

        <BackupCard backupData={backupData} onRestore={onRestore} toast={toast} />

        <p className="px-2 pb-2 text-center text-xs text-slate-400">
          Conteúdo informativo para apoiar a conversa com sua equipe de saúde. Não substitui consulta médica.
        </p>
      </main>
    </>
  );
}

function ProfileCard() {
  const age = ageOn(new Date());
  return (
    <Card>
      <SectionTitle icon={User}>Meu Perfil</SectionTitle>
      <p className="font-semibold">{PROFILE.name}</p>
      <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
        {[
          ['Idade', `${age} anos`],
          ['Altura', `${fmtNumber(PROFILE.heightM, 2, 2)} m`],
          ['Peso', `${PROFILE.weightKg} kg`],
          ['IMC', fmtNumber(bmi(), 1, 1)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-slate-50 p-2">
            <dt className="text-[11px] text-slate-500">{k}</dt>
            <dd className="text-sm font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-1 text-center text-[11px] text-slate-400">Nascida em 30/11/1984 · IMC em kg/m²</p>
      <details className="mt-3">
        <summary className="flex items-center justify-between text-sm font-medium text-teal-700">
          Condições e preferências
          <ChevronDown size={16} className="chevron transition-transform" aria-hidden="true" />
        </summary>
        <div className="mt-2 space-y-2 text-sm text-slate-600">
          <p className="text-xs font-semibold text-slate-500 uppercase">Condições de base</p>
          <ul className="list-disc space-y-1 pl-5">
            {PROFILE.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="pt-1 text-xs font-semibold text-slate-500 uppercase">Restrições e preferências</p>
          <ul className="list-disc space-y-1 pl-5">
            {PROFILE.restrictions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </details>
    </Card>
  );
}

function ExamItem({ exam }) {
  return (
    <details
      name="exames"
      className={`rounded-xl border-l-4 bg-white shadow-sm ring-1 ring-slate-900/5 ${TONE_BORDER[exam.status]}`}
    >
      <summary className="flex items-center gap-2 p-3">
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{exam.name}</span>
          <span className="block truncate text-xs text-slate-500">
            {exam.results.map((r) => r.value).join(' · ')}
          </span>
        </span>
        <StatusPill tone={exam.status}>{exam.statusLabel.replace(/^\S+\s/, '')}</StatusPill>
        <ChevronDown size={16} className="chevron shrink-0 text-slate-400 transition-transform" aria-hidden="true" />
      </summary>
      <div className="space-y-3 border-t border-slate-100 px-3 pt-3 pb-3 text-sm">
        <p className="text-sm font-medium">{exam.statusLabel}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Resultado atual</p>
            <ul className="mt-1 space-y-0.5">
              {exam.results.map((r) => (
                <li key={r.label} className="text-xs">
                  {exam.results.length > 1 && <span className="text-slate-500">{r.label}: </span>}
                  <strong className="text-slate-800">{r.value}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Referência / Meta</p>
            <ul className="mt-1 space-y-0.5">
              {exam.reference.map((r) => (
                <li key={r} className="text-xs text-slate-700">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="leading-relaxed text-slate-700">{exam.explanation}</p>
        {exam.history && (
          <p className="text-xs text-slate-500">
            <strong>Histórico:</strong> {exam.history}
          </p>
        )}
        {exam.trend && <TrendBars trend={exam.trend} unit={exam.trendUnit} tone={exam.status} />}
      </div>
    </details>
  );
}

function TrendBars({ trend, unit, tone }) {
  const max = Math.max(...trend.map((t) => t.value));
  const bar = tone === 'red' ? 'bg-rose-400' : tone === 'yellow' ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <figure>
      <figcaption className="mb-1 text-[11px] font-semibold text-slate-500 uppercase">Evolução ({unit})</figcaption>
      <div className="flex h-24 items-end gap-2" aria-hidden="true">
        {trend.map((t, i) => (
          <div key={t.label} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[11px] font-semibold tabular-nums">{t.value.toLocaleString('pt-BR')}</span>
            <div
              className={`w-full max-w-10 rounded-t-md ${i === trend.length - 1 ? bar : 'bg-slate-300'}`}
              style={{ height: `${(t.value / max) * 64}px` }}
            />
            <span className="text-[10px] text-slate-500">{t.label}</span>
          </div>
        ))}
      </div>
      <p className="sr-only">{trend.map((t) => `${t.label}: ${t.value} ${unit}`).join('; ')}</p>
    </figure>
  );
}

function BiotinAlert({ settings, setSettings, todayKey }) {
  const next = settings.nextCollection || '';
  const days = next ? diffDays(todayKey, next) : null;
  const pauseStart = next ? diffDays(todayKey, next) - 3 : null;

  return (
    <Card className="bg-rose-50 ring-rose-200">
      <p className="flex items-center gap-2 text-sm font-bold text-rose-800">
        <AlertTriangle size={18} aria-hidden="true" /> Alerta da Biotina
      </p>
      <p className="mt-1 text-sm text-rose-900">{SUPPLEMENT_INFO.biotinAlert}</p>
      <label className="mt-3 block text-xs font-semibold text-rose-900" htmlFor="next-collection">
        <CalendarClock size={14} className="mr-1 inline" aria-hidden="true" />
        Data da próxima coleta de sangue
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="next-collection"
          type="date"
          min={todayKey}
          value={next}
          onChange={(e) => setSettings((s) => ({ ...s, nextCollection: e.target.value || null }))}
          className="flex-1 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm"
        />
        {next && (
          <button
            type="button"
            onClick={() => setSettings((s) => ({ ...s, nextCollection: null }))}
            className="rounded-lg bg-white px-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200"
          >
            Limpar
          </button>
        )}
      </div>
      {next && days != null && (
        <p className="mt-2 text-xs text-rose-800">
          {days < 0
            ? 'Esta data já passou — atualize quando agendar a próxima coleta.'
            : pauseStart > 0
              ? `Coleta em ${fmtShort(next)}. Pare o suplemento a partir de ${fmtShort(
                  addDays(next, -3),
                )} (72h antes). O app vai te lembrar na aba Hoje.`
              : `Coleta em ${fmtShort(next)} — você já está na janela de 72h: não tome o suplemento.`}
        </p>
      )}
    </Card>
  );
}

function BackupCard({ backupData, onRestore, toast }) {
  const fileRef = useRef(null);

  const exportBackup = () => {
    const data = buildBackup(backupData);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bruna-daily-care-backup-${dateKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('💾 Backup exportado!');
  };

  const importBackup = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = validateBackup(JSON.parse(await file.text()));
      if (!window.confirm('Importar este backup vai substituir os dados atuais deste aparelho. Continuar?')) return;
      onRestore(data);
      toast('✅ Backup restaurado com sucesso!');
    } catch (err) {
      toast(`❌ ${err.message || 'Não foi possível ler o arquivo.'}`);
    }
  };

  return (
    <Card>
      <SectionTitle icon={Download}>Backup dos meus dados</SectionTitle>
      <p className="text-xs text-slate-500">
        Seus registros ficam salvos apenas neste aparelho. Exporte um arquivo JSON de vez em quando para não
        perder nada (ou para passar para outro celular).
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={exportBackup}
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Download size={16} aria-hidden="true" /> Exportar
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-teal-600 px-3 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50"
        >
          <Upload size={16} aria-hidden="true" /> Importar
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={importBackup}
          className="hidden"
          aria-label="Arquivo de backup"
        />
      </div>
    </Card>
  );
}
