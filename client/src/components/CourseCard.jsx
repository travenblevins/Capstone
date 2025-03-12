import { useState } from "react";

const CourseCard = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!course) return null; // Handle undefined course case

  return (
    <div className="flex flex-col max-h-96 justify-between border p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold">{course.name}</h3>
      <p
        className={`text-gray-600 dark:text-gray-300 ${
          isExpanded ? "line-clamp-none" : "line-clamp-6"
        } cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {course.description}
      </p>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-blue-500 hover:underline text-sm"
      >
        {isExpanded ? "Show Less" : "Read More"}
      </button>

      <p className=" text-sm text-gray-500 dark:text-gray-400">
        {course.schedule} {course.fee}
      </p>
      {/* Add enroll button if needed */}
    </div>
  );
};

export default CourseCard;
