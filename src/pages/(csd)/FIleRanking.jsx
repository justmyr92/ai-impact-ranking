import React from "react";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import QuestionGrid from "../../components/QuestionGrid";
import BarChartHero from "../../components/BarChartHero";
import { useNavigate } from "react-router-dom";

const FileRanking = () => {
    const [sdgData, setSdgData] = useState([]);
    const [fileCount, setFileCount] = useState([]);
    const [selectedSDG, setSelectedSDG] = useState(""); // Track selected SDG
    const [records, setRecords] = useState([]);
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
        const getSdgData = async () => {
            try {
                const sdgResponse = await fetch(
                    "http://localhost:9000/api/get/records-count-per-sdg"
                );
                const sdgList = await sdgResponse.json();
                console.log(sdgList);
                setSdgData(sdgList);
            } catch (error) {
                console.error(error);
            }
        };

        const getFileCount = async () => {
            try {
                const fileCountResponse = await fetch(
                    "http://localhost:9000/api/get/records-count-by-status"
                );
                const fileCountData = await fileCountResponse.json();
                setFileCount(fileCountData);
            } catch (error) {
                console.error(error);
            }
        };

        getSdgData();
        getFileCount();
    }, []);

    useEffect(() => {
        const getQuestionsValues = async () => {
            if (selectedSDG) {
                try {
                    const setRecordsResponse = await fetch(
                        `http://localhost:9000/api/get/records-pero-question/${selectedSDG}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const setRecordsData = await setRecordsResponse.json();
                    setRecords(setRecordsData);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        getQuestionsValues();
    }, [selectedSDG]);

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto px-4">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">Record Tracks</h1>
                </div>
                <hr />
                <div className="py-5 px-7">
                    <div className="flex gap-2">
                        <BarChartHero
                            data={sdgData}
                            indexTitle={"sdg_id"}
                            categoryTitle={"count"}
                        />
                        <BarChartHero
                            data={fileCount}
                            indexTitle={"name"}
                            categoryTitle={"amount"}
                        />
                    </div>

                    <hr className="my-4" />
                    <div className="flex justify-end items-center p-4 mb-3">
                        <div className="w-64">
                            <label
                                htmlFor="sdg-select"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Select SDG Goal:
                            </label>
                            <select
                                id="sdg-select"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                onChange={(e) => setSelectedSDG(e.target.value)} // Update selected SDG on change
                            >
                                <option value="" disabled selected>
                                    Select an SDG
                                </option>{" "}
                                {/* Optional placeholder */}
                                {sdgs.map((sdg) => (
                                    <option
                                        key={sdg.sdg_id}
                                        value={sdg.sdg_id}
                                        style={{ color: sdg.color }}
                                    >
                                        {sdg.no}. {sdg.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <QuestionGrid records={records} />
                </div>
            </main>
        </section>
    );
};

export default FileRanking;
