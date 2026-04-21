import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';

export default function Wishlist() {
  const { wishlist, fetchWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart className="w-12 h-12 text-[#999]" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4">Your Wishlist is Empty</h2>
          <p className="text-[#666] mb-8 max-w-md mx-auto">
            Save your favorite luxury items here to keep track of what you love. 
            Start exploring our collection and tap the heart icon!
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            <ShoppingBag className="w-5 h-5" /> Explore Boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
      <div className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">My Wishlist</h1>
              <p className="text-[#666] mt-2">You have {wishlist.length} items in your wishlist</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard 
                  product={product} 
                  viewMode="grid"
                  onAddToCart={() => addToCart(product)}
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
