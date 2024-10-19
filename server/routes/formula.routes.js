const router = require("express").Router();
const pool = require("../db/sdg.db.js");

// router.get("/get/formula_per_section", async (req, res) => {
//     try {
//         const sdOfficers = await pool.query(
//             "SELECT * FROM formula_per_section"
//         );
//         res.json(sdOfficers.rows);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

router.get("/get/formula_per_section/:section_id", async (req, res) => {
    try {
        const { section_id } = req.params;

        const formulaSection = await pool.query(
            "SELECT * FROM formula_per_section where section_id = $1",
            [section_id]
        );
        res.json(formulaSection.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
