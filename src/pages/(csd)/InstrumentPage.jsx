import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSquarePlus,
    faEdit,
    faEye,
} from "@fortawesome/free-regular-svg-icons";
import { getInstruments } from "../../services/service"; // Import your service for fetching instruments
import { Link } from "react-router-dom";

const InstrumentsPage = () => {
    const [instruments, setInstruments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const userRole = localStorage.getItem("role"); // Get the user role from local storage

    useEffect(() => {
        const runValidation = async () => {
            try {
                const isVerified = await validateToken();
                if (!isVerified || userRole.toString() !== "0") {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error during token validation:", error);
                return {
                    error: "An error occurred during token validation.",
                };
            }
        };

        const getInstrumentsData = async () => {
            try {
                const data = await getInstruments(); // Fetch the instruments data
                setInstruments(data);
            } catch (error) {
                console.error("Error fetching instruments:", error);
            }
        };
        runValidation();
        getInstrumentsData();
    }, [userRole]); // Add userRole to the dependency array

    const filteredInstruments = instruments.filter(
        (instrument) =>
            instrument.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            instrument.section_content
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            instrument.number
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">Instruments</h1>
                    {userRole.toString() === "0" && ( // Check if the user role is '0'
                        <Link
                            to="/csd/add-instrument"
                            className="bg-blue-600 text-white text-base px-6 py-2"
                        >
                            <FontAwesomeIcon icon={faSquarePlus} /> Add New
                            Instrument
                        </Link>
                    )}
                </div>
                <hr />
                <div className="py-5 px-7">
                    <div className="flex flex-wrap mb-4">
                        <input
                            className="form__input border block w-[16rem] px-6 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none"
                            type="search"
                            placeholder="Search Instruments"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                        />
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SDG Subtitle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Section Content
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInstruments.length > 0 ? (
                                filteredInstruments.map((row, index) => (
                                    <tr key={row.section_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {row.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {row.sdg_subtitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {row.section_content}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {userRole.toString() === "1" ? ( // Check if the user role is '1'
                                                <Link
                                                    to={`/csd/view-instrument/${row.instrument_id}`}
                                                    className="text-blue-600 hover:text-blue-900 ml-3"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                </Link>
                                            ) : (
                                                <>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 ml-3"
                                                        onClick={() =>
                                                            console.log(
                                                                `Edit ${row.section_id}`
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEdit}
                                                        />
                                                    </button>
                                                    <Link
                                                        to={`/csd/view-instrument/${row.instrument_id}`}
                                                        className="text-blue-600 hover:text-blue-900 ml-3"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEye}
                                                        />
                                                    </Link>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-4 whitespace-nowrap text-center"
                                    >
                                        No Data Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </section>
    );
};

export default InstrumentsPage;
