export interface Ad {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  category_id: string | null;
  subcategory_id: string | null;
  condition: string | null;
  location: string | null;
  negotiable: boolean;
  featured: boolean;
  boosted: boolean;
  status: string;
  images: string[];
  views: number;
  reports_count: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
}
