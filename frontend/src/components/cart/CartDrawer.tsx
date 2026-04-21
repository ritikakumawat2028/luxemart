import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore, useUIStore, useAuthStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (user?.role === 'admin') {
      toast.error('Admins cannot place orders.');
      return;
    }
    setCartOpen(false);
    navigate('/checkout');
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-500 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#c9a96e]" />
            <h2 className="text-xl font-serif font-semibold">Your Cart</h2>
            <span className="bg-[#c9a96e] text-white text-sm px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-[#f0f0f0] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-200px)] p-6 text-center">
            <div className="w-24 h-24 bg-[#f8f8f8] rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-[#999]" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2">Your cart is empty</h3>
            <p className="text-[#666] mb-6">Looks like you haven&apos;t added anything yet.</p>
            <Button 
              onClick={() => {
                setCartOpen(false);
                navigate('/shop');
              }}
              className="btn-primary"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="overflow-y-auto h-[calc(100%-280px)] p-6 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.product?._id || item.product?.id || index}
                  className="flex gap-4 p-4 bg-[#f8f8f8] rounded-lg group"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1a1a1a] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-[#666] capitalize">
                      {item.product.category}
                    </p>
                    <p className="text-[#c9a96e] font-semibold mt-1">
                      ₹{item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-white rounded-md border border-[#e0e0e0]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-[#f0f0f0] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-[#f0f0f0] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-[#e0e0e0]">
              {/* Subtotal */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#666]">Subtotal</span>
                <span className="text-xl font-semibold">₹{totalPrice.toFixed(2)}</span>
              </div>

              {/* Shipping Note */}
              <p className="text-sm text-[#666] mb-4">
                Shipping and taxes calculated at checkout.
              </p>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={handleCheckout}
                  className="w-full btn-primary"
                >
                  Proceed to Checkout
                </Button>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/cart');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    View Cart
                  </Button>
                  <Button 
                    onClick={clearCart}
                    variant="outline"
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
