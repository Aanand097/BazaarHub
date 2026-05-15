import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  LayoutDashboard, Users, ShoppingBag, Flag, FolderTree,
  Check, X, Ban, Shield, Image, Zap, Plus, Trash2, AlertTriangle, UserX, Crown, Mail, Send, MessageSquare
} from 'lucide-react';

const AdminPanel = () => {
  const { user, isAdmin, session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [ads, setAds] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [bannerForm, setBannerForm] = useState({ title: '', description: '', image_url: '', link_url: '', expiry_days: '' });
  const [bannerUploading, setBannerUploading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiryModal, setInquiryModal] = useState<{ open: boolean; userId: string; userName: string }>({ open: false, userId: '', userName: '' });
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);

  useEffect(() => {
    if (user && isAdmin) fetchAll();
  }, [user, isAdmin]);

  const fetchAll = async () => {
    const [adsRes, usersRes, catsRes, reportsRes, bannersRes, rolesRes, inquiriesRes] = await Promise.all([
      supabase.from('ads').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('ad_reports').select('*, ads(title)').order('created_at', { ascending: false }),
      supabase.from('banners').select('*').order('sort_order'),
      supabase.from('user_roles').select('*'),
      supabase.from('admin_inquiries').select('*').order('created_at', { ascending: false }),
    ]);
    setAds(adsRes.data || []);
    setUsers(usersRes.data || []);
    setCategories(catsRes.data || []);
    setReports(reportsRes.data || []);
    setBanners(bannersRes.data || []);
    setUserRoles(rolesRes.data || []);
    setInquiries(inquiriesRes.data || []);
  };

  const adminAction = async (action: string, userId: string, role?: string) => {
    const { data, error } = await supabase.functions.invoke('admin-manage', {
      body: { action, userId, role },
    });
    if (error || data?.error) {
      toast.error(data?.error || error?.message || 'Action failed');
      return false;
    }
    return true;
  };

  const updateAdStatus = async (adId: string, status: string) => {
    await supabase.from('ads').update({ status }).eq('id', adId);
    toast.success(`Ad ${status}`);
    fetchAll();
  };

  const deleteAd = async (adId: string) => {
    if (!confirm('Delete this ad permanently?')) return;
    const ok = await adminAction('delete_ad', adId);
    if (ok) { toast.success('Ad deleted'); fetchAll(); }
  };

  const toggleAdBoost = async (adId: string, boosted: boolean) => {
    await supabase.from('ads').update({ boosted: !boosted }).eq('id', adId);
    toast.success(boosted ? 'Boost removed' : 'Ad boosted!');
    fetchAll();
  };

  const toggleAdFeatured = async (adId: string, featured: boolean) => {
    await supabase.from('ads').update({ featured: !featured }).eq('id', adId);
    toast.success(featured ? 'Unfeatured' : 'Ad featured!');
    fetchAll();
  };

  const deleteUser = async (userId: string) => {
    if (userId === user?.id) { toast.error("Can't delete yourself"); return; }
    if (!confirm('Delete this user permanently? This will remove all their data.')) return;
    const ok = await adminAction('delete_user', userId);
    if (ok) { toast.success('User deleted'); fetchAll(); }
  };

  const toggleUserRole = async (userId: string, currentRole: string | null) => {
    if (userId === user?.id) { toast.error("Can't change your own role"); return; }
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const ok = await adminAction('set_role', userId, newRole);
    if (ok) { toast.success(`Role changed to ${newRole}`); fetchAll(); }
  };

  const getUserRole = (userId: string) => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || null;
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const { error } = await supabase.from('categories').insert({ name: newCatName.trim(), icon: newCatIcon, sort_order: categories.length });
    if (error) toast.error(error.message);
    else { toast.success('Category added'); setNewCatName(''); fetchAll(); }
  };

  const deleteCategory = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    toast.success('Category deleted');
    fetchAll();
  };

  const resolveReport = async (id: string, status: string) => {
    await supabase.from('ad_reports').update({ status }).eq('id', id);
    toast.success(`Report ${status}`);
    fetchAll();
  };

  const sendInquiry = async () => {
    if (!inquiryMessage.trim()) { toast.error('Please enter a message'); return; }
    setSendingInquiry(true);
    const { data, error } = await supabase.functions.invoke('admin-manage', {
      body: { action: 'send_inquiry', userId: inquiryModal.userId, message: inquiryMessage.trim() },
    });
    setSendingInquiry(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || 'Failed to send');
    } else {
      toast.success(`Message sent to ${inquiryModal.userName}`);
      setInquiryModal({ open: false, userId: '', userName: '' });
      setInquiryMessage('');
      fetchAll();
    }
  };


  const addBanner = async () => {
    if (!bannerForm.title.trim() || !bannerForm.image_url.trim()) {
      toast.error('Title and Image URL are required');
      return;
    }
    const expiryDays = bannerForm.expiry_days ? parseInt(bannerForm.expiry_days) : null;
    let expiresAt: string | null = null;
    if (expiryDays && expiryDays > 0) {
      const d = new Date();
      d.setDate(d.getDate() + expiryDays);
      expiresAt = d.toISOString();
    }
    const { error } = await supabase.from('banners').insert({
      title: bannerForm.title.trim(),
      description: bannerForm.description.trim() || null,
      image_url: bannerForm.image_url.trim(),
      link_url: bannerForm.link_url.trim() || null,
      created_by: user!.id,
      sort_order: banners.length,
      expires_at: expiresAt,
      expiry_days: expiryDays,
      starts_at: new Date().toISOString(),
    });
    if (error) toast.error(error.message);
    else {
      toast.success('Banner added!');
      setBannerForm({ title: '', description: '', image_url: '', link_url: '', expiry_days: '' });
      fetchAll();
    }
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    const ext = file.name.split('.').pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('ad-images').upload(path, file);
    if (error) {
      toast.error('Upload failed: ' + error.message);
      setBannerUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('ad-images').getPublicUrl(path);
    setBannerForm(f => ({ ...f, image_url: urlData.publicUrl }));
    setBannerUploading(false);
    toast.success('Image uploaded!');
  };

  const toggleBanner = async (id: string, isActive: boolean) => {
    await supabase.from('banners').update({ is_active: !isActive }).eq('id', id);
    toast.success(isActive ? 'Banner disabled' : 'Banner enabled');
    fetchAll();
  };

  const deleteBanner = async (id: string) => {
    await supabase.from('banners').delete().eq('id', id);
    toast.success('Banner deleted');
    fetchAll();
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'ads', label: 'Ad Control', icon: ShoppingBag },
    { id: 'boost', label: 'Boost & Featured', icon: Zap },
    { id: 'banners', label: 'Banner Ads', icon: Image },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'categories', label: 'Categories', icon: FolderTree },
  ];

  const pendingAds = ads.filter(a => a.status === 'pending').length;
  const approvedAds = ads.filter(a => a.status === 'approved').length;
  const boostedAds = ads.filter(a => a.boosted).length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const activeBanners = banners.filter(b => b.is_active).length;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:block">
        <div className="p-4">
          <h2 className="font-display text-sm font-bold text-primary">Admin Panel</h2>
          <Badge className="mt-1 bg-gradient-hero text-primary-foreground border-0 text-[10px]">Super Admin</Badge>
        </div>
        <nav className="space-y-0.5 px-2">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                activeTab === item.id ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <item.icon className="h-4 w-4" />{item.label}
              {item.id === 'reports' && pendingReports > 0 && (
                <Badge className="ml-auto bg-destructive text-destructive-foreground border-0 h-5 w-5 p-0 flex items-center justify-center text-[10px]">{pendingReports}</Badge>
              )}
              {item.id === 'banners' && (
                <Badge variant="secondary" className="ml-auto text-[10px]">{activeBanners}</Badge>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <div className="border-b border-border p-4 lg:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {sidebarItems.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="mb-6 font-display text-2xl font-bold">Dashboard Overview</h1>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                {[
                  { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
                  { label: 'Total Ads', value: ads.length, icon: ShoppingBag, color: 'text-foreground' },
                  { label: 'Active Ads', value: approvedAds, icon: Check, color: 'text-success' },
                  { label: 'Pending Ads', value: pendingAds, icon: AlertTriangle, color: 'text-secondary' },
                  { label: 'Total Reports', value: reports.length, icon: Flag, color: 'text-destructive' },
                  { label: 'Active Banners', value: activeBanners, icon: Image, color: 'text-primary' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <p className="mt-3 font-display text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <h3 className="font-display text-sm font-bold mb-3">Ad Status Breakdown</h3>
                  <div className="space-y-2">
                    {['approved', 'pending', 'rejected', 'suspended'].map(s => {
                      const count = ads.filter(a => a.status === s).length;
                      return (
                        <div key={s} className="flex items-center justify-between text-sm">
                          <span className="capitalize text-muted-foreground">{s}</span>
                          <Badge variant="secondary" className="text-xs">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <h3 className="font-display text-sm font-bold mb-3">Report Status</h3>
                  <div className="space-y-2">
                    {['pending', 'resolved', 'dismissed'].map(s => {
                      const count = reports.filter(r => r.status === s).length;
                      return (
                        <div key={s} className="flex items-center justify-between text-sm">
                          <span className="capitalize text-muted-foreground">{s}</span>
                          <Badge variant="secondary" className="text-xs">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <h3 className="font-display text-sm font-bold mb-3">Boost Stats</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Boosted</span>
                      <Badge variant="secondary" className="text-xs">{boostedAds}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Featured</span>
                      <Badge variant="secondary" className="text-xs">{ads.filter(a => a.featured).length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Categories</span>
                      <Badge variant="secondary" className="text-xs">{categories.length}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AD CONTROL */}
          {activeTab === 'ads' && (
            <div>
              <h1 className="mb-6 font-display text-2xl font-bold">Ad Control</h1>
              <div className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="p-3">Ad</th><th className="p-3">Price</th><th className="p-3">Views</th><th className="p-3">Status</th><th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad) => (
                      <tr key={ad.id} className="border-b border-border last:border-0">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img src={ad.images?.[0] || '/placeholder.svg'} alt="" className="h-10 w-10 rounded-lg object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                            <span className="font-medium max-w-[200px] truncate">{ad.title}</span>
                          </div>
                        </td>
                        <td className="p-3">Rs. {Number(ad.price).toLocaleString()}</td>
                        <td className="p-3">{ad.views || 0}</td>
                        <td className="p-3"><Badge variant="secondary" className="text-xs">{ad.status}</Badge></td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-success" onClick={() => updateAdStatus(ad.id, 'approved')} title="Approve"><Check className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-secondary" onClick={() => updateAdStatus(ad.id, 'rejected')} title="Reject"><X className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateAdStatus(ad.id, 'suspended')} title="Suspend"><Ban className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteAd(ad.id)} title="Delete"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {ads.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No ads yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BOOST & FEATURED */}
          {activeTab === 'boost' && (
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold">Boost & Featured Control</h1>
              <p className="mb-4 text-sm text-muted-foreground">Toggle boosted/featured status for ads.</p>
              <a href="https://wa.me/9779766006022?text=Hi%2C%20I%20want%20to%20boost%20my%20product%20on%20BazaarHub"
                target="_blank" rel="noopener noreferrer"
                className="mb-6 inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-600 transition-colors hover:bg-green-500/20">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Contact for Paid Boosting via WhatsApp
              </a>
              <div className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="p-3">Ad</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3 text-center">Boosted</th><th className="p-3 text-center">Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.filter(a => a.status === 'approved').map((ad) => (
                      <tr key={ad.id} className="border-b border-border last:border-0">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img src={ad.images?.[0] || '/placeholder.svg'} alt="" className="h-10 w-10 rounded-lg object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                            <div>
                              <span className="font-medium max-w-[200px] truncate block">{ad.title}</span>
                              <span className="text-xs text-muted-foreground">{ad.views || 0} views</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">Rs. {Number(ad.price).toLocaleString()}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {ad.boosted && <Badge className="bg-warning/10 text-warning border-0 text-[10px]"><Zap className="h-2.5 w-2.5 mr-0.5" />Boosted</Badge>}
                            {ad.featured && <Badge className="bg-primary/10 text-primary border-0 text-[10px]">★ Featured</Badge>}
                            {!ad.boosted && !ad.featured && <span className="text-xs text-muted-foreground">Standard</span>}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Switch checked={ad.boosted || false} onCheckedChange={() => toggleAdBoost(ad.id, ad.boosted)} />
                        </td>
                        <td className="p-3 text-center">
                          <Switch checked={ad.featured || false} onCheckedChange={() => toggleAdFeatured(ad.id, ad.featured)} />
                        </td>
                      </tr>
                    ))}
                    {ads.filter(a => a.status === 'approved').length === 0 && (
                      <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No approved ads to boost</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BANNER ADS */}
          {activeTab === 'banners' && (
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold">Banner Ad Management</h1>
              <p className="mb-6 text-sm text-muted-foreground">Manage sponsored banners shown on the homepage carousel.</p>
              <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
                <h3 className="font-display text-sm font-bold flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New Banner
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Banner title *" value={bannerForm.title}
                    onChange={(e) => setBannerForm(f => ({ ...f, title: e.target.value }))} />
                  <div className="flex gap-2">
                    <Input placeholder="Image URL *" value={bannerForm.image_url}
                      onChange={(e) => setBannerForm(f => ({ ...f, image_url: e.target.value }))} className="flex-1" />
                    <label className="shrink-0">
                      <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageUpload} />
                      <Button type="button" variant="outline" size="sm" className="h-10 gap-1" asChild disabled={bannerUploading}>
                        <span>{bannerUploading ? 'Uploading...' : 'Upload'}</span>
                      </Button>
                    </label>
                  </div>
                  <Input placeholder="Link URL (optional)" value={bannerForm.link_url}
                    onChange={(e) => setBannerForm(f => ({ ...f, link_url: e.target.value }))} />
                  <Input placeholder="Description (optional)" value={bannerForm.description}
                    onChange={(e) => setBannerForm(f => ({ ...f, description: e.target.value }))} />
                  <Input placeholder="Expiry in days (e.g. 7)" type="number" min="1" value={bannerForm.expiry_days}
                    onChange={(e) => setBannerForm(f => ({ ...f, expiry_days: e.target.value }))} />
                </div>
                {bannerForm.image_url && (
                  <img src={bannerForm.image_url} alt="Preview" className="h-24 w-40 rounded-lg object-cover border border-border" />
                )}
                <Button onClick={addBanner} className="bg-gradient-hero text-primary-foreground">
                  <Plus className="h-4 w-4 mr-1" /> Add Banner
                </Button>
              </div>
              <div className="space-y-3">
                {banners.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                    <Image className="mx-auto mb-3 h-8 w-8" />
                    <p>No banners yet. Add your first banner above.</p>
                  </div>
                ) : (
                  banners.map((b) => {
                    const isExpired = b.expires_at && new Date(b.expires_at) < new Date();
                    const remainingDays = b.expires_at
                      ? Math.max(0, Math.ceil((new Date(b.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                      : null;
                    return (
                      <div key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center gap-4">
                        <img src={b.image_url} alt={b.title} className="h-20 w-32 rounded-lg object-cover bg-muted shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-display text-sm font-bold truncate">{b.title}</h4>
                            {isExpired ? (
                              <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]">Expired</Badge>
                            ) : b.is_active ? (
                              <Badge className="bg-success/10 text-success border-0 text-[10px]">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">Inactive</Badge>
                            )}
                          </div>
                          {b.description && <p className="text-xs text-muted-foreground truncate">{b.description}</p>}
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                            {remainingDays !== null && !isExpired && (
                              <span className="text-primary font-medium">{remainingDays} days remaining</span>
                            )}
                            {b.expires_at && (
                              <span>Expires: {new Date(b.expires_at).toLocaleDateString()}</span>
                            )}
                            {!b.expires_at && <span>No expiry set</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex flex-col items-center gap-0.5">
                            <Switch checked={b.is_active} onCheckedChange={() => toggleBanner(b.id, b.is_active)} />
                            <span className="text-[10px] text-muted-foreground">{b.is_active ? 'On' : 'Off'}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteBanner(b.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold">User Management</h1>
              <p className="mb-6 text-sm text-muted-foreground">{users.length} registered users. Manage roles and accounts.</p>
              <div className="rounded-xl border border-border bg-card shadow-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="p-3">User</th><th className="p-3">Location</th><th className="p-3">Role</th><th className="p-3">Verified</th><th className="p-3">Joined</th><th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const role = getUserRole(u.user_id);
                      const isSelf = u.user_id === user?.id;
                      return (
                        <tr key={u.id} className="border-b border-border last:border-0">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-display text-xs font-bold text-accent-foreground">
                                {u.full_name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <span className="font-medium">{u.full_name || 'Unknown'}</span>
                                {isSelf && <Badge variant="outline" className="ml-2 text-[10px]">You</Badge>}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground">{u.location || '-'}</td>
                          <td className="p-3">
                            {role === 'admin' ? (
                              <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]"><Crown className="h-2.5 w-2.5 mr-0.5" />Admin</Badge>
                            ) : role === 'moderator' ? (
                              <Badge className="bg-warning/10 text-warning border-0 text-[10px]">Moderator</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">User</Badge>
                            )}
                          </td>
                          <td className="p-3">{u.verified ? <Shield className="h-4 w-4 text-primary" /> : '-'}</td>
                          <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" title="Send message"
                                onClick={() => setInquiryModal({ open: true, userId: u.user_id, userName: u.full_name || 'User' })} disabled={isSelf}>
                                <Send className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" title={role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                                onClick={() => toggleUserRole(u.user_id, role)} disabled={isSelf}>
                                <Crown className={`h-3 w-3 ${role === 'admin' ? 'text-destructive' : 'text-primary'}`} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Delete user"
                                onClick={() => deleteUser(u.user_id)} disabled={isSelf}>
                                <UserX className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {users.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No users yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS */}
          {activeTab === 'reports' && (
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold">Reports</h1>
              <p className="mb-6 text-sm text-muted-foreground">{pendingReports} pending reports out of {reports.length} total.</p>
              {reports.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">No reports</div>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Report: {r.reason}</p>
                        <p className="text-xs text-muted-foreground">Ad: {r.ads?.title || 'Deleted'} · {r.description}</p>
                        <Badge variant={r.status === 'pending' ? 'destructive' : 'secondary'} className="mt-1 text-xs">{r.status}</Badge>
                      </div>
                      {r.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => resolveReport(r.id, 'resolved')}>Resolve</Button>
                          <Button size="sm" variant="ghost" onClick={() => resolveReport(r.id, 'dismissed')}>Dismiss</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES */}
          {activeTab === 'categories' && (
            <div>
              <h1 className="mb-6 font-display text-2xl font-bold">Categories</h1>
              <div className="mb-6 flex gap-2 rounded-xl border border-border bg-card p-4 shadow-card">
                <Input placeholder="Category name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="flex-1" />
                <Input placeholder="Icon" value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} className="w-16" />
                <Button onClick={addCategory} className="bg-gradient-hero text-primary-foreground">Add</Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <p className="font-medium">{cat.name}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteCategory(cat.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold">Inquiries / Messages</h1>
              <p className="mb-6 text-sm text-muted-foreground">Messages sent to users from admin. {inquiries.length} total.</p>
              {inquiries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto mb-3 h-8 w-8" />
                  <p>No inquiries sent yet. Go to Users tab to send a message.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => {
                    const receiver = users.find(u => u.user_id === inq.receiver_id);
                    return (
                      <div key={inq.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">To: {receiver?.full_name || 'Unknown'}</span>
                            {inq.read ? (
                              <Badge variant="secondary" className="text-[10px]">Read</Badge>
                            ) : (
                              <Badge className="bg-warning/10 text-warning border-0 text-[10px]">Unread</Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{new Date(inq.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{inq.message}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Send Inquiry Modal */}
      <Dialog open={inquiryModal.open} onOpenChange={(open) => { if (!open) { setInquiryModal({ open: false, userId: '', userName: '' }); setInquiryMessage(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {inquiryModal.userName}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Type your message to this user..."
            value={inquiryMessage}
            onChange={(e) => setInquiryMessage(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setInquiryModal({ open: false, userId: '', userName: '' }); setInquiryMessage(''); }}>Cancel</Button>
            <Button onClick={sendInquiry} disabled={sendingInquiry || !inquiryMessage.trim()} className="gap-1 bg-gradient-hero text-primary-foreground">
              <Send className="h-4 w-4" /> {sendingInquiry ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
