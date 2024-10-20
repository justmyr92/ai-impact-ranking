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
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">
                        View Instrument Details
                    </h1>
                    <Link
                        to="/csd/instruments"
                        className="bg-blue-600 text-white text-base px-6 py-2"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </Link>
                </div>
                <hr className="mb-6" />
                <div className="bg-white shadow rounded-lg p-6">
                    <table className="w-full table-auto border-collapse">
                        <tbody>
                            <tr>
                                <th
                                    className="bg-red-500 text-white p-4 text-left"
                                    colSpan={2}
                                >
                                    Instrument Information
                                </th>
                            </tr>
                            <tr className="border">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                    SDG Indicator
                                </th>
                                <td className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                    SDG{" "}
                                    {instrument?.number +
                                        ": " +
                                        instrument?.title}
                                </td>
                            </tr>
                            <tr className="border bg-red-100">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                    SDG Subtitle
                                </th>
                                <td className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                    {instrument?.sdg_subtitle}
                                </td>
                            </tr>
                            <tr className="border">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                    SDG Section
                                </th>
                                <td className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                    {instrument?.section_content}
                                </td>
                            </tr>
                            <tr className="border bg-red-100">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                    Questions
                                </th>
                                <td className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                    Formula
                                </th>
                                <td className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
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
