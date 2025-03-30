import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,

  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },

    tooltips: {
      position: "nearest",
      mode: "index",
      intersect: false,
      yPadding: 10,
      xPadding: 10,
      caretSize: 8,
      backgroundColor: "rgba(72, 241, 12, 1)",
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 4,
    },
  },
};

const currentMonth = new Date().getMonth(); // Get the current month (0-11)
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const labels = monthNames.slice(0, currentMonth + 1);

export const tempData = {
  labels,
  datasets: [
    {
      label: "Dataset",
      data: labels?.map(() => faker.datatype.number({ min: 100, max: 400 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      fill: false,
    },
  ],
};



export default function StatisticsChart({data}) {

  console.log("chart",data);
  const customData = {
    labels,
    datasets: [
      {
        label: "Dataset",
        data: data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
      },
    ],
  };

  return <Line options={options} data={customData} />;
}
