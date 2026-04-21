import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Truck, 
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { useAdminStore } from '@/store/store';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrders() {
  const { allOrders, updateOrderStatus, fetchAllOrders } = useAdminStore();
  const orders = allOrders; // Use directly from store for real-time updates
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const itemsPerPage = 10;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      String(order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String((typeof order.userId === 'object' ? (order.userId as any)?.name || (order.userId as any)?._id : order.userId) || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (orderId: string, newStatus: typeof orders[0]['status']) => {
    await updateOrderStatus(orderId, newStatus);
    fetchAllOrders(); // Refresh data from backend
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'shipped': return 'bg-blue-100 text-blue-600';
      case 'processing': return 'bg-yellow-100 text-yellow-600';
      case 'pending': return 'bg-gray-100 text-gray-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                Orders
              </h1>
              <p className="text-[#666]">Manage and track customer orders</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-sm text-[#666]">Total Orders: </span>
                <span className="font-semibold">{orders.length}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#666]" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f8f8]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Order ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Customer</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Total</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Payment</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <tr key={order.id} className="border-b border-[#e0e0e0] last:border-b-0">
                        <td className="px-6 py-4 font-medium">{order.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#c9a96e]/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-[#c9a96e]">
                                {String((typeof order.userId === 'object' ? (order.userId as any)?.name || (order.userId as any)?._id : order.userId) || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span>User #{typeof order.userId === 'object' ? ((order.userId as any)?.name || (order.userId as any)?._id || 'Unknown') : (order.userId || 'Unknown')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#666]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            order.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-600' 
                              : order.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 hover:bg-[#f0f0f0] rounded-lg"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-[#f0f0f0] rounded-lg">
                                  <MoreHorizontal className="w-5 h-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>
                                  Mark as Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>
                                  Mark as Shipped
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>
                                  Mark as Delivered
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                                  className="text-red-500"
                                >
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
                <p className="text-sm text-[#666]">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
                  {filteredOrders.length} orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-[#e0e0e0] rounded-lg disabled:opacity-50 hover:bg-[#f0f0f0]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-[#e0e0e0] rounded-lg disabled:opacity-50 hover:bg-[#f0f0f0]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p className="text-sm text-[#666]">Order Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p className="text-sm text-[#666]">Total Amount</p>
                  <p className="font-medium text-[#c9a96e]">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Shipping Address</h4>
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p>{selectedOrder.shippingAddress?.street || 'N/A'}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city || ''}, {selectedOrder.shippingAddress?.state || ''} {selectedOrder.shippingAddress?.zipCode || ''}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country || ''}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Order Status</h4>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  {selectedOrder.trackingNumber && (
                    <span className="text-sm text-[#666]">
                      Tracking: {selectedOrder.trackingNumber}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, 'shipped');
                    setSelectedOrder(null);
                  }}
                  className="flex-1 btn-primary"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark as Shipped
                </Button>
                <Button 
                  onClick={() => {
                    handleStatusChange(selectedOrder.id, 'delivered');
                    setSelectedOrder(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
