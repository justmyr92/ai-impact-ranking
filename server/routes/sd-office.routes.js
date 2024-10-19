const router = require("express").Router();
const pool = require("../db/sdg.db.js");
const bcrypt = require("bcrypt");
const generateToken = require("./utils/jwt.generator.js");
const authorize = require("./utils/jwt.validator.js");
// Add a new office

router.post("/add/sd-office", async (req, res) => {
    try {
        const { name, email, password, campus_id } = req.body;
        const user_id = "SD" + Math.floor(Math.random() * 99999999 + 1000000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newOffice = await pool.query(
            "INSERT INTO SD_OFFICE (user_id, role, name, email, password, campus_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_id, 1, name, email, hashedPassword, campus_id]
        );
        res.json(newOffice.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all SD officers
router.get("/get/sd-office", async (req, res) => {
    try {
        const sdOfficers = await pool.query("SELECT * FROM SD_OFFICE");
        res.json(sdOfficers.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all SD officers with campuses
router.get("/get/sd-office/with-campuses", async (req, res) => {
    try {
        const sdOfficers = await pool.query(`
              SELECT 
                sd_office.*,
                campus.name AS campus_name
            FROM 
                SD_OFFICE sd_office
            INNER JOIN 
                CAMPUS campus
            ON 
                sd_office.campus_id = campus.campus_id
        `);
        res.json(sdOfficers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/get/sd-office/:user_id", async (req, res) => {
    try {
        const { user_id: userId } = req.params; // Correctly destructure userId from req.params

        const sdOfficers = await pool.query(
            `
            SELECT campus_id 
            FROM sd_office 
            WHERE user_id = $1
            `,
            [userId] // Correctly pass the userId as a parameter
        );

        res.json(sdOfficers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

//Update SD officer without password

router.patch("/update/sd-office/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const { name, email, campus_id } = req.body;
        const updatedOffice = await pool.query(
            "UPDATE SD_OFFICE SET name = $1, email = $2, campus_id = $3 WHERE user_id = $4 RETURNING *",
            [name, email, campus_id, user_id]
        );
        res.json(updatedOffice.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//Update SD officer with password
router.patch("/update/sd-office/w-password/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const { name, email, password, campus_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedOffice = await pool.query(
            "UPDATE SD_OFFICE SET name = $1, email = $2, password = $3, campus_id = $4 WHERE user_id = $5 RETURNING *",
            [name, email, hashedPassword, campus_id, user_id]
        );
        res.json(updatedOffice.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

router.post("/sd-office/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = await pool.query(
            "SELECT * FROM SD_OFFICE WHERE email = $1",
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
        console.log(token);
        res.json({
            token: token,
            user_id: user.rows[0].user_id,
        });
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
