/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from "react";
import useAmalData from "../hooks/useAmalData";

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const { amalData, isLoading, error, amalDataRefetch } = useAmalData();
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    return today;
  });
  const [selectedDateValue, setSelectedDateValue] = useState(
    formatDate(new Date(), "YYYY-MM-DD")
  );

  // Function 1: Format date to a specified format
  function formatDate(dateObj, format = "YYYY-MM-DD") {
    // Validate dateObj
    const validDate =
      dateObj instanceof Date && !isNaN(dateObj) ? dateObj : new Date();
    // Validate format
    const validFormat = typeof format === "string" ? format : "YYYY-MM-DD";

    const year = validDate.getFullYear();
    const month = String(validDate.getMonth() + 1).padStart(2, "0");
    const day = String(validDate.getDate()).padStart(2, "0");

    try {
      return validFormat
        .replace("YYYY", year)
        .replace("MM", month)
        .replace("DD", day);
    } catch (error) {
      console.error("Error formatting date:", error, { dateObj, format });
      return validDate.toISOString().split("T")[0]; // Fallback to YYYY-MM-DD
    }
  }

  // Function 2: Add days to a given date
  function addDays(dateObj, days) {
    const newDate = new Date(dateObj);
    newDate.setDate(dateObj.getDate() + days);
    newDate.setHours(0, 0, 0, 0); // Normalize to start of day
    return newDate;
  }

  // Function 3: Handle date picker change
  function handleDateChange(selectedDate) {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const newDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    if (!isNaN(newDate) && newDate <= today) {
      newDate.setHours(0, 0, 0, 0); // Normalize to start of day
      setDate(newDate);
      setSelectedDateValue(selectedDate);
      console.log("Date picker changed to:", selectedDate);
    } else {
      console.warn("Invalid or future date selected:", selectedDate);
    }
  }

  // Function 4: Handle previous day navigation
  function handlePreviousDay() {
    amalDataRefetch();
    const newDate = addDays(date, -1);
    setDate(newDate);
    setSelectedDateValue(formatDate(newDate, "YYYY-MM-DD"));
  }

  // Function 5: Handle next day navigation
  function handleNextDay() {
    amalDataRefetch();
    const newDate = addDays(date, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    if (newDate.getTime() <= today.getTime()) {
      setDate(newDate);
      setSelectedDateValue(formatDate(newDate, "YYYY-MM-DD"));
    } else {
      console.warn(
        "Cannot navigate to future date:",
        formatDate(newDate, "DD-MM-YYYY")
      );
    }
  }

  const contextValue = useMemo(
    () => ({
      date,
      formatDate: (fmt) => formatDate(date, fmt),
      formatAnyDate: formatDate,
      handleDateChange,
      handlePreviousDay,
      handleNextDay,
      selectedDateValue,
    }),
    [date, selectedDateValue]
  );

  return (
    <DateContext.Provider value={contextValue}>{children}</DateContext.Provider>
  );
};

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDateContext must be used within a DateProvider");
  }
  return context;
};
