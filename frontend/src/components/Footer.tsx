import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Sunglasses', href: '/shop/goggles' },
    { name: 'Eyeglasses', href: '/shop/specs' },
    { name: 'Perfumes', href: '/shop/perfumes' },
    { name: 'Accessories', href: '/shop/accessories' },
  ],
  company: [
    { name: 'About Us', href: '/' },
    { name: 'Contact', href: '/' },
    { name: 'Careers', href: '/' },
    { name: 'Press', href: '/' },
  ],
  support: [
    { name: 'FAQ', href: '/' },
    { name: 'Shipping', href: '/' },
    { name: 'Returns', href: '/' },
    { name: 'Size Guide', href: '/' },
  ],
};

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
];

const benefits = [
  { icon: Truck, text: 'Free Shipping Over $100' },
  { icon: ShieldCheck, text: 'Secure Payment' },
  { icon: RotateCcw, text: '30-Day Returns' },
  { icon: CreditCard, text: 'Multiple Payment Options' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Benefits Bar */}
      <div className="border-b border-white/10">
        <div className="section-padding py-8">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#c9a96e]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#c9a96e]" />
                    </div>
                    <span className="text-sm text-white/80">{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-block mb-6">
                <span className="text-2xl font-serif font-bold">
                  <span className="text-white">Luxe</span>
                  <span className="text-[#c9a96e]">Mart</span>
                </span>
              </Link>
              <p className="text-white/60 leading-relaxed mb-6 max-w-sm">
                Premium lifestyle essentials for the modern connoisseur. 
                Quality meets elegance in every piece we curate.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-5 h-5 text-[#c9a96e]" />
                  <span className="text-sm">123 Luxury Lane, Style City, SC 10001</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Phone className="w-5 h-5 text-[#c9a96e]" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Mail className="w-5 h-5 text-[#c9a96e]" />
                  <span className="text-sm">support@luxemart.com</span>
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="font-semibold text-white mb-6">Shop</h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-[#c9a96e] transition-colors text-sm inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#c9a96e] group-hover:w-3 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-[#c9a96e] transition-colors text-sm inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#c9a96e] group-hover:w-3 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-white mb-6">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-[#c9a96e] transition-colors text-sm inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-[#c9a96e] group-hover:w-3 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-6">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <p className="text-white/50 text-sm text-center md:text-left">
                © 2024 LuxeMart. All rights reserved.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:bg-[#c9a96e] hover:border-[#c9a96e] hover:text-white transition-all"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs text-white/50">
                  Visa
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs text-white/50">
                  MC
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs text-white/50">
                  Amex
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs text-white/50">
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
