import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "../components/Sidebar";
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
  const [activeTab, setActiveTab] = useState("courses"); // Default to courses

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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
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

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://capstone-gmm5.onrender.com/admin/courses/${courseId}`,
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 border-b mb-6">
        <button
          className={`py-2 px-4 ${
            activeTab === "courses"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("courses")}
        >
          Courses
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "users"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>
      {activeTab === "courses" && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>
          <CreateCourseForm onCourseCreated={fetchAdminData} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {courses.map((course) => (
              <div
                key={course.course_id}
                className="p-4 bg-white border rounded-lg shadow-md flex flex-col"
              >
                <h3 className="text-lg font-bold">{course.course_name}</h3>
                <p className="text-gray-600">{course.description}</p>
                <p className="text-sm text-gray-500">
                  Credits: {course.credits}
                </p>
                <p className="text-sm text-gray-500">Fee: ${course.fee}</p>
                <p className="text-sm text-gray-500">Room: {course.room}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => deleteCourse(course.course_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
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
        </section>
      )}
      {activeTab === "users" && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
          <CreateUserForm onUserCreated={fetchAdminData} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-white border rounded-lg shadow-md flex flex-col"
              >
                <h3 className="text-lg font-bold">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
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
        </section>
      )}
    </Dashboard>
  );
};

export default Admin;
