import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

type Step = "address" | "payment" | "giftpoints";

interface Address {
  fullName: string;
  line1: string;
  city: string;
  postcode: string;
  country: string;
}

interface AddressErrors {
  fullName?: string;
  line1?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

const POINT_VALUE = 0.01; // $0.01 per gift point

export default function CheckoutPage() {
  const { state, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address>({
    fullName: user?.name ?? "",
    line1: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
  });
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardErrors, setCardErrors] = useState<{ cardNumber?: string; cardExpiry?: string; cardCvc?: string }>({});
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [loading, setLoading] = useState(false);

  const giftPoints = user?.giftPoints ?? 0;
  const pointsDiscount = redeemPoints ? Math.min(giftPoints * POINT_VALUE, totalPrice) : 0;
  const finalTotal = totalPrice - pointsDiscount;

  const validateAddress = (): boolean => {
    const errs: AddressErrors = {};
    if (!address.fullName.trim()) errs.fullName = "Full name is required.";
    if (!address.line1.trim()) errs.line1 = "Address line is required.";
    if (!address.city.trim()) errs.city = "City is required.";
    if (!address.postcode.trim()) errs.postcode = "Postcode is required.";
    if (!address.country.trim()) errs.country = "Country is required.";
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCard = (): boolean => {
    if (paymentMethod !== "card") return true;
    const errs: typeof cardErrors = {};
    if (cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number.";
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errs.cardExpiry = "Format: MM/YY";
    if (cardCvc.length < 3) errs.cardCvc = "Enter a valid CVV.";
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateCard()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const orderId = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    clearCart();
    navigate("/confirmation", {
      state: {
        orderId,
        items: state.items,
        address,
        paymentMethod,
        total: finalTotal,
        pointsRedeemed: redeemPoints ? giftPoints : 0,
      },
    });
  };

  const formatCardNumber = (v: string) => {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${err ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center gap-3 mb-8">
          {(["address", "payment", "giftpoints"] as Step[]).map((s, i) => {
            const labels = ["Address", "Payment", "Gift Points"];
            const done = (step === "payment" && s === "address") || (step === "giftpoints" && (s === "address" || s === "payment"));
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />}
                <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${active ? "text-indigo-600 dark:text-indigo-400" : done ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-indigo-600 text-white dark:bg-indigo-500" : done ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}>
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:block">{labels[i]}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="md:col-span-2">
            {/* Step 1: Address */}
            {step === "address" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-5">Delivery Address</h2>
                <div className="space-y-4">
                  {(["fullName", "line1", "city", "postcode", "country"] as (keyof Address)[]).map((field) => {
                    const labels: Record<keyof Address, string> = {
                      fullName: "Full Name",
                      line1: "Address Line",
                      city: "City",
                      postcode: "Postcode / ZIP",
                      country: "Country",
                    };
                    return (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {labels[field]}
                        </label>
                        <input
                          type="text"
                          value={address[field]}
                          onChange={(e) => setAddress((a) => ({ ...a, [field]: e.target.value }))}
                          className={inputCls(addressErrors[field])}
                        />
                        {addressErrors[field] && (
                          <p className="text-red-500 dark:text-red-400 text-xs mt-1">{addressErrors[field]}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => { if (validateAddress()) setStep("payment"); }}
                  className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-colors"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-5">Payment Method</h2>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {(["card", "paypal", "apple"] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-colors ${paymentMethod === method ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"}`}
                    >
                      {method === "card" ? "💳 Card" : method === "paypal" ? "🅿️ PayPal" : "🍎 Apple Pay"}
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className={inputCls(cardErrors.cardNumber)}
                        maxLength={19}
                        aria-label="Card number"
                      />
                      {cardErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{cardErrors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="12/27"
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                            if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                            setCardExpiry(v);
                          }}
                          className={inputCls(cardErrors.cardExpiry)}
                          maxLength={5}
                          aria-label="Card expiry"
                        />
                        {cardErrors.cardExpiry && <p className="text-red-500 text-xs mt-1">{cardErrors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className={inputCls(cardErrors.cardCvc)}
                          maxLength={4}
                          aria-label="CVV"
                        />
                        {cardErrors.cardCvc && <p className="text-red-500 text-xs mt-1">{cardErrors.cardCvc}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== "card" && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                    You will be redirected to {paymentMethod === "paypal" ? "PayPal" : "Apple Pay"} to complete your payment.
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep("address")}
                    className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => { if (validateCard()) setStep("giftpoints"); }}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Gift Points */}
            {step === "giftpoints" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-5">Redeem Gift Points</h2>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Your Gift Points</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {giftPoints} points = <span className="font-semibold text-amber-600 dark:text-amber-400">${(giftPoints * POINT_VALUE).toFixed(2)}</span> discount
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={redeemPoints}
                      onChange={(e) => setRedeemPoints(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600"
                      aria-label="Redeem gift points"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Redeem {giftPoints} points for ${(giftPoints * POINT_VALUE).toFixed(2)} off
                    </span>
                  </label>
                </div>

                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
                  </div>
                  {redeemPoints && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Gift Points discount</span><span>-${pointsDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base">
                    <span>Final Total</span><span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Processing…
                      </>
                    ) : "Place Order 🎉"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sticky top-20">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm">Order Summary</h3>
              <ul className="space-y-3 mb-4">
                {state.items.map(({ book, quantity }) => (
                  <li key={book.id} className="flex gap-3 items-center">
                    <span className="text-2xl">{book.cover}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{book.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">× {quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 shrink-0">${(book.price * quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 text-sm font-bold flex justify-between text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
