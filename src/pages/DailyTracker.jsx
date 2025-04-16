// /* eslint-disable no-unused-vars */
// import { useState, useEffect } from "react";
// import { amalQuestions } from "../data/amalQuestions";
// import { format } from "date-fns";
// import {
//   HiChevronLeft,
//   HiChevronRight,
//   HiPencil,
//   HiInformationCircle,
//   HiLightBulb,
// } from "react-icons/hi";
// import AmalDetailsModal from "../components/AmalDetailsModal";
// import PrayerBreakdown from "../components/PrayerBreakdown";
// import { useAuth } from "../context/AuthProvider";
// import useAxiosPublic from "../hooks/useAxiosPublic";
// import Swal from "sweetalert2";
// import moment from "moment-hijri"; // Added for Hijri date

// function DailyTracker() {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [showResults, setShowResults] = useState(false);
//   const [hasParticipatedToday, setHasParticipatedToday] = useState(false);
//   const [todayPoints, setTodayPoints] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [originalAnswers, setOriginalAnswers] = useState({});
//   const [selectedAmal, setSelectedAmal] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [prayerValues, setPrayerValues] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const { user } = useAuth();
//   const axiosPublic = useAxiosPublic();

//   const totalPossiblePoints = amalQuestions.reduce(
//     (total, q) => total + q.points,
//     0
//   );

//   // Helper function to convert numbers to Bengali numerals
//   const toBengaliNumeral = (num) =>
//     String(num).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯".charAt(Number(d)));

//   // Helper function to get Bengali month name for Gregorian date
//   const getBengaliMonth = (month) => {
//     const months = [
//       "জানুয়ারি",
//       "ফেব্রুয়ারি",
//       "মার্চ",
//       "এপ্রিল",
//       "মে",
//       "জুন",
//       "জুলাই",
//       "আগস্ট",
//       "সেপ্টেম্বর",
//       "অক্টোবর",
//       "নভেম্বর",
//       "ডিসেম্বর",
//     ];
//     return months[month];
//   };

//   // Helper function to get Bengali Hijri month name
//   const getBengaliHijriMonth = (monthName) => {
//     const hijriMonths = {
//       Muharram: "মুহাররম",
//       Safar: "সফর",
//       "Rabi al-Awwal": "রবিউল আউয়াল",
//       "Rabi al-Thani": "রবিউস সানি",
//       "Jumada al-Awwal": "জমাদিউল আউয়াল",
//       "Jumada al-Thani": "জমাদিউস সানি",
//       Rajab: "রজব",
//       Shaban: "শাবান",
//       Ramadan: "রমজান",
//       Shawwal: "শাওয়াল",
//       "Dhu al-Qidah": "জিলকদ",
//       "Dhu al-Hijjah": "জিলহজ",
//     };
//     return hijriMonths[monthName] || monthName;
//   };

//   // Format English (Gregorian) date
//   const getEnglishDate = () => {
//     const today = new Date();
//     const day = toBengaliNumeral(today.getDate());
//     const month = getBengaliMonth(today.getMonth());
//     const year = toBengaliNumeral(today.getFullYear());
//     return `${day} ${month}, ${year} ইং`;
//   };

//   // Format Arabic (Hijri) date
//   const getHijriDate = () => {
//     try {
//       const hijri = moment().format("iD iMMMM iYYYY");
//       const [day, monthName, year] = hijri.split(" ");
//       return `${toBengaliNumeral(day)} ${getBengaliHijriMonth(
//         monthName
//       )}, ${toBengaliNumeral(year)} হিঃ`;
//     } catch (error) {
//       console.error("Error calculating Hijri date:", error);
//       return "হিজরি তারিখ পাওয়া যায়নি";
//     }
//   };

//   useEffect(() => {
//     if (!user?.email) return;

//     const fetchTodayData = async () => {
//       setIsLoading(true);
//       try {
//         const today = format(new Date(), "yyyy-MM-dd");
//         const response = await axiosPublic.get("/amal_data_by_date", {
//           params: {
//             userEmail: user.email,
//             date: today,
//           },
//         });

//         const data = response.data;
//         if (data && Object.keys(data).length > 0) {
//           const fetchedAnswers = {};
//           Object.entries(data.questions || {}).forEach(
//             ([questionName, value]) => {
//               const index = amalQuestions.findIndex(
//                 (q) => q.questionName === questionName
//               );
//               if (index !== -1) {
//                 fetchedAnswers[index] = value === "Yes";
//               }
//             }
//           );

//           setHasParticipatedToday(true);
//           setTodayPoints(data.points?.totalPoints || 0);
//           setAnswers(fetchedAnswers);
//           setOriginalAnswers(fetchedAnswers);
//           setPrayerValues(data.prayerValues || {});
//           setShowResults(true);
//         } else {
//           setHasParticipatedToday(false);
//           setTodayPoints(0);
//           setAnswers({});
//           setOriginalAnswers({});
//           setPrayerValues({});
//           setShowResults(false);
//         }
//       } catch (error) {
//         console.error("Error fetching today’s data:", error);
//         Swal.fire({
//           position: "top-center",
//           icon: "error",
//           title: "Failed to load today’s data",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTodayData();
//   }, [user, axiosPublic]);

//   const calculatePrayerPoints = () => {
//     let total = 0;
//     Object.entries(prayerValues).forEach(([prayer, values]) => {
//       if (values.status === "congregation") total += 4;
//       else if (values.status === "alone") total += 1;

//       if (values.sunnah) {
//         if (prayer === "dhuhr") total += 3;
//         else total += 1;
//       }

//       if (prayer === "dhuhr" && values.nafl) total += 1;
//     });
//     return total;
//   };

//   const getSuggestions = () => {
//     const suggestions = [];

//     Object.entries(prayerValues).forEach(([prayer, values]) => {
//       if (!values.status || values.status === "notPrayed") {
//         suggestions.push(`${prayer} - এর সলাত আদায় করুন।`);
//       }
//       if (values.status !== "congregation") {
//         suggestions.push(
//           `${prayer} - এর সলাত জামাতের সাথে আদায়ের চেষ্টা করুন।`
//         );
//       }
//       if (
//         !values.sunnah &&
//         (prayer === "fajr" || prayer === "dhuhr" || prayer === "maghrib")
//       ) {
//         suggestions.push(`${prayer} - এর সুন্নাত নামাজ আদায় করুন।`);
//       }
//     });

//     Object.entries(answers).forEach(([index, completed]) => {
//       if (!completed && amalQuestions[index]) {
//         const question = amalQuestions[index];
//         if (question.category === "কুরআন তেলাওয়াত") {
//           suggestions.push("কুরআন তেলাওয়াত করুন।");
//         }
//         if (question.category === "সকাল সন্ধ্যা জিকির") {
//           suggestions.push("আপনার সকাল সন্ধ্যা যিকর গুলো করুন।");
//         }
//       }
//     });

//     return suggestions.slice(0, 5);
//   };

//   const handleAnswer = (completed) => {
//     if (currentQuestion === 0) {
//       goToNextQuestion();
//       return;
//     }

//     setAnswers({
//       ...answers,
//       [currentQuestion]: completed,
//     });

//     const isLastQuestion = currentQuestion === amalQuestions.length - 1;
//     if (!isLastQuestion) {
//       setIsTransitioning(true);
//       setSelectedOption(completed);
//       setTimeout(() => {
//         goToNextQuestion();
//         setIsTransitioning(false);
//         setSelectedOption(null);
//       }, 500);
//     }
//   };

//   const handlePrayerValueChange = (prayer, field, value) => {
//     setPrayerValues((prev) => ({
//       ...prev,
//       [prayer]: {
//         ...prev[prayer],
//         [field]: value,
//       },
//     }));
//   };

//   const goToNextQuestion = () => {
//     if (currentQuestion < amalQuestions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const goToPreviousQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     const regularPoints = Object.entries(answers).reduce(
//       (total, [questionIndex, completed]) => {
//         return total + (completed ? amalQuestions[questionIndex].points : 0);
//       },
//       0
//     );

//     const answeringDate = format(new Date(), "yyyy-MM-dd");
//     const userInformation = {
//       userEmail: user?.email,
//       name: user?.displayName,
//       date: answeringDate,
//     };

//     const prayerPoints = calculatePrayerPoints();
//     const totalPoints = regularPoints + prayerPoints;

//     const allAnswerInfo = {
//       questions: Object.entries(answers).reduce(
//         (acc, [questionIndex, completed]) => {
//           const question = amalQuestions[questionIndex];
//           acc[question.questionName] = completed ? "Yes" : "No";
//           return acc;
//         },
//         {}
//       ),
//       prayerValues: { ...prayerValues },
//       userInformation,
//       points: {
//         regularPoints,
//         prayerPoints,
//         totalPoints,
//       },
//     };

//     try {
//       const res = await axiosPublic.post("/amal_data", allAnswerInfo);
//       Swal.fire({
//         position: "top-center",
//         icon: "success",
//         title: res.data.message || "Your daily Amal has been saved!",
//         showConfirmButton: false,
//         timer: 1500,
//       });

//       setTodayPoints(totalPoints);
//       setShowResults(true);
//       setHasParticipatedToday(true);
//       setIsEditing(false);
//       setOriginalAnswers(answers);
//     } catch (error) {
//       console.error("Error submitting data:", error);
//       Swal.fire({
//         position: "top-center",
//         icon: "error",
//         title: "Failed to save data",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setShowResults(false);
//     setCurrentQuestion(0);
//   };

//   const handleCancel = () => {
//     if (isEditing) {
//       setAnswers(originalAnswers);
//       setIsEditing(false);
//       setShowResults(true);
//     } else {
//       setAnswers({});
//       setPrayerValues({});
//       setCurrentQuestion(0);
//     }
//   };

//   const getPerformanceMessage = (points) => {
//     const percentage = (points / totalPossiblePoints) * 100;

//     if (percentage >= 95) {
//       return {
//         message: "মাশাআল্লাহ! আপনি খুব ভালো করেছেন।",
//         className: "text-green-600",
//       };
//     } else if (percentage >= 90) {
//       return {
//         message: "আরও চেষ্টা করুন, আপনি পারবেন ইনশাআল্লাহ।",
//         className: "text-blue-600",
//       };
//     } else if (percentage >= 85) {
//       return {
//         message: "সতর্কবার্তা: আপনাকে আরও মনোযোগী হতে হবে।",
//         className: "text-yellow-600",
//       };
//     } else {
//       return {
//         message: "আপনি ভুল পথে আছেন, দয়া করে আপনার ঈমানের দিকে মনোযোগ দিন।",
//         className: "text-red-600",
//       };
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
//         <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
//           <div className="w-12 h-12 border-4 border-islamic border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-lg text-islamic">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (hasParticipatedToday && !isEditing) {
//     const { message, className } = getPerformanceMessage(todayPoints);
//     const suggestions = getSuggestions();

//     return (
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
//         <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
//           <div className="flex justify-end mb-3">
//             <button
//               onClick={handleEdit}
//               className="flex items-center text-islamic hover:text-islamic-dark text-sm"
//             >
//               <HiPencil className="w-4 h-4 mr-1" />
//               এডিট করুন
//             </button>
//           </div>
//           <h2 className="text-lg sm:text-xl font-bold text-islamic mb-3">
//             আজকের আমল সম্পন্ন হয়েছে
//           </h2>
//           <p className="text-base sm:text-lg mb-3">
//             {getEnglishDate()} | {getHijriDate()}
//           </p>
//           <p className="text-base sm:text-lg mb-3">
//             আপনার প্রাপ্ত নম্বর:{" "}
//             <span className="font-bold">
//               {todayPoints}/{totalPossiblePoints}
//             </span>
//           </p>
//           <p className={`text-sm sm:text-base font-semibold ${className} mb-3`}>
//             {message}
//           </p>
//         </div>

//         {suggestions.length > 0 && (
//           <div className="bg-islamic-light/10 rounded-lg shadow-lg p-4 sm:p-6">
//             <div className="flex items-center mb-4">
//               <HiLightBulb className="w-6 h-6 text-islamic mr-2" />
//               <h3 className="text-lg sm:text-xl font-semibold text-islamic">
//                 You need to improve these Amals
//               </h3>
//             </div>
//             <ul className="space-y-3">
//               {suggestions.map((suggestion, index) => (
//                 <li key={index} className="flex items-start">
//                   <span className="inline-block w-2 h-2 mt-2 mr-2 bg-islamic rounded-full"></span>
//                   <span className="text-gray-700">{suggestion}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     );
//   }

//   const question = amalQuestions[currentQuestion];
//   const isAnswered = answers[currentQuestion] !== undefined;
//   const isLastQuestion = currentQuestion === amalQuestions.length - 1;
//   const allQuestionsAnswered =
//     Object.keys(answers).length === amalQuestions.length - 1;

//   return (
//     <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
//       <div
//         className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 relative ${
//           isTransitioning ? "filter blur-[1px] opacity40 bg-white/30" : ""
//         }`}
//       >
//         {isTransitioning && (
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
//             <div className="w-6 h-6 border-2 border-islamic border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         )}
//         <div className="mb-6">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
//             <span className="text-xs sm:text-sm text-primary-600">
//               প্রশ্ন {currentQuestion + 1} / {amalQuestions.length}
//             </span>
//             <div className="flex items-center space-x-2">
//               <span
//                 className={`px-2 py-1 rounded-full text-xs ${
//                   isAnswered
//                     ? "bg-green-100 text-green-800"
//                     : "bg-yellow-100 text-yellow-800"
//                 }`}
//               >
//                 {isAnswered ? "উত্তর দেওয়া হয়েছে" : "উত্তর দেওয়া হয়নি"}
//               </span>
//               <span className="text-xs sm:text-sm text-primary-600">
//                 {question.category}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <h2 className="text-lg sm:text-xl font-semibold text-islamic">
//               {question.question}
//             </h2>
//             <button
//               onClick={() => {
//                 setSelectedAmal(question);
//                 setShowDetailsModal(true);
//               }}
//               disabled={isTransitioning}
//               className={`ml-2 text-islamic hover:text-islamic-dark ${
//                 isTransitioning ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               <HiInformationCircle className="w-5 h-5" />
//             </button>
//           </div>

//           {currentQuestion === 0 && (
//             <div className="mt-4">
//               <PrayerBreakdown
//                 values={prayerValues}
//                 onChange={handlePrayerValueChange}
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between items-center space-x-2">
//           <button
//             onClick={goToPreviousQuestion}
//             disabled={currentQuestion === 0 || isTransitioning}
//             className={`p-2 rounded-full ${
//               currentQuestion === 0 || isTransitioning
//                 ? "text-gray-300 cursor-not-allowed"
//                 : "text-islamic hover:bg-islamic-light/10"
//             }`}
//           >
//             <HiChevronLeft className="w-5 h-5" />
//           </button>

//           {currentQuestion !== 0 && (
//             <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
//               <button
//                 onClick={() => handleAnswer(true)}
//                 disabled={isTransitioning}
//                 className={`px-3 py-1.5 text-sm rounded-md ${
//                   (isAnswered && answers[currentQuestion]) ||
//                   (isTransitioning && selectedOption === true)
//                     ? "bg-green-600 text-white"
//                     : "btn-primary"
//                 } ${isTransitioning ? "cursor-not-allowed" : ""}`}
//               >
//                 সম্পন্ন করেছি
//               </button>
//               <button
//                 onClick={() => handleAnswer(false)}
//                 disabled={isTransitioning}
//                 className={`px-3 py-1.5 text-sm rounded-md ${
//                   (isAnswered && !answers[currentQuestion]) ||
//                   (isTransitioning && selectedOption === false)
//                     ? "bg-red-600 text-white"
//                     : "btn-secondary"
//                 } ${isTransitioning ? "cursor-not-allowed" : ""}`}
//               >
//                 সম্পন্ন করি নি
//               </button>
//             </div>
//           )}

//           <button
//             onClick={goToNextQuestion}
//             disabled={
//               currentQuestion === amalQuestions.length - 1 || isTransitioning
//             }
//             className={`p-2 rounded-full ${
//               currentQuestion === amalQuestions.length - 1 || isTransitioning
//                 ? "text-gray-300 cursor-not-allowed"
//                 : "text-islamic hover:bg-islamic-light/10"
//             }`}
//           >
//             <HiChevronRight className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="mt-6">
//           <div className="w-full bg-primary-200 rounded-full h-2">
//             <div
//               className="bg-islamic rounded-full h-2 transition-all"
//               style={{
//                 width: `${
//                   ((currentQuestion + 1) / amalQuestions.length) * 100
//                 }%`,
//               }}
//             />
//           </div>
//         </div>

//         <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
//           {(Object.keys(answers).length > 0 ||
//             Object.keys(prayerValues).length > 0) && (
//             <button
//               onClick={handleCancel}
//               disabled={isTransitioning}
//               className={`px-3 py-1.5 text-sm rounded-md btn-secondary ${
//                 isTransitioning ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               বাতিল করুন
//             </button>
//           )}
//           {allQuestionsAnswered && (
//             <button
//               onClick={handleSubmit}
//               disabled={isTransitioning}
//               className={`px-3 py-1.5 text-sm rounded-md btn-primary ${
//                 isTransitioning ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               জমা দিন
//             </button>
//           )}
//         </div>
//       </div>

//       <AmalDetailsModal
//         isOpen={showDetailsModal}
//         onClose={() => setShowDetailsModal(false)}
//         amal={selectedAmal}
//       />
//     </div>
//   );
// }

// export default DailyTracker;
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { amalQuestions } from "../data/amalQuestions";
import { format } from "date-fns";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPencil,
  HiInformationCircle,
  HiLightBulb,
} from "react-icons/hi";
import AmalDetailsModal from "../components/AmalDetailsModal";
import PrayerBreakdown from "../components/PrayerBreakdown";
import { useAuth } from "../context/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import moment from "moment-hijri"; // Added for Hijri date

function DailyTracker() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [hasParticipatedToday, setHasParticipatedToday] = useState(false);
  const [todayPoints, setTodayPoints] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalAnswers, setOriginalAnswers] = useState({});
  const [selectedAmal, setSelectedAmal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [prayerValues, setPrayerValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const totalPossiblePoints = amalQuestions.reduce(
    (total, q) => total + q.points,
    0
  );

  // Helper function to convert numbers to Bengali numerals
  const toBengaliNumeral = (num) =>
    String(num).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯".charAt(Number(d)));

  // Helper function to get Bengali month name for Gregorian date
  const getBengaliMonth = (month) => {
    const months = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর",
    ];
    return months[month];
  };

  // Helper function to get Bengali Hijri month name
  const getBengaliHijriMonth = (monthIndex) => {
    const hijriMonths = [
      "মুহাররম", // 0
      "সফর", // 1
      "রবিউল আউয়াল", // 2
      "রবিউস সানি", // 3
      "জমাদিউল আউয়াল", // 4
      "জমাদিউস সানি", // 5
      "রজব", // 6
      "শাবান", // 7
      "রমজান", // 8
      "শাওয়াল", // 9
      "জিলকদ", // 10
      "জিলহজ", // 11
    ];
    return hijriMonths[monthIndex] || "অজানা মাস";
  };

  // Format English (Gregorian) date
  const getEnglishDate = () => {
    const today = new Date();
    const day = toBengaliNumeral(today.getDate());
    const month = getBengaliMonth(today.getMonth());
    const year = toBengaliNumeral(today.getFullYear());
    return `${day} ${month}, ${year} ইং`;
  };

  // Format Arabic (Hijri) date
  const getHijriDate = () => {
    try {
      const day = moment().iDate();
      const monthIndex = moment().iMonth();
      const year = moment().iYear();
      return `${toBengaliNumeral(day)} ${getBengaliHijriMonth(
        monthIndex
      )}, ${toBengaliNumeral(year)} হিঃ`;
    } catch (error) {
      console.error("Error calculating Hijri date:", error);
      return "হিজরি তারিখ পাওয়া যায়নি";
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    const fetchTodayData = async () => {
      setIsLoading(true);
      try {
        const today = format(new Date(), "yyyy-MM-dd");
        const response = await axiosPublic.get("/amal_data_by_date", {
          params: {
            userEmail: user.email,
            date: today,
          },
        });

        const data = response.data;
        if (data && Object.keys(data).length > 0) {
          const fetchedAnswers = {};
          Object.entries(data.questions || {}).forEach(
            ([questionName, value]) => {
              const index = amalQuestions.findIndex(
                (q) => q.questionName === questionName
              );
              if (index !== -1) {
                fetchedAnswers[index] = value === "Yes";
              }
            }
          );

          setHasParticipatedToday(true);
          setTodayPoints(data.points?.totalPoints || 0);
          setAnswers(fetchedAnswers);
          setOriginalAnswers(fetchedAnswers);
          setPrayerValues(data.prayerValues || {});
          setShowResults(true);
        } else {
          setHasParticipatedToday(false);
          setTodayPoints(0);
          setAnswers({});
          setOriginalAnswers({});
          setPrayerValues({});
          setShowResults(false);
        }
      } catch (error) {
        console.error("Error fetching today’s data:", error);
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Failed to load today’s data",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayData();
  }, [user, axiosPublic]);

  const calculatePrayerPoints = () => {
    let total = 0;
    Object.entries(prayerValues).forEach(([prayer, values]) => {
      if (values.status === "congregation") total += 4;
      else if (values.status === "alone") total += 1;

      if (values.sunnah) {
        if (prayer === "dhuhr") total += 3;
        else total += 1;
      }

      if (prayer === "dhuhr" && values.nafl) total += 1;
    });
    return total;
  };

  const getSuggestions = () => {
    const suggestions = [];

    Object.entries(prayerValues).forEach(([prayer, values]) => {
      if (!values.status || values.status === "notPrayed") {
        suggestions.push(`${prayer} - এর সলাত আদায় করুন।`);
      }
      if (values.status !== "congregation") {
        suggestions.push(
          `${prayer} - এর সলাত জামাতের সাথে আদায়ের চেষ্টা করুন।`
        );
      }
      if (
        !values.sunnah &&
        (prayer === "fajr" || prayer === "dhuhr" || prayer === "maghrib")
      ) {
        suggestions.push(`${prayer} - এর সুন্নাত নামাজ আদায় করুন।`);
      }
    });

    Object.entries(answers).forEach(([index, completed]) => {
      if (!completed && amalQuestions[index]) {
        const question = amalQuestions[index];
        if (question.category === "কুরআন তেলাওয়াত") {
          suggestions.push("কুরআন তেলাওয়াত করুন।");
        }
        if (question.category === "সকাল সন্ধ্যা জিকির") {
          suggestions.push("আপনার সকাল সন্ধ্যা যিকর গুলো করুন।");
        }
      }
    });

    return suggestions.slice(0, 5);
  };

  const handleAnswer = (completed) => {
    if (currentQuestion === 0) {
      goToNextQuestion();
      return;
    }

    setAnswers({
      ...answers,
      [currentQuestion]: completed,
    });

    const isLastQuestion = currentQuestion === amalQuestions.length - 1;
    if (!isLastQuestion) {
      setIsTransitioning(true);
      setSelectedOption(completed);
      setTimeout(() => {
        goToNextQuestion();
        setIsTransitioning(false);
        setSelectedOption(null);
      }, 500);
    }
  };

  const handlePrayerValueChange = (prayer, field, value) => {
    setPrayerValues((prev) => ({
      ...prev,
      [prayer]: {
        ...prev[prayer],
        [field]: value,
      },
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < amalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const regularPoints = Object.entries(answers).reduce(
      (total, [questionIndex, completed]) => {
        return total + (completed ? amalQuestions[questionIndex].points : 0);
      },
      0
    );

    const answeringDate = format(new Date(), "yyyy-MM-dd");
    const userInformation = {
      userEmail: user?.email,
      name: user?.displayName,
      date: answeringDate,
    };

    const prayerPoints = calculatePrayerPoints();
    const totalPoints = regularPoints + prayerPoints;

    const allAnswerInfo = {
      questions: Object.entries(answers).reduce(
        (acc, [questionIndex, completed]) => {
          const question = amalQuestions[questionIndex];
          acc[question.questionName] = completed ? "Yes" : "No";
          return acc;
        },
        {}
      ),
      prayerValues: { ...prayerValues },
      userInformation,
      points: {
        regularPoints,
        prayerPoints,
        totalPoints,
      },
    };

    try {
      const res = await axiosPublic.post("/amal_data", allAnswerInfo);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: res.data.message || "Your daily Amal has been saved!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTodayPoints(totalPoints);
      setShowResults(true);
      setHasParticipatedToday(true);
      setIsEditing(false);
      setOriginalAnswers(answers);
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Failed to save data",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const handleCancel = () => {
    if (isEditing) {
      setAnswers(originalAnswers);
      setIsEditing(false);
      setShowResults(true);
    } else {
      setAnswers({});
      setPrayerValues({});
      setCurrentQuestion(0);
    }
  };

  const getPerformanceMessage = (points) => {
    const percentage = (points / totalPossiblePoints) * 100;

    if (percentage >= 95) {
      return {
        message: "মাশাআল্লাহ! আপনি খুব ভালো করেছেন।",
        className: "text-green-600",
      };
    } else if (percentage >= 90) {
      return {
        message: "আরও চেষ্টা করুন, আপনি পারবেন ইনশাআল্লাহ।",
        className: "text-blue-600",
      };
    } else if (percentage >= 85) {
      return {
        message: "সতর্কবার্তা: আপনাকে আরও মনোযোগী হতে হবে।",
        className: "text-yellow-600",
      };
    } else {
      return {
        message: "আপনি ভুল পথে আছেন, দয়া করে আপনার ঈমানের দিকে মনোযোগ দিন।",
        className: "text-red-600",
      };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
          <div className="w-12 h-12 border-4 border-islamic border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-islamic">Loading...</p>
        </div>
      </div>
    );
  }

  if (hasParticipatedToday && !isEditing) {
    const { message, className } = getPerformanceMessage(todayPoints);
    const suggestions = getSuggestions();

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
          <div className="flex justify-end mb-3">
            <button
              onClick={handleEdit}
              className="flex items-center text-islamic hover:text-islamic-dark text-sm"
            >
              <HiPencil className="w-4 h-4 mr-1" />
              এডিট করুন
            </button>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-islamic mb-3">
            আজকের আমল সম্পন্ন হয়েছে
          </h2>
          <p className="text-base sm:text-lg mb-3">
            {getEnglishDate()} | {getHijriDate()}
          </p>
          <p className="text-base sm:text-lg mb-3">
            আপনার প্রাপ্ত নম্বর:{" "}
            <span className="font-bold">
              {todayPoints}/{totalPossiblePoints}
            </span>
          </p>
          <p className={`text-sm sm:text-base font-semibold ${className} mb-3`}>
            {message}
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="bg-islamic-light/10 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <HiLightBulb className="w-6 h-6 text-islamic mr-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-islamic">
                You need to improve these Amals
              </h3>
            </div>
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-2 mr-2 bg-islamic rounded-full"></span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const question = amalQuestions[currentQuestion];
  const isAnswered = answers[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === amalQuestions.length - 1;
  const allQuestionsAnswered =
    Object.keys(answers).length === amalQuestions.length - 1;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div
        className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 relative ${
          isTransitioning ? "filter blur-[1px] opacity40 bg-white/30" : ""
        }`}
      >
        {isTransitioning && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-6 h-6 border-2 border-islamic border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
            <span className="text-xs sm:text-sm text-primary-600">
              প্রশ্ন {currentQuestion + 1} / {amalQuestions.length}
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  isAnswered
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {isAnswered ? "উত্তর দেওয়া হয়েছে" : "উত্তর দেওয়া হয়নি"}
              </span>
              <span className="text-xs sm:text-sm text-primary-600">
                {question.category}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-islamic">
              {question.question}
            </h2>
            <button
              onClick={() => {
                setSelectedAmal(question);
                setShowDetailsModal(true);
              }}
              disabled={isTransitioning}
              className={`ml-2 text-islamic hover:text-islamic-dark ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <HiInformationCircle className="w-5 h-5" />
            </button>
          </div>

          {currentQuestion === 0 && (
            <div className="mt-4">
              <PrayerBreakdown
                values={prayerValues}
                onChange={handlePrayerValueChange}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center space-x-2">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0 || isTransitioning}
            className={`p-2 rounded-full ${
              currentQuestion === 0 || isTransitioning
                ? "text-gray-300 cursor-not-allowed"
                : "text-islamic hover:bg-islamic-light/10"
            }`}
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>

          {currentQuestion !== 0 && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => handleAnswer(true)}
                disabled={isTransitioning}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  (isAnswered && answers[currentQuestion]) ||
                  (isTransitioning && selectedOption === true)
                    ? "bg-green-600 text-white"
                    : "btn-primary"
                } ${isTransitioning ? "cursor-not-allowed" : ""}`}
              >
                সম্পন্ন করেছি
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={isTransitioning}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  (isAnswered && !answers[currentQuestion]) ||
                  (isTransitioning && selectedOption === false)
                    ? "bg-red-600 text-white"
                    : "btn-secondary"
                } ${isTransitioning ? "cursor-not-allowed" : ""}`}
              >
                সম্পন্ন করি নি
              </button>
            </div>
          )}

          <button
            onClick={goToNextQuestion}
            disabled={
              currentQuestion === amalQuestions.length - 1 || isTransitioning
            }
            className={`p-2 rounded-full ${
              currentQuestion === amalQuestions.length - 1 || isTransitioning
                ? "text-gray-300 cursor-not-allowed"
                : "text-islamic hover:bg-islamic-light/10"
            }`}
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6">
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div
              className="bg-islamic rounded-full h-2 transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) / amalQuestions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          {(Object.keys(answers).length > 0 ||
            Object.keys(prayerValues).length > 0) && (
            <button
              onClick={handleCancel}
              disabled={isTransitioning}
              className={`px-3 py-1.5 text-sm rounded-md btn-secondary ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              বাতিল করুন
            </button>
          )}
          {allQuestionsAnswered && (
            <button
              onClick={handleSubmit}
              disabled={isTransitioning}
              className={`px-3 py-1.5 text-sm rounded-md btn-primary ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              জমা দিন
            </button>
          )}
        </div>
      </div>

      <AmalDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        amal={selectedAmal}
      />
    </div>
  );
}

export default DailyTracker;
