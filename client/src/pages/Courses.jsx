import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Sidebar";
import CourseCard from "../components/CourseCard";

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
        const response = await fetch("https://capstone-gmm5.onrender.com/courses", {
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
    <Dashboard>
      <h2 className="text-xl font-bold mb-4">Courses:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.course_id} course={course} />
          ))
        ) : (
          <p>Loading Courses...</p>
        )}
      </div>
    </Dashboard>
  );
};

export default Courses;
