import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter both email and password.");
      return;
    }

    console.log("Login successful", formData);
  };

  return (
    <div className="flex items-center justify-end bg-gray-100 h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <label htmlFor="email-input" className="mr-2">
              @
            </label>
            <input
              required
              type="email"
              name="email"
              id="email-input"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <label htmlFor="password-input" className="mr-2">
              🔒
            </label>
            <input
              required
              type="password"
              name="password"
              id="password-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
