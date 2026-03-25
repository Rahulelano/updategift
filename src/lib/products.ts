import { Product } from './store';

export const products: Product[] = [
  { 
    id: '1', 
    name: 'Ayyappan 18-Step MDF Step With Photo Cutout', 
    price: 999, 
    image: 'https://updategifts.in/wp-content/uploads/2025/11/iyya-3-900x900.jpg', 
    category: 'MDF Gifts', 
    description: 'Beautiful Ayyappan 18-step MDF display with free photo cutout. Perfect for pooja rooms and spiritual decor.',
    customFields: [
      { type: 'image', label: 'Upload Photo', required: true, maxPhotos: 1 }
    ]
  },
  { 
    id: '2', 
    name: 'Acrylic Frame with Gold Border 12×8 inch', 
    price: 499, 
    originalPrice: 799, 
    image: 'https://updategifts.in/wp-content/uploads/2026/02/murugan-01-900x900.jpg', 
    category: 'Photo Frames', 
    badge: 'Sale', 
    description: 'Premium acrylic photo frame with elegant gold border. Double production frame for extra durability.',
    customFields: [
      { type: 'image', label: 'Upload Photo', required: true, maxPhotos: 1 }
    ]
  },
  { 
    id: '3', 
    name: 'Romantic Combo Gift – Sweet Memories & Love Tokens', 
    price: 499, 
    originalPrice: 599, 
    image: 'https://updategifts.in/wp-content/uploads/2026/01/499-01-900x900.jpg', 
    category: 'Valentine Combos', 
    badge: 'Sale', 
    description: 'The perfect romantic combo gift with sweet memories and love tokens.',
    customFields: [
      { type: 'image', label: 'Upload Couple Photo', required: true, maxPhotos: 1 }
    ]
  },
  { id: '4', name: "Special Love Combo – Valentine's Week Combo", price: 1499, originalPrice: 1800, image: 'https://updategifts.in/wp-content/uploads/2026/01/1499-02-900x900.jpg', category: 'Valentine Combos', badge: 'Sale', description: "Complete Valentine's week combo with special love gifts." },
  { id: '5', name: 'Om Aura – MDF Pooja Shelf with Cutwork Back', price: 299, image: 'https://updategifts.in/wp-content/uploads/2025/11/02-36-900x900.jpg', category: 'Home Decors', description: 'MDF pooja shelf with intricate Om cutwork design on the back panel.' },
  { id: '6', name: 'Remote Stand with 3 Sections MDF Remote Holder', price: 469, image: 'https://updategifts.in/wp-content/uploads/2025/11/01-26-900x900.jpg', category: 'Home Decors', description: 'Organize your TV and AC remotes with this stylish MDF remote holder.' },
  { id: '7', name: 'Desi Dose – Humorous Character MDF Coaster Set of 6', price: 329, originalPrice: 999, image: 'https://updategifts.in/wp-content/uploads/2025/11/01-18-900x900.jpg', category: 'MDF Gifts', badge: 'Hot', description: 'Fun and humorous character coaster set printed on premium MDF.' },
  { id: '8', name: 'Retro Boombox Sublimation MDF Key Holder', price: 399, image: 'https://updategifts.in/wp-content/uploads/2025/11/RedRadio_1800x1800-900x900.webp', category: 'Home Decors', description: 'Retro-style boombox key holder with sublimation print on MDF.' },
  { 
    id: '9', 
    name: '8×8 Inch – Sublimation MDF Puzzle (30 Pieces)', 
    price: 480, 
    image: 'https://updategifts.in/wp-content/uploads/2025/11/1001676721-900x900.jpg', 
    category: 'MDF Gifts', 
    description: 'Customizable MDF puzzle with sublimation photo print. Makes a unique personalized gift.',
    customFields: [
      { type: 'image', label: 'Upload Photo', required: true, maxPhotos: 1 }
    ]
  },
  { id: '10', name: 'Krishna Blessings – Personalized MDF House Name Board', price: 1199, image: 'https://updategifts.in/wp-content/uploads/2025/11/Here_s-a-design-that-brings-blessings-and-beauty-togethe-3-900x900.jpg', category: 'Home Decors', description: 'Personalized MDF house name board with Krishna blessings theme.' },
  { id: '11', name: 'Happy Anniversary Moments – Table top MDF Gift', price: 480, image: 'https://updategifts.in/wp-content/uploads/2025/11/UTF-0042-3.jpg', category: 'MDF Gifts', description: 'Celebrate anniversaries with this beautiful tabletop MDF gift.' },
  { 
    id: '12', 
    name: 'Acrylic Magnetic Photo Frames – Set of 4', 
    price: 449, 
    originalPrice: 600, 
    image: 'https://updategifts.in/wp-content/uploads/2025/11/squre.jpg', 
    category: 'Photo Frames', 
    badge: 'Sale', 
    description: 'Scalloped-edge acrylic magnetic photo frames for fridge. Set of 4 pieces.',
    customFields: [
      { type: 'image', label: 'Upload 4 Photos', required: true, maxPhotos: 4 }
    ]
  },
  { 
    id: '13', 
    name: 'Customized Photo White Mug Sublimation Print', 
    price: 220, 
    originalPrice: 240, 
    image: 'https://updategifts.in/wp-content/uploads/2025/09/01-15.jpg', 
    category: 'MDF Gifts', 
    badge: 'Sale', 
    description: 'Custom printed white ceramic mug with sublimation photo print.',
    customFields: [
      { type: 'image', label: 'Upload Photo', required: true, maxPhotos: 1 }
    ]
  },
  { id: '14', name: 'Wooden Lifetime Calendar with Sublimation Print', price: 549, originalPrice: 700, image: 'https://updategifts.in/wp-content/uploads/2025/09/lifetime-calander-01-scaled-900x900.jpg', category: 'Home Decors', badge: 'Sale', description: 'Perpetual wooden calendar with customizable sublimation print.' },
  { 
    id: '15', 
    name: 'Personalized Spotify Frame – Custom Wooden Music Plaque', 
    price: 450, 
    image: 'https://updategifts.in/wp-content/uploads/2025/09/01-2-scaled-900x900.jpg', 
    category: 'Photo Frames', 
    description: 'Custom wooden music plaque with song name, Spotify code and photo.',
    customFields: [
      { type: 'text', label: 'Song Name & Artist', required: true },
      { type: 'image', label: 'Upload Photo', required: true, maxPhotos: 1 }
    ]
  },
  { id: '16', name: 'Best Couple Moments – Table top MDF Gift', price: 450, image: 'https://updategifts.in/wp-content/uploads/2025/11/UTF-0035-3.jpg', category: 'MDF Gifts', description: 'Celebrate your best couple moments with this tabletop MDF gift.' },
  { id: '17', name: 'Blossom Moments – Wall Hanging MDF Frame', price: 350, image: 'https://updategifts.in/wp-content/uploads/2025/11/UWHF-0070-3-1.jpg', category: 'Photo Frames', description: 'Beautiful wall hanging sublimation MDF frame for blossom moments.' },
  { id: '18', name: 'Miniature Personalized Couple Standee', price: 300, image: 'https://updategifts.in/wp-content/uploads/2025/11/61diUlY0O9L._AC_SL1500_-900x900.jpg', category: 'MDF Gifts', description: 'Miniature couple standee with sublimation photo print cutout.' },
  { id: '19', name: 'Double Letter Cutout – Sublimation Print 13×17 inch', price: 1100, originalPrice: 2200, image: 'https://updategifts.in/wp-content/uploads/2025/09/name-cutout2-scaled-900x900.jpg', category: 'MDF Gifts', badge: 'Hot', description: 'Large double letter cutout with sublimation print. 50% off!' },
  { 
    id: '20', 
    name: 'Wooden Photo Frame with Name and Photo', 
    price: 450, 
    image: 'https://updategifts.in/wp-content/uploads/2025/09/03-3-scaled-900x900.jpg', 
    category: 'Photo Frames', 
    description: 'Personalized wooden photo frame with custom name engraving.',
    customFields: [
      { type: 'text', label: 'Name on Frame', required: true },
      { type: 'image', label: 'Upload Photo', required: true, maxPhotos: 1 }
    ]
  },
  { id: '21', name: 'Customized Acrylic Thumb Impression Gift', price: 499, image: 'https://updategifts.in/wp-content/uploads/2025/09/thumprint-design-1-scaled-900x900.jpg', category: 'MDF Gifts', description: 'Unique acrylic gift with custom thumb impression and personalized text.' },
  { id: '22', name: 'Character Caricature Box – Super Heroes Stand', price: 399, image: 'https://updategifts.in/wp-content/uploads/2025/08/UPGTF-74-1-scaled-900x900.jpg', category: 'MDF Gifts', description: 'Fun super hero character caricature display box.' },
  { 
    id: '23', 
    name: 'Heart Shape Wall Hanging Clock – 9 Photos', 
    price: 1100, 
    originalPrice: 1450, 
    image: 'https://updategifts.in/wp-content/uploads/2025/07/UWC-0049.jpg', 
    category: 'Home Decors', 
    badge: 'Sale', 
    description: 'Heart-shaped wall hanging clock with space for 9 custom photos.',
    customFields: [
      { type: 'image', label: 'Upload 9 Photos', required: true, maxPhotos: 9 }
    ]
  },
  { id: '24', name: 'Santa Claus Studio Box – Festive Shadow Display', price: 499, originalPrice: 799, image: 'https://updategifts.in/wp-content/uploads/2025/12/santa-003-900x900.jpg', category: 'Christmas Gifts', badge: 'Sale', description: 'Festive Santa Claus shadow display box, 8x8x2 inches.' },
  { 
    id: '25', 
    name: 'Rotating Photo Lamp with 4 Photos 4×6 inch', 
    price: 499, 
    originalPrice: 650, 
    image: 'https://updategifts.in/wp-content/uploads/2025/09/4-x-4-lamp-01.jpg', 
    category: 'Photo Frames', 
    badge: 'Sale', 
    description: 'Personalized rotating photo lamp with sublimation print. Holds 4 photos.',
    customFields: [
      { type: 'image', label: 'Upload 4 Photos', required: true, maxPhotos: 4 }
    ]
  },
  { 
    id: '32', 
    name: 'Synthetic wooden Photo Frame (30"x40")', 
    price: 4500, 
    image: 'https://updategifts.in/wp-content/uploads/2025/09/frame-01.jpg', 
    category: 'Photo Frames', 
    description: 'Premium synthetic wooden photo frame in 30x40 size.',
    shippingOverride: true,
    customFields: [
      { type: 'image', label: 'Upload Images', required: true, maxPhotos: 30 }
    ]
  },
  {
    id: '33',
    name: 'Personalized Couple Gift Frame',
    price: 1399,
    image: 'https://updategifts.in/wp-content/uploads/2025/11/couple-01.jpg',
    category: 'Photo Frames',
    description: 'Perfect gift for couples with personalized names and date of birth.',
    customFields: [
      { type: 'text', label: 'Person 1 Name', required: true },
      { type: 'text', label: 'Person 2 Name', required: true },
      { type: 'date', label: 'Person 1 date of birth', required: true },
      { type: 'date', label: 'Person 2 date of birth', required: true },
      { type: 'image', label: 'Upload Couple Photo', required: true, maxPhotos: 1 }
    ]
  }
];

export const categories = [
  'All',
  'MDF Gifts',
  'Photo Frames',
  'Home Decors',
  'Valentine Combos',
  'Christmas Gifts',
  'Mobile Cases',
];

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return products;
  return products.filter(p => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.badge === 'Sale' || p.badge === 'Hot').slice(0, 8);
}

export function getBudgetProducts(): Product[] {
  return products.filter(p => p.price < 500).slice(0, 8);
}

export function getUniqueGifts(): Product[] {
  return products.filter(p => !p.badge).slice(0, 8);
}
