import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, ImagePlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const PostAd = () => {
  const [negotiable, setNegotiable] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data || []);
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 8) { toast.error('Max 8 images'); return; }
    setImages(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const file of images) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('ad-images').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('ad-images').getPublicUrl(fileName);
        imageUrls.push(publicUrl);
      }

      const { error } = await supabase.from('ads').insert({
        user_id: user.id,
        title,
        description,
        price: parseFloat(price),
        location,
        condition: condition || null,
        category_id: categoryId || null,
        negotiable,
        images: imageUrls,
        status: 'approved', // auto-approve for now
      });

      if (error) throw error;
      toast.success('Ad posted successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Failed to post ad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="mb-2 font-display text-2xl font-bold">Post a New Ad</h1>
        <p className="mb-6 text-sm text-muted-foreground">Fill in the details to list your item</p>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-card">
          <div>
            <Label>Photos</Label>
            <div className="mt-2 grid grid-cols-4 gap-3">
              {previews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {previews.length < 8 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                  <ImagePlus className="mb-1 h-6 w-6" />
                  <span className="text-xs">Add Photo</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageAdd} />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="e.g., iPhone 14 Pro Max 256GB" className="mt-1"
              value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select condition" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Price (NPR) *</Label>
              <Input id="price" type="number" placeholder="0" className="mt-1"
                value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="flex items-end gap-3 pb-1">
              <div className="flex items-center gap-2">
                <Switch checked={negotiable} onCheckedChange={setNegotiable} />
                <Label>Negotiable</Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Kathmandu, Baneshwor" className="mt-1"
              value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" placeholder="Describe your item..." className="mt-1" rows={5}
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90" size="lg" disabled={loading}>
            <Upload className="mr-2 h-4 w-4" /> {loading ? 'Posting...' : 'Post Ad'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostAd;
