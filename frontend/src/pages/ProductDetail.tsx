import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Check,
  ChevronRight
} from 'lucide-react';
import { useCartStore, useProductStore, useAuthStore, useWishlistStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductStore();
  const { user } = useAuthStore();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCartStore();
  
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product?._id || product?.id || '');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
          <p className="text-[#666] mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/shop" className="btn-primary inline-block">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Get related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (user?.role === 'admin') {
      toast.error('Admins cannot add items to cart. Please use a customer account.');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    if (product) {
      toggleWishlist(product._id || product.id);
    }
  };

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
      <div className="section-padding">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-[#666] mb-8">
            <Link to="/" className="hover:text-[#c9a96e] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-[#c9a96e] transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              to={`/shop/${product.category}`} 
              className="hover:text-[#c9a96e] transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a1a1a]">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount && (
                  <span className="absolute top-4 left-4 badge-sale text-lg">
                    -{product.discount}% OFF
                  </span>
                )}
                {product.newArrival && !product.discount && (
                  <span className="badge-new">New Arrival</span>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? 'border-[#c9a96e]'
                          : 'border-transparent hover:border-[#e0e0e0]'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category & Rating */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-[#c9a96e] font-medium uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
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
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1a1a] mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-[#1a1a1a]">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-[#999] line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discount && (
                  <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Save ${(product.originalPrice! - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-[#666] leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Features */}
              {product.features && (
                <div className="mb-8">
                  <h3 className="font-semibold text-[#1a1a1a] mb-3">Key Features</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#666]">
                        <Check className="w-4 h-4 text-[#c9a96e]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#f0f0f0] text-[#666] rounded-full text-sm capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Quantity Selector */}
                <div className="flex items-center border border-[#e0e0e0] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-[#f0f0f0] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-[#f0f0f0] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary py-4 text-lg"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>

                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className={`p-4 border rounded-lg transition-colors ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-[#e0e0e0] hover:bg-[#f0f0f0]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Share */}
                <button className="p-4 border border-[#e0e0e0] rounded-lg hover:bg-[#f0f0f0] transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl">
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-6 h-6 text-[#c9a96e] mb-2" />
                  <span className="text-xs text-[#666]">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-[#c9a96e] mb-2" />
                  <span className="text-xs text-[#666]">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw className="w-6 h-6 text-[#c9a96e] mb-2" />
                  <span className="text-xs text-[#666]">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent mb-6">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#c9a96e] data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#c9a96e] data-[state=active]:bg-transparent"
              >
                Shipping & Returns
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#c9a96e] data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="bg-white rounded-xl p-8">
              <h3 className="text-xl font-serif font-bold mb-4">Product Description</h3>
              <p className="text-[#666] leading-relaxed">
                {product.description}
              </p>
              {product.features && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-[#666]">
                        <div className="w-6 h-6 bg-[#c9a96e]/10 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#c9a96e]" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="shipping" className="bg-white rounded-xl p-8">
              <h3 className="text-xl font-serif font-bold mb-4">Shipping Information</h3>
              <div className="space-y-4 text-[#666]">
                <p>We offer free standard shipping on all orders over $100. Orders are typically processed within 1-2 business days.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#c9a96e]" />
                    Standard Shipping: 5-7 business days (Free over $100)
                  </li>
                  <li className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#c9a96e]" />
                    Express Shipping: 2-3 business days ($15)
                  </li>
                  <li className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#c9a96e]" />
                    Next Day Shipping: 1 business day ($25)
                  </li>
                </ul>
              </div>
              
              <h3 className="text-xl font-serif font-bold mb-4 mt-8">Returns Policy</h3>
              <p className="text-[#666]">
                We accept returns within 30 days of purchase. Items must be in original condition 
                with all tags attached. Refunds will be processed within 5-7 business days after 
                we receive the returned item.
              </p>
            </TabsContent>
            
            <TabsContent value="reviews" className="bg-white rounded-xl p-8">
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-8 h-8 text-[#c9a96e] fill-[#c9a96e]" />
                  <span className="text-3xl font-bold">{product.rating}</span>
                </div>
                <p className="text-[#666]">Based on {product.reviewCount} reviews</p>
                <Button className="mt-6 btn-primary">
                  Write a Review
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    viewMode="grid"
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
