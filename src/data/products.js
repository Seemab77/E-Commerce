// src/data/products.js
const img = (seed, w = 600, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const newArrivals = [
  {
    id: "khaadi-lawn-01",
    title: "Printed Lawn 3-Piece",
    brand: "Khaadi",
    category: "lawn",
    price: 5490, oldPrice: 6990, rating: 4.6,
    image: img("khaadi1"),
    images: [img("khaadi1a", 600, 600), img("khaadi1b", 600, 600)],
    description: "Soft printed lawn suit with dupatta.",
  },
  {
    id: "sapphire-pret-tee",
    title: "Basic Pret Kurti",
    brand: "Sapphire",
    category: "pret",
    price: 3990, oldPrice: 4590, rating: 4.4,
    image: img("sapphire1"),
    images: [img("sapphire1a", 600, 600)],
    description: "Everyday pret with breathable fabric.",
  },
  {
    id: "outfitters-men-tee",
    title: "Graphic Tee",
    brand: "Outfitters",
    category: "men",
    price: 2490, oldPrice: 2990, rating: 4.5,
    image: img("outfitters1"),
    images: [img("outfitters1a", 600, 600)],
    description: "Cotton tee with bold print.",
  },
  {
    id: "limelight-kids-frock",
    title: "Kids Party Frock",
    brand: "Limelight",
    category: "kids",
    price: 3290, oldPrice: 3790, rating: 4.3,
    image: img("limelight1"),
    images: [img("limelight1a", 600, 600)],
    description: "Cute frock for festive days.",
  },
];

export const topSelling = [
  {
    id: "nishat-unstitched-01",
    title: "Unstitched 2-Piece",
    brand: "Nishat Linen",
    category: "unstitched",
    price: 2990, oldPrice: 3490, rating: 4.7,
    image: img("nishat1"),
  },
  {
    id: "sanasafinaz-lawn-02",
    title: "Luxury Lawn 3-Piece",
    brand: "Sana Safinaz",
    category: "lawn",
    price: 9990, oldPrice: 11990, rating: 4.8,
    image: img("sanasafinaz1"),
  },
  {
    id: "bata-sneaker-01",
    title: "Classic Sneakers",
    brand: "Bata",
    category: "footwear",
    price: 4190, oldPrice: 4990, rating: 4.5,
    image: img("bata1"),
  },
  {
    id: "servis-sandal-02",
    title: "Men Sandals",
    brand: "Servis",
    category: "footwear",
    price: 2890, oldPrice: 3390, rating: 4.2,
    image: img("servis1"),
  },
];

export const allProducts = [...newArrivals, ...topSelling];
