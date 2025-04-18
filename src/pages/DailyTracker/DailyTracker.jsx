/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import PointingBanner from "./PointingBanner";
import { DailyTrackerContext } from "../../context/DailyTrackerContext";

const DailyTracker = () => {
  const {
    handleRadioChange,
    handleCheckboxChange,
    answers,
    setAnswers,
    pointMap,
    salahData,
    naflSalahQuestions,
    zikrQuestions,
    quranQuestions,
    preSleepQuestions,
    additionalQuestions,
    allAmals,
    handleSubmit,
  } = useContext(DailyTrackerContext);

  return (
    <>
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
                className="card bg-gradient-to-r from-primary-50 to-islamic-light dark:from-primary-900 dark:to-islamic border border-primary-200 dark:border-primary-700 shadow-md cursor-pointer hover:shadow-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-all duration-300 rounded-xl font-arabic"
                onClick={() =>
                  document.getElementById(`modal-${salah.name}`).showModal()
                }
              >
                <div className="card-body p-5">
                  <h3 className="card-title text-islamic dark:text-islamic-light text-lg">
                    {salah.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Modals for each Salah */}
          {salahData.map((salah) => (
            <dialog
              key={salah.name}
              id={`modal-${salah.name}`}
              className="modal"
            >
              <div className="modal-box bg-white dark:bg-gray-800 max-w-sm font-arabic rounded-xl shadow-xl">
                <h3 className="text-xl font-bold text-islamic dark:text-islamic-light">
                  {salah.title}
                </h3>
                <div className="py-4 flex flex-col gap-3">
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
                          handleRadioChange(salah.name, "main", option.value)
                        }
                        className="radio radio-primary"
                      />
                      <span className="text-primary-900 dark:text-primary-100">
                        {option.label}
                      </span>
                    </label>
                  ))}
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
                      />
                      <span className="text-primary-900 dark:text-primary-100">
                        {checkbox.label}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="modal-action flex justify-end gap-2">
                  <form method="dialog">
                    <button className="btn btn-error btn-outline dark:btn-error dark:text-error dark:border-error hover:scale-105 transition-transform duration-200">
                      বাতিল
                    </button>
                  </form>
                  <form method="dialog">
                    <button
                      className="btn btn-primary hover:scale-105 transition-transform duration-200"
                      onClick={handleSubmit}
                    >
                      নিশ্চিত করুন
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          ))}
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
        >
          সংরক্ষণ করুন
        </button>
      </section>
    </>
  );
};

export default DailyTracker;
