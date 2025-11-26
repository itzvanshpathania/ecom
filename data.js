// data.js
// Central product catalog used across all pages.

const PRODUCTS = [
  {
    id: "1",
    name: "Minimalist Lounge Chair",
    price: 129.99,
    image:
      "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Furniture",
    description:
      "A low‑profile lounge chair with solid oak legs and soft woven upholstery. Designed for comfort and durability in modern living rooms."
  },
  {
    id: "2",
    name: "Soft Glow Floor Lamp",
    price: 89.0,
    image:
      "https://images.pexels.com/photos/8132660/pexels-photo-8132660.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Lighting",
    description:
      "A slim metal floor lamp with a warm diffused shade. Perfect for reading corners and cozy evening ambience."
  },
  {
    id: "3",
    name: "Walnut Side Table",
    price: 149.5,
    image:
      "https://images.pexels.com/photos/1125135/pexels-photo-1125135.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Furniture",
    description:
      "Solid walnut side table with beveled edges and a matte finish. Works as a nightstand or a living room side table."
  },
  {
    id: "4",
    name: "Textured Cotton Throw",
    price: 59.99,
    image:
      "https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Decor",
    description:
      "A soft, oversized cotton throw with a subtle herringbone texture. Ideal for layering on sofas or beds."
  },
  {
    id: "5",
    name: "Framed Abstract Print",
    price: 79.0,
    image:
      "https://images.pexels.com/photos/3625718/pexels-photo-3625718.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Decor",
    description:
      "Gallery‑quality giclée print in a slim oak frame. Adds a refined pop of color to any wall."
  },
  {
    id: "6",
    name: "Ceramic Table Lamp",
    price: 99.0,
    image:
      "https://images.pexels.com/photos/842950/pexels-photo-842950.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Lighting",
    description:
      "Hand‑glazed ceramic base with a linen drum shade. Provides soft, warm light for bedside tables and desks."
  },
  {
    id: "7",
    name: "Wireless Desk Speaker",
    price: 129.0,
    image:
      "https://images.pexels.com/photos/845434/pexels-photo-845434.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Electronics",
    description:
      "Compact Bluetooth speaker with rich 360° sound and 12‑hour battery life. Finished in fabric to blend into your decor."
  },
  {
    id: "8",
    name: "Oak Dining Chair Set (2)",
    price: 249.99,
    image:
      "https://images.pexels.com/photos/37347/office-freelance-entrepreneur-business-37347.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Furniture",
    description:
      "Pair of stackable oak dining chairs with a curved backrest and upholstered seat for long dinners and gatherings."
  }
];

// Helper: get all categories including "All"
function getAllCategories() {
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort();
  return ["All", ...categories];
}

// Helper: lookup by id
function getProductById(id) {
  return PRODUCTS.find((p) => p.id === String(id)) || null;
}