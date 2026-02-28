import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Target, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';

export default function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);

        const result = await register(name, username, email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Failed to register');
            setIsLoading(false);
        }
    };

    return (
        <div className="app-shell relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
            <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[0.88fr_1.12fr]">
                <Card className="hidden overflow-hidden lg:block">
                    <div className="relative h-full p-8">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-accent/35" />
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Start Your Plan
                                </div>
                                <h1 className="font-display text-4xl font-bold leading-tight text-card-foreground text-balance">
                                    Build a budget system that fits your life.
                                </h1>
                                <p className="mt-4 max-w-md text-muted-foreground">
                                    Set targets, monitor trends, and stay ahead of bills with one connected workspace.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="glass-surface rounded-2xl p-4">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                                        <Target className="h-4 w-4 text-primary" />
                                        Goal-first planning workflow
                                    </p>
                                </div>
                                <div className="glass-surface rounded-2xl p-4">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                                        <Shield className="h-4 w-4 text-primary" />
                                        Private and self-hosted by design
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="w-full">
                    <CardHeader className="space-y-2 pb-2">
                        <CardTitle className="font-display text-3xl font-bold text-card-foreground">Create account</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Set up your profile to begin budgeting.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-500">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="johndoe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="h-11 w-full" disabled={isLoading}>
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-primary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
