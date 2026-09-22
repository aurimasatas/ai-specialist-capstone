import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { books } from "../data/books";
import ProductCard from "../components/ProductCard";

export default function CartPage() {
  const { state, removeItem, updateQty, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  // Recommendations: books not already in cart
  const cartIds = new Set(state.items.map((i) => i.book.id));
  const recommendations = books.filter((b) => !cartIds.has(b.id)).slice(0, 3);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add some books to get started!</p>
          <Link
            to="/catalogue"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white font-semibold transition-colors"
          >
            Browse Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Shopping Cart <span className="text-gray-400 font-normal text-lg">({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map(({ book, quantity }) => (
              <div key={book.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4">
                <Link to={`/product/${book.id}`} className="text-5xl select-none shrink-0">{book.cover}</Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${book.id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">{book.title}</h3>
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{book.author}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">🚚 Est. delivery: {book.deliveryDate}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(book.id, quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center font-medium transition-colors"
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQty(book.id, quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center font-medium transition-colors"
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 dark:text-gray-100">${(book.price * quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeItem(book.id)}
                        className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors text-sm"
                        aria-label={`Remove ${book.title} from cart`}
                      >✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">FREE</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-colors"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/catalogue"
                className="mt-3 block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommendations.map((b) => (
                <ProductCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
