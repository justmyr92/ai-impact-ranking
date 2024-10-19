import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { validateToken } from "../../services/service";
import excelFormula from "excel-formula";

const SDRecordPage = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedSdg, setSelectedSdg] = useState("SDG01");
    const [instruments, setInstruments] = useState([]);
    const [sdOfficers, setSdOfficers] = useState([]);
    const [sum, setSum] = useState(0);

    useEffect(() => {
        const runValidation = async () => {
            try {
                const isVerified = await validateToken();
                if (
                    !isVerified ||
                    localStorage.getItem("role").toString() !== "1"
                ) {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error during token validation:", error);
                return {
                    error: "An error occurred during token validation.",
                };
            }
        };
        runValidation();
    }, []);

    useEffect(() => {
        const getSDOfficers = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9000/api/get/sd-office"
                );
                const jsonData = await response.json();
                setSdOfficers(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        };

        getSDOfficers();
    }, []);

    const [sdgs, setSdgs] = useState([
        { sdg_id: "SDG01", no: 1, title: "No Poverty", color: "#E5243B" },
        { sdg_id: "SDG02", no: 2, title: "Zero Hunger", color: "#DDA63A" },
        {
            sdg_id: "SDG03",
            no: 3,
            title: "Good Health and Well-being",
            color: "#4C9F38",
        },
        {
            sdg_id: "SDG04",
            no: 4,
            title: "Quality Education",
            color: "#C5192D",
        },
        { sdg_id: "SDG05", no: 5, title: "Gender Equality", color: "#FF3A21" },
        {
            sdg_id: "SDG06",
            no: 6,
            title: "Clean Water and Sanitation",
            color: "#26BDE2",
        },
        {
            sdg_id: "SDG07",
            no: 7,
            title: "Affordable and Clean Energy",
            color: "#FCC30B",
        },
        {
            sdg_id: "SDG08",
            no: 8,
            title: "Decent Work and Economic Growth",
            color: "#A21942",
        },
        {
            sdg_id: "SDG09",
            no: 9,
            title: "Industry, Innovation, and Infrastructure",
            color: "#FD6925",
        },
        {
            sdg_id: "SDG10",
            no: 10,
            title: "Reduced Inequality",
            color: "#DD1367",
        },
        {
            sdg_id: "SDG11",
            no: 11,
            title: "Sustainable Cities and Communities",
            color: "#FD9D24",
        },
        {
            sdg_id: "SDG12",
            no: 12,
            title: "Responsible Consumption and Production",
            color: "#BF8B2E",
        },
        { sdg_id: "SDG13", no: 13, title: "Climate Action", color: "#3F7E44" },
        {
            sdg_id: "SDG14",
            no: 14,
            title: "Life Below Water",
            color: "#0A97D9",
        },
        { sdg_id: "SDG15", no: 15, title: "Life on Land", color: "#56C02B" },
        {
            sdg_id: "SDG16",
            no: 16,
            title: "Peace, Justice, and Strong Institutions",
            color: "#00689D",
        },
        {
            sdg_id: "SDG17",
            no: 17,
            title: "Partnerships for the Goals",
            color: "#19486A",
        },
    ]);

    const [scores, setScores] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchInstrumentsBySdg = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9000/api/get/instrumentsbysdg/${selectedSdg}`
                );
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch instruments for SDG ${selectedSdg}`
                    );
                }
                const data = await response.json();

                let temp_answers = [];
                // Fetch sections and questions for each instrument
                const instrumentsWithDetails = await Promise.all(
                    data.map(async (instrument) => {
                        const sectionsResponse = await fetch(
                            `http://localhost:9000/api/get/sections/${instrument.instrument_id}`
                        );
                        if (!sectionsResponse.ok) {
                            throw new Error(
                                `Failed to fetch sections for instrument ${instrument.instrument_id}`
                            );
                        }
                        const sections = await sectionsResponse.json();

                        // Fetch questions for each section
                        const sectionsWithQuestions = await Promise.all(
                            sections.map(async (section) => {
                                const questionsResponse = await fetch(
                                    `http://localhost:9000/api/get/questions/${section.section_id}`
                                );

                                const formulaResponse = await fetch(
                                    `http://localhost:9000/api/get/formula_per_section/${section.section_id}`
                                );
                                if (!questionsResponse.ok) {
                                    throw new Error(
                                        `Failed to fetch questions for section ${section.section_id}`
                                    );
                                }
                                const questions =
                                    await questionsResponse.json();
                                const formulas = await formulaResponse.json();
                                // questions.map((question) => {
                                //     setAnswers((prevAnswers) => [
                                //         ...prevAnswers,
                                //         {
                                //             answer: "0",
                                //             questionId: question.question_id,
                                //             sub_id: question.sub_id,
                                //         },
                                //     ]);
                                // });
                                questions.map((question) => {
                                    temp_answers.push({
                                        questionId: question.question_id,
                                        answer: "0",
                                        sub_id: question.sub_id,
                                    });
                                });
                                setAnswers(temp_answers);

                                return {
                                    ...section,
                                    questions: questions,
                                    formula: formulas,
                                };
                            })
                        );

                        return {
                            ...instrument,
                            sections: sectionsWithQuestions,
                        };
                    })
                );

                setInstruments(instrumentsWithDetails);
            } catch (error) {
                console.error("Error fetching instruments and details:", error);
            }
        };

        fetchInstrumentsBySdg();

        setAnswers([]);
    }, [selectedSdg]);

    const handleAnswerChange = (questionId, answer, sub_id) => {
        // Update or add the answer for the question
        const updatedAnswers = [...answers];
        const existingAnswerIndex = updatedAnswers.findIndex(
            (item) => item.questionId === questionId
        );

        if (existingAnswerIndex !== -1) {
            // Update existing answer
            updatedAnswers[existingAnswerIndex] = {
                questionId,
                answer,
                sub_id,
            };
        } else {
            // Add new answer
            updatedAnswers.push({ questionId, answer, sub_id });
        }

        setAnswers(updatedAnswers);
    };

    function substituteVariables(formula, variables) {
        let substitutedFormula = formula;

        for (let [key, value] of Object.entries(variables)) {
            let regex = new RegExp(`\\b${key}\\b`, "g");
            substitutedFormula = substitutedFormula.replace(regex, value);
        }

        return substitutedFormula;
    }
    useEffect(() => {
        const updatedScores = [];
        let formula = "";
        instruments.forEach((instrument) => {
            instrument.sections.forEach((section) => {
                section.formula.forEach((formulaObj) => {
                    // Create variables object from answers
                    const variables = section.questions.reduce(
                        (acc, question) => {
                            const answerObj = answers.find(
                                (ans) => ans.questionId === question.question_id
                            );
                            if (answerObj) {
                                acc[`${question.sub_id}`] = answerObj.answer;
                            }
                            return acc;
                        },
                        {}
                    );

                    formula = formulaObj.formula ? formulaObj.formula : formula;
                    // Substitute variables in the formula
                    const substitutedFormula = substituteVariables(
                        formula,
                        variables
                    );

                    // Evaluate the substituted formula
                    try {
                        const translatedFormula =
                            excelFormula.toJavaScript(substitutedFormula);

                        // Use a safer alternative to eval if possible
                        const result = eval(translatedFormula);

                        updatedScores.push({
                            section_id: section.section_id,
                            result,
                        });
                    } catch (error) {
                        console.error("Error evaluating formula:", error);
                    }
                });
            });
        });

        // Update state with new scores
        setScores((prevScores) => {
            const scoresMap = new Map(
                prevScores.map((score) => [score.section_id, score])
            );
            updatedScores.forEach(({ section_id, result }) => {
                scoresMap.set(section_id, { section_id, result });
            });
            const updatedScoresArray = Array.from(scoresMap.values());

            setSum(
                updatedScoresArray.reduce(
                    (sum, score) => sum + (score.result || 0),
                    0
                )
            );
            return Array.from(scoresMap.values());
        });
    }, [answers, instruments]);

    const getQuestionNumber = (sectionIndex, questionIndex) => {
        const letter = String.fromCharCode(65 + questionIndex); // A, B, C, ...
        return `${letter}${sectionIndex + 1}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const recordData = {
            user_id: localStorage.getItem("user_id"),
            status: 1,
            date_submitted: new Date().toISOString(),
        };

        const response = await fetch("http://localhost:9000/api/add/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recordData),
        });

        if (response.ok) {
            const record = await response.json();

            const sendAnswers = async (answers) => {
                // URL of your Express endpoint
                const url = "http://localhost:9000/api/add/answers";

                // Loop through each answer object in the array
                for (const answer of answers) {
                    // Prepare the data for each POST request
                    const data = {
                        record_value_id: answer.questionId, // Map questionId to record_value_id
                        value: answer.answer,
                        question_id: answer.questionId,
                        record_id: record.record_id, // Assuming sub_id maps to record_id
                    };

                    try {
                        const response = await fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        });

                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }

                        const result = await response.json();
                        console.log("Success:", result);
                    } catch (error) {
                        console.error("Error:", error);
                    }
                }
            };

            sendAnswers(answers);
        }
    };

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">Record</h1>
                </div>
                <hr />

                <div className="py-5 px-7">
                    <div className="flex justify-start gap-3 items-center">
                        <div className="w-1/4">
                            <h1 className="text-lg">Select Year</h1>
                            <select
                                className="border border-gray-300 rounded-md p-2 w-1/2"
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                }
                            >
                                <option value={2024}>2024</option>
                                <option value={2023}>2023</option>
                                <option value={2022}>2022</option>
                                <option value={2021}>2021</option>
                            </select>
                        </div>
                        <div className="w-3/4">
                            <h1 className="text-lg">Select SDG</h1>
                            <select
                                className="border border-gray-300 rounded-md p-2 w-1/2"
                                value={selectedSdg}
                                onChange={(e) => setSelectedSdg(e.target.value)}
                            >
                                {sdgs.map((sdg) => (
                                    <option key={sdg.sdg_id} value={sdg.sdg_id}>
                                        {sdg.no}. {sdg.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <hr className="w-full border my-4" />

                    <div className="flex flex-col border">
                        {instruments.map((instrument, index) => (
                            <div key={instrument.instrument_id} className="p-4">
                                <h1>
                                    {index + 1}. Subtitle:{" "}
                                    {instrument?.sdg_subtitle}
                                </h1>
                                {instrument.sections.map(
                                    (section, sectionIndex) => (
                                        <div
                                            key={section.section_id}
                                            className="p-4"
                                        >
                                            <h1>
                                                {(sectionIndex + 1).toString()}.
                                                Section:{" "}
                                                {section?.section_content}
                                            </h1>
                                            <ul>
                                                {section.questions.map(
                                                    (
                                                        question,
                                                        questionIndex
                                                    ) => (
                                                        <li
                                                            key={
                                                                question.question_id
                                                            }
                                                            className="p-2 flex justify-between items-center"
                                                        >
                                                            {getQuestionNumber(
                                                                sectionIndex,
                                                                questionIndex
                                                            )}
                                                            {". "}
                                                            {question.question}
                                                            <input
                                                                type="text"
                                                                value={
                                                                    answers.find(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.questionId ===
                                                                            question.question_id
                                                                    )?.answer ||
                                                                    "0"
                                                                }
                                                                onChange={(e) =>
                                                                    handleAnswerChange(
                                                                        question.question_id,
                                                                        e.target
                                                                            .value,
                                                                        question.sub_id
                                                                    )
                                                                }
                                                                className="border border-gray-300 rounded-md p-2 w-32"
                                                            />
                                                        </li>
                                                    )
                                                )}
                                            </ul>

                                            <div className="flex justify-end">
                                                <h1 className="mt-4">
                                                    Achieved Score :{" "}
                                                    <span className="text-green-500">
                                                        {scores
                                                            .filter(
                                                                (score) =>
                                                                    score.section_id ===
                                                                    section.section_id
                                                            )
                                                            .map(
                                                                (
                                                                    score,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {
                                                                            score.result
                                                                        }
                                                                    </div>
                                                                )
                                                            )}
                                                    </span>
                                                </h1>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                        <div className="bg-red-500 text-white text-center p-3">
                            Total Scores : {sum}
                        </div>
                        <button
                            className="bg-blue-500 text-white p-2 rounded-md w-fit mt-2"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </main>
        </section>
    );
};

export default SDRecordPage;
