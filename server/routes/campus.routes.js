const router = require("express").Router();
const pool = require("../db/sdg.db.js");
const bcrypt = require("bcrypt");

// Get all campuses
router.get("/get/campuses", async (req, res) => {
    try {
        const campuses = await pool.query("SELECT * FROM CAMPUS");
        res.json(campuses.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all campuses by extension
router.get("/get/campuses/:extension", async (req, res) => {
    try {
        const { extension } = req.params;
        const campuses = await pool.query(
            "SELECT * FROM CAMPUS WHERE is_extension = $1",
            [extension]
        );
        res.json(campuses.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
