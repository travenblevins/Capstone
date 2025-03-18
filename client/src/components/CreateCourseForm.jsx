import { useState } from "react";

const CreateCourseForm = ({ onCourseCreated }) => {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [room, setRoom] = useState("");
  const [capacity, setCapacity] = useState("");
  const [credits, setCredits] = useState("");
  const [fee, setFee] = useState("");

  const createCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const newCourse = {
      courseCode,
      courseName,
      description,
      schedule,
      room,
      capacity,
      credits,
      fee,
    };

    try {
      const response = await fetch(
        "https://capstone-gmm5.onrender.com/admin/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCourse),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Course created successfully!");
        if (onCourseCreated) {
          onCourseCreated(); // 🔹 Call the function to refresh the courses
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating course", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Course</h2>
      <form onSubmit={createCourse} className="space-y-4">
        <input
          type="text"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Credits"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourseForm;
