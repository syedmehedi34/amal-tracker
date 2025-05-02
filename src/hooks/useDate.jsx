// import { useState, useEffect } from "react";

// const useDate = () => {
//   const [date, setDate] = useState(new Date());
//   const [selectedDateValue, setSelectedDateValue] = useState(
//     formatDate(new Date(), "YYYY-MM-DD")
//   );

//   // Log date changes for debugging
//   useEffect(() => {
//     console.log("useDate date updated:", formatDate(date, "DD-MM-YYYY"));
//   }, [date]);

//   // Function 1: Format date to a specified format
//   function formatDate(dateObj, format = "YYYY-MM-DD") {
//     const year = dateObj.getFullYear();
//     const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//     const day = String(dateObj.getDate()).padStart(2, "0");

//     return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
//   }

//   // Function 2: Add days to a given date
//   function addDays(dateObj, days) {
//     const newDate = new Date(dateObj);
//     newDate.setDate(dateObj.getDate() + days);
//     return newDate;
//   }

//   // Function 3: Handle date picker change
//   function handleDateChange(selectedDate) {
//     const [year, month, day] = selectedDate.split("-").map(Number);
//     const newDate = new Date(year, month - 1, day);
//     setDate(newDate);
//     setSelectedDateValue(selectedDate);
//     console.log("Date picker changed to:", selectedDate);
//   }

//   // Function 4: Handle previous day navigation
//   function handlePreviousDay() {
//     const newDate = addDays(date, -1);
//     setDate(newDate);
//     setSelectedDateValue(formatDate(newDate, "YYYY-MM-DD"));
//     console.log("Previous day:", formatDate(newDate, "DD-MM-YYYY"));
//   }

//   // Function 5: Handle next day navigation
//   function handleNextDay() {
//     const newDate = addDays(date, 1);
//     setDate(newDate);
//     setSelectedDateValue(formatDate(newDate, "YYYY-MM-DD"));
//     console.log("Next day:", formatDate(newDate, "DD-MM-YYYY"));
//   }

//   return {
//     date,
//     formatDate: (fmt) => formatDate(date, fmt),
//     handleDateChange,
//     handlePreviousDay,
//     handleNextDay,
//     selectedDateValue,
//   };
// };

// export default useDate;
