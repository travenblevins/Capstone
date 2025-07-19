import { useState } from "react";
import { API_BASE_URL } from "../config/api";

const UpdateUserForm = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    password: "",
    admin: user.admin ? "yes" : "no",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${user.user_id || user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        onUpdateSuccess();
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg bg-white shadow-md"
    >
      <h3>Update User</h3>
      <label className="block mb-2">
        First Name:
        <input
          required
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Last Name:
        <input
          required
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Email:
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Password:
        <input
          required
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Admin:
        <select
          name="admin"
          value={formData.admin}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="no">User</option>
          <option value="yes">Admin</option>
        </select>
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-lg mt-2"
      >
        Update User
      </button>
    </form>
  );
};

export default UpdateUserForm;
