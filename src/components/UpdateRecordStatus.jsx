import React, { useState, useEffect } from "react";
import excelFormula from "excel-formula";

const UpdateRecordStatus = ({
    selectedSdg,
    selectedYear,
    recordId,
    recordStatus,
    selectedSD,
}) => {
    const [instruments, setInstruments] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState("");
    const [formulas, setFormulas] = useState([]);
    const [scores, setScores] = useState([]);
    const [total, setTotal] = useState([]);
    const [summedAnswers, setSummedAnswers] = useState([]);
    const [campusId, setCampusID] = useState(null);
    const [updatedFormulas, setUpdatedFormulas] = useState([]);
    const [existingAnswers, setExistingAnswers] = useState([]);
    const [status, setStatus] = useState(0); // State for status

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

    useEffect(() => {
        const fetchExistingAnswers = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9000/api/get/answers/${recordId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch answers");
                }
                const data = await response.json();
                setAnswers(data);
            } catch (error) {
                console.error("Error fetching existing answers:", error);
            }
        };

        if (recordId) {
            fetchExistingAnswers();
        }
    }, [recordId]);

    // Fetch campus data when userId changes
    useEffect(() => {
        const fetchCampusData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9000/api/get/sd-office/${selectedSD}`
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

    const handleInputChange = (e, question_id, campus_id) => {
        const { value } = e.target;
        setAnswers((prevAnswers) =>
            prevAnswers.map((answer) =>
                answer.question_id === question_id &&
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

            setSumByQuestionID(summedAnswers);
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
            console.log(
                "Updated formulas with replaced values:",
                updatedFormulasV,
                updatedFormulasV.reduce((acc, curr) => acc + curr.score, 0)
            );

            setTotal(
                updatedFormulasV.reduce((acc, curr) => acc + curr.score, 0)
            );
        }
    }, [sumByQuestionID, formulas]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create a payload with the current status
            const payload = {
                record_id: recordId,
                status: status, // Send the updated status
            };

            const response = await fetch(
                "http://localhost:9000/api/update/status",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} ${response.statusText}`
                );
            }

            const result = await response.json();
            console.log("Status updated successfully:", result);

            // Optionally, update the local status or display a success message
        } catch (error) {
            console.error("Error updating status:", error);
            setError("An error occurred while updating the status.");
        }
    };

    useEffect(() => {
        console.log(instruments, "instrument");
    }, [instruments]);

    const [role, setRole] = useState(null);

    useEffect(() => {
        // Fetch role from localStorage when the component mounts
        const storedRole = localStorage.getItem("role");
        setRole(Number(storedRole)); // Make sure role is treated as a number
    }, []);

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
                                {instruments.map((instrument) => (
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
                                                                                    {role ===
                                                                                    0 ? (
                                                                                        // If role is 0, display score as text
                                                                                        <span>
                                                                                            {answers.find(
                                                                                                (
                                                                                                    ans
                                                                                                ) =>
                                                                                                    ans.question_id ===
                                                                                                        question.question_id &&
                                                                                                    ans.campus_id ===
                                                                                                        campus.id
                                                                                            )
                                                                                                ?.value ||
                                                                                                0}
                                                                                        </span>
                                                                                    ) : (
                                                                                        // If role is not 0, display input field
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
                                                                                                    campus.id
                                                                                                )
                                                                                            }
                                                                                            className="border rounded p-1 w-[5rem]"
                                                                                        />
                                                                                    )}
                                                                                </td>
                                                                            )
                                                                        )}
                                                                    </tr>
                                                                </React.Fragment>
                                                            )
                                                        )}
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    flattenedCampuses.length +
                                                                    2
                                                                }
                                                                className="border px-4 py-2 text-end whitespace-nowrap align-top"
                                                            >
                                                                <span className="font-semibold mr-2">
                                                                    Score:
                                                                </span>
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

                <div>
                    {error && <p className="text-red-500">{error}</p>}
                    {/* Dropdown for status selection */}
                    <label htmlFor="status" className="block mb-2">
                        Status:
                    </label>
                    <select
                        id="status"
                        onChange={(e) => setStatus(Number(e.target.value))} // Update status on selection
                        className="border rounded p-1 w-full"
                    >
                        <option value={1} selected={recordStatus === 1}>
                            To be Approved
                        </option>
                        <option value={2} selected={recordStatus === 2}>
                            To be Revised
                        </option>
                        <option value={3} selected={recordStatus === 3}>
                            Approved
                        </option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Submit Status
                </button>
            </form>
        </div>
    );
};

export default UpdateRecordStatus;
