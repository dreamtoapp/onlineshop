"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "@/components/ui/card";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function WebVitalsChart({ vitals }: { vitals: any[] }) {
  const metrics = ["LCP", "CLS", "INP", "FID", "TTFB"];
  const datasets = metrics.map((name, i) => {
    const data = vitals.filter((v) => v.name === name);
    return {
      label: name,
      data: data.map((v) => v.value),
      borderColor: ["#2563eb", "#f59e42", "#10b981", "#e11d48", "#6366f1"][i],
      backgroundColor: "rgba(0,0,0,0.05)",
      tension: 0.3,
      fill: false,
    };
  });
  const labels = Array.from({ length: Math.max(...datasets.map((d) => d.data.length)) }, (_, i) => i + 1);
  return (
    <Card className="p-4">
      <Line
        data={{
          labels,
          datasets: datasets.filter((d) => d.data.length),
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
            tooltip: { enabled: true },
          },
          scales: {
            y: { beginAtZero: true },
          },
        }}
      />
    </Card>
  );
}
