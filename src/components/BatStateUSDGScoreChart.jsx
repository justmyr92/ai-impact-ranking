import { useState, useEffect } from "react";
import { Card, DonutChart } from "@tremor/react";

const BatStateUSDGScoreChart = () => {
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
        const getCampuses = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9000/api/get/campuses"
                );
                const jsonData = await response.json();
                console.log(jsonData.length);
                jsonData.forEach((campus) => {
                    campus.score = Math.random() * 100;
                });
                setCampuses(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        };
        getCampuses();
    }, []);

    // Calculate average score
    const averageScore =
        campuses.reduce((acc, campus) => acc + campus.score, 0) /
        campuses.length;

    return (
        <Card className="w-[30%]">
            <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                BatStateU SDG Score
            </h3>

            <DonutChart
                data={[
                    {
                        campus_id: "average",
                        score: averageScore,
                    },
                    ...campuses,
                ]}
                index="campus_id"
                category="score"
                colors={[
                    "red",
                    "green",
                    "blue",
                    "yellow",
                    "purple",
                    "orange",
                    "pink",
                    "cyan",
                    "magenta",
                    "indigo",
                ]}
                valueFormatter={(value) => `${value.toFixed(2)}%`}
                showTooltip={false}
                className="mt-6 h-60"
            />
        </Card>
    );
};

export default BatStateUSDGScoreChart;
