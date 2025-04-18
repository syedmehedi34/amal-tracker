/* eslint-disable react/prop-types */
const prayers = {
  fajr: {
    name: "Fajr (Morning Prayer)",
    options: {
      congregation: { label: "Prayed in congregation", points: 4 },
      alone: { label: "Prayed alone", points: 1 },
      notPrayed: { label: "Not prayed", points: -20 },
      sunnah: { label: "Sunnah prayed", points: 1 },
    },
  },
  dhuhr: {
    name: "Dhuhr (Noon Prayer)",
    options: {
      congregation: { label: "Prayed in congregation", points: 4 },
      alone: { label: "Prayed alone", points: 1 },
      notPrayed: { label: "Not prayed", points: 0 },
      sunnah: { label: "Sunnah prayed", points: 3 },
      nafl: { label: "Nafl (extra) prayer prayed", points: 1 },
    },
  },
  asr: {
    name: "Asr (Afternoon Prayer)",
    options: {
      congregation: { label: "Prayed in congregation", points: 4 },
      alone: { label: "Prayed alone", points: 1 },
      notPrayed: { label: "Not prayed", points: 0 },
    },
  },
  maghrib: {
    name: "Maghrib (Evening Prayer)",
    options: {
      congregation: { label: "Prayed in congregation", points: 4 },
      alone: { label: "Prayed alone", points: 1 },
      notPrayed: { label: "Not prayed", points: 0 },
      sunnah: { label: "Sunnah prayed", points: 1 },
    },
  },
  isha: {
    name: "Isha (Night Prayer)",
    options: {
      congregation: { label: "Prayed in congregation", points: 4 },
      alone: { label: "Prayed alone", points: 1 },
      notPrayed: { label: "Not prayed", points: 0 },
      sunnah: { label: "Sunnah prayed", points: 1 },
    },
  },
};

function PrayerBreakdown({ values, onChange }) {
  return (
    <div className="space-y-4">
      {Object.entries(prayers).map(([prayerKey, prayer]) => (
        <div
          key={prayerKey}
          className="bg-white rounded-lg p-3 sm:p-4 shadow-sm"
        >
          <h3 className="text-base sm:text-lg font-semibold text-islamic mb-2 sm:mb-3">
            {prayer.name}
          </h3>
          <div className="space-y-3">
            {/* Prayer Status */}
            <div className="mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Prayer Status:
              </p>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                {Object.entries(prayer.options)
                  .filter(([key]) =>
                    ["congregation", "alone", "notPrayed"].includes(key)
                  )
                  .map(([key, option]) => (
                    <label
                      key={key}
                      className="flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <input
                        type="radio"
                        name={`${prayerKey}-status`}
                        value={key}
                        checked={values[prayerKey]?.status === key}
                        onChange={(e) =>
                          onChange(prayerKey, "status", e.target.value)
                        }
                        className="form-radio text-islamic h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
              </div>
            </div>

            {/* Additional Options */}
            {["sunnah", "nafl"].map((optionKey) => {
              if (!prayer.options[optionKey]) return null;
              return (
                <div key={optionKey} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${prayerKey}-${optionKey}`}
                    checked={values[prayerKey]?.[optionKey] || false}
                    onChange={(e) =>
                      onChange(prayerKey, optionKey, e.target.checked)
                    }
                    className="form-checkbox text-islamic h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <label
                    htmlFor={`${prayerKey}-${optionKey}`}
                    className="text-sm sm:text-base text-gray-700"
                  >
                    {prayer.options[optionKey].label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PrayerBreakdown;
