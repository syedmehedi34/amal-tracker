import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
// import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Mock login - In a real app, this would be an API call
    if (formData.email && formData.password) {
      login({
        name: formData.email.split("@")[0],
        email: formData.email,
      });
      navigate("/daily-tracker");
    } else {
      setError("Please fill in all fields");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-islamic mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-islamic focus:ring focus:ring-islamic focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-islamic focus:ring focus:ring-islamic focus:ring-opacity-50"
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
