/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useCallback } from "react";
import { useDateContext } from "../../context/DateContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import debounce from "lodash/debounce";

const PointingBanner = ({
  amalData,
  isLoading,
  isFetching,
  error,
  amalDataRefetch,
  optimisticPoints,
  onSubmit,
}) => {
  const {
    date,
    formatDate,
    formatAnyDate,
    handleDateChange,
    handlePreviousDay,
    handleNextDay,
    selectedDateValue,
  } = useDateContext();

  // Format the current date to DD-MM-YYYY for display
  const today = formatDate("DD-MM-YYYY");

  // Debounced re-fetch to prevent rapid calls
  const debouncedRefetch = useCallback(
    debounce(() => {
      amalDataRefetch();
    }, 300),
    [amalDataRefetch]
  );

  // Re-fetch amalData when selectedDateValue changes
  useEffect(() => {
    debouncedRefetch();
  }, [selectedDateValue, debouncedRefetch]);

  // Normalize dates for comparison
  const normalizeDate = (d) => {
    const normalized = new Date(d);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Find today's Amal data
  const todayAmal = amalData?.find((data) => data.info.amalDate === today);

  // Use optimistic points during fetching, else use server points
  const totalPoints =
    isFetching && optimisticPoints !== null
      ? optimisticPoints
      : todayAmal?.info.totalObtainedPoints || 0;

  // Determine the message based on points
  const getMessage = (points) => {
    if (points > 95) {
      return {
        text: "অসাধারণ! আপনি সঠিক পথে এগিয়ে চলেছেন। আল্লাহ আপনার আমল কবুল করুন।",
        color: "text-green-600 dark:text-green-400",
      };
    } else if (points >= 90) {
      return {
        text: "ভালো চেষ্টা! আরও আমল বাড়িয়ে আল্লাহর নৈকট্য লাভ করুন।",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    } else if (points >= 85) {
      return {
        text: "আরেকটু চেষ্টা করতে হবে। আপনি আমলে অলসতা করছেন।",
        color: "text-orange-600 dark:text-orange-400",
      };
    } else if (points >= 80) {
      return {
        text: "আপনার চেষ্টায় অনেক কমতি আছে। আমলকে গুরুত্ব দিন।",
        color: "text-red-500 dark:text-red-300",
      };
    } else {
      return {
        text: "আপনি ভুল পথে আছেন, দয়া করে আপনার ঈমানের দিকে মনোযোগ দিন।",
        color: "text-red-600 dark:text-red-400",
      };
    }
  };

  const message = getMessage(totalPoints);

  return (
    <div>
      {/* Card with date and navigation buttons */}
      <section className="w-11/12 md:w-2/3 mx-auto my-8 bg-gradient-to-r from-primary-100 to-islamic-light dark:from-primary-800 dark:to-islamic rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
        {/* Date picker at the top */}
        <div>
          <input
            type="date"
            value={selectedDateValue}
            onChange={(e) => handleDateChange(e.target.value)}
            max={formatAnyDate(new Date(), "YYYY-MM-DD")} // Prevent future dates
            className="w-full md:w-1/4 bg-primary-500 dark:bg-primary-600 text-white dark:text-gray-100 font-semibold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-400"
          />
        </div>

        <div className="text-center py-8">
          {isLoading || isFetching ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="flex justify-center items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
            </div>
          ) : error ? (
            <p className="text-red-600 dark:text-red-400 text-lg md:text-xl">
              ত্রুটি: ডেটা লোড করা যায়নি। আবার চেষ্টা করুন।
            </p>
          ) : !amalData ? (
            <p className="text-red-600 dark:text-red-400 text-lg md:text-xl">
              ডেটা পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।
            </p>
          ) : (
            <>
              <h1 className="text-islamic dark:text-islamic-light text-2xl md:text-3xl font-bold mb-4">
                আপনার আজকের পয়েন্ট
              </h1>
              <div className="flex justify-center items-center space-x-4 mb-4">
                <button
                  onClick={handlePreviousDay}
                  className="bg-primary-500 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-700 text-white dark:text-gray-100 font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  <ChevronLeft />
                </button>
                <p className="text-primary-900 dark:text-primary-100 text-lg md:text-xl">
                  {today}
                </p>
                <button
                  onClick={handleNextDay}
                  className="bg-primary-500 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-700 text-white dark:text-gray-100 font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 dark:disabled:opacity-50"
                  disabled={
                    formatAnyDate(normalizeDate(date), "YYYY-MM-DD") ===
                    formatAnyDate(normalizeDate(new Date()), "YYYY-MM-DD")
                  }
                >
                  <ChevronRight />
                </button>
              </div>
              <p className="text-primary-900 dark:text-primary-100 text-lg md:text-xl mt-4">
                আপনার প্রাপ্ত নম্বর:{" "}
                <span className="text-islamic dark:text-islamic-light font-bold">
                  {totalPoints}
                </span>
              </p>
              <p className={`${message.color} font-semibold mt-4`}>
                {message.text}
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PointingBanner;
