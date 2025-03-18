import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Sidebar";
import { useEffect, useState } from "react";
import CreateUserForm from "../components/CreateUserForm";
import UpdateUserForm from "../components/UpdateUserForm";
import AdminCourses from "../components/AdminCourses";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
      const response = await fetch("http://localhost:3001/admin", {
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
      await fetch(`http://localhost:3001/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <Dashboard>
      <h1>Admin Dashboard</h1>

      {/* Manage Users */}
      <h2>Users</h2>
      <CreateUserForm onUserCreated={fetchAdminData} />
      <div>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-col justify-between border p-4 rounded-lg shadow-md bg-white"
            >
              {user.firstName} {user.lastName} - {user.email}
              <button onClick={() => deleteUser(user.id)}>Delete User</button>
              <button onClick={() => setSelectedUser(user)}>Edit User</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Show Update Form When a User is Selected */}
      {selectedUser && (
        <UpdateUserForm
          user={selectedUser}
          onUpdateSuccess={() => {
            fetchAdminData();
            setSelectedUser(null);
          }}
        />
      )}

      {/* Manage Courses */}
      <h2>Courses</h2>
      <AdminCourses courses={courses} onCoursesUpdated={fetchAdminData} />
    </Dashboard>
  );
};

export default Admin;
