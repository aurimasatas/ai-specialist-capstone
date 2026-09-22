export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string; // publisher
  cover: string; // emoji placeholder
  rating: number;
  reviews: number;
  description: string;
  deliveryDate: string;
  relatedBooks: string[]; // ids
  tags: string[];
}

export const books: Book[] = [
  {
    id: "1",
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    price: 39.99,
    originalPrice: 49.99,
    category: "Technology",
    brand: "Addison-Wesley",
    cover: "📘",
    rating: 4.8,
    reviews: 2341,
    description: "A classic guide to software craftsmanship covering pragmatic tips and techniques.",
    deliveryDate: "Oct 2, 2025",
    relatedBooks: ["2", "3", "7"],
    tags: ["programming", "software", "best-practices"],
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 34.99,
    originalPrice: 44.99,
    category: "Technology",
    brand: "Prentice Hall",
    cover: "📗",
    rating: 4.7,
    reviews: 3102,
    description: "A handbook of agile software craftsmanship with practical refactoring guidance.",
    deliveryDate: "Oct 3, 2025",
    relatedBooks: ["1", "3", "7"],
    tags: ["clean-code", "refactoring", "software"],
  },
  {
    id: "3",
    title: "Design Patterns",
    author: "Gang of Four",
    price: 44.99,
    originalPrice: 54.99,
    category: "Technology",
    brand: "Addison-Wesley",
    cover: "📙",
    rating: 4.6,
    reviews: 1876,
    description: "Elements of reusable object-oriented software. The definitive patterns reference.",
    deliveryDate: "Oct 5, 2025",
    relatedBooks: ["1", "2", "6"],
    tags: ["patterns", "oop", "architecture"],
  },
  {
    id: "4",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 18.99,
    originalPrice: 24.99,
    category: "Non-Fiction",
    brand: "Harper Perennial",
    cover: "📕",
    rating: 4.9,
    reviews: 8912,
    description: "A brief history of humankind from the Stone Age to the present.",
    deliveryDate: "Oct 1, 2025",
    relatedBooks: ["5", "8"],
    tags: ["history", "anthropology", "science"],
  },
  {
    id: "5",
    title: "Atomic Habits",
    author: "James Clear",
    price: 16.99,
    originalPrice: 22.99,
    category: "Self-Help",
    brand: "Avery",
    cover: "🟠",
    rating: 4.9,
    reviews: 12450,
    description: "An easy and proven way to build good habits and break bad ones.",
    deliveryDate: "Oct 1, 2025",
    relatedBooks: ["4", "8", "9"],
    tags: ["habits", "productivity", "self-improvement"],
  },
  {
    id: "6",
    title: "The Lean Startup",
    author: "Eric Ries",
    price: 21.99,
    originalPrice: 27.99,
    category: "Business",
    brand: "Crown Business",
    cover: "🟢",
    rating: 4.5,
    reviews: 5231,
    description: "How constant innovation creates radically successful businesses.",
    deliveryDate: "Oct 4, 2025",
    relatedBooks: ["3", "9"],
    tags: ["startup", "business", "innovation"],
  },
  {
    id: "7",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    price: 29.99,
    originalPrice: 36.99,
    category: "Technology",
    brand: "O'Reilly",
    cover: "🟡",
    rating: 4.4,
    reviews: 2876,
    description: "Unearthing the excellence in JavaScript with a focus on the best features.",
    deliveryDate: "Oct 6, 2025",
    relatedBooks: ["1", "2", "3"],
    tags: ["javascript", "web", "programming"],
  },
  {
    id: "8",
    title: "Deep Work",
    author: "Cal Newport",
    price: 17.99,
    originalPrice: 23.99,
    category: "Self-Help",
    brand: "Grand Central Publishing",
    cover: "🔵",
    rating: 4.7,
    reviews: 7342,
    description: "Rules for focused success in a distracted world.",
    deliveryDate: "Oct 2, 2025",
    relatedBooks: ["5", "4"],
    tags: ["productivity", "focus", "self-improvement"],
  },
  {
    id: "9",
    title: "Zero to One",
    author: "Peter Thiel",
    price: 19.99,
    originalPrice: 26.99,
    category: "Business",
    brand: "Crown Business",
    cover: "⚫",
    rating: 4.6,
    reviews: 6123,
    description: "Notes on startups, or how to build the future.",
    deliveryDate: "Oct 3, 2025",
    relatedBooks: ["6", "5"],
    tags: ["startup", "innovation", "business"],
  },
];

export const categories = [...new Set(books.map((b) => b.category))];
export const brands = [...new Set(books.map((b) => b.brand))];

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getRelatedBooks(book: Book): Book[] {
  return book.relatedBooks.map((id) => getBookById(id)).filter(Boolean) as Book[];
}

export function getBooksByCategory(category: string): Book[] {
  return books.filter((b) => b.category === category);
}

export function getBooksByBrand(brand: string): Book[] {
  return books.filter((b) => b.brand === brand);
}
