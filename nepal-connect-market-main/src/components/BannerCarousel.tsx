import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  ad_id: string | null;
  expires_at: string | null;
  starts_at: string | null;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchBanners = async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from('banners')
        .select('id, title, description, image_url, link_url, ad_id, expires_at, starts_at')
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .order('sort_order')
        .limit(5);
      setBanners((data as Banner[]) || []);
    };
    fetchBanners();
  }, []);

  const next = useCallback(() => {
    if (banners.length === 0) return;
    setDirection(1);
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    if (banners.length === 0) return;
    setDirection(-1);
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [paused, banners.length, next]);

  if (banners.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gradient-hero p-8 md:p-10 min-h-[240px] flex flex-col justify-center">
        <div className="absolute inset-0">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-secondary/15 blur-2xl" />
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-2xl md:text-4xl font-extrabold leading-tight text-primary-foreground mb-0.5">
            DON'T HIDE.
          </h1>
          <h1 className="font-display text-2xl md:text-4xl font-extrabold leading-tight text-primary mb-3">
            GET NOTICED!
          </h1>
          <p className="text-primary-foreground/60 text-sm md:text-base">
            Get more views. Sell Faster!
          </p>
        </div>
      </div>
    );
  }

  const banner = banners[current];
  const Wrapper = banner.link_url ? Link : 'div';
  const wrapperProps = banner.link_url
    ? { to: banner.ad_id ? `/ad/${banner.ad_id}` : banner.link_url }
    : {};

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[240px] group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={banner.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Wrapper {...(wrapperProps as any)} className="block relative min-h-[240px] h-full">
            <img
              src={banner.image_url}
              alt={banner.title}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
            <div className="relative z-10 flex flex-col justify-center min-h-[240px] p-8 md:p-10">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-primary-foreground mb-1 max-w-sm">
                {banner.title}
              </h2>
              {banner.description && (
                <p className="text-primary-foreground/70 text-sm md:text-base max-w-xs">
                  {banner.description}
                </p>
              )}
            </div>
          </Wrapper>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary-foreground' : 'w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60'}`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/40 text-primary-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-foreground/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/40 text-primary-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-foreground/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Pause button */}
          <button
            onClick={() => setPaused(!paused)}
            className="absolute bottom-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-lg bg-foreground/40 text-primary-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-foreground/60"
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </>
      )}

      {/* Sponsored label */}
      <div className="absolute top-3 right-3 z-20">
        <span className="rounded-md bg-foreground/40 px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          Sponsored
        </span>
      </div>

      {/* Progress bar */}
      {banners.length > 1 && !paused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 z-20">
          <motion.div
            key={`progress-${current}`}
            className="h-full bg-primary-foreground/50"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.5, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
