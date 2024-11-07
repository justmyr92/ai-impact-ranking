const router = require("express").Router();
const pool = require("../db/sdg.db.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../src/assets/evidence")); // Path to your assets folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Optional: rename files to prevent overwriting
    },
});

const upload = multer({ storage: storage });

router.post("/records-values", async (req, res) => {
    try {
        const { question_id, selectedYear, selectedSdg, user_id } = req.body;

        if (!selectedYear || !selectedSdg || !question_id) {
            return res.status(400).json({
                message: "Question ID, Year, and SDG must be provided",
            });
        }

        // Query to get record values based on question_id, selectedYear, and selectedSdg
        const result = await pool.query(
            `SELECT rv.*
             FROM records_values rv
             INNER JOIN records r ON rv.record_id = r.record_id
             WHERE rv.question_id = $1 AND r.sdg_id = $2 AND EXTRACT(YEAR FROM r.date_submitted) = $3 AND r.user_id = $4`,
            [question_id, selectedSdg, selectedYear, user_id]
        );

        // Check if values were found
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ message: "No values found for the given criteria" });
        }

        // Format the response data before sending
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/get/records-count-per-sdg", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.sdg_id, s.title, COALESCE(COUNT(r.sdg_id), 0) AS count
             FROM sdg s
             LEFT JOIN records r ON s.sdg_id = r.sdg_id
             GROUP BY s.sdg_id, s.title
             ORDER BY s.number`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/records-values/check", async (req, res) => {
    try {
        const { selectedYear, selectedSdg, user_id } = req.body;

        if (!selectedYear || !selectedSdg || !user_id) {
            return res.status(400).json({
                message: "Year, SDG, and User ID must be provided",
            });
        }

        // Query to get record values based on user_id, selectedYear, and selectedSdg
        const result = await pool.query(
            `SELECT r.record_id
             FROM records r
             WHERE r.sdg_id = $1 AND EXTRACT(YEAR FROM r.date_submitted) = $2 AND r.user_id = $3`,
            [selectedSdg, selectedYear, user_id]
        );

        // Check if a record was found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }

        // Return the record_id
        res.json({ record_id: result.rows[0].record_id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/add/records", async (req, res) => {
    try {
        const { user_id, status, sdg_id, year } = req.body;

        console.log(req.body);

        // Default status to 'To be reviewed' if not provided
        const recordStatus = status || 1;

        // Generate a unique record ID REC + 1000000 to 9999999
        const record_id = `REC${Math.floor(Math.random() * 9000000) + 1000000}`;

        // Insert the new record into the database
        const newRecord = await pool.query(
            "INSERT INTO records (record_id, user_id, status, date_submitted, sdg_id, year) VALUES ($1, $2, $3, current_timestamp, $4, $5) RETURNING *",
            [record_id, user_id, recordStatus, sdg_id, year]
        );

        res.status(201).json(newRecord.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/add/answers", async (req, res) => {
    const { record_value_id, value, question_id, record_id, campus_id } =
        req.body;

    try {
        // Check if all required fields are provided
        if (
            !record_value_id ||
            !value ||
            !question_id ||
            !record_id ||
            !campus_id
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Insert data into the table
        const query = `
            INSERT INTO records_values (record_value_id, value, question_id, record_id, campus_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [
            record_value_id,
            value,
            question_id,
            record_id,
            campus_id,
        ];
        const result = await pool.query(query, values);
        console.log(result);
        // Return the inserted row
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/get/answers/:record_id", async (req, res) => {
    const { record_id } = req.params;

    try {
        // Check if required parameters are provided
        if (!record_id) {
            return res
                .status(400)
                .json({ error: "All query parameters are required" });
        }

        // Fetch data from the table
        const query = `
          SELECT rv.record_value_id, rv.value, rv.question_id, rv.record_id, rv.campus_id, q.sub_id
FROM public.records_values rv
INNER JOIN public.question q ON rv.question_id = q.question_id
WHERE rv.record_id = $1;
        `;
        const values = [record_id];
        const result = await pool.query(query, values);

        // Return the fetched rows
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route: GET /api/get/record/:year/:sdg
router.get("/get/record/:year/:sdg", async (req, res) => {
    const { year, sdg } = req.params;

    try {
        // Replace with your actual query to fetch record based on year and SDG
        const record = await pool.query(
            "SELECT * FROM records WHERE year = $1 AND sdg_id = $2",

            [year, sdg]
        );

        if (record.rows.length > 0) {
            res.json(record.rows[0]); // Return the first record if multiple records exist
        } else {
            res.status(404).json({ message: "No record found" });
        }
    } catch (error) {
        console.error("Error fetching record:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/get/recordbysdoffice/:year/:sdg/:user_id", async (req, res) => {
    const { year, sdg, user_id } = req.params;

    try {
        // Replace with your actual query to fetch record based on year and SDG
        const record = await pool.query(
            "SELECT * FROM records WHERE year = $1 AND sdg_id = $2 AND user_id=$3",

            [year, sdg, user_id]
        );

        if (record.rows.length > 0) {
            res.json(record.rows[0]); // Return the first record if multiple records exist
        } else {
            res.status(404).json({ message: "No record found" });
        }
    } catch (error) {
        console.error("Error fetching record:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/get/record-values", async (req, res) => {
    try {
        // Query to join records_values with question and select required columns
        const result = await pool.query(`
            SELECT rv.record_value_id, rv.value, rv.question_id, rv.record_id, rv.campus_id, q.sub_id, r.sdg_id
            FROM records_values rv
            JOIN question q ON rv.question_id = q.question_id
            JOIN records r ON rv.record_id = r.record_id
        `);

        // Send the result as JSON
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching record values:", error);
        res.status(500).send("Server error");
    }
});

// PATCH route to update the status of a record
router.patch("/update/status", async (req, res) => {
    const { record_id, status } = req.body; // Get the new status from the request body

    try {
        // Check if the status is provided
        if (!status) {
            return res.status(400).json({ message: "Status must be provided" });
        }

        // Update the status in the records table
        const result = await pool.query(
            `UPDATE records
             SET status = $1
             WHERE record_id = $2
             RETURNING *;`,
            [status, record_id]
        );

        // Check if the record was found and updated
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Record not found" });
        }

        // Return the updated record
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating record status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//
router.put("/update/answers", async (req, res) => {
    const { record_value_id, value } = req.body;

    try {
        const query = `
            UPDATE records_values
            SET value = $1
            WHERE record_value_id = $2
            RETURNING *;
        `;
        const values = [value, record_value_id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Define the route
router.get("/get/records-values", async (req, res) => {
    try {
        // SQL query
        const query = `
SELECT 
    rv.*,             -- Fetch all columns from records_values
    q.sub_id,         -- Fetch sub_id from question table
    r.date_submitted, -- Fetch date_submitted from records table
    i.sdg_id,          -- Fetch sdg_id from instrument table
    s.section_id
FROM 
    public.records_values rv
JOIN 
    public.records r ON rv.record_id = r.record_id
JOIN 
    public.question q ON rv.question_id = q.question_id
JOIN 
    public.section s ON q.section_id = s.section_id  -- Join section table
JOIN 
    public.instrument i ON s.instrument_id = i.instrument_id;  -- Join instrument table to get sdg_id

        `;

        // Execute the query using the pool
        const result = await pool.query(query);

        // Send the result back as JSON
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching records values:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/sd-office/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        // Query the SD Office table to fetch the user by user_id
        const user = await pool.query(
            "SELECT * FROM sd_office WHERE user_id = $1",
            [user_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.patch("/update/sd-office/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { name, email, password, campus_id } = req.body;

    try {
        // Fetch the existing office data to check if the record exists
        const office = await pool.query(
            "SELECT * FROM sd_office WHERE user_id = $1",
            [user_id]
        );

        if (office.rows.length === 0) {
            return res.status(404).json({ error: "SD Office not found" });
        }

        // Initialize update fields
        let updateFields = [];
        let values = [];
        let i = 1;

        // Conditionally add fields to update if they exist in the request body
        if (name) {
            updateFields.push(`name = $${i}`);
            values.push(name);
            i++;
        }

        if (email) {
            updateFields.push(`email = $${i}`);
            values.push(email);
            i++;
        }

        if (password) {
            // Hash the new password before storing
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push(`password = $${i}`);
            values.push(hashedPassword);
            i++;
        }

        if (campus_id) {
            updateFields.push(`campus_id = $${i}`);
            values.push(campus_id);
            i++;
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        // Add the user_id to the values array for the WHERE clause
        values.push(user_id);

        // Construct the update query
        const updateQuery = `
            UPDATE sd_office
            SET ${updateFields.join(", ")}
            WHERE user_id = $${i}
            RETURNING *;
        `;

        // Execute the query
        const updatedOffice = await pool.query(updateQuery, values);

        res.status(200).json(updatedOffice.rows[0]);
    } catch (error) {
        console.error("Error updating SD Office:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/get/records-values-by-sdg_id/:sdg_id/:year", async (req, res) => {
    try {
        // Extract the sdg_id and year from the request parameters
        const { sdg_id, year } = req.params;
        console.log(sdg_id, year);

        // Updated SQL query with sdg_id and year filter
        const query = `
            SELECT 
                rv.*,               -- Fetch all columns from records_values
                q.sub_id,           -- Fetch sub_id from question table
                r.date_submitted,   -- Fetch date_submitted from records table
                i.sdg_id,           -- Fetch sdg_id from instrument table
                s.section_id
            FROM 
                public.records_values rv
            JOIN 
                public.records r ON rv.record_id = r.record_id
            JOIN 
                public.question q ON rv.question_id = q.question_id
            JOIN 
                public.section s ON q.section_id = s.section_id  -- Join section table
            JOIN 
                public.instrument i ON s.instrument_id = i.instrument_id 
            WHERE 
                r.status = 3 
                AND i.sdg_id = $1 
                AND EXTRACT(YEAR FROM r.date_submitted) = $2; -- Filter by year
        `;

        // Run the query with sdg_id and year parameters
        const result = await pool.query(query, [sdg_id, year]);
        // Send the result back as JSON
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching records values:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get(
    "/get/records-values-by-campus_id/:campus_id/:year",
    async (req, res) => {
        try {
            // Extract the campus_id from the request parameters
            const { campus_id, year } = req.params;
            console.log(year);
            // Updated SQL query with sdg_id filter
            const query = `
SELECT 
    rv.*,             -- Fetch all columns from records_values
    q.sub_id,         -- Fetch sub_id from question table
    r.date_submitted, -- Fetch date_submitted from records table
    i.sdg_id,         -- Fetch sdg_id from instrument table
    s.section_id, s.section_content
FROM 
    public.records_values rv
JOIN 
    public.records r ON rv.record_id = r.record_id
JOIN 
    public.question q ON rv.question_id = q.question_id
JOIN 
    public.section s ON q.section_id = s.section_id  -- Join section table
JOIN 
    public.instrument i ON s.instrument_id = i.instrument_id 
WHERE r.status = 3 AND EXTRACT(YEAR FROM r.date_submitted) = $1
AND rv.campus_id = $2;
        `;
            // Execute the query using the pool and pass the sdg_id parameter
            const result = await pool.query(query, [year, campus_id]);
            console.log(result);
            // Send the result back as JSON
            res.json(result.rows);
        } catch (error) {
            console.error("Error fetching records values:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

router.get("/get/records-values/:sdg_id", async (req, res) => {
    const { sdg_id } = req.params;
    try {
        // SQL query with sdg_id filter
        const query = `
            SELECT * 
            FROM campus 
            INNER JOIN records_values 
            ON campus.campus_id = records_values.campus_id
        `;

        // Execute the query using the pool with sdg_id as parameter
        const result = await pool.query(query);

        // Send the result back as JSON
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching records values:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// router.post("/upload-evidence", upload.array("files"), async (req, res) => {
//     // Access the sectionData from req.body
//     const sectionData = JSON.parse(req.body.sectionData); // Parse the JSON string
//     console.log("Received sectionData from client:", req.body);
//     try {
//         const promises = [];

//         console.log(sectionData, "sas");
//         for (const sectionId in sectionData) {
//             const files = req.files.filter((file) =>
//                 sectionData[sectionId].some(
//                     (evidence) => evidence.fileName === file.originalname
//                 )
//             );

//             files.forEach((file) => {
//                 const evidence = {
//                     evidence_id:
//                         "EID" + Math.floor(Math.random() * 900000 + 100000),
//                     name: file.filename, // Use the stored filename
//                     type: file.mimetype,
//                     section_id: sectionId,
//                     record_id: sectionData.record_id, // Set record_id as needed
//                 };

//                 console.log(evidence, "asdasd");

//                 // Prepare the insert query
//                 const query = `
//                     INSERT INTO evidence (evidence_id, name, type, section_id, record_id)
//                     VALUES ($1, $2, $3, $4, $5)
//                 `;
//                 promises.push(
//                     pool.query(query, [
//                         evidence.evidence_id,
//                         evidence.name,
//                         evidence.type,
//                         evidence.section_id,
//                         evidence.record_id,
//                     ])
//                 );
//             });
//         }

//         await Promise.all(promises); // Wait for all insertions to complete
//         res.status(200).json({
//             message: "Files uploaded and data saved successfully!",
//         });
//     } catch (error) {
//         console.error("Error uploading files: ", error);
//         res.status(500).json({
//             message: "Failed to upload files and save data.",
//         });
//     }
// });

router.post("/upload-evidence", upload.single("files"), async (req, res) => {
    try {
        // Parse sectionData from the request body
        const sectionData = JSON.parse(req.body.sectionData);
        console.log("Received sectionData from client:", sectionData);

        // Extract the necessary data for the evidence record
        const evidence = {
            evidence_id: "EID" + Math.floor(Math.random() * 900000 + 100000),
            name: req.file.filename, // Use the stored filename
            type: req.file.mimetype,
            section_id: sectionData.section_id, // Use the section ID from sectionData
            record_id: sectionData.record_id, // Use the record ID from sectionData
        };

        console.log("Inserting evidence:", evidence);

        // Prepare the insert query
        const query = `
            INSERT INTO evidence (evidence_id, name, type, section_id, record_id)
            VALUES ($1, $2, $3, $4, $5)
        `;

        // Execute the query to insert the evidence record
        await pool.query(query, [
            evidence.evidence_id,
            evidence.name,
            evidence.type,
            evidence.section_id,
            evidence.record_id,
        ]);

        res.status(200).json({
            message: "File uploaded and data saved successfully!",
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({
            message: "Failed to upload file and save data.",
        });
    }
});

router.get("/get/records-count-by-status", async (req, res) => {
    try {
        const result = await pool.query(`WITH Statuses AS (
    SELECT 1 AS status, 'Approved' AS name
    UNION ALL
    SELECT 2 AS status, 'Not Approved' AS name
    UNION ALL
    SELECT 3 AS status, 'For Revision' AS name
)
SELECT 
    Statuses.name,
    COALESCE(COUNT(records.status), 0) AS amount
FROM Statuses
LEFT JOIN records ON Statuses.status = records.status
GROUP BY Statuses.status, Statuses.name
ORDER BY Statuses.status;

`);

        res.json(result.rows);
    } catch (error) {
        console.error("Error getting records count by status: ", error);
    }
});

router.get("/get/records-pero-question/:sdg_id", async (req, res) => {
    try {
        const sdg_id = req.params.sdg_id;
        const result = await pool.query(
            `
SELECT 
    q.section_id,
    q.question,
    COALESCE(SUM(CAST(rv.value AS numeric)), 0) AS total_value
FROM 
    question q
LEFT JOIN 
    records_values rv ON rv.question_id = q.question_id
LEFT JOIN 
    records r ON r.record_id = rv.record_id
WHERE 
    r.sdg_id = $1
GROUP BY 
    q.section_id, q.question
ORDER BY 
    q.section_id;

`,
            [sdg_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error getting records count by status: ", error);
    }
});

module.exports = router;
