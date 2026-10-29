// Opções de refeições do checklist (Seção 4A) — sem carne/peixe, sem ovo puro, com laticínios.

export const OTHER_OPTION_ID = 'outra';
export const OFF_PLAN_ID = 'furo';

export const MEALS = [
  {
    id: 'cafe',
    name: 'Café da Manhã',
    emoji: '☕',
    optional: false,
    focus: 'Alta proteína láctea, saciedade e subida do HDL de 41 mg/dL.',
    options: [
      {
        id: 'cafe-1',
        title: 'Taça Cremosa Proteica',
        description:
          '1 pote de iogurte natural integral ou grego sem açúcar + 1/2 scoop de Whey Protein + morangos ou frutas vermelhas picadas + 1 colher (sopa) de chia e lascas de amêndoas.',
      },
      {
        id: 'cafe-2',
        title: 'Tostex de Minas Frescal',
        description:
          '1 fatia de pão de fermentação natural ou 100% integral tostado + 2 fatias grossas de queijo minas frescal douradas na frigideira com fio de azeite, tomate e orégano.',
      },
      {
        id: 'cafe-3',
        title: 'Creme de Ricota/Cottage',
        description:
          'Torrada integral ou tapioca pequena feita com chia na goma, recheada com pasta de ricota fresca ou cottage, azeite, ervas finas e castanha-de-caju picada.',
      },
      {
        id: 'cafe-4',
        title: 'Pão de Queijo de Frigideira (Ovo Invisível na Massa)',
        description:
          'Massa batida no mixer (1 ovo misturado na massa + 2 col. sopa de polvilho + 2 col. sopa de queijo minas ralado/ricota + 1 col. sopa de iogurte) dourada na frigideira.',
      },
    ],
  },
  {
    id: 'lancheManha',
    name: 'Lanche da Manhã',
    emoji: '🥜',
    optional: true,
    focus: 'Opcional — apenas se sentir fome.',
    options: [
      {
        id: 'lm-1',
        title: 'Mix de Castanhas',
        description:
          '1 punhado pequeno (25g) de mix de castanha-de-caju e amêndoas sem sal + 1 castanha-do-pará.',
      },
      {
        id: 'lm-2',
        title: 'Fruta Cítrica',
        description: '1 fruta cítrica inteira com bagaço (mexerica ou laranja).',
      },
    ],
  },
  {
    id: 'almoco',
    name: 'Almoço',
    emoji: '🥗',
    optional: false,
    focus:
      'Regra de Ouro: ZERO laticínios aqui para absorver Ferro e subir a Ferritina de 18,2 ng/mL.',
    options: [
      {
        id: 'alm-1',
        title: 'Prato Rico em Ferro com Lentilha ou Feijão',
        description:
          '50% do prato de salada verde-escura (rúcula, espinafre, agrião, couve) e brócolis temperados com azeite e limão espremido + 1 concha caprichada de lentilha ou feijão + 3 colheres (sopa) de abóbora cabotiá assada, batata-doce ou arroz integral + gomos de laranja/mexerica de sobremesa.',
      },
      {
        id: 'alm-2',
        title: 'Bowl de Grão-de-Bico e Tofu',
        description:
          'Folhas verdes e legumes assados (abobrinha, couve-flor, berinjela) com azeite e limão + grão-de-bico (cozido ou assado crocante com páprica) e cubos de tofu grelhado + pequena porção de quinoa ou batata-doce + fruta cítrica.',
      },
    ],
  },
  {
    id: 'lancheTarde',
    name: 'Lanche da Tarde',
    emoji: '🥑',
    optional: false,
    focus:
      'Hora dos laticínios e gorduras boas para baixar os Triglicérides de 201 mg/dL.',
    options: [
      {
        id: 'lt-1',
        title: 'Smoothie Cremoso de Abacate',
        description:
          '1/2 abacate pequeno batido com iogurte natural (ou leite), 1/2 scoop de Whey Protein, gelo e gotas de limão ou baunilha.',
      },
      {
        id: 'lt-2',
        title: 'Caprese Proteica',
        description:
          'Bolinhas de mussarela de búfala (ou cubos de queijo minas frescal) + tomatinhos-cereja + manjericão fresco + fio de azeite extravirgem.',
      },
      {
        id: 'lt-3',
        title: 'Chips Caseiros com Coalhada/Cottage',
        description:
          'Chips de batata-doce ou abobrinha assados com azeite e alecrim + 2 colheres (sopa) de coalhada seca (labneh) ou queijo cottage temperado.',
      },
    ],
  },
  {
    id: 'jantar',
    name: 'Jantar',
    emoji: '🍲',
    optional: false,
    focus:
      'Leve, baixo carboidrato para reduzir a Gama GT de 52 U/L e os Triglicérides.',
    options: [
      {
        id: 'jan-1',
        title: 'Creme de Legumes com Queijo Minas',
        description:
          'Sopa/creme caseiro de abóbora cabotiá, chuchu ou couve-flor (sem batata inglesa ou macarrão) finalizado no prato com cubos generosos de queijo minas frescal ou ricota, azeite e sementes de abóbora/girassol tostadas.',
      },
      {
        id: 'jan-2',
        title: 'Salada Mediterrânea com Queijo Grelhado',
        description:
          'Mix de folhas, pepino, tomate, palmito, 3 colheres (sopa) de grão-de-bico crocante + 100g de queijo branco grelhado na frigideira (minas padrão ou ricota temperada) + lascas de amêndoas.',
      },
      {
        id: 'jan-3',
        title: 'Abobrinha ou Berinjela Recheada ao Forno',
        description:
          'Barquinhas de abobrinha ou berinjela assadas e recheadas com creme de ricota/cottage, tomate picado, manjericão e levemente gratinadas.',
      },
    ],
  },
];

export const BASE_MEAL_IDS = MEALS.filter((m) => !m.optional).map((m) => m.id);

