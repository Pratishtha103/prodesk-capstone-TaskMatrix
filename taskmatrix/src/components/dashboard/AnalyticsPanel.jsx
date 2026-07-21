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
        borderColor: [
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
        borderColor: [
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
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-primary/20 bg-primary/1 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            Total Tasks
          </p>
          <p className="mt-2 text-3xl font-bold text-primary">{tasks.length}</p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Completed
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {statusCounts.done}
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50/20 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            In Progress
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-800">
            {statusCounts.inprogress}
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/20 p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md">
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">
            Pending (To Do)
          </p>
          <p className="mt-2 text-3xl font-bold text-red-800">
            {statusCounts.todo}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-secondary bg-white p-5 shadow-sm flex flex-col h-[350px]">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">
            Tasks by Status
          </h4>
          <div className="relative w-full h-[250px]">
            <Doughnut data={statusData} options={chartOptions} />
          </div>
        </div>

        <div className="rounded-xl border border-secondary bg-white p-5 shadow-sm flex flex-col h-[350px]">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">
            Tasks by Priority
          </h4>
          <div className="relative w-full h-[250px]">
            <Bar
              data={priorityData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
