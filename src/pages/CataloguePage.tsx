import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { books, categories, brands } from "../data/books";
import ProductCard from "../components/ProductCard";

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const activeCategory = searchParams.get("category") || "";
  const activeBrand = searchParams.get("brand") || "";

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchCat = !activeCategory || b.category === activeCategory;
      const matchBrand = !activeBrand || b.brand === activeBrand;
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchBrand && matchSearch;
    });
  }, [activeCategory, activeBrand, search]);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Book Catalogue</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{filtered.length} book{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Search</label>
              <input
                id="search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title or author…"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setFilter("category", "")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!activeCategory ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setFilter("category", cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${activeCategory === cat ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Publisher</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setFilter("brand", "")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!activeBrand ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    All Publishers
                  </button>
                </li>
                {brands.map((brand) => (
                  <li key={brand}>
                    <button
                      onClick={() => setFilter("brand", brand)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${activeBrand === brand ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    >
                      {brand}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active filters */}
            {(activeCategory || activeBrand) && (
              <button
                onClick={() => { setSearchParams({}); }}
                className="text-sm text-red-500 dark:text-red-400 hover:underline"
              >
                ✕ Clear filters
              </button>
            )}
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
              <span>/</span>
              <span className="text-gray-700 dark:text-gray-200">Catalogue</span>
              {activeCategory && (
                <>
                  <span>/</span>
                  <span className="text-gray-700 dark:text-gray-200">{activeCategory}</span>
                </>
              )}
              {activeBrand && (
                <>
                  <span>/</span>
                  <span className="text-gray-700 dark:text-gray-200">{activeBrand}</span>
                </>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-lg font-medium">No books found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((book) => (
                  <ProductCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
