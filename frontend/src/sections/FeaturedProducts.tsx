import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Eye } from 'lucide-react';
import { useCartStore, useProductStore } from '@/store/store';
import { toast } from 'sonner';

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCartStore();
  const { products } = useProductStore();
  const featuredProducts = products.filter((p) => p.isFeatured);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#f8f8f8]">
      <div className="section-padding">
        <div className="container-custom">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span 
                className={`inline-block text-sm font-semibold tracking-widest text-[#c9a96e] uppercase mb-4 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Curated Selection
              </span>
              <h2 
                className={`text-3xl md:text-4xl font-serif font-bold text-[#1a1a1a] transition-all duration-700 delay-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Featured Products
              </h2>
              <p 
                className={`text-[#666] mt-3 max-w-md transition-all duration-700 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Handpicked favorites from our collection, chosen for their exceptional quality and style.
              </p>
            </div>
            <Link 
              to="/shop"
              className={`mt-6 md:mt-0 inline-flex items-center gap-2 text-[#1a1a1a] font-medium hover:text-[#c9a96e] transition-all duration-500 delay-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <div
                key={product.id}
                className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: isVisible ? `${200 + index * 100}ms` : '0ms' }}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.newArrival && (
                      <span className="badge-new">New</span>
                    )}
                    {product.discount && (
                      <span className="badge-sale">-{product.discount}%</span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#c9a96e] transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="w-12 bg-white text-[#1a1a1a] rounded-lg flex items-center justify-center hover:bg-[#f0f0f0] transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <p className="text-sm text-[#666] capitalize mb-1">
                    {product.category}
                  </p>
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
                    <span className="text-sm text-[#666]">
                      ({product.reviewCount})
                    </span>
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
