import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to process request');
            }

            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-4 ring-1 ring-primary/20 shadow-inner">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password</h1>
                    <p className="text-muted-foreground">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                {status === 'success' ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4">
                        <div className="flex justify-center text-emerald-500">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h3 className="text-lg font-semibold text-emerald-500">Check your inbox</h3>
                        <p className="text-sm text-muted-foreground">
                            If an account exists for {email}, we have sent a password reset link. Please check your spam folder if you don't see it within a few minutes.
                        </p>
                        <div className="pt-4">
                            <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6">
                        {status === 'error' && (
                            <Alert variant="destructive" className="border-destructive/50 text-destructive bg-destructive/10 rounded-xl">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={status === 'loading'}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {status === 'loading' ? 'Sending link...' : 'Send reset link'}
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
