/* eslint-disable react/prop-types */

function AmalDetailsModal({ isOpen, onClose, amal }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-2xl mx-auto flex flex-col max-h-[90vh]">
        <h2 className="text-lg sm:text-2xl font-bold text-islamic mb-3 sm:mb-4">
          {amal?.question}
        </h2>

        <div className="flex-1 overflow-y-auto mb-4 sm:mb-6 pr-2">
          <p className="text-gray-700 text-sm sm:text-base mb-2">
            <span className="font-semibold">Category:</span> {amal?.category}
          </p>
          <p className="text-gray-700 text-sm sm:text-base mb-2">
            <span className="font-semibold">Points:</span> {amal?.points}
          </p>
          {amal?.details && (
            <div className="mt-3 sm:mt-4">
              <h3 className="font-semibold text-islamic text-sm sm:text-base mb-2">
                Details:
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {amal?.details}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="btn-primary w-full px-3 py-1.5 text-sm sm:text-base rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AmalDetailsModal;
