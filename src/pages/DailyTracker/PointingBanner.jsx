import useBanglaGregorianDate from "../../hooks/useBanglaGregorianDate";
import useHijriDate from "../../hooks/useHijriDate";

const PointingBanner = () => {
  const hijriDate = useHijriDate();
  const gregorianDate = useBanglaGregorianDate();
  return (
    <section className="w-11/12 md:w-2/3 mx-auto my-8 bg-gradient-to-r from-primary-100 to-islamic-light dark:from-primary-900 dark:to-islamic rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center py-8">
        <h1 className="text-islamic dark:text-islamic-light text-2xl md:text-3xl font-bold mb-4">
          আপনার আজকের পয়েন্ট
        </h1>
        <p className="text-primary-900 dark:text-primary-100 text-lg md:text-xl">
          {gregorianDate} | {hijriDate}
        </p>
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
  );
};

export default PointingBanner;
