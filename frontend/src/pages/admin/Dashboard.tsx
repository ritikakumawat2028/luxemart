// Dashboard component
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { useAdminStore, useProductStore } from '@/store/store';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';



export default function AdminDashboard() {
  const { allOrders, users } = useAdminStore();
  const { products } = useProductStore();

  // Derive sales data for the chart from allOrders
  const salesData = allOrders.reduce((acc: any[], order) => {
    const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(a => a.date === date);
    if (existing) {
      existing.amount += order.totalAmount;
    } else {
      acc.push({ date, amount: order.totalAmount });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
  
  // Fallback data if no orders
  const chartData = salesData.length > 0 ? salesData : [
    { date: 'Mon', amount: 0 },
    { date: 'Tue', amount: 0 },
    { date: 'Wed', amount: 0 },
    { date: 'Thu', amount: 0 },
    { date: 'Fri', amount: 0 },
    { date: 'Sat', amount: 0 },
    { date: 'Sun', amount: 0 },
  ];

  const dashboardStats = [
    { 
      name: 'Total Sales', 
      value: `₹${allOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`, 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: '#c9a96e'
    },
    { 
      name: 'Total Orders', 
      value: allOrders.length.toString(), 
      change: '+8.2%', 
      trend: 'up',
      icon: ShoppingBag,
      color: '#4caf50'
    },
    { 
      name: 'Total Users', 
      value: users.length.toString(), 
      change: '+15.3%', 
      trend: 'up',
      icon: Users,
      color: '#2196f3'
    },
    { 
      name: 'Products', 
      value: products.length.toString(), 
      change: '-2.1%', 
      trend: 'down',
      icon: Package,
      color: '#9c27b0'
    },
  ];

  const recentOrders = allOrders.slice(0, 5).map(o => ({
    id: o.id,
    customer: o.userId === '2' ? 'John Doe' : `User #${o.userId}`,
    total: o.totalAmount,
    status: o.status,
    date: new Date(o.createdAt).toLocaleDateString()
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'shipped': return 'bg-blue-100 text-blue-600';
      case 'processing': return 'bg-yellow-100 text-yellow-600';
      case 'pending': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                Admin Dashboard
              </h1>
              <p className="text-[#666]">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#666]">
                <Calendar className="w-4 h-4 inline mr-1" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
                  <p className="text-sm text-[#666]">{stat.name}</p>
                </div>
              );
            })}
          </div>

          {/* Charts & Tables */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold">Sales Overview</h2>
                <select className="text-sm border border-[#e0e0e0] rounded-lg px-3 py-2">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#c9a96e" 
                      strokeWidth={3}
                      dot={{ fill: '#c9a96e', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-serif font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/products"
                  className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg hover:bg-[#e0e0e0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-[#c9a96e]" />
                    <span className="font-medium">Manage Products</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#666]" />
                </Link>
                <Link
                  to="/admin/orders"
                  className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg hover:bg-[#e0e0e0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-[#4caf50]" />
                    <span className="font-medium">View Orders</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#666]" />
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg hover:bg-[#e0e0e0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#2196f3]" />
                    <span className="font-medium">Manage Users</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#666]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e0e0e0]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold">Recent Orders</h2>
                <Link 
                  to="/admin/orders" 
                  className="text-[#c9a96e] hover:underline text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f8f8]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Order ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Customer</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Total</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#e0e0e0] last:border-b-0">
                      <td className="px-6 py-4 font-medium">{order.id}</td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4 text-[#666]">{order.date}</td>
                      <td className="px-6 py-4 font-medium">₹{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/admin/orders`}
                          className="text-[#c9a96e] hover:underline text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
}
