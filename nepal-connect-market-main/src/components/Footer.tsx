import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-card py-10">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
              <span className="text-sm font-extrabold text-primary-foreground">B</span>
            </div>
            <span className="font-display text-lg font-extrabold text-foreground">BazaarHub</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nepal's modern secondhand marketplace. Buy, sell, and connect with trusted sellers across the country.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-foreground">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Ads</Link>
            <Link to="/post-ad" className="text-sm text-muted-foreground hover:text-primary transition-colors">Post an Ad</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-foreground">Support</h4>
          <div className="flex flex-col gap-2">
            <Link to="/safety-tips" className="text-sm text-muted-foreground hover:text-primary transition-colors">Safety Tips</Link>
            <Link to="/posting-rules" className="text-sm text-muted-foreground hover:text-primary transition-colors">Posting Rules</Link>
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-foreground">Legal</h4>
          <div className="flex flex-col gap-2">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <a href="https://wa.me/9779766006022" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-green-500 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 md:flex-row">
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          © 2026 BazaarHub. Made with <Heart className="h-3.5 w-3.5 text-secondary" /> in Nepal.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Link to="/safety-tips" className="hover:text-primary transition-colors">Safety Tips</Link>
          <span>·</span>
          <Link to="/posting-rules" className="hover:text-primary transition-colors">Posting Rules</Link>
          <span>·</span>
          <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;