/* eslint-disable no-unused-vars */
import { useMemo } from "react";
import moment from "moment-hijri";

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

const hijriMonthsBangla = [
  "মুহাররম",
  "সফর",
  "রবিউল আউয়াল",
  "রবিউস সানি",
  "জুমাদাল উলা",
  "জুমাদাস সানি",
  "রজব",
  "শাবান",
  "রমজান",
  "শাওয়াল",
  "জিলকদ",
  "জিলহজ",
];

const arabicToBanglaMonthMap = {
  محرم: "মুহাররম",
  صفر: "সফর",
  "ربيع الأول": "রবিউল আউয়াল",
  "ربيع الثاني": "রবিউস সানি",
  "جمادى الأولى": "জুমাদাল উলা",
  "جمادى الثانية": "জুমাদাস সানি",
  رجب: "রজব",
  شعبان: "শাবান",
  رمضان: "রমজান",
  شوال: "শাওয়াল",
  "ذو القعدة": "জিলকদ",
  "ذو الحجة": "জিলহজ",
};

const toBanglaNumber = (num) => {
  if (num === null || num === undefined) {
    // console.warn("toBanglaNumber received null/undefined, returning ০");
    return "০";
  }
  return num
    .toString()
    .split("")
    .map((digit) => banglaDigits[digit] || digit)
    .join("");
};

const useHijriDate = (gregorianDate = new Date()) => {
  return useMemo(() => {
    if (!(gregorianDate instanceof Date) || isNaN(gregorianDate.getTime())) {
      return "তারিখ পাওয়া যায়নি";
    }

    try {
      // Maghrib time (approximate) for Bangladesh, e.g., 6:15 PM
      const maghribHour = 18;
      const maghribMinute = 15;

      const now = new Date(gregorianDate);
      const maghribTime = new Date(now);
      maghribTime.setHours(maghribHour, maghribMinute, 0, 0);

      // If before Maghrib, subtract 1 day for Islamic date
      if (now < maghribTime) {
        now.setDate(now.getDate() - 1);
      }

      // Convert to Hijri using moment-hijri
      const hijri = moment(now).format("iD iMMMM iYYYY");
      const [day, monthName, year] = hijri.split(" ");

      const monthBangla = arabicToBanglaMonthMap[monthName];
      if (!monthBangla) {
        return "তারিখ পাওয়া যায়নি";
      }

      const dayNum = parseInt(day);
      const yearNum = parseInt(year);
      if (
        isNaN(dayNum) ||
        isNaN(yearNum) ||
        dayNum < 1 ||
        dayNum > 30 ||
        yearNum < 1400
      ) {
        return "তারিখ পাওয়া যায়নি";
      }

      const dayBangla = toBanglaNumber(dayNum);
      const yearBangla = toBanglaNumber(yearNum);

      return `${dayBangla} ${monthBangla}, ${yearBangla} হিজরি`;
    } catch (error) {
      return "তারিখ পাওয়া যায়নি";
    }
  }, [gregorianDate]);
};

export default useHijriDate;
