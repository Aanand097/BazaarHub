import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, isAdmin } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
            <span className="text-xl font-bold text-primary-foreground">B</span>
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your BazaarHub account</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
