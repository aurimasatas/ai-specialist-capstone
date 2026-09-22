import { Link } from "react-router-dom";
import { books, categories, brands } from "../data/books";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

const HERO_BOOKS = books.slice(0, 3);
const FEATURED = books.slice(0, 4);

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            {isAuthenticated && (
              <p className="text-indigo-200 font-medium mb-2">Welcome back, {user?.name.split(" ")[0]}! 👋</p>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Discover Your Next<br />Favourite Book
            </h1>
            <p className="text-indigo-100 text-lg mb-8">
              Browse thousands of titles across Technology, Fiction, Self-Help, Business and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalogue"
                className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
              >
                Browse Catalogue
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl border border-white/50 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured books preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Books</h2>
          <Link to="/catalogue" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURED.map((book) => (
            <ProductCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/catalogue?category=${encodeURIComponent(cat)}`}
                className="px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands / Publishers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Browse by Publisher</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand}
              to={`/catalogue?brand=${encodeURIComponent(brand)}`}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* Hero mini strip */}
      <section className="bg-indigo-600 dark:bg-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-bold">New arrivals every week</h3>
            <p className="text-indigo-200 text-sm mt-1">Fast delivery · Easy returns · Gift points on every order</p>
          </div>
          <Link
            to="/catalogue"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Top rated */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Top Rated</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...books].sort((a, b) => b.rating - a.rating).slice(0, 3).map((book) => (
            <ProductCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* New arrivals mini */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">New Arrivals</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {HERO_BOOKS.map((book) => (
              <div key={book.id} className="min-w-[200px]">
                <ProductCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
