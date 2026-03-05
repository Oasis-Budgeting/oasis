import { useState, useEffect, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, CreditCard, Repeat, Clock, AlertCircle } from 'lucide-react';
import { getSubscriptions, getUpcomingBills } from '../api/client.js';
import { useSettings } from '../hooks/useSettings.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function BillCalendar() {
    const { fmt, settings } = useSettings();
    const [subs, setSubs] = useState([]);
    const [upcoming, setUpcoming] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [subsData, upcomingData] = await Promise.all([
                getSubscriptions(),
                getUpcomingBills(60).catch(() => null)
            ]);
            setSubs(subsData);
            setUpcoming(upcomingData);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const today = new Date();

    // Map subscriptions to their due days
    const billsByDay = useMemo(() => {
        const map = {};
        for (const sub of subs) {
            if (sub.status !== 'active') continue;
            let day = null;
            if (sub.next_due_date) {
                const due = new Date(sub.next_due_date);
                if (due.getMonth() === month && due.getFullYear() === year) {
                    day = due.getDate();
                }
            }
            // For monthly subscriptions, also check billing_day
            if (!day && sub.frequency === 'monthly' && sub.billing_day) {
                day = parseInt(sub.billing_day);
            }
            if (day && day >= 1 && day <= daysInMonth) {
                if (!map[day]) map[day] = [];
                map[day].push({ ...sub, source: 'subscription' });
            }
        }
        // Overlay projected recurring transactions
        if (upcoming && upcoming.projected) {
            for (const proj of upcoming.projected) {
                const d = new Date(proj.projected_date);
                if (d.getMonth() === month && d.getFullYear() === year) {
                    const day = d.getDate();
                    // Don't duplicate if subscription already has it
                    const existing = map[day] || [];
                    const alreadyShown = existing.some(e => e.name === proj.payee || e.payee === proj.payee);
                    if (!alreadyShown) {
                        if (!map[day]) map[day] = [];
                        map[day].push({ name: proj.payee, amount: proj.amount, frequency: proj.frequency, source: 'recurring', projected_date: proj.projected_date });
                    }
                }
            }
        }
        return map;
    }, [subs, month, year, daysInMonth, upcoming]);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(new Date());

    const totalThisMonth = Object.values(billsByDay).flat().reduce((s, sub) => s + Math.abs(parseFloat(sub.amount || 0)), 0);
    const billCount = Object.values(billsByDay).flat().length;

    // Calendar grid
    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-2xl text-warning"><CalendarDays className="h-6 w-6" /></div>
                    <div>
                        <h2 className="text-2xl font-medium tracking-tight text-card-foreground">Bill Calendar</h2>
                        <p className="text-muted-foreground">See when your bills and subscriptions are due.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="h-full min-h-[136px] relative overflow-hidden border-none bg-warning text-warning-foreground shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-warning-foreground/80 font-medium text-xs">Due This Month</CardDescription>
                        <CardTitle className="text-4xl font-medium text-warning-foreground tracking-tight">{fmt(totalThisMonth)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="h-full min-h-[136px] bg-surface-container-low border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-muted-foreground font-medium text-xs">Bills This Month</CardDescription>
                        <CardTitle className="text-3xl font-medium text-card-foreground">{billCount}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="h-full min-h-[136px] bg-surface-container-low border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-muted-foreground font-medium text-xs">Active Subscriptions</CardDescription>
                        <CardTitle className="text-3xl font-medium text-card-foreground">{subs.filter(s => s.status === 'active').length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="bg-surface-container-low border-outline-variant/30">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
                        <h3 className="text-lg font-medium text-card-foreground min-w-[180px] text-center">{monthName}</h3>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs border-outline-variant/30 text-muted-foreground hover:text-foreground" onClick={goToday}>Today</Button>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-16 text-muted-foreground">Loading calendar...</div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-7 gap-px mb-1">
                                {WEEKDAYS.map(d => (
                                    <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-widest py-2">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-px">
                                {cells.map((day, i) => (
                                    <div key={i}
                                        className={`min-h-[80px] p-1.5 rounded-xl border transition-colors ${day ? (isToday(day) ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-muted-foreground/30') : 'border-transparent'
                                            }`}>
                                        {day && (
                                            <>
                                                <div className={`text-xs font-medium mb-1 ${isToday(day) ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                                    {day}
                                                </div>
                                                <div className="space-y-0.5">
                                                    {(billsByDay[day] || []).map((sub, j) => (
                                                        <div key={j} className={`text-[9px] px-1.5 py-0.5 rounded-md truncate font-medium ${sub.source === 'recurring' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`} title={`${sub.name} — ${fmt(Math.abs(sub.amount))}${sub.source === 'recurring' ? ' (projected)' : ''}`}>
                                                            {sub.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upcoming Bills List */}
            {Object.keys(billsByDay).length > 0 && (
                <Card className="bg-surface-container-low border-outline-variant/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base text-card-foreground">Upcoming Bills This Month</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {Object.entries(billsByDay).sort(([a], [b]) => a - b).map(([day, bills]) =>
                            bills.map((sub, i) => (
                                <div key={`${day}-${i}`} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-surface-container/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${sub.source === 'recurring' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}>{day}</div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-medium text-foreground/80">{sub.name}</span>
                                                {sub.source === 'recurring' && (
                                                    <span className="inline-flex items-center rounded-full bg-info/10 px-1.5 py-0.5 text-[9px] font-medium text-info">
                                                        <Clock className="mr-0.5 h-2 w-2" /> projected
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Repeat className="w-2.5 h-2.5" />{sub.frequency}</div>
                                        </div>
                                    </div>
                                    <span className="font-mono font-semibold text-sm text-foreground/80">{fmt(Math.abs(sub.amount))}</span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 60-Day Upcoming Timeline */}
            {upcoming && upcoming.projected && upcoming.projected.length > 0 && (
                <Card className="bg-surface-container-low border-outline-variant/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
                            <Clock className="h-4 w-4 text-primary" />
                            Next 60 Days — Projected Bills
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-xs">
                            {upcoming.projected.length} projected transactions totaling {fmt(upcoming.total_projected)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                        {upcoming.projected
                            .sort((a, b) => a.projected_date.localeCompare(b.projected_date))
                            .map((proj, i) => {
                                const projDate = new Date(proj.projected_date);
                                const daysUntil = Math.ceil((projDate - today) / (1000 * 60 * 60 * 24));
                                const isPast = daysUntil < 0;
                                const isSoon = daysUntil >= 0 && daysUntil <= 3;
                                return (
                                    <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-xl transition-colors ${isPast ? 'opacity-50' : 'hover:bg-surface-container/50'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-xs font-medium ${isSoon ? 'bg-warning/10 text-warning' : 'bg-surface-container/50 text-muted-foreground'}`}>
                                                <span className="text-[9px] uppercase">{projDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-sm -mt-0.5">{projDate.getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-medium text-foreground/80">{proj.payee}</span>
                                                    {isSoon && (
                                                        <AlertCircle className="h-3 w-3 text-warning" title="Due soon" />
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <Repeat className="w-2.5 h-2.5" />{proj.frequency}
                                                    {daysUntil >= 0 && <span className="ml-1">• in {daysUntil} day{daysUntil !== 1 ? 's' : ''}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-mono font-semibold text-sm text-foreground/80">{fmt(Math.abs(proj.amount))}</span>
                                    </div>
                                );
                            })}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

