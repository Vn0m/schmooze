'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FaDoorOpen } from "react-icons/fa";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button className="text-white flex items-center space-x-2 hover:bg-[#333] p-2 rounded-lg" onClick={handleLogout}><FaDoorOpen /><span>Log out</span></button>
  );
};

export default LogoutButton;
