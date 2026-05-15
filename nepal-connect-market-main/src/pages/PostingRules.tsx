import { Link } from 'react-router-dom';

const pageNav = [
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/posting-rules', label: 'Posting Rules' },
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Terms of Use' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/contact', label: 'Contact Us' },
];

const PostingRules = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {pageNav.map((p) => (
          <Link key={p.to} to={p.to}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              p.to === '/posting-rules' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}>{p.label}</Link>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-extrabold mb-6">Ad Posting Rules</h1>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          BazaarHub does not allow posting of ads that are considered illegal as per Nepalese law and/or are not permitted as per below rules. Any user found violating these rules will be subjected to appropriate action.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="font-display text-xl font-bold mb-3">1. No duplicate/repeat ad posting</h2>
            <p className="text-muted-foreground">Users are not allowed to post more than 1 similar active ad. Each user may only post a similar ad if the previous one has been marked as sold, deleted, or expired.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">2. No misleading or fraudulent ads</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>Ad title, price, and content must be related</li>
              <li>Ad title should not include price or phone numbers</li>
              <li>No marketing gimmick words for the sole purpose of grabbing attention</li>
              <li>No inaccurate/wrong prices</li>
              <li>No incorrect item condition — e.g., listing used goods as "Brand New"</li>
              <li>No ads selling stolen or illegal goods</li>
              <li>No fake, replica, or counterfeit goods represented as original</li>
              <li>No ads with sole purpose of leading users to another website</li>
              <li>No graphic (violent or adult oriented) images</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">3. Correct category required</h2>
            <p className="text-muted-foreground">Ads must be posted in the correct category. If your ad falls under more than one category, select the best fit and post only there.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold mb-3">4. No illegal or obscene ads</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>No ads for adult entertainment, escort services, pornography, etc.</li>
              <li>No ads that hurt sentiments of any person, group, or religion</li>
              <li>No ads selling weapons, drugs, human organs, endangered animals, prohibited antiques</li>
              <li>No ads that infringe third-party intellectual property or privacy</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
);

export default PostingRules;
