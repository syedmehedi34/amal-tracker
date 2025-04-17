/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { format, parseISO } from "date-fns";
import { HiExclamationCircle, HiChartBar, HiFire } from "react-icons/hi";
import { HiTrophy } from "react-icons/hi2";

const Statistics = ({ selectedStatsRange, setSelectedStatsRange, stats }) => {
  return (
    <>
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

      {/* cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* best performance card  */}
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
                {format(parseISO(stats.bestDay.date), "MMM dd, yyyy")}
                <br />
                {stats.bestDay.points} points
              </>
            ) : (
              "No data yet"
            )}
          </p>
        </div>

        {/* lowest card  */}
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
                {format(parseISO(stats.worstDay.date), "MMM dd, yyyy")}
                <br />
                {stats.worstDay.points} points
              </>
            ) : (
              "No data yet"
            )}
          </p>
        </div>

        {/* average card */}
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

        {/* streak card  */}
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
    </>
  );
};

export default Statistics;
