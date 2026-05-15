import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AdCard from '@/components/AdCard';
import { supabase } from '@/integrations/supabase/client';
import { Ad } from '@/lib/types';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAds();
  }, [search, selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data || []);
  };

  const fetchAds = async () => {
    setLoading(true);
    let query = supabase.from('ads').select('*').eq('status', 'approved');

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (sortBy === 'price-low') query = query.order('price', { ascending: true });
    else if (sortBy === 'price-high') query = query.order('price', { ascending: false });
    else if (sortBy === 'popular') query = query.order('views', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data } = await query.limit(50);
    setAds((data as any) || []);
    setLoading(false);
  };

  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 font-display text-2xl font-bold">Browse Listings</h1>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search listings..." className="pl-10" value={search}
                onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedCategory !== 'all' && selectedCategoryName && (
            <div className="mt-3 flex gap-2">
              <Badge variant="secondary" className="gap-1">
                {selectedCategoryName}
                <button onClick={() => setSelectedCategory('all')}><X className="h-3 w-3" /></button>
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <p className="mb-4 text-sm text-muted-foreground">{ads.length} listings found</p>
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading...</div>
        ) : ads.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No listings found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or post the first ad!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
