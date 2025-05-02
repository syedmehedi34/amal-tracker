/* eslint-disable no-unused-vars */
import useDate from "../../hooks/useDate";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PointingBanner = () => {
  const {
    date,
    formatDate,
    handleDateChange,
    handlePreviousDay,
    handleNextDay,
    selectedDateValue,
  } = useDate();

  // Format the current date to DD-MM-YYYY for display
  const today = formatDate("DD-MM-YYYY");

  return (
    <div>
      {/* Card with date and navigation buttons */}
      <section className="w-11/12 md:w-2/3 mx-auto my-8 bg-gradient-to-r from-primary-100 to-islamic-light dark:from-primary-900 dark:to-islamic rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Date picker at the top */}
        <div className="">
          <input
            type="date"
            value={selectedDateValue}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full md:w-1/4 bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>

        <div className="text-center py-8">
          <h1 className="text-islamic dark:text-islamic-light text-2xl md:text-3xl font-bold mb-4">
            আপনার আজকের পয়েন্ট
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <button
              onClick={handlePreviousDay}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              <ChevronLeft />
            </button>
            <p className="text-primary-900 dark:text-primary-100 text-lg md:text-xl">
              {today}
            </p>
            <button
              onClick={handleNextDay}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              <ChevronRight />
            </button>
          </div>
          <p className="text-primary-900 dark:text-primary-100 text-lg md:text-xl mt-4">
            আপনার প্রাপ্ত নম্বর:{" "}
            <span className="text-islamic dark:text-islamic-light font-bold">
              40/100
            </span>
          </p>
          <p className="text-red-600 dark:text-red-400 font-semibold mt-4">
            আপনি ভুল পথে আছেন, দয়া করে আপনার ঈমানের দিকে মনোযোগ দিন।
          </p>
        </div>
      </section>
    </div>
  );
};

export default PointingBanner;
