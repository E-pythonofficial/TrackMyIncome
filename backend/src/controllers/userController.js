const db = require("../db/connection");
const bcrypt = require("bcrypt");

// POST /api/register
const registerUser = async (req, res) => {
  const { fullname, email, password, income_streams, expense_categories } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: "Fullname, email and password are required." });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [existing] = await conn.query(
      "SELECT id FROM users WHERE email = ?", [email]
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: "Email already registered." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await conn.query(
      "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
      [fullname, email, hashedPassword]
    );
    const userId = userResult.insertId;

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
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      "SELECT id, fullname, email, created_at FROM users WHERE id = ?", [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const [incomeStreams] = await db.query(
      "SELECT * FROM income_streams WHERE user_id = ?", [id]
    );
    const [expenseCategories] = await db.query(
      "SELECT * FROM expense_categories WHERE user_id = ?", [id]
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

// POST /api/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?", [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return res.status(200).json({
      message: "Login successful!",
      user_id: user.id,
      user: { id: user.id, fullname: user.fullname, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Login failed. Try again." });
  }
};

// Add loginUser to your exports at the bottom
module.exports = { registerUser, getUserById, loginUser };

