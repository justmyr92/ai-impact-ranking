import { useState, useEffect } from "react";
import { BarChart, Card } from "@tremor/react";
import excelFormula from "excel-formula";

const processFormulas = (records) => {
    // Helper function to replace all placeholders in the formula

    const replacePlaceholders = (formula, data) => {
        // Match any placeholders like A1, B1, C1, etc.
        // return formula.replace(/([A-Z]\d+)/g, (match) => {
        //     // Find the corresponding record by sub_id
        //     const record = data.find((item) => item.sub_id === match);
        //     // Replace with the record value if found, otherwise keep the placeholder
        //     return record ? record.value : 0;
        // });

        const subIdValueMap = {};
        console.log(data, "Asd");
        data.forEach((item) => {
            subIdValueMap[item.sub_id] = item.value;
        });

        return formula.replace(/([A-Z]\d+)/g, (match) => {
            return subIdValueMap[match] || 0;
        });
    };

    // Iterate through each SDG record
    const updatedRecords = records.map((sdgRecord) => {
        // If no data, skip the processing
        if (sdgRecord.data.length === 0) {
            return sdgRecord;
        }
        const uniqueSectionIds = new Set();
        const updatedFormulas = [];

        let total_score = 0;
        // Process each formula by replacing placeholders with corresponding values
        sdgRecord.formulas.forEach((formulaItem) => {
            if (!uniqueSectionIds.has(formulaItem.section_id)) {
                // Replace placeholders in the formula
                const updatedFormula = replacePlaceholders(
                    formulaItem.formula,
                    sdgRecord.data
                );
                // Add the updated formula to the list and mark section_id as seen
                let score = eval(excelFormula.toJavaScript(updatedFormula));
                total_score = total_score + score;
                updatedFormulas.push({
                    ...formulaItem,
                    processed: updatedFormula,
                    score: score,
                });
                uniqueSectionIds.add(formulaItem.section_id); // Mark section_id as seen
            }
        });

        // Return the SDG record with updated formulas
        return {
            ...sdgRecord,
            formulas: updatedFormulas, // Update formulas in the SDG record
            total_score: total_score,
        };
    });

    return updatedRecords; // Return the fully processed SDG records
};

const CampusScoreperSDGChart = ({ selectedYear }) => {
    const [scores, setScores] = useState([]);

    const [selectedCampus, setSelectedCampus] = useState(null);
    // const [selectedSDG]

    const [campuses, setCampuses] = useState([]);
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
        setScores([]);
        const fetchRecordsAndFormulas = async () => {
            try {
                // Fetch the records for the selected campus
                const response = await fetch(
                    `http://localhost:9000/api/get/records-values-by-campus_id/${selectedCampus}/${selectedYear}`
                );
                const recordsData = await response.json();

                // Check if data exists
                // Extract unique section_ids from records
                const uniqueSectionIds = [
                    ...new Set(recordsData.map((item) => item.section_id)),
                ];

                // Initialize the final structure
                const result = {
                    campus: selectedCampus,
                    records: [],
                };

                // Fetch formulas for each unique section_id
                const formulas = {};
                for (const sectionId of uniqueSectionIds) {
                    const formulaResponse = await fetch(
                        `http://localhost:9000/api/get/formula/${sectionId}`
                    );
                    const formulaData = await formulaResponse.json();
                    if (formulaData.length > 0) {
                        formulas[sectionId] = formulaData[0].formula; // Adjust based on your table structure
                    }
                }

                // Group records by sdg_id
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

                // Fill up all SDGs, even if there's no data for some
                const finalRecords = sdgs.map((sdg) => {
                    if (groupedRecords[sdg.sdg_id]) {
                        return {
                            sdg_id: sdg.sdg_id,
                            sdg_no: sdg.no,

                            data: groupedRecords[sdg.sdg_id].data,
                            formulas: groupedRecords[sdg.sdg_id].formulas,
                            total_score: 0,
                        };
                    } else {
                        // If no records for this SDG, return empty arrays
                        return {
                            sdg_id: sdg.sdg_id,
                            sdg_no: sdg.no,
                            data: [],
                            formulas: [],
                            total_score: 0,
                        };
                    }
                });

                // Add the filled records to the result
                result.records = processFormulas(finalRecords);

                // Final structured result
                console.log(result);
                setScores(result);
            } catch (error) {
                console.error("Error fetching records and formulas:", error);
            }
        };

        fetchRecordsAndFormulas();
    }, [selectedCampus]);

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9000/api/get/campuses"
                );
                const data = await response.json();
                setCampuses(data);
                setSelectedCampus(data[0].campus_id);
            } catch (error) {
                console.error("Error fetching campuses:", error);
            }
        };

        fetchCampuses();
    }, []);

    const handleSelectCampus = (campus) => {
        setSelectedCampus(campus.campus_id);
        console.log();
    };

    useEffect(() => {
        console.log("Selected Campus:", scores);
    }, [scores]);

    return (
        <Card className="w-[70%]">
            <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Score per Campus
            </h3>
            <div className="grid grid-cols-5 gap-2 mt-4">
                {campuses.map((campus, index) => (
                    <div
                        key={index}
                        className={`${
                            selectedCampus &&
                            selectedCampus === campus.campus_id
                                ? "bg-blue-500 text-white"
                                : "bg-tremor-subtle text-tremor-content"
                        } rounded p-2 text-center cursor-pointer text-sm`}
                        onClick={() => handleSelectCampus(campus)}
                    >
                        {campus.name
                            .replace("BatStateU - ", "")
                            .replace("Campus", "")
                            .replace("Pablo Borbon", "Main")}
                    </div>
                ))}
            </div>
            {selectedCampus && (
                <BarChart
                    data={
                        scores && Array.isArray(scores.records)
                            ? scores.records.map((score) => ({
                                  name: score.sdg_no, // Using sdg_no directly
                                  score: score.total_score,
                              }))
                            : [] // Fallback to an empty array if scores.records is not an array
                    }
                    index="name"
                    categories={["score"]}
                    colors={["red"]}
                    yAxisWidth={50}
                    className="mt-6 h-60"
                />
            )}
        </Card>
    );
};

export default CampusScoreperSDGChart;
