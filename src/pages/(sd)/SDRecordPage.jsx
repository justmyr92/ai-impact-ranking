import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import RecordSubmissionForm from "../../components/RecordSubmissionForm";
import UpdateRecordForm from "../../components/UpdateRecordForm";

const SDRecordPage = () => {
    const [selectedYear, setSelectedYear] = useState("2023");
    const [selectedSdg, setSelectedSdg] = useState("SDG01");
    const [record, setRecord] = useState(null); // State to store the fetched record
    const [error, setError] = useState(""); // State to handle errors
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

    useEffect(() => {
        // Function to fetch the record from the backend
        const fetchRecord = async () => {
            if (selectedYear && selectedSdg) {
                try {
                    const response = await fetch(
                        `http://localhost:9000/api/get/recordbysdoffice/${selectedYear}/${selectedSdg}/${localStorage.getItem(
                            "user_id"
                        )}
                        `
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setRecord(data); // Update state with fetched record
                        console.log(data);
                        setError(""); // Clear any existing errors
                    } else {
                        setRecord(null); // Clear record if not found
                        setError(
                            "No record found for the selected year and SDG."
                        ); // Set error message
                    }
                } catch (error) {
                    console.error("Error fetching record:", error);
                    setError("An error occurred while fetching the record."); // Set error message
                }
            }
        };

        fetchRecord(); // Call the function to fetch data
    }, [selectedYear, selectedSdg]); // Dependency array to refetch data on year or SDG change

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">Record</h1>
                </div>
                <hr />
                <div className="py-5 px-7">
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <hr className="w-full border my-4" />

                    {record ? (
                        <>
                            <p>asdasdasd</p>
                            <UpdateRecordForm
                                selectedSdg={selectedSdg}
                                selectedYear={selectedYear}
                                recordId={record.record_id}
                            />
                        </>
                    ) : (
                        <>
                            <p>13123</p>
                            <RecordSubmissionForm
                                selectedSdg={selectedSdg}
                                selectedYear={selectedYear}
                            />
                        </>
                    )}
                </div>
            </main>
        </section>
    );
};

export default SDRecordPage;
