import { useState, useEffect } from "react";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    description: "",
    schedule: "",
    room: "",
    capacity: "",
    credits: "",
    fee: "",
  });
  const [editingCourse, setEditingCourse] = useState(null); // Track selected course

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://capstone-gmm5.onrender.com/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
        console.log(data.courses);
      } else {
        console.error("Failed to fetch admin data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateOrUpdateCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editingCourse ? "PUT" : "POST";
    const url = editingCourse
      ? `https://capstone-gmm5.onrender.com/admin/courses/${editingCourse.courseCode}`
      : "https://capstone-gmm5.onrender.com/admin/courses";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchCourses();
        setFormData({
          courseCode: "",
          name: "",
          description: "",
          schedule: "",
          room: "",
          credits: "",
          fee: "",
        });
        setEditingCourse(null); // Reset editing state
      }
    } catch (error) {
      console.error(
        `Error ${editingCourse ? "updating" : "creating"} course`,
        error
      );
    }
  };

  const handleDeleteCourse = async (courseCode) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(
        `https://capstone-gmm5.onrender.com/admin/courses/${courseCode}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({ ...course }); // Populate form with selected course data
  };

  return (
    <div>
      <h1>Admin Courses</h1>
      <form onSubmit={handleCreateOrUpdateCourse}>
        <input
          type="text"
          placeholder="Course Code"
          value={formData.courseCode}
          onChange={(e) =>
            setFormData({ ...formData, courseCode: e.target.value })
          }
          required
          disabled={editingCourse} // Prevent changing courseCode when updating
        />
        <input
          type="text"
          placeholder="Course Name"
          value={formData.course_name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Schedule"
          value={formData.schedule}
          onChange={(e) =>
            setFormData({ ...formData, schedule: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Room"
          value={formData.room}
          onChange={(e) => setFormData({ ...formData, room: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Credits"
          value={formData.credits}
          onChange={(e) =>
            setFormData({ ...formData, credits: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Fee"
          value={formData.fee}
          onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
          required
        />
        <button type="submit">
          {editingCourse ? "Update Course" : "Create Course"}
        </button>
        {editingCourse && (
          <button onClick={() => setEditingCourse(null)}>Cancel Edit</button>
        )}
      </form>

      <h3>Courses List</h3>
      <ul>
        {courses.map((course) => (
          <li key={course.courseCode}>
            {course.name} - {course.room}
            <button onClick={() => handleEditCourse(course)}>Edit</button>
            <button onClick={() => handleDeleteCourse(course.courseCode)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCourses;
