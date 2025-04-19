import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import GoogleLogin from "./GoogleLogin";
import useAxiosPublic from "../../hooks/useAxiosPublic";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signInUser, signInWithGoogle } = useAuth();

  // function to generate a unique username
  const axiosPublic = useAxiosPublic();
  function generateUniqueUsername(fullName) {
    const namePart = fullName.toLowerCase().replace(/\s+/g, "");
    const timestamp = Date.now().toString();
    const randomNum = timestamp;
    return `${namePart}_${randomNum}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Sign in with email and password
      await signInUser(formData.email, formData.password);
      console.log("User logged in:", formData.email);
      navigate("/daily-tracker");
    } catch (err) {
      console.error("Login error:", err);
      // Map Firebase error codes to user-friendly messages
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // google login function
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;

      // Optionally, send data to your backend
      const userName = generateUniqueUsername(user?.displayName);
      const response = await axiosPublic.post("/users", {
        name: user?.displayName,
        userName,
        email: user?.email,
      });

      console.log(response.data);

      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-islamic dark:text-islamic-light mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary-600 dark:text-primary-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-700 text-primary-900 dark:text-primary-100 shadow-sm focus:border-islamic dark:focus:border-islamic-light focus:ring focus:ring-islamic dark:focus:ring-islamic-light focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary-600 dark:text-primary-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-700 text-primary-900 dark:text-primary-100 shadow-sm focus:border-islamic dark:focus:border-islamic-light focus:ring focus:ring-islamic dark:focus:ring-islamic-light focus:ring-opacity-50"
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                or
              </span>
            </div>
          </div>

          <GoogleLogin
            handleGoogleLogin={handleGoogleLogin}
            text="Sign in with Google"
          ></GoogleLogin>
        </div>
      </div>
    </div>
  );
}

export default Login;
