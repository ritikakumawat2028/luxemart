import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  Search
} from 'lucide-react';
import { useAuthStore, useOrderStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const statusConfig = {
  pending: { 
    label: 'Pending', 
    color: 'bg-gray-100 text-gray-600',
    icon: Clock 
  },
  processing: { 
    label: 'Processing', 
    color: 'bg-yellow-100 text-yellow-600',
    icon: Package 
  },
  shipped: { 
    label: 'Shipped', 
    color: 'bg-blue-100 text-blue-600',
    icon: Truck 
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-green-100 text-green-600',
    icon: CheckCircle 
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-600',
    icon: XCircle 
  },
};

export default function Orders() {
  const { user } = useAuthStore();
  const { orders, fetchUserOrders } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders(user.id);
    }
  }, [user?.id, fetchUserOrders]);

  // Filter orders for the current user
  const userOrders = orders.filter(o => o.userId === user?.id);

  const filteredOrders = userOrders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                  My Orders
                </h1>
                <p className="text-[#666]">Track and manage your orders</p>
              </div>
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                Continue Shopping
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e] bg-white"
              />
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Package className="w-16 h-16 text-[#999] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                  No orders found
                </h3>
                <p className="text-[#666] mb-6">
                  You haven&apos;t placed any orders yet.
                </p>
                <Link to="/shop" className="btn-primary inline-block">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  
                  return (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Order Info */}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-lg">{order.id}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <p className="text-sm text-[#666]">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        {/* Total */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#c9a96e]">
                            ₹{order.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-sm text-[#666]">
                            {order.items.length || 1} item(s)
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between text-xs text-[#666] mb-2">
                          <span>Order Placed</span>
                          <span>Processing</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#c9a96e] transition-all duration-500"
                            style={{
                              width: order.status === 'pending' ? '25%' :
                                     order.status === 'processing' ? '50%' :
                                     order.status === 'shipped' ? '75%' :
                                     order.status === 'delivered' ? '100%' : '0%'
                            }}
                          />
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.trackingNumber && (
                        <div className="mt-4 p-3 bg-[#f8f8f8] rounded-lg">
                          <p className="text-sm">
                            <span className="text-[#666]">Tracking Number: </span>
                            <span className="font-medium">{order.trackingNumber}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                {(() => {
                  const status = statusConfig[selectedOrder.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {status.label}
                    </span>
                  );
                })()}
              </div>

              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p className="text-sm text-[#666]">Order Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p className="text-sm text-[#666]">Total Amount</p>
                  <p className="font-medium text-[#c9a96e]">
                    ₹{selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-medium mb-3">Shipping Address</h4>
                <div className="bg-[#f8f8f8] p-4 rounded-lg">
                  <p className="font-medium">{selectedOrder.shippingAddress?.name || 'N/A'}</p>
                  <p className="text-[#666]">{selectedOrder.shippingAddress?.street || ''}</p>
                  <p className="text-[#666]">
                    {selectedOrder.shippingAddress?.city || ''}, {selectedOrder.shippingAddress?.state || ''} {selectedOrder.shippingAddress?.zipCode || ''}
                  </p>
                  <p className="text-[#666]">{selectedOrder.shippingAddress?.country || ''}</p>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <h4 className="font-medium mb-3">Payment</h4>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    selectedOrder.paymentStatus === 'completed' 
                      ? 'bg-green-100 text-green-600' 
                      : selectedOrder.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Tracking */}
              {selectedOrder.trackingNumber && (
                <div>
                  <h4 className="font-medium mb-3">Tracking</h4>
                  <p className="text-[#666]">
                    Tracking Number: <span className="font-medium text-[#1a1a1a]">{selectedOrder.trackingNumber}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
