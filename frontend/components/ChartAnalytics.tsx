"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  languageUsage: Record<string, number>;
}

export default function ChartAnalytics({ languageUsage }: Props) {
  const labels = Object.keys(languageUsage);
  const values = Object.values(languageUsage);

  const data = {
    labels,
    datasets: [
      {
        label: "Language Usage",
        data: values,
        backgroundColor: [
          "#f97316", // orange
          "#fb923c",
          "#3b82f6", // blue
          "#2563eb",
          "#1e40af",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={data} options={options} />;
}
