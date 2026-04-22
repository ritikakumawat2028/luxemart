import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1920',
    title: 'Square Frames',
    subtitle: 'Made to Match Your Every Mood and Moment',
    buttonText: 'Shop Now',
    align: 'items-start text-left pl-[10%]',
    bgColor: 'bg-[#f0eade]'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=1920',
    title: 'New Year,\nNew Vision',
    subtitle: 'Prescription glasses from $8,\nwith an extra 10% off blue light protection.',
    buttonText: 'Upgrade Your Vision',
    align: 'items-start text-left pl-[10%]',
    bgColor: 'bg-[#eef2f6]'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1920',
    title: 'Modern Elegance',
    subtitle: 'Discover our latest collection of premium lightweight frames.',
    buttonText: 'Explore Collection',
    align: 'items-center text-center',
    bgColor: 'bg-[#ffffff]'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] overflow-hidden bg-gray-100">
      
      {/* Slider Container */}
      <div 
        className="flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className={`min-w-full h-full relative ${slide.bgColor} flex ${slide.align} pt-24 pb-16`}
          >
            {/* Background Image with slight opacity/blend for text readability if needed */}
            <div className="absolute inset-0 w-full h-full z-0">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover opacity-90 mix-blend-multiply"
              />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 flex flex-col justify-center h-full max-w-2xl px-6 lg:px-0">
              <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-gray-900 leading-[1.1] mb-6 whitespace-pre-line tracking-tight drop-shadow-sm">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-800 mb-10 whitespace-pre-line font-medium drop-shadow-sm max-w-xl">
                {slide.subtitle}
              </p>
              <div>
                <Link to="/shop">
                  <Button className="bg-[#2a2a2a] text-white hover:bg-black px-8 py-6 rounded-full text-sm font-bold tracking-wide uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    {slide.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-lg transition-all z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-lg transition-all z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-gray-900 scale-125' : 'bg-gray-400 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
