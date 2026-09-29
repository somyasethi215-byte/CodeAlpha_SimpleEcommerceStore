// db/seed.js
// Run with: npm run seed
// Clears the products table and inserts sample data so the store isn't empty.

const db = require('./database');

const sampleProducts = [
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic 2.4GHz wireless mouse with adjustable DPI.',
    price: 799,
    image_url: 'https://placehold.co/400x300?text=Wireless+Mouse',
    stock: 25
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Tactile blue-switch mechanical keyboard with RGB backlight.',
    price: 2499,
    image_url: 'https://placehold.co/400x300?text=Mechanical+Keyboard',
    stock: 15
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, SD card reader, and PD charging.',
    price: 1299,
    image_url: 'https://placehold.co/400x300?text=USB-C+Hub',
    stock: 40
  },
  {
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand, foldable and portable.',
    price: 999,
    image_url: 'https://placehold.co/400x300?text=Laptop+Stand',
    stock: 30
  },
  {
    name: 'Noise Cancelling Headphones',
    description: 'Over-ear headphones with active noise cancellation, 30hr battery.',
    price: 4999,
    image_url: 'https://placehold.co/400x300?text=Headphones',
    stock: 10
  },
  {
    name: 'Webcam 1080p',
    description: 'Full HD webcam with built-in mic, great for calls and streaming.',
    price: 1899,
    image_url: 'https://placehold.co/400x300?text=Webcam',
    stock: 20
  }
];

const deleteAll = db.prepare('DELETE FROM products');
const insert = db.prepare(`
  INSERT INTO products (name, description, price, image_url, stock)
  VALUES (@name, @description, @price, @image_url, @stock)
`);

const seed = db.transaction((products) => {
  deleteAll.run();
  for (const p of products) insert.run(p);
});

seed(sampleProducts);
console.log(`Seeded ${sampleProducts.length} products.`);
