import React from "react";
import Sidebar from "../../components/Sidebar";
import { BarChart, Card, DonutChart } from "@tremor/react";
import { useState } from "react";
import { useEffect } from "react";
import QuestionGrid from "../../components/QuestionGrid";

// SDG color mapping
const sdgColors = {
    "SDG 1": "#FF5733",
    "SDG 2": "#33FF57",
    "SDG 3": "#3357FF",
    "SDG 4": "#FF33A8",
    "SDG 5": "#FFC300",
    "SDG 6": "#DAF7A6",
    "SDG 7": "#900C3F",
    "SDG 8": "#FF5733",
    "SDG 9": "#C70039",
    "SDG 10": "#581845",
    "SDG 11": "#2ECC71",
    "SDG 12": "#3498DB",
    "SDG 13": "#9B59B6",
    "SDG 14": "#E74C3C",
    "SDG 15": "#F39C12",
    "SDG 16": "#1ABC9C",
    "SDG 17": "#8E44AD",
};

const sdgData = [
    { sdg: "SDG 1", file_no: 2 },
    { sdg: "SDG 2", file_no: 0 },
    { sdg: "SDG 3", file_no: 0 },
    { sdg: "SDG 4", file_no: 0 },
    { sdg: "SDG 5", file_no: 0 },
    { sdg: "SDG 6", file_no: 0 },
    { sdg: "SDG 7", file_no: 0 },
    { sdg: "SDG 8", file_no: 0 },
    { sdg: "SDG 9", file_no: 0 },
    { sdg: "SDG 10", file_no: 0 },
    { sdg: "SDG 11", file_no: 0 },
    { sdg: "SDG 12", file_no: 0 },
    { sdg: "SDG 13", file_no: 0 },
    { sdg: "SDG 14", file_no: 0 },
    { sdg: "SDG 15", file_no: 0 },
    { sdg: "SDG 16", file_no: 0 },
    { sdg: "SDG 17", file_no: 0 },
];

const data = [
    { name: "Approved", amount: 1 },
    { name: "Not Approved", amount: 1 },
    { name: "For Revision", amount: 0 },
];

// BarChart component with color mapping
export const BarChartHero = () => (
    <Card className="w-[60%]">
        <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Record Frequency
        </h3>
        <BarChart
            className="h-80"
            data={sdgData}
            index="sdg"
            categories={["file_no"]}
            // colors={sdgData.map((item) => sdgColors[item.sdg] || "#808080")}
        />
    </Card>
);

export const BarChartHero2 = () => (
    <Card className="w-[40%]">
        <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Record Frequency
        </h3>
        <BarChart
            className="h-80"
            data={data}
            index="name"
            categories={["amount"]}
            // colors={sdgData.map((item) => sdgColors[item.sdg] || "#808080")}
        />
    </Card>
);

const FileRanking = () => {
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
                        <BarChartHero />
                        {/* <DonutChartHero
                            averageScore={avarage}
                            limitedCampuses={campuses}
                        /> */}
                        <BarChartHero2 />
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
                            >
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
                    <QuestionGrid />
                </div>
            </main>
        </section>
    );
};

export default FileRanking;
