import { useState } from "react";

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
      const response = await fetch("http://localhost:3001/signup", {
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
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <label htmlFor="lastname-input" className="mr-2">
              👤
            </label>
            <input
              required
              type="text"
              name="lastName"
              id="lastname-input"
              placeholder="Last Name"
              value={formData.lastName}
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
