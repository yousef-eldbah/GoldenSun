import { Category, Product, SiteSettings, Article, RFQ } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-vegetables',
    slug: 'fresh-vegetables',
    translations: {
      en: {
        title: 'Fresh Vegetables',
        description: 'Export-grade fresh vegetables grown in certified farms with full cold-chain traceability.',
      },
      de: {
        title: 'Frisches Gemüse',
        description: 'Exportgemüse aus zertifiziertem Anbau mit lückenloser Rückverfolgbarkeit.',
      },
      es: {
        title: 'Verduras Frescas',
        description: 'Verduras frescas de exportación cultivadas en fincas certificadas con trazabilidad total.',
      },
    },
  },
  {
    id: 'cat-fruits',
    slug: 'fresh-fruits',
    translations: {
      en: {
        title: 'Fresh Fruits',
        description: 'Premium fresh Egyptian fruits harvested at peak sweetness from certified solar-rich orchards.',
      },
      de: {
        title: 'Frisches Obst',
        description: 'Erstklassiges ägyptisches Obst aus zertifizierten Sonnenplantagen.',
      },
      es: {
        title: 'Frutas Frescas',
        description: 'Frutas frescas egipcias de primera calidad cosechadas en huertos certificados.',
      },
    },
  },
];

export const mockProducts: Product[] = [
  // 1. Sweet Potato (البطاطا)
  {
    id: 'prod-sweet-potato',
    slug: 'fresh-sweet-potatoes-egypt',
    category_id: 'cat-vegetables',
    hs_code: '071420',
    storage_temp: '+13°C (Cured Controlled Atmosphere)',
    brix_level: 'High Natural Sugar',
    pdf_catalog_url: '/catalogs/sweet-potato-golden-sun.pdf',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: false, jun: false,
      jul: true, aug: true, sep: true, oct: true, nov: true, dec: true
    },
    season_status: {
      jan: 'available', feb: 'available', mar: 'limited', apr: 'limited', may: 'off', jun: 'off',
      jul: 'available', aug: 'peak', sep: 'peak', oct: 'peak', nov: 'peak', dec: 'peak'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP', 'SEDEX'],
    images: [
      {
        id: 'img-sp-1',
        image_url: '/assets/GAL4.jpg',
        alt_text: 'Fresh Egyptian Sweet Potatoes Packed for Export',
        display_order: 1,
        is_cover: true
      },
      {
        id: 'img-sp-2',
        image_url: '/assets/GAL5.jpg',
        alt_text: 'Golden Sun Sweet Potatoes Box Packing',
        display_order: 2,
        is_cover: false
      }
    ],
    container_rules: [
      {
        id: 'cr-sp-1',
        package_type: 'Carton 6 KG Net',
        net_weight_kg: 6,
        gross_weight_kg: 6.4,
        cartons_per_pallet: 160,
        pallets_per_40ft_reefer: 22,
        pallets_per_20ft_reefer: 10
      },
      {
        id: 'cr-sp-2',
        package_type: 'Carton 18 KG Net',
        net_weight_kg: 18,
        gross_weight_kg: 19.2,
        cartons_per_pallet: 56,
        pallets_per_40ft_reefer: 22,
        pallets_per_20ft_reefer: 10
      },
      {
        id: 'cr-sp-3',
        package_type: 'Jumbo Bins (500 KG)',
        net_weight_kg: 500,
        gross_weight_kg: 535,
        cartons_per_pallet: 1,
        pallets_per_40ft_reefer: 44,
        pallets_per_20ft_reefer: 20
      }
    ],
    translations: {
      en: {
        name: 'SWEET POTATO',
        description: 'Premium cured Egyptian sweet potatoes, famous for rich orange flesh, high natural sweetness, and exceptional European shelf life.',
        origin: 'Sadat City & Nile Delta, Egypt',
        shelf_life: '6-8 Months (under controlled +13°C temperature)',
        sizes: ['S (150-250g)', 'M (250-450g)', 'L1 (450-650g)', 'L2 (650-850g)', 'Jumbo (850g+)'],
        varieties: ['Beauregard', 'Bellevue', 'Sakura', 'Evangeline'],
        packaging_options: ['6 KG Carton', '18 KG Carton', '500 KG Jumbo Bins'],
        grade: 'Class 1 / Extra Export Grade',
        color: 'Deep Copper Skin, Rich Orange Flesh',
        harvest_method: 'Hand-harvested & Professionally Cured',
      },
      de: {
        name: 'SÜSSKARTOFFELN',
        description: 'Erstklassige ägyptische Süßkartoffeln mit tiefroter Schale und leuchtend orangefarbenem Fruchtfleisch.',
        origin: 'Sadat City & Nil-Delta, Ägypten',
        shelf_life: '6-8 Monate (+13°C)',
        sizes: ['S (150-250g)', 'M (250-450g)', 'L1 (450-650g)', 'L2 (650-850g)', 'Jumbo (850g+)'],
        varieties: ['Beauregard', 'Bellevue', 'Sakura', 'Evangeline'],
        packaging_options: ['6 KG Karton', '18 KG Karton', '500 KG Bins'],
        grade: 'Klasse 1 / Exportqualität',
        color: 'Orangefarbenes Fruchtfleisch',
        harvest_method: 'Schonende Handernte & Kuration',
      },
      es: {
        name: 'BATATA / CAMOTE DULCE',
        description: 'Batatas egipcias de primera calidad, curadas profesionalmente para garantizar máxima dulzura y excelente vida útil.',
        origin: 'Sadat City y Delta del Nilo, Egipto',
        shelf_life: '6-8 Meses (+13°C)',
        sizes: ['S (150-250g)', 'M (250-450g)', 'L1 (450-650g)', 'L2 (650-850g)', 'Jumbo (850g+)'],
        varieties: ['Beauregard', 'Bellevue', 'Sakura', 'Evangeline'],
        packaging_options: ['Caja 6 KG', 'Caja 18 KG', 'Bins de 500 KG'],
        grade: 'Clase 1 / Grado de Exportación',
        color: 'Piel Cobre, Pulpa Naranja Intensa',
        harvest_method: 'Cosecha Manual Cuidadosa',
      },
    },
  },

  // 2. Fresh Garlic (الثوم)
  {
    id: 'prod-fresh-garlic',
    slug: 'fresh-dry-garlic-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070320',
    storage_temp: '0°C to +2°C (Dry Storage)',
    is_featured: true,
    seasonality: {
      jan: false, feb: true, mar: true, apr: true, may: true, jun: true,
      jul: true, aug: false, sep: false, oct: false, nov: false, dec: false
    },
    season_status: {
      jan: 'off', feb: 'available', mar: 'peak', apr: 'peak', may: 'peak', jun: 'available',
      jul: 'limited', aug: 'off', sep: 'off', oct: 'off', nov: 'off', dec: 'off'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP', 'SEDEX'],
    images: [
      {
        id: 'img-gar-1',
        image_url: '/assets/GAL8.jpg',
        alt_text: 'Fresh White & Red Egyptian Garlic',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'FRESH & DRY GARLIC',
        description: 'High-pungency Egyptian garlic with solid cloves and tight outer wrappers. Available fresh green (Feb-Apr) and dry cured (May-Jul).',
        origin: 'Minya & Beni Suef, Egypt',
        shelf_life: '8-10 Months under cold ventilation',
        sizes: ['40-50mm', '50-60mm', '60-70mm', '70mm+'],
        varieties: ['Baladi White', 'Chinese Green', 'Egyptian Red'],
        packaging_options: ['5 KG Carton', '10 KG Carton', '10 KG Mesh Bag', '25 KG Bags'],
        grade: 'Class 1 Export',
        color: 'Pure White & Purple Red',
      },
      de: {
        name: 'FRISCHER & GETROCKNETER KNOBLAUCH',
        description: 'Aromatischer ägyptischer Knoblauch mit festen Zehen und hohem Allicin-Gehalt.',
        origin: 'Minya & Beni Suef, Ägypten',
        shelf_life: '8-10 Monate',
        sizes: ['40-50mm', '50-60mm', '60-70mm', '70mm+'],
        varieties: ['Baladi Weiß', 'Chinesisch Grün', 'Ägyptisch Rot'],
        packaging_options: ['5 KG Karton', '10 KG Karton', '10 KG Netzsack'],
        grade: 'Klasse 1',
        color: 'Weiß und Rotviolett',
      },
      es: {
        name: 'AJO FRESCO Y SECO',
        description: 'Ajo egipcio de alto aroma, dientes compactos y excelente conservación.',
        origin: 'Minya y Beni Suef, Egipto',
        shelf_life: '8-10 Meses',
        sizes: ['40-50mm', '50-60mm', '60-70mm', '70mm+'],
        varieties: ['Baladi Blanco', 'Verde Chino', 'Rojo Egipcio'],
        packaging_options: ['Caja 5 KG', 'Caja 10 KG', 'Malla 10 KG'],
        grade: 'Clase 1 Exportación',
        color: 'Blanco y Rojo Violeta',
      },
    },
  },

  // 3. Red Onion (البصل الأحمر)
  {
    id: 'prod-red-onion',
    slug: 'fresh-red-onion-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070310',
    storage_temp: '0°C to +4°C (Dry Reefer Container)',
    is_featured: true,
    seasonality: {
      jan: false, feb: false, mar: false, apr: true, may: true, jun: true,
      jul: true, aug: true, sep: true, oct: true, nov: true, dec: true
    },
    season_status: {
      jan: 'off', feb: 'off', mar: 'off', apr: 'available', may: 'peak', jun: 'peak',
      jul: 'peak', aug: 'peak', sep: 'available', oct: 'available', nov: 'limited', dec: 'limited'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP', 'SEDEX'],
    images: [
      {
        id: 'img-ro-1',
        image_url: '/assets/image_111.png',
        alt_text: 'Fresh Egyptian Red Onion Harvest',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'RED ONION',
        description: 'Firm Egyptian red onions with vibrant purple color, thick papery skins, and long storage tolerance for sea freight.',
        origin: 'Giza & Upper Egypt',
        shelf_life: '6-8 Months under optimal ventilation',
        sizes: ['40-60mm', '50-70mm', '70-90mm', '90-110mm'],
        varieties: ['Giza 6 Mohassan', 'Red Italian'],
        packaging_options: ['10 KG Mesh Bag', '25 KG Mesh Bag', '1000 KG Jumbo Bags'],
        grade: 'Class 1',
        color: 'Deep Red / Purple',
      },
      de: {
        name: 'ROTE ZWIEBELN',
        description: 'Feste ägyptische rote Zwiebeln mit schöner Farbe und hervorragender Lagerfähigkeit.',
        origin: 'Gizeh & Oberägypten',
        shelf_life: '6-8 Monate',
        sizes: ['40-60mm', '50-70mm', '70-90mm', '90-110mm'],
        varieties: ['Giza 6 Mohassan'],
        packaging_options: ['10 KG Netzsack', '25 KG Netzsack', 'Jumbo Bags'],
        grade: 'Klasse 1',
        color: 'Dunkelrot',
      },
      es: {
        name: 'CEBOLLA ROJA',
        description: 'Cebollas rojas egipcias de piel firme, color morado brillante y excelente resistencia al transporte marítimo.',
        origin: 'Guiza y Alto Egipto',
        shelf_life: '6-8 Meses',
        sizes: ['40-60mm', '50-70mm', '70-90mm', '90-110mm'],
        varieties: ['Giza 6 Mohassan'],
        packaging_options: ['Malla 10 KG', 'Malla 25 KG', 'Bolsas Jumbo'],
        grade: 'Clase 1',
        color: 'Rojo Púrpura',
      },
    },
  },

  // 4. White Onion (البصل الأبيض)
  {
    id: 'prod-white-onion',
    slug: 'fresh-white-onion-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070310',
    storage_temp: '0°C to +4°C',
    is_featured: true,
    seasonality: {
      jan: false, feb: true, mar: true, apr: true, may: true, jun: true,
      jul: false, aug: false, sep: false, oct: false, nov: false, dec: false
    },
    season_status: {
      jan: 'off', feb: 'available', mar: 'peak', apr: 'peak', may: 'peak', jun: 'available',
      jul: 'off', aug: 'off', sep: 'off', oct: 'off', nov: 'off', dec: 'off'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP', 'SEDEX'],
    images: [
      {
        id: 'img-wo-1',
        image_url: '/assets/GAL-2.jpg',
        alt_text: 'Fresh White Onions from Egypt',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'WHITE ONION',
        description: 'Crisp white onions with mild pungent flavor, clean ivory skins, and optimal dry matter content.',
        origin: 'Delta & Sadat City, Egypt',
        shelf_life: '4-6 Months',
        sizes: ['40-60mm', '60-80mm', '80-100mm'],
        varieties: ['Giza 20 White'],
        packaging_options: ['10 KG Mesh Bag', '25 KG Mesh Bag', '1000 KG Jumbo Bins'],
        grade: 'Class 1',
        color: 'Pure Ivory White',
      },
      de: {
        name: 'WEISSE ZWIEBELN',
        description: 'Frische weiße Speisezwiebeln mit feinem Aroma und fester Konsistenz.',
        origin: 'Delta & Sadat City, Ägypten',
        shelf_life: '4-6 Monate',
        sizes: ['40-60mm', '60-80mm', '80-100mm'],
        varieties: ['Giza 20 Weiß'],
        packaging_options: ['10 KG Netzsack', '25 KG Netzsack'],
        grade: 'Klasse 1',
        color: 'Elfenbeinweiß',
      },
      es: {
        name: 'CEBOLLA BLANCA',
        description: 'Cebollas blancas crujientes con piel limpia de marfil y sabor equilibrado.',
        origin: 'Delta y Ciudad Sadat, Egipto',
        shelf_life: '4-6 Meses',
        sizes: ['40-60mm', '60-80mm', '80-100mm'],
        varieties: ['Giza 20 Blanco'],
        packaging_options: ['Malla 10 KG', 'Malla 25 KG'],
        grade: 'Clase 1',
        color: 'Blanco Marfil',
      },
    },
  },

  // 5. Spring Onion / Green Onion (البصل الأخضر)
  {
    id: 'prod-spring-onion',
    slug: 'fresh-spring-green-onion-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070310',
    storage_temp: '0°C to +1°C (High Humidity / Ice Packing)',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: false, jun: false,
      jul: false, aug: false, sep: false, oct: true, nov: true, dec: true
    },
    season_status: {
      jan: 'peak', feb: 'peak', mar: 'peak', apr: 'available', may: 'off', jun: 'off',
      jul: 'off', aug: 'off', sep: 'off', oct: 'available', nov: 'peak', dec: 'peak'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP', 'SEDEX'],
    images: [
      {
        id: 'img-so-1',
        image_url: '/assets/GAL-2.jpg',
        alt_text: 'Fresh Egyptian Spring Onions Hand Bunching',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'SPRING ONION (GREEN ONION)',
        description: 'Tender, straight spring onions with clean white shafts and vibrant green leaves, harvested daily and hydro-cooled.',
        origin: 'Giza & Qalyubia, Egypt',
        shelf_life: '21-28 Days (Cold chain +0°C to +1°C)',
        sizes: ['Diameter: 8-15mm', 'Length: 30-35cm'],
        varieties: ['Photon', 'Giza White Shaft'],
        packaging_options: ['14 Bunches in 2 KG Carton', '28 Bunches in 4 KG Carton', 'Iced / Modified Atmosphere (MAP)'],
        grade: 'Extra Class 1',
        color: 'Crisp White Base, Vivid Green Tops',
      },
      de: {
        name: 'FRÜHLINGSZWIEBELN / LAUCHZWIEBELN',
        description: 'Frische Bundzwiebeln mit knackig-weißem Schaft und frischen grünen Spitzen.',
        origin: 'Gizeh & Qalyubia, Ägypten',
        shelf_life: '21-28 Tage',
        sizes: ['Durchmesser: 8-15mm', 'Länge: 30-35cm'],
        varieties: ['Photon'],
        packaging_options: ['2 KG Karton', '4 KG Karton (Eispackung)'],
        grade: 'Klasse 1 Extra',
        color: 'Weißer Schaft, saftiges Grün',
      },
      es: {
        name: 'CEBOLLINO / CEBOLLA DE VERDEO',
        description: 'Cebollas verdes tiernas con tallos blancos rectos y hojas verdes frescas.',
        origin: 'Guiza y Qalyubia, Egipto',
        shelf_life: '21-28 Días',
        sizes: ['Diámetro: 8-15mm', 'Longitud: 30-35cm'],
        varieties: ['Photon'],
        packaging_options: ['Caja 2 KG', 'Caja 4 KG con Hielo'],
        grade: 'Clase Extra',
        color: 'Base Blanca, Hojas Verdes',
      },
    },
  },

  // 6. Green Beans (الفاصوليا الخضراء)
  {
    id: 'prod-green-beans',
    slug: 'fresh-green-beans-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070820',
    storage_temp: '+4°C to +7°C',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: true, jun: true,
      jul: false, aug: false, sep: false, oct: false, nov: true, dec: true
    },
    season_status: {
      jan: 'peak', feb: 'peak', mar: 'peak', apr: 'available', may: 'available', jun: 'limited',
      jul: 'off', aug: 'off', sep: 'off', oct: 'off', nov: 'available', dec: 'peak'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP', 'SEDEX'],
    images: [
      {
        id: 'img-gb-1',
        image_url: '/assets/photo_6010464546872561748_y_2_2.jpg',
        alt_text: 'Fresh Egyptian Green Beans in Premium Export Box',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'GREEN BEANS (HARICOT VERT)',
        description: 'Slender, stringless green beans hand-picked daily for optimum crunch, uniform straightness, and vivid green color.',
        origin: 'Ismailia & Beheira, Egypt',
        shelf_life: '14-18 Days (+4°C to +7°C)',
        sizes: ['Extra Fine (<6.5mm)', 'Fine (6.5-8mm)', 'Bobby (8-10mm)'],
        varieties: ['Valentino', 'Paulista', 'Bronco'],
        packaging_options: ['4 KG Loose Carton', '5 KG Carton', 'Pre-pack 250g / 500g Trays'],
        grade: 'Class 1 Export',
        color: 'Deep Emerald Green',
      },
      de: {
        name: 'GRÜNE BOHNEN (PRINZESSBOHNEN)',
        description: 'Zarte, fadenlose grüne Bohnen von hand gepflückt und sofort gekühlt.',
        origin: 'Ismailia & Beheira, Ägypten',
        shelf_life: '14-18 Tage',
        sizes: ['Extra Fein (<6.5mm)', 'Fein (6.5-8mm)', 'Bobby (8-10mm)'],
        varieties: ['Valentino', 'Paulista'],
        packaging_options: ['4 KG Karton', '5 KG Karton'],
        grade: 'Klasse 1',
        color: 'Smaragdgrün',
      },
      es: {
        name: 'JUDÍAS VERDES / EJOTES',
        description: 'Judías verdes finas sin hebras, cosechadas a mano a diario para máxima frescura.',
        origin: 'Ismailia y Beheira, Egipto',
        shelf_life: '14-18 Días',
        sizes: ['Extra Fina (<6.5mm)', 'Fina (6.5-8mm)', 'Bobby (8-10mm)'],
        varieties: ['Valentino', 'Paulista'],
        packaging_options: ['Caja 4 KG', 'Caja 5 KG', 'Bandejas 500g'],
        grade: 'Clase 1',
        color: 'Verde Esmeralda',
      },
    },
  },

  // 7. Snow Peas & Sugar Snap (البازلاء السكرية)
  {
    id: 'prod-snow-peas',
    slug: 'fresh-snow-peas-mangetout-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070810',
    storage_temp: '+2°C to +4°C',
    is_featured: false,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: false, jun: false,
      jul: false, aug: false, sep: false, oct: false, nov: true, dec: true
    },
    season_status: {
      jan: 'peak', feb: 'peak', mar: 'peak', apr: 'limited', may: 'off', jun: 'off',
      jul: 'off', aug: 'off', sep: 'off', oct: 'off', nov: 'available', dec: 'peak'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP'],
    images: [
      {
        id: 'img-sp-peas-1',
        image_url: '/assets/GAL-1.jpg',
        alt_text: 'Fresh Egyptian Snow Peas Mangetout',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'SNOW PEAS & SUGAR SNAP',
        description: 'Flat, crunchy Mangetout and plump Sugar Snap peas with sweet natural flavor and bright green pods.',
        origin: 'Menofia & Delta, Egypt',
        shelf_life: '14-21 Days',
        sizes: ['Length: 7-10cm', 'Width: 15-20mm'],
        varieties: ['Oregon Sugar Pod', 'Sweet Horizon'],
        packaging_options: ['1.5 KG Carton', '2 KG Carton', '4 KG Carton'],
        grade: 'Class 1 Export',
        color: 'Luminous Green',
      },
      de: {
        name: 'ZUCKERERBSEN / MANGETOUT',
        description: 'Knackige süße Zuckererbsen für den anspruchsvollen europäischen Markt.',
        origin: 'Menofia, Ägypten',
        shelf_life: '14-21 Tage',
        sizes: ['7-10cm'],
        varieties: ['Oregon Sugar Pod'],
        packaging_options: ['1.5 KG Karton', '2 KG Karton'],
        grade: 'Klasse 1',
        color: 'Hellgrün',
      },
      es: {
        name: 'TIRABEQUES / GUISANTES DULCES',
        description: 'Tirabeques crujientes y dulces, seleccionados para el mercado europeo.',
        origin: 'Menofia, Egipto',
        shelf_life: '14-21 Días',
        sizes: ['7-10cm'],
        varieties: ['Oregon Sugar Pod'],
        packaging_options: ['Caja 1.5 KG', 'Caja 2 KG'],
        grade: 'Clase 1',
        color: 'Verde Brillante',
      },
    },
  },

  // 8. Broccoli (البروكلي)
  {
    id: 'prod-broccoli',
    slug: 'fresh-broccoli-heads-egypt',
    category_id: 'cat-vegetables',
    hs_code: '070410',
    storage_temp: '0°C to +1°C (Iced Top)',
    is_featured: false,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: false, jun: false,
      jul: false, aug: false, sep: false, oct: false, nov: false, dec: true
    },
    season_status: {
      jan: 'peak', feb: 'peak', mar: 'peak', apr: 'limited', may: 'off', jun: 'off',
      jul: 'off', aug: 'off', sep: 'off', oct: 'off', nov: 'off', dec: 'available'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP'],
    images: [
      {
        id: 'img-broc-1',
        image_url: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Compact Egyptian Broccoli Heads',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'FRESH BROCCOLI',
        description: 'Dense, tight-beaded broccoli crowns with deep blue-green color and short trimmed stalks.',
        origin: 'Sadat City & Nubaria, Egypt',
        shelf_life: '21-28 Days with top icing',
        sizes: ['350g - 500g per head', 'Crown Diameter: 11-15cm'],
        varieties: ['Ironman', 'Parthenon'],
        packaging_options: ['4 KG Styrofoam Box with Ice', '5 KG Carton with Liner'],
        grade: 'Class 1',
        color: 'Blue-Green Compact Crown',
      },
      de: {
        name: 'FRISCHER BROKKOLI',
        description: 'Kompakte Brokkoliröschen mit feiner Körnung und frischer grüner Farbe.',
        origin: 'Sadat City, Ägypten',
        shelf_life: '21-28 Tage',
        sizes: ['350-500g pro Kopf'],
        varieties: ['Ironman', 'Parthenon'],
        packaging_options: ['4 KG Styropor mit Eis', '5 KG Karton'],
        grade: 'Klasse 1',
        color: 'Dunkelgrün',
      },
      es: {
        name: 'BRÓCOLI FRESCO',
        description: 'Cabezas de brócoli compactas y uniformes con tallo corto y color verde azulado.',
        origin: 'Ciudad Sadat, Egipto',
        shelf_life: '21-28 Días con hielo',
        sizes: ['350-500g por cabeza'],
        varieties: ['Ironman'],
        packaging_options: ['Caja de Poliestireno 4 KG con Hielo', 'Caja 5 KG'],
        grade: 'Clase 1',
        color: 'Verde Azulado',
      },
    },
  },

  // 9. Valencia Oranges (البرتقال الصيفي)
  {
    id: 'prod-valencia-orange',
    slug: 'egyptian-valencia-orange-export',
    category_id: 'cat-fruits',
    hs_code: '080510',
    storage_temp: '+3°C to +6°C',
    brix_level: '11.5% - 13.5%',
    is_featured: true,
    seasonality: {
      jan: true, feb: true, mar: true, apr: true, may: true, jun: false,
      jul: false, aug: false, sep: false, oct: false, nov: false, dec: false
    },
    season_status: {
      jan: 'available', feb: 'peak', mar: 'peak', apr: 'peak', may: 'available', jun: 'off',
      jul: 'off', aug: 'off', sep: 'off', oct: 'off', nov: 'off', dec: 'off'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP', 'SEDEX'],
    images: [
      {
        id: 'img-ora-1',
        image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Egyptian Valencia Oranges',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'VALENCIA ORANGES',
        description: 'World-famous Egyptian Valencia oranges packed with high juice content (48%+), balanced brix-acid ratio, and glossy natural skin.',
        origin: 'Wadi El Natrun & Delta, Egypt',
        shelf_life: '60-75 Days under refrigerated shipping',
        sizes: ['48', '56', '64', '72', '80', '88', '100', '113', '125'],
        varieties: ['Valencia Late', 'Delta Seedless'],
        packaging_options: ['15 KG Telescopic Box', '15 KG Open-top Carton', '1600 KG Jumbo Bins'],
        grade: 'Grade 1 Export',
        color: 'Vibrant Deep Orange',
      },
      de: {
        name: 'VALENCIA ORANGEN',
        description: 'Weltberühmte saftige ägyptische Valencia-Orangen mit über 48% Saftgehalt.',
        origin: 'Wadi El Natrun, Ägypten',
        shelf_life: '60-75 Tage',
        sizes: ['48', '56', '64', '72', '80', '88', '100'],
        varieties: ['Valencia Late'],
        packaging_options: ['15 KG Teleskop-Karton', '15 KG Open-top'],
        grade: 'Klasse 1',
        color: 'Kräftiges Orange',
      },
      es: {
        name: 'NARANJAS VALENCIA',
        description: 'Naranjas Valencia egipcias de alto contenido de jugo (más del 48%) y sabor dulce ideal.',
        origin: 'Wadi El Natrun, Egipto',
        shelf_life: '60-75 Días',
        sizes: ['48', '56', '64', '72', '80', '88', '100'],
        varieties: ['Valencia Late'],
        packaging_options: ['Caja Telescópica 15 KG', 'Caja Open Top 15 KG'],
        grade: 'Clase 1',
        color: 'Naranja Intenso',
      },
    },
  },

  // 10. Fresh Table Grapes (العنب)
  {
    id: 'prod-fresh-grapes',
    slug: 'fresh-egyptian-table-grapes',
    category_id: 'cat-fruits',
    hs_code: '080610',
    storage_temp: '0°C to +1°C (90-95% Humidity)',
    brix_level: '16% - 19%',
    is_featured: false,
    seasonality: {
      jan: false, feb: false, mar: false, apr: false, may: true, jun: true,
      jul: true, aug: true, sep: false, oct: false, nov: false, dec: false
    },
    season_status: {
      jan: 'off', feb: 'off', mar: 'off', apr: 'off', may: 'available', jun: 'peak',
      jul: 'peak', aug: 'available', sep: 'off', oct: 'off', nov: 'off', dec: 'off'
    },
    certifications: ['GLOBALG.A.P.', 'GRASP'],
    images: [
      {
        id: 'img-grp-1',
        image_url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Fresh Egyptian Table Grapes in Carry Bags',
        display_order: 1,
        is_cover: true
      }
    ],
    translations: {
      en: {
        name: 'TABLE GRAPES',
        description: 'Crisp, seedless table grapes with sweet firm berries and intact natural bloom. Early summer arrival for European markets.',
        origin: 'Alexandria Desert Road, Egypt',
        shelf_life: '35-45 Days',
        sizes: ['Berry Diameter: 18-22mm+'],
        varieties: ['Superior Seedless (White)', 'Early Sweet', 'Crimson (Red)', 'Flame Seedless'],
        packaging_options: ['4.5 KG / 5 KG Carton (10 x 500g Punnets)', '4.5 KG Carry Bags'],
        grade: 'Class 1',
        color: 'Crisp Green / Ruby Red',
      },
      de: {
        name: 'TAFELTRAUBEN',
        description: 'Kernlose, süße Tafeltrauben mit festen Beeren aus früher ägyptischer Ernte.',
        origin: 'Alexandria Wüstenstraße, Ägypten',
        shelf_life: '35-45 Tage',
        sizes: ['18-22mm+'],
        varieties: ['Superior Seedless', 'Crimson', 'Flame'],
        packaging_options: ['5 KG Karton (Schalen 10x500g)', 'Carry Bags'],
        grade: 'Klasse 1',
        color: 'Grün & Rubinrot',
      },
      es: {
        name: 'UVAS DE MESA',
        description: 'Uvas sin semillas de alta graduación brix, bayas firmes y llegada temprana a Europa.',
        origin: 'Carretera del Desierto de Alejandría, Egipto',
        shelf_life: '35-45 Días',
        sizes: ['18-22mm+'],
        varieties: ['Superior Seedless', 'Crimson', 'Flame'],
        packaging_options: ['Caja 5 KG (Tarrinas 10x500g)', 'Bolsas Carry Bag'],
        grade: 'Clase 1',
        color: 'Verde y Rojo Rubí',
      },
    },
  }
];

export const mockSiteSettings: SiteSettings = {
  company_name: 'Golden Sun for Agricultural Export',
  tagline: {
    en: 'Real Production Access, Real Packing Operations & Seamless Export',
    de: 'Echter Erzeugerzugang, moderne Packstationen & verlässlicher Export',
    es: 'Acceso Directo a Producción, Empaque Moderno y Exportación Confiable',
  },
  address: {
    en: 'Sadat City Agricultural & Industrial Zone, Egypt',
    de: 'Sadat City Agrar- & Industriezone, Ägypten',
    es: 'Zona Agrícola e Industrial de Ciudad Sadat, Egipto',
  },
  phone: '+20 128 775 5522',
  whatsapp: '+20 11 00603304',
  email: 'info@goldensun-eg.com',
  google_maps_url: 'https://maps.google.com/?q=Sadat+City+Egypt',
  social_links: {
    linkedin: 'https://www.linkedin.com/company/golden-sun-for-export-import/',
    facebook: 'https://www.facebook.com/share/1JFz3wGibX/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/sungolden2026?stkn=ejd2MHF3cHl4b2Nx&utm_source=qr',
  },
  google_analytics_id: 'G-GOLDENSUN2026',
  clarity_id: 'clarity_goldensun',
};

export const mockArticles: Article[] = [
  {
    id: 'art-1',
    slug: 'egyptian-sweet-potato-export-growth-2026',
    image_url: '/assets/GAL4.jpg',
    created_at: '2026-07-20',
    translations: {
      en: {
        title: 'Egyptian Sweet Potato Export Season: Why Beauregard & Bellevue Lead Global Demand',
        summary: 'An inside look into how Golden Sun achieves high brix curing and zero-loss cold chain transport to the UK, Netherlands, and GCC.',
        content: 'Egypt has rapidly established itself as one of the premier global exporters of high-quality sweet potatoes. At Golden Sun, our specialized curing facilities and strict size grading ensure every carton arrives in prime culinary condition...'
      },
      de: {
        title: 'Ägyptische Süßkartoffel-Saison: Warum Beauregard & Bellevue den Weltmarkt anführen',
        summary: 'Ein Einblick in die Kuration und Kühllogistik von Golden Sun für europäische Abnehmer.',
        content: 'Ägypten gehört zu den führenden Exporteuren für Süßkartoffeln weltweit. Golden Sun garantiert durch professionelle Härtung und Sortierung beste Haltbarkeit...'
      },
      es: {
        title: 'Temporada de Batata Egipcia: Por Qué Beauregard y Bellevue Lideran la Demanda',
        summary: 'Cómo Golden Sun garantiza curado de alto brix y cadena de frío garantizada hacia Europa y el Golfo.',
        content: 'Egipto se ha consolidado como un exportador líder de batatas de alta calidad. En Golden Sun garantizamos clasificación rigurosa y frescura...'
      }
    }
  }
];

export const mockRFQs: RFQ[] = [
  {
    id: 'rfq_1',
    rfq_number: 'GS-RFQ-1001',
    company_name: 'FreshDirect Europe B.V.',
    contact_name: 'Klaas van der Meer',
    email: 'k.vandermeer@freshdirect.nl',
    phone_whatsapp: '+31 20 1234567',
    country: 'Netherlands',
    port_of_discharge: 'Port of Rotterdam',
    incoterm: 'CIF',
    estimated_etd: '2026-09-01',
    notes: 'Requires 40ft Reefer (+13°C set point) with temperature data loggers.',
    gdpr_consent: true,
    status: 'new',
    created_at: new Date().toISOString(),
    items: [
      {
        product_id: 'prod-sweet-potato',
        product_name: 'Sweet Potato (Beauregard / Bellevue)',
        quantity_tons: 44,
        preferred_packaging: 'Carton 6 KG Net',
      },
    ],
  },
];
