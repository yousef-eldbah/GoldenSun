import { Category, Product, SiteSettings, Article, RFQ } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-fruits',
    slug: 'fresh-fruits',
    translations: {
      en: {
        title: 'Fresh Fruits',
        description: 'Premium fresh Egyptian fruits harvested from certified solar-rich farms.',
      },
      de: {
        title: 'Frisches Obst',
        description: 'Erstklassiges frisches ägyptisches Obst aus zertifiziertem Anbau.',
      },
      es: {
        title: 'Frutas Frescas',
        description: 'Frutas frescas egipcias de primera calidad cosechadas en fincas certificadas.',
      },
    },
  },
  {
    id: 'cat-vegetables',
    slug: 'fresh-vegetables',
    translations: {
      en: {
        title: 'Fresh & Frozen Vegetables',
        description: 'IQF frozen & fresh crisp vegetables processed under strict HACCP & ISO guidelines.',
      },
      de: {
        title: 'Frisches & Gefrorenes Gemüse',
        description: 'IQF gefrorenes und frisches Gemüse nach strengen HACCP & ISO Standards.',
      },
      es: {
        title: 'Verduras Frescas y Congeladas',
        description: 'Verduras frescas y congeladas IQF procesadas bajo estrictas normas HACCP e ISO.',
      },
    },
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-fresh-garlic',
    slug: 'fresh-dry-garlic-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070320',
    storage_temp: '0°C to +2°C (Dry Storage)',
    brix_level: 'N/A',
    pdf_catalog_url: '/catalogs/garlic-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: false, feb: true, mar: true, apr: true, may: true, jun: true,
      jul: true, aug: false, sep: false, oct: false, nov: false, dec: false
    },
    certifications: ['GLOBALG.A.P.', 'ISO 22000', 'HACCP'],
    images: [
      {
        id: 'img-gar-1',
        image_url: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh White & Red Egyptian Garlic',
        display_order: 1,
        is_cover: true
      }
    ],
    container_rules: [
      {
        id: 'cr-gar-1',
        package_type: 'Mesh Bag (10 KG Net)',
        net_weight_kg: 10,
        gross_weight_kg: 10.3,
        cartons_per_pallet: 120,
        pallets_per_40ft_reefer: 22,
        pallets_per_20ft_reefer: 11
      }
    ],
    translations: {
      en: {
        name: 'FRESH GARLIC',
        description: 'Naturally Fresh Garlic, Carefully Selected For Exceptional Quality.',
        origin: 'Minya & Beni Suef, Egypt',
        shelf_life: '6 - 8 Months (Dry Cold Storage 0°C)',
        sizes: ['40-50 mm', '50-60 mm', '60-70 mm+']
      },
      de: {
        name: 'FRISCHER KNOBLAUCH',
        description: 'Natürlich frischer Knoblauch, sorgfältig ausgewählt für außergewöhnliche Qualität.',
        origin: 'Minya & Beni Suef, Ägypten',
        shelf_life: '6 - 8 Monate (0°C)',
        sizes: ['40-50 mm', '50-60 mm', '60-70 mm+']
      },
      es: {
        name: 'AJO FRESCO',
        description: 'Ajo naturalmente fresco, cuidadosamente seleccionado para una calidad excepcional.',
        origin: 'Minya y Beni Suef, Egipto',
        shelf_life: '6 - 8 Meses (0°C)',
        sizes: ['40-50 mm', '50-60 mm', '60-70 mm+']
      }
    }
  },
  {
    id: 'prod-fresh-broccoli',
    slug: 'fresh-broccoli-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070410',
    storage_temp: '0°C to +2°C (Relative Humidity 95%)',
    brix_level: 'N/A',
    pdf_catalog_url: '/catalogs/broccoli-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: false, may: false, jun: false,
      jul: false, aug: false, sep: false, oct: true, nov: true, dec: true
    },
    certifications: ['GLOBALG.A.P.', 'ISO 22000', 'HACCP'],
    images: [
      {
        id: 'img-broc-1',
        image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Egyptian Broccoli',
        display_order: 1,
        is_cover: true
      }
    ],
    container_rules: [
      {
        id: 'cr-broc-1',
        package_type: 'Styrofoam Box with Iced Top (5 KG Net)',
        net_weight_kg: 5,
        gross_weight_kg: 5.8,
        cartons_per_pallet: 100,
        pallets_per_40ft_reefer: 20,
        pallets_per_20ft_reefer: 10
      }
    ],
    translations: {
      en: {
        name: 'FRESH BROCCOLI',
        description: 'Naturally Fresh Broccoli, Carefully Selected For Exceptional Quality.',
        origin: 'Nile Delta, Egypt',
        shelf_life: '21 - 28 Days (Cold Storage 0°C)',
        sizes: ['Florets 10-15cm', 'Heads 400-600g']
      },
      de: {
        name: 'FRISCHER BROKKOLI',
        description: 'Natürlich frischer Brokkoli, sorgfältig ausgewählt für außergewöhnliche Qualität.',
        origin: 'Nildelta, Ägypten',
        shelf_life: '21 - 28 Tage (0°C)',
        sizes: ['Röschen 10-15cm', 'Köpfe 400-600g']
      },
      es: {
        name: 'BRÓCOLI FRESCO',
        description: 'Brócoli naturalmente fresco, cuidadosamente seleccionado para una calidad excepcional.',
        origin: 'Delta del Nilo, Egipto',
        shelf_life: '21 - 28 Días (0°C)',
        sizes: ['Flores 10-15cm', 'Cabezas 400-600g']
      }
    }
  },
  {
    id: 'prod-fresh-sweet-potato',
    slug: 'fresh-sweet-potato-egypt',
    category_id: 'cat-vegetables',
    hs_code: '071420',
    storage_temp: '+13°C to +15°C',
    brix_level: '12% - 14%',
    pdf_catalog_url: '/catalogs/sweet-potato-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: true, feb: false, mar: false, apr: false, may: false, jun: false,
      jul: true, aug: true, sep: true, oct: true, nov: true, dec: true
    },
    certifications: ['GLOBALG.A.P.', 'ISO 22000', 'BRCGS'],
    images: [
      {
        id: 'img-sp-1',
        image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Egyptian Sweet Potatoes',
        display_order: 1,
        is_cover: true
      }
    ],
    container_rules: [
      {
        id: 'cr-sp-1',
        package_type: 'Carton Box (6 KG Net)',
        net_weight_kg: 6,
        gross_weight_kg: 6.5,
        cartons_per_pallet: 140,
        pallets_per_40ft_reefer: 20,
        pallets_per_20ft_reefer: 10
      }
    ],
    translations: {
      en: {
        name: 'FRESH SWEET POTATO',
        description: 'Naturally Fresh Sweet Potato, Carefully Selected For Exceptional Quality.',
        origin: 'Kafr El-Sheikh & Beheira, Egypt',
        shelf_life: '4 - 6 Months (Cured Storage)',
        sizes: ['L (150-300g)', 'XL (300-450g)', 'XXL (450-600g)']
      },
      de: {
        name: 'FRISCHE SÜSSKARTOFFEL',
        description: 'Natürlich frische Süßkartoffeln, sorgfältig ausgewählt für außergewöhnliche Qualität.',
        origin: 'Kafr El-Sheikh & Beheira, Ägypten',
        shelf_life: '4 - 6 Monate',
        sizes: ['L (150-300g)', 'XL (300-450g)', 'XXL (450-600g)']
      },
      es: {
        name: 'BATATA FRESCA',
        description: 'Batata naturalmente fresca, cuidadosamente seleccionada para una calidad excepcional.',
        origin: 'Kafr El-Sheikh y Beheira, Egipto',
        shelf_life: '4 - 6 Meses',
        sizes: ['L (150-300g)', 'XL (300-450g)', 'XXL (450-600g)']
      }
    }
  },
  {
    id: 'prod-frozen-vegetables-mix',
    slug: 'frozen-iqf-vegetables-egypt',
    category_id: 'cat-vegetables',
    hs_code: '071080',
    storage_temp: '-18°C',
    brix_level: 'N/A',
    pdf_catalog_url: '/catalogs/frozen-veg-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: true, jun: true,
      jul: true, aug: true, sep: true, oct: true, nov: true, dec: true
    },
    certifications: ['GLOBALG.A.P.', 'ISO 22000', 'HACCP', 'BRCGS'],
    images: [
      {
        id: 'img-veg-1',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'IQF Frozen Green Vegetables Mix',
        display_order: 1,
        is_cover: true
      }
    ],
    container_rules: [
      {
        id: 'cr-veg-1',
        package_type: 'Master Carton 4x2.5kg Bags (10 KG Net)',
        net_weight_kg: 10,
        gross_weight_kg: 10.6,
        cartons_per_pallet: 90,
        pallets_per_40ft_reefer: 22,
        pallets_per_20ft_reefer: 11
      }
    ],
    translations: {
      en: {
        name: 'FROZEN VEGETABLES',
        description: 'Naturally Fresh IQF Frozen Vegetables, Carefully Selected For Exceptional Quality.',
        origin: 'Beheira & Nile Delta, Egypt',
        shelf_life: '24 Months (-18°C)',
        sizes: ['Quartered', 'Bottoms 3-5cm', 'Florets 20-40mm']
      },
      de: {
        name: 'GEFRIER-GEMÜSE',
        description: 'Natürlich frisches IQF-Gemüse, sorgfältig ausgewählt für außergewöhnliche Qualität.',
        origin: 'Beheira & Nildelta, Ägypten',
        shelf_life: '24 Monate (-18°C)',
        sizes: ['Geviertelt', 'Böden 3-5cm', 'Röschen 20-40mm']
      },
      es: {
        name: 'VERDURAS CONGELADAS',
        description: 'Verduras congeladas IQF naturalmente frescas, cuidadosamente seleccionadas.',
        origin: 'Beheira y Delta del Nilo, Egipto',
        shelf_life: '24 Meses (-18°C)',
        sizes: ['En cuartos', 'Fondos 3-5cm', 'Flores 20-40mm']
      }
    }
  },
  {
    id: 'prod-fresh-bananas',
    slug: 'fresh-bananas-egypt',
    category_id: 'cat-fruits',
    hs_code: '080390',
    storage_temp: '+13°C to +14°C',
    brix_level: '18% - 22%',
    pdf_catalog_url: '/catalogs/bananas-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: true, jun: true,
      jul: true, aug: true, sep: true, oct: true, nov: true, dec: true
    },
    certifications: ['GLOBALG.A.P.', 'ISO 22000', 'BRCGS'],
    images: [
      {
        id: 'img-ban-1',
        image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Egyptian Premium Bananas',
        display_order: 1,
        is_cover: true
      }
    ],
    container_rules: [
      {
        id: 'cr-ban-1',
        package_type: 'Telescope Carton Box (18.5 KG Net)',
        net_weight_kg: 18.5,
        gross_weight_kg: 20,
        cartons_per_pallet: 54,
        pallets_per_40ft_reefer: 20,
        pallets_per_20ft_reefer: 10
      }
    ],
    translations: {
      en: {
        name: 'FRESH BANANAS',
        description: 'Naturally Fresh Bananas, Carefully Selected For Exceptional Quality.',
        origin: 'Upper Egypt & Nile Valley',
        shelf_life: '28 - 35 Days under cold chain',
        sizes: ['Class Extra (18-22cm)', 'Class 1 (16-19cm)']
      },
      de: {
        name: 'FRISCHE BANANEN',
        description: 'Natürlich frische Bananen, sorgfältig ausgewählt für außergewöhnliche Qualität.',
        origin: 'Oberägypten & Niltal',
        shelf_life: '28 - 35 Tage',
        sizes: ['Klasse Extra (18-22cm)', 'Klasse 1 (16-19cm)']
      },
      es: {
        name: 'BANANAS FRESCAS',
        description: 'Bananas naturalmente frescas, cuidadosamente seleccionadas para una calidad excepcional.',
        origin: 'Alto Egipto y Valle del Nilo',
        shelf_life: '28 - 35 Días',
        sizes: ['Clase Extra (18-22cm)', 'Clase 1 (16-19cm)']
      }
    }
  },
  {
    id: 'prod-valencia-orange',
    slug: 'valencia-orange-egypt',
    category_id: 'cat-fruits',
    hs_code: '0805.10',
    storage_temp: '4–8°C, 85–90% Humidity',
    brix_level: '11–13°',
    pdf_catalog_url: '/catalogs/valencia-orange-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: false, jun: false,
      jul: false, aug: false, sep: false, oct: false, nov: true, dec: true
    },
    season_status: {
      jan: 'peak', feb: 'peak', mar: 'available', apr: 'limited',
      may: 'off', jun: 'off', jul: 'off', aug: 'off', sep: 'off', oct: 'off',
      nov: 'limited', dec: 'available'
    },
    certifications: ['GlobalG.A.P.', 'ISO 22000', 'BRCGS'],
    images: [
      {
        id: 'img-val-1',
        image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Valencia Oranges on Tree',
        display_order: 1,
        is_cover: true
      },
      {
        id: 'img-val-2',
        image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Sliced Fresh Valencia Oranges',
        display_order: 2,
        is_cover: false
      },
      {
        id: 'img-val-3',
        image_url: 'https://images.unsplash.com/photo-1582979512210-99b6a53385f9?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Valencia Oranges in Basket',
        display_order: 3,
        is_cover: false
      }
    ],
    container_rules: [
      {
        id: 'cr-val-1',
        package_type: 'Carton Box, Ventilated',
        net_weight_kg: 10,
        gross_weight_kg: 10.8,
        cartons_per_pallet: 120,
        pallets_per_40ft_reefer: 20,
        pallets_per_20ft_reefer: 10
      }
    ],
    translations: {
      en: {
        name: 'Valencia Orange',
        description: 'Sweet, Juicy, And Thin-Skinned, Our Valencia Oranges Are Hand-Picked At Peak Ripeness From Farms In The Nile Delta And Export-Graded For Consistent Size, Color, And Sugar Content.',
        origin: 'Egypt, Nile Delta',
        shelf_life: '3–4 Weeks',
        sizes: ['5kg', '10kg', '20kg'],
        variety: 'Valencia',
        grade: 'Export Grade A',
        color: 'Bright Orange',
        harvest_method: 'Hand-Picked',
        average_diameter: '65–80 Mm'
      },
      de: {
        name: 'Valencia Orangen',
        description: 'Süß, saftig und dünnschalig. Unsere Valencia-Orangen werden zum optimalen Reifezeitpunkt auf Farmen im Nildelta handverlesen.',
        origin: 'Ägypten, Nildelta',
        shelf_life: '3–4 Wochen',
        sizes: ['5kg', '10kg', '20kg'],
        variety: 'Valencia',
        grade: 'Exportklasse A',
        color: 'Leuchtendes Orange',
        harvest_method: 'Handverlesen',
        average_diameter: '65–80 Mm'
      },
      es: {
        name: 'Naranja Valencia',
        description: 'Dulces, jugosas y de piel fina, nuestras naranjas Valencia se recolectan a mano en su punto óptimo de maduración en el Delta del Nilo.',
        origin: 'Egipto, Delta del Nilo',
        shelf_life: '3–4 Semanas',
        sizes: ['5kg', '10kg', '20kg'],
        variety: 'Valencia',
        grade: 'Grado de Exportación A',
        color: 'Naranja Brillante',
        harvest_method: 'Recolectado a mano',
        average_diameter: '65–80 Mm'
      }
    }
  },
  {
    id: 'prod-fresh-apples',
    slug: 'fresh-apples-egypt',
    category_id: 'cat-fruits',
    hs_code: '080810',
    storage_temp: '+1°C to +3°C',
    brix_level: '13% - 15%',
    pdf_catalog_url: '/catalogs/apples-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: false, feb: false, mar: false, apr: false, may: true, jun: true,
      jul: true, aug: true, sep: true, oct: false, nov: false, dec: false
    },
    certifications: ['GLOBALG.A.P.', 'ISO 22000', 'HACCP'],
    images: [
      {
        id: 'img-app-1',
        image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Egyptian Crisp Apples',
        display_order: 1,
        is_cover: true
      }
    ],
    container_rules: [
      {
        id: 'cr-app-1',
        package_type: 'Bushel Carton Box (18 KG Net)',
        net_weight_kg: 18,
        gross_weight_kg: 19.5,
        cartons_per_pallet: 56,
        pallets_per_40ft_reefer: 20,
        pallets_per_20ft_reefer: 10
      }
    ],
    translations: {
      en: {
        name: 'FRESH APPLES',
        description: 'Naturally Fresh Apples, Carefully Selected For Exceptional Quality.',
        origin: 'Alexandria & Desert Road Farms, Egypt',
        shelf_life: '60 - 120 Days in cold storage',
        sizes: ['70-75mm', '75-80mm', '80-85mm']
      },
      de: {
        name: 'FRISCHE ÄPFEL',
        description: 'Natürlich frische Äpfel, sorgfältig ausgewählt für außergewöhnliche Qualität.',
        origin: 'Alexandria & Wüstenstraße, Ägypten',
        shelf_life: '60 - 120 Tage',
        sizes: ['70-75mm', '75-80mm', '80-85mm']
      },
      es: {
        name: 'MANZANAS FRESCAS',
        description: 'Manzanas naturalmente frescas, cuidadosamente seleccionadas para una calidad excepcional.',
        origin: 'Alejandría y Carretera del Desierto, Egipto',
        shelf_life: '60 - 120 Días',
        sizes: ['70-75mm', '75-80mm', '80-85mm']
      }
    }
  },
  {
    id: 'prod-iqf-strawberry',
    slug: 'iqf-strawberry-egypt',
    category_id: 'cat-fruits',
    hs_code: '081110',
    storage_temp: '-18°C or colder',
    brix_level: '8.5% - 10.5%',
    pdf_catalog_url: '/catalogs/iqf-strawberry-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: true, jun: false,
      jul: false, aug: false, sep: false, oct: false, nov: true, dec: true
    },
    certifications: ['GLOBALG.A.P.', 'ISO 22000', 'HACCP', 'FDA Registered', 'BRCGS'],
    images: [
      {
        id: 'img-str-1',
        image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh & IQF Egyptian Strawberries',
        display_order: 1,
        is_cover: true
      }
    ],
    container_rules: [
      {
        id: 'cr-str-1',
        package_type: 'Carton with Inner Polybag (10 KG Net)',
        net_weight_kg: 10,
        gross_weight_kg: 10.7,
        cartons_per_pallet: 100,
        pallets_per_40ft_reefer: 22,
        pallets_per_20ft_reefer: 11
      }
    ],
    translations: {
      en: {
        name: 'FRESH STRAWBERRIES',
        description: 'Naturally Fresh Strawberries, Carefully Selected For Exceptional Quality.',
        origin: 'Ismailia & Qalyubia, Egypt',
        shelf_life: '24 Months (IQF) / 14 Days Fresh',
        sizes: ['15-25 mm', '25-35 mm']
      },
      de: {
        name: 'FRISCHE ERDBEEREN',
        description: 'Natürlich frische Erdbeeren, sorgfältig ausgewählt für außergewöhnliche Qualität.',
        origin: 'Ismailia & Qalyubia, Ägypten',
        shelf_life: '24 Monate (IQF)',
        sizes: ['15-25 mm', '25-35 mm']
      },
      es: {
        name: 'FRESAS FRESCAS',
        description: 'Fresas naturalmente frescas, cuidadosamente seleccionadas para una calidad excepcional.',
        origin: 'Ismailia y Qalyubia, Egipto',
        shelf_life: '24 Meses (IQF)',
        sizes: ['15-25 mm', '25-35 mm']
      }
    }
  },
  {
    id: 'prod-pomegranate-flamenco',
    slug: 'egyptian-pomegranate-wonderful',
    category_id: 'cat-fruits',
    hs_code: '081090',
    storage_temp: '+6°C to +8°C',
    brix_level: '15.0% - 17.0%',
    pdf_catalog_url: '/catalogs/pomegranate-sun-golden.pdf',
    is_featured: true,
    seasonality: {
      jan: false, feb: false, mar: false, apr: false, may: false, jun: false,
      jul: false, aug: true, sep: true, oct: true, nov: true, dec: true
    },
    certifications: ['GLOBALG.A.P.', 'ISO 22000', 'SMETA', 'FDA Registered'],
    images: [
      {
        id: 'img-pom-1',
        image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Egyptian Wonderful Pomegranates',
        display_order: 1,
        is_cover: true
      }
    ],
    container_rules: [
      {
        id: 'cr-pom-1',
        package_type: 'Plastic Box / Open Top Carton (4.5 KG Net)',
        net_weight_kg: 4.5,
        gross_weight_kg: 5.0,
        cartons_per_pallet: 180,
        pallets_per_40ft_reefer: 20,
        pallets_per_20ft_reefer: 10
      }
    ],
    translations: {
      en: {
        name: 'FRESH POMEGRANATES',
        description: 'Naturally Fresh Pomegranates, Carefully Selected For Exceptional Quality.',
        origin: 'Assiut & Upper Egypt Farms',
        shelf_life: '60 Days (+7°C)',
        sizes: ['6', '7', '8', '9', '10', '12', '14']
      },
      de: {
        name: 'FRISCHER GRANATAPFEL',
        description: 'Natürlich frischer Granatapfel, sorgfältig ausgewählt für außergewöhnliche Qualität.',
        origin: 'Assiut & Oberägypten',
        shelf_life: '60 Tage (+7°C)',
        sizes: ['6', '7', '8', '9', '10', '12', '14']
      },
      es: {
        name: 'GRANADA FRESCA',
        description: 'Granada naturalmente fresca, cuidadosamente seleccionada para una calidad excepcional.',
        origin: 'Assiut y Alto Egipto',
        shelf_life: '60 Días (+7°C)',
        sizes: ['6', '7', '8', '9', '10', '12', '14']
      }
    }
  }
];

export const mockSiteSettings: SiteSettings = {
  company_name: 'Sun Golden for Export & Agricultural Development',
  tagline: {
    en: 'Connecting Egyptian Harvests to Global Premium Markets',
    de: 'Ägyptische Ernten für weltweite Premium-Märkte',
    es: 'Conectando Cosechas Egipcias con Mercados Premium Globales',
  },
  address: {
    en: 'Industrial Zone 3, Packaging Hub, Sadat City, Menofia, Egypt',
    de: 'Industriezone 3, Verpackungszentrum, Sadat City, Menofia, Ägypten',
    es: 'Zona Industrial 3, Centro de Empaque, Ciudad Sadat, Menofia, Egipto',
  },
  phone: '+20 100 123 4567',
  whatsapp: '+20 100 123 4567',
  email: 'export@sungolden-eg.com',
  google_maps_url: 'https://maps.google.com/?q=Sadat+City+Industrial+Zone',
  social_links: {
    linkedin: 'https://linkedin.com/company/sungolden-export',
    facebook: 'https://facebook.com/sungolden.export',
    instagram: 'https://instagram.com/sungolden.export',
  },
  google_analytics_id: 'G-SUNGOLDEN2026',
  clarity_id: 'clarity_sungolden',
};

export const mockArticles: Article[] = [
  {
    id: 'art-1',
    slug: 'egyptian-orange-export-season-outlook-2026',
    image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=80',
    created_at: '2026-06-15',
    translations: {
      en: {
        title: 'Egyptian Citrus Export Season 2026: Quality Standards & Market Forecast',
        summary: 'An inside look into how Sun Golden ensures 0% residue rejection and 48%+ juice ratio for European buyers.',
        content: 'Egypt remains the world’s top exporter of fresh oranges by volume. At Sun Golden, our cold chain management and automated sorting lines guarantee maximum shelf life across Hamburg, Rotterdam, and Valencia ports...'
      },
      de: {
        title: 'Ägyptische Zitrus-Exportsaison 2026: Qualitätsstandards & Marktprognose',
        summary: 'Ein Einblick, wie Sun Golden 0% Rückstandsraten und 48%+ Saftgehalt für europäische Käufer garantiert.',
        content: 'Ägypten bleibt weltweit der führende Exporteur von frischen Orangen nach Volumen. Unsere Kühllogistik garantiert eine hervorragende Haltbarkeit...'
      },
      es: {
        title: 'Temporada de Exportación de Cítricos de Egipto 2026: Calidad y Mercado',
        summary: 'Cómo Sun Golden garantiza cero residuos de plaguicidas y más del 48% de jugo para compradores europeos.',
        content: 'Egipto sigue siendo el mayor exportador de naranjas frescas del mundo. Sun Golden implementa tecnología de clasificación óptica para garantizar fruta perfecta...'
      }
    }
  }
];

export const mockRFQs: RFQ[] = [
  {
    id: 'rfq_1',
    rfq_number: 'SG-RFQ-1001',
    company_name: 'Bratwurst Imports GmbH',
    contact_name: 'Hans Mueller',
    email: 'h.mueller@bratwurst-imports.de',
    phone_whatsapp: '+49 30 123456',
    country: 'Germany',
    port_of_discharge: 'Port of Hamburg',
    incoterm: 'CIF',
    estimated_etd: '2026-08-15',
    notes: 'Requires cold-chain temp logs for all reefer containers.',
    gdpr_consent: true,
    status: 'new',
    created_at: new Date().toISOString(),
    items: [
      {
        product_id: 'valencia-orange',
        product_name: 'Orange Valencia',
        quantity_tons: 48,
        preferred_packaging: '15kg Telescopic Carton',
      },
    ],
  },
];
