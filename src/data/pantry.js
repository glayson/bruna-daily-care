// Itens pré-cadastrados no módulo de compras (Seção 4B).

export const CATEGORIES = [
  {
    id: 'laticinios',
    name: 'Laticínios & Proteínas',
    emoji: '🧀',
    note: 'Preferir versões com baixo teor de sódio.',
    items: [
      'Queijo minas frescal',
      'Queijo cottage',
      'Ricota fresca',
      'Mussarela de búfala',
      'Coalhada seca (ou iogurte grego natural sem açúcar)',
      'Iogurte natural integral (2 ingredientes)',
      'Queijo minas padrão/meia-cura (uso moderado)',
      'Whey Protein (baunilha ou neutro)',
      'Tofu firme/defumado',
      'Ovos (apenas se usar na massa do pão de queijo de frigideira)',
    ],
  },
  {
    id: 'hortifruti',
    name: 'Hortifrúti, Folhas Verdes-Escuras & Cítricos',
    emoji: '🥬',
    items: [
      'Limão (item essencial diário)',
      'Laranja',
      'Mexerica',
      'Morangos / Frutas vermelhas',
      'Abacate',
      'Mamão',
      'Espinafre',
      'Rúcula',
      'Agrião',
      'Couve-manteiga',
      'Alface',
      'Brócolis',
      'Couve-flor',
      'Abobrinha',
      'Berinjela',
      'Abóbora cabotiá',
      'Batata-doce',
      'Chuchu',
      'Tomate e Tomatinho-cereja',
      'Pepino',
      'Palmito',
      'Manjericão fresco',
      'Alho',
      'Cebola',
    ],
  },
  {
    id: 'graos',
    name: 'Leguminosas, Grãos & Farinhas',
    emoji: '🫘',
    items: [
      'Lentilha',
      'Grão-de-bico',
      'Feijão',
      'Arroz integral',
      'Quinoa',
      'Aveia em flocos',
      'Pão 100% integral ou de fermentação natural',
      'Goma de tapioca',
      'Polvilho doce/azedo',
    ],
  },
  {
    id: 'gorduras',
    name: 'Castanhas, Sementes & Gorduras Boas',
    emoji: '🫒',
    items: [
      'Azeite de oliva extravirgem',
      'Castanha-de-caju sem sal',
      'Amêndoas (inteiras ou em lascas) sem sal',
      'Castanha-do-pará',
      'Semente de chia',
      'Semente de linhaça',
      'Semente de abóbora e girassol sem sal',
    ],
  },
  {
    id: 'temperos',
    name: 'Temperos Naturais',
    emoji: '🌿',
    note: 'Anti-inflamatórios — substitutos do sal para controle da pressão.',
    items: [
      'Cúrcuma (açafrão-da-terra)',
      'Orégano',
      'Alecrim',
      'Páprica doce/defumada',
      'Ervas finas',
      'Pimenta-do-reino',
    ],
  },
];

export const OTHER_CATEGORY = { id: 'avulsos', name: 'Itens Avulsos', emoji: '📝', items: [] };
export const ALL_CATEGORIES = [...CATEGORIES, OTHER_CATEGORY];

function slug(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Estado inicial da despensa: tudo "Em Casa". */
export function buildInitialPantry() {
  return CATEGORIES.flatMap((cat) =>
    cat.items.map((name) => ({
      id: `${cat.id}-${slug(name)}`,
      name,
      category: cat.id,
      status: 'home', // 'home' (Em Casa) | 'buy' (Acabou / Para Comprar)
      custom: false,
    })),
  );
}

