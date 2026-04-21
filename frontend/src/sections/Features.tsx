import { useEffect, useRef, useState } from 'react';
import { Award, Truck, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every product is carefully selected and tested to meet our high standards of excellence.',
    color: '#c9a96e',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Enjoy complimentary shipping on all orders over ₹10,000. Fast, reliable delivery worldwide.',
    color: '#4caf50',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Shop with confidence using our encrypted, secure payment processing systems.',
    color: '#2196f3',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated customer service team is always here to help you with any questions.',
    color: '#9c27b0',
  },
];

export default function Features() {
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
      { threshold: 0.2 }
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
              Why Choose Us
            </span>
            <h2 
              className={`text-3xl md:text-4xl font-serif font-bold text-[#1a1a1a] transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              The LuxeMart Difference
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 1;
              
              return (
                <div
                  key={feature.title}
                  className={`group relative p-8 bg-[#f8f8f8] rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
                    marginTop: isEven ? '30px' : '0',
                  }}
                >
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon 
                      className="w-8 h-8 transition-colors duration-300"
                      style={{ color: feature.color }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-serif font-semibold text-[#1a1a1a] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#666] leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Accent */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left"
                    style={{ backgroundColor: feature.color }}
                  />

                  {/* Floating Animation on Icon */}
                  <div 
                    className="absolute top-8 right-8 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      backgroundColor: feature.color,
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
