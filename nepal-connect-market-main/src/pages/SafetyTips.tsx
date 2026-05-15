import { Link } from 'react-router-dom';

const pageNav = [
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/posting-rules', label: 'Posting Rules' },
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Terms of Use' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/contact', label: 'Contact Us' },
];

const SafetyTips = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {pageNav.map((p) => (
          <Link key={p.to} to={p.to}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              p.to === '/safety-tips' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}>{p.label}</Link>
        ))}
      </div>

      <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
        <h1 className="font-display text-3xl font-extrabold mb-6">Safety Tips</h1>
        
        <p className="text-muted-foreground leading-relaxed">
          BazaarHub provides an online platform which helps buyers & sellers to meet with each other. However, it is always a good idea to take some precaution before conducting any transaction. Below are several safety guidelines. This is not a complete list. We advise you to always use common sense, sound judgment and trust your instincts.
        </p>

        <div className="my-6 rounded-xl border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm font-semibold text-warning">⚠️ BazaarHub does not offer any kind of buyer protection.</p>
          <p className="text-sm text-muted-foreground mt-1">
            BazaarHub is not involved in buying or selling activities nor does it act as a middleman. All the ads are posted by users for information purposes. These users are solely responsible for their ad content and their acts.
          </p>
        </div>

        <h2 className="font-display text-xl font-bold mt-8 mb-3">1. Avoid fraud & scams</h2>
        <p className="text-muted-foreground">Don't assume without confirmation that ad content and pictures displayed are true and accurate. Ask questions to ad poster for more details if you have any doubt. Be suspicious of:</p>
        <ul className="text-muted-foreground space-y-2 mt-3">
          <li>Sellers who have provided incomplete address or do not have a verified mobile number</li>
          <li>Ads demanding you to make advance payment</li>
          <li>Ads promising large sum of money, lottery/get rich schemes, or too good to be true opportunities</li>
          <li>Ads trying to sell stolen goods at low prices — ask for proof of purchase (bill, warranty card)</li>
          <li>Ads trying to sell cheap, fake and imitation products as original — "If something sounds too good to be true, it probably is"</li>
        </ul>

        <h2 className="font-display text-xl font-bold mt-8 mb-3">2. Meet in-person at a public place</h2>
        <p className="text-muted-foreground">It is advisable to learn as much as you can about the person you are meeting or trading with.</p>
        <ul className="text-muted-foreground space-y-2 mt-3">
          <li>Always meet buyer/seller in public places (restaurant, office, shops) where other people are present</li>
          <li>Always carry a cell phone. If possible, take a friend along</li>
          <li>Inform someone from your family or friends about where you are going</li>
          <li>Try not to arrange meetings at home or isolated places</li>
        </ul>

        <h2 className="font-display text-xl font-bold mt-8 mb-3">3. Inspect the product in detail</h2>
        <p className="text-muted-foreground">
          We recommend you to physically inspect the product before making payment. Take your time to check the product thoroughly. If you do not have required expertise, ask advice from a professional.
        </p>

        <h2 className="font-display text-xl font-bold mt-8 mb-3">4. Be careful with high value items</h2>
        <p className="text-muted-foreground">
          If buying something expensive, first meet the seller to check the product. We strongly encourage you to use mobile wallets (IME Pay, eSewa, Khalti, Connect IPS) or bank transfer instead of cash payment.
        </p>

        <h2 className="font-display text-xl font-bold mt-8 mb-3">5. Avoid non face-to-face transactions</h2>
        <p className="text-muted-foreground">
          BazaarHub encourages local trading. If you must trade remotely, make payment through bank accounts. Never send cash directly or through remittance. Always keep photocopies of deposit slips.
        </p>

        <h2 className="font-display text-xl font-bold mt-8 mb-3">6. Report suspicious activities</h2>
        <p className="text-muted-foreground">
          Please report any attempts of fraud or suspicious activities to us. In case of illegal activity, report it to local authorities.
        </p>
      </div>
    </div>
  </div>
);

export default SafetyTips;
