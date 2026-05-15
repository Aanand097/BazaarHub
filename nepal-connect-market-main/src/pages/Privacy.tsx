import { Link } from 'react-router-dom';

const pageNav = [
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/posting-rules', label: 'Posting Rules' },
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Terms of Use' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/contact', label: 'Contact Us' },
];

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {pageNav.map((p) => (
          <Link key={p.to} to={p.to}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              p.to === '/privacy' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}>{p.label}</Link>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="font-display text-3xl font-extrabold">Privacy Policy</h1>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">1. Children's Privacy</h2>
          <p className="text-muted-foreground">Our services are intended for users 18 years of age and older. We do not knowingly collect information from users under 18.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">2. Information We Collect</h2>
          <h3 className="font-display text-base font-semibold mt-4 mb-2">2.1 Information You Provide</h3>
          <ul className="text-muted-foreground space-y-1">
            <li>Name, email address, contact address, phone numbers</li>
          </ul>
          <p className="text-muted-foreground mt-2">Some information is displayed publicly and shared with other users to facilitate communication.</p>
          
          <h3 className="font-display text-base font-semibold mt-4 mb-2">2.2 Automatically Collected</h3>
          <ul className="text-muted-foreground space-y-1">
            <li>Cookies, IP address, browsing behavior, page traffic, device information</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">3. How We Use Your Information</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>Provide our services and facilitate user communication</li>
            <li>Customize information and communicate offers (opt-out available)</li>
            <li>Identify users and conduct market research</li>
            <li>Troubleshoot, improve, and develop our system</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">4. Information Sharing</h2>
          <p className="text-muted-foreground mb-3">We do not sell or rent your personal information to third parties without explicit consent.</p>
          <ul className="text-muted-foreground space-y-2">
            <li>We may disclose to governmental or law enforcement authorities when required</li>
            <li>We may share with service providers who help with business functions</li>
            <li>We are not responsible for privacy practices of external websites</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">5. Data Security</h2>
          <p className="text-muted-foreground">We store personal information on secure computers and make best efforts to protect against unauthorized access. However, transmission over the Internet may not be completely safe.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">6. Your Rights</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>You can modify or delete your personal details at any time</li>
            <li>We may retain backup/archive for reporting and regulatory compliance</li>
            <li>We may aggregate information to anonymize data</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-3">7. Changes to This Policy</h2>
          <p className="text-muted-foreground">We may update this Privacy Policy from time to time. Your continued use indicates acceptance. If you have questions, please contact us.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Privacy;