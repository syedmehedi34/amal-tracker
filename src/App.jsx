// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar.jsx";
// import Home from "./pages/Home.jsx";
// import DailyTracker from "./pages/DailyTracker";
// import TrackerStatus from "./pages/TrackerStatus";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AuthProvider from "./context/AuthProvider.jsx";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen islamic-pattern">
//           <Navbar />
//           <main className="container mx-auto px-4 py-8">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/daily-tracker" element={<DailyTracker />} />
//               <Route path="/tracker-status" element={<TrackerStatus />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//             </Routes>
//           </main>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import DailyTracker from "./pages/DailyTracker";
import TrackerStatus from "./pages/TrackerStatus";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider from "./context/AuthProvider.jsx";
import { useAuth } from "./context/AuthProvider.jsx";

// Child component to handle content rendering
function AppContent() {
  const { loading } = useAuth();

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 islamic-pattern">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-islamic border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-islamic">Loading...</p>
      </div>
    </div>
  );

  // If loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // Once loading is complete, show the app
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
