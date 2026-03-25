import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, HeadphonesIcon, Gift } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { API_URL } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SectionTitle from '@/components/SectionTitle';
import { products as staticProducts } from '@/lib/products';

import heroImg from '@/assets/hero-gifts.jpg';
import catMdf from '@/assets/cat-mdf.jpg';
import catFrames from '@/assets/cat-frames.jpg';
import catDecor from '@/assets/cat-decor.jpg';
import catMobile from '@/assets/cat-mobile.jpg';

const categories = [
  { name: 'MDF Gifts', image: catMdf, to: '/shop?category=MDF Gifts' },
  { name: 'Photo Frames', image: catFrames, to: '/shop?category=Photo Frames' },
  { name: 'Home Decors', image: catDecor, to: '/shop?category=Home Decors' },
  { name: 'Valentine Combos', image: 'https://updategifts.in/wp-content/uploads/2026/01/499-01-900x900.jpg', to: '/shop?category=Valentine Combos' },
  { name: 'Christmas Gifts', image: 'https://updategifts.in/wp-content/uploads/2025/12/santa-003-900x900.jpg', to: '/shop?category=Christmas Gifts' },
  { name: 'Mobile Cases', image: catMobile, to: '/shop?category=Mobile Cases' },
];

const features = [
  { icon: Truck, title: 'Fast Delivery', desc: 'Pan India Shipping' },
  { icon: Shield, title: 'Secure Payment', desc: '100% Safe Checkout' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Dedicated Help' },
  { icon: Gift, title: 'Gift Wrapping', desc: 'Premium Packaging' },
];

export default function Index() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Products
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbProducts(data.map(p => ({ ...p, id: p._id })));
        }
      })
      .catch(err => console.error('Failed to fetch products:', err));

    // Fetch Categories
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbCategories(data);
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err));

    // Fetch Sections
    fetch(`${API_URL}/home`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHomeSections(data.filter(s => s.active).sort((a, b) => a.order - b.order));
        }
      })
      .catch(err => console.error('Failed to fetch home sections:', err))
      .finally(() => setLoading(false));
  }, []);

  const activeProducts = dbProducts.length > 0 ? dbProducts : staticProducts;

  const displayCategories = dbCategories.length > 0 
    ? dbCategories.map(c => ({ name: c.name, image: c.image, to: `/shop?category=${c.name}` }))
    : categories;

  const getFilteredProducts = (section: any) => {
    switch (section.type) {
      case 'badge':
        return activeProducts.filter(p => p.badge === section.value).slice(0, 8);
      case 'category':
        return activeProducts.filter(p => p.category === section.value).slice(0, 8);
      case 'price':
        return activeProducts.filter(p => p.price <= Number(section.value)).slice(0, 8);
      case 'custom':
      default:
        return activeProducts.slice(0, 8);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Update Gifts Collection" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="py-24 md:py-40 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30">
                1000+ Products · 50+ Categories
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-background leading-tight mb-6">
                Complete Gift{' '}
                <span className="text-primary">Solution</span>
              </h1>
              <p className="text-background/70 text-lg mb-8 max-w-md">
                Direct manufacturing to customer. Personalized gifts crafted with love, delivered across India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/shop?category=Valentine Combos"
                  className="inline-flex items-center gap-2 bg-background/10 text-background px-8 py-3.5 rounded-xl font-semibold backdrop-blur-sm border border-background/20 hover:bg-background/20 transition-colors"
                >
                  Valentine Specials
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-warm border-y border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <SectionTitle title="Shop by Category" subtitle="Browse our curated collections" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={cat.to}
                className="group relative aspect-square rounded-2xl overflow-hidden block"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-sm font-bold text-background leading-tight">{cat.name}</h3>
                  <span className="text-background/70 text-[10px] flex items-center gap-1 mt-1 group-hover:text-primary transition-colors">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Sections */}
      {homeSections.map((section, idx) => {
        const products = getFilteredProducts(section);
        if (products.length === 0) return null;
        
        return (
          <section key={section._id} className={idx % 2 === 0 ? 'bg-warm py-16' : 'py-16'}>
            <div className="container mx-auto px-4">
              <SectionTitle title={section.title} subtitle={section.subtitle}>
                <Link to={section.type === 'category' ? `/shop?category=${section.value}` : '/shop'} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Courier Partners */}
      <section className="container mx-auto px-4 py-16 text-center opacity-70">
        <SectionTitle title="Our Courier Partners" subtitle="Trusted delivery across India" />
        <div className="flex flex-wrap justify-center items-center gap-8">
          {['DTDC', 'Delhivery', 'ShadowFax', 'ST Courier', 'India Post', 'FedEx'].map(name => (
            <div key={name} className="px-6 py-3 rounded-xl bg-secondary text-muted-foreground font-semibold text-sm">
              {name}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
