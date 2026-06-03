const express = require("express");
const router = express.Router();

const { registerUser, getUserById, loginUser } = require("../controllers/userController");
const { getDashboard } = require("../controllers/dashboardController");

// --- Registration ---
router.post("/register", registerUser);

// --- User Profile ---
router.get("/users/:id", getUserById);

// --- Dashboard ---
router.get("/dashboard/:id", getDashboard);

router.post("/login", loginUser)

module.exports = router;