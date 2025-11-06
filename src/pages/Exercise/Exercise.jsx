/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

const Exercise = () => {
  const [mode, setMode] = useState("slow");
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("ready");
  const [rep, setRep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [setComplete, setSetComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef(null);
  const audioContext = useRef(null);

  const HOLD_TIME = mode === "slow" ? 6 : 1;
  const RELAX_TIME = mode === "slow" ? 6 : 1;
  const TOTAL_REPS = 10;
  const CIRCUMFERENCE = 879;

  // Audio Setup
  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    return () => clearInterval(intervalRef.current);
  }, []);

  const playBeep = (freq = 800, duration = 200) => {
    if (!soundEnabled || !audioContext.current) return;
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    osc.start();
    osc.stop(audioContext.current.currentTime + duration / 1000);
  };

  const startExercise = () => {
    setIsRunning(true);
    setRep(0);
    setPhase("hold");
    setSecondsLeft(HOLD_TIME);
    setSetComplete(false);
    playBeep(600, 300);
  };

  const stopExercise = () => {
    setIsRunning(false);
    setPhase("ready");
    setRep(0);
    setSecondsLeft(0);
    clearInterval(intervalRef.current);
  };

  const resetExercise = () => {
    stopExercise();
    setSetComplete(false);
  };

  // PERFECT TIMER: 5→0, Single Beep
  useEffect(() => {
    if (!isRunning || phase === "ready") return;

    setSecondsLeft(phase === "hold" ? HOLD_TIME : RELAX_TIME);

    const tick = () => {
      setSecondsLeft((prev) => {
        // Play beep ONLY when 1 → 0
        if (prev === 1) {
          playBeep(phase === "hold" ? 900 : 700, 400);
        }

        if (prev === 0) {
          if (phase === "hold") {
            setPhase("relax");
            return RELAX_TIME;
          } else {
            setRep((r) => {
              const nextRep = r + 1;
              if (nextRep >= TOTAL_REPS) {
                setSetComplete(true);
                setIsRunning(false);
                setPhase("ready");
                playBeep(1200, 800);
                return TOTAL_REPS;
              }
              return nextRep;
            });
            setPhase("hold");
            return HOLD_TIME;
          }
        }
        return prev - 1;
      });
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, phase, mode, soundEnabled]);

  // Progress: Fill on Hold, Empty on Relax
  const progress =
    phase === "hold" ? 1 - secondsLeft / HOLD_TIME : secondsLeft / RELAX_TIME;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="min-h-screen bg-gray-50 islamic-pattern py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-islamic mb-3">
            Kegel Exercise
          </h1>
          <p className="text-gray-600 text-lg">
            Strengthen your pelvic floor with guided sessions
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex">
            {["slow", "quick"].map((m) => (
              <button
                key={m}
                onClick={() => !isRunning && setMode(m)}
                disabled={isRunning}
                className={`px-8 py-4 rounded-xl font-semibold capitalize transition-all ${
                  mode === m
                    ? "bg-islamic text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                } ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {m === "slow" ? "Slow Kegel" : "Quick Kegel"}
                <span className="block text-sm font-normal mt-1 opacity-80">
                  {m === "slow" ? "5s hold • 5s relax" : "1s hold • 1s relax"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex justify-center mb-12">
          <div className="relative w-72 h-72">
            <svg viewBox="0 0 300 300" className="-rotate-90">
              <circle
                cx="150"
                cy="150"
                r="140"
                stroke="#e5e7eb"
                strokeWidth="16"
                fill="none"
              />
              <motion.circle
                cx="150"
                cy="150"
                r="140"
                stroke="#1A5F4C"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.95, ease: "linear" }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {phase === "ready" && !setComplete && (
                  <motion.div
                    key="ready"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="text-center"
                  >
                    <p className="text-5xl font-bold text-islamic">Ready</p>
                    <p className="text-gray-500 mt-2 text-lg">Tap Start</p>
                  </motion.div>
                )}
                {(phase === "hold" || phase === "relax") && (
                  <motion.div
                    key={`${phase}-${secondsLeft}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="text-center"
                  >
                    <p
                      className={`text-9xl font-black tracking-tight ${
                        phase === "hold" ? "text-islamic" : "text-emerald-600"
                      }`}
                    >
                      {secondsLeft}
                    </p>
                    <p className="text-2xl font-medium text-gray-600 mt-2">
                      {phase === "hold" ? "Hold" : "Relax"}
                    </p>
                  </motion.div>
                )}
                {setComplete && (
                  <motion.div
                    key="complete"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                  >
                    <p className="text-6xl font-bold text-islamic">Complete!</p>
                    <p className="text-2xl text-gray-600 mt-3">MashaAllah!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Rep Counter */}
        <div className="text-center mb-10">
          <p className="text-2xl font-semibold text-gray-700">
            Rep {rep} / {TOTAL_REPS}
          </p>
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: TOTAL_REPS }, (_, i) => (
              <div
                key={i}
                className={`w-10 h-3 rounded-full transition-all duration-300 ${
                  i < rep ? "bg-islamic" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {!isRunning ? (
            <button
              onClick={startExercise}
              disabled={setComplete}
              className="bg-islamic hover:bg-islamic-dark text-white font-bold py-5 px-10 rounded-2xl shadow-xl flex items-center gap-3 text-xl transition-all hover:scale-105 disabled:opacity-50"
            >
              <Play size={28} /> Start
            </button>
          ) : (
            <button
              onClick={stopExercise}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-5 px-10 rounded-2xl shadow-xl flex items-center gap-3 text-xl transition-all hover:scale-105"
            >
              <Pause size={28} /> Pause
            </button>
          )}
          <button
            onClick={resetExercise}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-5 px-8 rounded-2xl shadow-xl flex items-center gap-2 text-xl transition-all"
          >
            <RotateCcw size={24} /> Reset
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-5 rounded-2xl shadow-xl"
          >
            {soundEnabled ? <Volume2 size={28} /> : <VolumeX size={28} />}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-islamic mb-4">
            How to Do Kegel
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-islamic font-bold">1.</span>
              <span>Tighten pelvic floor (like stopping urine)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-islamic font-bold">2.</span>
              <span>Hold when timer says "Hold"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-islamic font-bold">3.</span>
              <span>Relax fully when it says "Relax"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-islamic font-bold">4.</span>
              <span>Breathe normally</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
