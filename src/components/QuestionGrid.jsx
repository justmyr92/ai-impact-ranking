import React from "react";

const questions = [
    {
        question_id: "Q590801",
        question: "No. of PPAs",
        type: "Number",
        suffix: "",
        section_id: "S149923",
        sub_id: "A1",
    },
    {
        question_id: "Q942363",
        question: "No. of PPAs",
        type: "Number",
        suffix: "",
        section_id: "S400048",
        sub_id: "A2",
    },
    {
        question_id: "Q616340",
        question: "No. of PPAs",
        type: "Number",
        suffix: "",
        section_id: "S281781",
        sub_id: "A3",
    },
    {
        question_id: "Q496696",
        question: "Local",
        type: "Number",
        suffix: "",
        section_id: "S518615",
        sub_id: "A1",
    },
    {
        question_id: "Q217589",
        question: "Regional",
        type: "Number",
        suffix: "",
        section_id: "S518615",
        sub_id: "B1",
    },
    {
        question_id: "Q560144",
        question: "Global",
        type: "Number",
        suffix: "",
        section_id: "S518615",
        sub_id: "D1",
    },
    {
        question_id: "Q108117",
        question: "National",
        type: "Number",
        suffix: "",
        section_id: "S518615",
        sub_id: "C1",
    },
    {
        question_id: "Q506208",
        question: "Published Research on Poverty",
        type: "Number",
        suffix: "",
        section_id: "S438839",
        sub_id: "A1",
    },
    {
        question_id: "Q832712",
        question: "Co-Authored with Low or Lower-Middle income country",
        type: "Number",
        suffix: "",
        section_id: "S438839",
        sub_id: "B1",
    },
];

const QuestionGrid = () => {
    // Helper function to get a random number between 1 and 10
    const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {questions.map((question) => (
                    <div
                        key={question.question_id}
                        className="bg-white shadow-md rounded-lg p-4"
                    >
                        <p className="text-base text-gray-700">
                            {question.question}
                        </p>
                        <hr className="my-3" />
                        <div className="mt-4 text-5xl font-bold text-indigo-600">
                            {getRandomNumber()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionGrid;
