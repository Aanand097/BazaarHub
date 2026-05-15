import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const pageNav = [
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/posting-rules', label: 'Posting Rules' },
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Terms of Use' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/contact', label: 'Contact Us' },
];

const Contact = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {pageNav.map((p) => (
          <Link key={p.to} to={p.to}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              p.to === '/contact' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}>{p.label}</Link>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-extrabold mb-8">Contact Us</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-bold">Business Hours</h3>
            </div>
            <p className="text-sm text-muted-foreground">9 AM to 6 PM</p>
            <p className="text-sm text-muted-foreground">Sunday to Friday</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-bold">Phone Support</h3>
            </div>
            <a href="tel:+9779801000000" className="text-sm text-primary font-medium hover:underline">+977 9801-000000</a>
            <p className="text-xs text-muted-foreground mt-1">Within business hours</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-bold">Email Support</h3>
            </div>
            <a href="mailto:support@bazaarhub.com" className="text-sm text-primary font-medium hover:underline">support@bazaarhub.com</a>
            <p className="text-xs text-muted-foreground mt-1">Within 24 hours</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-bold">Social Media</h3>
            </div>
            <p className="text-sm text-muted-foreground">Facebook, Viber, WhatsApp</p>
            <p className="text-xs text-muted-foreground mt-1">Within business hours</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold mb-2">📍 Our Office</h3>
          <p className="text-sm text-muted-foreground">Kathmandu, Nepal</p>
          <p className="text-xs text-muted-foreground mt-1">🇳🇵 Serving all of Nepal</p>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;