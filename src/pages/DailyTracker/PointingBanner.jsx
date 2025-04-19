const PointingBanner = () => {
  return (
    <>
      <section className="w-11/12 md:w-2/3 mx-auto my-8 bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <h1 className="text-[#1B4242] text-2xl md:text-3xl font-bold mb-4">
            আপনার আজকের পয়েন্ট
          </h1>
          <p className="text-[#0F172A] text-lg md:text-xl">
            ১৮ এপ্রিল, ২০২৫ ইং | ২০ শাওয়াল, ১৪৪৬ হিঃ
          </p>
          <p className="text-[#0F172A] text-lg md:text-xl mt-4">
            আপনার প্রাপ্ত নম্বর:{" "}
            <span className="text-[#1B4242] font-bold">40/100</span>
          </p>
          <p className="text-[#DC2626] font-semibold mt-4">
            আপনি ভুল পথে আছেন, দয়া করে আপনার ঈমানের দিকে মনোযোগ দিন।
          </p>
        </div>
      </section>
    </>
  );
};

export default PointingBanner;
