import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || '';


// Product Types
export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'goggles' | 'specs' | 'perfumes' | 'accessories';
  subcategory?: string;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  features?: string[];
  isFeatured?: boolean;
  newArrival?: boolean;
  discount?: number;
  isNew?: boolean;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// User Types
export interface User {
  _id?: string;
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  addresses?: Address[];
  phone?: string;
  createdAt: string;
  wishlist?: string[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Wishlist Types
interface WishlistState {
  wishlist: Product[];
  toggleWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

// Order Types
export interface Order {
  _id?: string;
  id: string;
  userId: string | any;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  placeOrder: (orderData: any) => Promise<Order | null>;
  fetchUserOrders: (userId: string) => Promise<void>;
}

// UI State
interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

// Product State
interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

// Admin State
interface AdminState {
  products: Product[];
  users: User[];
  allOrders: Order[];
  fetchUsers: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, updates: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}


// ─── Cart Store ─────────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => (item.product._id || item.product.id) === (product._id || product.id)
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                (item.product._id || item.product.id) === (product._id || product.id)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
        toast.success(`Added ${product.name} to cart`);
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => (item.product._id || item.product.id) !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            (item.product._id || item.product.id) === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    { name: 'luxemart-cart-v2' }
  )
);


// ─── Product Store (with offline fallback) ──────────────────────────────
export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      fetchProducts: async () => {
        if (get().products.length > 0 && !get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(API_URL + '/api/products');
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          const mappedData = data.map((p: any) => ({ ...p, id: p._id || p.id }));
          set({ products: mappedData, isLoading: false });
        } catch {
          // Fallback: load from local static data
          const { products: localProducts } = await import('@/data/products');
          set({ products: localProducts, isLoading: false, error: null });
        }
      }
    }),
    { name: 'luxemart-products-v3' }
  )
);


// ─── Auth Store (with offline fallback) ─────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: async (email, password) => {
        // Try backend first
        try {
          const res = await fetch(API_URL + '/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (res.ok) {
            const user = await res.json();
            const mappedUser = { ...user, id: user._id || user.id };
            set({
              user: mappedUser,
              isAuthenticated: true,
              isAdmin: mappedUser.role === 'admin',
            });
            return true;
          }
        } catch {
          // Backend unreachable – fall through to offline credentials
        }

        // Offline fallback: Admin
        if (email === 'admin@luxemart.com' && password === 'admin123') {
          set({
            user: {
              id: '1',
              email: 'admin@luxemart.com',
              name: 'Admin User',
              role: 'admin',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
              createdAt: '2024-01-01',
              phone: '+91 9876543210',
              addresses: [{
                id: '1', name: 'Office', street: '123 Admin Street',
                city: 'New Delhi', state: 'Delhi', zipCode: '110001',
                country: 'India', isDefault: true,
              }],
            },
            isAuthenticated: true,
            isAdmin: true,
          });
          return true;
        }

        // Offline fallback: User
        if (email === 'user@luxemart.com' && password === 'user123') {
          set({
            user: {
              id: '2',
              email: 'user@luxemart.com',
              name: 'Ritika Kumawat',
              role: 'user',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
              createdAt: '2024-01-15',
              phone: '+91 9123456789',
              addresses: [{
                id: '2', name: 'Home', street: '456 Main Road',
                city: 'Jaipur', state: 'Rajasthan', zipCode: '302001',
                country: 'India', isDefault: true,
              }],
            },
            isAuthenticated: true,
            isAdmin: false,
          });
          return true;
        }

        return false;
      },

      register: async (name, email, password) => {
        try {
          const res = await fetch(API_URL + '/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          if (res.ok) {
            const user = await res.json();
            const mappedUser = { ...user, id: user._id };
            set({
              user: mappedUser,
              isAuthenticated: true,
              isAdmin: false,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    { name: 'luxemart-auth-v2' }
  )
);


// ─── Wishlist Store ─────────────────────────────────────────────────────
export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  toggleWishlist: async (productId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/users/wishlist/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        await get().fetchWishlist();
        const isIn = get().isInWishlist(productId);
        toast.success(isIn ? 'Added to wishlist' : 'Removed from wishlist');
      }
    } catch {
      toast.error('Wishlist action failed');
    }
  },
  fetchWishlist: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/users/wishlist/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        set({ wishlist: data.map((p: any) => ({ ...p, id: p._id })) });
      }
    } catch {}
  },
  isInWishlist: (productId) => {
    return get().wishlist.some(p => (p._id || p.id) === productId);
  }
}));


// ─── Order Store ────────────────────────────────────────────────────────
export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  placeOrder: async (orderData) => {
    try {
      const res = await fetch(API_URL + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const newOrder = await res.json();
        const mappedOrder = { ...newOrder, id: newOrder._id };
        set((state) => ({ orders: [mappedOrder, ...state.orders] }));
        return mappedOrder;
      }
      return null;
    } catch {
      return null;
    }
  },
  fetchUserOrders: async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        set({ orders: data.map((o: any) => ({ ...o, id: o._id })) });
      }
    } catch {}
  }
}));


// ─── Admin Store (with offline fallback) ────────────────────────────────
export const useAdminStore = create<AdminState>((set) => ({
  products: [],
  users: [],
  allOrders: [],

  fetchUsers: async () => {
    try {
      const res = await fetch(API_URL + '/api/users');
      if (res.ok) {
        const data = await res.json();
        set({ users: data.map((u: any) => ({ ...u, id: u._id })) });
      }
    } catch {}
  },

  fetchAllOrders: async () => {
    try {
      const res = await fetch(API_URL + '/api/orders');
      if (res.ok) {
        const data = await res.json();
        set({ allOrders: data.map((o: any) => ({ ...o, id: o._id })) });
      }
    } catch {}
  },

  addProduct: async (product) => {
    // Try backend first
    try {
      const res = await fetch(API_URL + '/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const saved = await res.json();
        const mapped = { ...saved, id: saved._id || saved.id };
        useProductStore.setState((state) => ({
          products: [mapped, ...state.products]
        }));
        toast.success('Product added successfully!');
        return;
      }
    } catch {
      // Backend unreachable – save locally
    }

    // Offline fallback: create product in local state
    const newProduct: Product = {
      ...product,
      id: 'local_' + Date.now(),
      rating: 4.5,
      reviewCount: 0,
      inStock: (product.stockCount || 0) > 0,
      stockCount: product.stockCount || 0,
      tags: [],
      features: [],
      isFeatured: false,
      isNew: true,
    };
    useProductStore.setState((state) => ({
      products: [newProduct, ...state.products]
    }));
    toast.success('Product added successfully!');
  },

  updateProduct: async (id, updates) => {
    // Try backend first
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        useProductStore.setState((state) => ({
          products: state.products.map((p) =>
            (p._id || p.id) === id ? { ...p, ...updates } : p
          )
        }));
        toast.success('Product updated!');
        return;
      }
    } catch {}

    // Offline fallback
    useProductStore.setState((state) => ({
      products: state.products.map((p) =>
        (p._id || p.id) === id ? { ...p, ...updates } : p
      )
    }));
    toast.success('Product updated!');
  },

  deleteProduct: async (id) => {
    // Try backend first
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        useProductStore.setState((state) => ({
          products: state.products.filter((p) => (p._id || p.id) !== id)
        }));
        toast.success('Product deleted');
        return;
      }
    } catch {}

    // Offline fallback
    useProductStore.setState((state) => ({
      products: state.products.filter((p) => (p._id || p.id) !== id)
    }));
    toast.success('Product deleted');
  },

  updateUserRole: async (userId, role) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) { toast.success('User role updated'); }
    } catch { toast.error('Failed to update role'); }
  },

  deleteUser: async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) { toast.success('User deleted'); }
    } catch { toast.error('Failed to delete user'); }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) { toast.success('Order status updated'); }
    } catch { toast.error('Failed to update order'); }
  }
}));


// ─── UI Store ───────────────────────────────────────────────────────────
export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
