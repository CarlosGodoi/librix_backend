export const BookCategory = {
  ROMANCE: 'Romance',
  FICCAO: 'Ficção',
  FICCAO_CIENTIFICA: 'Ficção Científica',
  FANTASIA: 'Fantasia',
  AUTOAJUDA: 'Autoajuda',
  INFANTOJUVENIL: 'Infantojuvenil',
  BIOGRAFIA: 'Biografia',
  HQ_MANGA: 'HQ/Mangá',
  POESIA: 'Poesia',
  TECNICO: 'Técnico',
} as const;

export type BookCategoryType = (typeof BookCategory)[keyof typeof BookCategory];
