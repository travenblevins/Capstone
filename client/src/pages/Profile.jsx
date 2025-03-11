import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Sidebar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("http://localhost:3001/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setEnrolledCourses(data.enrolledCourses);
          console.log(data);
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
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <h3>Enrolled Courses</h3>
            <ul>
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <li key={course.course_code}>{course.course_name}</li>
                ))
              ) : (
                <p>No enrolled courses</p>
              )}
            </ul>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </Dashboard>
    </div>
  );
};
export default Profile;
