import Chart from "chart.js/auto";
import React, { useRef, useEffect } from "react";

export default function StatisticsPieChart({ planData }) {
  const canvas = useRef();

  useEffect(() => {
    const ctx = canvas.current;

    let chartStatus = Chart.getChart("myChart");
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }

    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Lite Plan", "Pro Plan", "Ultimate Plan"],
        datasets: [
          {
            label: "",
            data: planData,
            backgroundColor: [
              "rgba(255, 183, 197, 0.7)", // Soft Pink (Lite Plan)
              "rgba(153, 204, 255, 0.7)", // Soft Blue (Pro Plan)
              "rgba(255, 219, 141, 0.7)", // Soft Gold (Ultimate Plan)
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)", // Deep Red
              "rgba(54, 162, 235, 1)", // Bright Blue
              "rgba(255, 159, 64, 1)", // Vibrant Orange
            ],
            borderWidth: 2,
            // backgroundColor: [
            //   "rgba(255, 159, 182, 0.6)", // Lighter Red
            //   "rgba(124, 200, 255, 0.6)", // Lighter Blue
            //   "rgba(255, 229, 153, 0.6)", // Lighter Yellow
            // ],
            // borderColor: [
            //   "rgba(255, 99, 132, 1)", // Original Red
            //   "rgba(54, 162, 235, 1)", // Original Blue
            //   "rgba(255, 206, 86, 1)", // Original Yellow
            // ],
            // borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#2e008b", // Custom legend text color
              font: {
                size: 14, // Legend font size
                weight: "bold",
                family: "Nunito", // Font family
              },
            },
          },
          title: {
            display: true,
            text: "Number of Active Plans by Appraisers",
            color: "#2e008b", // Title color
            font: {
              size: 16,
              weight: "bold",
              family: "Nunito",
            },
          },
          tooltip: {
            backgroundColor: "#97d700", // Dark background for tooltip
            titleFont: {
              size: 18,
              weight: "bold",
              family: "Nunito",
            },
            bodyFont: { size: 15, family: "Nunito" },
            bodyColor: "#2e008b", // White text
            padding: 10,
            borderWidth: 2,
            borderColor: "#2e008b", // Green border
            cornerRadius: 8, // Rounded corners
            displayColors: false, // Hide color box
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw;
                const total = planData.reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(2);
                return `Counts : ${value} (${percentage}%)`; // Show value & percentage
              },
            },
          },
        },
      },
    });
  }, [planData]);

  return (
    <div className="container">
      <canvas id="myChart" ref={canvas}></canvas>
    </div>
  );
}
