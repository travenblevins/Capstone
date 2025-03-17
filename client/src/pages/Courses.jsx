import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Sidebar";
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCourses();
  }, [navigate]);

  const enrollInCourse = async (course_name) => {
    console.log("Attempting to enroll in:", course_name);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://capstone-gmm5.onrender.com/courses/${encodeURIComponent(
          course_name
        )}/enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Enrolled successfully!");
        fetchCourses(); // Refresh the courses list

        // Update state to reflect enrollment
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.name === course_name
              ? { ...course, isEnrolled: true }
              : course
          )
        );
      } else {
        console.error("Failed to enroll:", await response.text());
      }
    } catch (error) {
      console.error("Error enrolling in course", error);
    }
  };

  const unEnrollInCourse = async (course_name) => {
    console.log("Attempting to unenroll in:", course_name);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://capstone-gmm5.onrender.com/courses/${encodeURIComponent(
          course_name
        )}/unenroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Unenrolled successfully!");
        fetchCourses(); // Refresh the courses list

        // Update state to reflect unenrollment
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.name === course_name
              ? { ...course, isEnrolled: false }
              : course
          )
        );
      } else {
        console.error("Failed to unenroll:", await response.text());
      }
    } catch (error) {
      console.error("Error unenrolling from course", error);
    }
  };

  return (
    <Dashboard>
      <h2 className="text-xl font-bold mb-4">Courses:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              enrollInCourse={() => {
                enrollInCourse(course.course_name);
              }}
              unEnrollInCourse={() => {
                unEnrollInCourse(course.course_name);
              }}
            />
          ))
        ) : (
          <p>Loading Courses...</p>
        )}
      </div>
    </Dashboard>
  );
};

export default Courses;
