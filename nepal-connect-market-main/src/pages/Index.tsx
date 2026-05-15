import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, MessageCircle, ChevronRight, Upload, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdCard from '@/components/AdCard';
import BannerCarousel from '@/components/BannerCarousel';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ad } from '@/lib/types';

const Index = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [trendingAds, setTrendingAds] = useState<Ad[]>([]);
  const [latestAds, setLatestAds] = useState<Ad[]>([]);
  const [totalAds, setTotalAds] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchTrendingAds();
    fetchLatestAds();
    fetchStats();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data || []);
  };

  const fetchTrendingAds = async () => {
    const { data } = await supabase.from('ads').select('*').eq('status', 'approved').order('views', { ascending: false }).limit(8);
    setTrendingAds((data as any) || []);
  };

  const fetchLatestAds = async () => {
    const { data } = await supabase.from('ads').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(8);
    setLatestAds((data as any) || []);
  };

  const fetchStats = async () => {
    const { count: adCount } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'approved');
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    setTotalAds(adCount || 0);
    setTotalUsers(userCount || 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main: Sidebar + Banner */}
      <section className="container mx-auto px-4 py-5">
        <div className="flex gap-5">
          {/* Categories Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden sticky top-28">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="text-base">📂</span>
                <h2 className="font-display text-sm font-bold">Categories</h2>
              </div>
              <nav className="py-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/browse?category=${cat.id}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary group"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1 min-w-0">
            {/* Hero Banner Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-5"
            >
              <BannerCarousel />
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Active Listings', value: totalAds.toLocaleString() || '0' },
                { label: 'Trusted Sellers', value: totalUsers.toLocaleString() || '0' },
                { label: 'Cities', value: '25+' },
                { label: 'Categories', value: categories.length.toString() },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-3 text-center shadow-card">
                  <p className="font-display text-xl font-extrabold text-primary">{stat.value}</p>
                  <p className="text-[11px] font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Trending */}
            {trendingAds.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-lg font-bold">Trending</h2>
                  </div>
                  <Link to="/browse" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                  {trendingAds.slice(0, 4).map((ad, i) => (
                    <motion.div key={ad.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                      <AdCard ad={ad} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Categories */}
      {categories.length > 0 && (
        <section className="lg:hidden py-3">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-base font-bold mb-2">Categories</h2>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/browse?category=${cat.id}`}
                  className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-2.5 text-center shadow-card hover:border-primary/20 transition-all">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] font-medium text-muted-foreground leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Uploads / Recommended */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="latest">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="latest" className="gap-1.5 text-xs">
                  <Upload className="h-3.5 w-3.5" /> Latest Uploads
                </TabsTrigger>
                <TabsTrigger value="recommended" className="gap-1.5 text-xs">
                  <ThumbsUp className="h-3.5 w-3.5" /> Recommended
                </TabsTrigger>
              </TabsList>
              <Link to="/browse" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <TabsContent value="latest">
              {latestAds.length > 0 ? (
                <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {latestAds.map((ad, i) => (
                    <motion.div key={ad.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                      <AdCard ad={ad} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="text-5xl mb-3">🛍️</div>
                  <h3 className="font-display text-lg font-bold mb-2">No listings yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Be the first to post an ad!</p>
                  <Link to="/post-ad">
                    <Button className="rounded-xl bg-gradient-hero text-primary-foreground">Post Your First Ad</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="recommended">
              {trendingAds.length > 0 ? (
                <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {trendingAds.map((ad, i) => (
                    <motion.div key={ad.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                      <AdCard ad={ad} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-muted-foreground">
                  <p>No recommendations yet. Browse more to get personalized suggestions.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Why BazaarHub */}
      <section className="py-12 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-2 font-display text-xl font-extrabold md:text-2xl">Why BazaarHub?</h2>
          <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
            Built for Nepal. Trusted by thousands.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Shield, title: 'Verified Sellers', desc: 'Every seller is verified for your safety.' },
              { icon: MessageCircle, title: 'Real-time Chat', desc: 'Negotiate directly through instant messaging.' },
              { icon: TrendingUp, title: 'Best Deals', desc: 'Unbeatable prices across 25+ cities.' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-display text-sm font-bold">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-dark py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 font-display text-xl font-extrabold text-primary-foreground md:text-2xl">
            Ready to sell something?
          </h2>
          <p className="mx-auto mb-5 max-w-sm text-sm text-primary-foreground/50">
            Post your ad in under a minute. Completely free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/post-ad">
              <Button className="gap-1.5 rounded-xl bg-gradient-accent text-secondary-foreground font-semibold hover:opacity-90">
                Post Free Ad <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;