import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import type { Product } from '@/store/store';
import { useWishlistStore } from '@/store/store';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, viewMode, onAddToCart }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product._id || product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product._id || product.id);
  };
  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden bg-[#f0f0f0]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.discount && (
              <span className="absolute top-2 left-2 badge-sale">
                -{product.discount}%
              </span>
            )}
            {product.newArrival && !product.discount && (
              <span className="absolute top-2 left-2 badge-new">New</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col">
            <div className="flex-1">
              <p className="text-sm text-[#666] capitalize mb-1">
                {product.category}
              </p>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-serif font-semibold text-lg text-[#1a1a1a] mb-2 group-hover:text-[#c9a96e] transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-[#666] line-clamp-2 mb-3">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-[#c9a96e] fill-[#c9a96e]'
                          : 'text-[#e0e0e0]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#666]">({product.reviewCount})</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-[#1a1a1a]">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#999] line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleWishlist}
                  className={`p-2 border rounded-lg transition-colors ${
                    isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-[#e0e0e0] hover:bg-[#f0f0f0]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="p-2 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f0f0] transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#c9a96e] transition-colors flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.newArrival && <span className="badge-new">New</span>}
          {product.discount && <span className="badge-sale">-{product.discount}%</span>}
          {product.isFeatured && !product.newArrival && !product.discount && (
            <span className="badge-bestseller">Featured</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white hover:bg-[#c9a96e] hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#c9a96e] hover:text-white transition-colors"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#1a1a1a] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#c9a96e] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <p className="text-sm text-[#666] capitalize mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif font-semibold text-[#1a1a1a] mb-2 group-hover:text-[#c9a96e] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-[#c9a96e] fill-[#c9a96e]'
                    : 'text-[#e0e0e0]'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-[#666]">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-[#1a1a1a]">
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#999] line-through">
              ₹{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
