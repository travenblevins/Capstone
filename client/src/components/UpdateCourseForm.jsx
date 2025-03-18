import { useState } from "react";

const UpdateCourseForm = ({ course, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    courseName: course.courseName,
    description: course.description,
    schedule: course.schedule,
    room: course.room,
    fee: course.fee,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(formData);
    console.log(course.course_id);
    console.log(course);

    try {
      const response = await fetch(
        `https://capstone-gmm5.onrender.com/admin/courses/${course.id}`,
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
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg bg-white shadow-md"
    >
      <h3>Update course</h3>
      <label className="block mb-2">
        Name:
        <input
          required
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Description:
        <input
          required
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Schedule:
        <input
          required
          type="text"
          name="schedule"
          value={formData.schedule}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Room:
        <input
          required
          type="text"
          name="room"
          value={formData.room}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-2">
        Fee:
        <input
          type="text"
          name="fee"
          checked={formData.fee}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-lg mt-2"
      >
        Update Course
      </button>
    </form>
  );
};

export default UpdateCourseForm;
