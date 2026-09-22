import { Link } from "react-router-dom";
import type { Book } from "../data/books";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  book: Book;
}

export default function ProductCard({ book }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900 transition-shadow flex flex-col">
      {/* Cover */}
      <Link to={`/product/${book.id}`} className="block">
        <div className="h-44 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-7xl select-none">
          {book.cover}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1">
          {book.category}
        </span>
        <Link to={`/product/${book.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(book.rating))}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">({book.reviews.toLocaleString()})</span>
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-1 mb-3 text-xs text-green-600 dark:text-green-400">
          🚚 <span>Est. delivery: {book.deliveryDate}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-bold text-gray-900 dark:text-gray-100">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">${book.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(book)}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium transition-colors"
            aria-label={`Add ${book.title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
