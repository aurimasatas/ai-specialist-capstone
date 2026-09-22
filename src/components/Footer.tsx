export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">📚 BookStore</h3>
            <p className="text-sm leading-relaxed">Your favourite online bookstore. Discover, browse and buy books from all genres.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/catalogue" className="hover:text-white transition-colors">Catalogue</a></li>
              <li><a href="/orders" className="hover:text-white transition-colors">Order History</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span>📧 support@bookstore.com</span></li>
              <li><span>📞 1-800-BOOKSTORE</span></li>
              <li><span>🕐 Mon–Fri, 9am–6pm</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          © {new Date().getFullYear()} BookStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
