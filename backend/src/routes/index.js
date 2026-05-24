const express = require("express");
const router = express.Router();

const { registerUser, getUserById } = require("../controllers/userController");
const { getDashboard } = require("../controllers/dashboardController");

// --- Registration ---
router.post("/register", registerUser);

// --- User Profile ---
router.get("/users/:id", getUserById);

// --- Dashboard ---
router.get("/dashboard/:id", getDashboard);

module.exports = router;