import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import DailyTracker from "./pages/DailyTracker/DailyTracker.jsx";
import TrackerStatus from "./pages/TrackerStatus/TrackerStatus.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider, { useAuth } from "./context/AuthProvider.jsx";
import DailyTrackerProvider from "./context/DailyTrackerProvider.jsx";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function AppContent() {
  const { loading } = useAuth();

  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 islamic-pattern">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-islamic border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-islamic">Loading...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen islamic-pattern">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daily-tracker" element={<DailyTracker />} />
            <Route path="/tracker-status" element={<TrackerStatus />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DailyTrackerProvider>
          <AppContent />
        </DailyTrackerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
