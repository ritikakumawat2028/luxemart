import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck,
  Tag
} from 'lucide-react';
import { useCartStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 10000 ? 0 : 500;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
        <div className="section-padding">
          <div className="container-custom">
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-24 h-24 bg-[#f0f0f0] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-[#999]" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-[#666] mb-8">
                Looks like you haven&apos;t added anything to your cart yet. 
                Browse our collection and find something you love!
              </p>
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
      <div className="section-padding">
        <div className="container-custom">
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-8">
            Shopping Cart ({items.length} items)
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl p-6 flex gap-6 group"
                >
                  {/* Product Image */}
                  <Link 
                    to={`/product/${item.product.id}`}
                    className="w-24 h-24 md:w-32 md:h-32 bg-[#f8f8f8] rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#666] capitalize mb-1">
                          {item.product.category}
                        </p>
                        <Link 
                          to={`/product/${item.product.id}`}
                          className="font-serif font-semibold text-lg text-[#1a1a1a] hover:text-[#c9a96e] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-[#c9a96e] font-semibold mt-1">
                          ₹{item.product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-[#e0e0e0] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 hover:bg-[#f0f0f0] transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-[#f0f0f0] transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold text-[#1a1a1a]">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-6">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20"
                    />
                  </div>
                  <Button variant="outline" className="px-6">
                    Apply
                  </Button>
                </div>

                {/* Summary Details */}
                <div className="space-y-3 mb-6 pb-6 border-b border-[#e0e0e0]">
                  <div className="flex justify-between text-[#666]">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#666]">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-[#666]">
                    <span>Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                      You got free shipping!
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#c9a96e]">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full btn-primary py-4 text-lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Continue Shopping */}
                <Link
                  to="/shop"
                  className="block text-center text-[#666] hover:text-[#c9a96e] transition-colors mt-4"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 p-4 bg-white rounded-xl">
                <div className="flex items-center gap-3 text-sm text-[#666]">
                  <Truck className="w-5 h-5 text-[#c9a96e]" />
                  Free shipping on orders over ₹10,000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
