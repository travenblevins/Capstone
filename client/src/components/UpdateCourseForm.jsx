import { useState } from "react";

const UpdateCourseForm = ({ course, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    courseName: course.course_name,
    description: course.description,
    schedule: course.schedule,
    room: course.room,
    capacity: course.capacity,
    credits: course.credits,
    fee: course.fee,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://capstone-gmm5.onrender.com/admin/courses/${course.course_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        onUpdateSuccess();
      } else {
        console.error("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={formData.courseName}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
          rows={7}
        />
        <input
          type="text"
          name="schedule"
          placeholder="Schedule"
          value={formData.schedule}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="room"
          placeholder="Room"
          value={formData.room}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          name="credits"
          placeholder="Credits"
          value={formData.credits}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          name="fee"
          placeholder="Fee"
          value={formData.fee}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Update Course
        </button>
      </form>
    </div>
  );
};

export default UpdateCourseForm;
