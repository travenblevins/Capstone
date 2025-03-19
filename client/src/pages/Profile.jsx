import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Sidebar";
import UpdateProfileForm from "../components/UpdateProfileForm";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  const handleUpdateSuccess = (updatedUser) => {
    setUser(updatedUser);
    alert("Profile updated successfully!");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(
          "https://capstone-gmm5.onrender.com/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setEnrolledCourses(data.enrolledCourses);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchProfile();
  }, [navigate]);

  return (
    <div>
      <Dashboard>
        <h2>Profile</h2>
        {user ? (
          <div>
            <p>
              <strong>First Name:</strong> {user.first_name}
              <br></br>
              <strong>Last Name:</strong> {user.first_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <h3 className="text-2xl font-semibold mt-6 text-gray-800">
              Enrolled Courses
            </h3>
            <div className="mt-3 bg-white p-4 rounded-lg shadow-md border border-gray-200">
              {enrolledCourses.length > 0 ? (
                <ul className="divide-y divide-gray-300">
                  {enrolledCourses.map((course) => (
                    <li
                      key={course.course_code}
                      className="p-3 flex justify-between items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <span className="text-gray-700 font-medium">
                        {course.course_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {course.course_code}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-center py-4">
                  No enrolled courses
                </p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
        <br />
        {user && (
          <UpdateProfileForm
            user={user}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </Dashboard>
    </div>
  );
};
export default Profile;
