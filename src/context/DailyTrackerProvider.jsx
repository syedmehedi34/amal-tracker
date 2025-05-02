/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { DailyTrackerContext } from "./DailyTrackerContext";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useAmalData from "../hooks/useAmalData";
import { useAuth } from "./AuthProvider";
import { useDateContext } from "./DateContext";

const DailyTrackerProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const { amalData, isLoading } = useAmalData();
  const { user } = useAuth();
  const { date, formatDate } = useDateContext();

  // Memoized default answers to ensure stability
  const defaultAnswers = useMemo(
    () => ({
      fajr: { main: "notAnswered", sunnah: false },
      zuhr: { main: "notAnswered", sunnah: false, nafl: false },
      asr: { main: "notAnswered" },
      maghrib: { main: "notAnswered", sunnah: false },
      isha: { main: "notAnswered", sunnah: false, witr: false },
      naflSalah: { tahajjud: false, duha: false },
      zikr: {
        tasbih33: false,
        ayatulKursi: false,
        morningEvening: false,
        subhanAllah100: false,
        sayyidulIstighfar: false,
        jannahDua: false,
        constantZikr: false,
      },
      quran: { dailyRecitation: false, tafsir: false, sirat: false },
      preSleep: { surahMulk: false },
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
    }),
    []
  );

  // Primary answers state
  const [answers, setAnswers] = useState(defaultAnswers);

  // Normalize date format for comparison
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr; // DD-MM-YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // YYYY-MM-DD
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    }
    console.warn("Unknown date format:", dateStr);
    return dateStr;
  };

  // Update answers when date changes
  useEffect(() => {
    const today = formatDate("DD-MM-YYYY");
    // console.log("DailyTrackerProvider useEffect triggered with today:", today);
    // console.log("Dependencies:", { isLoading, amalData, date: today });

    if (isLoading || !amalData) {
      // console.log("Resetting to defaultAnswers due to loading or no amalData");
      // Only update if answers differ to prevent infinite loop
      if (JSON.stringify(answers) !== JSON.stringify(defaultAnswers)) {
        setAnswers(defaultAnswers);
      }
      return;
    }

    const todayData = amalData.find((entry) => {
      const amalDate = normalizeDate(entry.info?.amalDate);
      // console.log("Comparing amalDate:", amalDate, "with today:", today);
      return amalDate === today;
    });

    // console.log("todayData:", todayData);

    if (!todayData) {
      // console.log("No data found for date, resetting to defaultAnswers");
      if (JSON.stringify(answers) !== JSON.stringify(defaultAnswers)) {
        setAnswers(defaultAnswers);
      }
      return;
    }

    const newAnswers = JSON.parse(JSON.stringify(defaultAnswers));

    const getRadioValue = (amalCode, point) => {
      const salah = salahData.find((s) => `${s.name}_main` === amalCode);
      if (!salah) return "notAnswered";
      const pointNum = parseInt(point);
      const option = salah.options.find((opt) => opt.point === pointNum);
      return option ? option.value : "notAnswered";
    };

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
      fajr_sunnah: "sunnah",
      zuhr_sunnah: "sunnah",
      maghrib_sunnah: "sunnah",
      isha_sunnah: "sunnah",
      zuhr_nafl: "nafl",
      isha_witr: "witr",
    };

    todayData.amalDetails.forEach((amal) => {
      const { amalCode, isDone, point, category } = amal;
      try {
        if (category === "salat") {
          const [salahName, field] = amalCode.split("_");
          if (field === "main") {
            newAnswers[salahName].main = getRadioValue(amalCode, point);
          } else if (field in newAnswers[salahName]) {
            newAnswers[salahName][field] = isDone;
          } else {
            console.warn(`Field ${field} not found in answers.${salahName}`);
          }
        } else {
          const field = fieldMap[amalCode];
          if (!field) {
            console.warn(`No field mapping for ${amalCode}`);
            return;
          }
          if (newAnswers[category] && field in newAnswers[category]) {
            newAnswers[category][field] = isDone;
          } else {
            console.warn(
              `Invalid category ${category} or field ${field} in answers`
            );
          }
        }
      } catch (err) {
        console.error(`Error processing ${amalCode}:`, err);
      }
    });

    // console.log("Computed newAnswers:", JSON.stringify(newAnswers, null, 2));
    // Only update if answers differ
    if (JSON.stringify(answers) !== JSON.stringify(newAnswers)) {
      // console.log("Setting new answers");
      setAnswers(newAnswers);
    } else {
      // console.log("No change in answers, skipping setAnswers");
    }
  }, [isLoading, amalData, date, defaultAnswers]);

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

  // Salah data with questions, points, and priorities
  const salahData = [
    {
      name: "fajr",
      title: "ফজর সলাত",
      priority: "salat",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 4 },
        { value: "alone", label: "একাকী আদায় করেছি", point: 1 },
        { value: "qaza", label: "কাজা আদায় করেছি", point: -5 },
        { value: "notDone", label: "আদায় করিনি", point: -20 },
      ],
      checkboxes: [
        {
          field: "sunnah",
          label: "সুন্নাত আদায় করেছি",
          point: 1,
          priority: "important",
        },
      ],
    },
    {
      name: "zuhr",
      title: "যোহর সলাত",
      priority: "salat",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 4 },
        { value: "alone", label: "একাকী আদায় করেছি", point: 1 },
        { value: "qaza", label: "কাজা আদায় করেছি", point: -5 },
        { value: "notDone", label: "আদায় করিনি", point: -20 },
      ],
      checkboxes: [
        {
          field: "sunnah",
          label: "সুন্নাত আদায় করেছি",
          point: 3,
          priority: "important",
        },
        { field: "nafl", label: "নফল আদায় করেছি", point: 1, priority: "low" },
      ],
    },
    {
      name: "asr",
      title: "আসর সলাত",
      priority: "salat",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 4 },
        { value: "alone", label: "একাকী আদায় করেছি", point: 1 },
        { value: "qaza", label: "কাজা আদায় করেছি", point: -5 },
        { value: "notDone", label: "আদায় করিনি", point: -20 },
      ],
      checkboxes: [],
    },
    {
      name: "maghrib",
      title: "মাগরিব সলাত",
      priority: "salat",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 4 },
        { value: "alone", label: "একাকী আদায় করেছি", point: 1 },
        { value: "qaza", label: "কাজা আদায় করেছি", point: -5 },
        { value: "notDone", label: "আদায় করিনি", point: -20 },
      ],
      checkboxes: [
        {
          field: "sunnah",
          label: "সুন্নাত আদায় করেছি",
          point: 2,
          priority: "important",
        },
      ],
    },
    {
      name: "isha",
      title: "এশা সলাত",
      priority: "salat",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 4 },
        { value: "alone", label: "একাকী আদায় করেছি", point: 1 },
        { value: "qaza", label: "কাজা আদায় করেছি", point: -5 },
        { value: "notDone", label: "আদায় করিনি", point: -20 },
      ],
      checkboxes: [
        {
          field: "sunnah",
          label: "সুন্নাত আদায় করেছি",
          point: 1,
          priority: "important",
        },
        {
          field: "witr",
          label: "বিতর আদায় করেছি",
          point: 2,
          priority: "important",
        },
      ],
    },
  ];

  // Nafl Salah questions with points and priorities
  const naflSalahQuestions = [
    {
      field: "tahajjud",
      label: "তাহাজ্জুদ আদায় করেছি",
      point: 5,
      priority: "normal",
    },
    {
      field: "duha",
      label: "সালাতুত দোহা আদায় করেছি",
      point: 1,
      priority: "normal",
    },
  ];

  // Zikr questions with points and priorities
  const zikrQuestions = [
    {
      field: "tasbih33",
      label: "৩৩+৩৩+৩৩+১ - জিকির পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "ayatulKursi",
      label: "আয়াতুল কুরসি পড়েছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "morningEvening",
      label: "সকাল সন্ধ্যা জিকির পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "subhanAllah100",
      label: "১০০ বার 'সুবহানাল্লাহি ওবি হামদিহি' পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "sayyidulIstighfar",
      label: "সাইয়েদুল ইস্তেগফার পড়েছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "jannahDua",
      label:
        "জান্নাতুল ফেরদৌসের জন্য দোয়া করেছি ও জাহান্নাম থেকে মুক্তির দোয়া করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "constantZikr",
      label: "সর্বক্ষণ জিকির, ইস্তেগফার করেছি",
      point: 3,
      priority: "normal",
    },
  ];

  // Quran questions with points and priorities
  const quranQuestions = [
    {
      field: "dailyRecitation",
      label: "প্রতিদিন নির্দিষ্ট অংশ তেলাওয়াত করেছি",
      point: 8,
      priority: "important",
    },
    {
      field: "tafsir",
      label: "তেলাওয়াতকৃত অংশের ব্যাখ্যা পড়েছি",
      point: 2,
      priority: "important",
    },
    {
      field: "sirat",
      label: "সিরাত পঠন করেছি",
      point: 2,
      priority: "important",
    },
  ];

  // Pre-Sleep questions with points and priorities
  const preSleepQuestions = [
    {
      field: "surahMulk",
      label: "রাতে সূরা মুলক তেলাওয়াত করেছি",
      point: 5,
      priority: "important",
    },
  ];

  // Additional questions with points and priorities
  const additionalQuestions = [
    {
      field: "avoidMajorSins",
      label: "কবিরা গুনাহ করিনি",
      point: 5,
      priority: "normal",
    },
    {
      field: "halalFood",
      label: "হালাল খাওয়া খেয়েছি",
      point: 5,
      priority: "normal",
    },
    {
      field: "avoidZina",
      label: "জেনা থেকে বেঁচে থেকেছি",
      point: 3,
      priority: "normal",
    },
    {
      field: "keepTrust",
      label: "আমানত ও অঙ্গীকার রক্ষা করেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "seekForgiveness",
      label: "সারাদিনের কৃতকর্মের জন্য মাফ চেয়েছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "avoidBackbiting",
      label: "গিবত করিনি",
      point: 2,
      priority: "normal",
    },
    {
      field: "avoidEnvy",
      label: "হিংসা থেকে বেঁচে থেকেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "avoidLying",
      label: "মিথ্যা বলিনি",
      point: 2,
      priority: "normal",
    },
    {
      field: "charity",
      label: "দান সাদাকা করেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "voluntaryFasting",
      label: "নফল রোজা রেখেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "goodBehavior",
      label: "কারোর সাথে বাজে আচরণ করিনি",
      point: 1,
      priority: "normal",
    },
    {
      field: "kalimaAfterWudu",
      label: "অজুর পর কালিমা শাহাদাত পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "avoidUseless",
      label: "অহেতুক কাজ করিনি",
      point: 1,
      priority: "normal",
    },
    {
      field: "respondAdhan",
      label: "আজানের উত্তর দিয়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "coverAwrah",
      label: "সর্বদা সতর ঢেকে রেখেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "helpOthers",
      label: "কাউকে সাহায্য করেছি/পানি পান করিয়েছি/মানসিক সাহায্য করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "removeHarm",
      label: "রাস্তা থেকে ক্ষতিকর বস্তু সরিয়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "goodAdvice",
      label: "সৎ উপদেশ দিয়েছি/ভালো কথা বলেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "giveSalam",
      label: "সালাম দিয়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "rememberAkhirah",
      label: "সর্বদা আখিরাতের কথা স্মরণ রেখেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "duaProphet",
      label: "জান্নাতে রাসুলুল্লাহ (সাঃ) এর কাছাকাছি থাকার দোয়া করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "constantWudu",
      label: "সর্বদা অজুর সাথে থেকেছি / অজুর সলাত আদায় করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "sleepWakeAmal",
      label: "ঘুমাতে যাওয়ার আগের এবং ঘুম থেকে উঠে আমল করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "dawah",
      label: "দ্বীনের দাওয়াত দিয়েছি",
      point: 1,
      priority: "normal",
    },
  ];

  // Memoized unified amal data
  const allAmals = useMemo(
    () => [
      // Salah main [মূল সালাত]
      ...salahData.map((salah) => ({
        amalName: salah.title,
        amalCode: `${salah.name}_main`,
        category: "salat",
        priority: salah.priority,
        isDone: () =>
          answers[salah.name].main !== "notAnswered" &&
          answers[salah.name].main !== "notDone",
        getPoints: () => {
          const selectedOption = salah.options.find(
            (opt) => opt.value === answers[salah.name].main
          );
          return selectedOption ? selectedOption.point : 0;
        },
        isSunnah: () => answers[salah.name].sunnah || false,
        isNafl: () => answers[salah.name].nafl || false,
      })),
      // Salah sunnah [সুন্নাত সালাত]
      ...salahData
        .filter((salah) => salah.checkboxes.some((cb) => cb.field === "sunnah"))
        .map((salah) => {
          const sunnahCheckbox = salah.checkboxes.find(
            (cb) => cb.field === "sunnah"
          );
          return {
            amalName: `${salah.title} - সুন্নাত`,
            amalCode: `${salah.name}_sunnah`,
            category: "salat",
            priority: sunnahCheckbox.priority,
            isDone: () => answers[salah.name].sunnah,
            getPoints: () =>
              answers[salah.name].sunnah && sunnahCheckbox
                ? sunnahCheckbox.point
                : 0,
            isSunnah: () => true,
            isNafl: () => false,
          };
        }),
      // Salah nafl [যোহরের নফল সলাত]
      {
        amalName: "যোহর সলাত - নফল",
        amalCode: "zuhr_nafl",
        category: "salat",
        priority: salahData
          .find((s) => s.name === "zuhr")
          .checkboxes.find((cb) => cb.field === "nafl").priority,
        isDone: () => answers.zuhr.nafl,
        getPoints: () => {
          const naflCheckbox = salahData
            .find((s) => s.name === "zuhr")
            .checkboxes.find((cb) => cb.field === "nafl");
          return answers.zuhr.nafl && naflCheckbox ? naflCheckbox.point : 0;
        },
        isSunnah: () => false,
        isNafl: () => true,
      },
      // Salah witr [বিতর সালাত]
      {
        amalName: "এশা সলাত - বিতর",
        amalCode: "isha_witr",
        category: "salat",
        priority: salahData
          .find((s) => s.name === "isha")
          .checkboxes.find((cb) => cb.field === "witr").priority,
        isDone: () => answers.isha.witr,
        getPoints: () => {
          const naflCheckbox = salahData
            .find((s) => s.name === "isha")
            .checkboxes.find((cb) => cb.field === "witr");
          return answers.isha.witr && naflCheckbox ? naflCheckbox.point : 0;
        },
        isSunnah: () => false,
        isNafl: () => false,
      },
      // Nafl Salah [তাহাজ্জুদ & সালাতুত দোহা]
      ...naflSalahQuestions.map((q) => ({
        amalName: q.label,
        amalCode: `naflSalah_${q.field}`,
        category: "naflSalah",
        priority: q.priority,
        isDone: () => answers.naflSalah[q.field],
        getPoints: () => (answers.naflSalah[q.field] ? q.point : 0),
      })),
      // Zikr
      ...zikrQuestions.map((q) => ({
        amalName: q.label,
        amalCode: `zikr_${q.field}`,
        category: "zikr",
        priority: q.priority,
        isDone: () => answers.zikr[q.field],
        getPoints: () => (answers.zikr[q.field] ? q.point : 0),
      })),
      // Quran
      ...quranQuestions.map((q) => ({
        amalName: q.label,
        amalCode: `quran_${q.field}`,
        category: "quran",
        priority: q.priority,
        isDone: () => answers.quran[q.field],
        getPoints: () => (answers.quran[q.field] ? q.point : 0),
      })),
      // Pre-Sleep
      ...preSleepQuestions.map((q) => ({
        amalName: q.label,
        amalCode: `preSleep_${q.field}`,
        category: "preSleep",
        priority: q.priority,
        isDone: () => answers.preSleep[q.field],
        getPoints: () => (answers.preSleep[q.field] ? q.point : 0),
      })),
      // Additional
      ...additionalQuestions.map((q) => ({
        amalName: q.label,
        amalCode: `additional_${q.field}`,
        category: "additional",
        priority: q.priority,
        isDone: () => answers.additional[q.field],
        getPoints: () => (answers.additional[q.field] ? q.point : 0),
      })),
    ],
    [
      answers,
      salahData,
      naflSalahQuestions,
      zikrQuestions,
      quranQuestions,
      preSleepQuestions,
      additionalQuestions,
    ]
  );

  // Handle form submission
  const handleSubmit = async () => {
    const amalDate = formatDate("DD-MM-YYYY");
    const today = formatDate("DD-MM-YYYY");
    if (amalDate > today) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Cannot submit for future dates",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

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

  const contextValue = useMemo(
    () => ({
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
    }),
    [
      answers,
      salahData,
      naflSalahQuestions,
      zikrQuestions,
      quranQuestions,
      preSleepQuestions,
      additionalQuestions,
      allAmals,
    ]
  );

  return (
    <DailyTrackerContext.Provider value={contextValue}>
      {children}
    </DailyTrackerContext.Provider>
  );
};

export default DailyTrackerProvider;
