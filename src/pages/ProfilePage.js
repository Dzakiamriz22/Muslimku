import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaArrowLeft, FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const profileResponse = await fetch('https://api.github.com/users/Dzakiamriz22');
        if (!profileResponse.ok) throw new Error('Network response was not ok');
        const profileData = await profileResponse.json();
        setProfile(profileData);
      } catch (err) {
        setError('Error fetching data from GitHub. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center">
      <Header navigate={navigate} />
      {profile && <ProfileDetails profile={profile} />}
    </div>
  );
};

const Header = ({ navigate }) => (
  <div className="flex items-center justify-between mb-6 w-full max-w-lg">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center bg-transparent text-gray-900 border border-gray-900 h-10 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300"
    >
      <FaArrowLeft className="mr-2" /> Back
    </button>
  </div>
);

const ProfileDetails = ({ profile }) => (
  <div className="bg-white text-gray-800 border border-gray-300 rounded-lg p-6 shadow-xl w-full max-w-lg">
    <div className="flex flex-col items-center mb-4">
      <img 
        src={profile.avatar_url} 
        alt={`${profile.name}'s profile`} 
        className="w-32 h-32 rounded-full border-4 border-gray-300 mb-4" 
      />
      <h1 className="text-3xl font-semibold text-gray-900">{profile.name}</h1>
      <p className="text-sm text-gray-600 mt-1">{profile.company || 'No company specified'}</p>
    </div>

    <div className="grid grid-cols-2 gap-4 text-center mt-6 text-sm text-gray-600">
      <InfoItem label="Repos" value={profile.public_repos} />
      <InfoItem label="Followers" value={profile.followers} />
      <InfoItem label="Following" value={profile.following} />
      <InfoItem label="Joined" value={new Date(profile.created_at).toLocaleDateString()} />
    </div>

    <SocialLinks profileUrl={profile.html_url} />
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-lg font-semibold text-gray-900">{value}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

const SocialLinks = ({ profileUrl }) => (
  <div className="flex space-x-6 mt-6 justify-center">
    <SocialLink href="https://wa.me/62895361078490" icon={<FaWhatsapp />} />
    <SocialLink href="mailto:dzakiamriz12@gmail.com" icon={<FaEnvelope />} />
    <SocialLink href={profileUrl} icon={<FaGithub />} />
    <SocialLink href="https://www.instagram.com/dzakiamriz_" icon={<FaInstagram />} />
    <SocialLink href="https://www.linkedin.com/in/dzakiamriz/" icon={<FaLinkedin />} />
  </div>
);

const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-700 h-10 w-10 rounded-full flex items-center justify-center hover:text-gray-900 hover:bg-gray-100 shadow-md transition-all duration-300 transform hover:scale-110"
  >
    {icon}
  </a>
);

const Loading = () => (
  <p className="text-center text-xl text-gray-500">Loading...</p>
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-500 text-center text-xl">{message}</p>
);

export default ProfilePage;