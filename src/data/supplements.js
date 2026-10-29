// Base de dados da suplementação (Seção 6).
// Cápsulas gastrorresistentes — 60 doses — manter em geladeira.

export const SUPPLEMENT_INFO = {
  form: 'Cápsulas gastrorresistentes',
  doses: 60,
  storage: 'Manter em geladeira ❄️',
  intakeTip:
    'Tomar longe de refeições ricas em queijos/leite para máxima absorção do ferro e do zinco.',
  biotinAlert:
    'Suspender o suplemento por 72 horas antes de qualquer coleta futura de exames de sangue, para que a biotina não interfira nos testes por quimioluminescência.',
};

export const SUPPLEMENT_BLOCKS = [
  {
    id: 'tireoide',
    title: 'Proteção da Tireoide e Autoimunidade',
    emoji: '🦋',
    color: 'violet',
    items: [
      {
        name: 'Selênio (50 mcg) + Mioinositol (100 mg)',
        text: 'Dupla padrão-ouro no Hashimoto; protege a tireoide do estresse oxidativo, auxilia na conversão de T4 em T3 ativo, modula os anticorpos Anti-TPO (atualmente em 400,0 UI/mL) e melhora a sensibilidade à insulina.',
      },
      {
        name: 'Zinco (15 mg) + Cobre (1 mg)',
        text: 'Suporte à produção hormonal da tireoide e imunidade (mantendo o ótimo nível sérico de 94,0 mcg/dL), com cobre balanceado para evitar deficiência induzida pelo zinco.',
      },
    ],
  },
  {
    id: 'ferro',
    title: 'Recuperação do Estoque de Ferro (Crucial para Vegetariana)',
    emoji: '🩸',
    color: 'rose',
    items: [
      {
        name: 'Ferro Lipossomal (40 mg)',
        text: 'Tecnologia revestida em fosfolipídios que garante alta absorção intestinal sem irritar o estômago e com menor interferência de outros minerais, focada em reverter a queda da Ferritina (18,2 ng/mL).',
      },
    ],
  },
  {
    id: 'ossos',
    title: 'Imunomodulação, Ossos e Controle da Pressão Arterial',
    emoji: '🦴',
    color: 'amber',
    items: [
      {
        name: 'Colecalciferol / Vitamina D3 (4000 UI)',
        text: 'Dose terapêutica para elevar a Vitamina D dos atuais 23,4 ng/mL para a faixa ideal acima de 30 ng/mL, ajudando a modular a resposta autoimune.',
        note: 'A prescrição lista Colecalciferol 4000 UI e Vitamina D3 4000 UI, que são sinônimos químicos.',
      },
      {
        name: 'Vitamina K2-MK7 (50 mcg)',
        text: 'Direciona o cálcio para os ossos e impede sua deposição nas paredes das artérias (proteção vascular importante para quem tem pressão alta).',
      },
      {
        name: 'Magnésio Quelado (200 mg) + Cálcio Quelado (200 mg)',
        text: 'O magnésio promove relaxamento vascular (ajudando a reduzir a pressão arterial) e melhora o metabolismo energético; o cálcio complementa o suporte ósseo.',
      },
    ],
  },
  {
    id: 'energia',
    title: 'Energia Celular, Fígado (Redução de Gama GT/Triglicérides) e Cabelos',
    emoji: '⚡',
    color: 'emerald',
    items: [
      {
        name: 'Betaína Anidra (200 mg)',
        text: 'Atua diretamente no fígado como doadora de grupos metil, ajudando a exportar gordura hepática e auxiliando na redução da Gama GT (52 U/L) e dos Triglicérides (201 mg/dL).',
      },
      {
        name: 'Metilcobalamina / Vitamina B12 Ativa (500 mcg)',
        text: 'Reposição direta na forma bioativa para quem não consome proteínas animais, otimizando o nível atual de 368 pg/mL.',
      },
      {
        name: 'Complexo B (B1 10 mg, B2 20 mg, B3 20 mg, B5 20 mg, B6 30 mg)',
        text: 'Cofatores essenciais para destravar o metabolismo celular de carboidratos e lipídios.',
      },
      {
        name: 'Biotina (2,5 mg)',
        text: 'Fortalece fios de cabelo e unhas.',
        alert:
          'Suspender o suplemento por 72 horas antes de qualquer coleta futura de exames de sangue para não interferir nos testes por quimioluminescência.',
      },
    ],
  },
];

