"use client";

import { Card, DonutChart } from "@tremor/react";
import React, { useEffect, useState } from "react";

const FileChart = () => {
    const [data, setData] = useState([
        { name: "Not Approved", count: 0 }, // status 1
        { name: "For Revision", count: 0 }, // status 2
        { name: "Approved", count: 0 }, // status 3
    ]);

    // Fetch records count data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:9000/api/get-records-count-by-status"
                );
                const result = await response.json(); // Correctly parse the JSON response
                console.log(result, "asdasd");
                // Update state based on the fetched counts
                const updatedData = data.map((item) => {
                    const record = result.find(
                        (r) =>
                            r.status ===
                            (item.name === "Not Approved"
                                ? 1
                                : item.name === "For Revision"
                                ? 2
                                : 3)
                    );
                    return {
                        ...item,
                        count: record ? record.count : 0,
                    };
                });

                setData(updatedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Prepare data for the DonutChart
    const chartData = data.map((item) => ({
        name: item.name,
        value: item.count,
    }));

    useEffect(() => {
        console.log(data, "ff");
    }, []);
    return (
        <Card className="w-[30%]">
            <div className="w-full">
                <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                    Record Status Count
                </p>
                <DonutChart
                    data={chartData}
                    category="value"
                    index="status"
                    colors={["red", "yellow", "green"]} // You can customize colors here
                    className="mt-6 h-60"
                />
            </div>
        </Card>
    );
};

export default FileChart;
