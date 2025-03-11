import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Sidebar";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("http://localhost:3001/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
          console.log(data);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, [navigate]);

  // const enrollInCourse = async (courseId) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`http://localhost:3001/enroll/${courseId}`, {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (response.ok) {
  //       alert("Enrolled successfully!");
  //     } else {
  //       console.error("Failed to enroll");
  //     }
  //   } catch (error) {
  //     console.error("Error enrolling in course", error);
  //   }
  // };

  return (
    <div>
      <Dashboard>
        <h2>Courses</h2>
        <ul>
          {courses.length > 0 ? (
            courses.map((course) => (
              <li key={course.course_id}>
                {course.description} - {course.credits} credits,{" "}
                {course.schedule}
                {/* <button onClick={() => enrollInCourse(course.course_id)}>
                Enroll
              </button> */}
              </li>
            ))
          ) : (
            <p>Loading Courses...</p>
          )}
        </ul>
      </Dashboard>
    </div>
  );
};

export default Courses;
