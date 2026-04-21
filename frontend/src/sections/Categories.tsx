import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: 'Sunglasses',
    slug: 'goggles',
    description: 'Protect your eyes in style',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1000&fit=crop',
    size: 'large',
    itemCount: 24,
  },
  {
    name: 'Eyeglasses',
    slug: 'specs',
    description: 'Clear vision, clear style',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&h=600&fit=crop',
    size: 'medium',
    itemCount: 18,
  },
  {
    name: 'Perfumes',
    slug: 'perfumes',
    description: 'Scents that define you',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop',
    size: 'medium',
    itemCount: 32,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Complete your look',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop',
    size: 'small',
    itemCount: 15,
  },
  {
    name: 'Gift Sets',
    slug: 'gifts',
    description: 'Perfect presents',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&h=600&fit=crop',
    size: 'small',
    itemCount: 12,
  },
];

export default function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="section-padding">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span 
              className={`inline-block text-sm font-semibold tracking-widest text-[#c9a96e] uppercase mb-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Browse by Category
            </span>
            <h2 
              className={`text-3xl md:text-4xl font-serif font-bold text-[#1a1a1a] transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Shop by Collection
            </h2>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large Card - Sunglasses */}
            <div 
              className={`md:row-span-2 group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '0ms' }}
            >
              <Link to={`/shop/${categories[0].slug}`}>
                <div className="aspect-[3/4] md:aspect-auto md:h-full">
                  <img
                    src={categories[0].image}
                    alt={categories[0].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-white/70 text-sm mb-2">
                    {categories[0].itemCount} Products
                  </p>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                    {categories[0].name}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {categories[0].description}
                  </p>
                  <div className="flex items-center gap-2 text-[#c9a96e] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Medium Card - Eyeglasses */}
            <div 
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <Link to={`/shop/${categories[1].slug}`}>
                <div className="aspect-[4/3]">
                  <img
                    src={categories[1].image}
                    alt={categories[1].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/70 text-sm mb-1">
                    {categories[1].itemCount} Products
                  </p>
                  <h3 className="text-xl font-serif font-bold text-white mb-1">
                    {categories[1].name}
                  </h3>
                  <div className="flex items-center gap-2 text-[#c9a96e] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Medium Card - Perfumes */}
            <div 
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <Link to={`/shop/${categories[2].slug}`}>
                <div className="aspect-[4/3]">
                  <img
                    src={categories[2].image}
                    alt={categories[2].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/70 text-sm mb-1">
                    {categories[2].itemCount} Products
                  </p>
                  <h3 className="text-xl font-serif font-bold text-white mb-1">
                    {categories[2].name}
                  </h3>
                  <div className="flex items-center gap-2 text-[#c9a96e] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Small Cards Row */}
            <div 
              className={`md:col-span-2 grid grid-cols-2 gap-5 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              {categories.slice(3).map((category) => (
                <div 
                  key={category.slug}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer"
                >
                  <Link to={`/shop/${category.slug}`}>
                    <div className="aspect-square">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <p className="text-white/70 text-xs mb-1">
                        {category.itemCount} Products
                      </p>
                      <h3 className="text-lg font-serif font-bold text-white">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[#c9a96e] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                        <span>Explore</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
