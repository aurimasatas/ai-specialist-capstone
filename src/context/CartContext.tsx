import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Book } from "../data/books";

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; book: Book }
  | { type: "REMOVE_ITEM"; bookId: string }
  | { type: "UPDATE_QTY"; bookId: string; quantity: number }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.book.id === action.book.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.book.id === action.book.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { book: action.book, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.book.id !== action.bookId) };
    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.book.id !== action.bookId) };
      }
      return {
        items: state.items.map((i) =>
          i.book.id === action.bookId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "bookstore_cart";

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { items: [] };
}

interface CartContextValue {
  state: CartState;
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQty: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (book: Book) => dispatch({ type: "ADD_ITEM", book });
  const removeItem = (bookId: string) => dispatch({ type: "REMOVE_ITEM", bookId });
  const updateQty = (bookId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", bookId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.book.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
