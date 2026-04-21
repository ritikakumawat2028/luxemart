import { useEffect, useRef, useState } from 'react';
import { Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      toast.success('Thank you for subscribing!');
      setEmail('');
    }, 500);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-[#f8f8f8]">
      <div className="section-padding">
        <div className="container-custom">
          <div className="relative bg-[#1a1a1a] rounded-3xl overflow-hidden">
            {/* Diagonal Background */}
            <div 
              className="absolute top-0 right-0 w-1/2 h-full opacity-10"
              style={{
                background: 'linear-gradient(135deg, transparent 40%, #c9a96e 40%)',
              }}
            />

            {/* Decorative Circles */}
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" />
            <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/10 rounded-full" />

            <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-16 items-center">
              {/* Content */}
              <div>
                <span 
                  className={`inline-block text-sm font-semibold tracking-widest text-[#c9a96e] uppercase mb-4 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Newsletter
                </span>
                <h2 
                  className={`text-3xl md:text-4xl font-serif font-bold text-white mb-4 transition-all duration-700 delay-100 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Stay in the Loop
                </h2>
                <p 
                  className={`text-white/70 leading-relaxed transition-all duration-700 delay-200 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Subscribe to receive exclusive offers, early access to new collections, 
                  and style tips delivered straight to your inbox.
                </p>
              </div>

              {/* Form */}
              <div 
                className={`transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                {isSubmitted ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-[#c9a96e] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      You&apos;re Subscribed!
                    </h3>
                    <p className="text-white/70">
                      Thank you for joining our newsletter.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full btn-primary py-4 text-lg"
                    >
                      Subscribe
                      <Send className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-white/50 text-sm text-center">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
