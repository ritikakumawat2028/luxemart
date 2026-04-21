import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Grid3X3, 
  LayoutList, 
  ChevronDown,
  SlidersHorizontal,
  X,
  Search
} from 'lucide-react';
import { useProductStore, useCartStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';

const categories = [
  { name: 'All', slug: 'all' },
  { name: 'Sunglasses', slug: 'goggles' },
  { name: 'Eyeglasses', slug: 'specs' },
  { name: 'Perfumes', slug: 'perfumes' },
  { name: 'Accessories', slug: 'accessories' },
];

const sortOptions = [
  { name: 'Featured', value: 'featured' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Newest', value: 'newest' },
  { name: 'Best Rated', value: 'rating' },
];

export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { addToCart } = useCartStore();
  const { products } = useProductStore();

  // Update category when URL param changes
  useEffect(() => {
    setSelectedCategory(category || 'all');
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((tag) => p.tags.includes(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - keep original order
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, priceRange, selectedTags]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).slice(0, 10);
  }, []);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setSearchParams({});
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 50000]);
    setSelectedTags([]);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1a1a] mb-4">
              {searchQuery ? `Search: "${searchQuery}"` : 'Shop All Products'}
            </h1>
            <p className="text-[#666]">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm">
            {/* Left: Filter Toggle & Categories */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#f8f8f8] rounded-lg hover:bg-[#e0e0e0] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>

              <div className="hidden md:flex items-center gap-2">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-[#1a1a1a] text-white'
                        : 'bg-[#f8f8f8] text-[#666] hover:bg-[#e0e0e0]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Sort & View */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-[#f8f8f8] rounded-lg text-sm font-medium text-[#666] focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/20 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center bg-[#f8f8f8] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-[#1a1a1a]'
                      : 'text-[#666]'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-[#1a1a1a]'
                      : 'text-[#666]'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'all' || selectedTags.length > 0 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-[#666]">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#c9a96e]/10 text-[#c9a96e] rounded-full text-sm">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#c9a96e]/10 text-[#c9a96e] rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => toggleTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  <Search className="w-3 h-3" />
                  {searchQuery}
                  <button onClick={() => setSearchParams({})}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-[#666] hover:text-[#c9a96e] underline"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside
              className={`fixed md:relative inset-y-0 left-0 z-40 w-80 md:w-64 bg-white md:bg-transparent shadow-xl md:shadow-none transform transition-transform duration-300 ${
                isFilterOpen
                  ? 'translate-x-0'
                  : '-translate-x-full md:translate-x-0'
              }`}
            >
              <div className="h-full overflow-y-auto p-6 md:p-0">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6 md:hidden">
                  <h3 className="font-semibold">Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-semibold text-[#1a1a1a] mb-4">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label
                        key={cat.slug}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.slug}
                          onChange={() => handleCategoryChange(cat.slug)}
                          className="w-4 h-4 accent-[#c9a96e]"
                        />
                        <span className="text-[#666] group-hover:text-[#1a1a1a] transition-colors">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="font-semibold text-[#1a1a1a] mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-[#c9a96e]"
                    />
                    <div className="flex items-center justify-between text-sm text-[#666]">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <h4 className="font-semibold text-[#1a1a1a] mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-[#c9a96e] text-white'
                            : 'bg-[#f8f8f8] text-[#666] hover:bg-[#e0e0e0]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Overlay for mobile */}
            {isFilterOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setIsFilterOpen(false)}
              />
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-[#f0f0f0] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-[#999]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                    No products found
                  </h3>
                  <p className="text-[#666] mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters} className="btn-primary">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
