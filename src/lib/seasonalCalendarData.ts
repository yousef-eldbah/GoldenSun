import { Locale } from '@/types';

export type SeasonalProductCategory = 'fruit' | 'vegetable';

export type SeasonalProduct = {
  id: string;
  slug: string;
  name: Record<Locale, string>;
  category: SeasonalProductCategory;
  image: string;
  availableMonths: number[]; // 1 = Jan, 12 = Dec
  seasonLabel: Record<Locale, string>;
  origin?: Record<Locale, string>;
  statusByMonth?: Record<number, 'peak' | 'available' | 'limited' | 'off'>;
};

export interface MonthInfo {
  id: number;
  key: string;
  short: Record<Locale, string>;
  full: Record<Locale, string>;
}

export const MONTH_NAMES: MonthInfo[] = [
  { id: 1, key: 'jan', short: { en: 'JAN', de: 'JAN', es: 'ENE' }, full: { en: 'January', de: 'Januar', es: 'Enero' } },
  { id: 2, key: 'feb', short: { en: 'FEB', de: 'FEB', es: 'FEB' }, full: { en: 'February', de: 'Februar', es: 'Febrero' } },
  { id: 3, key: 'mar', short: { en: 'MAR', de: 'MÄR', es: 'MAR' }, full: { en: 'March', de: 'März', es: 'Marzo' } },
  { id: 4, key: 'apr', short: { en: 'APR', de: 'APR', es: 'ABR' }, full: { en: 'April', de: 'April', es: 'Abril' } },
  { id: 5, key: 'may', short: { en: 'MAY', de: 'MAI', es: 'MAY' }, full: { en: 'May', de: 'Mai', es: 'Mayo' } },
  { id: 6, key: 'jun', short: { en: 'JUN', de: 'JUN', es: 'JUN' }, full: { en: 'June', de: 'Juni', es: 'Junio' } },
  { id: 7, key: 'jul', short: { en: 'JUL', de: 'JUL', es: 'JUL' }, full: { en: 'July', de: 'Juli', es: 'Julio' } },
  { id: 8, key: 'aug', short: { en: 'AUG', de: 'AUG', es: 'AGO' }, full: { en: 'August', de: 'August', es: 'Agosto' } },
  { id: 9, key: 'sep', short: { en: 'SEP', de: 'SEP', es: 'SEP' }, full: { en: 'September', de: 'September', es: 'Septiembre' } },
  { id: 10, key: 'oct', short: { en: 'OCT', de: 'OKT', es: 'OCT' }, full: { en: 'October', de: 'Oktober', es: 'Octubre' } },
  { id: 11, key: 'nov', short: { en: 'NOV', de: 'NOV', es: 'NOV' }, full: { en: 'November', de: 'November', es: 'Noviembre' } },
  { id: 12, key: 'dec', short: { en: 'DEC', de: 'DEZ', es: 'DIC' }, full: { en: 'December', de: 'Dezember', es: 'Diciembre' } },
];

/**
 * Normalized seasonal products catalog.
 * Uses exact product IDs, slugs, names and images from Golden Sun's official catalog.
 */
export const seasonalProducts: SeasonalProduct[] = [
  // 1. Sweet Potato
  {
    id: 'prod-sweet-potato',
    slug: 'fresh-sweet-potatoes-egypt',
    name: {
      en: 'Sweet Potato',
      de: 'Süßkartoffeln',
      es: 'Batata / Camote Dulce',
    },
    category: 'vegetable',
    image: '/assets/GAL4.jpg',
    availableMonths: [1, 2, 3, 4, 7, 8, 9, 10, 11, 12],
    seasonLabel: {
      en: 'Jul — Apr',
      de: 'Juli — April',
      es: 'Jul — Abr',
    },
    origin: {
      en: 'Sadat City & Nile Delta',
      de: 'Sadat City & Nil-Delta',
      es: 'Sadat City y Delta del Nilo',
    },
  },

  // 2. Fresh & Dry Garlic
  {
    id: 'prod-fresh-garlic',
    slug: 'fresh-dry-garlic-egypt',
    name: {
      en: 'Fresh & Dry Garlic',
      de: 'Frischer & Getrockneter Knoblauch',
      es: 'Ajo Fresco y Seco',
    },
    category: 'vegetable',
    image: '/assets/GAL8.jpg',
    availableMonths: [2, 3, 4, 5, 6, 7],
    seasonLabel: {
      en: 'Feb — Jul',
      de: 'Feb — Juli',
      es: 'Feb — Jul',
    },
    origin: {
      en: 'Minya & Beni Suef',
      de: 'Minya & Beni Suef',
      es: 'Minya y Beni Suef',
    },
  },

  // 3. Red Onion
  {
    id: 'prod-red-onion',
    slug: 'fresh-red-onion-egypt',
    name: {
      en: 'Red Onion',
      de: 'Rote Zwiebeln',
      es: 'Cebolla Roja',
    },
    category: 'vegetable',
    image: '/assets/image_111.png',
    availableMonths: [4, 5, 6, 7, 8, 9, 10, 11, 12],
    seasonLabel: {
      en: 'Apr — Dec',
      de: 'April — Dez',
      es: 'Abr — Dic',
    },
    origin: {
      en: 'Giza & Upper Egypt',
      de: 'Gizeh & Oberägypten',
      es: 'Guiza y Alto Egipto',
    },
  },

  // 4. White Onion
  {
    id: 'prod-white-onion',
    slug: 'fresh-white-onion-egypt',
    name: {
      en: 'White Onion',
      de: 'Weiße Zwiebeln',
      es: 'Cebolla Blanca',
    },
    category: 'vegetable',
    image: '/assets/GAL-2.jpg',
    availableMonths: [2, 3, 4, 5, 6],
    seasonLabel: {
      en: 'Feb — Jun',
      de: 'Feb — Juni',
      es: 'Feb — Jun',
    },
    origin: {
      en: 'Delta & Sadat City',
      de: 'Delta & Sadat City',
      es: 'Delta y Ciudad Sadat',
    },
  },

  // 5. Spring Onion
  {
    id: 'prod-spring-onion',
    slug: 'fresh-spring-green-onion-egypt',
    name: {
      en: 'Spring Onion',
      de: 'Frühlingszwiebeln',
      es: 'Cebollino / Verdejo',
    },
    category: 'vegetable',
    image: '/assets/GAL-2.jpg',
    availableMonths: [1, 2, 3, 4, 10, 11, 12],
    seasonLabel: {
      en: 'Oct — Apr',
      de: 'Okt — April',
      es: 'Oct — Abr',
    },
    origin: {
      en: 'Giza & Qalyubia',
      de: 'Gizeh & Qalyubia',
      es: 'Guiza y Qalyubia',
    },
  },

  // 6. Green Beans
  {
    id: 'prod-green-beans',
    slug: 'fresh-green-beans-egypt',
    name: {
      en: 'Green Beans (Haricot Vert)',
      de: 'Grüne Bohnen',
      es: 'Judías Verdes / Ejotes',
    },
    category: 'vegetable',
    image: '/assets/photo_6010464546872561748_y_2_2.jpg',
    availableMonths: [1, 2, 3, 4, 5, 6, 11, 12],
    seasonLabel: {
      en: 'Nov — Jun',
      de: 'Nov — Juni',
      es: 'Nov — Jun',
    },
    origin: {
      en: 'Ismailia & Beheira',
      de: 'Ismailia & Beheira',
      es: 'Ismailia y Beheira',
    },
  },

  // 7. Snow Peas & Sugar Snap
  {
    id: 'prod-snow-peas',
    slug: 'fresh-snow-peas-mangetout-egypt',
    name: {
      en: 'Snow Peas & Sugar Snap',
      de: 'Zuckererbsen / Mangetout',
      es: 'Tirabeques / Guisantes Dulces',
    },
    category: 'vegetable',
    image: '/assets/GAL-1.jpg',
    availableMonths: [1, 2, 3, 4, 11, 12],
    seasonLabel: {
      en: 'Nov — Apr',
      de: 'Nov — April',
      es: 'Nov — Abr',
    },
    origin: {
      en: 'Menofia & Delta',
      de: 'Menofia & Delta',
      es: 'Menofia y Delta',
    },
  },

  // 8. Broccoli
  {
    id: 'prod-broccoli',
    slug: 'fresh-broccoli-heads-egypt',
    name: {
      en: 'Fresh Broccoli',
      de: 'Frischer Brokkoli',
      es: 'Brócoli Fresco',
    },
    category: 'vegetable',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=1000&q=80',
    availableMonths: [1, 2, 3, 4, 12],
    seasonLabel: {
      en: 'Dec — Apr',
      de: 'Dez — April',
      es: 'Dic — Abr',
    },
    origin: {
      en: 'Sadat City & Nubaria',
      de: 'Sadat City & Nubaria',
      es: 'Ciudad Sadat y Nubaria',
    },
  },

  // 9. Valencia Oranges
  {
    id: 'prod-valencia-orange',
    slug: 'egyptian-valencia-orange-export',
    name: {
      en: 'Valencia Oranges',
      de: 'Valencia Orangen',
      es: 'Naranjas Valencia',
    },
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=80',
    availableMonths: [1, 2, 3, 4, 5],
    seasonLabel: {
      en: 'Jan — May',
      de: 'Jan — Mai',
      es: 'Ene — May',
    },
    origin: {
      en: 'Wadi El Natrun & Delta',
      de: 'Wadi El Natrun & Delta',
      es: 'Wadi El Natrun y Delta',
    },
  },

  // 10. Table Grapes
  {
    id: 'prod-fresh-grapes',
    slug: 'fresh-egyptian-table-grapes',
    name: {
      en: 'Table Grapes',
      de: 'Tafeltrauben',
      es: 'Uvas de Mesa',
    },
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1000&q=80',
    availableMonths: [5, 6, 7, 8],
    seasonLabel: {
      en: 'May — Aug',
      de: 'Mai — Aug',
      es: 'May — Ago',
    },
    origin: {
      en: 'Alexandria Desert Road',
      de: 'Alexandria Wüstenstraße',
      es: 'Carretera del Desierto',
    },
  },
];

/**
 * Data Service Function (API-ready).
 */
export function getSeasonalProductsForMonth(month: number) {
  const available = seasonalProducts.filter((product) =>
    product.availableMonths.includes(month)
  );

  const fruits = available.filter((product) => product.category === 'fruit');
  const vegetables = available.filter((product) => product.category === 'vegetable');

  return {
    fruits,
    vegetables,
    totalCount: available.length,
  };
}
