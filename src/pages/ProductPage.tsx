import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBookById, getRelatedBooks } from "../data/books";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, state } = useCart();
  const [added, setAdded] = useState(false);

  const book = getBookById(id ?? "");

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-lg font-medium">Book not found</p>
          <Link to="/catalogue" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
            Back to catalogue
          </Link>
        </div>
      </div>
    );
  }

  const related = getRelatedBooks(book);
  const inCart = state.items.some((i) => i.book.id === book.id);

  const handleAddToCart = () => {
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <span>/</span>
          <Link to="/catalogue" className="hover:text-indigo-600 dark:hover:text-indigo-400">Catalogue</Link>
          <span>/</span>
          <Link to={`/catalogue?category=${encodeURIComponent(book.category)}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{book.category}</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-200 truncate max-w-xs">{book.title}</span>
        </nav>

        {/* Product detail */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Cover */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center py-16 text-9xl select-none">
              {book.cover}
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                {book.category} · {book.brand}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">by {book.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">{"★".repeat(Math.floor(book.rating))}{"☆".repeat(5 - Math.floor(book.rating))}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{book.rating}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({book.reviews.toLocaleString()} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">{book.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {book.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Delivery */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <span className="text-green-600 dark:text-green-400 text-lg">🚚</span>
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">Estimated delivery</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{book.deliveryDate}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">${book.price.toFixed(2)}</span>
                {book.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">${book.originalPrice.toFixed(2)}</span>
                )}
                {book.originalPrice && (
                  <span className="text-sm font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                    Save ${(book.originalPrice - book.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-colors"
                  aria-label={`Add ${book.title} to cart`}
                >
                  {added ? "✓ Added to Cart" : inCart ? "Add Another" : "Add to Cart"}
                </button>
                <button
                  onClick={() => { addItem(book); navigate("/cart"); }}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((rb) => (
                <ProductCard key={rb.id} book={rb} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
