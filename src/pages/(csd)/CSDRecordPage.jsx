import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import RecordSubmissionForm from "../../components/RecordSubmissionForm";
import UpdateRecordStatus from "../../components/UpdateRecordStatus";
import ViewRecords from "../../components/ViewRecords";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CSDRecordPage = () => {
    const [selectedYear, setSelectedYear] = useState("2023");
    const [selectedSdg, setSelectedSdg] = useState("SDG01");
    const [selectedSdOffice, setSelectedSdOffice] = useState(""); // State for selected SD Office
    const [record, setRecord] = useState(null);
    const [error, setError] = useState("");
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
    const [sdOffices, setSdOffices] = useState([]); // State for SD Offices

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const role = localStorage.getItem("role");

        if (userId && role === "0") {
            navigate("/csd/impact-ranking");
        } else if (userId && role === "1") {
            navigate("/sd/impact-ranking");
        }
    }, [navigate]);

    useEffect(() => {
        // Function to fetch the SD Offices from the backend
        const fetchSdOffices = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9000/api/get/sd-office"
                );
                if (response.ok) {
                    const data = await response.json();
                    setSdOffices(data); // Assuming data is an array of SD Offices
                } else {
                    console.error("Failed to fetch SD Offices");
                }
            } catch (error) {
                console.error("Error fetching SD Offices:", error);
            }
        };

        fetchSdOffices(); // Fetch SD Offices when the component mounts
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        const fetchRecord = async () => {
            if (selectedYear && selectedSdg && selectedSdOffice) {
                // Include SD Office in the check
                try {
                    const response = await fetch(
                        `http://localhost:9000/api/get/recordbysdoffice/${selectedYear}/${selectedSdg}/${selectedSdOffice}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setRecord(data);
                        setError("");
                    } else {
                        setRecord(null);
                        setError(
                            "No record found for the selected year, SDG, and SD Office."
                        );
                    }
                } catch (error) {
                    console.error("Error fetching record:", error);
                    setError("An error occurred while fetching the record.");
                }
            }
        };

        fetchRecord(); // Call the function to fetch data
    }, [selectedYear, selectedSdg, selectedSdOffice]); // Dependency array includes SD Office

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">
                        <FontAwesomeIcon icon={faList} className="mr-2" />
                        Record
                    </h1>
                </div>
                <hr />
                <div className="py-5 px-7">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Year Selection Dropdown */}
                        <div className="form__group">
                            <label
                                htmlFor="year"
                                className="block text-gray-700 mb-2"
                            >
                                Select Year:
                            </label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                }
                                className="border p-2 w-full"
                            >
                                {["2024", "2023", "2022", "2021"].map(
                                    (year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* SDG Selection Dropdown */}
                        <div className="form__group">
                            <label
                                htmlFor="sdg"
                                className="block text-gray-700 mb-2"
                            >
                                Select SDG:
                            </label>
                            <select
                                id="sdg"
                                value={selectedSdg}
                                onChange={(e) => setSelectedSdg(e.target.value)}
                                className="border p-2 w-full"
                            >
                                <option value="" disabled>
                                    Select an SDG
                                </option>
                                {sdgs.map((sdg) => (
                                    <option key={sdg.sdg_id} value={sdg.sdg_id}>
                                        {sdg.no}. {sdg.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* SD Office Selection Dropdown */}
                        <div className="form__group">
                            <label
                                htmlFor="sdOffice"
                                className="block text-gray-700 mb-2"
                            >
                                Select SD Office:
                            </label>
                            <select
                                id="sdOffice"
                                value={selectedSdOffice}
                                onChange={(e) =>
                                    setSelectedSdOffice(e.target.value)
                                }
                                className="border p-2 w-full"
                            >
                                <option value="" disabled>
                                    Select an SD Office
                                </option>
                                {sdOffices.map((office) => (
                                    <option
                                        key={office.user_id}
                                        value={office.user_id}
                                    >
                                        {office.name}{" "}
                                        {/* Adjust this as per your data structure */}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <hr className="w-full border my-4" />

                    {record ? (
                        <>
                            <UpdateRecordStatus
                                selectedSdg={selectedSdg}
                                selectedYear={selectedYear}
                                recordId={record.record_id}
                                recordStatus={record.status}
                                selectedSD={selectedSdOffice}
                            />
                        </>
                    ) : (
                        <div className="mt-4">
                            {error ? (
                                <div className="mt-4 p-4 border border-blue-500 bg-blue-100 text-blue-700 rounded-md flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 7h2v4H9V7zm0 6h2v2H9v-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-sm">
                                        <strong>Error:</strong> {error}. Please
                                        check the details and try again.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 border border-blue-500 bg-blue-100 text-blue-700 rounded-md flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 7h2v4H9V7zm0 6h2v2H9v-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-sm">
                                        <strong>Notice:</strong> There are no
                                        existing records.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </section>
    );
};

export default CSDRecordPage;
