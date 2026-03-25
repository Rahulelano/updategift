import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Trash2, Eye, EyeOff, LayoutPanelTop, ShoppingBag, Save, X, GripVertical } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { API_URL, BASE_URL } from '@/lib/api';

type Tab = 'orders' | 'products' | 'home' | 'categories';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    image: '',
    images: [] as string[],
    videoUrl: '',
    category: 'MDF Gifts',
    description: '',
    badge: '',
    variants: [] as { label: string; price: number }[],
    allowImageUpload: true
  });

  // Category Form State
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    image: '',
    description: '',
    order: 0,
    active: true
  });

  // Home Section Form State
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionForm, setSectionForm] = useState({
    title: '',
    subtitle: '',
    type: 'category',
    value: '',
    active: true,
    order: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchHomeSections();
    fetchCategories();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      if (activeTab === 'orders') setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      if (activeTab === 'products') setLoading(false);
    }
  };

  const fetchHomeSections = async () => {
    try {
      const res = await fetch(`${API_URL}/home`);
      const data = await res.json();
      if (res.ok) setHomeSections(data);
    } catch (err) {
      toast.error('Failed to fetch home sections');
    } finally {
      if (activeTab === 'home') setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      if (res.ok) setCategories(data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success('Status updated');
        fetchOrders();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products${editingProduct ? `/${editingProduct._id}` : ''}`, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
        setShowAddForm(false);
        setEditingProduct(null);
        fetchProducts();
        setNewProduct({ name: '', price: 0, originalPrice: 0, image: '', images: [], videoUrl: '', category: 'MDF Gifts', description: '', badge: '', variants: [], allowImageUpload: true });
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to save product');
      }
    } catch (err) {
      toast.error('Connection error');
    }
  };

  const editProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      images: product.images || [],
      videoUrl: product.videoUrl || '',
      category: product.category,
      description: product.description || '',
      badge: product.badge || '',
      variants: product.variants || [],
      allowImageUpload: product.allowImageUpload !== undefined ? product.allowImageUpload : true
    });
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const toggleProductStatus = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Product status updated');
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to update product status');
    }
  };

  // Home Section Handlers
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/home`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(editingSection ? { ...sectionForm, _id: editingSection._id } : sectionForm)
      });
      if (res.ok) {
        toast.success(editingSection ? 'Section updated' : 'Section created');
        setShowSectionForm(false);
        setEditingSection(null);
        fetchHomeSections();
      }
    } catch (err) {
      toast.error('Failed to save section');
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    try {
      const res = await fetch(`${API_URL}/home/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Section deleted');
        fetchHomeSections();
      }
    } catch (err) {
      toast.error('Failed to delete section');
    }
  };

  const editSection = (section: any) => {
    setEditingSection(section);
    setSectionForm({
      title: section.title,
      subtitle: section.subtitle || '',
      type: section.type,
      value: section.value,
      active: section.active,
      order: section.order
    });
    setShowSectionForm(true);
  };

  // Category Handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(editingCategory ? { ...catForm, _id: editingCategory._id } : catForm)
      });
      if (res.ok) {
        toast.success(editingCategory ? 'Category updated' : 'Category created');
        setShowCatForm(false);
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Category deleted');
        fetchCategories();
      }
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const editCategory = (category: any) => {
    setEditingCategory(category);
    setCatForm({
      name: category.name,
      image: category.image || '',
      description: category.description || '',
      order: category.order || 0,
      active: category.active
    });
    setShowCatForm(true);
  };

  const uploadFile = async (file: File, multiple = false) => {
    const formData = new FormData();
    if (multiple) {
      formData.append('images', file); 
    } else {
      formData.append('image', file);
    }

    try {
      const res = await fetch(`${API_URL}/upload${multiple ? '/multiple' : ''}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        return multiple ? data.urls[0] : data.url;
      } else {
        toast.error(data.message || 'Upload failed. Check Cloudinary settings.');
        return null;
      }
    } catch (err) {
      toast.error('Upload error');
      return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store operations</p>
          </div>
          <div className="flex bg-secondary p-1 rounded-xl overflow-x-auto">
            {['orders', 'products', 'home', 'categories'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {activeTab === 'home' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">Manage Home Page Sections</h2>
              <button 
                onClick={() => { setShowSectionForm(true); setEditingSection(null); setSectionForm({title: '', subtitle: '', type: 'category', value: '', active: true, order: homeSections.length}); }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add Section
              </button>
            </div>

            {showSectionForm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-6 rounded-2xl shadow-card mb-8 border border-primary/20"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">{editingSection ? 'Edit Section' : 'New Home Section'}</h3>
                  <button onClick={() => setShowSectionForm(false)} className="p-1 hover:bg-secondary rounded-full"><X className="h-4 w-4" /></button>
                </div>
                <form onSubmit={handleSaveSection} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Section Title</label>
                    <input 
                      required
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={sectionForm.title}
                      onChange={e => setSectionForm({...sectionForm, title: e.target.value})}
                      placeholder="e.g. Trending Products"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Subtitle</label>
                    <input 
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={sectionForm.subtitle}
                      onChange={e => setSectionForm({...sectionForm, subtitle: e.target.value})}
                      placeholder="e.g. Most popular items"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Display Type</label>
                    <select 
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm font-medium"
                      value={sectionForm.type}
                      onChange={e => setSectionForm({...sectionForm, type: e.target.value as any})}
                    >
                      <option value="category">By Category</option>
                      <option value="badge">By Badge (Trending/Sale)</option>
                      <option value="price">By Price (Budget)</option>
                      <option value="custom">All Products</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Value (Category Name / Price Limit / Badge Name)</label>
                    <input 
                      required
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={sectionForm.value}
                      onChange={e => setSectionForm({...sectionForm, value: e.target.value})}
                      placeholder="e.g. Valentine Combos or 500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Display Order</label>
                    <input 
                      type="number"
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={sectionForm.order}
                      onChange={e => setSectionForm({...sectionForm, order: Number(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input 
                      type="checkbox"
                      id="active-check"
                      checked={sectionForm.active}
                      onChange={e => setSectionForm({...sectionForm, active: e.target.checked})}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="active-check" className="text-sm font-bold">Active</label>
                  </div>
                  <div className="lg:col-span-3 flex justify-end gap-3 pt-4 border-t border-border">
                    <button type="submit" className="bg-primary text-primary-foreground px-8 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                      <Save className="h-4 w-4" /> {editingSection ? 'Update Section' : 'Create Section'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeSections.map((section: any) => (
                <div key={section._id} className="bg-card p-6 rounded-2xl shadow-soft border border-border group relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{section.title}</h3>
                      <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${section.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {section.active ? 'Active' : 'Hidden'}
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <p className="text-xs flex items-center gap-2 text-muted-foreground">
                      <span className="font-bold text-foreground">Type:</span> {section.type}
                    </p>
                    <p className="text-xs flex items-center gap-2 text-muted-foreground">
                      <span className="font-bold text-foreground">Value:</span> {section.value}
                    </p>
                    <p className="text-xs flex items-center gap-2 text-muted-foreground">
                      <span className="font-bold text-foreground">Order:</span> {section.order}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editSection(section)} className="flex-1 bg-secondary hover:bg-primary/10 hover:text-primary py-2 rounded-lg text-xs font-bold transition-colors">Edit</button>
                    <button onClick={() => handleDeleteSection(section._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : activeTab === 'categories' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">Manage Categories</h2>
              <button 
                onClick={() => { setShowCatForm(true); setEditingCategory(null); setCatForm({name: '', image: '', description: '', order: categories.length, active: true}); }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add Category
              </button>
            </div>

            {showCatForm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-6 rounded-2xl shadow-card mb-8 border border-primary/20"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                  <button onClick={() => setShowCatForm(false)} className="p-1 hover:bg-secondary rounded-full"><X className="h-4 w-4" /></button>
                </div>
                <form onSubmit={handleSaveCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Category Name</label>
                    <input 
                      required
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={catForm.name}
                      onChange={e => setCatForm({...catForm, name: e.target.value})}
                      placeholder="e.g. Personal Gifts"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Display Order</label>
                    <input 
                      type="number"
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={catForm.order}
                      onChange={e => setCatForm({...catForm, order: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground">Category Image (URL or Upload)</label>
                    <div className="flex gap-2">
                      <input 
                        required
                        className="flex-1 bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                        value={catForm.image}
                        onChange={e => setCatForm({...catForm, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                      <label className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 flex items-center">
                        Upload
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await uploadFile(e.target.files[0]);
                              if (url) setCatForm({...catForm, image: url});
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground">Description</label>
                    <textarea 
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      rows={2}
                      value={catForm.description}
                      onChange={e => setCatForm({...catForm, description: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-border">
                    <button type="submit" className="bg-primary text-primary-foreground px-8 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                      <Save className="h-4 w-4" /> {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat: any) => (
                <div key={cat._id} className="bg-card p-4 rounded-2xl shadow-soft border border-border group relative overflow-hidden">
                  <div className="aspect-video rounded-xl overflow-hidden mb-3">
                    <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 mb-4">{cat.description || 'No description'}</p>
                  <div className="flex gap-2">
                    <button onClick={() => editCategory(cat)} className="flex-1 bg-secondary hover:bg-primary/10 hover:text-primary py-1.5 rounded-lg text-[10px] font-bold transition-colors">Edit</button>
                    <button onClick={() => handleDeleteCategory(cat._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : activeTab === 'orders' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-6 rounded-2xl shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl"><Package className="h-6 w-6 text-primary" /></div>
                  <div><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-2xl font-bold">{orders.length}</p></div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-bold text-lg">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-secondary/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order: any) => (
                      <tr key={order._id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">#{order._id.slice(-6)}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-foreground">{order.user?.name || order.guestInfo?.name}</div>
                          <div className="text-xs text-muted-foreground">{order.shippingLocation}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold font-body">₹{order.total}</td>
                        <td className="px-6 py-4">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="bg-secondary text-xs font-bold rounded-lg px-2 py-1 border-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">Manage Products</h2>
              <div className="flex gap-2">
                <label className="bg-secondary text-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-semibold cursor-pointer hover:bg-secondary/80">
                  <Plus className="h-4 w-4" /> Import CSV
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".csv"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          const res = await fetch(`${API_URL}/products/import`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                            body: formData
                          });
                          const data = await res.json();
                          if (res.ok) {
                            toast.success(data.message);
                            fetchProducts();
                          } else {
                            toast.error(data.message);
                          }
                        } catch (err) {
                          toast.error('Import failed');
                        }
                      }
                    }}
                  />
                </label>
                <button 
                  onClick={() => { setShowAddForm(!showAddForm); setEditingProduct(null); if(!showAddForm) setNewProduct({ name: '', price: 0, originalPrice: 0, image: '', images: [], videoUrl: '', category: 'MDF Gifts', description: '', badge: '', variants: [], allowImageUpload: true }); }}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:opacity-90"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>
            </div>

            {showAddForm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-6 rounded-2xl shadow-card mb-8 border border-primary/20"
              >
                <h3 className="font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Product Name</label>
                    <input 
                      required
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Price (₹)</label>
                    <input 
                      required
                      type="number"
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Original Price (optional)</label>
                    <input 
                      type="number"
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={newProduct.originalPrice}
                      onChange={e => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground">Main Image (URL or Upload)</label>
                    <div className="flex gap-2">
                      <input 
                        required
                        className="flex-1 bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                        value={newProduct.image}
                        onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      />
                      <label className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-primary/20 flex items-center">
                        Upload
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await uploadFile(e.target.files[0]);
                            if (url) setNewProduct({...newProduct, image: url});
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1 lg:col-span-3">
                    <label className="text-xs font-bold text-muted-foreground">Gallery Images (Upload multiple)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newProduct.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} className="h-12 w-12 object-cover rounded-lg border border-border" />
                          <button 
                            type="button"
                            onClick={() => setNewProduct({...newProduct, images: newProduct.images.filter((_, idx) => idx !== i)})}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </div>
                      ))}
                      <label className="h-12 w-12 flex items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <input type="file" className="hidden" accept="image/*" multiple onChange={async (e) => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files);
                            const urls = await Promise.all(files.map(f => uploadFile(f, true)));
                            setNewProduct({...newProduct, images: [...newProduct.images, ...urls.filter(u => u)]});
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Video URL (YouTube/Direct)</label>
                    <input 
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      value={newProduct.videoUrl}
                      onChange={e => setNewProduct({...newProduct, videoUrl: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Category</label>
                    <select 
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm font-medium"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="MDF Gifts">MDF Gifts (Legacy)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Badge (Trending Section)</label>
                    <select 
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm font-medium"
                      value={newProduct.badge}
                      onChange={e => setNewProduct({...newProduct, badge: e.target.value})}
                    >
                      <option value="">None</option>
                      <option value="Trending">Trending</option>
                      <option value="Sale">Sale</option>
                      <option value="Hot">Hot</option>
                      <option value="New">New</option>
                    </select>
                  </div>
                  <div className="space-y-1 lg:col-span-3">
                    <label className="text-xs font-bold text-muted-foreground">Description</label>
                    <textarea 
                      className="w-full bg-secondary border-none rounded-lg px-3 py-2 text-sm"
                      rows={3}
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="lg:col-span-3 bg-secondary/30 p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold">Frame Sizes / Prices</h4>
                      <button 
                        type="button"
                        onClick={() => setNewProduct({...newProduct, variants: [...newProduct.variants, { label: '', price: 0 }]})}
                        className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20 flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Size
                      </button>
                    </div>
                    
                    {newProduct.variants.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic text-center py-2">No variants added. Base price will be used.</p>
                    ) : (
                      <div className="space-y-2">
                        {newProduct.variants.map((variant, index) => (
                          <div key={index} className="flex gap-2 items-end animate-in fade-in slide-in-from-top-1">
                            <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Size Label (e.g. 8x12)</label>
                              <input 
                                className="w-full bg-background border-border rounded-lg px-3 py-1.5 text-sm"
                                value={variant.label}
                                onChange={e => {
                                  const v = [...newProduct.variants];
                                  v[index].label = e.target.value;
                                  setNewProduct({...newProduct, variants: v});
                                }}
                                placeholder="8 x 12"
                              />
                            </div>
                            <div className="w-32 space-y-1">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Price (₹)</label>
                              <input 
                                type="number"
                                className="w-full bg-background border-border rounded-lg px-3 py-1.5 text-sm"
                                value={variant.price}
                                onChange={e => {
                                  const v = [...newProduct.variants];
                                  v[index].price = Number(e.target.value);
                                  setNewProduct({...newProduct, variants: v});
                                }}
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => setNewProduct({...newProduct, variants: newProduct.variants.filter((_, i) => i !== index)})}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-3 flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="allow-upload"
                      checked={newProduct.allowImageUpload}
                      onChange={e => setNewProduct({...newProduct, allowImageUpload: e.target.checked})}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="allow-upload" className="text-sm font-bold">Enable User Image Upload for this product</label>
                  </div>

                  <div className="lg:col-span-3 flex justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 text-sm font-semibold hover:bg-secondary rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-primary text-primary-foreground px-8 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
                    >
                      {editingProduct ? 'Update Product' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-secondary/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product: any) => (
                      <tr key={product._id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4">
                          <img src={product.image} className="h-10 w-10 object-cover rounded-lg" alt={product.name} />
                        </td>
                        <td className="px-6 py-4 text-sm font-bold">{product.name}</td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-bold font-body">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => toggleProductStatus(product._id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                          >
                            {product.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            {product.active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button 
                            onClick={() => editProduct(product)}
                            className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
