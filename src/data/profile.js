// Perfil clínico da usuária incorporado ao sistema (Seção 1 da especificação).
export const PROFILE = {
  name: 'Bruna Oliveira Bonfim Ramos',
  firstName: 'Bruna',
  birthDate: '1984-11-30',
  heightM: 1.74,
  weightKg: 98,
  conditions: [
    'Tireoidite de Hashimoto confirmada laboratorialmente, em estado eutireoideo (hormônios normais)',
    'Pressão arterial levemente elevada',
    'Estoque de ferro baixo (ferritina em queda progressiva)',
    'Dislipidemia metabólica leve (triglicérides e Gama GT elevados)',
  ],
  restrictions: [
    'Não consome carnes vermelhas, aves ou peixes',
    'Não consome ovos "puros" (omeletes, mexidos, cozidos ou quiches)',
    'Gosta muito de leite e derivados',
  ],
};

export const EXAM_COLLECTION_DATE = '27/10/2026';
export const LAB_NAME = 'Hermes Pardini';

/** Idade calculada dinamicamente a partir da data de nascimento. */
export function ageOn(date = new Date()) {
  const [y, m, d] = PROFILE.birthDate.split('-').map(Number);
  let age = date.getFullYear() - y;
  const beforeBirthday =
    date.getMonth() + 1 < m || (date.getMonth() + 1 === m && date.getDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

export function bmi() {
  return PROFILE.weightKg / (PROFILE.heightM * PROFILE.heightM);
}

