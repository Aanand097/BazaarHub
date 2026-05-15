import { Link } from 'react-router-dom';

const pageNav = [
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/posting-rules', label: 'Posting Rules' },
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Terms of Use' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/contact', label: 'Contact Us' },
];

const Terms = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {pageNav.map((p) => (
          <Link key={p.to} to={p.to}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              p.to === '/terms' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}>{p.label}</Link>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="font-display text-3xl font-extrabold">Terms of Use</h1>
        
        <p className="text-muted-foreground leading-relaxed">
          Welcome to BazaarHub. By using BazaarHub through website or from any electronic device, you acknowledge, understand and agree to the following Terms of Use. BazaarHub may change or modify the Terms in the future. Your continued use of the site constitutes acceptance.
        </p>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">1. Acceptance Through Use</h2>
          <p className="text-muted-foreground">By posting or viewing a classified advertisement on the site, you agree to be bound by all terms, conditions and notices. If you do not accept, you are not authorized to use the site.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">2. Eligibility</h2>
          <p className="text-muted-foreground">BazaarHub is not directed to anyone under the age of eighteen (18). If using on behalf of a legal entity, you must have the necessary authority.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">3. Understanding of Platform</h2>
          <p className="text-muted-foreground mb-3">BazaarHub is an internet classified platform that facilitates communication between users.</p>
          <ul className="text-muted-foreground space-y-2">
            <li>BazaarHub does not endorse or promote any listings posted by users</li>
            <li>Users are independent third parties, not related to BazaarHub</li>
            <li>BazaarHub is not involved in transaction of any goods/services</li>
            <li>You will be directly contacting users who have posted advertisements</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">4. User Submitted Content</h2>
          <p className="text-muted-foreground mb-3">By posting content, you represent that:</p>
          <ul className="text-muted-foreground space-y-2">
            <li>You lawfully own or have rights to your content</li>
            <li>None of the materials are unlawful, defamatory, or obscene</li>
            <li>Your content will not violate any legal rights of any third party</li>
            <li>You are solely responsible for your content</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">5. Violations</h2>
          <p className="text-muted-foreground">BazaarHub moderators may monitor and delete content at any time. There is no tolerance for objectionable content or abusive users. Violations may result in account suspension.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">6. Community Reporting</h2>
          <p className="text-muted-foreground">Users are encouraged to report any listing that is unlawful or offensive using the "Report Ad" feature.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">7. Intellectual Property</h2>
          <p className="text-muted-foreground">All content and materials on the site (other than your content) are owned by their respective owners and protected by Nepal Copyright Laws.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">8. Site Usage</h2>
          <p className="text-muted-foreground">BazaarHub grants you a non-transferable, revocable license for personal use. You may not use the site for commercial purposes like unsolicited emails or calls. You are responsible for protecting your account password.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">9. Limitation of Liability</h2>
          <p className="text-muted-foreground">BazaarHub is not liable for errors, breaches, or acts of users, or for any personal injuries, damages, or expenses resulting therefrom. The laws of Government of Nepal govern these Terms.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">10. Delivery / Payments</h2>
          <p className="text-muted-foreground">BazaarHub does not deliver or accept payment for products/services listed. Sellers are responsible for delivery and billing. Buyers are responsible for verifying goods before payment. Any contractual obligations are solely between users.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">11. Disclaimer — Buy & Sell at Your Own Risk</h2>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
            <p className="text-sm font-semibold text-destructive">⚠️ Important: All transactions are at your own risk.</p>
            <ul className="text-muted-foreground text-sm space-y-2">
              <li><strong>No payment protection:</strong> BazaarHub does not process, hold, or guarantee any payments between users. Any money you send or receive is entirely your responsibility.</li>
              <li><strong>No product guarantee:</strong> BazaarHub does not inspect, verify, or guarantee the quality, safety, legality, or accuracy of any product or service listed. Buying or selling is entirely at your own risk.</li>
              <li><strong>No middleman:</strong> BazaarHub is only a platform for connecting buyers and sellers. We are NOT involved in any transaction, negotiation, delivery, or dispute between users.</li>
              <li><strong>No refunds or returns:</strong> BazaarHub does not offer refunds, returns, or any form of buyer/seller protection. All disputes must be resolved directly between the parties involved.</li>
              <li><strong>No liability:</strong> BazaarHub shall not be held responsible for any loss, damage, fraud, scam, injury, or any other issue arising from transactions conducted through this platform.</li>
              <li><strong>Your due diligence:</strong> Always inspect products in person, meet in public places, verify seller identity, and never send advance payments to unknown parties. Read our <a href="/safety-tips" className="text-primary underline font-medium">Safety Tips</a> before any transaction.</li>
            </ul>
            <p className="text-xs text-muted-foreground italic">By using BazaarHub, you acknowledge and accept that all buying, selling, and payment activities are conducted at your own risk and discretion.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default Terms;
