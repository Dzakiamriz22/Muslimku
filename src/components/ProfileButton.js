import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const ProfileButton = () => {
  return (
    <div
      onClick={() => window.location.href = "/profile"}
      className="fixed top-4 right-4 cursor-pointer bg-transparent text-gray-900 rounded-full p-3 shadow-md hover:shadow-xl hover:scale-125 hover:rotate-12 transition-all duration-300 ease-in-out transform"
    >
      <FontAwesomeIcon
        icon={faGithub}
        className="w-6 h-6 text-gray-900 transition-all duration-300 ease-in-out"
      />
    </div>
  );
};

export default ProfileButton;
