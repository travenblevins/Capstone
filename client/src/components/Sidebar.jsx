import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                />
              </svg>
            </button>
            <a to="/" className="flex ms-2 md:me-24">
              <img
                src="/src/assets/images/logo.webp"
                className="h-8 me-3"
                alt="Logo"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl dark:text-white">
                Dashboard
              </span>
            </a>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="/src/assets/images/userImg.webp"
                alt="user"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-gray-700 rounded-md shadow-md">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
                <ul className="py-1">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={logout}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 bg-white dark:bg-gray-800`}
    >
      <ul className="space-y-2 font-medium px-3">
        <li>
          <Link
            to="/"
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="ms-3">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/courses"
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="ms-3">Courses</span>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="ms-3">Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin"
            className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="ms-3">Admin</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

const Dashboard = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 h-screen overflow-y-auto">
          <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
