import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Sidebar";
import { useEffect, useState } from "react";
import CreateUserForm from "../components/CreateUserForm";
import UpdateUserForm from "../components/UpdateUserForm";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user for editing

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("https://capstone-gmm5.onrender.com/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setCourses(data.courses || []);
      } else {
        console.error("Failed to fetch admin data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`https://capstone-gmm5.onrender.com/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const deleteCourse = async (courseCode) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`https://capstone-gmm5.onrender.com/admin/courses/${courseCode}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData();
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };
  return (
    <Dashboard>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      {/* <CreateUserForm /> */}
      <div>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-col justify-between border p-4 rounded-lg shadow-md bg-white"
            >
              {user.firstName} {user.lastName} - {user.email}
              <button onClick={() => deleteUser(user.id)}>Delete User</button>
              <button onClick={() => setSelectedUser(user)}>
                Edit User
              </button>{" "}
              {/* Set user for editing */}
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && ( // Show update form when a user is selected
        <UpdateUserForm
          user={selectedUser}
          onUpdateSuccess={() => {
            fetchAdminData();
            setSelectedUser(null); // Hide form after update
          }}
        />
      )}

      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li
            key={course.courseCode}
            className="flex flex-col justify-between border p-4 rounded-lg shadow-md bg-white"
          >
            {course.name} - {course.room}
            <button onClick={() => deleteCourse(course.courseCode)}>
              Delete Course
            </button>
          </li>
        ))}
      </ul>
    </Dashboard>
  );
};

export default Admin;
