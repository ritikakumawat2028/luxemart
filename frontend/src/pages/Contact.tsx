import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@luxemart.com', href: 'mailto:support@luxemart.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, label: 'Address', value: '123 Luxury Lane, Style City, NY 10001', href: '#' },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri: 9AM–6PM EST', href: '#' },
];

const faqs = [
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of purchase. Items must be in original condition with all tags attached.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5–7 business days. Express (2–3 days) and Next Day options are available.' },
  { q: 'Are all products authentic?', a: '100% yes. Every product is sourced directly from authorized distributors and comes with authenticity guarantees.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries. International shipping rates vary by destination.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Hero */}
      <section className="relative bg-[#1a1a1a] py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=600&fit=crop" alt="Contact" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 section-padding container-custom text-center">
          <span className="text-[#c9a96e] text-sm font-semibold tracking-widest uppercase mb-4 block animate-fade-in">Get In Touch</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 animate-slide-up">
            We'd Love to <span className="text-gradient">Hear From You</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Have a question, feedback, or just want to say hello? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="section-padding container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <a key={info.label} href={info.href} className="group bg-[#f8f8f8] p-6 rounded-2xl hover:bg-[#1a1a1a] transition-all duration-500 text-center">
                  <div className="w-12 h-12 bg-[#c9a96e]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#c9a96e]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#c9a96e]" />
                  </div>
                  <p className="text-xs font-semibold text-[#999] group-hover:text-white/50 uppercase tracking-wider mb-1 transition-colors">{info.label}</p>
                  <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-white transition-colors">{info.value}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="py-20 bg-[#f8f8f8]">
        <div className="section-padding container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">Send a Message</h2>
              <p className="text-[#666] mb-8">We typically respond within 24 hours on business days.</p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-[#1a1a1a] mb-2">Message Received!</h3>
                  <p className="text-[#666]">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 btn-primary text-sm">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Full Name *</label>
                      <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Email *</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Subject *</label>
                    <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all bg-white">
                      <option value="">Select a subject</option>
                      <option>Order Inquiry</option>
                      <option>Product Question</option>
                      <option>Return / Exchange</option>
                      <option>Shipping Issue</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Message *</label>
                    <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all resize-none" placeholder="Tell us how we can help..." />
                  </div>
                  <button type="submit" disabled={sending} className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-70">
                    {sending ? (
                      <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    ) : (
                      <><Send className="w-5 h-5" />Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">Frequently Asked Questions</h2>
              <p className="text-[#666] mb-8">Quick answers to common questions.</p>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#e0e0e0]">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[#f8f8f8] transition-colors">
                      <span className="font-medium text-[#1a1a1a] text-sm">{faq.q}</span>
                      <span className={`text-[#c9a96e] text-xl font-light transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-sm text-[#666] leading-relaxed border-t border-[#e0e0e0] pt-4">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="h-64 bg-[#e0e0e0] relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&h=400&fit=crop" alt="Location" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl">
            <MapPin className="w-8 h-8 text-[#c9a96e] mx-auto mb-2" />
            <p className="font-serif font-bold text-[#1a1a1a]">123 Luxury Lane</p>
            <p className="text-[#666] text-sm">Style City, New York 10001</p>
          </div>
        </div>
      </section>
    </div>
  );
}
