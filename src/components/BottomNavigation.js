import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPray, FaMosque, FaBook } from 'react-icons/fa';

function BottomNavigation() {
  const location = useLocation();

  const links = [
    { to: "/", icon: <FaHome className="text-2xl" />, label: "Home" },
    { to: "/mekah", icon: <FaMosque className="text-2xl" />, label: "Makkiyah" },
    { to: "/madinah", icon: <FaMosque className="text-2xl" />, label: "Madaniyah" },
    { to: "/doa", icon: <FaBook className="text-2xl" />, label: "Doa" },
    { to: "/prayer-times", icon: <FaPray className="text-2xl" />, label: "Sholat" },
  ];

  return (
    <nav className="bg-white text-gray-800 p-4 fixed bottom-0 left-0 right-0 shadow-lg z-10 border-t border-green-300">
      <ul className="flex justify-around space-x-2">
        {links.map(({ to, icon, label }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              className={`flex flex-col items-center text-center p-2 transition duration-200 
                          ${location.pathname === to ? 'text-green-600 font-bold' : 'hover:text-green-600'}`}
            >
              {icon}
              <span className="text-sm">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BottomNavigation;
