import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, UserPlus, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup, isAuthenticated, isAdmin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive flex items-center justify-center mx-auto mb-4">
            <Lock className="text-destructive-foreground" size={28} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mt-2 mb-6">
            You don't have admin privileges. Contact the administrator to get access.
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            ← Back to website
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignup) {
      const { error } = await signup(email, password);
      
      if (error) {
        toast({
          title: 'Signup failed',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Check your email',
          description: 'We sent you a confirmation link. Please verify your email to continue.',
        });
      }
    } else {
      const { error } = await login(email, password);
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate('/admin');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            {isSignup ? (
              <UserPlus className="text-primary-foreground" size={28} />
            ) : (
              <Lock className="text-primary-foreground" size={28} />
            )}
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {isSignup ? 'Create Account' : 'Admin Login'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSignup ? 'Sign up for admin access' : 'Sign in to access the dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10"
                minLength={6}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              isSignup ? 'Creating account...' : 'Signing in...'
            ) : (
              <>
                {isSignup ? <UserPlus size={18} className="mr-2" /> : <LogIn size={18} className="mr-2" />}
                {isSignup ? 'Create Account' : 'Sign In'}
              </>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-primary hover:underline"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/" className="text-primary hover:underline">← Back to website</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
