import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaMapMarkerAlt, FaArrowLeft, FaMoon, FaSun, FaInstagram, FaLinkedin } from 'react-icons/fa';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const profileResponse = await fetch('https://api.github.com/users/Dzakiamriz22');
        if (!profileResponse.ok) throw new Error('Network response was not ok');
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch repositories to get languages used
        const reposResponse = await fetch(`https://api.github.com/users/Dzakiamriz22/repos`);
        if (!reposResponse.ok) throw new Error('Network response was not ok');
        const reposData = await reposResponse.json();
        
        // Extract languages from each repository
        const languageCount = {};
        for (const repo of reposData) {
          if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
          }
        }

        // Sort languages by usage and take the top 5 or so
        const sortedLanguages = Object.keys(languageCount).sort((a, b) => languageCount[b] - languageCount[a]);
        setSkills(sortedLanguages.slice(0, 5)); // Get top 5 languages

      } catch (err) {
        setError('Error fetching data from GitHub');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

  const themeClasses = darkMode
    ? 'bg-gray-900 text-gray-200'
    : 'bg-gray-50 text-gray-800';

  const cardClasses = darkMode
    ? 'bg-gray-800 text-white border border-gray-700'
    : 'bg-white text-gray-900 border border-gray-300';

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={`p-6 min-h-screen ${themeClasses} transition-all duration-500`}>
      <Header navigate={navigate} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      {profile && <ProfileDetails profile={profile} cardClasses={cardClasses} darkMode={darkMode} skills={skills} />}
    </div>
  );
};

const Header = ({ navigate, toggleDarkMode, darkMode }) => (
  <div className="flex items-center justify-between mb-6">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center bg-blue-600 text-white h-10 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
    >
      <FaArrowLeft className="mr-2" /> Back
    </button>
    <button
      onClick={toggleDarkMode}
      className={`flex items-center h-10 px-4 rounded-lg shadow-lg transition-all duration-300 ${darkMode ? 'bg-yellow-400 text-gray-800' : 'bg-gray-300 text-gray-800'}`}
    >
      {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  </div>
);

const ProfileDetails = ({ profile, cardClasses, darkMode, skills }) => (
  <div className={`${cardClasses} rounded-2xl p-8 mb-10 transition-all duration-500 shadow-lg`}>
    <div className="flex items-center space-x-4 mb-4">
      <img 
        src={profile.avatar_url} 
        alt={`${profile.name}'s profile`} 
        className="w-24 h-24 rounded-full border-4 border-gray-300" 
      />
      <div>
        <h1 className="text-4xl font-bold">{profile.name}</h1>
        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
          {profile.bio || 'No bio available'}
        </p>
      </div>
    </div>
    <ProfileInfo profile={profile} darkMode={darkMode} />
    <SkillTags skills={skills} darkMode={darkMode} />
    <SocialLinks profileUrl={profile.html_url} />
  </div>
);

const ProfileInfo = ({ profile, darkMode }) => (
  <div className="mt-2 space-y-2">
    <InfoItem icon={<FaMapMarkerAlt />} text={profile.location || 'Location not specified'} darkMode={darkMode} />
    <InfoItem label="Followers" text={profile.followers} darkMode={darkMode} />
    <InfoItem label="Following" text={profile.following} darkMode={darkMode} />
    <InfoItem label="Public Repos" text={profile.public_repos} darkMode={darkMode} />
  </div>
);

const InfoItem = ({ icon, label, text, darkMode }) => (
  <p className={`flex items-center text-lg ${darkMode ? 'text-gray-300' : 'text-gray-800'} transition-all duration-300`}>
    {icon && <span className="mr-2">{icon}</span>}
    {label && <strong className="font-semibold">{label}:</strong>} {text}
  </p>
);

const SkillTags = ({ skills, darkMode }) => (
  <div className="flex flex-wrap mt-4 space-x-2">
    {skills.map((skill) => (
      <span key={skill} className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}>
        {skill}
      </span>
    ))}
  </div>
);

const SocialLinks = ({ profileUrl }) => (
  <div className="flex space-x-4 mt-6 flex-wrap">
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center bg-blue-600 text-white h-10 px-4 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 mb-2"
    >
      <FaGithub className="mr-2" /> View GitHub Profile
    </a>
    <a
      href="https://www.instagram.com/dzakiamriz_"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center bg-pink-600 text-white h-10 px-4 rounded-lg shadow hover:bg-pink-500 transition-all duration-300 mb-2"
    >
      <FaInstagram className="mr-2" /> Instagram
    </a>
    <a
      href="https://www.linkedin.com/in/dzakiamriz/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center bg-blue-700 text-white h-10 px-4 rounded-lg shadow hover:bg-blue-600 transition-all duration-300 mb-2"
    >
      <FaLinkedin className="mr-2" /> LinkedIn
    </a>
  </div>
);

const Loading = () => (
  <p className="text-center text-xl text-gray-500">Loading...</p>
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-500 text-center text-xl">{message}</p>
);

export default ProfilePage;
