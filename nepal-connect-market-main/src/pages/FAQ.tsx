import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const pageNav = [
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/posting-rules', label: 'Posting Rules' },
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Terms of Use' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/contact', label: 'Contact Us' },
];

const faqs = [
  { q: 'What is BazaarHub?', a: 'BazaarHub is Nepal\'s online classified marketplace where buyers and sellers can meet to trade goods and services. It is completely free to use.' },
  { q: 'Why choose BazaarHub?', a: 'BazaarHub offers a simple, secure, and free platform to buy and sell in Nepal. We provide verified sellers, real-time chat, and coverage across 25+ cities.' },
  { q: 'What benefits do I get as a member?', a: 'As a registered member, you can post ads, save favorite listings, chat with sellers, and manage your ads from your dashboard.' },
  { q: 'How can I register?', a: 'Click on "Sign up" at the top right corner. Fill in your details including name, email, and password. You\'ll receive a verification email to activate your account.' },
  { q: 'How do I post an ad?', a: 'After logging in, click "Post for free" in the top navigation. Fill in the ad details including title, description, price, category, and upload images. Your ad will be reviewed and published.' },
  { q: 'Can I upload images for my ad?', a: 'Yes! You can upload multiple images for each ad. We recommend clear, well-lit photos to attract more buyers.' },
  { q: 'Can I change ad details later?', a: 'Yes, you can edit your ad details from your Dashboard at any time while the ad is active.' },
  { q: 'What is Featured and Boosted ads?', a: 'Featured ads appear at the top of search results with a special badge. Boosted ads get extra visibility and are shown to more users.' },
  { q: 'Does a buyer need to register?', a: 'Buyers can browse ads without registering, but they need to create an account to chat with sellers or save ads.' },
  { q: 'How can I find products I want to buy?', a: 'Use the search bar or browse by categories. You can also filter by location, price range, and condition to find exactly what you need.' },
];

const FAQ = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {pageNav.map((p) => (
          <Link key={p.to} to={p.to}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              p.to === '/faq' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}>{p.label}</Link>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-extrabold mb-6">Frequently Asked Questions</h1>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left font-display text-sm font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </div>
);

export default FAQ;