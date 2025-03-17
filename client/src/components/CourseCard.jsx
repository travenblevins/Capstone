const CourseCard = ({ course, enrollInCourse, unEnrollInCourse }) => {
  if (!course) return null; // Handle undefined course case

  return (
    <div className="flex flex-col justify-between border p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <div>
        <h3 className="text-lg font-semibold">{course.course_name}</h3>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className=" text-sm text-gray-500 dark:text-gray-400">
          {course.schedule} {course.fee}
        </p>
        {course.isEnrolled ? (
          <button
            onClick={unEnrollInCourse}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Unenroll
          </button>
        ) : (
          <button
            onClick={enrollInCourse}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Enroll
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
