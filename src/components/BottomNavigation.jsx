import { Link } from 'react-router-dom';
import { FaHome, FaPray, FaMosque } from 'react-icons/fa';

function BottomNavigation() {
  return (
    <nav className="bg-gray-800 text-white p-4 fixed bottom-0 left-0 right-0 shadow-lg">
      <ul className="flex justify-around space-x-4">
        <li className="flex-1 text-center">
          <Link to="/" className="flex flex-col items-center hover:text-yellow-400 transition duration-200">
            <FaHome className="text-2xl" />
            <span className="text-sm">Home</span>
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link to="/mekah" className="flex flex-col items-center hover:text-yellow-400 transition duration-200">
            <FaMosque className="text-2xl" />
            <span className="text-sm">Surah Mekah</span>
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link to="/madinah" className="flex flex-col items-center hover:text-yellow-400 transition duration-200">
            <FaMosque className="text-2xl" />
            <span className="text-sm">Surah Madinah</span>
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link to="/prayer-times" className="flex flex-col items-center hover:text-yellow-400 transition duration-200">
            <FaPray className="text-2xl" />
            <span className="text-sm">Waktu Sholat</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default BottomNavigation;
