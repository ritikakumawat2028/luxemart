import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/store';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Products', icon: Package, href: '/admin/products' },
  { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { label: 'Customers', icon: Users, href: '/admin/users' },
  { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentLabel = navItems.find(i => i.href === location.pathname)?.label || 'Admin';

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link to="/admin" className="font-serif text-xl font-bold">
            <span className="text-white">Luxe</span>
            <span className="text-[#c9a96e]">Mart</span>
            <span className="text-white/50 text-sm ml-2 font-sans font-normal">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#c9a96e] text-white shadow-lg shadow-[#c9a96e]/20'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Visit Store */}
        <div className="px-3 pb-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <Store className="w-5 h-5" />
            <span className="font-medium text-sm">Visit Store</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#c9a96e]" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#c9a96e] flex items-center justify-center text-white font-bold">
                {user?.name?.[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-white/50 text-xs truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-white/50 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#e0e0e0] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-serif font-bold text-[#1a1a1a]">{currentLabel}</h1>
              <p className="text-xs text-[#999]">
                Admin Panel &rsaquo; {currentLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-[#666]" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#c9a96e] rounded-full" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">New Order #ORD-1049</span>
                    <span className="text-xs text-[#666]">2 minutes ago</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">Stock Alert: Classic Aviator</span>
                    <span className="text-xs text-[#666]">1 hour ago</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">New Customer registered</span>
                    <span className="text-xs text-[#666]">3 hours ago</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm rounded-lg hover:bg-[#c9a96e] transition-colors"
            >
              <Store className="w-4 h-4" />
              Visit Store
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
