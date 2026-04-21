import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuthStore } from '@/store/store';
import { Save, Store, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const { user } = useAuthStore();
  const [storeName, setStoreName] = useState('LuxeMart');
  const [storeEmail, setStoreEmail] = useState('support@luxemart.com');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('8');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved!`);
  };

  const sections = [
    {
      title: 'Store Settings',
      icon: Store,
      content: (
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-[#1a1a1a] mb-1">Store Name</label>
            <input value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]" /></div>
          <div><label className="block text-sm font-medium text-[#1a1a1a] mb-1">Support Email</label>
            <input type="email" value={storeEmail} onChange={e => setStoreEmail(e.target.value)} className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-[#1a1a1a] mb-1">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] bg-white">
                <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
              </select></div>
            <div><label className="block text-sm font-medium text-[#1a1a1a] mb-1">Tax Rate (%)</label>
              <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]" /></div>
          </div>
          <button onClick={() => handleSave('Store')} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-6"><Save className="w-4 h-4" />Save Store Settings</button>
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', desc: 'Receive summary emails for new orders', value: emailNotifs, set: setEmailNotifs },
            { label: 'Order Alerts', desc: 'Get instant alerts when new orders arrive', value: orderAlerts, set: setOrderAlerts },
          ].map(item => (
            <label key={item.label} className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-xl cursor-pointer">
              <div><p className="font-medium text-[#1a1a1a] text-sm">{item.label}</p><p className="text-xs text-[#666]">{item.desc}</p></div>
              <button onClick={() => item.set(!item.value)} className={`relative w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-[#c9a96e]' : 'bg-[#ddd]'}`}>
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : ''}`} />
              </button>
            </label>
          ))}
          <button onClick={() => handleSave('Notification')} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-6"><Save className="w-4 h-4" />Save Notifications</button>
        </div>
      ),
    },
    {
      title: 'Admin Account',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-[#f8f8f8] rounded-xl">
            <div className="w-14 h-14 bg-[#c9a96e] rounded-full flex items-center justify-center text-white text-xl font-bold">{user?.name?.[0]}</div>
            <div><p className="font-semibold text-[#1a1a1a]">{user?.name}</p><p className="text-sm text-[#666]">{user?.email}</p><span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">Admin</span></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" placeholder="Leave blank to keep current" className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]" /></div>
          <div><label className="block text-sm font-medium mb-1">Confirm Password</label><input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]" /></div>
          <button onClick={() => handleSave('Account')} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-6"><Save className="w-4 h-4" />Update Account</button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        {sections.map(sec => {
          const Icon = sec.icon;
          return (
            <div key={sec.title} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e0e0e0]">
                <div className="w-9 h-9 bg-[#c9a96e]/10 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-[#c9a96e]" /></div>
                <h2 className="font-serif font-bold text-[#1a1a1a]">{sec.title}</h2>
              </div>
              <div className="p-6">{sec.content}</div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
