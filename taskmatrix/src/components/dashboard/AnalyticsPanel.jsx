"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useTheme } from "@/contexts/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsPanel({ tasks }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Tailwind text-muted (slate-400 for dark, gray-500 for light)
  const textColor = isDark ? "#94a3b8" : "#6b7280";
  // Tailwind border-secondary (slate-700 for dark, gray-200 for light)
  const gridColor = isDark ? "#334155" : "#e5e7eb";

  // Aggregate status counts
  const statusCounts = tasks.reduce(
    (acc, t) => {
      const statusKey = t.status === "inprogress" ? "inprogress" : t.status === "done" ? "done" : "todo";
      acc[statusKey] = (acc[statusKey] || 0) + 1;
      return acc;
    },
    { todo: 0, inprogress: 0, done: 0 }
  );

  // Aggregate priority counts
  const priorityCounts = tasks.reduce(
    (acc, t) => {
      const priorityKey = t.priority === "High" ? "High" : t.priority === "Medium" ? "Medium" : "Low";
      acc[priorityKey] = (acc[priorityKey] || 0) + 1;
      return acc;
    },
    { Low: 0, Medium: 0, High: 0 }
  );

  // Status Chart Data
  const statusData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [statusCounts.todo, statusCounts.inprogress, statusCounts.done],
        backgroundColor: [
          "rgba(244, 63, 94, 0.7)",  // Rose (todo)
          "rgba(245, 158, 11, 0.7)", // Amber (inprogress)
          "rgba(16, 185, 129, 0.7)", // Emerald (done)
        ],
        borderColor: isDark ? [
          "rgba(15, 23, 42, 1)", // Match dark bg
          "rgba(15, 23, 42, 1)",
          "rgba(15, 23, 42, 1)"
        ] : [
          "rgb(244, 63, 94)",
          "rgb(245, 158, 11)",
          "rgb(16, 185, 129)",
        ],
        borderWidth: 1.5,
      },
    ],
  };

  // Priority Chart Data
  const priorityData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Tasks Count",
        data: [priorityCounts.Low, priorityCounts.Medium, priorityCounts.High],
        backgroundColor: [
          "rgba(52, 211, 153, 0.7)",  // Emerald (Low)
          "rgba(251, 191, 36, 0.7)",  // Amber (Medium)
          "rgba(248, 113, 113, 0.7)", // Red (High)
        ],
        borderColor: isDark ? [
          "rgba(52, 211, 153, 0.3)",
          "rgba(251, 191, 36, 0.3)",
          "rgba(248, 113, 113, 0.3)"
        ] : [
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          boxWidth: 12,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-primary/20 dark:border-indigo-900/50 bg-primary/1 dark:bg-indigo-900/10 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
          <p className="text-xs font-semibold text-primary dark:text-indigo-400 uppercase tracking-wider">
            Total Tasks
          </p>
          <p className="mt-2 text-3xl font-bold text-primary dark:text-indigo-300">{tasks.length}</p>
        </div>

        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-900/10 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Completed
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-800 dark:text-emerald-300">
            {statusCounts.done}
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-900/10 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            In Progress
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-800 dark:text-amber-300">
            {statusCounts.inprogress}
          </p>
        </div>

        <div className="rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50/20 dark:bg-red-900/10 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
          <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">
            Pending (To Do)
          </p>
          <p className="mt-2 text-3xl font-bold text-red-800 dark:text-red-300">
            {statusCounts.todo}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-secondary bg-surface p-5 shadow-sm flex flex-col h-[350px]">
          <h4 className="text-sm font-semibold text-text-main mb-4">
            Tasks by Status
          </h4>
          <div className="relative w-full h-[250px]">
            <Doughnut data={statusData} options={chartOptions} />
          </div>
        </div>

        <div className="rounded-xl border border-secondary bg-surface p-5 shadow-sm flex flex-col h-[350px]">
          <h4 className="text-sm font-semibold text-text-main mb-4">
            Tasks by Priority
          </h4>
          <div className="relative w-full h-[250px]">
            <Bar data={priorityData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
