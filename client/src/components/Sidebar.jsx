import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import logo from "../assets/images/logo.webp";
import userImg from "../assets/images/userImg.webp";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
                src={logo}
                className="h-8 me-3"
                alt="Logo"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl dark:text-white">
                Dashboard
              </span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={userImg}
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
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"
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
