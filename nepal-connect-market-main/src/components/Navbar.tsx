import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, MessageCircle, Menu, X, Shield, LogOut, User, LayoutDashboard, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
    { to: '/about', label: 'About' },
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/chat', label: 'Chat', icon: MessageCircle },
    ] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 glass">
      {/* Top bar */}
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
            <span className="text-lg font-extrabold text-primary-foreground">B</span>
          </div>
          <span className="font-display text-xl font-extrabold text-foreground">
            Bazaar<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Search bar - desktop */}
        <div className="hidden md:flex flex-1 max-w-lg relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for anything"
            className="h-10 rounded-xl border-border bg-muted/50 pl-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery) navigate(`/browse?q=${searchQuery}`);
            }}
          />
        </div>

        <div className="hidden items-center gap-2 md:flex shrink-0">
          <Link to="/post-ad">
            <Button size="sm" className="gap-1.5 rounded-xl bg-gradient-accent text-secondary-foreground font-semibold hover:opacity-90">
              <Plus className="h-4 w-4" /> Post for free
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10">
                <Shield className="h-4 w-4" /> Admin
              </Button>
            </Link>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero font-display text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:scale-105">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-lg">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-lg">
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-lg text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-xl">Sign in / Sign up</Button>
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Nav links bar - desktop */}
      <div className="hidden md:block border-t border-border/50 bg-background/60">
        <div className="container mx-auto flex items-center gap-0.5 px-4 h-10">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}>
              {'icon' in link && link.icon && <link.icon className="h-3.5 w-3.5" />}
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-background md:hidden">
            <div className="flex flex-col gap-1 p-4">
              {/* Mobile search */}
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search for anything" className="h-10 rounded-xl pl-10 text-sm"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) { navigate(`/browse?q=${searchQuery}`); setMobileOpen(false); } }} />
              </div>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive(link.to) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  {'icon' in link && link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive">
                  <Shield className="h-4 w-4" /> Admin Panel
                </Link>
              )}
              <div className="mt-2 border-t border-border pt-3 flex gap-2">
                {user ? (
                  <>
                    <Link to="/post-ad" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button size="sm" className="w-full gap-1 rounded-xl bg-gradient-accent text-secondary-foreground">
                        <Plus className="h-4 w-4" /> Post Ad
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2 w-full">
                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl" size="sm">Sign in</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full rounded-xl bg-gradient-hero text-primary-foreground" size="sm">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;