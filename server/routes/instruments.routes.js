const router = require("express").Router();
const pool = require("../db/sdg.db.js");

// GET all instruments
router.post("/add/instruments", async (req, res) => {
    try {
        const { subtitle, sdg_id } = req.body;
        console.log("Subtitle:", subtitle, "SDG ID:", sdg_id);
        // Generate a random instrument_id
        const instrument_id = "I" + Math.floor(Math.random() * 900000 + 100000);

        // Attempting to insert into the database
        const newInstrument = await pool.query(
            "INSERT INTO instrument (instrument_id, section_no, sdg_subtitle, sdg_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [instrument_id, "", subtitle, sdg_id]
        );

        res.json(newInstrument.rows[0]); // Return the inserted instrument data
    } catch (error) {
        console.error("Error adding instrument:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/add/sections", async (req, res) => {
    try {
        const { section_content, instrument_id } = req.body;
        console.log(
            "Section content:",
            section_content,
            "Instrument ID:",
            instrument_id
        );
        // Generate a random section_id
        const section_id = "S" + Math.floor(Math.random() * 900000 + 100000);

        // Attempting to insert into the database
        const newSection = await pool.query(
            "INSERT INTO section (section_id, content_no, section_content, instrument_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [section_id, "", section_content, instrument_id]
        );

        res.json(newSection.rows[0]); // Return the inserted section data
    } catch (error) {
        console.error("Error adding section:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/get-records-count-by-status", async (req, res) => {
    try {
        const query = `
            SELECT status, COUNT(*) as count
            FROM public.records
            GROUP BY status;
        `;

        const result = await pool.query(query);

        // Return the results as JSON
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching record counts:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/add/questions", async (req, res) => {
    try {
        const { question, type, sub_id, suffix, section_id } = req.body;

        const question_id = "Q" + Math.floor(Math.random() * 900000 + 100000);

        const newQuestion = await pool.query(
            "INSERT INTO question (question_id, question, type, suffix, section_id, sub_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [question_id, question, type, suffix, section_id, sub_id]
        );

        res.json(newQuestion.rows[0]); // Return the inserted question data
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/add/options", async (req, res) => {
    try {
        const { option, question_id } = req.body;

        const option_id = "O" + Math.floor(Math.random() * 900000 + 100000);

        const newOption = await pool.query(
            "INSERT INTO options (option_id, option, question_id) VALUES ($1, $2, $3) RETURNING *",
            [option_id, option, question_id]
        );

        res.json(newOption.rows[0]); // Return the inserted option data
    } catch (error) {
        console.error("Error adding option:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/add/formulas", async (req, res) => {
    try {
        const { formula, section_id } = req.body;

        const formula_id = "F" + Math.floor(Math.random() * 900000 + 100000);

        const newFormula = await pool.query(
            "INSERT INTO formula_per_section (formula_id, formula, section_id) VALUES ($1, $2, $3) RETURNING *",
            [formula_id, formula, section_id]
        );

        res.json(newFormula.rows[0]); // Return the inserted formula data
    } catch (error) {
        console.error("Error adding formula:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//select instrument, sdg and section
router.get("/get/instrumentsbysdgandsection", async (req, res) => {
    try {
        const instruments = await pool.query(
            "SELECT * FROM instrument JOIN sdg ON instrument.sdg_id = sdg.sdg_id JOIN section ON instrument.instrument_id = section.instrument_id"
        );
        res.json(instruments.rows);
    } catch (error) {
        console.error("Error getting instruments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//select instrument, sdg and section
router.get("/get/instruments/:instrument_id", async (req, res) => {
    try {
        const { instrument_id } = req.params;
        const instruments = await pool.query(
            "SELECT * FROM instrument JOIN sdg ON instrument.sdg_id = sdg.sdg_id JOIN section ON instrument.instrument_id = section.instrument_id WHERE instrument.instrument_id = $1",
            [instrument_id]
        );
        res.json(instruments.rows);
        console.log(instruments.rows);
    } catch (error) {
        console.error("Error getting instruments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//select instrument, sdg and section
router.get("/get/sections/:sdg_id", async (req, res) => {
    try {
        const { sdg_id } = req.params;
        const section = await pool.query(
            "SELECT * FROM section JOIN instrument ON section.instrument_id = instrument.instrument_id JOIN sdg ON instrument.sdg_id = sdg.sdg_id WHERE sdg.sdg_id = $1",
            [sdg_id]
        );
        console.log(section.rows);
        res.json(section.rows);
    } catch (error) {
        console.error("Error getting instruments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}); //select instrument, sdg and section

router.get("/get/questions/:section_id", async (req, res) => {
    try {
        const { section_id } = req.params;
        const questions = await pool.query(
            "SELECT * FROM question WHERE section_id = $1",
            [section_id]
        );
        res.json(questions.rows);
    } catch (error) {
        console.error("Error getting questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get formula per section
router.get("/get/formula/:section_id", async (req, res) => {
    try {
        const { section_id } = req.params;
        const formula = await pool.query(
            "SELECT * FROM formula_per_section WHERE section_id = $1 LIMIT 1",
            [section_id]
        );
        res.json(formula.rows);
    } catch (error) {
        console.error("Error getting formula:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/get/formula-per-sdg/:sdg_id", async (req, res) => {
    try {
        const { sdg_id } = req.params;
        console.log(sdg_id);
        const formula = await pool.query(
            `SELECT *
FROM formula_per_section
INNER JOIN section ON section.section_id = formula_per_section.section_id
INNER JOIN instrument ON instrument.instrument_id = section.instrument_id
WHERE instrument.sdg_id = $1`,
            [sdg_id]
        );
        res.json(formula.rows);
    } catch (error) {
        console.error("Error getting formula:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get instrument by sdg id
router.get("/get/instrumentsbysdg/:sdg_id", async (req, res) => {
    try {
        const { sdg_id } = req.params;
        const instruments = await pool.query(
            "SELECT * FROM instrument WHERE sdg_id = $1",
            [sdg_id]
        );
        res.json(instruments.rows);
    } catch (error) {
        console.error("Error getting instruments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get section by instrument id
router.get("/get/sectionsbyinstrument/:instrument_id", async (req, res) => {
    try {
        const { instrument_id } = req.params;
        const sections = await pool.query(
            "SELECT * FROM section WHERE instrument_id = $1",
            [instrument_id]
        );
        res.json(sections.rows);
    } catch (error) {
        console.error("Error getting sections:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
