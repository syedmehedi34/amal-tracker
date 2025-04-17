/* eslint-disable react/prop-types */
import { format, parseISO } from "date-fns";
import { amalQuestions } from "../../data/amalQuestions"; // Adjust path

const RenderDailyDetails = ({
  dailyDetails,
  selectedDate,
  totalPossiblePoints,
}) => {
  //
  if (!dailyDetails.length) {
    return (
      <div className="text-center text-gray-600 py-4 text-sm">
        No data available for this date
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dailyDetails.map((details, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-islamic mb-3">
            Entry {index + 1} - {format(parseISO(selectedDate), "MMMM d, yyyy")}
          </h3>
          <p className="text-base mb-2">
            Total Points:{" "}
            <span className="font-bold">{details.totalPoints}</span> /{" "}
            {totalPossiblePoints}
          </p>
          <div className="space-y-4">
            <h4 className="font-semibold text-islamic text-sm">
              Prayer Details:
            </h4>
            {Object.entries(details.prayerValues || {}).map(
              ([prayer, values]) => (
                <div key={prayer} className="ml-2">
                  <p className="font-medium text-sm">
                    {prayer.charAt(0).toUpperCase() + prayer.slice(1)}:
                  </p>
                  <ul className="ml-4 list-disc text-xs">
                    <li>Status: {values.status}</li>
                    {values.sunnah && <li>Sunnah prayed</li>}
                    {values.nafl && <li>Nafl prayed</li>}
                  </ul>
                </div>
              )
            )}

            <h4 className="font-semibold text-islamic text-sm mt-3">
              Other Amals:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(details.answers || {}).map(([key, value]) => {
                const question = amalQuestions.find((q) => q.id === key) || {
                  question: key,
                };
                return (
                  <div
                    key={key}
                    className={`p-2 rounded-lg text-sm ${
                      value === "Yes" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <p
                      className={`${
                        value === "Yes" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {question.question}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderDailyDetails;
