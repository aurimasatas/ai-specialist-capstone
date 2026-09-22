import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { books } from "../data/books";
import type { Book } from "../data/books";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

interface OrderHistoryItem {
  orderId: string;
  date: string;
  books: Book[];
  total: number;
}

const STORAGE_KEY = "bookstore_orders";

function getSeedOrders(): OrderHistoryItem[] {
  return [
    {
      orderId: "ORD-ABC123",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      books: [books[4], books[7]],
      total: books[4].price + books[7].price,
    },
    {
      orderId: "ORD-DEF456",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      books: [books[0]],
      total: books[0].price,
    },
  ];
}

function loadOrders(): OrderHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  const seed = getSeedOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

// AI-style recommendations based on order history: books not yet ordered
function getRecommendations(orders: OrderHistoryItem[]): Book[] {
  const orderedIds = new Set(orders.flatMap((o) => o.books.map((b) => b.id)));
  return books.filter((b) => !orderedIds.has(b.id)).slice(0, 3);
}

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [orders] = useState<OrderHistoryItem[]>(() => loadOrders());
  const [buyAgainId, setBuyAgainId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">🔒</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Sign in to view your orders</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const recommendations = getRecommendations(orders);

  const handleBuyAgain = (order: OrderHistoryItem) => {
    order.books.forEach((b) => addItem(b));
    setBuyAgainId(order.orderId);
    setTimeout(() => setBuyAgainId(null), 2000);
    setTimeout(() => navigate("/cart"), 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-5 mb-12">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{order.orderId}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Placed on {order.date}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">${order.total.toFixed(2)}</span>
                </div>

                <ul className="space-y-3 mb-4">
                  {order.books.map((book) => (
                    <li key={book.id} className="flex items-center gap-3">
                      <span className="text-3xl">{book.cover}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{book.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 shrink-0">${book.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuyAgain(order)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
                >
                  {buyAgainId === order.orderId ? "✓ Added to cart!" : "Buy Again"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Recommended for You</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Based on your order history</p>
            <div className="space-y-3">
              {recommendations.map((book) => (
                <div key={book.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
                  <span className="text-4xl">{book.cover}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{book.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
                    <p className="text-xs text-yellow-500 mt-0.5">{"★".repeat(Math.round(book.rating))} {book.rating}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">${book.price.toFixed(2)}</p>
                    <button
                      onClick={() => { addItem(book); navigate("/cart"); }}
                      className="mt-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 text-white text-xs font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
