import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, Check, ChevronRight, Lock, Download, Package } from 'lucide-react';
import { useCartStore, useAuthStore, useOrderStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function OrderSummary({ items, totalPrice, shippingCost, tax, finalTotal }: any) {
  return (
    <div className="bg-white rounded-xl p-6 sticky top-24 shadow-sm">
      <h3 className="text-lg font-serif font-bold mb-4">Order Summary</h3>
      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex gap-3">
            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.product.name}</p>
              <p className="text-xs text-[#666]">Qty: {item.quantity}</p>
              <p className="text-sm text-[#c9a96e]">₹{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 pt-4 border-t border-[#e0e0e0]">
        <div className="flex justify-between text-sm text-[#666]"><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-[#666]"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span></div>
        <div className="flex justify-between text-sm text-[#666]"><span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span></div>
        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-[#e0e0e0]"><span>Total</span><span className="text-[#c9a96e]">₹{finalTotal.toFixed(2)}</span></div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#666]">
        <Lock className="w-4 h-4" /><span>Secured by SSL encryption</span>
      </div>
    </div>
  );
}

function EBill({ orderData }: { orderData: any }) {
  const { user } = useAuthStore();
  const billRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => {
    const printContent = billRef.current?.innerHTML || '';
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`
        <html>
          <head>
            <title>Invoice - ${orderData.orderId}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
              body { font-family: 'Inter', sans-serif; color: #1a1a1a; margin: 0; padding: 40px; }
              .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 40px; position: relative; overflow: hidden; }
              .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 150px; color: rgba(0,0,0,0.03); font-weight: bold; pointer-events: none; white-space: nowrap; }
              header { display: flex; justify-content: space-between; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: bold; }
              .logo-gold { color: #c9a96e; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
              .info-section h4 { text-transform: uppercase; font-size: 11px; color: #999; letter-spacing: 0.1em; margin-bottom: 8px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th { text-align: left; padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 12px; text-transform: uppercase; color: #666; }
              td { padding: 16px 0; border-bottom: 1px solid #eee; font-size: 14px; }
              .total-section { margin-left: auto; width: 250px; }
              .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
              .total-final { border-top: 2px solid #1a1a1a; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; color: #c9a96e; }
              footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="watermark">LUXEMART</div>
              ${printContent}
              <footer>
                Thank you for choosing LuxeMart. All returns must be made within 30 days.
              </footer>
            </div>
          </body>
        </html>
      `);
      w.document.close();
      setTimeout(() => {
        w.print();
        w.close();
      }, 500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">Order Confirmed!</h2>
        <p className="text-[#666]">A copy of your invoice has been generated below.</p>
      </div>

      <div ref={billRef} className="bg-white rounded-2xl shadow-xl border border-[#e0e0e0] overflow-hidden p-8 md:p-12 relative">
        <div className="absolute top-10 right-10 opacity-5 pointer-events-none select-none">
           <Package className="w-64 h-64 rotate-12" />
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-[#1a1a1a] pb-8 mb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              <span>Luxe</span><span className="text-[#c9a96e]">Mart</span>
            </h1>
            <p className="text-[#666] text-sm mt-1">Premium Eyewear & Fragrances</p>
          </div>
          <div className="mt-4 md:mt-0 md:text-right">
            <h3 className="text-[#c9a96e] font-bold text-xl tracking-widest">INVOICE</h3>
            <p className="text-[#1a1a1a] font-mono text-sm">#{orderData.orderId}</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <section>
              <h4 className="text-[10px] font-bold text-[#999] uppercase tracking-[0.2em] mb-2">Billed To</h4>
              <p className="font-bold text-[#1a1a1a] text-lg">{orderData.name}</p>
              <p className="text-[#666] text-sm">{orderData.email}</p>
              <div className="text-[#666] text-sm mt-2 leading-relaxed">
                {orderData.address}, {orderData.city}<br />
                {orderData.state} {orderData.zip}, {orderData.country}
              </div>
            </section>
          </div>
          <div className="md:text-right space-y-6">
            <section>
              <h4 className="text-[10px] font-bold text-[#999] uppercase tracking-[0.2em] mb-2">Invoice Details</h4>
              <p className="text-[#1a1a1a] font-medium text-sm">
                Date: <span className="text-[#666] font-normal">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
              <p className="text-[#1a1a1a] font-medium text-sm mt-1">
                Method: <span className="text-[#666] font-normal capitalize">{orderData.paymentMethod}</span>
              </p>
            </section>
          </div>
        </div>

        <table className="w-full mb-10">
          <thead>
            <tr className="border-b-2 border-[#1a1a1a]">
              <th className="text-left pb-4 text-[10px] font-bold text-[#999] uppercase tracking-wider">Product</th>
              <th className="text-center pb-4 text-[10px] font-bold text-[#999] uppercase tracking-wider">Qty</th>
              <th className="text-right pb-4 text-[10px] font-bold text-[#999] uppercase tracking-wider">Price</th>
              <th className="text-right pb-4 text-[10px] font-bold text-[#999] uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {orderData.items.map((item: any, i: number) => (
              <tr key={i}>
                <td className="py-6">
                  <p className="font-bold text-[#1a1a1a] text-sm">{item.product.name}</p>
                  <p className="text-[10px] text-[#999] uppercase tracking-wider mt-0.5">{item.product.category}</p>
                </td>
                <td className="py-6 text-center text-sm text-[#666]">{item.quantity}</td>
                 <td className="py-6 text-right text-sm text-[#666]">₹{item.product.price.toFixed(2)}</td>
                <td className="py-6 text-right text-sm font-bold text-[#1a1a1a]">₹{(item.product.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#666]">Subtotal</span>
            <span className="text-[#1a1a1a] font-medium">₹{orderData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#666]">Shipping</span>
            <span className="text-[#1a1a1a] font-medium">{orderData.shipping === 0 ? 'COMPLIMENTARY' : `₹${orderData.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#666]">Taxes (8%)</span>
            <span className="text-[#1a1a1a] font-medium">₹{orderData.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-4 border-t-2 border-[#1a1a1a]">
            <span>Amount Due</span>
            <span className="text-[#c9a96e]">₹{orderData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-10 justify-center">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-4 rounded-xl hover:bg-[#c9a96e] transition-all duration-300 shadow-lg hover:shadow-[#c9a96e]/20"
        >
          <Download className="w-5 h-5" /> Download / Print Invoice
        </button>
        {user?.role !== 'admin' && (
          <Link 
            to="/orders" 
            className="flex items-center gap-2 bg-white border border-[#e0e0e0] text-[#1a1a1a] px-8 py-4 rounded-xl hover:bg-[#f8f8f8] transition-all duration-300 shadow-sm"
          >
            <Package className="w-5 h-5" /> My Orders
          </Link>
        )}
        <Link 
          to="/shop" 
          className="flex items-center gap-2 bg-white border border-[#e0e0e0] text-[#1a1a1a] px-8 py-4 rounded-xl hover:bg-[#f8f8f8] transition-all duration-300 shadow-sm"
        >
          Return to Boutique
        </Link>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { placeOrder } = useOrderStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    zipCode: user?.addresses?.[0]?.zipCode || '',
    country: user?.addresses?.[0]?.country || 'USA',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 100 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    console.log('Starting payment process...');
    
    try {
      // Place the order in the store
      const newOrder = await placeOrder({
        userId: user?.id,
        items: items.map(item => ({
          product: item.product._id || item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: finalTotal,
        shippingAddress: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        paymentMethod: paymentMethod,
      });

      console.log('Order response:', newOrder);

      if (!newOrder) {
        toast.error('Failed to place order. Please try again.');
        setIsProcessing(false);
        return;
      }

      const data = {
        orderId: newOrder._id || newOrder.id,
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zipCode,
        country: shippingInfo.country,
        paymentMethod,
        items: [...items],
        subtotal: totalPrice,
        shipping: shippingCost,
        tax,
        total: finalTotal,
      };
      
      console.log('Setting order data:', data);
      setOrderData(data);
      clearCart();
      setIsProcessing(false);
      setStep(3);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An unexpected error occurred during checkout.');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      toast.error('Admins cannot place orders.');
      navigate('/admin');
    }
  }, [user, navigate]);

  if (items.length === 0 && step !== 3) { navigate('/cart'); return null; }

  const steps = [
    { n: 1, label: 'Shipping', icon: Truck },
    { n: 2, label: 'Payment', icon: CreditCard },
    { n: 3, label: 'Confirmation', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-6">Checkout</h1>
            <div className="flex items-center justify-center gap-2">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.n} className="flex items-center">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step >= s.n ? 'bg-[#c9a96e] text-white' : 'bg-[#e0e0e0] text-[#666]'}`}>
                      <Icon className="w-4 h-4" />{s.label}
                    </div>
                    {i < 2 && <div className={`w-8 h-px mx-1 ${step > s.n ? 'bg-[#c9a96e]' : 'bg-[#e0e0e0]'}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-xl font-serif font-bold mb-6">Shipping Information</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      {[['firstName','First Name'],['lastName','Last Name']].map(([k,l]) => (
                        <div key={k}><label className="block text-sm font-medium text-[#1a1a1a] mb-2">{l} *</label>
                        <input type="text" required value={(shippingInfo as any)[k]} onChange={e => setShippingInfo({...shippingInfo,[k]:e.target.value})} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20" /></div>
                      ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      {[['email','Email','email'],['phone','Phone','tel']].map(([k,l,t]) => (
                        <div key={k}><label className="block text-sm font-medium text-[#1a1a1a] mb-2">{l} *</label>
                        <input type={t} required value={(shippingInfo as any)[k]} onChange={e => setShippingInfo({...shippingInfo,[k]:e.target.value})} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20" /></div>
                      ))}
                    </div>
                    <div><label className="block text-sm font-medium text-[#1a1a1a] mb-2">Address *</label>
                    <input type="text" required value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo,address:e.target.value})} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20" /></div>
                    <div className="grid md:grid-cols-3 gap-5">
                      {[['city','City'],['state','State'],['zipCode','ZIP Code']].map(([k,l]) => (
                        <div key={k}><label className="block text-sm font-medium text-[#1a1a1a] mb-2">{l} *</label>
                        <input type="text" required value={(shippingInfo as any)[k]} onChange={e => setShippingInfo({...shippingInfo,[k]:e.target.value})} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20" /></div>
                      ))}
                    </div>
                    <Button type="submit" className="w-full btn-primary py-4">Continue to Payment <ChevronRight className="w-5 h-5 ml-2 inline" /></Button>
                  </form>
                </div>
                <div><OrderSummary items={items} totalPrice={totalPrice} shippingCost={shippingCost} tax={tax} finalTotal={finalTotal} /></div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-xl font-serif font-bold mb-6">Payment Method</h2>
                  <div className="space-y-3 mb-6">
                    {[{val:'card',label:'Credit / Debit Card',sub:'Visa, Mastercard, Amex'},{val:'paypal',label:'PayPal',sub:'Pay with your PayPal account'}].map(opt => (
                      <label key={opt.val} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod===opt.val?'border-[#c9a96e] bg-[#c9a96e]/5':'border-[#e0e0e0]'}`}>
                        <input type="radio" name="payment" value={opt.val} checked={paymentMethod===opt.val} onChange={e=>setPaymentMethod(e.target.value)} className="w-4 h-4 accent-[#c9a96e]" />
                        <CreditCard className="w-6 h-6 text-[#c9a96e]" />
                        <div><p className="font-medium">{opt.label}</p><p className="text-sm text-[#666]">{opt.sub}</p></div>
                      </label>
                    ))}
                  </div>
                  <form onSubmit={handlePaymentSubmit} className="space-y-5">
                    <div><label className="block text-sm font-medium mb-2">Card Number *</label>
                    <div className="relative"><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                    <input type="text" placeholder="1234 5678 9012 3456" required={paymentMethod==='card'} className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20" /></div></div>
                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Cardholder Name *</label><input type="text" placeholder="Name on card" required={paymentMethod==='card'} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20" /></div>
                      <div><label className="block text-sm font-medium mb-2">Expiry *</label><input type="text" placeholder="MM/YY" required={paymentMethod==='card'} className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20" /></div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                      <Button type="submit" disabled={isProcessing} className="flex-1 btn-primary">
                        {isProcessing ? <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</span>
                        : <span className="flex items-center gap-2"><Lock className="w-4 h-4"/>Pay ₹{finalTotal.toFixed(2)}</span>}
                      </Button>
                    </div>
                  </form>
                </div>
                <div><OrderSummary items={items} totalPrice={totalPrice} shippingCost={shippingCost} tax={tax} finalTotal={finalTotal} /></div>
              </div>
            )}

            {/* Step 3: E-Bill */}
            {step === 3 && orderData && <EBill orderData={orderData} />}
          </div>
        </div>
      </div>
    </div>
  );
}
