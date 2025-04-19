/* eslint-disable react/prop-types */
import { format, parse, isValid } from "date-fns";
import { HiExclamationCircle, HiChartBar, HiFire } from "react-icons/hi";
import { HiTrophy } from "react-icons/hi2";

const Statistics = ({ selectedStatsRange, setSelectedStatsRange, stats }) => {
  // console.log(stats);
  const formatDate = (dateStr) => {
    if (!dateStr) return "No data yet";
    const parsedDate = parse(dateStr, "dd-MM-yyyy", new Date());
    return isValid(parsedDate)
      ? format(parsedDate, "MMMM dd, yyyy")
      : "Invalid Date";
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h3 className="text-base sm:text-lg font-semibold text-islamic dark:text-islamic-light">
          Statistics
        </h3>
        <select
          value={selectedStatsRange}
          onChange={(e) => setSelectedStatsRange(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 border border-islamic dark:border-islamic-light rounded-md focus:outline-none focus:ring-2 focus:ring-islamic dark:focus:ring-islamic-light text-sm bg-white dark:bg-gray-700 text-primary-900 dark:text-primary-100"
        >
          <option value="week">Weekly Stats</option>
          <option value="month">Monthly Stats</option>
          <option value="year">Yearly Stats</option>
        </select>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Best performance card */}
        <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <HiTrophy className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="text-base font-semibold text-green-800 dark:text-green-300">
              Best Performance
            </h3>
          </div>
          <p className="text-green-600 dark:text-green-400 text-sm">
            {stats.bestDay.date ? (
              <>
                {formatDate(stats.bestDay.date)}
                <br />
                {stats.bestDay.points} points
              </>
            ) : (
              "No data yet"
            )}
          </p>
        </div>

        {/* Lowest card */}
        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <HiExclamationCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <h3 className="text-base font-semibold text-red-800 dark:text-red-300">
              Needs Improvement
            </h3>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">
            {stats.worstDay.date ? (
              <>
                {formatDate(stats.worstDay.date)}
                <br />
                {stats.worstDay.points} points
              </>
            ) : (
              "No data yet"
            )}
          </p>
        </div>

        {/* Average card */}
        <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <HiChartBar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-base font-semibold text-blue-800 dark:text-blue-300">
              Average Points
            </h3>
          </div>
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            {stats.averagePoints} points per day
          </p>
        </div>

        {/* Streak card */}
        <div className="bg-orange-50 dark:bg-orange-900/50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <HiFire className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
            <h3 className="text-base font-semibold text-orange-800 dark:text-orange-300">
              Current Streak
            </h3>
          </div>
          <p className="text-orange-600 dark:text-orange-400 text-sm">
            {stats.streak} {stats.streak === 1 ? "day" : "days"}
          </p>
        </div>
      </div>
    </>
  );
};

export default Statistics;
