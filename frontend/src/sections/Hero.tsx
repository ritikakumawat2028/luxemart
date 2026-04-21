import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !contentRef.current || !imageRef.current) return;
      
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const progress = Math.min(scrollY / heroHeight, 1);

      // Parallax effect for image
      imageRef.current.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + progress * 0.1})`;
      
      // Fade out content
      contentRef.current.style.opacity = `${1 - progress}`;
      contentRef.current.style.transform = `translateY(${-scrollY * 0.2}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const elements = content.querySelectorAll('.animate-item');
    elements.forEach((el, index) => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.8s var(--ease-expo-out)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 200 + index * 150);
    });
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-[#f8f8f8]"
    >
      {/* Background Image */}
      <div 
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
          alt="Luxury lifestyle products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      </div>

      {/* Diagonal Accent */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full opacity-10"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, var(--gold) 50%)',
        }}
      />

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 min-h-screen flex items-center section-padding"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="container-custom">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="animate-item mb-4">
              <span className="inline-block text-sm font-semibold tracking-widest text-[#c9a96e] uppercase">
                New Collection 2024
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-item text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#1a1a1a] leading-tight mb-6">
              Elevate Your{' '}
              <span className="text-gradient">Style</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-item text-lg md:text-xl text-[#666] leading-relaxed mb-8 max-w-xl">
              Discover premium eyewear, fragrances, and accessories curated for the modern connoisseur. Quality meets elegance in every piece.
            </p>

            {/* CTAs */}
            <div className="animate-item flex flex-wrap gap-4 mb-8">
              <Link to="/shop">
                <Button className="btn-primary text-lg px-8 py-4">
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button className="btn-secondary text-lg px-8 py-4">
                  Explore Collections
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="animate-item flex items-center gap-3 text-[#666]">
              <div className="w-10 h-10 bg-[#c9a96e]/10 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#c9a96e]" />
              </div>
              <span className="text-sm">
                Free Shipping on Orders Over{' '}
                <span className="font-semibold text-[#1a1a1a]">₹10,000</span>
              </span>
            </div>

            {/* Stats */}
            <div className="animate-item flex gap-8 mt-12 pt-8 border-t border-[#e0e0e0]">
              <div>
                <p className="text-3xl font-serif font-bold text-[#1a1a1a]">500+</p>
                <p className="text-sm text-[#666]">Products</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-[#1a1a1a]">10K+</p>
                <p className="text-sm text-[#666]">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-[#1a1a1a]">4.9</p>
                <p className="text-sm text-[#666]">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute bottom-20 right-20 w-32 h-32 border border-[#c9a96e]/20 rounded-full animate-float hidden lg:block" />
      <div className="absolute top-40 right-40 w-4 h-4 bg-[#c9a96e]/30 rounded-full animate-pulse-slow hidden lg:block" />
      <div className="absolute bottom-40 right-60 w-2 h-2 bg-[#c9a96e]/50 rounded-full animate-float hidden lg:block" style={{ animationDelay: '2s' }} />
    </section>
  );
}
