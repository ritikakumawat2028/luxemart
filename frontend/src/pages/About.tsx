import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Heart, Globe, Shield, Zap, Users, ArrowRight, Star } from 'lucide-react';

const stats = [
  { value: 500, suffix: '+', label: 'Premium Products' },
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 15, suffix: '+', label: 'Years of Excellence' },
  { value: 4.9, suffix: '', label: 'Average Rating' },
];

const values = [
  { icon: Award, title: 'Premium Quality', desc: 'Every product is rigorously tested to meet our exacting standards of craftsmanship.' },
  { icon: Heart, title: 'Customer First', desc: 'Our customers are the heart of everything we do. We listen, adapt, and constantly improve.' },
  { icon: Globe, title: 'Globally Sourced', desc: 'We partner with the finest artisans and brands from around the world.' },
  { icon: Shield, title: 'Authenticity Guaranteed', desc: '100% authentic products, always. We stand behind every item with our promise.' },
  { icon: Zap, title: 'Innovation', desc: 'Staying ahead of trends while honoring timeless elegance — the LuxeMart way.' },
  { icon: Users, title: 'Community', desc: 'A growing community of style-conscious individuals who share a passion for the finer things.' },
];

const team = [
  { name: 'Alexandra Chen', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', quote: '"Luxury is not about price, it\'s about experience."' },
  { name: 'Marcus Williams', role: 'Head of Curation', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', quote: '"Every product tells a story worth wearing."' },
  { name: 'Sofia Laurent', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', quote: '"Design is intelligence made visible."' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const steps = 60;
        const increment = target / steps;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 1800 / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{target % 1 !== 0 ? count.toFixed(1) : count.toLocaleString()}{suffix}</span>;
}

export default function About() {
  const [vis, setVis] = useState<Set<string>>(new Set());
  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    document.querySelectorAll('[data-sec]').forEach((el) => {
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(p => new Set([...p, el.getAttribute('data-sec')!])); }, { threshold: 0.15 });
      o.observe(el); obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=900&fit=crop" alt="About" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent" />
        </div>
        <div className="relative z-10 section-padding container-custom pt-28 pb-16">
          <div className="max-w-2xl">
            <span className="inline-block text-[#c9a96e] text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">Our Story</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-6 animate-slide-up">
              Crafting Luxury,<br /><span className="text-gradient">One Story at a Time</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8" style={{ animationDelay: '200ms' }}>
              Founded in 2009, LuxeMart was born from a simple belief: everyone deserves access to beautifully crafted premium products.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-[#c9a96e] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#b89a5e] transition-all duration-300 hover:scale-105">
              Explore Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 right-20 w-32 h-32 border border-[#c9a96e]/20 rounded-full animate-float hidden lg:block" />
      </section>

      {/* Stats */}
      <section className="py-16 bg-white" data-sec="stats">
        <div className="section-padding container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`text-center transition-all duration-700 ${vis.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mb-2"><AnimatedCounter target={stat.value} suffix={stat.suffix} /></p>
                <p className="text-[#666] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#f8f8f8]" data-sec="mission">
        <div className="section-padding container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-700 ${vis.has('mission') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <span className="text-[#c9a96e] text-sm font-semibold tracking-widest uppercase">Our Mission</span>
              <h2 className="text-4xl font-serif font-bold text-[#1a1a1a] mt-3 mb-6">Elevating Everyday Moments</h2>
              <p className="text-[#666] leading-relaxed mb-4">At LuxeMart, we believe that the objects you surround yourself with should bring joy, inspire confidence, and stand the test of time. Our mission is to make premium lifestyle accessible — without compromise.</p>
              <p className="text-[#666] leading-relaxed mb-8">We work directly with artisans, designers, and heritage brands to bring you an edit that is both relevant and timeless. Each product has been personally selected by our team.</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {team.map(m => <img key={m.name} src={m.image} alt={m.name} className="w-10 h-10 rounded-full border-2 border-white object-cover" />)}
                </div>
                <div>
                  <div className="flex items-center gap-1">{[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-[#c9a96e] fill-[#c9a96e]" />)}</div>
                  <p className="text-sm text-[#666]">Loved by 10,000+ customers</p>
                </div>
              </div>
            </div>
            <div className={`relative transition-all duration-700 ${vis.has('mission') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
              <div className="relative rounded-2xl overflow-hidden aspect-square">
                <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=800&fit=crop" alt="Mission" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#c9a96e] text-white p-6 rounded-2xl shadow-xl">
                <p className="text-3xl font-serif font-bold">15+</p>
                <p className="text-sm opacity-90">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white" data-sec="values">
        <div className="section-padding container-custom">
          <div className="text-center mb-16">
            <span className="text-[#c9a96e] text-sm font-semibold tracking-widest uppercase">What We Stand For</span>
            <h2 className="text-4xl font-serif font-bold text-[#1a1a1a] mt-3">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className={`group p-8 bg-[#f8f8f8] rounded-2xl hover:bg-[#1a1a1a] transition-all duration-500 ${vis.has('values') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 bg-[#c9a96e]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#c9a96e]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#c9a96e]" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#1a1a1a] group-hover:text-white mb-3 transition-colors">{val.title}</h3>
                  <p className="text-[#666] group-hover:text-white/70 text-sm leading-relaxed transition-colors">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#f8f8f8]" data-sec="team">
        <div className="section-padding container-custom">
          <div className="text-center mb-16">
            <span className="text-[#c9a96e] text-sm font-semibold tracking-widest uppercase">The People</span>
            <h2 className="text-4xl font-serif font-bold text-[#1a1a1a] mt-3">Meet Our Team</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={member.name} className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${vis.has('team') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="aspect-square overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-[#1a1a1a] text-lg">{member.name}</h3>
                  <p className="text-[#c9a96e] text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-[#666] text-sm italic">{member.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="section-padding container-custom text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-4">Ready to Experience <span className="text-gradient">LuxeMart</span>?</h2>
          <p className="text-white/60 mb-8 text-lg max-w-xl mx-auto">Join thousands of satisfied customers who have elevated their lifestyle.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="btn-primary">Shop Now <ArrowRight className="inline w-4 h-4 ml-2" /></Link>
            <Link to="/contact" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-[#1a1a1a]">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
