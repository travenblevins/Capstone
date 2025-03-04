import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LogoutModal({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    console.log("User logged out");
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <>
      <button className="" onClick={() => setIsOpen(true)}>
        Logout
      </button>
      <LogoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}
