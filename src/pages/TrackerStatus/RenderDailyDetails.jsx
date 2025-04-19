/* eslint-disable react/prop-types */
import { format, parse, isValid } from "date-fns";

const RenderDailyDetails = ({
  dailyDetails,
  selectedDate,
  totalPossiblePoints,
}) => {
  // console.log(dailyDetails);
  const parsedDate = parse(selectedDate, "dd-MM-yyyy", new Date());
  const displayDate = isValid(parsedDate)
    ? format(parsedDate, "MMMM d, yyyy")
    : "Invalid Date";

  if (!dailyDetails.length) {
    return (
      <div className="text-center text-gray-600 py-4 text-sm">
        No data available for {displayDate}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dailyDetails.map((details, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-islamic mb-3">
            Entry {index + 1} - {displayDate}
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

            <h4 className="font-semibold text-islamic text-sm mt-3">
              Other Amals:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {details.answers.length ? (
                details.answers.map((amal, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg text-sm ${
                      amal.isDone ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <p
                      className={`${
                        amal.isDone ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {amal.amalCode.charAt(0).toUpperCase() +
                        amal.amalCode.slice(1).toLowerCase()}{" "}
                      ({amal.point} point{amal.point !== 1 ? "s" : ""})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No other amals recorded</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderDailyDetails;
