/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import PointingBanner from "./PointingBanner";
import { DailyTrackerContext } from "../../context/DailyTrackerContext";
import useAmalData from "../../hooks/useAmalData";

const DailyTracker = () => {
  const {
    handleRadioChange,
    handleCheckboxChange,
    answers,
    setAnswers,
    salahData,
    naflSalahQuestions,
    zikrQuestions,
    quranQuestions,
    preSleepQuestions,
    additionalQuestions,
    allAmals,
    handleSubmit,
  } = useContext(DailyTrackerContext);
  const { amalData, isLoading, error, amalDataRefetch, isFetching } =
    useAmalData();

  return (
    <div className="relative min-h-screen">
      {/* Main content with conditional opacity */}
      <div
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        {/* Banner section for point counting */}
        <PointingBanner />

        {/* Questions section */}
        <section className="w-11/12 md:w-2/3 mx-auto my-8 relative">
          {/* Question category -> সলাত */}
          <div className="mb-12">
            <h2 className="text-islamic dark:text-islamic-light text-2xl font-bold mb-6 font-arabic tracking-tight">
              সলাত
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salahData.map((salah) => (
                <div
                  key={salah.name}
                  className="card bg-gradient-to-r from-primary-50 to-islamic-light dark:from-primary-900 dark:to-islamic border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
                >
                  <div className="card-body p-6">
                    <h3 className="card-title text-islamic dark:text-islamic-light text-lg mb-4">
                      {salah.title}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {/* Radio buttons for main Salah */}
                      {salah.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="radio"
                            name={`${salah.name}-main`}
                            value={option.value}
                            checked={answers[salah.name].main === option.value}
                            onChange={() =>
                              handleRadioChange(
                                salah.name,
                                "main",
                                option.value
                              )
                            }
                            className="radio radio-primary"
                            disabled={isLoading} // Disable inputs during loading
                          />
                          <span className="text-primary-900 dark:text-primary-100 font-arabic">
                            {option.label}
                          </span>
                        </label>
                      ))}
                      {/* Checkboxes for Sunnah/Nafl/Witr */}
                      {salah.checkboxes.map((checkbox) => (
                        <label
                          key={checkbox.field}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="checkbox"
                            checked={answers[salah.name][checkbox.field]}
                            onChange={() =>
                              handleCheckboxChange(salah.name, checkbox.field)
                            }
                            className="checkbox checkbox-primary"
                            disabled={isLoading} // Disable inputs during loading
                          />
                          <span className="text-primary-900 dark:text-primary-100 font-arabic">
                            {checkbox.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question category -> নফল সলাত */}
          <div className="mb-12">
            <h2 className="text-islamic dark:text-islamic-light text-2xl font-bold mb-6 font-arabic tracking-tight">
              নফল সলাত
            </h2>
            <div className="card bg-gradient-to-r from-primary-50 to-islamic-light dark:from-primary-900 dark:to-islamic border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <div className="card-body p-6">
                <h3 className="card-title text-islamic dark:text-islamic-light text-lg mb-4">
                  নফল সলাত
                </h3>
                <div className="flex flex-col gap-3">
                  {naflSalahQuestions.map((question) => (
                    <label
                      key={question.field}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={answers.naflSalah[question.field]}
                        onChange={() =>
                          handleCheckboxChange("naflSalah", question.field)
                        }
                        className="checkbox checkbox-primary"
                        disabled={isLoading} // Disable inputs during loading
                      />
                      <span className="text-primary-900 dark:text-primary-100 font-arabic">
                        {question.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Question category -> জিকির */}
          <div className="mb-12">
            <h2 className="text-islamic dark:text-islamic-light text-2xl font-bold mb-6 font-arabic tracking-tight">
              জিকির
            </h2>
            <div className="card bg-gradient-to-r from-primary-50 to-islamic-light dark:from-primary-900 dark:to-islamic border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <div className="card-body p-6">
                <h3 className="card-title text-islamic dark:text-islamic-light text-lg mb-4">
                  জিকির
                </h3>
                <div className="flex flex-col gap-3">
                  {zikrQuestions.map((question) => (
                    <label
                      key={question.field}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={answers.zikr[question.field]}
                        onChange={() =>
                          handleCheckboxChange("zikr", question.field)
                        }
                        className="checkbox checkbox-primary"
                        disabled={isLoading} // Disable inputs during loading
                      />
                      <span className="text-primary-900 dark:text-primary-100 font-arabic">
                        {question.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Question category -> কুরআন তেলাওয়াত */}
          <div className="mb-12">
            <h2 className="text-islamic dark:text-islamic-light text-2xl font-bold mb-6 font-arabic tracking-tight">
              কুরআন তেলাওয়াত
            </h2>
            <div className="card bg-gradient-to-r from-primary-50 to-islamic-light dark:from-primary-900 dark:to-islamic border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <div className="card-body p-6">
                <h3 className="card-title text-islamic dark:text-islamic-light text-lg mb-4">
                  কুরআন তেলাওয়াত
                </h3>
                <div className="flex flex-col gap-3">
                  {quranQuestions.map((question) => (
                    <label
                      key={question.field}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={answers.quran[question.field]}
                        onChange={() =>
                          handleCheckboxChange("quran", question.field)
                        }
                        className="checkbox checkbox-primary"
                        disabled={isLoading} // Disable inputs during loading
                      />
                      <span className="text-primary-900 dark:text-primary-100 font-arabic">
                        {question.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Question category -> ঘুমানোর আগে আমল */}
          <div className="mb-12">
            <h2 className="text-islamic dark:text-islamic-light text-2xl font-bold mb-6 font-arabic tracking-tight">
              ঘুমানোর আগে আমল
            </h2>
            <div className="card bg-gradient-to-r from-primary-50 to-islamic-light dark:from-primary-900 dark:to-islamic border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <div className="card-body p-6">
                <h3 className="card-title text-islamic dark:text-islamic-light text-lg mb-4">
                  ঘুমানোর আগে আমল
                </h3>
                <div className="flex flex-col gap-3">
                  {preSleepQuestions.map((question) => (
                    <label
                      key={question.field}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={answers.preSleep[question.field]}
                        onChange={() =>
                          handleCheckboxChange("preSleep", question.field)
                        }
                        className="checkbox checkbox-primary"
                        disabled={isLoading} // Disable inputs during loading
                      />
                      <span className="text-primary-900 dark:text-primary-100 font-arabic">
                        {question.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Question category -> অতিরিক্ত আমল */}
          <div className="mb-12">
            <h2 className="text-islamic dark:text-islamic-light text-2xl font-bold mb-6 font-arabic tracking-tight">
              অতিরিক্ত আমল
            </h2>
            <div className="card bg-gradient-to-r from-primary-50 to-islamic-light dark:from-primary-900 dark:to-islamic border border-primary-200 dark:border-primary-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <div className="card-body p-6">
                <h3 className="card-title text-islamic dark:text-islamic-light text-lg mb-4">
                  অতিরিক্ত আমল
                </h3>
                <div className="flex flex-col gap-3">
                  {additionalQuestions.map((question) => (
                    <label
                      key={question.field}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={answers.additional[question.field]}
                        onChange={() =>
                          handleCheckboxChange("additional", question.field)
                        }
                        className="checkbox checkbox-primary"
                        disabled={isLoading} // Disable inputs during loading
                      />
                      <span className="text-primary-900 dark:text-primary-100 font-arabic">
                        {question.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Save Button */}
          <button
            className="fixed bottom-4 right-4 btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform duration-200 z-50 font-arabic"
            onClick={handleSubmit}
            disabled={isLoading} // Disable button during loading
          >
            সংরক্ষণ করুন
          </button>
        </section>
      </div>

      {/* Loading overlay and spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-primary-500 border-primary-200 rounded-full animate-spin"></div>
            <span className="text-islamic-light text-lg font-arabic animate-pulse">
              লোড হচ্ছে...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTracker;
