import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaMapMarkerAlt, FaStar, FaCodeBranch, FaArrowLeft, FaMoon, FaSun } from 'react-icons/fa';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const profileResponse = await fetch('https://api.github.com/users/Dzakiamriz22');
        const profileData = await profileResponse.json();
        setProfile(profileData);

        const reposResponse = await fetch('https://api.github.com/users/Dzakiamriz22/repos');
        const reposData = await reposResponse.json();
        setRepos(reposData);
      } catch (err) {
        setError('Error fetching data from GitHub');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const themeClasses = darkMode
    ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-gray-100'
    : 'bg-gradient-to-br from-pink-200 via-yellow-300 to-blue-200 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-opacity-80 backdrop-blur-lg bg-gray-900 text-gray-100 border border-gray-700 shadow-2xl'
    : 'bg-opacity-90 backdrop-blur-lg bg-white text-gray-800 shadow-xl border border-gray-300';

  const textClasses = darkMode ? 'text-gray-300' : 'text-gray-800';

  if (loading) return <p className="text-center text-xl text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 text-center text-xl">{error}</p>;

  return (
    <div className={`p-6 min-h-screen ${themeClasses} transition-all duration-500`}>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transform transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <button
          onClick={toggleDarkMode}
          className="flex items-center bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 px-4 py-2 rounded-full shadow-lg hover:scale-105 transform transition-all duration-200"
        >
          {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {profile && (
        <div className={`${cardClasses} rounded-2xl p-8 mb-10 transition-all duration-500`}>
          <div className="flex items-center space-x-4 mb-6">
            <FaGithub size={50} className={darkMode ? "text-gray-800 dark:text-gray-100" : "text-gray-900"} />
            <h1 className="text-4xl font-extrabold">{profile.name}</h1>
          </div>
          <p className={`text-lg font-light ${textClasses} mb-4`}>{profile.bio}</p>
          <div className="mt-4 space-y-2">
            <p className={`flex items-center text-lg ${textClasses}`}>
              <FaMapMarkerAlt className="mr-2" /> {profile.location || 'Location not specified'}
            </p>
            <p className={`text-lg ${textClasses}`}>
              <strong className="font-semibold">Followers:</strong> {profile.followers}
            </p>
            <p className={`text-lg ${textClasses}`}>
              <strong className="font-semibold">Following:</strong> {profile.following}
            </p>
            <p className={`text-lg ${textClasses}`}>
              <strong className="font-semibold">Public Repos:</strong> {profile.public_repos}
            </p>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View GitHub Profile
            </a>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-semibold text-gray-300 mb-6">Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {repos.map(repo => (
          <div
            key={repo.id}
            className={`${cardClasses} rounded-2xl p-6 transition-transform transform hover:scale-105 cursor-pointer`}
            onClick={() => window.open(repo.html_url, '_blank')}
          >
            <h3 className="font-semibold text-xl text-gradient bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:underline">
              {repo.name}
            </h3>
            <p className={`text-gray-600 dark:text-gray-300 mt-2 mb-4 ${textClasses}`}>
              {repo.description || 'No description available'}
            </p>
            <div className="flex space-x-4">
              <span className="flex items-center bg-green-200 text-green-600 dark:bg-green-500 dark:text-green-100 text-xs font-semibold px-3 py-1 rounded-full">
                <FaStar className="mr-1" /> {repo.stargazers_count}
              </span>
              <span className="flex items-center bg-yellow-200 text-yellow-600 dark:bg-yellow-500 dark:text-yellow-100 text-xs font-semibold px-3 py-1 rounded-full">
                <FaCodeBranch className="mr-1" /> {repo.forks_count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
