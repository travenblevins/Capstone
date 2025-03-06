import { useContext } from "react";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <div>
        <h2>Welcome, {user?.email}</h2>
        <h2>Available Courses</h2>
      </div>
    </div>
  );
};

export default Home;
