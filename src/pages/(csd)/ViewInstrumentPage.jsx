import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ViewInstrumentPage = () => {
    const { instrument_id } = useParams();
    const [instrument, setInstrument] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [formula, setFormula] = useState("");

    useEffect(() => {
        const fetchInstrument = async () => {
            const response = await fetch(
                `http://localhost:9000/api/get/instruments/${instrument_id}`
            );
            const data = await response.json();
            setInstrument(data[0]);
            console.log(data[0]);
        };
        fetchInstrument();
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await fetch(
                `http://localhost:9000/api/get/questions/${instrument?.section_id}`
            );
            const data = await response.json();
            setQuestions(data);
        };

        const fetchFormula = async () => {
            const response = await fetch(
                `http://localhost:9000/api/get/formula/${instrument?.section_id}`
            );
            const data = await response.json();
            setFormula(data[0]);
            console.log(data);
        };

        fetchQuestions();
        fetchFormula();
    }, [instrument]);

    return (
        <section className="h-screen flex bg-gray-100">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto p-6">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Instrument Details
                    </h1>
                    <Link
                        to="/csd/instruments"
                        className="bg-blue-600 text-white text-base px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </Link>
                </div>
                <hr className="mb-6" />
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6">
                        Instrument Information
                    </h2>

                    <table className="w-full table-auto border-collapse">
                        <tbody>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-4 font-semibold">
                                    SDG Indicator
                                </th>
                                <td className="p-4">
                                    SDG{" "}
                                    {instrument?.number +
                                        ": " +
                                        instrument?.title}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <th className="text-left p-4 font-semibold">
                                    SDG Subtitle
                                </th>
                                <td className="p-4">
                                    {instrument?.sdg_subtitle}
                                </td>
                            </tr>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-4 font-semibold">
                                    SDG Section
                                </th>
                                <td className="p-4">
                                    {instrument?.section_content}
                                </td>
                            </tr>
                            <tr className="border-b bg-gray-200 text-center">
                                <th
                                    colSpan={2}
                                    className="p-4 text-lg font-bold"
                                >
                                    Questions
                                </th>
                            </tr>
                            <tr className="border-b">
                                <th className="text-left p-4 font-semibold">
                                    Question
                                </th>
                                <td className="p-4">
                                    {questions.map((question, index) => (
                                        <p
                                            key={index}
                                            className="text-wrap mb-2 text-gray-700"
                                        >
                                            {index +
                                                1 +
                                                ". " +
                                                question.question}
                                        </p>
                                    ))}
                                </td>
                            </tr>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-4 font-semibold">
                                    Formula
                                </th>
                                <td className="p-4">
                                    {formula?.formula
                                        ? formula?.formula
                                        : "No formula available"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </section>
    );
};

export default ViewInstrumentPage;
