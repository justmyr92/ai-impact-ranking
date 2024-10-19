import { useEffect, useState } from "react";
import Groq from "groq-sdk";
import Sidebar from "../../components/Sidebar";
import ScorePerCampusChart from "../../components/ScorePerCampusChart";
import BatStateUSDGScoreChart from "../../components/BatStateUSDGScoreChart";
import CampusScoreperSDGChart from "../../components/CampusScoreperSDGChart";
import CampusSDGScoreChart from "../../components/CampusSDGScorePage";
import Recommender from "../../components/Recommender";
import FileChart from "../../components/FileChart";

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

const DashboardPage = () => {
    const [topCampus, setTopCampus] = useState([]);
    const [sdOfficers, setSdOfficers] = useState([]);
    const [sdgs, setSdgs] = useState([
        { sdg_id: "SDG01", title: "No Poverty" },
        { sdg_id: "SDG02", title: "Zero Hunger" },
        // Add other SDGs here
    ]);
    const [selectedSdgId, setSelectedSdgId] = useState("SDG01");
    const [campusScores, setCampusScores] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [lowestScoreCampuses, setLowestScoreCampuses] = useState([]);
    const [recommendations, setRecommendations] = useState("");

    // Step 1: Add state for selected year
    const [selectedYear, setSelectedYear] = useState("2024");

    // Step 2: Create an array for years
    const years = ["2024", "2023", "2022", "2021"];

    useEffect(() => {
        const getSDOfficers = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9000/api/get/sd-office"
                );
                const jsonData = await response.json();
                setSdOfficers(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        };
        getSDOfficers();
    }, []);

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto p-4">
                <div className="header py-2 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">Impact Ranking</h1>

                    {/* Step 3: Add a year selection dropdown */}
                    <select
                        name="year-selector"
                        id="year-selector"
                        className="border p-2 rounded"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {years.map((year, index) => (
                            <option
                                key={year}
                                value={year}
                                // Add a default selected year if needed
                                selected={index === 0}
                            >
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <hr className="w-full border my-4" />
                <div className="flex gap-4 mb-4">
                    <ScorePerCampusChart
                        setScores={setCampusScores}
                        setTopCampus={setTopCampus}
                        selectedYear={selectedYear}
                    />
                    <BatStateUSDGScoreChart />
                </div>
                <div className="flex gap-4 mb-2">
                    <CampusScoreperSDGChart selectedYear={selectedYear} />
                    <CampusSDGScoreChart
                        topCampus={topCampus}
                        selectedYear={selectedYear}
                    />
                </div>
                <Recommender selectedYear={selectedYear} />

                <div className="flex gap-4 mb-2">
                    <FileChart />
                </div>
                {/* <div className="p-4">
                    {lowestScoreCampuses.length > 0 && (
                        <div className="p-4">
                            {lowestScoreCampuses.length > 0 && (
                                <div>
                                    <h2 className="text-lg">
                                        Campuses with Lowest Score:
                                    </h2>
                                    <ul>
                                        {lowestScoreCampuses.map((campus) => (
                                            <li key={campus.name}>
                                                {campus.name} - Score:{" "}
                                                {campus.score}
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="text-lg mt-4">
                                        Recommendations:
                                    </h3>
                                    <div className="bg-gray-100 p-4 rounded h-fit w-[100%]">
                                        <pre>{recommendations}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div> */}
            </main>
        </section>
    );
};

export default DashboardPage;
