import { HiInformationCircle } from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

const UpdateYourAmal = () => {
  return (
    <div className="mt-8">
      <div className="flex items-center mb-4">
        <HiOutlineExclamationTriangle className="w-5 h-5 text-islamic dark:text-islamic-light mr-2" />
        <h3 className="text-lg font-semibold text-islamic dark:text-islamic-light">
          Areas Needing Attention
        </h3>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <tbody>
            {[
              {
                question: "Sample Amal",
                category: "সলাত",
                missedCount: 5,
                totalDays: 30,
              },
              {
                question: "Sample Amal",
                category: "সলাত",
                missedCount: 5,
                totalDays: 30,
              },
              {
                question: "Sample Amal",
                category: "সলাত",
                missedCount: 5,
                totalDays: 30,
              },
              {
                question: "Sample Amal",
                category: "সলাত",
                missedCount: 5,
                totalDays: 30,
              },
            ].map((amal, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200 dark:border-gray-700 ${
                  index === 0 ? "border-b0" : ""
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {amal.question}
                    </span>
                    <button
                      onClick={() => {}}
                      className="text-islamic dark:text-islamic-light hover:text-islamic-dark dark:hover:text-islamic transition-colors"
                      title="View details"
                    >
                      <HiInformationCircle className="w-4 h-4" />
                    </button>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300`}
                    >
                      {amal.category}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Missed {amal.missedCount}/{amal.totalDays}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdateYourAmal;
