import { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const { password, repeatPassword } = formData;

    if (!validateForm(password)) {
      alert(
        "Password needs to be: 6-20 Characters Long, Have at Least 1 Special Character, 1 Uppercase, 1 Lowercase, and 1 Number"
      );
      return;
    }

    if (password !== repeatPassword) {
      alert("Password and Repeat Password are not the same");
      return;
    }

    console.log("Signup successful", formData);
  };

  return (
    <div className="flex items-center justify-start bg-gray-100 h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <label htmlFor="firstname-input" className="mr-2">
              👤
            </label>
            <input
              required
              type="text"
              name="firstName"
              id="firstname-input"
              placeholder="Firstname"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
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
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <label htmlFor="repeat-password-input" className="mr-2">
              🔒
            </label>
            <input
              required
              type="password"
              name="repeatPassword"
              id="repeat-password-input"
              placeholder="Repeat Password"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an Account?{" "}
          <a href="login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
