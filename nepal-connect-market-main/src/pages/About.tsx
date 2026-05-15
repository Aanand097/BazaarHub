import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Users, Zap, Globe, Heart, Target, ArrowRight, MapPin, Sparkles } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero px-4 py-24 md:py-32">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto text-center">
          <motion.div {...fadeUp}>
            <span className="mb-4 inline-block rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
              🇳🇵 Made in Nepal
            </span>
          </motion.div>
          <motion.h1 {...fadeUp} transition={{ delay: 0.1 }}
            className="mb-5 font-display text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
            About BazaarHub
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            We're building Nepal's most trusted, modern, and intelligent secondhand marketplace — 
            connecting millions of buyers and sellers with technology that makes trading simple, safe, and delightful.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                Our Mission
              </span>
              <h2 className="mb-4 font-display text-3xl font-extrabold md:text-4xl">
                Empowering Nepal's <span className="text-gradient-hero">Circular Economy</span>
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Every year, millions of perfectly usable items end up discarded in Nepal. BazaarHub is on a mission 
                to change that by creating a platform where pre-loved items find new homes, reducing waste while 
                helping Nepalis save money and earn from things they no longer need.
              </p>
              <div className="space-y-3">
                {[
                  'Reduce waste by promoting reuse across Nepal',
                  'Make buying and selling accessible to everyone',
                  'Build trust through verified sellers and secure chat',
                  'Support local communities and small businesses',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-hero">
                      <Sparkles className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}
              className="relative rounded-2xl bg-gradient-subtle p-8 md:p-12">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '25+', label: 'Cities Covered', icon: MapPin },
                  { value: '10K+', label: 'Items Listed', icon: Globe },
                  { value: '5K+', label: 'Happy Users', icon: Heart },
                  { value: '99%', label: 'Uptime', icon: Zap },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-card p-5 shadow-card text-center">
                    <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                    <p className="font-display text-2xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-subtle py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              How It Works
            </span>
            <h2 className="mb-4 font-display text-3xl font-extrabold md:text-4xl">
              Simple. Fast. Secure.
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-muted-foreground">
              Selling or buying on BazaarHub takes just minutes, not hours.
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create Your Ad',
                desc: 'Snap a photo, set your price, add details. Your listing goes live instantly.',
                icon: '📸',
              },
              {
                step: '02',
                title: 'Connect & Chat',
                desc: 'Interested buyers reach out through our real-time secure messaging system.',
                icon: '💬',
              },
              {
                step: '03',
                title: 'Close the Deal',
                desc: 'Agree on terms, meet up, and make the exchange. Simple as that.',
                icon: '🤝',
              },
            ].map((item, i) => (
              <motion.div key={item.step} {...fadeUp} transition={{ delay: i * 0.15 }}
                className="group relative rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="absolute -top-4 left-6 rounded-full bg-gradient-hero px-3 py-1 font-display text-xs font-bold text-primary-foreground">
                  Step {item.step}
                </div>
                <div className="mb-4 text-5xl">{item.icon}</div>
                <h3 className="mb-2 font-display text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              Our Values
            </span>
            <h2 className="mb-12 font-display text-3xl font-extrabold md:text-4xl">
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: 'Trust & Safety', desc: 'Verified sellers, secure messaging, and active moderation keep our community safe.' },
              { icon: Users, title: 'Community First', desc: 'Built by Nepalis, for Nepalis. We understand the local market like no one else.' },
              { icon: Target, title: 'Innovation', desc: 'Smart search, AI-powered recommendations, and modern tools make trading effortless.' },
              { icon: Heart, title: 'Sustainability', desc: 'Every reused item is a step toward a greener Nepal. Trade smart, live green.' },
            ].map((val, i) => (
              <motion.div key={val.title} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card text-left transition-all duration-300 hover:shadow-card-hover">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                  <val.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gradient-subtle py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              Our Team
            </span>
            <h2 className="mb-4 font-display text-3xl font-extrabold md:text-4xl">
              The People Behind BazaarHub
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-muted-foreground">
              A passionate team of developers, designers, and entrepreneurs from Nepal.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Aarav Sharma', role: 'Founder & CEO', emoji: '👨‍💻' },
              { name: 'Priya Thapa', role: 'Head of Design', emoji: '🎨' },
              { name: 'Bikash Gurung', role: 'Lead Developer', emoji: '⚡' },
            ].map((member, i) => (
              <motion.div key={member.name} {...fadeUp} transition={{ delay: i * 0.15 }}
                className="rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-card-hover">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-subtle text-4xl">
                  {member.emoji}
                </div>
                <h3 className="font-display text-lg font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-dark py-20 text-center">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp}>
            <h2 className="mb-4 font-display text-3xl font-extrabold text-primary-foreground md:text-4xl">
              Ready to Join BazaarHub?
            </h2>
            <p className="mx-auto mb-8 max-w-md text-primary-foreground/70">
              Start buying and selling today. It's free, fast, and trusted by thousands across Nepal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2 rounded-xl bg-gradient-accent text-secondary-foreground hover:opacity-90">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Browse Listings
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
