import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutList } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { API_URL } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SectionTitle from '@/components/SectionTitle';
import { products as staticProducts, categories as staticCats } from '@/lib/products';

type SortOption = 'popular' | 'price-low' | 'price-high' | 'newest';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [gridCols, setGridCols] = useState<2 | 3>(3);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbProducts(data.map(p => ({ ...p, id: p._id })));
        }
      })
      .catch(err => console.error('Failed to fetch products:', err));

    fetch(`${API_URL}/categories`)
       .then(res => res.json())
       .then(data => {
         if (Array.isArray(data)) setDbCategories(data);
       })
       .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const activeProducts = dbProducts.length > 0 ? dbProducts : staticProducts;
  const activeCategories = dbCategories.length > 0 
    ? ['All', ...dbCategories.map(c => c.name)]
    : staticCats;

  const filtered = useMemo(() => {
    let result = [...activeProducts];
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.reverse();
        break;
    }

    return result;
  }, [selectedCategory, sortBy, searchParam, activeProducts]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Shop</span>
          {selectedCategory !== 'All' && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium">{selectedCategory}</span>
            </>
          )}
        </div>

        <SectionTitle
          title={searchParam ? `Results for "${searchParam}"` : selectedCategory === 'All' ? 'All Products' : selectedCategory}
          subtitle={`${filtered.length} products found`}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-60 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-foreground">
                <SlidersHorizontal className="w-5 h-5" />
                <h3 className="font-display font-semibold">Categories</h3>
              </div>
              <div className="flex flex-row lg:flex-col flex-wrap gap-2">
                {activeCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="bg-secondary text-foreground text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="popular">Sort by Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded-lg ${gridCols === 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-2 rounded-lg ${gridCols === 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className={`grid grid-cols-2 ${gridCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No products found.</p>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="mt-4 text-primary font-semibold hover:underline"
                >
                  Browse all products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
