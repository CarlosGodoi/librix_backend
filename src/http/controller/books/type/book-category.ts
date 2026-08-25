export const BookCategory = {
  ROMANCE: 'Romance',
  FICCAO: 'Ficção',
  FICCAO_CIENTIFICA: 'Ficção Científica',
  FICCAO_DISTOPICA: 'Ficção Distópica',
  FANTASIA: 'Fantasia',
  AUTOAJUDA: 'Autoajuda',
  DESENVOLVIMENTO_PESSOAL: 'Desenvolvimento Pessoal',
  CIENCIA: 'Ciência',
  HISTORIA: 'História',
  INFANTIL: 'Infatil',
  LITERATURA_INFANTIL: 'Literatura Infantil',
  INFANTOJUVENIL: 'Infantojuvenil',
  BIOGRAFIA: 'Biografia',
  HQ_MANGA: 'HQ/Mangá',
  POESIA: 'Poesia',
  TECNICO: 'Técnico',
} as const;

export type BookCategoryType = (typeof BookCategory)[keyof typeof BookCategory];
