import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  const Navbar = () => (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-6 text-white">
        <li>
          <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md">
            Home
          </Link>
        </li>
        <li>
          <Link to="/signup" className="hover:bg-gray-700 px-3 py-2 rounded-md">
            Signup
          </Link>
        </li>
        <li>
          <Link to="/login" className="hover:bg-gray-700 px-3 py-2 rounded-md">
            Login
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="hover:bg-gray-700 px-3 py-2 rounded-md"
          >
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );

  return (
    <Router>
      {/* <Navbar /> */}
      <div className="container mx-auto mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
