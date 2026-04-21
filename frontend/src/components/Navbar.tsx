import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Store,
  Heart
} from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const categories = [
  { name: 'Sunglasses', slug: 'goggles' },
  { name: 'Eyeglasses', slug: 'specs' },
  { name: 'Perfumes', slug: 'perfumes' },
  { name: 'Accessories', slug: 'accessories' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { setCartOpen, setSearchOpen } = useUIStore();
  const navigate = useNavigate();

  const cartItemCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-effect shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className={`font-serif text-2xl md:text-3xl font-bold transition-all duration-300 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}
            >
              <span className="text-[#1a1a1a]">Luxe</span>
              <span className="text-[#c9a96e]">Mart</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link 
                to="/" 
                className="text-[#333] hover:text-[#c9a96e] transition-colors underline-animation font-medium"
              >
                Home
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-[#333] hover:text-[#c9a96e] transition-colors font-medium">
                  Shop <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-[#e0e0e0] rounded-lg shadow-xl min-w-[200px]">
                  <DropdownMenuItem onClick={() => navigate('/shop')}>
                    All Products
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories.map((cat) => (
                    <DropdownMenuItem 
                      key={cat.slug} 
                      onClick={() => navigate(`/shop/${cat.slug}`)}
                    >
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link 
                to="/shop" 
                className="text-[#333] hover:text-[#c9a96e] transition-colors underline-animation font-medium"
              >
                Collections
              </Link>
              <Link 
                to="/about" 
                className="text-[#333] hover:text-[#c9a96e] transition-colors underline-animation font-medium"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-[#333] hover:text-[#c9a96e] transition-colors underline-animation font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-5">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-full bg-white/80 border border-[#e0e0e0] focus:border-[#c9a96e] focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/20 w-40 lg:w-56 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                </div>
              </form>

              <button 
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 hover:bg-[#f0f0f0] rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate('/wishlist')}
                className="relative p-2 hover:bg-[#f0f0f0] rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-[#f0f0f0] rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c9a96e] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-scale-in">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-[#f0f0f0] rounded-full transition-colors">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border border-[#e0e0e0] rounded-lg shadow-xl min-w-[200px]">
                    <div className="px-3 py-2 border-b border-[#e0e0e0]">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-[#666]">{user?.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    {!isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/orders')}>
                        <Package className="w-4 h-4 mr-2" />
                        My Orders
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                      <Heart className="w-4 h-4 mr-2" />
                      My Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/shop')}>
                      <Store className="w-4 h-4 mr-2" />
                      Visit Shop
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  to="/login"
                  className="p-2 hover:bg-[#f0f0f0] rounded-full transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-[#f0f0f0] rounded-full transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-80 max-w-full h-full bg-white shadow-2xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e0e0e0] focus:border-[#c9a96e] focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/20"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              </div>
            </form>

            {/* Mobile Nav Links */}
            <div className="space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-[#333] hover:text-[#c9a96e] transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-[#333] hover:text-[#c9a96e] transition-colors"
              >
                Shop All
              </Link>
              
              <div className="pl-4 space-y-2 border-l-2 border-[#e0e0e0]">
                {categories.map((cat) => (
                  <Link 
                    key={cat.slug}
                    to={`/shop/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-[#666] hover:text-[#c9a96e] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-[#333] hover:text-[#c9a96e] transition-colors"
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-[#333] hover:text-[#c9a96e] transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Auth */}
            {!isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-[#e0e0e0] space-y-3">
                <Button 
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full btn-secondary"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
