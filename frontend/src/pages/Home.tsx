import Hero from '@/sections/Hero';
import Features from '@/sections/Features';
import FeaturedProducts from '@/sections/FeaturedProducts';
import Categories from '@/sections/Categories';
import Testimonials from '@/sections/Testimonials';
import Newsletter from '@/sections/Newsletter';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
