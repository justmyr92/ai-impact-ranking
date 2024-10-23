import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../../components/Sidebar";

const EditInstrument = () => {
    const { instrument_id } = useParams();
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

    const [instrumentData, setInstrumentData] = useState({
        instrument_id: instrument_id,
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

    useEffect(() => {
        const fetchInstrumentAndSections = async () => {
            try {
                // Fetch instrument data
                const iResponse = await fetch(
                    `http://localhost:9000/api/get/instrument-by-instrument-id/${instrument_id}`
                );
                const iData = await iResponse.json();
                console.log(iData, "asd");
                // Fetch sections data
                const sectionsResponse = await fetch(
                    `http://localhost:9000/api/get/section-by-instrument-id/${instrument_id}`
                );
                const sectionsData = await sectionsResponse.json();

                // Fetch questions for each section
                // const sectionsWithQuestions = await Promise.all(
                //     sectionsData.map(async (section) => {
                //         const questionsResponse = await fetch(
                //             `http://localhost:9000/api/get/questions/${section.section_id}`
                //         );
                //         const questionsData = await questionsResponse.json();

                //         // Map questions to the expected structure
                //         const questions = questionsData.map(
                //             async (question) => ({
                //                 question_id: question.question_id,
                //                 questionId: question.sub_id,
                //                 questionText: question.question,
                //                 questionType: question.type,
                //                 suffix: question.suffix || "",
                //                 options: await fetch(
                //                     `http://localhost:9000/api/get/options/${question.question_id}`
                //                 ).then((response) => response.json()),
                //             })
                //         );

                //         // Return section data with questions
                //         return {
                //             section_id: section.section_id,
                //             content: section.section_content || "",
                //             questions: questions,
                //             formulas: [""],
                //         };
                //     })
                // );

                const sectionsWithQuestions = await Promise.all(
                    sectionsData.map(async (section) => {
                        const questionsResponse = await fetch(
                            `http://localhost:9000/api/get/questions/${section.section_id}`
                        );
                        const questionsData = await questionsResponse.json();

                        // Map questions to the expected structure and await all promises
                        const questions = await Promise.all(
                            questionsData.map(async (question) => {
                                const optionsResponse = await fetch(
                                    `http://localhost:9000/api/get/options/${question.question_id}`
                                );
                                const optionsData =
                                    await optionsResponse.json();
                                console.log(
                                    `Question ${question.question_id} options: `,
                                    optionsData
                                );

                                return {
                                    question_id: question.question_id,
                                    questionId: question.sub_id,
                                    questionText: question.question,
                                    questionType: question.type,
                                    suffix: question.suffix || "",
                                    options: optionsData, // Set options directly after fetching
                                };
                            })
                        );

                        // Return section data with resolved questions
                        return {
                            section_id: section.section_id,
                            content: section.section_content || "",
                            questions: questions,
                            formulas: [""],
                        };
                    })
                );

                // Update instrument data state
                setInstrumentData({
                    instrument_id: instrument_id,
                    sdg_id: iData[0].sdg_id || "",
                    subtitle: iData[0].sdg_subtitle || "",
                    sections: sectionsWithQuestions,
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchInstrumentAndSections();
    }, [instrument_id]);

    useEffect(() => {
        if (instrument_id) {
            console.log(instrumentData);
        }
    }, [instrumentData]);

    const generateQuestionId = (sectionIndex, questionIndex) => {
        // Determine the letter prefix based on the section index
        const sectionPrefix = String.fromCharCode(
            "A".charCodeAt(0) + questionIndex
        );

        // Append the section index + 1 as the number
        return `${sectionPrefix}${sectionIndex + 1}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInstrumentData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSectionContentChange = (e, sectionIndex) => {
        const { value } = e.target;
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].content = value;
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

    const handleOptionChange = (
        e,
        sectionIndex,
        questionIndex,
        questionID,
        optionIndex
    ) => {
        const { value } = e.target;
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions[questionIndex].options[
            optionIndex
        ] = {
            option: value,
            question_id: questionID,
        };
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
        if (value === "Multiple Options") {
            updatedSections[sectionIndex].questions[questionIndex].options = [
                "",
            ];
        }
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const addSection = () => {
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: [
                ...prevData.sections,
                { content: "", questions: [], formulas: [] },
            ],
        }));
    };

    const removeSection = (sectionIndex) => {
        const updatedSections = instrumentData.sections.filter(
            (_, index) => index !== sectionIndex
        );
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const addQuestion = (sectionIndex) => {
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions.push({
            questionText: "",
            questionId: generateQuestionId(
                sectionIndex,
                updatedSections[sectionIndex].questions.length
            ),
            questionType: "Number", // Default type
            options: [],
            suffix: "",
        });
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const removeQuestion = (sectionIndex, questionIndex) => {
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions = updatedSections[
            sectionIndex
        ].questions.filter((_, index) => index !== questionIndex);
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

    const removeOption = (sectionIndex, questionIndex, optionIndex) => {
        const updatedSections = [...instrumentData.sections];
        updatedSections[sectionIndex].questions[questionIndex].options =
            updatedSections[sectionIndex].questions[
                questionIndex
            ].options.filter((_, index) => index !== optionIndex);
        setInstrumentData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(instrumentData, "asdasdasdasd");

        const updatedInstrument = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9000/api/update/instrument/${instrumentData.instrument_id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            sdg_id: instrumentData.sdg_id,
                            subtitle: instrumentData.subtitle,
                        }),
                    }
                );
                const data = await response.json();

                if (response.ok) {
                    instrumentData.sections.map(async (section) => {
                        // Update or add sections
                        if (section.section_id) {
                            const response = await fetch(
                                `http://localhost:9000/api/update/section/${section.section_id}`,
                                {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        content: section.content,
                                    }),
                                }
                            );
                            const data = await response.json();
                        } else {
                            const response = await fetch(
                                `http://localhost:9000/api/add/sections/`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        instrument_id:
                                            instrumentData.instrument_id,
                                        section_content: section.content,
                                    }),
                                }
                            );
                            const data = await response.json();
                        }

                        // Update or add questions and their options
                        section.questions.map(async (question) => {
                            console.log(question);
                            if (question.question_id) {
                                // Update existing question
                                const response = await fetch(
                                    `http://localhost:9000/api/update/question/${question.question_id}`,
                                    {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            sub_id: question.questionId,
                                            question: question.questionText,
                                            type: question.questionType,
                                            suffix: question.suffix,
                                        }),
                                    }
                                );
                                const data = await response.json();
                            } else {
                                // Add new question
                                const response = await fetch(
                                    `http://localhost:9000/api/add/questions/`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            question: question.questionText,
                                            type: question.questionType,
                                            sub_id: question.questionId,
                                            suffix: question.suffix,
                                            section_id: section.section_id,
                                        }),
                                    }
                                );
                                const data = await response.json();
                            }
                            question.options &
                                question.options.map(async (option) => {
                                    console.log(
                                        "Options                                    ",
                                        option
                                    );
                                    if (option.option_id) {
                                        // Update existing option
                                        const response = await fetch(
                                            `http://localhost:9000/api/update/options/${option.option_id}`,
                                            {
                                                method: "PATCH",
                                                headers: {
                                                    "Content-Type":
                                                        "application/json",
                                                },
                                                body: JSON.stringify({
                                                    option: option.option,
                                                }),
                                            }
                                        );
                                        const data = await response.json();
                                    } else {
                                        // Add new option
                                        const response = await fetch(
                                            `http://localhost:9000/api/add/options/`,
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type":
                                                        "application/json",
                                                },
                                                body: JSON.stringify({
                                                    option: option.option,
                                                    question_id:
                                                        question.question_id,
                                                }),
                                            }
                                        );
                                        const data = await response.json();
                                    }
                                });
                        });
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        updatedInstrument();
    };

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">Edit Instrument</h1>
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
                        <div className="border border-gray-500 rounded-md shadow px-3 py-5 flex gap-4">
                            <div className="input-group mb-4 w-1/2">
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text">
                                            Select an SDG
                                        </span>
                                    </div>
                                    <select
                                        name="sdg_id"
                                        className="form__input border mt-1 block p-2 rounded-md shadow-sm sm:text-sm focus:outline-none w-full"
                                        value={instrumentData.sdg_id}
                                        onChange={handleInputChange}
                                        required
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
                                        className="form__input border mt-1 block w-full p-2 rounded-md shadow-sm sm:text-sm focus:outline-none"
                                        value={instrumentData.subtitle}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div className="border px-3 py-2">
                            {instrumentData.sections.map(
                                (section, sectionIndex) => (
                                    <div
                                        key={sectionIndex}
                                        className="section-group my-4"
                                    >
                                        <hr
                                            className={`${
                                                sectionIndex === 0
                                                    ? "hidden my-4"
                                                    : "my-4"
                                            }`}
                                        />
                                        <div className="flex gap-2 justify-between items-end">
                                            <div className="input-group w-[80%]">
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text">
                                                            Section Content
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter section content"
                                                        className="form__input border mt-1 block w-full p-2 rounded-md shadow-sm sm:text-sm focus:outline-none"
                                                        value={section.content}
                                                        onChange={(e) =>
                                                            handleSectionContentChange(
                                                                e,
                                                                sectionIndex
                                                            )
                                                        }
                                                        required
                                                    />
                                                </label>
                                            </div>
                                            <button
                                                type="button"
                                                className="bg-red-600 text-white text-sm px-4 py-2 h-fit"
                                                onClick={() =>
                                                    removeSection(sectionIndex)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </button>
                                        </div>

                                        {section.questions.map(
                                            (question, questionIndex) => (
                                                <div
                                                    key={questionIndex}
                                                    className="question-group my-4 flex flex-col"
                                                >
                                                    <div className="flex gap-2">
                                                        <div className="input-group w-[70%]">
                                                            <label className="form-control w-full">
                                                                <div className="label">
                                                                    <span className="label-text">
                                                                        {question.questionId +
                                                                            ". "}
                                                                        Question
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    name="questionText"
                                                                    placeholder="Enter question text"
                                                                    className="form__input border mt-1 block w-full p-2 rounded-md shadow-sm sm:text-sm focus:outline-none"
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
                                                                    required
                                                                />
                                                            </label>
                                                        </div>

                                                        <div className="input-group w-[20%]">
                                                            <label className="form-control w-full">
                                                                <div className="label">
                                                                    <span className="label-text">
                                                                        Suffix
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="form__input border mt-1 block w-full p-2 rounded-md shadow-sm sm:text-sm focus:outline-none"
                                                                    value={
                                                                        question.suffix
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const updatedSections =
                                                                            [
                                                                                ...instrumentData.sections,
                                                                            ];
                                                                        updatedSections[
                                                                            sectionIndex
                                                                        ].questions[
                                                                            questionIndex
                                                                        ].suffix =
                                                                            e.target.value;
                                                                        setInstrumentData(
                                                                            {
                                                                                ...instrumentData,
                                                                                sections:
                                                                                    updatedSections,
                                                                            }
                                                                        );
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        <div className="input-group w-[20%]">
                                                            <label className="form-control w-full">
                                                                <div className="label">
                                                                    <span className="label-text">
                                                                        Type
                                                                    </span>
                                                                </div>
                                                                <select
                                                                    name="questionType"
                                                                    className="form__input border mt-1 block w-full p-2 rounded-md shadow-sm sm:text-sm focus:outline-none"
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
                                                                    <option
                                                                        value="Number"
                                                                        selected
                                                                    >
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
                                                            className="bg-red-600 text-white text-sm px-4 py-2 h-fit"
                                                            onClick={() =>
                                                                removeQuestion(
                                                                    sectionIndex,
                                                                    questionIndex
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                            />
                                                        </button>
                                                    </div>
                                                    {question.questionType ===
                                                        "Multiple Options" && (
                                                        <div className="input-group mt-2">
                                                            <label className="form-control w-full">
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
                                                                            className="flex gap-2"
                                                                        >
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Enter option"
                                                                                className="form__input border mt-1 block px-3 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none w-full"
                                                                                value={
                                                                                    option.option
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleOptionChange(
                                                                                        e,
                                                                                        sectionIndex,
                                                                                        questionIndex,
                                                                                        question.question_id,
                                                                                        optionIndex
                                                                                    )
                                                                                }
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                className="bg-red-600 text-white text-sm px-4 py-2 mt-2"
                                                                                onClick={() =>
                                                                                    removeOption(
                                                                                        sectionIndex,
                                                                                        questionIndex,
                                                                                        optionIndex
                                                                                    )
                                                                                }
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={
                                                                                        faTrash
                                                                                    }
                                                                                />
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
                            className="bg-blue-600 text-white text-sm float-end px-6 py-2 my-2"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </main>
        </section>
    );
};

export default EditInstrument;
