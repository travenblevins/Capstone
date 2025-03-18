import React, { useState } from "react";

const CreateUserForm = ({ onUserCreated }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState("no");

  const createUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const newUser = { firstName, lastName, email, password, admin };

    try {
      await fetch("https://capstone-gmm5.onrender.com/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setAdmin("no");
      onUserCreated();
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New User</h2>
      <form onSubmit={createUser} className="space-y-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <select
          value={admin}
          onChange={(e) => setAdmin(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="no">User</option>
          <option value="yes">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
