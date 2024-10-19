const router = require("express").Router();
const pool = require("../db/sdg.db.js");
const bcrypt = require("bcrypt");
const generateToken = require("./utils/jwt.generator.js");
const authorize = require("./utils/jwt.validator.js");

// Get all SD officers
router.get("/get/csd-office", async (req, res) => {
    try {
        const sdOfficers = await pool.query("SELECT * FROM CSD_OFFICE");
        res.json(sdOfficers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

router.post("/csd-office/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query(
            "SELECT * FROM CSD_OFFICE WHERE email = $1",
            [email]
        );
        if (user.rows.length === 0) {
            return res.status(401).json("Invalid email or password");
        }
        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );
        if (!validPassword) {
            return res.status(401).json("Invalid email or password");
        }
        const token = generateToken(user.rows[0].user_id, user.rows[0].role);

        res.json({
            token: token,
            user_id: user.rows[0].user_id,
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.post("/add/csd-office", async (req, res) => {
    try {
        const { user_id, role, name, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await pool.query(
            "SELECT * FROM CSD_OFFICE WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new officer into the database
        await pool.query(
            "INSERT INTO CSD_OFFICE (user_id, role, name, email, password) VALUES ($1, $2, $3, $4, $5)",
            [user_id, role, name, email, hashedPassword]
        );

        res.status(201).json({ message: "CSD Officer added successfully" });
    } catch (err) {
        console.error("Error adding CSD officer:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Utility function to validate password
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
}

// Add a new CSD officer
router.post("/add/csd-office", async (req, res) => {
    try {
        const { user_id, role, name, email, password } = req.body;

        // Validate password
        if (!validatePassword(password)) {
            return res.status(400).json({
                error: "Password must contain at least 8 characters, including uppercase, lowercase letters, and numbers.",
            });
        }

        // Check if the email already exists
        const existingUser = await pool.query(
            "SELECT * FROM CSD_OFFICE WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new officer into the database
        await pool.query(
            "INSERT INTO CSD_OFFICE (user_id, role, name, email, password) VALUES ($1, $2, $3, $4, $5)",
            [user_id, role, name, email, hashedPassword]
        );

        res.status(201).json({ message: "CSD Officer added successfully" });
    } catch (err) {
        console.error("Error adding CSD officer:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/validate-token", authorize, (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
