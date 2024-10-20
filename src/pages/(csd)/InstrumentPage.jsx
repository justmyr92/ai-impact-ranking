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
    const [selectedSdg, setSelectedSdg] = useState(""); // State to track selected SDG
    const userRole = localStorage.getItem("role"); // Get the user role from local storage

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
    const [editSelected, setEditSelected] = useState("");

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

    // Filter instruments by search query and selected SDG ID
    const filteredInstruments = instruments.filter((instrument) => {
        const matchesSearchQuery =
            instrument.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            instrument.section_content
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            instrument.number
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesSdg =
            selectedSdg === "" || instrument.sdg_id === selectedSdg;
        return matchesSearchQuery && matchesSdg;
    });

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
                            className="form__input border block w-[16rem] px-6 py-3 rounded-md shadow-sm sm:text-sm focus:outline-none"
                            type="search"
                            placeholder="Search Instruments"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                        />
                        <select
                            className="form__input border block w-[16rem] px-6 py-3 rounded-md shadow-sm sm:text-sm focus:outline-none ml-4"
                            value={selectedSdg}
                            onChange={(e) => setSelectedSdg(e.target.value)}
                        >
                            <option value="">Filter by SDG</option>
                            {sdgs.map((sdg) => (
                                <option key={sdg.sdg_id} value={sdg.sdg_id}>
                                    {sdg.no + ": " + sdg.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-red-500">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    SDG Subtitle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Section Content
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInstruments.length > 0 ? (
                                filteredInstruments.map((row, index) => (
                                    <tr
                                        key={row.section_id}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white hover:bg-red-200"
                                                : "bg-red-100 hover:bg-red-200"
                                        }
                                    >
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                            {row.title}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                            {row.sdg_subtitle}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                            {row.section_content}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                                            {userRole.toString() === "1" ? ( // Check if the user role is '1'
                                                <Link
                                                    to={`/csd/view-instrument/${row.instrument_id}`}
                                                    className="bg-red-500 text-white hover:bg-red-600 p-1.5 mr-2"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        to={`/csd/view-instrument/${row.instrument_id}`}
                                                        className="bg-red-500 text-white hover:bg-red-600 p-1.5 mr-2"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEye}
                                                        />
                                                    </Link>
                                                    <Link
                                                        to={`/csd/edit-instrument/${row.instrument_id}`}
                                                        className="bg-red-500 text-white hover:bg-red-600 p-1.5"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEdit}
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
                                        className="px-6 py-3 whitespace-nowrap text-sm text-black text-center"
                                    >
                                        No instruments found.
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
