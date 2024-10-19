import React, { useState, useEffect } from "react";
import excelFormula from "excel-formula";
import { Input, Label } from "@headlessui/react";

const RecordSubmissionForm = ({ selectedSdg, selectedYear, userId }) => {
    const [instruments, setInstruments] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState("");
    const [formulas, setFormulas] = useState([]);
    const [scores, setScores] = useState([]);
    const [total, setTotal] = useState([]);
    const [summedAnswers, setSummedAnswers] = useState([]);
    const [campusId, setCampusID] = useState(null);
    const [updatedFormulas, setUpdatedFormulas] = useState([]);
    const [sectionFiles, setSectionFiles] = useState({});

    const [sumByQuestionID, setSumByQuestionID] = useState([]); // State to store the arr
    const campuses = {
        1: ["1", "5", "6", "9"],
        2: ["2", "7", "11", "8"],
        3: ["3"],
        4: ["10"],
        5: ["4"],
    };

    const campusNames = {
        1: "Pablo Borbon",
        2: "Alangilan",
        3: "Lipa",
        4: "Nasugbu",
        10: "Malvar",
        5: "Lemery",
        6: "Rosario",
        7: "Balayan",
        8: "Mabini",
        9: "San Juan",
        11: "Lobo",
    };

    // Fetch campus data when userId changes
    useEffect(() => {
        const fetchCampusData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9000/api/get/sd-office/${localStorage.getItem(
                        "user_id"
                    )}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setCampusID(data[0].campus_id); // Set the campus state with fetched campus IDs
                    console.log(
                        "Campus IDs fetched successfully: ",
                        data[0].campus_id
                    );
                } else {
                    console.error("Failed to fetch campus data.");
                    setError("Failed to fetch campus data.");
                }
            } catch (err) {
                console.error("Error fetching campus data:", err);
                setError("An error occurred while fetching campus data.");
            }
        };

        if (localStorage.getItem("user_id")) {
            fetchCampusData();
        }
    }, []);

    // Flatten campuses to a single array for display based on matching campus key
    const flattenedCampuses = Object.keys(campuses).flatMap((key) => {
        if (campusId === key) {
            return campuses[key].map((campusId) => ({
                id: campusId,
                name: campusNames[campusId] || campusId,
            }));
        }
        return []; // Return an empty array if the key doesn't match
    });

    useEffect(() => {
        const fetchInstruments = async () => {
            if (!selectedSdg) return;

            try {
                const response = await fetch(
                    `http://localhost:9000/api/get/instrumentsbysdg/${selectedSdg}`
                );
                if (response.ok) {
                    const instrumentData = await response.json();
                    await fetchSectionsForInstruments(instrumentData);
                } else {
                    setError("Failed to fetch instruments.");
                }
            } catch (error) {
                setError("An error occurred while fetching instruments.");
            }
        };

        const fetchSectionsForInstruments = async (instrumentData) => {
            try {
                const updatedInstruments = await Promise.all(
                    instrumentData.map(async (instrument) => {
                        const sectionsResponse = await fetch(
                            `http://localhost:9000/api/get/sectionsbyinstrument/${instrument.instrument_id}`
                        );
                        if (sectionsResponse.ok) {
                            const sections = await sectionsResponse.json();
                            const sectionsWithQuestions =
                                await fetchQuestionsForSections(sections);
                            return {
                                ...instrument,
                                section_contents: sectionsWithQuestions,
                            };
                        } else {
                            return { ...instrument, section_contents: [] };
                        }
                    })
                );
                setInstruments(updatedInstruments);
            } catch (error) {
                setError("An error occurred while fetching sections.");
            }
        };

        const fetchQuestionsForSections = async (sections) => {
            try {
                let fetchedFormulas = [];
                const sectionsWithQuestions = await Promise.all(
                    sections.map(async (section) => {
                        try {
                            const questionsResponse = await fetch(
                                `http://localhost:9000/api/get/questions/${section.section_id}`
                            );
                            const fetchFormulas = await fetch(
                                `http://localhost:9000/api/get/formula_per_section/${section.section_id}`
                            );
                            const formula = await fetchFormulas.json();

                            if (!formula.includes(section.section_id)) {
                                fetchedFormulas.push(formula[0]);
                            }

                            if (questionsResponse.ok) {
                                const questions =
                                    await questionsResponse.json();
                                return {
                                    ...section,
                                    questions: questions,
                                };
                            } else {
                                return { ...section, questions: [] };
                            }
                        } catch (error) {
                            return { ...section, questions: [] };
                        }
                    })
                );
                setFormulas((prevFormula) => [
                    ...prevFormula,
                    ...fetchedFormulas,
                ]);
                return sectionsWithQuestions;
            } catch (error) {
                setError("An error occurred while fetching questions.");
                return sections.map((section) => ({
                    ...section,
                    questions: [],
                }));
            }
        };

        fetchInstruments();
    }, [selectedSdg]);

    const generateAnswers = (instrumentData) => {
        const answers = [];
        instrumentData.forEach((instrument) => {
            instrument.section_contents.forEach((section) => {
                section.questions.forEach((question) => {
                    flattenedCampuses.forEach((campus) => {
                        answers.push({
                            question_id: question.question_id,
                            sub_id: question.sub_id,
                            value: 0,
                            campus_id: campus.id,
                        });
                    });
                });
            });
        });
        return answers;
    };

    useEffect(() => {
        if (instruments.length > 0) {
            setAnswers(generateAnswers(instruments));
        }
    }, [instruments]);

    const handleInputChange = (e, question_id, sub_id, campus_id) => {
        const { value } = e.target;
        setAnswers((prevAnswers) =>
            prevAnswers.map((answer) =>
                answer.question_id === question_id &&
                answer.sub_id === sub_id &&
                answer.campus_id === campus_id
                    ? { ...answer, value: parseFloat(value) || 0 }
                    : answer
            )
        );
    };

    useEffect(() => {
        let uniqueFormulas;

        if (formulas && formulas.length > 0) {
            uniqueFormulas = formulas.reduce((acc, current) => {
                // Check if this formula_id has already been added to the accumulator
                if (
                    !acc.some((item) => item.formula_id === current.formula_id)
                ) {
                    acc.push(current);
                }
                return acc;
            }, []);
            console.log(uniqueFormulas, "Asd");
        }

        if (answers && answers.length > 0) {
            const summedAnswers = answers.reduce((acc, item) => {
                const questionId = item.question_id;
                const subId = item.sub_id;

                // Ensure value is numeric, otherwise parse it to a number
                const value = parseFloat(item.value) || 0;

                // Find if there's already an entry for this question_id and sub_id
                const existingEntry = acc.find(
                    (entry) =>
                        entry.question_id === questionId &&
                        entry.sub_id === subId
                );

                if (existingEntry) {
                    // If an entry exists, sum the value
                    existingEntry.value += value;
                } else {
                    // If no entry exists, create a new object
                    acc.push({
                        question_id: questionId,
                        sub_id: subId,
                        value: value,
                    });
                }

                return acc;
            }, []); // Initialize as an empty array

            setSumByQuestionID(summedAnswers); // Update the state with the summed answers as an array of objects
            console.log(summedAnswers, "marker"); // Optional: for debugging
        } else {
            console.log("No answers or empty array", "marker");
        }
    }, [formulas, answers]); // Re-run effect whenever formulas or answers change

    useEffect(() => {
        if (
            formulas &&
            formulas.length > 0 &&
            sumByQuestionID &&
            sumByQuestionID.length > 0
        ) {
            // Filter unique formulas based on formula_id
            const uniqueFormulas = formulas.filter(
                (value, index, self) =>
                    index ===
                    self.findIndex((t) => t.formula_id === value.formula_id)
            );

            // Assuming sumByQuestionID is in the format similar to summationData
            const valueMap = {};
            sumByQuestionID.forEach((item) => {
                valueMap[item.sub_id] = item.value; // Create a map for fast lookup
            });

            // Function to replace values in the formula
            const replaceFormulaValues = (formula, valueMap) => {
                return formula.replace(/([A-Z]\d+)/g, (match) => {
                    return valueMap[match] !== undefined
                        ? valueMap[match]
                        : match;
                });
            };

            // Apply replacement to each unique formula
            const updatedFormulasV = uniqueFormulas.map((formulaObj) => {
                const updatedFormula = replaceFormulaValues(
                    formulaObj.formula,
                    valueMap
                );
                return {
                    ...formulaObj,
                    formula: updatedFormula,
                    score: eval(excelFormula.toJavaScript(updatedFormula)),
                };
            });

            setUpdatedFormulas(updatedFormulasV); // Log the updated formulas with replaced values
        }
    }, [sumByQuestionID, formulas]);

    const [fileData, setFileData] = useState([]);
    const handleFileChange = (event, section_id) => {
        const selectedFiles = Array.from(event.target.files);
        setFileData((prev) => ({
            ...prev,
            [section_id]: selectedFiles,
        }));
    };

    const uploadFile = async (e) => {
        const formData = new FormData();

        // Append files to formData based on fileData state
        for (const sectionId in fileData) {
            fileData[sectionId].forEach((file) => {
                console.log(file, "Appending file"); // Log each file being appended
                formData.append("files", file); // Append each file to formData
            });
        }

        // Include section data in the request body
        const sectionData = {
            ...sectionFiles, // Add your section data structure here
        };

        // Convert the section data to a JSON string and append it to the FormData
        formData.append("sectionData", JSON.stringify(sectionData));

        // Log the contents of FormData
        for (let [key, value] of formData.entries()) {
            console.log(key, value); // This will log each key-value pair in FormData
        }

        // Proceed with sending the request
        try {
            const response = await fetch(
                "http://localhost:9000/api/upload-evidence",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();

            return true;
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create record data

        if (!uploadFile()) {
            return;
        }

        const recordData = {
            user_id: localStorage.getItem("user_id"),
            status: 1,
            date_submitted: new Date().toISOString(),
            sdg_id: selectedSdg,
            year: selectedYear,
        };

        try {
            // Submit the record to the server
            const recordResponse = await fetch(
                "http://localhost:9000/api/add/records",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(recordData),
                }
            );

            if (!recordResponse.ok) {
                throw new Error("Failed to submit record");
            }

            const record = await recordResponse.json(); // Retrieve the inserted record's ID

            // Function to generate a random record_value_id
            const generateRandomId = () => {
                return crypto.randomUUID(); // Generates a UUID
            };

            // Prepare a batch of answers for submission
            const sendAnswers = async () => {
                const url = "http://localhost:9000/api/add/answers";

                for (const answer of answers) {
                    // Ensure each answer has a value and corresponding IDs
                    if (!answer.question_id || !answer.campus_id) {
                        console.error("Invalid answer data:", answer);
                        continue; // Skip any invalid answers
                    }

                    // Prepare the data for each answer
                    const data = {
                        record_value_id: generateRandomId(), // Generate a random ID for each answer
                        value: answer.value.toString(), // Use the value or default to 0 if it's undefined/null
                        question_id: answer.question_id,
                        record_id: record.record_id, // The record ID returned from the first request
                        campus_id: answer.campus_id,
                    };

                    try {
                        const answerResponse = await fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        });

                        if (!answerResponse.ok) {
                            throw new Error(
                                `Failed to submit answer for question ${answer.question_id} and campus ${answer.campus_id}`
                            );
                        }

                        const result = await answerResponse.json();
                        console.log("Answer submitted successfully:", result);
                    } catch (error) {
                        console.error("Error submitting answer:", error);
                    }
                }
            };

            // Send all answers
            await sendAnswers();

            console.log("All answers submitted successfully.");
        } catch (error) {
            console.error("Error during submission:", error);
        }
    };

    return (
        <div>
            <h2>Record Submission Form for SDG: {selectedSdg}</h2>
            <h3>Year: {selectedYear}</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    {error && <p className="text-red-500">{error}</p>}
                    {instruments.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100"></thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                {instruments.map((instrument, index) => (
                                    <React.Fragment
                                        key={instrument.instrument_id}
                                    >
                                        <tr>
                                            <td
                                                colSpan={
                                                    flattenedCampuses.length + 2
                                                }
                                                className="px-6 py-4 font-semibold text-left bg-gray-100"
                                            >
                                                {instrument.sdg_subtitle}
                                            </td>
                                        </tr>
                                        {instrument.section_contents.length >
                                        0 ? (
                                            instrument.section_contents.map(
                                                (section) => (
                                                    <React.Fragment
                                                        key={section.section_id}
                                                    >
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {
                                                                    section.section_content
                                                                }
                                                            </td>
                                                            {flattenedCampuses.map(
                                                                (campus) => (
                                                                    <td
                                                                        key={
                                                                            campus.id
                                                                        }
                                                                        className="border px-6 py-3"
                                                                    >
                                                                        {
                                                                            campus.name
                                                                        }
                                                                    </td>
                                                                )
                                                            )}
                                                        </tr>
                                                        {section.questions.map(
                                                            (
                                                                question,
                                                                index
                                                            ) => (
                                                                <React.Fragment
                                                                    key={
                                                                        question.question_id
                                                                    }
                                                                >
                                                                    <tr>
                                                                        <td className="border px-4 py-2 text-start whitespace-nowrap align-top">
                                                                            {index +
                                                                                1}
                                                                            .{" "}
                                                                            {
                                                                                question.question
                                                                            }
                                                                        </td>
                                                                        {flattenedCampuses.map(
                                                                            (
                                                                                campus
                                                                            ) => (
                                                                                <td
                                                                                    key={
                                                                                        campus.id
                                                                                    }
                                                                                    className="border px-4 py-2"
                                                                                >
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        value={
                                                                                            answers.find(
                                                                                                (
                                                                                                    ans
                                                                                                ) =>
                                                                                                    ans.question_id ===
                                                                                                        question.question_id &&
                                                                                                    ans.sub_id ===
                                                                                                        question.sub_id &&
                                                                                                    ans.campus_id ===
                                                                                                        campus.id
                                                                                            )
                                                                                                ?.value ||
                                                                                            0
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleInputChange(
                                                                                                e,
                                                                                                question.question_id,
                                                                                                question.sub_id,
                                                                                                campus.id
                                                                                            )
                                                                                        }
                                                                                        className="border rounded p-1 w-[5rem]"
                                                                                    />
                                                                                </td>
                                                                            )
                                                                        )}
                                                                        {/* <td className="border px-4 py-2 text-start whitespace-nowrap align-top">
                                                                            {updatedFormulas.find(
                                                                                (
                                                                                    formula
                                                                                ) =>
                                                                                    formula.section_id ===
                                                                                    section.section_id
                                                                            )
                                                                                ?.score ||
                                                                                0}
                                                                        </td> */}
                                                                    </tr>
                                                                </React.Fragment>
                                                            )
                                                        )}
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    flattenedCampuses.length
                                                                }
                                                                className="border px-4 py-2 text-end whitespace-nowrap align-top"
                                                            >
                                                                Score
                                                            </td>
                                                            <td
                                                                colSpan={
                                                                    flattenedCampuses.length +
                                                                    1
                                                                }
                                                                className="border px-4 py-2 text-end whitespace-nowrap align-top"
                                                            >
                                                                {updatedFormulas
                                                                    .filter(
                                                                        (
                                                                            formula
                                                                        ) =>
                                                                            formula.section_id ===
                                                                            section.section_id
                                                                    )
                                                                    .reduce(
                                                                        (
                                                                            acc,
                                                                            curr
                                                                        ) =>
                                                                            acc +
                                                                            (curr.score ||
                                                                                0),
                                                                        0
                                                                    )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    flattenedCampuses.length +
                                                                    1
                                                                }
                                                                className="border px-4 py-2 whitespace-nowrap align-top"
                                                            >
                                                                <div
                                                                    key={
                                                                        section.section_id
                                                                    }
                                                                >
                                                                    <label
                                                                        htmlFor={`file-${section.section_id}`}
                                                                    >
                                                                        Upload
                                                                        files
                                                                        for
                                                                    </label>
                                                                    <br />
                                                                    <input
                                                                        id={`file-${section.section_id}`}
                                                                        type="file"
                                                                        accept=".jpeg, .jpg, .png, .pdf"
                                                                        multiple
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleFileChange(
                                                                                e,
                                                                                section.section_id
                                                                            )
                                                                        }
                                                                    />
                                                                    {sectionFiles[
                                                                        section
                                                                            .section_id
                                                                    ] && (
                                                                        <ul>
                                                                            {fileData[
                                                                                section
                                                                                    .section_id
                                                                            ].map(
                                                                                (
                                                                                    file,
                                                                                    index
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            file.name
                                                                                        }
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    flattenedCampuses.length +
                                                                    1
                                                                }
                                                                className="border px-4 text-end py-2 whitespace-nowrap align-top"
                                                            >
                                                                Total Score: 0
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        flattenedCampuses.length +
                                                        1
                                                    }
                                                    className="px-6 py-4 text-center"
                                                >
                                                    No sections available
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No instruments available</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-5"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default RecordSubmissionForm;
