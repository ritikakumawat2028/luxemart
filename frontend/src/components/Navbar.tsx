import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  LogOut,
  Settings,
  Package,
  Store,
  Heart,
  ChevronDown,
  Glasses,
  Sun,
  Sparkles,
  Watch
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

const shopCategories = [
  {
    title: 'Eye Glasses',
    description: 'Prescription & fashion frames',
    href: '/shop?category=specs',
    icon: Glasses,
  },
  {
    title: 'Sunglasses',
    description: 'UV protection & style',
    href: '/shop?category=goggles',
    icon: Sun,
  },
  {
    title: 'Perfumes',
    description: 'Premium fragrances',
    href: '/shop?category=perfumes',
    icon: Sparkles,
  },
  {
    title: 'Accessories',
    description: 'Cases, chains & more',
    href: '/shop?category=accessories',
    icon: Watch,
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const shopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { setCartOpen } = useUIStore();
  const navigate = useNavigate();

  const cartItemCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  const handleShopEnter = () => {
    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
    setIsShopOpen(true);
  };

  const handleShopLeave = () => {
    shopTimeoutRef.current = setTimeout(() => {
      setIsShopOpen(false);
    }, 200);
  };

  return (
    <>
      <nav className={`bg-white transition-all duration-300 z-50 border-b border-gray-100 ${isScrolled ? 'fixed top-0 left-0 right-0 shadow-sm' : 'relative'}`}>
        <div className="container-custom mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center text-3xl font-serif font-bold tracking-tight shrink-0">
              <span className="text-black">Luxe</span>
              <span className="text-[#c0996b]">Mart</span>
            </Link>

            {/* Center Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10">
              <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-[#c0996b] transition-colors">
                Home
              </Link>

              {/* Shop with Dropdown */}
              <div
                className="relative"
                ref={shopDropdownRef}
                onMouseEnter={handleShopEnter}
                onMouseLeave={handleShopLeave}
              >
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#c0996b] transition-colors">
                  Shop
                  <ChevronDown className={`w-4 h-4 stroke-[2] transition-transform duration-200 ${isShopOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Panel */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ${
                    isShopOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 min-w-[420px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Shop by Category</h3>
                      <Link
                        to="/shop"
                        onClick={() => setIsShopOpen(false)}
                        className="text-xs font-semibold text-[#c0996b] hover:underline"
                      >
                        View All →
                      </Link>
                    </div>

                    {/* Category Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {shopCategories.map((cat) => (
                        <Link
                          key={cat.title}
                          to={cat.href}
                          onClick={() => setIsShopOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f9f6f2] transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[#f4ece4] flex items-center justify-center group-hover:bg-[#c0996b] transition-colors">
                            <cat.icon className="w-5 h-5 text-[#c0996b] group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-[#c0996b] transition-colors">
                              {cat.title}
                            </p>
                            <p className="text-xs text-gray-400">{cat.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Featured Banner */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link
                        to="/shop?tag=bestseller"
                        onClick={() => setIsShopOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#f9f6f2] to-[#f0e8dc] hover:from-[#f0e8dc] hover:to-[#e8dccf] transition-all"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-800">🔥 Bestsellers</p>
                          <p className="text-xs text-gray-500">Our most loved products</p>
                        </div>
                        <span className="text-xs font-bold text-[#c0996b] bg-white px-3 py-1 rounded-full shadow-sm">
                          Shop Now
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/shop" className="text-sm font-semibold text-gray-700 hover:text-[#c0996b] transition-colors">
                Collections
              </Link>
              <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-[#c0996b] transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm font-semibold text-gray-700 hover:text-[#c0996b] transition-colors">
                Contact
              </Link>
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-5">
              {/* Search Bar */}
              <div className="hidden lg:block relative">
                <form onSubmit={handleSearch}>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-gray-400 stroke-[2]" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-44 xl:w-56 pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#c0996b] focus:w-64 transition-all"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-4">
                {/* Wishlist */}
                <Link to="/wishlist" className="text-gray-700 hover:text-[#c0996b] transition-colors">
                  <Heart className="w-[22px] h-[22px] stroke-[1.5]" />
                </Link>

                {/* Cart */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative text-gray-700 hover:text-[#c0996b] transition-colors"
                >
                  <ShoppingBag className="w-[22px] h-[22px] stroke-[1.5]" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#c0996b] text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* User */}
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center hover:opacity-80 transition-opacity">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-7 h-7 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <User className="w-[22px] h-[22px] text-gray-700 stroke-[1.5] hover:text-[#c0996b] transition-colors" />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border border-[#e0e0e0] rounded-lg shadow-xl min-w-[200px]">
                      <div className="px-3 py-2 border-b border-[#e0e0e0]">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-[#666]">{user?.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="w-4 h-4 mr-2" /> Profile
                      </DropdownMenuItem>
                      {!isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/orders')}>
                          <Package className="w-4 h-4 mr-2" /> My Orders
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                        <Heart className="w-4 h-4 mr-2" /> My Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/shop')}>
                        <Store className="w-4 h-4 mr-2" /> Visit Shop
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Settings className="w-4 h-4 mr-2" /> Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login" className="text-gray-700 hover:text-[#c0996b] transition-colors">
                    <User className="w-[22px] h-[22px] stroke-[1.5]" />
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-[#c0996b] transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
          <div className="p-6 pt-20 h-full overflow-y-auto">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6 relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e0e0e0] focus:outline-none focus:ring-1 focus:ring-[#c0996b] text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-base font-medium text-gray-800 border-b border-gray-50">Home</Link>
              
              {/* Mobile Shop Categories */}
              <div className="border-b border-gray-50">
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-base font-bold text-gray-800">
                  Shop All
                </Link>
                <div className="pl-4 pb-3 space-y-2">
                  {shopCategories.map((cat) => (
                    <Link
                      key={cat.title}
                      to={cat.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-[#c0996b]"
                    >
                      <cat.icon className="w-4 h-4" />
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-base font-medium text-gray-800 border-b border-gray-50">Collections</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-base font-medium text-gray-800 border-b border-gray-50">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-base font-medium text-gray-800 border-b border-gray-50">Contact</Link>
            </div>

            {/* Mobile Auth */}
            {!isAuthenticated && (
              <div className="mt-8 pt-6 border-t border-[#e0e0e0] space-y-3">
                <Button 
                  onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  className="w-full bg-white text-black border border-black hover:bg-gray-100"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                  className="w-full bg-[#c0996b] text-white hover:bg-[#a88256]"
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
