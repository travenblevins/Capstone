import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Sidebar";
import { useEffect, useState } from "react";
import CreateUserForm from "../components/CreateUserForm";
import UpdateUserForm from "../components/UpdateUserForm";
import UpdateCourseForm from "../components/UpdateCourseForm";
import CreateCourseForm from "../components/CreateCourseForm";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const response = await fetch(
        `https://capstone-gmm5.onrender.com/admin/courses/${courseCode}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      fetchAdminData();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <Dashboard>
      <h1>Admin Dashboard</h1>
      <h2>Courses</h2>
      <CreateCourseForm onCourseCreated={fetchAdminData} />
      <div>
        <ul>
          {courses.map((course) => (
            <li
              key={course.id}
              className="flex flex-col justify-between border p-4 rounded-lg shadow-md bg-white"
            >
              {course.course_name} {course.description} {course.credits}
              {course.fee} {course.room}
              <button onClick={() => deleteCourse(course.course_id)}>
                Delete Course
              </button>
              <button onClick={() => setSelectedCourse(course)}>
                Edit course
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedCourse && (
        <UpdateCourseForm
          course={selectedCourse}
          onUpdateSuccess={() => {
            fetchAdminData();
            setSelectedCourse(null);
          }}
        />
      )}

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
      {selectedUser && (
        <UpdateUserForm
          user={selectedUser}
          onUpdateSuccess={() => {
            fetchAdminData();
            setSelectedUser(null);
          }}
        />
      )}
    </Dashboard>
  );
};

export default Admin;
