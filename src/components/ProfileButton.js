// src/components/ProfileButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const ProfileButton = () => {
  return (
    <Link
      to="/profile"
      className="fixed top-4 right-4 bg-white rounded-full p-3 shadow-lg transition transform hover:scale-105"
    >
      <FontAwesomeIcon icon={faGithub} className="text-green-600 w-6 h-6" />
    </Link>
  );
};

export default ProfileButton;
