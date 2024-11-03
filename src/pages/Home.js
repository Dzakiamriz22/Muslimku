import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DoaList from '../components/DoaList';
import ProfileButton from '../components/ProfileButton';
import SearchBar from '../components/SearchBar';


const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function PrayerTimes({ setNextWajibPrayer }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocationAndFetchPrayerTimes = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
            const data = await response.json();
            setLoading(false);
            calculateNextWajibPrayer(data.data.timings);
          } catch (err) {
            setError('Error fetching prayer times');
            setLoading(false);
          }
        });
      } else {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };

    const calculateNextWajibPrayer = (timings) => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-GB', { hour12: false });
      const wajibPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let nextPrayerName = '';
      let nextPrayerTime = '';

      for (const prayer of wajibPrayers) {
        if (timings[prayer] > currentTime) {
          nextPrayerName = prayer;
          nextPrayerTime = timings[prayer];
          break;
        }
      }

      if (!nextPrayerName) {
        nextPrayerName = wajibPrayers[0];
        nextPrayerTime = timings[wajibPrayers[0]];
      }

      setNextWajibPrayer({ name: nextPrayerName, time: nextPrayerTime });
    };

    getLocationAndFetchPrayerTimes();
  }, [setNextWajibPrayer]);

  if (loading) return <p className="text-center text-green-600">Memuat...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return null;
}

function VerseOfTheDay({ verse, surahName, verseNumber }) {
  return (
    <div className="bg-green-100 rounded-md p-4 mb-4 border border-green-200 flex flex-col items-center shadow-lg">
      <h2 className="text-lg font-semibold text-green-700 mb-1">Ayat Hari Ini</h2>
      <p className="text-gray-800 italic text-center">{verse.text}</p>
      <div className="mt-2 text-gray-600">
        <span>{surahName}, Ayat {verseNumber}</span>
      </div>
    </div>
  );
}

function Home() {
  const [surahs, setSurahs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [nextWajibPrayer, setNextWajibPrayer] = useState(null);
  const [verseOfTheDay, setVerseOfTheDay] = useState({ text: '', translation: '' });
  const [surahDetails, setSurahDetails] = useState({ name: '', number: '' });

  useEffect(() => {
    const fetchSurahs = async () => {
      const response = await fetch('https://quran-api.santrikoding.com/api/surah');
      const data = await response.json();

      const filteredData = location.pathname === '/madinah'
        ? data.filter(surah => surah.tempat_turun === 'madinah')
        : location.pathname === '/mekkah'
        ? data.filter(surah => surah.tempat_turun === 'mekkah')
        : data;

      setSurahs(filteredData);
      fetchRandomVerse(filteredData);
    };

    const fetchRandomVerse = async (filteredData) => {
      const randomSurahId = getRandomInt(1, filteredData.length);
      const response = await fetch(`https://quran-api.santrikoding.com/api/surah/${randomSurahId}`);
      const surahData = await response.json();

      if (surahData.ayat && surahData.ayat.length > 0) {
        const randomVerseIndex = getRandomInt(0, surahData.ayat.length - 1);
        const randomVerse = surahData.ayat[randomVerseIndex];
        setVerseOfTheDay({ text: randomVerse.idn, translation: randomVerse.tr });
        setSurahDetails({ name: surahData.nama_latin, number: randomVerse.nomor });
      }
    };

    fetchSurahs();
  }, [location]);

  const filteredSurahs = surahs.filter(surah =>
    surah.nama_latin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-r from-green-50 to-white rounded-lg shadow-lg mb-20">
      <h1 className="text-4xl font-bold text-center mb-4 text-green-700">Muslimku</h1>
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Al-Quran</h2>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> {/* Use the new SearchBar component */}
      <PrayerTimes setNextWajibPrayer={setNextWajibPrayer} />

      {nextWajibPrayer && (
        <div className="bg-green-100 rounded-md p-4 mb-4 border border-green-300 flex flex-col items-center shadow-lg">
          <h2 className="text-lg font-semibold text-green-700 mb-1">Sholat Selanjutnya: {nextWajibPrayer.name}</h2>
          <h3 className="text-sm text-gray-700">Waktu: <span className="text-green-600 font-semibold">{nextWajibPrayer.time}</span></h3>
        </div>
      )}

      <VerseOfTheDay 
        verse={verseOfTheDay} 
        surahName={surahDetails.name} 
        verseNumber={surahDetails.number} 
      />

      <div className="my-8 border-t border-green-300"></div>
      <DoaList />

      <div className="my-8 border-t border-green-300"></div>

      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Daftar Surah</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredSurahs.map(surah => (
          <Link 
            to={`/surah/${surah.nomor}`} 
            key={surah.nomor} 
            className="bg-white shadow-lg rounded-lg p-6 border border-green-200 transition-transform transform hover:shadow-xl"
          >
            <div className="flex flex-col mb-4">
              <span className="text-xl font-semibold text-green-800">{surah.nama_latin}</span>
              <span className="text-xl font-semibold text-green-900 mt-1">{surah.nama}</span>
              <span className="text-green-700 text-sm italic mt-1">{surah.arti}</span>
              <span className="mt-2 text-sm text-gray-600">Surah ke: <strong>{surah.nomor}</strong></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 capitalize">
                Tempat Turun: 
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full ml-1">{surah.tempat_turun}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <ProfileButton /> {/* Add the ProfileButton here */}
    </div>
  );
}

export default Home;
