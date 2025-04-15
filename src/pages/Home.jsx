import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import useAmalData from "../hooks/useAmalData";
// import { useAuth } from "../context/AuthContext";

const quotes = [
  {
    text: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
    source: "Surah An-Nisa [4:103]",
    type: "quran",
  },
  {
    text: "Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.",
    source: "Sahih Muslim",
    type: "hadith",
  },
  {
    text: "The best among you is the one who learns the Quran and teaches it.",
    source: "Sahih Al-Bukhari",
    type: "hadith",
  },
];

function Home() {
  const { user } = useAuth();
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const { amalData } = useAmalData();
  console.log(amalData);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-islamic mb-4">
          Track Your Daily Islamic Practices
        </h1>
        <p className="text-lg text-primary-600">
          Build better habits and strengthen your connection with Allah
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center">
          <p className="text-xl italic mb-4">{randomQuote.text}</p>
          <p className="text-islamic font-semibold">{randomQuote.source}</p>
        </div>
      </div>

      {!user && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold mb-4">
            Start Your Journey Today
          </h2>
          <div className="space-x-4">
            <Link to="/register" className="btn-primary">
              Create Account
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      )}

      {user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/daily-tracker"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold text-islamic mb-2">
              Daily Tracker
            </h3>
            <p className="text-primary-600">
              Track your daily prayers, Quran reading, and other Islamic
              practices
            </p>
          </Link>
          <Link
            to="/tracker-status"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold text-islamic mb-2">
              View Progress
            </h3>
            <p className="text-primary-600">
              Check your progress and track your spiritual journey
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
