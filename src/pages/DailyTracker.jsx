/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { amalQuestions } from "../data/amalQuestions";
import { format } from "date-fns";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPencil,
  HiInformationCircle,
} from "react-icons/hi";
// import { useAuth } from "../context/AuthContext";
import AmalDetailsModal from "../components/AmalDetailsModal";
import PrayerBreakdown from "../components/PrayerBreakdown";
import { useAuth } from "../context/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

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
  const { user } = useAuth();

  const totalPossiblePoints = amalQuestions.reduce(
    (total, q) => total + q.points,
    0
  );

  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const savedData = localStorage.getItem(`amal_${today}_${user?.email}`);

    if (savedData) {
      const data = JSON.parse(savedData);
      setHasParticipatedToday(true);
      setTodayPoints(data.totalPoints);
      setAnswers(data.answers);
      setOriginalAnswers(data.answers);
      setPrayerValues(data.prayerValues || {});
    }
  }, [user]);

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

  const handleAnswer = (completed) => {
    if (currentQuestion === 0) {
      goToNextQuestion();
      return;
    }

    setAnswers({
      ...answers,
      [currentQuestion]: completed,
    });
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

  // todo :
  const axiosPublic = useAxiosPublic();
  const handleSubmit = async () => {
    const regularPoints = Object.entries(answers).reduce(
      (total, [questionIndex, completed]) => {
        return total + (completed ? amalQuestions[questionIndex].points : 0);
      },
      0
    );

    // take the date and user info for storing
    const answeringDate = format(new Date(), "yyyy-MM-dd");
    const userInformation = {
      userEmail: user?.email,
      name: user?.displayName,
      date: answeringDate,
    };

    const prayerPoints = calculatePrayerPoints();
    const totalPoints = regularPoints + prayerPoints;

    // Create a single object with all answers
    const allAnswerInfo = {
      questions: Object.entries(answers).reduce(
        (acc, [questionIndex, completed]) => {
          const question = amalQuestions[questionIndex];
          // todo:need to change the id as questionName
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

    // Log the combined answers object
    console.log(allAnswerInfo);

    //? send the allAnswerInfo to the server
    try {
      const res = await axiosPublic.post("/amal_data", allAnswerInfo);
      console.log("Response:", res.data);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Your daily Amal has been saved!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Something wrong!",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    //?

    const today = format(new Date(), "yyyy-MM-dd");
    localStorage.setItem(
      `amal_${today}_${user?.email}`,
      JSON.stringify({
        answers,
        prayerValues,
        totalPoints,
        date: today,
      })
    );

    setTodayPoints(totalPoints);
    setShowResults(true);
    setHasParticipatedToday(true);
    setIsEditing(false);
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

  if (hasParticipatedToday && !isEditing) {
    const { message, className } = getPerformanceMessage(todayPoints);
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 text-center">
          <div className="flex justify-end mb-3">
            <button
              onClick={handleEdit}
              className="flex items-center text-islamic hover:text-islamic-dark text-sm"
            >
              <HiPencil className="w-4 h-4 mr-1" />
              পুনরায় জমা দিন
            </button>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-islamic mb-3">
            আজকের আমল সম্পন্ন হয়েছে
          </h2>
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
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
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
              className="ml-2 text-islamic hover:text-islamic-dark"
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
            disabled={currentQuestion === 0}
            className={`p-2 rounded-full ${
              currentQuestion === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-islamic hover:bg-islamic-light/10"
            }`}
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>

          {currentQuestion !== 0 && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  handleAnswer(true);
                  if (!isLastQuestion) {
                    goToNextQuestion();
                  }
                }}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  isAnswered && answers[currentQuestion]
                    ? "bg-green-600 text-white"
                    : "btn-primary"
                }`}
              >
                সম্পন্ন করেছি
              </button>
              <button
                onClick={() => {
                  handleAnswer(false);
                  if (!isLastQuestion) {
                    goToNextQuestion();
                  }
                }}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  isAnswered && !answers[currentQuestion]
                    ? "bg-red-600 text-white"
                    : "btn-secondary"
                }`}
              >
                সম্পন্ন করি নি
              </button>
            </div>
          )}

          <button
            onClick={goToNextQuestion}
            disabled={currentQuestion === amalQuestions.length - 1}
            className={`p-2 rounded-full ${
              currentQuestion === amalQuestions.length - 1
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
              className="px-3 py-1.5 text-sm rounded-md btn-secondary"
            >
              বাতিল করুন
            </button>
          )}
          {allQuestionsAnswered && !isEditing && (
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 text-sm rounded-md btn-primary"
            >
              জমা দিন
            </button>
          )}
          {allQuestionsAnswered && isEditing && (
            <>
              <button
                onClick={handleSubmit}
                className="px-3 py-1.5 text-sm rounded-md btn-primary"
              >
                জমা দিন
              </button>
              {/* <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm rounded-md btn-secondary"
              >
                বাতিল করুন
              </button> */}
            </>
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
