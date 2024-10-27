import { useState, useEffect } from "react";
import { BarChart, Card } from "@tremor/react";
import excelFormula from "excel-formula";
import Groq from "groq-sdk";
import parse from "html-react-parser";

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

const processFormulas = (records) => {
    const replacePlaceholders = (formula, data) => {
        const subIdValueMap = {};
        data.forEach((item) => {
            subIdValueMap[item.sub_id] = item.value;
        });

        return formula.replace(/([A-Z]\d+)/g, (match) => {
            return subIdValueMap[match] || 0;
        });
    };

    const updatedRecords = records.map((sdgRecord) => {
        if (sdgRecord.data.length === 0) {
            return sdgRecord;
        }

        const uniqueSectionIds = new Set();
        const updatedFormulas = [];
        let total_score = 0;

        sdgRecord.formulas.forEach((formulaItem) => {
            if (!uniqueSectionIds.has(formulaItem.section_id)) {
                const updatedFormula = replacePlaceholders(
                    formulaItem.formula,
                    sdgRecord.data
                );
                let score = eval(excelFormula.toJavaScript(updatedFormula));
                total_score += score;
                updatedFormulas.push({
                    ...formulaItem,
                    processed: updatedFormula,
                    score: score,
                });
                uniqueSectionIds.add(formulaItem.section_id);
            }
        });

        return {
            ...sdgRecord,
            formulas: updatedFormulas,
            total_score: total_score,
        };
    });

    return updatedRecords;
};

const Recommender = ({ selectedYear }) => {
    const [recommendations, setRecommendations] = useState(""); // Storing recommendations
    const [scores, setScores] = useState([]); // Storing campus scores
    const [selectedCampus, setSelectedCampus] = useState(null); // Campus selection
    const [campuses, setCampuses] = useState([]); // List of campuses
    const [sdgs] = useState([
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
    const [loading, setLoading] = useState(true);
    const [selectedSdG, setSelectedSdg] = useState("SDG01");
    const fetchRecommendations = async (score, sdg_id) => {
        if (score) {
            // Collect SDGs with total scores below 100
            const sdgsWithLowScores = score.records.filter(
                (record) => record.total_score < 100 && record.sdg_id === sdg_id
            );

            // Array to store recommendations
            const recommendationsArray = [];

            // Loop through each SDG and fetch recommendations
            for (const record of sdgsWithLowScores) {
                const prompt = `For campus: ${
                    score.campus_name
                }, analyze the following SDG: ${
                    record.sdg_no
                }. The total score is ${
                    record.total_score
                }. Here are the relevant sections: ${record.section_content.join(
                    ", "
                )}. Provide detailed short analysis and 3 recommendations for improvement in paragraph and return in html as ordered list and add break line in every close of li tag.`;
                try {
                    const chatCompletion = await groq.chat.completions.create({
                        messages: [{ role: "user", content: prompt }],
                        model: "llama3-8b-8192",
                        temperature: 1,
                        max_tokens: 500,
                    });

                    // Accessing the response directly
                    const responseContent =
                        chatCompletion.choices[0]?.message?.content || "";

                    // Remove all asterisks from responseContent
                    const cleanResponseContent = responseContent.replace(
                        /\*/g,
                        ""
                    );

                    console.log(cleanResponseContent);

                    recommendationsArray.push({
                        sdg_no: record.sdg_no,
                        recommendations: cleanResponseContent,
                    });
                } catch (error) {
                    console.error(
                        `Error fetching recommendations for SDG ${record.sdg_no}:`,
                        error
                    );
                }
            }

            return recommendationsArray; // Return the array of recommendations
        }
        return null; // Return null if no score is provided
    };

    useEffect(() => {
        if (scores) {
            const getRecommendations = async () => {
                const result = await fetchRecommendations(scores, selectedSdG); // Await the promise
                setRecommendations(result); // Set the resolved result to state
            };
            getRecommendations(); // Call the async function
        }
    }, [scores, selectedSdG]);

    useEffect(() => {
        const fetchRecordsAndFormulas = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9000/api/get/records-values-by-campus_id/${selectedCampus}/${selectedYear}`
                );
                const recordsData = await response.json();

                const uniqueSectionIds = [
                    ...new Set(recordsData.map((item) => item.section_id)),
                ];

                const section_content = [
                    ...new Set(recordsData.map((item) => item.section_content)),
                ];

                const getUniqueSectionContents = (data) => {
                    const uniqueSections = new Set();
                    data.forEach((item) => {
                        uniqueSections.add(item.section_content);
                    });
                    return Array.from(uniqueSections);
                };
                const uniqueSectionContents =
                    getUniqueSectionContents(recordsData);

                const formulas = {};
                for (const sectionId of uniqueSectionIds) {
                    const formulaResponse = await fetch(
                        `http://localhost:9000/api/get/formula/${sectionId}`
                    );
                    const formulaData = await formulaResponse.json();
                    if (formulaData.length > 0) {
                        formulas[sectionId] = formulaData[0].formula;
                    }
                }

                const groupedRecords = recordsData.reduce((acc, item) => {
                    if (!acc[item.sdg_id]) {
                        acc[item.sdg_id] = { data: [], formulas: [] };
                    }
                    acc[item.sdg_id].data.push(item);
                    acc[item.sdg_id].formulas.push({
                        section_id: item.section_id,
                        formula: formulas[item.section_id] || "",
                    });
                    return acc;
                }, {});

                const finalRecords = sdgs.map((sdg) => {
                    if (groupedRecords[sdg.sdg_id]) {
                        return {
                            section_content: uniqueSectionContents,
                            sdg_id: sdg.sdg_id,
                            sdg_no: sdg.no,
                            data: groupedRecords[sdg.sdg_id].data,
                            formulas: groupedRecords[sdg.sdg_id].formulas,
                            total_score: 0,
                        };
                    } else {
                        return {
                            section_content: [],
                            sdg_id: sdg.sdg_id,
                            sdg_no: sdg.no,
                            data: [],
                            formulas: [],
                            total_score: 0,
                        };
                    }
                });

                setScores({
                    campus: selectedCampus,
                    campus_name: campuses.find(
                        (campus) => campus.campus_id === selectedCampus
                    ).name,
                    records: processFormulas(finalRecords),
                });
            } catch (error) {
                console.error("Error fetching records and formulas:", error);
            }
        };

        if (selectedCampus) {
            fetchRecordsAndFormulas();
        }
    }, [selectedCampus, selectedYear]);

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                let url;
                localStorage.getItem("role").toString() === "1"
                    ? (url = `http://localhost:9000/api/get/campus-by-user-id/${localStorage.getItem(
                          "user_id"
                      )}`)
                    : (url = "http://localhost:9000/api/get/campuses");

                const response = await fetch(url);
                const data = await response.json();
                setCampuses(data);
                setSelectedCampus(data[0].campus_id); // Set the first campus by default
            } catch (error) {
                console.error("Error fetching campuses:", error);
            }
        };

        fetchCampuses();
    }, []);

    const handleSelectCampus = (event) => {
        setSelectedCampus(event.target.value);
    };
    const handleSelectSDG = (event) => {
        setSelectedSdg(event.target.value);
    };

    return (
        <Card className="w-[100%]">
            <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Prescriptive Analysis
            </h3>
            <div className="mt-4 gap-2">
                {localStorage.getItem("role").toString() === "0" && (
                    <select
                        value={selectedCampus || ""}
                        onChange={handleSelectCampus}
                        className="p-2 border border-gray-300 rounded"
                    >
                        {campuses.map((campus) => (
                            <option
                                key={campus.campus_id}
                                value={campus.campus_id}
                            >
                                {campus.name
                                    .replace("BatStateU - ", "")
                                    .replace("Campus", "")
                                    .replace("Pablo Borbon", "Main")}
                            </option>
                        ))}
                    </select>
                )}
                <select
                    value={selectedSdG || ""}
                    onChange={handleSelectSDG}
                    className="p-2 border border-gray-300 rounded"
                >
                    {sdgs.map((sdg) => (
                        <option key={sdg.sdg_id} value={sdg.sdg_id}>
                            {(sdg.no, ": ", sdg.title)}
                        </option>
                    ))}
                </select>
            </div>

            <h2>Recommendations</h2>
            {recommendations && recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                    <div key={index}>
                        <h3>SDG {rec.sdg_no} Recommendations:</h3>
                        {parse(rec.recommendations)}
                    </div>
                ))
            ) : (
                <div className="text-justify">
                    No recommendations available.
                </div>
            )}
        </Card>
    );
};

export default Recommender;
