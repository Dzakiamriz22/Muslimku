// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate programmatically

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

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen pb-24">
      <button 
        onClick={() => navigate(-1)} 
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 shadow-md hover:bg-green-600 transition"
      >
        Kembali
      </button>

      {profile && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
          <p className="text-gray-600">{profile.bio}</p>
          <div className="mt-4">
            <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
            <p><strong>Followers:</strong> {profile.followers}</p>
            <p><strong>Following:</strong> {profile.following}</p>
            <p><strong>Public Repos:</strong> {profile.public_repos}</p>
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              Visit GitHub Profile
            </a>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map(repo => (
          <div 
            key={repo.id} 
            className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => window.open(repo.html_url, '_blank')} // Open repo in new tab
          >
            <h3 className="font-semibold text-lg">
              <span className="text-blue-500 hover:underline">{repo.name}</span>
            </h3>
            <p className="text-gray-600">{repo.description || 'No description available'}</p>
            <div className="mt-2">
              <span className="bg-green-200 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                Stars: {repo.stargazers_count}
              </span>
              <span className="bg-yellow-200 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full ml-2">
                Forks: {repo.forks_count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
