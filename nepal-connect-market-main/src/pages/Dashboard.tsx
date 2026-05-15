import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Eye, Heart, Star, LogOut, Pencil, Save, X, Trash2, Mail, Bell, MessageCircle, Shield } from 'lucide-react';
import AdCard from '@/components/AdCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Ad } from '@/lib/types';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const { user, profile, signOut, session } = useAuth();
  const navigate = useNavigate();
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [savedAds, setSavedAds] = useState<Ad[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', location: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [chatThreads, setChatThreads] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchMyAds();
      fetchSavedAds();
      fetchInquiries();
      fetchChatThreads();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const fetchMyAds = async () => {
    if (!user) return;
    const { data } = await supabase.from('ads').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setMyAds((data as any) || []);
  };

  const fetchSavedAds = async () => {
    if (!user) return;
    const { data } = await supabase.from('saved_ads').select('ad_id').eq('user_id', user.id);
    if (data && data.length > 0) {
      const adIds = data.map(s => s.ad_id);
      const { data: ads } = await supabase.from('ads').select('*').in('id', adIds);
      setSavedAds((ads as any) || []);
    }
  };

  const fetchInquiries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('admin_inquiries')
      .select('*')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });
    setInquiries(data || []);
  };

  const fetchChatThreads = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('chat_threads')
      .select('*, ads(title, images)')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('updated_at', { ascending: false })
      .limit(5);
    
    if (data) {
      const threads: any[] = data;
      for (const t of threads) {
        const otherUserId = t.buyer_id === user.id ? t.seller_id : t.buyer_id;
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('user_id', otherUserId).single();
        t._otherName = profile?.full_name || 'User';
      }
      setChatThreads([...threads]);
    }
  };

  const handleContactAdmin = async () => {
    if (!user) return;
    // Find admin user
    const { data: adminRoles } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
    if (!adminRoles || adminRoles.length === 0) { toast.error('No admin available'); return; }
    const adminId = adminRoles[0].user_id;
    if (adminId === user.id) { toast.error("You are the admin!"); return; }

    // Check for existing thread with admin (no specific ad)
    const { data: existing } = await supabase
      .from('chat_threads')
      .select('id')
      .or(`and(buyer_id.eq.${user.id},seller_id.eq.${adminId}),and(buyer_id.eq.${adminId},seller_id.eq.${user.id})`)
      .is('ad_id', null)
      .maybeSingle();

    if (existing) {
      navigate(`/chat?thread=${existing.id}`);
    } else {
      const { data: newThread, error } = await supabase
        .from('chat_threads')
        .insert({ buyer_id: user.id, seller_id: adminId })
        .select('id')
        .single();
      if (error) { toast.error('Could not start chat with admin'); return; }
      navigate(`/chat?thread=${newThread.id}`);
    }
  };

  const markInquiryRead = async (id: string) => {
    await supabase.from('admin_inquiries').update({ read: true }).eq('id', id);
    fetchInquiries();
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editForm.full_name,
        phone: editForm.phone || null,
        location: editForm.location || null,
        bio: editForm.bio || null,
      })
      .eq('user_id', user.id);
    setSaving(false);
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
      setEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== user?.email) {
      toast.error('Email does not match. Please type your email to confirm.');
      return;
    }
    setDeleting(true);
    const { data, error } = await supabase.functions.invoke('admin-manage', {
      body: { action: 'delete_account_self', userId: user?.id },
    });
    setDeleting(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || 'Failed to delete account');
    } else {
      toast.success('Account deleted successfully');
      await signOut();
      navigate('/');
    }
  };

  const totalViews = myAds.reduce((acc, ad) => acc + (ad.views || 0), 0);
  const unreadInquiries = inquiries.filter(i => !i.read).length;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-hero font-display text-2xl font-bold text-primary-foreground">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">{profile?.full_name || 'User'}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {profile?.location && <p className="text-xs text-muted-foreground mt-0.5">📍 {profile.location}</p>}
                {profile?.verified && <Badge variant="outline" className="mt-1 text-xs">Verified Seller</Badge>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1 rounded-xl" onClick={() => setEditing(!editing)}>
                {editing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 rounded-xl text-destructive" onClick={signOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          </div>

          {/* Edit Profile Form */}
          {editing && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 border-t border-border pt-6">
              <div>
                <Label>Full Name</Label>
                <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Your phone number" className="mt-1" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="Your city" className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label>Bio</Label>
                <Input value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Tell us about yourself" className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={handleSaveProfile} disabled={saving} className="gap-1 bg-gradient-hero text-primary-foreground">
                  <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { label: 'My Ads', value: myAds.length, icon: Plus },
            { label: 'Total Views', value: totalViews, icon: Eye },
            { label: 'Saved Ads', value: savedAds.length, icon: Heart },
            { label: 'Rating', value: profile?.rating || '0', icon: Star },
            { label: 'Messages', value: unreadInquiries, icon: Bell },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card text-center">
              <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="font-display text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-ads">
          <TabsList>
            <TabsTrigger value="my-ads">My Ads</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="chats" className="gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> Chats
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-1">
              Messages {unreadInquiries > 0 && <Badge className="bg-destructive text-destructive-foreground border-0 h-5 min-w-[20px] p-0 flex items-center justify-center text-[10px]">{unreadInquiries}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="my-ads" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{myAds.length} ads</p>
              <Link to="/post-ad">
                <Button size="sm" className="gap-1 bg-gradient-hero text-primary-foreground">
                  <Plus className="h-4 w-4" /> New Ad
                </Button>
              </Link>
            </div>
            {myAds.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <p>No ads yet. Post your first ad!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            {savedAds.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Heart className="mx-auto mb-2 h-8 w-8" />
                <p>No saved ads yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chats" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{chatThreads.length} recent conversations</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1 rounded-xl" onClick={handleContactAdmin}>
                  <Shield className="h-3.5 w-3.5" /> Contact Admin
                </Button>
                <Link to="/chat">
                  <Button size="sm" className="gap-1 bg-gradient-hero text-primary-foreground rounded-xl">
                    <MessageCircle className="h-3.5 w-3.5" /> All Chats
                  </Button>
                </Link>
              </div>
            </div>
            {chatThreads.length > 0 ? (
              <div className="space-y-2">
                {chatThreads.map((t) => (
                  <Link key={t.id} to={`/chat?thread=${t.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card hover:bg-muted/50 transition-colors">
                    <img src={t.ads?.images?.[0] || '/placeholder.svg'} alt="" className="h-12 w-12 rounded-lg object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{t._otherName}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.ads?.title || 'General Chat'}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(t.updated_at).toLocaleDateString()}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <MessageCircle className="mx-auto mb-2 h-8 w-8" />
                <p>No chats yet</p>
                <p className="text-xs mt-1">Start chatting by visiting an ad and clicking "Chat with Seller"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            {inquiries.length > 0 ? (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className={`rounded-xl border p-4 shadow-card ${inq.read ? 'border-border bg-card' : 'border-primary/30 bg-primary/5'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary">Admin Message</span>
                        {!inq.read && <Badge className="bg-primary text-primary-foreground border-0 text-[10px]">New</Badge>}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{new Date(inq.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm mt-1">{inq.message}</p>
                    {!inq.read && (
                      <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => markInquiryRead(inq.id)}>
                        Mark as read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Mail className="mx-auto mb-2 h-8 w-8" />
                <p>No messages from admin</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="max-w-lg space-y-6">
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                <h3 className="font-display text-lg font-bold text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. All your ads, saved items, and messages will be permanently removed.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-1">
                      <Trash2 className="h-4 w-4" /> Delete My Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and all associated data.
                        <br /><br />
                        Type <strong>{user?.email}</strong> below to confirm:
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                      placeholder="Type your email to confirm"
                      value={deleteConfirmEmail}
                      onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteConfirmEmail('')}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={deleting || deleteConfirmEmail !== user?.email}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleting ? 'Deleting...' : 'Delete Account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
