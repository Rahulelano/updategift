import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Calendar, ShoppingBag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

export default function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
    .then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => toast.error('Failed to load orders'));
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <div className="bg-card p-6 rounded-2xl shadow-soft text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-2xl">
                {JSON.parse(localStorage.getItem('user') || '{}').name?.charAt(0) || 'U'}
              </div>
              <h2 className="font-bold text-lg">{JSON.parse(localStorage.getItem('user') || '{}').name}</h2>
              <p className="text-sm text-muted-foreground">{JSON.parse(localStorage.getItem('user') || '{}').email}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
              <ShoppingBag className="text-primary" /> My Orders
            </h2>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-card p-12 rounded-2xl shadow-soft text-center text-muted-foreground">
                  No orders found.
                </div>
              ) : (
                orders.map(order => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={order._id} 
                    className="bg-card p-6 rounded-2xl shadow-soft border border-border/50"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase opacity-60">Order ID: #{order._id.slice(-6)}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.shippingLocation}</p>
                        <p className="font-body text-xl font-bold text-primary">₹{order.total}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
