import { useMemo } from "react";

const banglaDigits = {
  0: "০",
  1: "১",
  2: "২",
  3: "৩",
  4: "৪",
  5: "৫",
  6: "৬",
  7: "৭",
  8: "৮",
  9: "৯",
};

const gregorianMonthsBangla = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "অগাস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const toBanglaNumber = (num) => {
  if (num === null || num === undefined) {
    console.warn("toBanglaNumber received null/undefined, returning ০");
    return "০";
  }
  return num
    .toString()
    .split("")
    .map((digit) => banglaDigits[digit] || digit)
    .join("");
};

const useBanglaGregorianDate = (gregorianDate = new Date()) => {
  return useMemo(() => {
    // console.log("useBanglaGregorianDate input:", {
    //   date: gregorianDate,
    //   isDate: gregorianDate instanceof Date,
    //   isValid: !isNaN(gregorianDate.getTime()),
    //   timestamp: gregorianDate.getTime(),
    // });

    // Validate input date
    if (!(gregorianDate instanceof Date) || isNaN(gregorianDate.getTime())) {
      console.warn("Invalid gregorianDate:", gregorianDate);
      return "তারিখ পাওয়া যায়নি";
    }

    try {
      const day = gregorianDate.getDate();
      const month = gregorianDate.getMonth(); // 0-based (0 = January, 11 = December)
      const year = gregorianDate.getFullYear();

      //   console.log("Gregorian output:", { day, month, year });

      // Validate day, month, and year
      if (
        !Number.isInteger(day) ||
        !Number.isInteger(month) ||
        !Number.isInteger(year) ||
        day < 1 ||
        day > 31 ||
        month < 0 ||
        month >= 12 ||
        year < 1000
      ) {
        console.warn("Invalid Gregorian values:", { day, month, year });
        return "তারিখ পাওয়া যায়নি";
      }

      const dayBangla = toBanglaNumber(day);
      const yearBangla = toBanglaNumber(year);
      const monthBangla = gregorianMonthsBangla[month];

      const result = `${dayBangla} ${monthBangla}, ${yearBangla} ইং`;
      //   console.log("Formatted Gregorian date:", result);
      return result;
    } catch (error) {
      console.error("Error in useBanglaGregorianDate:", error);
      return "তারিখ পাওয়া যায়নি";
    }
  }, [gregorianDate]);
};

export default useBanglaGregorianDate;
