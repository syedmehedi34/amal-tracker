/* eslint-disable react-hooks/exhaustive-deps */
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
      naflSalah: {
        prayTahajjud: false, // তাহাজ্জুদ সলাত আদায় করেছি
        prayDoha: false, // সলাতুত দোহা আদায় করেছি
        prayIstikharaSalah: false, // ইস্তিখারার নামাজ পড়েছি
        praySalatutHajot: false, // সালাতুত হাজত আদায় করেছি
        prayTahiyatulMasjid: false, // তাহিয়াতুল মসজিদ আদায় করেছি
      },
      zikr: {
        salahTasbeeh33: false, // সলাতের পর "৩৩+৩৩+৩৩+১" - যিকির পড়েছি
        ayatulKursiAfterSalah: false, // ফরজ সলাতের পর আয়াতুল কুরসি পড়েছি
        morningEveningZikr: false, // সকাল সন্ধ্যা যিকির করেছি
        subhanAllah100: false, // সকাল সন্ধ্যা 'সুবহানাল্লাহি ওবি হামদিহি' - (১০০ বার) পড়েছি
        sayyidulIstighfar: false, // সাইয়েদুল ইস্তেগফারের আমল করেছি
        duaForJannahAndJahannam: false, // জান্নাতুল ফেরদৌসের দোয়া ও জাহান্নাম থেকে মুক্তির দোয়া করেছি
        istigfarZikrDurudEverytime: false, // সর্বক্ষণ দুরুদ, ইস্তেগফার ও অন্যান্য যিকির করেছি
        durudAtLeast100Times: false, // অন্তত ১০০ বার দুরুদ পড়েছি
        bestKalima100: false, // লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারিকালাহু লাহুল মুলকু....(১০০ বার)
        // todo: Add new zikr amal field here, e.g., surahIkhlas: false
        // Example: surahIkhlas: false,
      },
      quran: {
        quranNazira: false, // কুরআন নায়েরা করেছি
        quranTafsir: false, // কুরআনের ব্যাখ্যা  বা অর্থ পড়েছি
        studySirat: false, // সিরাত পাঠ করেছি
      },
      preSleep: {
        suraMulkAtNight: false, // রাতে সূরা মুলক তেলাওয়াত করেছি
      },
      additional: {
        avoidKabiraGunah: false, // কবিরা গুনাহ থেকে বেঁচে থেকেছি
        eatHalal: false, // হালাল খাবার খেয়েছি
        safeFromZina: false, // যেনা থেকে বেঁচে থেকেছি
        keepAmanatAndStatements: false, // আমানত ও অঙ্গীকার রক্ষা করেছি
        apologizeForFullDaySins: false, // সারাদিনের কৃতকর্মের জন্য মাফ চেয়েছি
        safeFromGibot: false, // গিবত থেকে বেঁচে থেকেছি
        safeFromHingsha: false, // হিংসা থেকে বেঁচে থেকেছি
        safeFromLie: false, // মিথ্যা থেকে বেঁচে থেকেছি
        giveSadaka: false, // দান সাদাকা করেছি
        naflSawm: false, // নফল রোজা রেখেছি
        goodAkhlakToEveryone: false, // সকলের প্রতি উত্তম আখলাক প্রদর্শন করেছি
        kalimaShahadahAfterOju: false, // অজুর পর কালিমা শাহাদাত পড়েছি
        avoidUselessWorks: false, // অহেতুক কোনো কাজ করিনি
        answerToAzan: false, // আজানের উত্তর দিয়েছি
        coverMyAwrahAlways: false, // সর্বদা সতর ঢেকে রেখেছি
        helpSomeone: false, // কাউকে সাহায্য করেছি/পানি পান করিয়েছি/মানসিক সাহায্য করেছি
        RemoveHarmsFromStreet: false, // রাস্তা থেকে ক্ষতিকর বস্তু সরিয়েছি
        goodAdviceAndGoodTalks: false, // সৎ উপদেশ দিয়েছি/ভালো কথা বলেছি
        giveSalam: false, // অন্তত ২০ জনকে সালাম দিয়েছি
        rememberAboutAkhiratAndDeath: false, // সর্বদা আখিরাত ও মৃত্যুর কথা স্মরণ রেখেছি
        duaForGettingJannahWithProphet: false, // জান্নাতে রাসুলুল্লাহ (সাঃ) এর কাছাকাছি থাকার দোয়া করেছি
        alwaysStayWithOju: false, // সর্বদা অজুর সাথে থেকেছি / অজুর সলাত আদায় করেছি
        amalForSleepingAndWakeUp: false, // ঘুমাতে যাওয়ার আগের এবং ঘুম থেকে উঠে আমল করেছি
        dawahSomeone: false, // দ্বীনের দাওয়াত দিয়েছি
        duaForShahadah: false, // শাহাদাতের মৃত্যুর জন্য দোয়া করেছি
        goodRelationWithRelatives: false, // অন্তত একজন আত্মীয়ের সাথে যোগাযোগ করেছি
        duaForOthers: false, // অন্যের জন্য গোপনে দোয়া করেছি
        careTheSickPeoples: false, // অসুস্থ ব্যাক্তির খোঁজ খবর নিয়েছি
      },
      // todo: For a new category, add a new key here, e.g., newCategory: { newAmal: false }
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

    if (isLoading || !amalData) {
      if (JSON.stringify(answers) !== JSON.stringify(defaultAnswers)) {
        setAnswers(defaultAnswers);
      }
      return;
    }

    const todayData = amalData.find((entry) => {
      const amalDate = normalizeDate(entry.info?.amalDate);
      return amalDate === today;
    });
    // console.log("todayData:", todayData);

    if (!todayData) {
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
      naflSalah_prayTahajjud: "prayTahajjud",
      naflSalah_prayDoha: "prayDoha",
      naflSalah_prayIstikharaSalah: "prayIstikharaSalah",
      naflSalah_praySalatutHajot: "praySalatutHajot",
      naflSalah_prayTahiyatulMasjid: "prayTahiyatulMasjid",

      zikr_salahTasbeeh33: "salahTasbeeh33",
      zikr_ayatulKursiAfterSalah: "ayatulKursiAfterSalah",
      zikr_morningEveningZikr: "morningEveningZikr",
      zikr_subhanAllah100: "subhanAllah100",
      zikr_sayyidulIstighfar: "sayyidulIstighfar",
      zikr_duaForJannahAndJahannam: "duaForJannahAndJahannam",
      zikr_istigfarZikrDurudEverytime: "istigfarZikrDurudEverytime",
      zikr_durudAtLeast100Times: "durudAtLeast100Times",
      zikr_bestKalima100: "bestKalima100",
      // todo: Add new amal mapping here, e.g., zikr_surahIkhlas: "surahIkhlas"
      // Example: zikr_surahIkhlas: "surahIkhlas",

      quran_quranNazira: "quranNazira",
      quran_quranTafsir: "quranTafsir",
      quran_studySirat: "studySirat",

      preSleep_suraMulkAtNight: "suraMulkAtNight",

      additional_avoidKabiraGunah: "avoidKabiraGunah",
      additional_eatHalal: "eatHalal",
      additional_safeFromZina: "safeFromZina",
      additional_keepAmanatAndStatements: "keepAmanatAndStatements",
      additional_apologizeForFullDaySins: "apologizeForFullDaySins",
      additional_safeFromGibot: "safeFromGibot",
      additional_safeFromHingsha: "safeFromHingsha",
      additional_safeFromLie: "safeFromLie",
      additional_giveSadaka: "giveSadaka",
      additional_naflSawm: "naflSawm",
      additional_goodAkhlakToEveryone: "goodAkhlakToEveryone",
      additional_kalimaShahadahAfterOju: "kalimaShahadahAfterOju",
      additional_avoidUselessWorks: "avoidUselessWorks",
      additional_answerToAzan: "answerToAzan",
      additional_coverMyAwrahAlways: "coverMyAwrahAlways",
      additional_helpSomeone: "helpSomeone",
      additional_RemoveHarmsFromStreet: "RemoveHarmsFromStreet",
      additional_goodAdviceAndGoodTalks: "goodAdviceAndGoodTalks",
      additional_giveSalam: "giveSalam",
      additional_rememberAboutAkhiratAndDeath: "rememberAboutAkhiratAndDeath",
      additional_duaForGettingJannahWithProphet:
        "duaForGettingJannahWithProphet",
      additional_alwaysStayWithOju: "alwaysStayWithOju",
      additional_amalForSleepingAndWakeUp: "amalForSleepingAndWakeUp",
      additional_dawahSomeone: "dawahSomeone",
      additional_duaForShahadah: "duaForShahadah",
      additional_goodRelationWithRelatives: "goodRelationWithRelatives",
      additional_duaForOthers: "duaForOthers",
      additional_careTheSickPeoples: "careTheSickPeoples",
      // todo: Add new amal mapping here, e.g., additional_surahIkhlas: "surahIkhlas"
      // Example: additional_surahIkhlas: "surahIkhlas",

      fajr_sunnah: "sunnah",
      zuhr_sunnah: "sunnah",
      maghrib_sunnah: "sunnah",
      isha_sunnah: "sunnah",
      zuhr_nafl: "nafl",
      isha_witr: "witr",
      // todo: For a new category, add mapping, e.g., newCategory_newAmal: "newAmal"
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
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 5 },
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
      name: "zuhr",
      title: "যোহর সলাত",
      priority: "salat",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 5 },
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
        { field: "nafl", label: "নফল আদায় করেছি", point: 1, priority: "low" },
      ],
    },
    {
      name: "asr",
      title: "আসর সলাত",
      priority: "salat",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 5 },
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
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 5 },
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
      name: "isha",
      title: "এশা সলাত",
      priority: "salat",
      options: [
        { value: "jamaat", label: "জামাতে আদায় করেছি", point: 5 },
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
      field: "prayTahajjud",
      label: "তাহাজ্জুদ সলাত আদায় করেছি",
      point: 3,
      priority: "normal",
    },
    {
      field: "prayDoha",
      label: "সলাতুত দোহা আদায় করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "prayIstikharaSalah",
      label: "ইস্তিখারার নামাজ পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "praySalatutHajot",
      label: "সালাতুত হাজত আদায় করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "prayTahiyatulMasjid",
      label: "তাহিয়াতুল মসজিদ আদায় করেছি",
      point: 1,
      priority: "normal",
    },
    // todo: Add new naflSalah amal here, e.g., { field: "newNafl", label: "নতুন নফল সালাত", point: 2, priority: "normal" }
  ];

  // Zikr questions with points and priorities
  const zikrQuestions = [
    {
      field: "salahTasbeeh33",
      label: "সলাতের পর “৩৩+৩৩+৩৩+১” - যিকির পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "ayatulKursiAfterSalah",
      label: "ফরজ সলাতের পর আয়াতুল কুরসি পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "morningEveningZikr",
      label: "সকাল সন্ধ্যা যিকির করেছি",
      point: 2, // ? may need change
      priority: "normal",
    },
    {
      field: "subhanAllah100",
      label: "সকাল সন্ধ্যা 'সুবহানাল্লাহি ওবি হামদিহি' - (১০০ বার) পড়েছি",
      point: 1, // ? may need change
      priority: "normal",
    },
    {
      field: "sayyidulIstighfar",
      label: "সাইয়েদুল ইস্তেগফারের আমল করেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "duaForJannahAndJahannam",
      label: "জান্নাতুল ফেরদৌসের দোয়া ও জাহান্নাম থেকে মুক্তির দোয়া করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "istigfarZikrDurudEverytime",
      label: "সর্বক্ষণ দুরুদ, ইস্তেগফার ও অন্যান্য যিকির করেছি",
      point: 3,
      priority: "normal",
    },
    {
      field: "durudAtLeast100Times",
      label: "অন্তত ১০০ বার দুরুদ পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "bestKalima100",
      label:
        "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারিকালাহু লাহুল মুলকু....(১০০ বার)",
      point: 2,
      priority: "normal",
    },
    // todo: Add new zikr amal here, e.g., { field: "surahIkhlas", label: "সূরা ইখলাস ৩ বার পড়েছি", point: 2, priority: "normal" }
    // Example: {
    //   field: "surahIkhlas",
    //   label: "সূরা ইখলাস ৩ বার পড়েছি",
    //   point: 2,
    //   priority: "normal",
    // },
  ];

  // Quran questions with points and priorities
  const quranQuestions = [
    {
      field: "quranNazira",
      label: "কুরআন নায়েরা করেছি",
      point: 5,
      priority: "important",
    },
    {
      field: "quranTafsir",
      label: "কুরআনের ব্যাখ্যা বা অর্থ পড়েছি",
      point: 2,
      priority: "important",
    },
    {
      field: "studySirat",
      label: "সিরাত পাঠ করেছি",
      point: 3,
      priority: "important",
    },
    // todo: Add new quran amal here, e.g., { field: "newQuran", label: "নতুন কুরআন আমল", point: 3, priority: "important" }
  ];

  // Pre-Sleep questions with points and priorities
  const preSleepQuestions = [
    {
      field: "suraMulkAtNight",
      label: "রাতে সূরা মুলক তেলাওয়াত করেছি",
      point: 2,
      priority: "important",
    },

    // todo: Add new preSleep amal here, e.g., { field: "newPreSleep", label: "নতুন প্রি-স্লিপ আমল", point: 2, priority: "important" }
  ];

  // Additional questions with points and priorities
  const additionalQuestions = [
    {
      field: "avoidKabiraGunah",
      label: "কবিরা গুনাহ থেকে বেঁচে থেকেছি",
      point: 3,
      priority: "normal",
    },
    {
      field: "eatHalal",
      label: "হালাল খাবার খেয়েছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "safeFromZina",
      label: "যেনা থেকে বেঁচে থেকেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "keepAmanatAndStatements",
      label: "আমানত ও অঙ্গীকার রক্ষা করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "apologizeForFullDaySins",
      label: "সারাদিনের কৃতকর্মের জন্য মাফ চেয়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "safeFromGibot",
      label: "গিবত থেকে বেঁচে থেকেছি",
      point: 3,
      priority: "normal",
    },
    {
      field: "safeFromHingsha",
      label: "হিংসা থেকে বেঁচে থেকেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "safeFromLie",
      label: "মিথ্যা থেকে বেঁচে থেকেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "giveSadaka",
      label: "দান সাদাকা করেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "naflSawm",
      label: "নফল রোজা রেখেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "goodAkhlakToEveryone",
      label: "সকলের প্রতি উত্তম আখলাক প্রদর্শন করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "kalimaShahadahAfterOju",
      label: "অজুর পর কালিমা শাহাদাত পড়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "avoidUselessWorks",
      label: "অহেতুক কোনো কাজ করিনি",
      point: 1,
      priority: "normal",
    },
    {
      field: "answerToAzan",
      label: "আজানের উত্তর দিয়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "coverMyAwrahAlways",
      label: "সর্বদা সতর ঢেকে রেখেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "helpSomeone",
      label: "কাউকে সাহায্য করেছি/পানি পান করিয়েছি/মানসিক সাহায্য করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "RemoveHarmsFromStreet",
      label: "রাস্তা থেকে ক্ষতিকর বস্তু সরিয়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "goodAdviceAndGoodTalks",
      label: "সৎ উপদেশ দিয়েছি/ভালো কথা বলেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "giveSalam",
      label: "অন্তত ২০ জনকে সালাম দিয়েছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "rememberAboutAkhiratAndDeath",
      label: "সর্বদা আখিরাত ও মৃত্যুর কথা স্মরণ রেখেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "duaForGettingJannahWithProphet",
      label: "জান্নাতে রাসুলুল্লাহ (সাঃ) এর কাছাকাছি থাকার দোয়া করেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "alwaysStayWithOju",
      label: "সর্বদা অজুর সাথে থেকেছি / অজুর সলাত আদায় করেছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "amalForSleepingAndWakeUp",
      label: "ঘুমাতে যাওয়ার আগের এবং ঘুম থেকে উঠে আমল করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "dawahSomeone",
      label: "দ্বীনের দাওয়াত দিয়েছি",
      point: 2,
      priority: "normal",
    },
    {
      field: "duaForShahadah",
      label: "শাহাদাতের মৃত্যুর জন্য দোয়া করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "goodRelationWithRelatives",
      label: "অন্তত একজন আত্মীয়ের সাথে যোগাযোগ করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "duaForOthers",
      label: "অন্যের জন্য গোপনে দোয়া করেছি",
      point: 1,
      priority: "normal",
    },
    {
      field: "careTheSickPeoples",
      label: "অসুস্থ ব্যাক্তির খোঁজ খবর নিয়েছি",
      point: 1,
      priority: "normal",
    },

    // todo: Add new additional amal here, e.g., { field: "newAdditional", label: "নতুন অতিরিক্ত আমল", point: 1, priority: "normal" }
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
      // todo: Add new amal for a new category here, e.g.,
      // ...newCategoryQuestions.map((q) => ({
      //   amalName: q.label,
      //   amalCode: `newCategory_${q.field}`,
      //   category: "newCategory",
      //   priority: q.priority,
      //   isDone: () => answers.newCategory[q.field],
      //   getPoints: () => (answers.newCategory[q.field] ? q.point : 0),
      // })),
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
    // control future date data submittion
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
      // todo: Add new category questions to contextValue, e.g., newCategoryQuestions
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
