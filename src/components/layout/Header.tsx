import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Gift, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const { totalItems, user, logout } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setCategories(data.slice(0, 3)); 
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'All Gifts', to: '/shop' },
    ...categories.map(cat => ({ label: cat.name, to: `/shop?category=${cat.name}` }))
  ];

  // Fallback if no categories yet
  const activeNavLinks = navLinks.length > 2 ? navLinks : [
    { label: 'Home', to: '/' },
    { label: 'All Gifts', to: '/shop' },
    { label: 'Home Decors', to: '/shop?category=Home Decors' },
    { label: 'Photo Frames', to: '/shop?category=Photo Frames' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold text-foreground">
              GiftHub<span className="text-primary">Insights</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {activeNavLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            {user ? (
              <div className="hidden sm:flex items-center gap-1 bg-secondary rounded-xl p-1 pr-3">
                <Link
                  to={user.isAdmin ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-background transition-colors text-foreground font-medium text-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-1.5 hover:text-sale transition-colors text-muted-foreground"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-4"
              onSubmit={handleSearch}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
                  autoFocus
                />
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {activeNavLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to={user.isAdmin ? "/admin" : "/dashboard"}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-4 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary" /> {user.isAdmin ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                    className="py-3 px-4 rounded-xl text-sale hover:bg-sale/10 transition-colors font-medium flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium"
                >
                  Login / Register
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
