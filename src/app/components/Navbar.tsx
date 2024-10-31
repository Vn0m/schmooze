'use client';

import Link from 'next/link';
import { FaMusic, FaHeart, FaCompass, FaEllipsisH, FaUser, FaDoorOpen } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col space-y-4 p-4 bg-[#191919] rounded-lg">
      <Link href="/" className="text-white flex items-center space-x-2 hover:bg-[#333] p-2 rounded-lg">
        <FaHouse />
        <span>Home</span>
      </Link>

      {user && (
        <>
          <Link href="/library" className="text-white flex items-center space-x-2 hover:bg-[#333] p-2 rounded-lg">
            <FaMusic />
            <span>Library</span>
          </Link>
          <Link href="/liked-songs" className="text-white flex items-center space-x-2 hover:bg-[#333] p-2 rounded-lg">
            <FaHeart />
            <span>Liked Songs</span>
          </Link>
          <Link href="/discover" className="text-white flex items-center space-x-2 hover:bg-[#333] p-2 rounded-lg">
            <FaCompass />
            <span>Discover</span>
          </Link>
          <Link href="/profile" className="text-white flex items-center space-x-2 hover:bg-[#333] p-2 rounded-lg">
            <FaUser />
            <span>Profile</span>
          </Link>
        </>
      )}
      
      <Link href="/more" className="text-white flex items-center space-x-2 hover:bg-[#333] p-2 rounded-lg">
        <FaEllipsisH />
        <span>More</span>
      </Link>

      {!user &&
      <Link href="/login" className="text-white flex items-center space-x-2 hover:bg-[#333] p-2 rounded-lg">
        <FaDoorOpen />
        <span>Login</span>
      </Link>
      }
      {user && <LogoutButton />}
    </div>
  );
};

export default Navbar;
