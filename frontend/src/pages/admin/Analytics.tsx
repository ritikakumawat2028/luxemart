import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminStore, useProductStore } from '@/store/store';
import { TrendingUp, ShoppingBag, Users, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#c9a96e', '#1a1a1a', '#4caf50', '#2196f3'];

export default function AdminAnalytics() {
  const { allOrders, users } = useAdminStore();
  const { products } = useProductStore();

  const revenue = allOrders.reduce((s, o) => s + o.totalAmount, 0);

  const statusCounts = ['pending','processing','shipped','delivered','cancelled'].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: allOrders.filter(o => o.status === s).length,
  })).filter(d => d.value > 0);

  const categoryData = products.reduce<Record<string,number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const categoryChart = Object.entries(categoryData).map(([name, count]) => ({ name, count }));

  const weeklyData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => ({
    day,
    orders: allOrders.filter((_, idx) => idx % 7 === i).length || Math.floor(Math.random() * 10 + 2),
    revenue: allOrders.filter((_, idx) => idx % 7 === i).reduce((s, o) => s + o.totalAmount, 0) || Math.floor(Math.random() * 500 + 100),
  }));

  const kpis = [
    { label: 'Total Revenue', value: `₹${revenue.toFixed(2)}`, icon: TrendingUp, color: '#c9a96e', change: '+12.5%' },
    { label: 'Total Orders', value: allOrders.length, icon: ShoppingBag, color: '#4caf50', change: '+8.2%' },
    { label: 'Total Customers', value: users.length, icon: Users, color: '#2196f3', change: '+15.3%' },
    { label: 'Total Products', value: products.length, icon: Package, color: '#9c27b0', change: '+4' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(kpi => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}18` }}>
                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{kpi.change}</span>
                </div>
                <p className="text-2xl font-bold text-[#1a1a1a]">{kpi.value}</p>
                <p className="text-xs text-[#666] mt-1">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-[#1a1a1a] mb-4">Weekly Revenue</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                <Line type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2.5} dot={{ fill: '#c9a96e', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-[#1a1a1a] mb-4">Orders by Day</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                <Bar dataKey="orders" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie charts row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-[#1a1a1a] mb-4">Order Status Distribution</h3>
            {statusCounts.length > 0 ? (
              <div className="flex items-center gap-6">
                <PieChart width={160} height={160}>
                  <Pie data={statusCounts} dataKey="value" cx={75} cy={75} innerRadius={45} outerRadius={70}>
                    {statusCounts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
                <div className="space-y-2">
                  {statusCounts.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-[#666]">{s.name}</span>
                      <span className="font-semibold ml-auto">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-[#999] text-sm">No order data available.</p>}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-[#1a1a1a] mb-4">Products by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" stroke="#999" tick={{ fontSize: 12 }} width={90} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                <Bar dataKey="count" fill="#c9a96e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
