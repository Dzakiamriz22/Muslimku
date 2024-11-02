// src/App.js
import { Route, Routes, useLocation } from 'react-router-dom';
import SurahList from './pages/Home';
import SurahDetail from './pages/SurahDetail';
import PrayerTimes from './pages/PrayerTimes';
import SurahMekah from './pages/SurahMekah'; 
import SurahMadinah from './pages/SurahMadinah';
import BottomNavigation from './components/BottomNavigation';
import DoaPage from './pages/DoaPage';
import DoaDetailPage from './pages/DoaDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SurahList />} />
        <Route path="/surah/:id" element={<SurahDetail />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/mekah" element={<SurahMekah />} />
        <Route path="/madinah" element={<SurahMadinah />} />
        <Route path="/doa" element={<DoaPage />} />
        <Route path="/doa/:id" element={<DoaDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
      </Routes>

      {/* Conditionally render BottomNavigation if not on ProfilePage */}
      {location.pathname !== '/profile' && <BottomNavigation />}
    </div>
  );
}

export default App;
