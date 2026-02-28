import db from '../db/knex.js';
import authenticate from '../middleware/auth.js';

export default async function reportRoutes(fastify) {
  fastify.addHook('preHandler', authenticate);

  // Spending by category (for pie/donut chart)
  fastify.get('/spending-by-category', async (request) => {
    const { from, to } = request.query;
    const userId = request.user.id;

    let query = db('transactions')
      .select('categories.name as category', 'category_groups.name as group', db.raw('SUM(ABS(amount)) as total'))
      .leftJoin('categories', 'transactions.category_id', 'categories.id')
      .leftJoin('category_groups', 'categories.group_id', 'category_groups.id')
      .where('transactions.user_id', userId)
      .where('transactions.amount', '<', 0)
      .whereNull('transactions.transfer_account_id')
      .whereNotNull('transactions.category_id')
      .groupBy('transactions.category_id')
      .orderBy('total', 'desc');

    if (from) query = query.where('transactions.date', '>=', from);
    if (to) query = query.where('transactions.date', '<=', to);

    return await query;
  });

  // Income vs Expense by month (for bar chart)
  fastify.get('/income-vs-expense', async (request) => {
    const months = parseInt(request.query.months || '12');
    const userId = request.user.id;

    const data = await db.raw(`
      SELECT
        substr(date, 1, 7) as month,
        SUM(CASE WHEN amount > 0 AND transfer_account_id IS NULL THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN amount < 0 AND transfer_account_id IS NULL THEN ABS(amount) ELSE 0 END) as expenses
      FROM transactions
      WHERE user_id = ?
      GROUP BY substr(date, 1, 7)
      ORDER BY month DESC
      LIMIT ?
    `, [userId, months]);

    return data.reverse();
  });

  // Net worth over time (for Area Chart)
  fastify.get('/net-worth', async (request) => {
    const months = parseInt(request.query.months || '12');
    const userId = request.user.id;

    // To compute historical net worth accurately:
    // 1. Get current balances of all accounts (assets = positive balance accounts, liabilities = credit cards/loans)
    // 2. Walk backwards month by month, subtracting the net transaction delta for that month to find the starting balance of the previous month.

    // Step 1: Current Balances
    const accounts = await db('accounts').where('user_id', userId);
    let currentAssets = 0;
    let currentLiabilities = 0;

    accounts.forEach(acc => {
      const bal = parseFloat(acc.balance || 0);
      // Types: checking, savings, cash, investment (usually assets) | credit_card, loan (liabilities)
      if (acc.type === 'credit_card' || acc.type === 'loan' || bal < 0) {
        currentLiabilities += Math.abs(bal);
      } else {
        currentAssets += bal;
      }
    });

    // Step 2: Get net flow per month
    // A positive flow means balance went up. So to go back in time, we SUBTRACT the flow.
    const flows = await db.raw(`
      SELECT 
        substr(transactions.date, 1, 7) as month,
        accounts.type as account_type,
        SUM(amount) as net_flow
      FROM transactions
      JOIN accounts ON transactions.account_id = accounts.id
      WHERE transactions.user_id = ?
      GROUP BY substr(transactions.date, 1, 7), accounts.type
      ORDER BY month DESC
    `, [userId]);

    const history = [];
    const now = new Date();

    let runnerAssets = currentAssets;
    let runnerLiabilities = currentLiabilities;

    // Build the last N months array (e.g. 2026-02, 2026-01, 2025-12...)
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const monthStr = `${yyyy}-${mm}`;

      // Push current runner state for this month
      // Wait, the "current balance" is the balance at the END of the month.
      history.unshift({
        month: monthStr,
        assets: parseFloat(runnerAssets.toFixed(2)),
        liabilities: parseFloat(runnerLiabilities.toFixed(2)),
        net_worth: parseFloat((runnerAssets - runnerLiabilities).toFixed(2))
      });

      // To prepare the runner for the PREVIOUS month, we subtract THIS month's flow.
      const monthFlows = flows.filter(f => f.month === monthStr);
      monthFlows.forEach(f => {
        const flow = parseFloat(f.net_flow);
        if (f.account_type === 'credit_card' || f.account_type === 'loan') {
          // If I spent $100 on a CC (flow = -100), the CC balance (liability) went UP by 100.
          // So to go backwards, if CC balance is 500 now, before this month it was 400.
          // Flow is -100. CC balance = 500. CC balance backwards = 500 - Math.abs(-100) = 400.
          // If I paid $100 (flow = +100), liability went DOWN by 100. Backwards = 500 + 100 = 600.
          runnerLiabilities += flow;
        } else {
          // Asset account: If I got paid $1000 (flow = +1000), balance went up. 
          // Backwards = Current Asset - 1000
          runnerAssets -= flow;
        }
      });
    }

    return history;
  });

  // Budget vs Actual for a month (for horizontal bar chart)
  fastify.get('/budget-vs-actual/:month', async (request) => {
    const { month } = request.params;
    const userId = request.user.id;
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    const categories = await db('categories')
      .select('categories.id', 'categories.name', 'category_groups.name as group_name')
      .leftJoin('category_groups', 'categories.group_id', 'category_groups.id')
      .where('categories.user_id', userId)
      .orderBy('category_groups.sort_order')
      .orderBy('categories.sort_order');

    const allocations = await db('budget_allocations').where({ month, user_id: userId });
    const allocationMap = {};
    allocations.forEach(a => { allocationMap[a.category_id] = a.assigned || 0; });

    const activity = await db('transactions')
      .select('category_id', db.raw('SUM(ABS(amount)) as spent'))
      .where('user_id', userId)
      .where('amount', '<', 0)
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .whereNotNull('category_id')
      .groupBy('category_id');

    const activityMap = {};
    activity.forEach(a => { activityMap[a.category_id] = a.spent || 0; });

    return categories.map(cat => ({
      category: cat.name,
      group: cat.group_name,
      budgeted: allocationMap[cat.id] || 0,
      actual: activityMap[cat.id] || 0
    }));
  });

  // Monthly spending trend (for multi-line chart)
  fastify.get('/spending-trend', async (request) => {
    const months = parseInt(request.query.months || '6');
    const userId = request.user.id;

    const data = await db.raw(`
      SELECT
        substr(t.date, 1, 7) as month,
        c.name as category,
        SUM(ABS(t.amount)) as total
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.amount < 0
        AND t.transfer_account_id IS NULL
        AND t.category_id IS NOT NULL
        AND t.user_id = ?
      GROUP BY substr(t.date, 1, 7), t.category_id
      ORDER BY month DESC
      LIMIT ?
    `, [userId, months * 20]);

    // Reshape into { month, cat1: val, cat2: val, ... }
    const monthMap = {};
    const allCategories = new Set();

    data.forEach(row => {
      if (!monthMap[row.month]) monthMap[row.month] = { month: row.month };
      monthMap[row.month][row.category] = row.total;
      allCategories.add(row.category);
    });

    return {
      data: Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)),
      categories: [...allCategories]
    };
  });

  // Top Payees Leaderboard (for bar chart or list)
  fastify.get('/payee-leaderboard', async (request) => {
    const { from, to, limit = 10 } = request.query;
    const userId = request.user.id;

    let query = db('transactions')
      .select('payee', db.raw('SUM(ABS(amount)) as total_spent'), db.raw('COUNT(id) as transaction_count'))
      .where('user_id', userId)
      .where('amount', '<', 0)
      .whereNull('transfer_account_id')
      .groupBy('payee')
      .orderBy('total_spent', 'desc')
      .limit(parseInt(limit));

    if (from) query = query.where('date', '>=', from);
    if (to) query = query.where('date', '<=', to);

    return await query;
  });

  // Spending Heatmap (for Calendar heatmap)
  fastify.get('/spending-heatmap', async (request) => {
    const months = parseInt(request.query.months || '12');
    const userId = request.user.id;

    // Get daily spend sums for the last X months
    const data = await db.raw(`
      SELECT
        date,
        SUM(ABS(amount)) as total,
        COUNT(id) as count
      FROM transactions
      WHERE user_id = ?
        AND amount < 0
        AND transfer_account_id IS NULL
        AND date >= date('now', '-' || ? || ' months')
      GROUP BY date
      ORDER BY date ASC
    `, [userId, months]);

    // Fastify / SQLite driver might return differently formatted arrays, reshape simple array
    return data.map(row => ({
      date: row.date,
      total: parseFloat(row.total || 0),
      count: parseInt(row.count || 0)
    }));
  });
}
