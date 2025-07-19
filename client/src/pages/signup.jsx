import { useState } from "react";
import { API_BASE_URL } from "../config/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = (password) => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.]).{6,20}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, repeatPassword } = formData;

    if (!validateForm(password)) {
      alert(
        "Password needs to be: 6-20 characters long, have at least 1 special character, 1 uppercase, 1 lowercase, and 1 number."
      );
      return;
    }

    if (password !== repeatPassword) {
      alert("Password and Repeat Password are not the same");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please log in.");
        window.location.href = "/login";
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Signup error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join us today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 dark:text-gray-500">👤</span>
                </div>
                <input
                  required
                  type="text"
                  name="firstName"
                  id="firstname-input"
                  placeholder="First"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="lastname-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 dark:text-gray-500">👤</span>
                </div>
                <input
                  required
                  type="text"
                  name="lastName"
                  id="lastname-input"
                  placeholder="Last"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 dark:text-gray-500">@</span>
              </div>
              <input
                required
                type="email"
                name="email"
                id="email-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 dark:text-gray-500">🔒</span>
              </div>
              <input
                required
                type="password"
                name="password"
                id="password-input"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              6-20 characters, 1 special character, 1 uppercase, 1 lowercase, 1 number
            </p>
          </div>
          
          <div>
            <label htmlFor="repeat-password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 dark:text-gray-500">🔒</span>
              </div>
              <input
                required
                type="password"
                name="repeatPassword"
                id="repeat-password-input"
                placeholder="Confirm your password"
                value={formData.repeatPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
