import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product, useCart } from '@/lib/store';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
            loading="lazy"
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold ${
              product.badge === 'Hot'
                ? 'bg-accent text-accent-foreground'
                : 'bg-sale text-primary-foreground'
            }`}>
              {product.badge === 'Sale' && discount > 0 ? `-${discount}%` : product.badge}
            </span>
          )}
          {/* Hover actions */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <span className="w-11 h-11 rounded-xl bg-card text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
              <Eye className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-body text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-body text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
