/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import GoogleLogin from "./GoogleLogin";
import useAxiosPublic from "../../hooks/useAxiosPublic";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { createNewUser, signInWithGoogle, updateUser } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // function to generate a unique username
  function generateUniqueUsername(fullName) {
    const namePart = fullName.toLowerCase().replace(/\s+/g, "");
    const timestamp = Date.now().toString();
    const randomNum = timestamp;
    return `${namePart}_${randomNum}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Create a new user with email and password
    const userCredential = await createNewUser(
      formData.email,
      formData.password
    );
    const user = userCredential.user;
    await updateUser({ displayName: formData.name });

    const userName = generateUniqueUsername(formData.name);
    // send data to the server
    const response = await axiosPublic.post("/users", {
      name: formData.name,
      userName,
      email: formData.email,
    });

    console.log(response.data);

    // Redirect to a different page after successful registration
    navigate("/");
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

          <GoogleLogin
            handleGoogleLogin={handleGoogleLogin}
            text="Sign up with Google"
          ></GoogleLogin>
        </div>
      </div>
    </div>
  );
}

export default Register;
