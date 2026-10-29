// Base de dados de exames laboratoriais (Seção 5) — coleta de 27/10/2026, Hermes Pardini.
// status: 'red' | 'yellow' | 'green'

export const EXAMS = [
  {
    id: 'anti-tpo',
    name: 'Anticorpos Anti-TPO',
    results: [{ label: 'Anti-TPO', value: '400,0 UI/mL' }],
    reference: ['Inferior a 13,8 UI/mL'],
    status: 'red',
    statusLabel: '🔴 Confirmado (Hashimoto)',
    explanation:
      'Mede anticorpos contra a enzima da tireoide; atingiu o limite analítico superior do teste e confirma a Tireoidite de Hashimoto.',
  },
  {
    id: 'tsh',
    name: 'TSH Ultra Sensível',
    results: [{ label: 'TSH', value: '1,70 microUI/mL' }],
    reference: ['0,48 a 5,60 microUI/mL'],
    status: 'green',
    statusLabel: '🟢 Excelente',
    explanation:
      'Hormônio que comanda a tireoide; mostra que a glândula está trabalhando no ritmo perfeito.',
    history: '1,08 em jun/25 e fev/25; 1,41 em set/24.',
  },
  {
    id: 't4l',
    name: 'T4 Livre',
    results: [{ label: 'T4 Livre', value: '1,25 ng/dL' }],
    reference: ['0,96 a 1,73 ng/dL'],
    status: 'green',
    statusLabel: '🟢 Excelente',
    explanation:
      'Principal hormônio produzido pela tireoide disponível na circulação; está em nível ótimo.',
    history: '1,21 em jun/25; 1,20 em fev/25.',
  },
  {
    id: 'ferritina',
    name: 'Ferritina Sérica',
    results: [{ label: 'Ferritina', value: '18,2 ng/mL' }],
    reference: ['Lab: 10,0 a 271,0 ng/mL', 'Meta clínica: > 40–50 ng/mL'],
    status: 'yellow',
    statusLabel: '🟡 Atenção (Em queda)',
    explanation:
      'É o estoque real de ferro do corpo. Explica cansaço/queda de cabelo e exige separar laticínios do almoço.',
    history: '34,4 (set/22) → 25,3 (set/24) → 21,8 (jul/25) → 18,2 ng/mL (out/26).',
    trend: [
      { label: 'set/22', value: 34.4 },
      { label: 'set/24', value: 25.3 },
      { label: 'jul/25', value: 21.8 },
      { label: 'out/26', value: 18.2 },
    ],
    trendUnit: 'ng/mL',
  },
  {
    id: 'ferro',
    name: 'Ferro Sérico / Sat. Transferrina / CTCF',
    results: [
      { label: 'Ferro', value: '114 mcg/dL' },
      { label: 'Sat. Transferrina', value: '34%' },
      { label: 'CTCF', value: '339' },
    ],
    reference: ['Ferro: 50 a 170 mcg/dL', 'Sat.: 15 a 50%'],
    status: 'green',
    statusLabel: '🟢 Normal',
    explanation:
      'Medem o ferro circulante no dia e a capacidade de transporte no sangue; todos dentro da normalidade.',
  },
  {
    id: 'hemograma',
    name: 'Hemograma Completo',
    results: [
      { label: 'Hemoglobina', value: '15,0 g/dL' },
      { label: 'VCM', value: '80,0 fL' },
      { label: 'Hemácias', value: '5,20 mi' },
      { label: 'Leucócitos', value: '6.070/mm³' },
      { label: 'Plaquetas', value: '371.000/mm³' },
    ],
    reference: ['Hb: 12 a 16 g/dL', 'VCM: 80 a 100 fL', 'Hemácias: 3,8 a 4,8 mi'],
    status: 'green',
    statusLabel: '🟢 Bom (VCM no limite)',
    explanation:
      'Sem anemia (hemoglobina ótima em 15,0 g/dL), leucócitos (6.070/mm³) e plaquetas (371.000/mm³) normais. O tamanho médio das hemácias (VCM de 80,0 fL) está no limite mínimo por conta da ferritina baixa.',
  },
  {
    id: 'vitd',
    name: '25-Hidroxivitamina D',
    results: [{ label: 'Vitamina D', value: '23,4 ng/mL' }],
    reference: ['Geral: 20 a 60 ng/mL', 'Grupos de risco: 30 a 60 ng/mL'],
    status: 'yellow',
    statusLabel: '🟡 Subir para > 30',
    explanation:
      'Essencial para imunidade, ossos e controle de doenças autoimunes; está abaixo da meta ideal de 30 a 60 ng/mL.',
    history: '26,0 em jun/25; 26,7 em fev/25.',
  },
  {
    id: 'b12',
    name: 'Vitamina B12',
    results: [{ label: 'B12', value: '368 pg/mL' }],
    reference: ['172 a 890 pg/mL'],
    status: 'yellow',
    statusLabel: '🟡 Intermediária',
    explanation:
      'Fundamental para memória, energia e nervos; como não há consumo de carnes, o uso de metilcobalamina no suplemento mantém e eleva esse nível.',
  },
  {
    id: 'zinco',
    name: 'Zinco no Soro',
    results: [{ label: 'Zinco', value: '94,0 mcg/dL' }],
    reference: ['60,0 a 120,0 mcg/dL'],
    status: 'green',
    statusLabel: '🟢 Ótimo',
    explanation:
      'Mineral vital para a imunidade, unhas, cabelo e conversão dos hormônios da tireoide.',
  },
  {
    id: 'tg',
    name: 'Triglicérides',
    results: [{ label: 'Triglicérides', value: '201 mg/dL' }],
    reference: ['Com jejum: < 150 mg/dL', 'Sem jejum: < 175 mg/dL'],
    status: 'red',
    statusLabel: '🔴 Alvo dos 60 dias',
    explanation:
      'Gordura no sangue ligada ao excesso de carboidratos simples e peso; subiu bastante em relação a jun/25 (93 mg/dL) e fev/25 (117 mg/dL).',
    history: '117 (fev/25) → 93 (jun/25) → 201 mg/dL (out/26).',
    trend: [
      { label: 'fev/25', value: 117 },
      { label: 'jun/25', value: 93 },
      { label: 'out/26', value: 201 },
    ],
    trendUnit: 'mg/dL',
  },
  {
    id: 'colesterol',
    name: 'Colesterol Total e Frações',
    results: [
      { label: 'Total', value: '207 mg/dL' },
      { label: 'HDL', value: '41 mg/dL' },
      { label: 'LDL', value: '131 mg/dL' },
      { label: 'Não-HDL', value: '166 mg/dL' },
      { label: 'VLDL', value: '35 mg/dL' },
    ],
    reference: [
      'Total: < 190 mg/dL',
      'HDL: > 40 mg/dL',
      'LDL (baixo risco): < 115 mg/dL',
      'Não-HDL: < 145 mg/dL',
    ],
    status: 'yellow',
    statusLabel: '🟡 Atenção',
    explanation:
      'O colesterol protetor (HDL) caiu de 61 mg/dL (jun/25) para 41 mg/dL, enquanto o LDL (131 mg/dL) e o Não-HDL (166 mg/dL) subiram acima da meta.',
  },
  {
    id: 'ggt',
    name: 'Gama GT',
    results: [{ label: 'Gama GT', value: '52 U/L' }],
    reference: ['Mulheres: < 38 U/L'],
    status: 'red',
    statusLabel: '🔴 Alvo dos 60 dias',
    explanation:
      'Enzima que sinaliza sobrecarga metabólica ou acúmulo de gordura no fígado; subiu de 33 U/L (fev/25) para 52 U/L. Responde rápido ao corte de açúcares/massas e perda de peso.',
    trend: [
      { label: 'fev/25', value: 33 },
      { label: 'out/26', value: 52 },
    ],
    trendUnit: 'U/L',
  },
  {
    id: 'hepaticas',
    name: 'TGP, TGO e Fosfatase Alcalina',
    results: [
      { label: 'TGP', value: '24 U/L' },
      { label: 'TGO', value: '17 U/L' },
      { label: 'Fosf. Alcalina', value: '93 U/L' },
    ],
    reference: ['TGP: ≤ 41 U/L', 'TGO: ≤ 33 U/L', 'Fosf. Alc.: 36 a 110 U/L'],
    status: 'green',
    statusLabel: '🟢 Excelente',
    explanation:
      'Enzimas das células hepáticas e vias biliares em níveis normais, mostrando que não há lesão aguda nas células do fígado.',
  },
  {
    id: 'glicemia',
    name: 'Glicose de Jejum e Hemoglobina Glicada (A1C)',
    results: [
      { label: 'Glicose', value: '80 mg/dL' },
      { label: 'A1C', value: '5,4%' },
      { label: 'Glicose média estimada', value: '108,3 mg/dL' },
    ],
    reference: ['Glicose: 60 a 99 mg/dL', 'A1C: < 5,7% (Normal)'],
    status: 'green',
    statusLabel: '🟢 Normal',
    explanation:
      'Glicemia controlada, sem diabetes ou pré-diabetes, apenas com leve tendência de alta gradual na A1C.',
    history: 'A1C: 5,2% em 2025 → 5,3% em jun/26 → 5,4% agora.',
  },
  {
    id: 'renal',
    name: 'Creatinina, Filtração Renal, Sódio e Potássio',
    results: [
      { label: 'Creatinina', value: '0,76 mg/dL' },
      { label: 'RFG', value: '> 90' },
      { label: 'Sódio', value: '136' },
      { label: 'Potássio', value: '4,4' },
    ],
    reference: ['Creat.: 0,40 a 1,00 mg/dL', 'Sódio: 136 a 145', 'Potássio: 3,5 a 5,1'],
    status: 'green',
    statusLabel: '🟢 Excelente',
    explanation:
      'Função dos rins e equilíbrio de minerais da pressão arterial em perfeito funcionamento.',
  },
];

