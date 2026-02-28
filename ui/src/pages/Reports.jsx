import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area,
    LineChart,
    Line,
    Sankey as RechartsSankey,
    Rectangle
} from 'recharts';
import {
    getSpendingByCategory,
    getIncomeVsExpense,
    getNetWorth,
    getBudgetVsActual,
    getSpendingTrend,
    getSankeyData,
    getExportTransactionsUrl,
    getPayeeLeaderboard,
    getSpendingHeatmap
} from '../api/client.js';
import {
    Activity,
    BarChart3,
    Bot,
    Download,
    Landmark,
    Network,
    PieChart as PieChartIcon,
    TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useSettings } from '../hooks/useSettings.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const COLORS = ['#0f9ea8', '#14b8a6', '#22c55e', '#f59e0b', '#3b82f6', '#f97316', '#f43f5e', '#06b6d4', '#84cc16', '#ef4444'];
const AXIS_COLOR = '#6f8892';
const GRID_COLOR = '#9bb1ba40';
const tooltipStyle = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px',
    color: 'hsl(var(--card-foreground))',
    boxShadow: '0 18px 28px -20px rgba(15, 23, 42, 0.6)'
};
const tooltipItemStyle = { color: 'hsl(var(--card-foreground))' };
const legendStyle = { color: 'hsl(var(--muted-foreground))', fontSize: 12, paddingTop: 12 };

function SankeyNode({ x, y, width, height, index }) {
    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.9}
            rx={3}
            ry={3}
            className="transition-all duration-300 hover:fill-opacity-100"
        />
    );
}

function SankeyLink({ sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index }) {
    return (
        <path
            d={`
        M${sourceX},${sourceY + linkWidth / 2}
        C${sourceControlX},${sourceY + linkWidth / 2}
          ${targetControlX},${targetY + linkWidth / 2}
          ${targetX},${targetY + linkWidth / 2}
        L${targetX},${targetY - linkWidth / 2}
        C${targetControlX},${targetY - linkWidth / 2}
          ${sourceControlX},${sourceY - linkWidth / 2}
          ${sourceX},${sourceY - linkWidth / 2}
        Z
      `}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.2}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={0}
            className="transition-all duration-300 hover:fill-opacity-40"
        />
    );
}

export default function Reports() {
    const { fmt, fmtCompact } = useSettings();
    const navigate = useNavigate();
    const [spending, setSpending] = useState([]);
    const [incVsExp, setIncVsExp] = useState([]);
    const [netWorth, setNetWorth] = useState([]);
    const [budgetActual, setBudgetActual] = useState([]);
    const [trendData, setTrendData] = useState({ data: [], categories: [] });
    const [sankeyData, setSankeyData] = useState(null);
    const [payees, setPayees] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthLabel = new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    useEffect(() => {
        Promise.all([
            getSpendingByCategory({}),
            getIncomeVsExpense(12),
            getNetWorth(12),
            getBudgetVsActual(currentMonth),
            getSpendingTrend(6),
            getSankeyData(currentMonth),
            getPayeeLeaderboard(),
            getSpendingHeatmap()
        ]).then(([sp, ie, nw, ba, tr, sk, py, hm]) => {
            setSpending(sp);
            setIncVsExp(ie);
            setNetWorth(nw);
            setBudgetActual(ba.filter((b) => b.budgeted > 0 || b.actual > 0));
            setTrendData(tr);
            setSankeyData(sk && sk.links && sk.links.length > 0 ? sk : null);
            setPayees(py);
            setHeatmap(hm);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [currentMonth]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="font-medium text-muted-foreground">Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="font-display text-3xl font-bold tracking-tight text-card-foreground">Financial Insights</h2>
                    <p className="text-muted-foreground">Analyze spending behavior, cash flow, and long-term momentum.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const a = document.createElement('a');
                            a.href = getExportTransactionsUrl();
                            a.click();
                        }}
                    >
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button size="sm" onClick={() => navigate('/ai')}>
                        <Bot className="mr-2 h-4 w-4" /> AI Advisor
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {sankeyData && sankeyData.links.length > 0 && (
                    <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-card to-secondary/25 lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-card-foreground">
                                <Network className="h-5 w-5 text-primary" /> Money Flow
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Income -&gt; category groups -&gt; categories for {monthLabel}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="h-[400px] w-full rounded-2xl bg-muted/20 p-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsSankey
                                        data={sankeyData}
                                        node={<SankeyNode />}
                                        link={<SankeyLink />}
                                        nodePadding={30}
                                        nodeWidth={12}
                                        margin={{ top: 10, right: 120, bottom: 10, left: 10 }}
                                    >
                                        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} itemStyle={tooltipItemStyle} />
                                    </RechartsSankey>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                                {sankeyData.nodes.map((node, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <div className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span>{node.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="flex flex-col overflow-hidden bg-gradient-to-br from-card to-secondary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-card-foreground">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            Spending by Category
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">All-time categorized spending</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col justify-center pt-4">
                        {spending.length > 0 ? (
                            <>
                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={spending}
                                                dataKey="total"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={110}
                                                paddingAngle={2}
                                                stroke="transparent"
                                            >
                                                {spending.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} className="transition-all duration-300 hover:opacity-80 drop-shadow-sm" />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} itemStyle={tooltipItemStyle} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                                    {spending.map((s, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-xs">
                                            <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-muted-foreground">{s.category || 'Uncategorized'}</span>
                                            <span className="font-mono font-semibold text-foreground/80">{fmt(s.total)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <div className="mb-3 rounded-full bg-muted/50 p-3">
                                    <PieChartIcon className="h-5 w-5" />
                                </div>
                                <p>No spending data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex flex-col overflow-hidden bg-gradient-to-br from-card to-secondary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-card-foreground">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Income vs Expenses
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Last 12 months overview</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-grow flex-col justify-center pt-4">
                        {incVsExp.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={incVsExp} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke={GRID_COLOR} vertical={false} />
                                        <XAxis dataKey="month" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickFormatter={fmtCompact} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} cursor={{ fill: 'hsl(var(--secondary))' }} itemStyle={tooltipItemStyle} />
                                        <Legend wrapperStyle={legendStyle} />
                                        <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" maxBarSize={40} />
                                        <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <div className="mb-3 rounded-full bg-muted/50 p-3">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <p>No income/expense data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-card to-secondary/25 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-card-foreground">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Net Worth Trend
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Your total wealth over the last 12 months</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {netWorth.length > 0 ? (
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={netWorth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0f9ea8" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#0f9ea8" stopOpacity={0.04} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" stroke={GRID_COLOR} vertical={false} />
                                        <XAxis dataKey="month" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickFormatter={fmtCompact} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} itemStyle={tooltipItemStyle} />
                                        <Area type="monotone" dataKey="net_worth" stroke="#0f9ea8" fill="url(#netWorthGrad)" strokeWidth={3} name="Net Worth" activeDot={{ r: 6, strokeWidth: 0 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <div className="mb-3 rounded-full bg-muted/50 p-3">
                                    <Landmark className="h-5 w-5" />
                                </div>
                                <p>No net worth data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-card to-secondary/25 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-card-foreground">
                            <Activity className="h-5 w-5 text-primary" />
                            Category Spending Trends
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">How your top expenses change over time</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {trendData.data.length > 0 ? (
                            <div className="h-[360px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke={GRID_COLOR} vertical={false} />
                                        <XAxis dataKey="month" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickFormatter={fmtCompact} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} itemStyle={tooltipItemStyle} />
                                        <Legend wrapperStyle={legendStyle} />
                                        {trendData.categories.slice(0, 8).map((cat, i) => (
                                            <Line
                                                key={cat}
                                                type="monotone"
                                                dataKey={cat}
                                                stroke={COLORS[i % COLORS.length]}
                                                strokeWidth={2}
                                                dot={{ r: 3, strokeWidth: 0 }}
                                                activeDot={{ r: 6, strokeWidth: 0 }}
                                                name={cat}
                                            />
                                        ))}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <div className="mb-3 rounded-full bg-muted/50 p-3">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <p>No trend data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-card to-secondary/25 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-card-foreground">
                            <Landmark className="h-5 w-5 text-primary" />
                            Top Payees
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Merchants where you spend the most</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {payees.length > 0 ? (
                            <div className="w-full" style={{ height: Math.max(300, payees.length * 45) }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={payees} layout="vertical" barGap={2} margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke={GRID_COLOR} horizontal={false} />
                                        <XAxis type="number" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickFormatter={fmtCompact} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="payee" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 13, fontWeight: 500 }} width={140} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} cursor={{ fill: 'hsl(var(--secondary))' }} itemStyle={tooltipItemStyle} />
                                        <Bar dataKey="total_spent" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Total Spent" barSize={16} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <div className="mb-3 rounded-full bg-muted/50 p-3">
                                    <Landmark className="h-5 w-5" />
                                </div>
                                <p>No payee data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-card to-secondary/25 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-card-foreground">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Budget vs Actual
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Progress against targets for {monthLabel}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {budgetActual.length > 0 ? (
                            <div className="w-full" style={{ height: Math.max(300, budgetActual.length * 45) }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={budgetActual} layout="vertical" barGap={2} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke={GRID_COLOR} horizontal={false} />
                                        <XAxis type="number" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 12 }} tickFormatter={fmtCompact} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="category" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 13, fontWeight: 500 }} width={120} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} formatter={(val) => fmt(val)} cursor={{ fill: 'hsl(var(--secondary))' }} itemStyle={tooltipItemStyle} />
                                        <Legend wrapperStyle={legendStyle} />
                                        <Bar dataKey="budgeted" fill="#0f9ea8" radius={[0, 4, 4, 0]} name="Budgeted" barSize={12} />
                                        <Bar dataKey="actual" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Actual" barSize={12} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <div className="mb-3 rounded-full bg-muted/50 p-3">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <p>No budget data available for this month</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-card to-secondary/25 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-card-foreground">
                            <Activity className="h-5 w-5 text-primary" />
                            Spending Heatmap
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Daily transaction volume over the last year</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {heatmap.length > 0 ? (
                            <div className="overflow-x-auto">
                                <div className="flex gap-1 pb-2">
                                    {(() => {
                                        // Simple heatmap renderer mapping the last 12 months roughly
                                        const now = new Date();
                                        const maxTotal = Math.max(...heatmap.map(h => h.total), 1);
                                        const dateMap = new Map();
                                        heatmap.forEach(h => dateMap.set(h.date, h));

                                        const cols = [];
                                        const startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
                                        const msPerDay = 1000 * 60 * 60 * 24;

                                        let currentWeek = [];
                                        for (let d = new Date(startDate); d <= now; d = new Date(d.getTime() + msPerDay)) {
                                            const dStr = d.toISOString().split('T')[0];
                                            const dayData = dateMap.get(dStr);
                                            const val = dayData ? dayData.total : 0;
                                            const intensity = val > 0 ? Math.max(0.1, val / maxTotal) : 0;

                                            // 0 = transparent, 1 = solid primary 
                                            // Add 5 buckets roughly
                                            let bgClass = "bg-muted/30";
                                            if (intensity > 0.01) bgClass = "bg-emerald-200 dark:bg-emerald-900/40";
                                            if (intensity > 0.25) bgClass = "bg-emerald-400 dark:bg-emerald-700/60";
                                            if (intensity > 0.50) bgClass = "bg-emerald-500 dark:bg-emerald-500/80";
                                            if (intensity > 0.75) bgClass = "bg-emerald-600 dark:bg-emerald-400";

                                            currentWeek.push(
                                                <div
                                                    key={dStr}
                                                    className={`w-3 h-3 rounded-sm ${bgClass}`}
                                                    title={`${dStr}: ${dayData ? fmt(dayData.total) : '$0.00'} (${dayData ? dayData.count : 0} txns)`}
                                                />
                                            );

                                            if (d.getDay() === 6 || d.getTime() === now.getTime()) {
                                                cols.push(<div key={dStr + '-col'} className="flex flex-col gap-1">{currentWeek}</div>);
                                                currentWeek = [];
                                            }
                                        }
                                        return cols;
                                    })()}
                                </div>
                                <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground mt-4">
                                    <span>Less Spending</span>
                                    <div className="w-3 h-3 rounded-sm bg-muted/30" />
                                    <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
                                    <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700/60" />
                                    <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500/80" />
                                    <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
                                    <span>More Spending</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <div className="mb-3 rounded-full bg-muted/50 p-3">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <p>No heatmap data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
