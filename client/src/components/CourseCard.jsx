const CourseCard = ({ course }) => {
  if (!course) return null; // Handle undefined course case

  return (
    <div className="flex flex-col max-h-96 justify-between border p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold">{course.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 line-clamp-6">
        {course.description}
      </p>
      <p className=" text-sm text-gray-500 dark:text-gray-400">
        {course.schedule} {course.fee}
      </p>
      {/* Add enroll button if needed */}
    </div>
  );
};

export default CourseCard;
