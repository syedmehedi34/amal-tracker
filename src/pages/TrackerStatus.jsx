import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { amalQuestions } from "../data/amalQuestions";
import { useAuth } from "../context/AuthContext";
import { HiExclamationCircle, HiChartBar, HiFire } from "react-icons/hi";
import { HiTrophy } from "react-icons/hi2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TrackerStatus() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedStatsRange, setSelectedStatsRange] = useState("month");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bestDay: { date: null, points: 0 },
    worstDay: { date: null, points: 100 },
    averagePoints: 0,
    streak: 0,
  });
  const [dailyDetails, setDailyDetails] = useState(null);
  const { user } = useAuth();

  const totalPossiblePoints = amalQuestions.reduce(
    (total, q) => total + q.points,
    0
  );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const calculateStats = (data, range) => {
      let bestDay = { date: null, points: 0 };
      let worstDay = { date: null, points: totalPossiblePoints };
      let totalPoints = 0;
      let currentStreak = 0;
      let previousDate = null;

      const today = new Date();
      let startDate;
      switch (range) {
        case "week":
          startDate = startOfWeek(today);
          break;
        case "month":
          startDate = startOfMonth(today);
          break;
        case "year":
          startDate = startOfYear(today);
          break;
        default:
          startDate = subDays(today, 365);
      }

      const filteredData = data.filter((item) =>
        isWithinInterval(parseISO(item.date), { start: startDate, end: today })
      );

      filteredData.forEach(({ date, points }) => {
        if (points > bestDay.points) {
          bestDay = { date, points };
        }
        if (points < worstDay.points && points > 0) {
          worstDay = { date, points };
        }

        const percentage = (points / totalPossiblePoints) * 100;
        if (percentage >= 95) {
          if (
            !previousDate ||
            (new Date(date) - new Date(previousDate)) /
              (1000 * 60 * 60 * 24) ===
              1
          ) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
          previousDate = date;
        } else {
          currentStreak = 0;
          previousDate = null;
        }

        totalPoints += points;
      });

      return {
        bestDay,
        worstDay,
        averagePoints: filteredData.length
          ? Math.round(totalPoints / filteredData.length)
          : 0,
        streak: currentStreak,
      };
    };

    const getDateRange = () => {
      const today = new Date();
      switch (selectedPeriod) {
        case "day":
          return {
            start: parseISO(selectedDate),
            end: parseISO(selectedDate),
          };
        case "week":
          return { start: startOfWeek(today), end: endOfWeek(today) };
        case "month":
          return { start: startOfMonth(today), end: endOfMonth(today) };
        case "year":
          return { start: startOfYear(today), end: endOfYear(today) };
        case "all":
          return { start: subDays(today, 365 * 10), end: today };
        default:
          return { start: today, end: today };
      }
    };

    if (selectedPeriod === "day") {
      const savedData = localStorage.getItem(
        `amal_${selectedDate}_${user.email}`
      );
      if (savedData) {
        setDailyDetails(JSON.parse(savedData));
      } else {
        setDailyDetails(null);
      }
      setLoading(false);
      return;
    }

    const range = getDateRange();
    const data = [];
    let currentDate = new Date(range.start);

    while (currentDate <= range.end) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const savedData = localStorage.getItem(`amal_${dateStr}_${user.email}`);

      if (savedData) {
        const parsed = JSON.parse(savedData);
        data.push({ date: dateStr, points: parsed.totalPoints || 0 });
      } else {
        data.push({ date: dateStr, points: 0 });
      }

      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    setChartData({
      labels: data.map((d) => format(new Date(d.date), "MMM dd")),
      datasets: [
        {
          label: "Daily Points",
          data: data.map((d) => d.points),
          borderColor: "#1B4242",
          backgroundColor: "#8AB4B1",
          tension: 0.4,
        },
      ],
    });

    setStats(calculateStats(data, selectedStatsRange));
    setLoading(false);
  }, [
    selectedPeriod,
    selectedDate,
    selectedStatsRange,
    user,
    totalPossiblePoints,
  ]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to stretch
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12, // Smaller font for mobile
          },
        },
      },
      title: {
        display: true,
        text: "Your Amal Progress",
        font: {
          size: 16, // Adjust title size
        },
      },
      tooltip: {
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: totalPossiblePoints,
        ticks: {
          font: {
            size: 10, // Smaller ticks for mobile
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45, // Rotate labels for better fit
          minRotation: 45,
        },
      },
    },
  };

  const renderDailyDetails = () => {
    if (!dailyDetails)
      return (
        <div className="text-center text-gray-600 py-4 text-sm">
          No data available for this date
        </div>
      );

    const { answers, prayerValues, totalPoints } = dailyDetails;

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-islamic mb-3">
            Daily Summary - {format(parseISO(selectedDate), "MMMM d, yyyy")}
          </h3>
          <p className="text-base mb-2">
            Total Points: <span className="font-bold">{totalPoints}</span> /{" "}
            {totalPossiblePoints}
          </p>
          <div className="space-y-4">
            <h4 className="font-semibold text-islamic text-sm">
              Prayer Details:
            </h4>
            {Object.entries(prayerValues || {}).map(([prayer, values]) => (
              <div key={prayer} className="ml-2">
                <p className="font-medium text-sm">
                  {prayer.charAt(0).toUpperCase() + prayer.slice(1)}:
                </p>
                <ul className="ml-4 list-disc text-xs">
                  <li>Status: {values.status}</li>
                  {values.sunnah && <li>Sunnah prayed</li>}
                  {values.nafl && <li>Nafl prayed</li>}
                </ul>
              </div>
            ))}

            <h4 className="font-semibold text-islamic text-sm mt-3">
              Other Amals:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(answers || {}).map(([index, completed]) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-sm ${
                    completed ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`${
                      completed ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {amalQuestions[index]?.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-col items-start mb-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-islamic">
            Progress Tracker
          </h2>

          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {selectedPeriod === "day" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 border border-islamic rounded-md focus:outline-none focus:ring-2 focus:ring-islamic text-sm"
              />
            )}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPeriod("day")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  selectedPeriod === "day" ? "btn-primary" : "btn-secondary"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setSelectedPeriod("week")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  selectedPeriod === "week" ? "btn-primary" : "btn-secondary"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setSelectedPeriod("month")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  selectedPeriod === "month" ? "btn-primary" : "btn-secondary"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPeriod("year")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  selectedPeriod === "year" ? "btn-primary" : "btn-secondary"
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setSelectedPeriod("all")}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  selectedPeriod === "all" ? "btn-primary" : "btn-secondary"
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>

        {selectedPeriod === "day" ? (
          renderDailyDetails()
        ) : (
          <div className="h-64 sm:h-80 mb-6">
            {loading || !chartData ? (
              <div className="text-center text-gray-600 py-8 text-sm">
                Loading chart...
              </div>
            ) : (
              <Line options={options} data={chartData} />
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <h3 className="text-base sm:text-lg font-semibold text-islamic">
            Statistics
          </h3>
          <select
            value={selectedStatsRange}
            onChange={(e) => setSelectedStatsRange(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 border border-islamic rounded-md focus:outline-none focus:ring-2 focus:ring-islamic text-sm"
          >
            <option value="week">Weekly Stats</option>
            <option value="month">Monthly Stats</option>
            <option value="year">Yearly Stats</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <HiTrophy className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-base font-semibold text-green-800">
                Best Performance
              </h3>
            </div>
            <p className="text-green-600 text-sm">
              {stats.bestDay.date ? (
                <>
                  {format(new Date(stats.bestDay.date), "MMM dd, yyyy")}
                  <br />
                  {stats.bestDay.points} points
                </>
              ) : (
                "No data yet"
              )}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <HiExclamationCircle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-base font-semibold text-red-800">
                Needs Improvement
              </h3>
            </div>
            <p className="text-red-600 text-sm">
              {stats.worstDay.date ? (
                <>
                  {format(new Date(stats.worstDay.date), "MMM dd, yyyy")}
                  <br />
                  {stats.worstDay.points} points
                </>
              ) : (
                "No data yet"
              )}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <HiChartBar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-base font-semibold text-blue-800">
                Average Points
              </h3>
            </div>
            <p className="text-blue-600 text-sm">
              {stats.averagePoints} points per day
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <HiFire className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-base font-semibold text-orange-800">
                Current Streak
              </h3>
            </div>
            <p className="text-orange-600 text-sm">
              {stats.streak} {stats.streak === 1 ? "day" : "days"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackerStatus;
