import { useLocation, Link, useNavigate } from "react-router-dom";
import type { CartItem } from "../context/CartContext";

function getCancelDeadline() {
  return new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleString();
}

interface ConfirmationState {
  orderId: string;
  items: CartItem[];
  address: {
    fullName: string;
    line1: string;
    city: string;
    postcode: string;
    country: string;
  };
  paymentMethod: string;
  total: number;
  pointsRedeemed: number;
}

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state as ConfirmationState | null;
  // Compute once at render — stored as a plain string, no side effects after first paint
  const cancelDeadline = getCancelDeadline();

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">🤔</p>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No order found</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const paymentLabel: Record<string, string> = {
    card: "💳 Credit / Debit Card",
    paypal: "🅿️ PayPal",
    apple: "🍎 Apple Pay",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4 text-3xl">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Confirmed!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Thank you for your purchase. Order{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{order.orderId}</span> is placed.
          </p>
        </div>

        {/* Order details */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-5">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Order Details</h2>
          <ul className="space-y-3 mb-4">
            {order.items.map(({ book, quantity }) => (
              <li key={book.id} className="flex items-center gap-3">
                <span className="text-3xl">{book.cover}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{book.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">× {quantity} · Est. delivery: {book.deliveryDate}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">${(book.price * quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-sm font-bold text-gray-900 dark:text-gray-100">
            <span>Total Paid</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          {order.pointsRedeemed > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">🎁 {order.pointsRedeemed} gift points redeemed</p>
          )}
        </div>

        {/* Delivery + payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">📍 Delivery Address</h3>
            <address className="not-italic text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {order.address.fullName}<br />
              {order.address.line1}<br />
              {order.address.city}, {order.address.postcode}<br />
              {order.address.country}
            </address>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">💳 Payment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{paymentLabel[order.paymentMethod] ?? order.paymentMethod}</p>
          </div>
        </div>

        {/* Payment confirmation banner */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <span className="text-green-600 dark:text-green-400 text-xl mt-0.5">✅</span>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200 text-sm">Payment Confirmed</p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Your payment of <strong>${order.total.toFixed(2)}</strong> has been successfully processed. A confirmation email has been sent.
              </p>
            </div>
          </div>
        </div>

        {/* Cancel notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 dark:text-amber-400 text-xl mt-0.5">⏰</span>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Cancel within 48 hours</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                You can cancel this order free of charge before <strong>{cancelDeadline}</strong>.
              </p>
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to cancel order ${order.orderId}?`)) {
                    navigate("/");
                  }
                }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-800/40 border border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 text-xs font-semibold hover:bg-amber-200 dark:hover:bg-amber-800/70 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 py-3 text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex-1 py-3 text-center rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}
