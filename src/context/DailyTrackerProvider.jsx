/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { DailyTrackerContext } from "./DailyTrackerContext";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useAmalData from "../hooks/useAmalData";
import { useAuth } from "./AuthProvider";

const DailyTrackerProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const { amalData, isLoading, error, amalDataRefetch } = useAmalData();
  const { user } = useAuth();

  // Get today's date in DD-MM-YYYY format
  const today = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .split("/")
    .join("-");

  // Handle radio button changes for Salah
  const handleRadioChange = (category, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  // Handle checkbox changes for Nafl Salah, Zikr, Quran, Pre-Sleep, Additional
  const handleCheckboxChange = (category, field) => {
    setAnswers((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: !prev[category][field] },
    }));
  };

  // ! [new question need to add here] Primary answers state
  const [answers, setAnswers] = useState({
    fajr: { main: "", sunnah: false },
    zuhr: { main: "", sunnah: false, nafl: false },
    asr: { main: "" },
    maghrib: { main: "", sunnah: false },
    isha: { main: "", sunnah: false, witr: false },
    naflSalah: {
      tahajjud: false,
      duha: false,
    },
    zikr: {
      tasbih33: false,
      ayatulKursi: false,
      morningEvening: false,
      subhanAllah100: false,
      sayyidulIstighfar: false,
      jannahDua: false,
      constantZikr: false,
    },
    quran: {
      dailyRecitation: false,
      tafsir: false,
      sirat: false,
    },
    preSleep: {
      surahMulk: false,
    },
    additional: {
      avoidMajorSins: false,
      halalFood: false,
      avoidZina: false,
      keepTrust: false,
      seekForgiveness: false,
      avoidBackbiting: false,
      avoidEnvy: false,
      avoidLying: false,
      charity: false,
      voluntaryFasting: false,
      goodBehavior: false,
      kalimaAfterWudu: false,
      avoidUseless: false,
      respondAdhan: false,
      coverAwrah: false,
      helpOthers: false,
      removeHarm: false,
      goodAdvice: false,
      giveSalam: false,
      rememberAkhirah: false,
      duaProphet: false,
      constantWudu: false,
      sleepWakeAmal: false,
      dawah: false,
    },
  });

  // Initialize answers from amalData
  useEffect(() => {
    if (isLoading || !amalData) {
      // console.log("Waiting for amalData, isLoading:", isLoading);
      return;
    }

    // console.log("Processing amalData for date:", today);
    const todayData = amalData.find((entry) => entry.info?.amalDate === today);

    if (!todayData) {
      // console.log(`No amalData found for ${today}, keeping default answers`);
      return;
    }

    // Create a new answers object
    const newAnswers = JSON.parse(JSON.stringify(answers)); // Deep copy

    // Helper to map point to radio button value
    const getRadioValue = (amalCode, point) => {
      const map = pointMap[amalCode];
      if (!map || typeof map !== "object") {
        // console.warn(`No valid pointMap for ${amalCode}`);
        return "";
      }
      const pointNum = parseInt(point);
      const value =
        Object.keys(map).find((key) => map[key] === pointNum) || "notDone";
      // console.log(`Mapped ${amalCode} point ${point} to value ${value}`);
      return value;
    };

    // ! [new question need to add here] Field mapping for non-salat categories
    const fieldMap = {
      naflSalah_tahajjud: "tahajjud",
      naflSalah_duha: "duha",
      zikr_tasbih33: "tasbih33",
      zikr_ayatulKursi: "ayatulKursi",
      zikr_morningEvening: "morningEvening",
      zikr_subhanAllah100: "subhanAllah100",
      zikr_sayyidulIstighfar: "sayyidulIstighfar",
      zikr_jannahDua: "jannahDua",
      zikr_constantZikr: "constantZikr",
      quran_dailyRecitation: "dailyRecitation",
      quran_tafsir: "tafsir",
      quran_sirat: "sirat",
      preSleep_surahMulk: "surahMulk",
      additional_avoidMajorSins: "avoidMajorSins",
      additional_halalFood: "halalFood",
      additional_avoidZina: "avoidZina",
      additional_keepTrust: "keepTrust",
      additional_seekForgiveness: "seekForgiveness",
      additional_avoidBackbiting: "avoidBackbiting",
      additional_avoidEnvy: "avoidEnvy",
      additional_avoidLying: "avoidLying",
      additional_charity: "charity",
      additional_voluntaryFasting: "voluntaryFasting",
      additional_goodBehavior: "goodBehavior",
      additional_kalimaAfterWudu: "kalimaAfterWudu",
      additional_avoidUseless: "avoidUseless",
      additional_respondAdhan: "respondAdhan",
      additional_coverAwrah: "coverAwrah",
      additional_helpOthers: "helpOthers",
      additional_removeHarm: "removeHarm",
      additional_goodAdvice: "goodAdvice",
      additional_giveSalam: "giveSalam",
      additional_rememberAkhirah: "rememberAkhirah",
      additional_duaProphet: "duaProphet",
      additional_constantWudu: "constantWudu",
      additional_sleepWakeAmal: "sleepWakeAmal",
      additional_dawah: "dawah",
    };

    // ! [new question may need to customize here] Process amalDetails
    todayData.amalDetails.forEach((amal) => {
      const { amalCode, isDone, point, category } = amal;

      try {
        if (category === "salat") {
          const [salahName, field] = amalCode.split("_");

          if (field === "main") {
            newAnswers[salahName].main = getRadioValue(amalCode, point);
          } else {
            if (field in newAnswers[salahName]) {
              newAnswers[salahName][field] = isDone;
              // console.log(`Set ${salahName}.${field} = ${isDone}`);
            } else {
              console.warn(`Field ${field} not found in answers.${salahName}`);
            }
          }
        } else {
          const field = fieldMap[amalCode];
          if (!field) {
            console.warn(`No field mapping for ${amalCode}`);
            return;
          }
          if (newAnswers[category] && field in newAnswers[category]) {
            newAnswers[category][field] = isDone;
            // console.log(`Set ${category}.${field} = ${isDone}`);
          } else {
            // console.warn(
            //   `Invalid category ${category} or field ${field} in answers`
            // );
          }
        }
      } catch (err) {
        // console.error(`Error processing ${amalCode}:`, err);
      }
    });

    // console.log("Updated answers:", JSON.stringify(newAnswers, null, 2));
    setAnswers(newAnswers);
  }, [amalData, isLoading]);

  // ! [new question need to add here its point] All point distribution
  const pointMap = {
    fajr_main: { jamaat: 4, alone: 1, qaza: -5, notDone: -20 },
    zuhr_main: { jamaat: 4, alone: 1, qaza: -5, notDone: -20 },
    asr_main: { jamaat: 4, alone: 1, qaza: -5, notDone: -20 },
    maghrib_main: { jamaat: 4, alone: 1, qaza: -5, notDone: -20 },
    isha_main: { jamaat: 4, alone: 1, qaza: -5, notDone: -20 },
    fajr_sunnah: 1,
    zuhr_sunnah: 3,
    maghrib_sunnah: 2,
    isha_sunnah: 1,
    zuhr_nafl: 1,
    isha_witr: 2,
    naflSalah_tahajjud: 5,
    naflSalah_duha: 1,
    zikr_tasbih33: 1,
    zikr_ayatulKursi: 2,
    zikr_morningEvening: 1,
    zikr_subhanAllah100: 1,
    zikr_sayyidulIstighfar: 2,
    zikr_jannahDua: 1,
    zikr_constantZikr: 3,
    quran_dailyRecitation: 8,
    quran_tafsir: 2,
    quran_sirat: 2,
    preSleep_surahMulk: 5,
    additional_avoidMajorSins: 5,
    additional_halalFood: 5,
    additional_avoidZina: 3,
    additional_keepTrust: 2,
    additional_seekForgiveness: 2,
    additional_avoidBackbiting: 2,
    additional_avoidEnvy: 2,
    additional_avoidLying: 2,
    additional_charity: 2,
    additional_voluntaryFasting: 2,
    additional_goodBehavior: 1,
    additional_kalimaAfterWudu: 1,
    additional_avoidUseless: 1,
    additional_respondAdhan: 1,
    additional_coverAwrah: 1,
    additional_helpOthers: 1,
    additional_removeHarm: 1,
    additional_goodAdvice: 1,
    additional_giveSalam: 1,
    additional_rememberAkhirah: 1,
    additional_duaProphet: 1,
    additional_constantWudu: 1,
    additional_sleepWakeAmal: 1,
    additional_dawah: 1,
  };

  // ! [new salah question need to add here] Salah data with questions
  const salahData = [
    {
      name: "fajr",
      title: "ফজর সলাত",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি" },
        { value: "alone", label: "একাকী আদায় করেছি" },
        { value: "qaza", label: "কাজা আদায় করেছি" },
        { value: "notDone", label: "আদায় করিনি" },
      ],
      checkboxes: [{ field: "sunnah", label: "সুন্নাত আদায় করেছি" }],
    },
    {
      name: "zuhr",
      title: "যোহর সলাত",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি" },
        { value: "alone", label: "একাকী আদায় করেছি" },
        { value: "qaza", label: "কাজা আদায় করেছি" },
        { value: "notDone", label: "আদায় করিনি" },
      ],
      checkboxes: [
        { field: "sunnah", label: "সুন্নাত আদায় করেছি" },
        { field: "nafl", label: "নফল আদায় করেছি" },
      ],
    },
    {
      name: "asr",
      title: "আসর সলাত",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি" },
        { value: "alone", label: "একাকী আদায় করেছি" },
        { value: "qaza", label: "কাজা আদায় করেছি" },
        { value: "notDone", label: "আদায় করিনি" },
      ],
      checkboxes: [],
    },
    {
      name: "maghrib",
      title: "মাগরিব সলাত",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি" },
        { value: "alone", label: "একাকী আদায় করেছি" },
        { value: "qaza", label: "কাজা আদায় করেছি" },
        { value: "notDone", label: "আদায় করিনি" },
      ],
      checkboxes: [{ field: "sunnah", label: "সুন্নাত আদায় করেছি" }],
    },
    {
      name: "isha",
      title: "এশা সলাত",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি" },
        { value: "alone", label: "একাকী আদায় করেছি" },
        { value: "qaza", label: "কাজা আদায় করেছি" },
        { value: "notDone", label: "আদায় করিনি" },
      ],
      checkboxes: [
        { field: "sunnah", label: "সুন্নাত আদায় করেছি" },
        { field: "witr", label: "বিতর আদায় করেছি" },
      ],
    },
  ];

  // Nafl Salah questions
  const naflSalahQuestions = [
    { field: "tahajjud", label: "তাহাজ্জুদ আদায় করেছি" },
    { field: "duha", label: "সালাতুত দোহা আদায় করেছি" },
  ];

  // Zikr questions
  const zikrQuestions = [
    { field: "tasbih33", label: "৩৩+৩৩+৩৩+১ - জিকির পড়েছি" },
    { field: "ayatulKursi", label: "আয়াতুল কুরসি পড়েছি  " },
    { field: "morningEvening", label: "সকাল সন্ধ্যা জিকির পড়েছি  " },
    {
      field: "subhanAllah100",
      label: "১০০ বার 'সুবহানাল্লাহি ওবি হামদিহি' পড়েছি",
    },
    { field: "sayyidulIstighfar", label: "সাইয়েদুল ইস্তেগফার পড়েছি  " },
    {
      field: "jannahDua",
      label:
        "জান্নাতুল ফেরদৌসের জন্য দোয়া করেছি ও জাহান্নাম থেকে মুক্তির দোয়া করেছি  ",
    },
    {
      field: "constantZikr",
      label: "সর্বক্ষণ জিকির, ইস্তেগফার ও দুরুদ পড়েছি",
    },
  ];

  // Quran questions
  const quranQuestions = [
    {
      field: "dailyRecitation",
      label: "প্রতিদিন নির্দিষ্ট অংশ নায়েরা করেছি  ",
    },
    { field: "tafsir", label: "নায়েরা কৃত অংশের ব্যাখ্যা পড়েছি" },
    { field: "sirat", label: "সিরাত পঠন করেছি" },
  ];

  // Pre-Sleep questions
  const preSleepQuestions = [
    { field: "surahMulk", label: "রাতে সূরা মুলক তেলাওয়া করেছি  " },
  ];

  // Additional questions
  const additionalQuestions = [
    { field: "avoidMajorSins", label: "কবিরা গুনাহ করিনি  " },
    { field: "halalFood", label: "হালাল খাওয়া খেয়েছি  " },
    { field: "avoidZina", label: "জেনা থেকে বেঁচে থেকেছি  " },
    { field: "keepTrust", label: "আমানত ও অঙ্গীকার রক্ষা করেছি  " },
    {
      field: "seekForgiveness",
      label: "সারাদিনের কৃতকর্মের জন্য মাফ চেয়েছি  ",
    },
    { field: "avoidBackbiting", label: "গিবত করিনি  " },
    { field: "avoidEnvy", label: "হিংসা থেকে বেঁচে থেকেছি  " },
    { field: "avoidLying", label: "মিথ্যা বলিনি  " },
    { field: "charity", label: "দান সাদাকা করেছি" },
    { field: "voluntaryFasting", label: "নফল রোজা রেখেছি" },
    { field: "goodBehavior", label: "কারোর সাথে বাজে আচরণ করিনি  " },
    {
      field: "kalimaAfterWudu",
      label: "অজুর পর কালিমা শাহাদাত পড়েছি  ",
    },
    { field: "avoidUseless", label: "অহেতুক কাজ করিনি" },
    { field: "respondAdhan", label: "আজানের উত্তর দিয়েছি" },
    { field: "coverAwrah", label: "সর্বদা সতর ঢেকে রেখেছি" },
    {
      field: "helpOthers",
      label: "কাউকে সাহায্য করেছি/পানি পান করিয়েছি/মানসিক সাহায্য করেছি",
    },
    { field: "removeHarm", label: "রাস্তা থেকে ক্ষতিকর বস্তু সরিয়েছি" },
    { field: "goodAdvice", label: "সৎ উপদেশ দিয়েছি/ভালো কথা বলেছি" },
    { field: "giveSalam", label: "সালাম দিয়েছি" },
    { field: "rememberAkhirah", label: "সর্বদা আখিরাতের কথা স্মরণ রেখেছি" },
    {
      field: "duaProphet",
      label: "জান্নাতে রাসুলুল্লাহ (সাঃ) এর কাছাকাছি থাকার দোয়া করেছি",
    },
    {
      field: "constantWudu",
      label: "সর্বদা অজুর সাথে থেকেছি / অজুর সলাত আদায় করেছি",
    },
    {
      field: "sleepWakeAmal",
      label: "ঘুমাতে যাওয়ার আগের এবং ঘুম থেকে উঠে আমল করেছি  ",
    },
    { field: "dawah", label: "দ্বীনের দাওয়াত দিয়েছি" },
  ];

  //! [new data may needs updating this section] Unified amal data
  const allAmals = [
    // Salah main [মূল সালাত]
    ...salahData.map((salah) => ({
      amalName: salah.title,
      amalCode: `${salah.name}_main`,
      category: "salat",
      priority: "salat",
      isDone: () => (answers[salah.name].main ? true : "notAnswered"),
      getPoints: () =>
        pointMap[`${salah.name}_main`][answers[salah.name].main] || 0,
      isSunnah: () => answers[salah.name].sunnah || false,
      isNafl: () => answers[salah.name].nafl || false,
    })),
    // Salah sunnah [সুন্নাত সালাত]
    ...salahData
      .filter((salah) => salah.checkboxes.some((cb) => cb.field === "sunnah"))
      .map((salah) => ({
        amalName: `${salah.title} - সুন্নাত`,
        amalCode: `${salah.name}_sunnah`,
        category: "salat",
        priority: "important",
        isDone: () => answers[salah.name].sunnah,
        getPoints: () =>
          answers[salah.name].sunnah ? pointMap[`${salah.name}_sunnah`] : 0,
        isSunnah: () => true,
        isNafl: () => false,
      })),
    // Salah nafl [যোহরের নফল সলাত]
    {
      amalName: "যোহর সলাত - নফল",
      amalCode: "zuhr_nafl",
      category: "salat",
      priority: "low",
      isDone: () => answers.zuhr.nafl,
      getPoints: () => (answers.zuhr.nafl ? pointMap.zuhr_nafl : 0),
      isSunnah: () => false,
      isNafl: () => true,
    },
    // Salah witr [বিতর সালাত]
    {
      amalName: "এশা সলাত - বিতর",
      amalCode: "isha_witr",
      category: "salat",
      priority: "important",
      isDone: () => answers.isha.witr,
      getPoints: () => (answers.isha.witr ? pointMap.isha_witr : 0),
      isSunnah: () => false,
      isNafl: () => false,
    },
    // Nafl Salah [তাহাজ্জুদ & সালাতুত দোহা]
    ...naflSalahQuestions.map((q) => ({
      amalName: q.label,
      amalCode: `naflSalah_${q.field}`,
      category: "naflSalah",
      priority: "normal",
      isDone: () => answers.naflSalah[q.field],
      getPoints: () =>
        answers.naflSalah[q.field] ? pointMap[`naflSalah_${q.field}`] : 0,
    })),
    // Zikr []
    ...zikrQuestions.map((q) => ({
      amalName: q.label,
      amalCode: `zikr_${q.field}`,
      category: "zikr",
      priority: "normal",
      isDone: () => answers.zikr[q.field],
      getPoints: () =>
        answers.zikr[q.field] ? pointMap[`zikr_${q.field}`] : 0,
    })),
    // Quran
    ...quranQuestions.map((q) => ({
      amalName: q.label,
      amalCode: `quran_${q.field}`,
      category: "quran",
      priority: "important",
      isDone: () => answers.quran[q.field],
      getPoints: () =>
        answers.quran[q.field] ? pointMap[`quran_${q.field}`] : 0,
    })),
    // Pre-Sleep
    ...preSleepQuestions.map((q) => ({
      amalName: q.label,
      amalCode: `preSleep_${q.field}`,
      category: "preSleep",
      priority: "important",
      isDone: () => answers.preSleep[q.field],
      getPoints: () =>
        answers.preSleep[q.field] ? pointMap[`preSleep_${q.field}`] : 0,
    })),
    // Additional
    ...additionalQuestions.map((q) => ({
      amalName: q.label,
      amalCode: `additional_${q.field}`,
      category: "additional",
      priority: "normal",
      isDone: () => answers.additional[q.field],
      getPoints: () =>
        answers.additional[q.field] ? pointMap[`additional_${q.field}`] : 0,
    })),
  ];

  // Handle form submission
  const handleSubmit = async () => {
    const amalDate = new Date()
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");

    const amalDetails = allAmals.map((amal) => ({
      amalName: amal.amalName,
      amalCode: amal.amalCode,
      point: amal.getPoints().toString(),
      priority: amal.priority,
      isDone: amal.isDone(),
      category: amal.category,
    }));

    const totalObtainedPoints = amalDetails.reduce(
      (sum, amal) => sum + parseInt(amal.point || 0),
      0
    );

    const dailyAmalData = {
      amalDetails,
      info: {
        userEmail: user?.email,
        userName: user?.displayName,
        totalObtainedPoints,
        amalDate,
      },
    };

    try {
      const res = await axiosPublic.post("/amal_data", dailyAmalData);
      amalDataRefetch();
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message || "Your daily Amal has been saved!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to save data",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const contextValue = {
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
  };

  return (
    <DailyTrackerContext.Provider value={contextValue}>
      {children}
    </DailyTrackerContext.Provider>
  );
};

export default DailyTrackerProvider;
