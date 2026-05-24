const db = require("../db/connection");


// GET /api/dashboard/:id
// Returns everything needed to render the dashboard
const getDashboard = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get user info
    const [users] = await db.query(
      "SELECT id, fullname, email, created_at FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2. Get income streams
    const [incomeStreams] = await db.query(
      "SELECT * FROM income_streams WHERE user_id = ? ORDER BY estimated_monthly_amount DESC",
      [id]
    );

    // 3. Get expense categories
    const [expenseCategories] = await db.query(
      "SELECT * FROM expense_categories WHERE user_id = ? ORDER BY estimated_monthly_spend DESC",
      [id]
    );

    // 4. Calculate summary totals
    const totalIncome = incomeStreams.reduce(
      (sum, s) => sum + parseFloat(s.estimated_monthly_amount),
      0
    );

    const totalExpenses = expenseCategories.reduce(
      (sum, e) => sum + parseFloat(e.estimated_monthly_spend),
      0
    );

    const estimatedSavings = totalIncome - totalExpenses;

    return res.json({
      user: users[0],
      summary: {
        total_estimated_income: totalIncome,
        total_estimated_expenses: totalExpenses,
        estimated_savings: estimatedSavings,
        currency: "NGN",
      },
      income_streams: incomeStreams,
      expense_categories: expenseCategories,
    });

  } catch (err) {
    console.error("Dashboard error:", err.message);
    return res.status(500).json({ error: "Could not load dashboard." });
  }
};

module.exports = { getDashboard };