import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, DollarSign, Palette, Download, Database, Clock } from 'lucide-react';
import { useSettings, CURRENCIES } from '../hooks/useSettings.jsx';
import { getAgeOfMoney, getExportTransactionsUrl } from '../api/client.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function Settings() {
    const { settings, updateSettings, fmt } = useSettings();
    const [ageOfMoney, setAgeOfMoney] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getAgeOfMoney().then(setAgeOfMoney).catch(() => { });
    }, []);

    const handleCurrencyChange = async (code) => {
        const cur = CURRENCIES.find(c => c.code === code);
        if (!cur) return;
        setSaving(true);
        await updateSettings({
            currency: cur.code,
            locale: cur.locale,
            currency_symbol: cur.symbol
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleThemeChange = async (theme) => {
        setSaving(true);
        await updateSettings({ theme });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary-container rounded-xl text-on-primary-container">
                    <SettingsIcon className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-[22px] font-medium tracking-tight text-card-foreground">Settings</h2>
                    <p className="text-muted-foreground text-sm">Manage your preferences and data.</p>
                </div>
            </div>

            {saved && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-surface-container-high border border-outline-variant/30 text-foreground px-4 py-3 rounded-xl shadow-sm flex items-center gap-2">
                        <span className="text-sm font-medium">✓ Settings saved!</span>
                    </div>
                </div>
            )}

            {/* Age of Money Card */}
            <Card className="bg-primary-container/50 border-outline-variant/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                            <Clock className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground tracking-wide mb-1">Age of Money</div>
                            <div className="text-4xl font-medium text-card-foreground mb-1 tracking-tight">
                                {ageOfMoney ? `${ageOfMoney.age}  days` : '—'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                How long your money sits before being spent. Higher is better!
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Currency Selection */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader className="pb-4 border-b border-outline-variant/30">
                        <CardTitle className="text-lg font-medium text-card-foreground flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-card-foreground" /> Currency
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-3 max-w-md">
                            <label className="text-sm font-medium text-muted-foreground">Display Currency</label>
                            <Select
                                value={settings.currency}
                                onValueChange={handleCurrencyChange}
                                disabled={saving}
                            >
                                <SelectTrigger className="w-full bg-surface-container border-outline-variant/30 text-foreground/80">
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent className="bg-surface-container-low border-outline-variant/30 text-foreground/80">
                                    {CURRENCIES.map(c => (
                                        <SelectItem key={c.code} value={c.code} className="hover:bg-surface-container-high focus:bg-muted focus:text-foreground">
                                            {c.symbol} — {c.name} ({c.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-surface-container-high rounded-xl p-4 border border-outline-variant/30">
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Preview:</span>
                                <span className="font-medium text-foreground bg-surface-container-highest px-2 py-1 rounded-sm">{fmt(1234.56)}</span>
                                <span className="text-muted-foreground">|</span>
                                <span className="font-medium text-success bg-success/10 px-2 py-1 rounded-sm">{fmt(9999.00)}</span>
                                <span className="text-muted-foreground">|</span>
                                <span className="font-medium text-destructive bg-error-container px-2 py-1 rounded-sm">{fmt(-450.30)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Theme */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader className="pb-4 border-b border-outline-variant/30">
                        <CardTitle className="text-lg font-medium text-card-foreground flex items-center gap-2">
                            <Palette className="h-5 w-5 text-card-foreground" /> Appearance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { value: 'dark', label: 'Dark', bg: 'hsl(270 12% 10%)', fg: 'hsl(285 17% 90%)', border: 'hsl(268 11% 28%)' },
                                { value: 'midnight', label: 'Midnight Blue', bg: 'hsl(228 32% 8%)', fg: 'hsl(220 37% 92%)', border: 'hsl(225 19% 24%)' },
                                { value: 'amoled', label: 'AMOLED Black', bg: 'hsl(0 0% 0%)', fg: 'hsl(270 18% 93%)', border: 'hsl(258 10% 19%)' }
                            ].map(theme => (
                                <button
                                    key={theme.value}
                                    className={`relative group flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${settings.theme === theme.value
                                        ? 'ring-2 ring-primary bg-primary-container/30'
                                        : 'ring-1 ring-outline-variant hover:ring-muted-foreground/50 hover:bg-surface-container-high'
                                        }`}
                                    onClick={() => handleThemeChange(theme.value)}
                                    disabled={saving}
                                >
                                    <div
                                        className="w-full h-24 rounded-2xl mb-3 shadow-inner overflow-hidden border"
                                        style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                                    >
                                        {/* Mock UI elements for theme preview */}
                                        <div className="w-full h-6 border-b opacity-20" style={{ borderColor: theme.fg }} />
                                        <div className="p-2 space-y-2">
                                            <div className="w-1/2 h-2 rounded-full opacity-40" style={{ backgroundColor: theme.fg }} />
                                            <div className="flex gap-2">
                                                <div className="w-4 h-4 rounded-sm bg-primary" />
                                                <div className="w-4 h-4 rounded-sm bg-success" />
                                                <div className="w-4 h-4 rounded-sm bg-destructive" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{theme.label}</span>
                                    {settings.theme === theme.value && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(15,158,168,0.8)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader className="pb-4 border-b border-outline-variant/30">
                        <CardTitle className="text-lg font-medium text-card-foreground flex items-center gap-2">
                            <Database className="h-5 w-5 text-card-foreground" /> Data Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex flex-wrap gap-4">
                            <Button asChild variant="outline" className="bg-surface-container border-outline-variant/30 text-muted-foreground hover:bg-surface-container-high hover:text-foreground">
                                <a href={getExportTransactionsUrl()} download>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export All Transactions (CSV)
                                </a>
                            </Button>
                        </div>

                        <div className="bg-secondary-container border border-outline-variant/20 rounded-xl p-4 flex gap-3">
                            <div className="text-on-secondary-container mt-0.5">💡</div>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-medium text-foreground">Tip:</span> Your SQLite database is stored at <code className="bg-surface-container-highest px-1.5 py-0.5 rounded-xs text-primary font-mono text-xs">/app/data/budget.db</code> in the Docker container.
                                Mount this as a volume for persistence. Back up this file for full data backup.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

