import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, Calendar, MessageCircle, Heart, Share2, Shield, Star, ChevronLeft, Flag } from 'lucide-react';
import { toast } from 'sonner';

const AdDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ad, setAd] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAd();
  }, [id]);

  const fetchAd = async () => {
    const { data } = await supabase.from('ads').select('*').eq('id', id).single();
    if (data) {
      setAd(data);
      // increment views
      await supabase.from('ads').update({ views: (data.views || 0) + 1 }).eq('id', id);
      // fetch seller profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', data.user_id).single();
      setSeller(profile);
    }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!user) { navigate('/login'); return; }
    if (ad.user_id === user.id) { toast.error("You can't chat with yourself"); return; }

    // Find or create thread
    const { data: existing } = await supabase
      .from('chat_threads')
      .select('id')
      .eq('ad_id', ad.id)
      .eq('buyer_id', user.id)
      .eq('seller_id', ad.user_id)
      .maybeSingle();

    if (existing) {
      navigate(`/chat?thread=${existing.id}`);
    } else {
      const { data: newThread, error } = await supabase
        .from('chat_threads')
        .insert({ ad_id: ad.id, buyer_id: user.id, seller_id: ad.user_id })
        .select('id')
        .single();
      if (error) { toast.error('Could not start chat'); return; }
      navigate(`/chat?thread=${newThread.id}`);
    }
  };

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    const { error } = await supabase.from('saved_ads').insert({ user_id: user.id, ad_id: ad.id });
    if (error?.code === '23505') toast.info('Already saved');
    else if (error) toast.error('Could not save');
    else toast.success('Ad saved!');
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>;
  if (!ad) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">Ad not found</h1>
        <Link to="/browse" className="mt-2 text-sm text-primary hover:underline">Browse listings</Link>
      </div>
    </div>
  );

  const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-NP')}`;
  const imageUrl = ad.images?.[0] || '/placeholder.svg';

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/browse" className="flex items-center gap-1 hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border">
              <img src={imageUrl} alt={ad.title} className="aspect-video w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
            </div>
            {ad.images?.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {ad.images.map((img: string, i: number) => (
                  <img key={i} src={img} alt="" className="h-20 w-20 rounded-lg object-cover border border-border" />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="mb-2 flex flex-wrap gap-2">
                {ad.featured && <Badge className="bg-gradient-accent text-secondary-foreground border-0 text-xs"><Star className="mr-1 h-3 w-3" /> Featured</Badge>}
                <Badge variant="secondary">{ad.condition}</Badge>
                {ad.negotiable && <Badge variant="outline">Negotiable</Badge>}
              </div>
              <h1 className="mb-2 font-display text-2xl font-bold">{ad.title}</h1>
              <p className="mb-4 font-display text-3xl font-bold text-primary">{formatPrice(ad.price)}</p>

              <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                {ad.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {ad.location}</div>}
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Posted {new Date(ad.created_at).toLocaleDateString()}</div>
                <div className="flex items-center gap-2"><Eye className="h-4 w-4" /> {ad.views || 0} views</div>
              </div>

              {user?.id !== ad.user_id && (
                <Button onClick={handleChat} className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2">
                  <MessageCircle className="h-4 w-4" /> Chat with Seller
                </Button>
              )}
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={handleSave}>
                  <Heart className="h-4 w-4" /> Save
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1"
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
            </div>

            {seller && (
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="mb-3 font-display text-sm font-semibold">Seller</h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display font-bold text-accent-foreground">
                    {seller.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium">{seller.full_name || 'User'}</p>
                      {seller.verified && <Shield className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Member since {new Date(seller.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold">Description</h2>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{ad.description || 'No description provided.'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;
