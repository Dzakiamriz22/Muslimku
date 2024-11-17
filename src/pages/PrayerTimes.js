import { useEffect, useState } from 'react';

function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextWajibPrayer, setNextWajibPrayer] = useState('');
  const [countdown, setCountdown] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const getLocationAndFetchPrayerTimes = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
              const data = await response.json();
              setPrayerTimes(data.data.timings);
              calculateNextWajibPrayer(data.data.timings);
              await fetchLocationName(latitude, longitude);
            } catch (err) {
              setError('Error fetching prayer times. Please try again later.');
            } finally {
              setLoading(false);
            }
          },
          handleGeolocationError
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };

    const fetchLocationName = async (latitude, longitude) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        const addressComponents = data.address || {};
        const city = addressComponents.city || addressComponents.town || addressComponents.village || 'Unknown Location';
        setLocation(city);
      } catch (err) {
        setError('Error fetching location name.');
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

      setNextWajibPrayer(nextPrayerName);
      calculateCountdown(nextPrayerTime);
    };

    const calculateCountdown = (nextPrayerTime) => {
      if (!nextPrayerTime) return;

      const now = new Date();
      const nextPrayerDate = new Date();
      const [hours, minutes] = nextPrayerTime.split(':');
      nextPrayerDate.setHours(hours);
      nextPrayerDate.setMinutes(minutes);
      nextPrayerDate.setSeconds(0);

      if (nextPrayerDate <= now) {
        nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
      }

      const interval = setInterval(() => {
        const difference = nextPrayerDate - new Date();
        if (difference < 0) {
          clearInterval(interval);
          setCountdown('Prayer time arrived!');
          return;
        }
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(interval);
    };

    const handleGeolocationError = (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('Location access denied. Please enable location access for accurate prayer times.');
          break;
        case error.POSITION_UNAVAILABLE:
          setError('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          setError('The request to get your location timed out.');
          break;
        case error.UNKNOWN_ERROR:
        default:
          setError('An unknown error occurred.');
          break;
      }
      setLoading(false);
    };

    getLocationAndFetchPrayerTimes();

    return () => {
    };
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const wajibPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="max-w-md mx-auto p-4 pb-20 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-600">Jadwal Waktu Sholat</h1>

      {/* Location Section */}
      <h2 className="text-xl font-semibold text-center mb-4">
        Lokasi: {location || 'Mengambil lokasi...'}
      </h2>

      {/* Next Wajib Prayer Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Sholat Berikutnya: {nextWajibPrayer || 'Tidak ada sholat hari ini'}
        </h2>
        <h3 className="text-lg font-medium mb-2">
          Waktu tersisa: <span className="text-green-500 font-bold">{countdown}</span>
        </h3>

        <h3 className="font-semibold mt-4">Jadwal Sholat:</h3>
        <ul className="space-y-2 mt-2">
          {wajibPrayers.map((prayer) => (
            <li key={prayer} className="bg-green-100 p-3 rounded-lg flex justify-between items-center shadow">
              <span className="text-gray-800 font-semibold">{prayer}</span>
              <span className="text-gray-600">{prayerTimes[prayer]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PrayerTimes;
