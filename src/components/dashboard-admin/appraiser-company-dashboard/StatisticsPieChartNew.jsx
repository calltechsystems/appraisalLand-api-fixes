import Chart from "chart.js/auto";
import React, { useRef, useEffect } from "react";

export default function StatisticsPieChartNew({ planData }) {
  const canvas = useRef();

  useEffect(() => {
    const ctx = canvas.current;

    let chartStatus = Chart.getChart("myChart");
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }

    new Chart(ctx, {
      type: "doughnut", // Changed to Doughnut for a modern look
      data: {
        labels: ["Lite Plan", "Pro Plan", "Ultimate Plan"],
        datasets: [
          {
            label: "Number of Appraisers",
            data: planData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 206, 86, 0.7)",
            ],
            borderColor: ["#ff6384", "#36a2eb", "#ffce56"],
            borderWidth: 2,
            hoverOffset: 10, // Adds a popping effect when hovered
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allows better responsiveness
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 14,
                weight: "bold",
              },
              color: "#333",
            },
          },
          title: {
            display: true,
            text: "Active Plans by Appraisers",
            font: {
              size: 18,
              weight: "bold",
            },
            color: "#222",
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
        animation: {
          animateScale: true, // Smooth scaling animation
          animateRotate: true, // Smooth rotation effect
        },
      },
    });
  }, [planData]);

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas id="myChart" ref={canvas}></canvas>
    </div>
  );
}
