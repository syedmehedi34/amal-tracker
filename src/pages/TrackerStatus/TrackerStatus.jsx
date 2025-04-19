/* eslint-disable no-unused-vars */
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
  parse,
  isWithinInterval,
  eachDayOfInterval,
} from "date-fns";
import { useAuth } from "../../context/AuthProvider";
import useAmalData from "../../hooks/useAmalData";
import UpdateYourAmal from "./UpdateYourAmal";
import Statistics from "./StatisticsCard";
import RenderDailyDetails from "./renderDailyDetails";

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
    format(new Date(), "dd-MM-yyyy")
  );
  const [selectedStatsRange, setSelectedStatsRange] = useState("month");
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState({
    bestDay: { date: null, points: 0 },
    worstDay: { date: null, points: Infinity },
    averagePoints: 0,
    streak: 0,
  });
  const [dailyDetails, setDailyDetails] = useState([]);
  const { user } = useAuth();
  const { amalData, isLoading, error } = useAmalData();
  const totalPossiblePoints = 100;

  useEffect(() => {
    if (!user || isLoading) return;

    if (error) {
      // console.error("Error fetching amal data:", error);
      setDailyDetails([]);
      setChartData(null);
      setStats({
        bestDay: { date: null, points: 0 },
        worstDay: { date: null, points: Infinity },
        averagePoints: 0,
        streak: 0,
      });
      return;
    }

    const pointsByDate = amalData.reduce((acc, item) => {
      const date = item.info?.amalDate;
      if (date) acc[date] = Number(item.info?.totalObtainedPoints) || 0;
      return acc;
    }, {});

    const calculateStats = (range) => {
      let bestDay = { date: null, points: -Infinity };
      let worstDay = { date: null, points: Infinity };
      let totalPoints = 0;
      let currentStreak = 0;
      let previousDate = null;

      const today = new Date();
      const yesterday = subDays(today, 1);
      const startDate =
        range === "week"
          ? startOfWeek(today, { weekStartsOn: 1 })
          : range === "month"
          ? startOfMonth(today)
          : range === "year"
          ? startOfYear(today)
          : subDays(today, 365);

      const filteredPoints = Object.entries(pointsByDate).filter(([date]) => {
        try {
          return isWithinInterval(parse(date, "dd-MM-yyyy", new Date()), {
            start: startDate,
            end: yesterday, // Exclude today
          });
        } catch (e) {
          console.warn(`Invalid date format: ${date}`);
          return false;
        }
      });

      filteredPoints.sort(
        ([dateA], [dateB]) =>
          parse(dateA, "dd-MM-yyyy", new Date()).getTime() -
          parse(dateB, "dd-MM-yyyy", new Date()).getTime()
      );

      filteredPoints.forEach(([date, points]) => {
        const displayPoints = points; // Use raw points for stats
        if (displayPoints > bestDay.points) {
          bestDay = { date, points: displayPoints };
        }
        if (displayPoints < worstDay.points) {
          worstDay = { date, points: displayPoints };
        }

        // Clamp points for streak calculation to maintain consistency
        const percentage = (Math.max(points, 0) / totalPossiblePoints) * 100;
        if (percentage >= 95) {
          const current = parse(date, "dd-MM-yyyy", new Date());
          const prev = previousDate
            ? parse(previousDate, "dd-MM-yyyy", new Date())
            : null;
          if (!prev || (current - prev) / (1000 * 60 * 60 * 24) === 1) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
          previousDate = date;
        } else {
          currentStreak = 0;
          previousDate = null;
        }

        totalPoints += displayPoints;
      });

      return {
        bestDay,
        worstDay: worstDay.date ? worstDay : { date: null, points: 0 },
        averagePoints: filteredPoints.length
          ? Math.round(totalPoints / filteredPoints.length)
          : 0,
        streak: currentStreak,
      };
    };

    const getDateRange = () => {
      const today = new Date();
      switch (selectedPeriod) {
        case "day":
          return {
            start: parse(selectedDate, "dd-MM-yyyy", new Date()),
            end: parse(selectedDate, "dd-MM-yyyy", new Date()),
          };
        case "week":
          return {
            start: startOfWeek(today, { weekStartsOn: 1 }),
            end: endOfWeek(today, { weekStartsOn: 1 }),
          };
        case "month":
          return { start: startOfMonth(today), end: endOfMonth(today) };
        case "year":
          return { start: startOfYear(today), end: endOfYear(today) };
        case "all":
          return { start: subDays(today, 365 * 5), end: today };
        default:
          return { start: today, end: today };
      }
    };

    if (selectedPeriod === "day") {
      const dayData = amalData.filter(
        (item) => item.info?.amalDate === selectedDate
      );
      setDailyDetails(
        dayData.length
          ? dayData.map((item) => ({
              answers: item.amalDetails.map((detail) => ({
                amalCode: detail.amalCode,
                amalName: detail.amalName,
                category: detail.category,
                priority: detail.priority,
                isDone: detail.isDone,
                point: detail.point,
              })),
              totalPoints: item.info?.totalObtainedPoints || 0,
            }))
          : []
      );
      return;
    }

    const range = getDateRange();
    const allDates = eachDayOfInterval({ start: range.start, end: range.end });
    const data = allDates.map((date) => {
      const dateStr = format(date, "dd-MM-yyyy");
      const points = Math.max(pointsByDate[dateStr] || 0, 0); // Clamp for chart
      return { date: dateStr, points };
    });

    setChartData({
      labels: data.map((d) =>
        format(parse(d.date, "dd-MM-yyyy", new Date()), "MMM dd")
      ),
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

    setStats(calculateStats(selectedStatsRange));
  }, [
    selectedPeriod,
    selectedDate,
    selectedStatsRange,
    user,
    amalData,
    isLoading,
    error,
    totalPossiblePoints,
  ]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 } } },
      title: { display: true, text: "Your Amal Progress", font: { size: 16 } },
      tooltip: { bodyFont: { size: 12 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 120,
        min: 0,
        ticks: { font: { size: 10 } },
      },
      x: { ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 } },
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-col items-start mb-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-islamic">
            Progress Tracker
          </h2>
          {!user && (
            <div className="text-yellow-600 text-sm">
              Please log in to view your progress.
            </div>
          )}
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {selectedPeriod === "day" && (
              <input
                type="date"
                value={format(
                  parse(selectedDate, "dd-MM-yyyy", new Date()),
                  "yyyy-MM-dd"
                )}
                onChange={(e) =>
                  setSelectedDate(
                    format(new Date(e.target.value), "dd-MM-yyyy")
                  )
                }
                className="w-full sm:w-auto px-3 py-1.5 border border-islamic rounded-md focus:outline-none focus:ring-2 focus:ring-islamic text-sm"
                max={format(new Date(), "yyyy-MM-dd")}
              />
            )}
            <div className="flex flex-wrap gap-2">
              {["day", "week", "month", "year", "all"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    selectedPeriod === period ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {period.charAt(0).toUpperCase() +
                    period.slice(1) +
                    (period === "all" ? " Time" : "ly")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-islamic border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg text-islamic">Loading...</p>
          </div>
        ) : selectedPeriod === "day" ? (
          <RenderDailyDetails
            dailyDetails={dailyDetails}
            selectedDate={selectedDate}
            totalPossiblePoints={totalPossiblePoints}
          />
        ) : (
          <div className="h-64 sm:h-80 mb-6">
            {!chartData || chartData.datasets[0].data.every((p) => p === 0) ? (
              <div className="text-center text-gray-600 py-8 text-sm">
                No data available for this period
              </div>
            ) : (
              <Line options={options} data={chartData} />
            )}
          </div>
        )}

        <Statistics
          selectedStatsRange={selectedStatsRange}
          setSelectedStatsRange={setSelectedStatsRange}
          stats={stats}
        />
        <UpdateYourAmal />
      </div>
    </div>
  );
}

export default TrackerStatus;
