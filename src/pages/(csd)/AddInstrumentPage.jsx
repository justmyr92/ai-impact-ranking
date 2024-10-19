import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
//import FontAwesomeIcon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AddInstrumentPage = () => {
    const navigate = useNavigate(); // Initialize navigate hook
    const [sdgs, setSdgs] = useState([
        { sdg_id: "SDG01", no: 1, title: "No Poverty" },
        { sdg_id: "SDG02", no: 2, title: "Zero Hunger" },
        { sdg_id: "SDG03", no: 3, title: "Good Health and Well-being" },
        { sdg_id: "SDG04", no: 4, title: "Quality Education" },
        { sdg_id: "SDG05", no: 5, title: "Gender Equality" },
        { sdg_id: "SDG06", no: 6, title: "Clean Water and Sanitation" },
        { sdg_id: "SDG07", no: 7, title: "Affordable and Clean Energy" },
        { sdg_id: "SDG08", no: 8, title: "Decent Work and Economic Growth" },
        {
            sdg_id: "SDG09",
            no: 9,
            title: "Industry, Innovation, and Infrastructure",
        },
        { sdg_id: "SDG10", no: 10, title: "Reduced Inequality" },
        {
            sdg_id: "SDG11",
            no: 11,
            title: "Sustainable Cities and Communities",
        },
        {
            sdg_id: "SDG12",
            no: 12,
            title: "Responsible Consumption and Production",
        },
        { sdg_id: "SDG13", no: 13, title: "Climate Action" },
        { sdg_id: "SDG14", no: 14, title: "Life Below Water" },
        { sdg_id: "SDG15", no: 15, title: "Life on Land" },
        {
            sdg_id: "SDG16",
            no: 16,
            title: "Peace, Justice, and Strong Institutions",
        },
        { sdg_id: "SDG17", no: 17, title: "Partnerships for the Goals" },
    ]);

    useEffect(() => {
        const runValidation = async () => {
            try {
                const isVerified = await validateToken();
                if (
                    !isVerified ||
                    localStorage.getItem("role").toString() !== "0"
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

    const [instrumentData, setInstrumentData] = useState({
        sdg_id: "",
        subtitle: "",
        sections: [
            {
                content: "",
                questions: [
                    {
                        questionId: "A1",
                        questionText: "",
                        questionType: "Number",
                        suffix: "",
                        options: [],
                    },
                ],
                formulas: [""],
            },
        ],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInstrumentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSectionContentChange = (e, sectionIndex) => {
        const { name, value } = e.target;
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex][name] = value;
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const handleQuestionChange = (e, sectionIndex, questionIndex) => {
        const { name, value } = e.target;
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions[questionIndex][name] = value;
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const handleQuestionTypeChange = (e, sectionIndex, questionIndex) => {
        const { value } = e.target;
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions[questionIndex].questionType =
            value;
        updatedSections[sectionIndex].questions[questionIndex].suffix = ""; // Reset suffix if changing type
        updatedSections[sectionIndex].questions[questionIndex].options = []; // Reset options if changing type
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };
    const generateQuestionId = (sectionIndex, questionIndex) => {
        // Determine the letter prefix based on the section index
        const sectionPrefix = String.fromCharCode(
            "A".charCodeAt(0) + questionIndex
        );

        // Append the section index + 1 as the number
        return `${sectionPrefix}${sectionIndex + 1}`;
    };

    const addSection = () => {
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: [
                ...prevData.sections,
                {
                    content: "",
                    questions: [
                        {
                            questionId: generateQuestionId(
                                prevData.sections.length,
                                0
                            ),
                            questionText: "",
                            questionType: "Number",
                            suffix: "",
                            options: [],
                        },
                    ],
                    formulas: [""],
                },
            ],
        }));
    };

    const removeSection = (index) => {
        const updatedSections = instrumentData.sections.filter(
            (_, i) => i !== index
        );
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const addQuestion = (sectionIndex) => {
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: prevData.sections.map((section, idx) =>
                idx === sectionIndex
                    ? {
                          ...section,
                          questions: [
                              ...section.questions,
                              {
                                  questionId: generateQuestionId(
                                      sectionIndex,
                                      section.questions.length
                                  ),
                                  questionText: "",
                                  questionType: "Number",
                                  suffix: "",
                                  options: [],
                              },
                          ],
                      }
                    : section
            ),
        }));
    };

    const removeQuestion = (sectionIndex, questionIndex) => {
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions = updatedSections[
            sectionIndex
        ].questions.filter((_, i) => i !== questionIndex);
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const addOption = (sectionIndex, questionIndex) => {
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions[questionIndex].options.push("");
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const handleOptionChange = (
        e,
        sectionIndex,
        questionIndex,
        optionIndex
    ) => {
        const { value } = e.target;
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions[questionIndex].options[
            optionIndex
        ] = value;
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const removeOption = (sectionIndex, questionIndex, optionIndex) => {
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions[questionIndex].options =
            updatedSections[sectionIndex].questions[
                questionIndex
            ].options.filter((_, i) => i !== optionIndex);
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const addFormula = (sectionIndex) => {
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: prevData.sections.map((section, idx) =>
                idx === sectionIndex
                    ? {
                          ...section,
                          formulas: [...section.formulas, ""], // Add an empty formula
                      }
                    : section
            ),
        }));
    };
    const handleFormulaChange = (e, sectionIndex, formulaIndex) => {
        const { value } = e.target;
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].formulas[formulaIndex] = value;
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const removeFormula = (sectionIndex, formulaIndex) => {
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].formulas = updatedSections[
            sectionIndex
        ].formulas.filter((_, i) => i !== formulaIndex);
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Submit instrument data
            const response = await fetch(
                "http://localhost:9000/api/add/instruments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sdg_id: instrumentData.sdg_id,
                        subtitle: instrumentData.subtitle,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }

            const responseData = await response.json();

            // Submit sections and questions
            await Promise.all(
                instrumentData.sections.map(async (section) => {
                    const responseSection = await fetch(
                        "http://localhost:9000/api/add/sections",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                section_content: section.content,
                                instrument_id: responseData.instrument_id,
                            }),
                        }
                    );

                    const responseSectionData = await responseSection.json();

                    await Promise.all(
                        section.questions.map(async (questionData) => {
                            const responseQuestion = await fetch(
                                "http://localhost:9000/api/add/questions",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        question: questionData.questionText,
                                        type: questionData.questionType,
                                        suffix: questionData.suffix,
                                        sub_id: questionData.questionId,
                                        section_id:
                                            responseSectionData.section_id,
                                    }),
                                }
                            );
                            if (!responseQuestion.ok) {
                                throw new Error("Network response was not ok.");
                            }

                            const responseQuestionData =
                                await responseQuestion.json();

                            if (
                                questionData.questionType === "Multiple Options"
                            ) {
                                await Promise.all(
                                    questionData.options.map(async (option) => {
                                        const responseOption = await fetch(
                                            "http://localhost:9000/api/add/options",
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type":
                                                        "application/json",
                                                },
                                                body: JSON.stringify({
                                                    option,
                                                    question_id:
                                                        responseQuestionData.question_id,
                                                }),
                                            }
                                        );
                                        if (!responseOption.ok) {
                                            throw new Error(
                                                "Network response was not ok."
                                            );
                                        }
                                    })
                                );
                            }
                        })
                    );

                    // Submit formulas for the section
                    await Promise.all(
                        section.formulas.map(async (formula) => {
                            const responseFormula = await fetch(
                                "http://localhost:9000/api/add/formulas",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        formula: formula,
                                        section_id:
                                            responseSectionData.section_id,
                                    }),
                                }
                            );
                            if (!responseFormula.ok) {
                                throw new Error("Network response was not ok.");
                            }
                        })
                    );
                })
            );

            navigate("/instruments");
        } catch (error) {
            console.error("Error submitting instrument data:", error);
            // Handle error state or display error message to user
        }
    };

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">Add Instruments</h1>
                    <Link
                        to="/csd/instruments"
                        className="bg-blue-600 text-white text-base px-6 py-2"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </Link>
                </div>
                <hr />
                <div className="py-5 px-7">
                    <form onSubmit={handleSubmit}>
                        <div className="border border-red-500 px-3 py-5 flex gap-4">
                            <div className="input-group mb-4 w-1/2">
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text">
                                            Select an SDG
                                        </span>
                                    </div>
                                    <select
                                        name="sdg_id"
                                        className="form__input border mb-2 mt-1 block px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none w-full"
                                        value={instrumentData.sdg_id}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select an SDG</option>
                                        {sdgs.map((sdg) => (
                                            <option
                                                key={sdg.sdg_id}
                                                value={sdg.sdg_id}
                                            >
                                                {sdg.no}: {sdg.title}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="input-group mb-4 w-1/2">
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text">
                                            Subtitle
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        placeholder="Enter subtitle"
                                        className="form__input border mb-2 mt-1 block w-full px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none "
                                        value={instrumentData.subtitle}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <hr className="my-2" />
                        {/* Dynamic Sections */}
                        <div className="border px-3 py-2">
                            {instrumentData.sections.map(
                                (section, sectionIndex) => (
                                    <div
                                        key={sectionIndex}
                                        className="section-group my-4"
                                    >
                                        <div className="flex gap-2">
                                            <div className="input-group mb-2 w-4/5">
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text">
                                                            Content
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="content"
                                                        placeholder="Enter content"
                                                        className="form__input border mb-2 mt-1 block px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none w-full"
                                                        value={section.content}
                                                        onChange={(e) =>
                                                            handleSectionContentChange(
                                                                e,
                                                                sectionIndex
                                                            )
                                                        }
                                                    />
                                                </label>
                                            </div>
                                            <button
                                                type="button"
                                                className="bg-blue-600 text-white text-sm px-6 py-2 mt-2 h-fit"
                                                onClick={() =>
                                                    removeSection(sectionIndex)
                                                }
                                            >
                                                Remove Section
                                            </button>
                                        </div>
                                        {section.questions.map(
                                            (question, questionIndex) => (
                                                <div
                                                    key={questionIndex}
                                                    className="question-group my-4"
                                                >
                                                    <div className="flex gap-2">
                                                        <div className="input-group mb-2 w-4/5">
                                                            <label className="form-control w-full">
                                                                <div className="label">
                                                                    <span className="label-text">
                                                                        {
                                                                            question.questionId
                                                                        }
                                                                        .
                                                                        Question{" "}
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name="questionText"
                                                                    placeholder="Enter question"
                                                                    className="form__input border mb-2 mt-1 block px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none w-full   "
                                                                    value={
                                                                        question.questionText
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuestionChange(
                                                                            e,
                                                                            sectionIndex,
                                                                            questionIndex
                                                                        )
                                                                    }
                                                                />
                                                            </label>
                                                        </div>
                                                        {question.questionType ===
                                                            "Number" && (
                                                            <div className="input-group mb-2 w-1/5">
                                                                <label className="form-control w-full max-w-xs">
                                                                    <div className="label">
                                                                        <span className="label-text">
                                                                            Suffix
                                                                            (Optional)
                                                                        </span>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        name="suffix"
                                                                        placeholder="e.g., %, kg"
                                                                        className="form__input border mb-2 mt-1 block px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none w-full"
                                                                        value={
                                                                            question.suffix
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleQuestionChange(
                                                                                e,
                                                                                sectionIndex,
                                                                                questionIndex
                                                                            )
                                                                        }
                                                                    />
                                                                </label>
                                                            </div>
                                                        )}
                                                        <div className="input-group mb-2 w-1/5">
                                                            <label className="form-control w-full max-w-xs">
                                                                <div className="label">
                                                                    <span className="label-text">
                                                                        Question
                                                                        Type
                                                                    </span>
                                                                </div>
                                                                <select
                                                                    name="questionType"
                                                                    className="form__input border mb-2 mt-1 block px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none w-full"
                                                                    value={
                                                                        question.questionType
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuestionTypeChange(
                                                                            e,
                                                                            sectionIndex,
                                                                            questionIndex
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="Number">
                                                                        Number
                                                                    </option>
                                                                    <option value="Multiple Options">
                                                                        Multiple
                                                                        Options
                                                                    </option>
                                                                </select>
                                                            </label>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="bg-blue-600 text-white text-sm px-6 py-2 mt-2"
                                                            onClick={() =>
                                                                removeQuestion(
                                                                    sectionIndex,
                                                                    questionIndex
                                                                )
                                                            }
                                                        >
                                                            Remove Question
                                                        </button>
                                                    </div>
                                                    {question.questionType ===
                                                        "Multiple Options" && (
                                                        <div className="input-group mb-2">
                                                            <label className="form-control w-full max-w-xs">
                                                                <div className="label">
                                                                    <span className="label-text">
                                                                        Options
                                                                    </span>
                                                                </div>
                                                                {question.options.map(
                                                                    (
                                                                        option,
                                                                        optionIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                optionIndex
                                                                            }
                                                                            className="flex gap-2 mb-2"
                                                                        >
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Enter option"
                                                                                className="form__input border mb-2 mt-1 block px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none w-full"
                                                                                value={
                                                                                    option
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleOptionChange(
                                                                                        e,
                                                                                        sectionIndex,
                                                                                        questionIndex,
                                                                                        optionIndex
                                                                                    )
                                                                                }
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                className="bg-blue-600 text-white text-sm px-6 py-2 mt-2"
                                                                                onClick={() =>
                                                                                    removeOption(
                                                                                        sectionIndex,
                                                                                        questionIndex,
                                                                                        optionIndex
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                                Option
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    className="bg-blue-600 text-white text-sm px-6 py-2 mt-2"
                                                                    onClick={() =>
                                                                        addOption(
                                                                            sectionIndex,
                                                                            questionIndex
                                                                        )
                                                                    }
                                                                >
                                                                    Add Option
                                                                </button>
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}
                                        <button
                                            type="button"
                                            className="bg-blue-600 text-white text-sm px-6 py-2 mb-4 h-fit"
                                            onClick={() =>
                                                addQuestion(sectionIndex)
                                            }
                                        >
                                            Add Question
                                        </button>
                                        {section.formulas &&
                                            section.formulas.map(
                                                (formula, formulaIndex) => (
                                                    <div
                                                        key={formulaIndex}
                                                        className="formula-group my-2"
                                                    >
                                                        <div className="input-group mb-2 w-full">
                                                            <label className="form-control w-full">
                                                                <div className="label">
                                                                    <span className="label-text">
                                                                        Formula
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <textarea
                                                                        placeholder="Enter formula"
                                                                        className="form__input border mb-2 mt-1 block px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none w-full h-32"
                                                                        value={
                                                                            formula
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleFormulaChange(
                                                                                e,
                                                                                sectionIndex,
                                                                                formulaIndex
                                                                            )
                                                                        }
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="bg-blue-600 text-white text-sm px-6 py-2 mt-2 h-fit"
                                                                        onClick={() =>
                                                                            removeFormula(
                                                                                sectionIndex,
                                                                                formulaIndex
                                                                            )
                                                                        }
                                                                    >
                                                                        Remove
                                                                        Formula
                                                                    </button>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        <button
                                            type="button"
                                            className="bg-blue-600 text-white text-sm px-6 py-2 mt-2"
                                            onClick={() =>
                                                addFormula(sectionIndex)
                                            }
                                        >
                                            Add Formula
                                        </button>
                                    </div>
                                )
                            )}
                            <button
                                type="button"
                                className="bg-blue-600 text-white text-sm px-6 py-2 mb-4 h-fit"
                                onClick={addSection}
                            >
                                Add Section
                            </button>
                        </div>
                        <hr />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white text-sm px-6 py-2 mt-2"
                        >
                            Submit Instrument
                        </button>
                    </form>
                </div>
            </main>
        </section>
    );
};

export default AddInstrumentPage;
