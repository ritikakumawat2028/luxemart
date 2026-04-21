import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || '';


// Product Types
export interface Product {
  _id?: string;
  id: string; // We'll use id in frontend, map from _id if needed
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
  wishlist?: string[]; // IDs of products
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

// Cart Store
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

// Product Store
export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL + '/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // Map _id to id for consistency if needed, but we'll try to support both
      const mappedData = data.map((p: any) => ({ ...p, id: p._id }));
      set({ products: mappedData, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: async (email, password) => {
        try {
          const res = await fetch(API_URL + '/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (res.ok) {
            const user = await res.json();
            const mappedUser = { ...user, id: user._id };
            set({
              user: mappedUser,
              isAuthenticated: true,
              isAdmin: mappedUser.role === 'admin',
            });
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
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
        } catch (e) {
          return false;
        }
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
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

// Wishlist Store
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
    } catch (e) {
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
    } catch (e) {}
  },
  isInWishlist: (productId) => {
    return get().wishlist.some(p => (p._id || p.id) === productId);
  }
}));

// Order Store
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
    } catch (e) {
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
    } catch (e) {}
  }
}));

// Admin Store
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
    } catch (e) {}
  },
  fetchAllOrders: async () => {
    try {
      const res = await fetch(API_URL + '/api/orders');
      if (res.ok) {
        const data = await res.json();
        set({ allOrders: data.map((o: any) => ({ ...o, id: o._id })) });
      }
    } catch (e) {}
  },
  addProduct: async (product) => {
    try {
      const res = await fetch(API_URL + '/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        toast.success('Product added');
      }
    } catch (e) {
      toast.error('Failed to add product');
    }
  },
  updateProduct: async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success('Product updated');
      }
    } catch (e) {
      toast.error('Failed to update product');
    }
  },
  deleteProduct: async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
      }
    } catch (e) {
      toast.error('Failed to delete product');
    }
  },
  updateUserRole: async (userId, role) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        toast.success('User role updated');
      }
    } catch (e) {
      toast.error('Failed to update role');
    }
  },
  deleteUser: async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted');
      }
    } catch (e) {
      toast.error('Failed to delete user');
    }
  },
  updateOrderStatus: async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success('Order status updated');
      }
    } catch (e) {
      toast.error('Failed to update order');
    }
  }
}));

// UI Store
export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
