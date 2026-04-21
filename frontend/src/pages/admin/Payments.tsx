import AdminLayout from '@/components/admin/AdminLayout';
import { CreditCard, DollarSign, Clock, XCircle } from 'lucide-react';
import { useAdminStore } from '@/store/store';

const methodLabels: Record<string, string> = { card: 'Credit Card', paypal: 'PayPal', bank: 'Bank Transfer' };

export default function AdminPayments() {
  const { allOrders } = useAdminStore();

  const totalRevenue = allOrders.filter(o => o.paymentStatus === 'completed').reduce((s, o) => s + o.totalAmount, 0);
  const pending = allOrders.filter(o => o.paymentStatus === 'pending').length;
  const failed = allOrders.filter(o => o.paymentStatus === 'failed').length;

  const getStatusStyle = (s: string) => ({
    completed: 'bg-green-100 text-green-600',
    pending: 'bg-yellow-100 text-yellow-600',
    failed: 'bg-red-100 text-red-600',
  }[s] || 'bg-gray-100 text-gray-600');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#c9a96e' },
            { label: 'Pending Payments', value: pending.toString(), icon: Clock, color: '#f59e0b' },
            { label: 'Failed Payments', value: failed.toString(), icon: XCircle, color: '#ef4444' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
                  <p className="text-sm text-[#666]">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#e0e0e0] flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-[#1a1a1a]">All Transactions</h2>
            <span className="text-sm text-[#666]">{allOrders.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f8f8]">
                <tr>
                  {['Order ID', 'Date', 'Amount', 'Method', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-sm font-medium text-[#666]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allOrders.map(order => (
                  <tr key={order.id} className="border-b border-[#e0e0e0] last:border-0 hover:bg-[#f8f8f8] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1a1a1a]">{order.id}</td>
                    <td className="px-6 py-4 text-[#666] text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-[#c9a96e]">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-[#666] flex items-center gap-2"><CreditCard className="w-4 h-4" />{methodLabels[order.paymentMethod] || 'Card'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {allOrders.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-[#666]">No transactions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
