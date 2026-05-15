import { Ad } from '@/lib/types';
import { Link } from 'react-router-dom';
import { MapPin, Eye, Star, Zap, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdCardProps {
  ad: Ad;
}

const conditionColors: Record<string, string> = {
  'Brand New': 'bg-primary/10 text-primary',
  'Like New': 'bg-success/10 text-success',
  'Used': 'bg-warning/10 text-warning',
  'Not Working': 'bg-destructive/10 text-destructive',
};

const AdCard = ({ ad }: AdCardProps) => {
  const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-NP')}`;
  const imageUrl = ad.images?.[0] || '/placeholder.svg';

  return (
    <Link
      to={`/ad/${ad.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={ad.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {ad.featured && (
            <Badge className="bg-gradient-accent text-secondary-foreground border-0 text-[10px] font-semibold shadow-sm">
              <Star className="mr-0.5 h-2.5 w-2.5" /> Featured
            </Badge>
          )}
          {ad.boosted && (
            <Badge className="bg-gradient-hero text-primary-foreground border-0 text-[10px] font-semibold shadow-sm">
              <Zap className="mr-0.5 h-2.5 w-2.5" /> Boosted
            </Badge>
          )}
        </div>
        <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-background/80 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary">
          <Bookmark className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="mb-1 text-sm font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {ad.title}
        </h3>
        <p className="mb-2 font-display text-base font-bold text-primary">
          {formatPrice(ad.price)}
        </p>
        <div className="flex items-center justify-between gap-2">
          {ad.condition && (
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${conditionColors[ad.condition] || 'bg-muted text-muted-foreground'}`}>
              {ad.condition}
            </span>
          )}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground ml-auto">
            {ad.location && (
              <span className="flex items-center gap-0.5">
                <MapPin className="h-2.5 w-2.5" /> {ad.location.split(',')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AdCard;