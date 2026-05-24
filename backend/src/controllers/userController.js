const db = require("../db/connection");

// -----------------------------------------------
// POST /api/register
// Handles all 3 sections of the registration form
// -----------------------------------------------
const registerUser = async (req, res) => {
  const { fullname, email, password, income_streams, expense_categories } = req.body;

  // Basic validation
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: "Fullname, email and password are required." });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Check if email already exists
    const [existing] = await conn.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: "Email already registered." });
    }

    // 2. Insert user (Section 1)
    const [userResult] = await conn.query(
      "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
      [fullname, email, password]
    );
    const userId = userResult.insertId;

    // 3. Insert income streams (Section 2)
    if (income_streams && income_streams.length > 0) {
      for (const stream of income_streams) {
        await conn.query(
          `INSERT INTO income_streams 
            (user_id, source_name, income_type, estimated_monthly_amount, currency, description) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            userId,
            stream.source_name,
            stream.income_type || "other",
            stream.estimated_monthly_amount || 0,
            stream.currency || "NGN",
            stream.description || null,
          ]
        );
      }
    }

    // 4. Insert expense categories (Section 3)
    if (expense_categories && expense_categories.length > 0) {
      for (const category of expense_categories) {
        await conn.query(
          `INSERT INTO expense_categories 
            (user_id, category_name, category_type, estimated_monthly_spend, currency, priority, description) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            category.category_name,
            category.category_type || "other",
            category.estimated_monthly_spend || 0,
            category.currency || "NGN",
            category.priority || "medium",
            category.description || null,
          ]
        );
      }
    }

    await conn.commit();

    return res.status(201).json({
      message: "Registration successful!",
      user_id: userId,
      user: { id: userId, fullname, email },
    });

  } catch (err) {
    await conn.rollback();
    console.error("Registration error:", err.message);
    return res.status(500).json({ error: "Registration failed. Try again." });
  } finally {
    conn.release();
  }
};

// GET /api/users/:id
// Get a single user's profile
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      "SELECT id, fullname, email, created_at FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const [incomeStreams] = await db.query(
      "SELECT * FROM income_streams WHERE user_id = ?",
      [id]
    );
    const [expenseCategories] = await db.query(
      "SELECT * FROM expense_categories WHERE user_id = ?",
      [id]
    );

    return res.json({
      user: users[0],
      income_streams: incomeStreams,
      expense_categories: expenseCategories,
    });

  } catch (err) {
    console.error("Get user error:", err.message);
    return res.status(500).json({ error: "Could not fetch user." });
  }
};

module.exports = { registerUser, getUserById };