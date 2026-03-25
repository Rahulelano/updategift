import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Minus, Plus, Truck, RotateCcw, Shield, Upload, X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { API_URL } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { products as staticProducts } from '@/lib/products';
import { useCart } from '@/lib/store';
import { toast } from 'sonner';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [customizations, setCustomizations] = useState<Record<string, any>>({});
  const [uploadingImages, setUploadingImages] = useState<Record<string, File[]>>({});
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Fetch all to find related and current
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (res.ok) {
        setDbProducts(data);
          const p = data.find((item: any) => item._id === id);
        if (p) {
          const mapped = { ...p, id: p._id };
          setProduct(mapped);
          setActiveImage(p.image);
          if (p.variants && p.variants.length > 0) {
            setSelectedVariant(p.variants[0]);
          }
        } else {
          // Fallback to static
          const sp = staticProducts.find(item => item.id === id);
          if (sp) {
            setProduct(sp);
            setActiveImage(sp.image);
          }
        }
      }
    } catch (err) {
      // Fallback to static
      const sp = staticProducts.find(item => item.id === id);
      if (sp) {
        setProduct(sp);
        setActiveImage(sp.image);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="py-40 text-center font-bold">Loading product...</div></Layout>;

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-primary font-semibold hover:underline">Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const allRelated = dbProducts.length > 0 ? dbProducts : staticProducts;
  const related = allRelated.filter(p => p.category === product.category && (p._id || p.id) !== (product._id || product.id)).slice(0, 4);

  const handleImageUpload = (label: string, e: React.ChangeEvent<HTMLInputElement>, maxPhotos = 1) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = uploadingImages[label] || [];
    const updatedFiles = [...currentFiles, ...files].slice(0, maxPhotos);
    
    setUploadingImages(prev => ({ ...prev, [label]: updatedFiles }));
    const urls = updatedFiles.map(f => URL.createObjectURL(f));
    setCustomizations(prev => ({ ...prev, [label]: urls }));
  };

  const removeImage = (label: string, index: number) => {
    const updatedFiles = (uploadingImages[label] || []).filter((_, i) => i !== index);
    setUploadingImages(prev => ({ ...prev, [label]: updatedFiles }));
    const urls = updatedFiles.map(f => URL.createObjectURL(f));
    setCustomizations(prev => ({ ...prev, [label]: urls }));
  };

  const handleAdd = () => {
    if (product.customFields) {
      for (const field of product.customFields) {
        if (field.required && !customizations[field.label]) {
          toast.error(`Please provide ${field.label}`);
          return;
        }
      }
    }
    const cartItem = { 
      ...product, 
      id: product._id || product.id,
      price: selectedVariant ? selectedVariant.price : product.price,
      selectedVariant: selectedVariant 
    };
    addToCart(cartItem, qty, customizations);
    toast.success(`${product.name} added to cart!`);
  };

  const gallery = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images Gallery */}
          <div className="space-y-4">
            <motion.div
              layoutId="main-image"
              className="aspect-square rounded-2xl overflow-hidden bg-secondary relative"
            >
              {activeImage.includes('video') || (product.videoUrl && activeImage === product.videoUrl) ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                   <iframe 
                    src={product.videoUrl?.replace('watch?v=', 'embed/')} 
                    className="w-full h-full" 
                    title="Product Video"
                    allowFullScreen 
                  />
                </div>
              ) : (
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-500 pointer-events-none select-none" 
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{product.badge}</span>
              )}
            </motion.div>
            
            {gallery.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {gallery.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
                {product.videoUrl && (
                   <button 
                    onClick={() => setActiveImage(product.videoUrl)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-black/10 ${activeImage === product.videoUrl ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Play className="w-6 h-6 text-primary" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm text-primary font-medium mb-2">{product.category}</span>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="font-body text-4xl font-bold text-primary">₹{(selectedVariant ? selectedVariant.price : product.price).toLocaleString()}</span>
              {product.originalPrice && !selectedVariant && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="px-2 py-1 rounded-lg bg-sale/10 text-sale text-sm font-bold">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description || 'A beautiful, handcrafted personalized gift perfect for any occasion.'}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <label className="text-sm font-bold text-foreground mb-3 block">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.label}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${selectedVariant?.label === v.label ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/50'}`}
                    >
                      {v.label} - ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.customFields && product.customFields.length > 0 && (
              <div className="space-y-6 mb-8 bg-secondary/30 p-6 rounded-2xl border border-border/50">
                <h3 className="font-display font-bold text-foreground">Customize Your Order</h3>
                <div className="grid grid-cols-1 gap-4">
                  {product.customFields.map((field: any) => (
                    <div key={field.label} className="space-y-2">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                        {field.label} {field.required && <span className="text-sale">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          onChange={(e) => setCustomizations(prev => ({ ...prev, [field.label]: e.target.value }))}
                        />
                      )}
                      
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          onChange={(e) => setCustomizations(prev => ({ ...prev, [field.label]: e.target.value }))}
                        />
                      )}
                      
                      {field.type === 'image' && (
                        <div className="space-y-3">
                          <div className="relative group">
                            <input
                              type="file"
                              multiple={field.maxPhotos ? field.maxPhotos > 1 : false}
                              accept="image/*"
                              className="hidden"
                              id={`file-${field.label}`}
                              onChange={(e) => handleImageUpload(field.label, e, field.maxPhotos)}
                            />
                            <label
                              htmlFor={`file-${field.label}`}
                              className="flex flex-col items-center justify-center gap-2 w-full aspect-[4/1.5] border-2 border-dashed border-border rounded-xl bg-card hover:bg-secondary/50 hover:border-primary/50 cursor-pointer transition-all transition-colors"
                            >
                              <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-foreground">Choose files</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Max {field.maxPhotos || 1} Photo(s)</p>
                              </div>
                            </label>
                          </div>
                          
                          {customizations[field.label] && customizations[field.label].length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                              {customizations[field.label].map((url: string, idx: number) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                  <button
                                    onClick={() => removeImage(field.label, idx)}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                  >
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.allowImageUpload && (!product.customFields || !product.customFields.some((f: any) => f.type === 'image')) && (
               <div className="space-y-6 mb-8 bg-secondary/30 p-6 rounded-2xl border border-border/50">
                <h3 className="font-display font-bold text-foreground">Upload Your Photos</h3>
                <div className="space-y-3">
                  <div className="relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="default-upload"
                      onChange={(e) => handleImageUpload('User Photos', e, 10)}
                    />
                    <label
                      htmlFor="default-upload"
                      className="flex flex-col items-center justify-center gap-2 w-full aspect-[4/1.5] border-2 border-dashed border-border rounded-xl bg-card hover:bg-secondary/50 hover:border-primary/50 cursor-pointer transition-all transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Click to upload photos</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Upload images for personalization</p>
                      </div>
                    </label>
                  </div>
                  
                  {customizations['User Photos'] && customizations['User Photos'].length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                      {customizations['User Photos'].map((url: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage('User Photos', idx)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-secondary rounded-xl">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3 text-muted-foreground hover:text-foreground"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-semibold text-foreground">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="p-3 text-muted-foreground hover:text-foreground"><Plus className="w-4 h-4" /></button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Pan India' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '7 Days' },
                { icon: Shield, label: 'Secure Pay', sub: 'UPI/Cards' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center text-center gap-1.5 py-3">
                  <div className="p-2 bg-primary/5 rounded-full"><item.icon className="w-5 h-5 text-primary" /></div>
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p._id || p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
