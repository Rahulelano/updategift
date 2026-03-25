import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/lib/store';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, shippingLocation, setShippingLocation, shippingCost, user } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    const orderData = {
      items: items.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        customizations: item.customizations
      })),
      subtotal: totalPrice,
      shippingCost,
      total: totalPrice + shippingCost,
      shippingLocation,
      user: user?.id
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        toast.success('Order placed successfully! We will contact you soon.');
        clearCart();
      } else {
        toast.error('Failed to place order');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some gifts to brighten someone's day!</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            <ArrowLeft className="w-5 h-5" /> Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 bg-card rounded-2xl shadow-soft"
              >
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-secondary shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="font-body text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                    {item.product.name}
                  </Link>
                  {item.product.selectedVariant && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Size: {item.product.selectedVariant.label}</p>
                  )}
                  <p className="text-primary font-body text-base font-bold mt-1">₹{item.product.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-secondary rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-muted-foreground">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-muted-foreground">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => { removeFromCart(item.id); toast.info('Item removed'); }}
                      className="p-2 text-muted-foreground hover:text-sale transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Customizations display */}
                  {item.customizations && Object.keys(item.customizations).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                      {Object.entries(item.customizations).map(([label, value]) => (
                        <div key={label} className="text-[11px]">
                          <span className="font-bold text-foreground uppercase tracking-wider block mb-1">{label}</span>
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-1.5">
                              {value.map((url, idx) => (
                                <div key={idx} className="w-10 h-10 rounded-md overflow-hidden border border-border bg-secondary">
                                  <img src={url} alt="Custom" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground font-medium">{value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <button onClick={() => { clearCart(); toast.info('Cart cleared'); }} className="text-sm text-muted-foreground hover:text-sale transition-colors">
              Clear All
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-soft p-6 sticky top-24">
              <h3 className="font-display text-lg font-bold mb-4">Order Summary</h3>
              
              {/* Shipping Location Selector */}
              <div className="mb-6 space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Shipping To</label>
                <div className="grid grid-cols-2 gap-2 bg-secondary p-1 rounded-xl">
                  <button
                    onClick={() => setShippingLocation('Tamilnadu')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${shippingLocation === 'Tamilnadu' ? 'bg-card text-primary shadow-soft' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Tamilnadu
                  </button>
                  <button
                    onClick={() => setShippingLocation('Other')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${shippingLocation === 'Other' ? 'bg-card text-primary shadow-soft' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Other States
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`${shippingCost === 0 ? 'text-primary' : 'text-foreground'} font-semibold`}>
                    {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-body text-2xl font-bold text-primary">₹{(totalPrice + shippingCost).toLocaleString()}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Proceed to Checkout'}
              </button>
              <Link to="/shop" className="block text-center mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
