import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { createNewUser, signInWithGoogle, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Create a new user with email and password
      const userCredential = await createNewUser(
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Update user profile with name
      await updateUser({ displayName: formData.name });

      console.log("Form submitted:", formData);
      console.log("User registered:", user);

      // Redirect to a different page after successful registration
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      // Map Firebase error codes to user-friendly messages
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters long.");
          break;
        default:
          setError("Registration failed. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log("Google login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-islamic dark:text-islamic-light mb-6 text-center">
          Create Your Account
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-primary-600 dark:text-primary-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-primary-300 dark:border-primary-700 bg-white dark:bg-gray-700 text-primary-900 dark:text-primary-100 shadow-sm focus:border-islamic dark:focus:border-islamic-light focus:ring focus:ring-islamic dark:focus:ring-islamic-light focus:ring-opacity-50"
              required
            />
          </div>

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
            Create Account
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

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-islamic dark:focus:ring-islamic-light focus:ring-opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.29 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.56 7.73 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.73 1 4.01 3.44 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
