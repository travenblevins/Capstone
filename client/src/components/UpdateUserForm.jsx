import { useState } from "react";

const UpdateUserForm = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: "",
    admin: user.admin,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3001/admin/users/${user.id}`,
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
        onUpdateSuccess(); // Refresh user list and close form
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
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Admin:
        <input
          type="checkbox"
          name="admin"
          checked={formData.admin}
          onChange={(e) =>
            setFormData({ ...formData, admin: e.target.checked })
          }
        />
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
