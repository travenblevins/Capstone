import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Logout from "./pages/logout";
import Courses from "./pages/Courses";
import { useContext } from "react";
import AuthContext, { AuthProvider } from "./context/AuthContext";

function App() {
  // Consume the user context
  const { user } = useContext(AuthContext);

  // ProtectedRoute component uses the user context
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/logout" element={<Logout />} /> */}
          <Route path="/courses" element={<Courses />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
