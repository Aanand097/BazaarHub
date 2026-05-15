import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    setLoading(true);
    const { error, isAdmin, emailConfirmationRequired } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (emailConfirmationRequired) {
      setEmailSent(true);
    } else {
      toast.success('Account created! Welcome to BazaarHub!');
      navigate(isAdmin ? '/admin' : '/dashboard');
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a verification link to <strong className="text-foreground">{email}</strong>.
            Please click the link to verify your account before logging in.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
          </div>
          <Link to="/login" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
            <span className="text-xl font-bold text-primary-foreground">B</span>
          </div>
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Join Nepal's largest marketplace</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" placeholder="Your full name" className="pl-10"
                  value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            </div>
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
              <p className="mt-1 text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>
            <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;