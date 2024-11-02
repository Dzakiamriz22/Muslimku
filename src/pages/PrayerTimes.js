import { useEffect, useState } from 'react';

function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextWajibPrayer, setNextWajibPrayer] = useState('');
  const [countdown, setCountdown] = useState('');
  const [location, setLocation] = useState('');
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceOrientation, setDeviceOrientation] = useState(0);

  const kaabaLatitude = 21.4253; // Latitude of Kaaba
  const kaabaLongitude = 39.8262; // Longitude of Kaaba

  useEffect(() => {
    const getLocationAndFetchPrayerTimes = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
            const data = await response.json();
            setPrayerTimes(data.data.timings);
            setLoading(false);
            calculateNextWajibPrayer(data.data.timings);
            await fetchLocationName(latitude, longitude);
            calculateQiblaDirection(latitude, longitude);
          } catch (err) {
            setError('Error fetching prayer times. Please try again later.');
            setLoading(false);
          }
        }, () => {
          setError('Unable to retrieve your location.');
          setLoading(false);
        });
      } else {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };

    const fetchLocationName = async (latitude, longitude) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        const addressComponents = data.address;
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

      for (let i = 0; i < wajibPrayers.length; i++) {
        if (timings[wajibPrayers[i]] > currentTime) {
          nextPrayerName = wajibPrayers[i];
          nextPrayerTime = timings[wajibPrayers[i]];
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
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown(`${hours}h ${minutes}m ${seconds}s`);

        if (difference < 0) {
          clearInterval(interval);
          setCountdown('Prayer time arrived!');
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    const calculateQiblaDirection = (latitude, longitude) => {
      const deltaLongitude = kaabaLongitude - longitude;
      const x = Math.cos((latitude * Math.PI) / 180) * Math.sin((deltaLongitude * Math.PI) / 180);
      const y = Math.cos((kaabaLatitude * Math.PI) / 180) * Math.sin((latitude * Math.PI) / 180) - 
                Math.sin((kaabaLatitude * Math.PI) / 180) * Math.cos((latitude * Math.PI) / 180) * 
                Math.cos((deltaLongitude * Math.PI) / 180);

      const qiblaBearing = Math.atan2(x, y) * (180 / Math.PI);
      setQiblaDirection((qiblaBearing + 360) % 360); // Normalize to 0-360
    };

    getLocationAndFetchPrayerTimes();
  }, []);

  useEffect(() => {
    const handleOrientation = (event) => {
      const alpha = event.alpha;
      setDeviceOrientation(alpha); // Store the device orientation
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Adjust the Qibla direction based on device orientation
  const adjustedQiblaDirection = (qiblaDirection - deviceOrientation + 360) % 360;

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const wajibPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-600">Jadwal Waktu Sholat</h1>
      <h2 className="text-xl font-semibold text-center mb-4">Current Location: {location || 'Fetching location...'}</h2>
      
      {/* Qibla direction section at the top */}
      <div className="flex flex-col items-center mb-6">
        <h3 className="font-semibold mb-2">Kiblat Direction</h3>
        <div className="relative mb-4">
          <img
            src="/compass.png"
            alt="Compass"
            className="w-24 h-24" // Smaller compass
            style={{ transform: `rotate(${adjustedQiblaDirection}deg)`, transition: 'transform 0.5s' }} // Adjusting with device orientation
          />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Next Wajib Prayer: {nextWajibPrayer || 'No more prayers today'}</h2>
        <h3 className="text-lg font-medium mb-2">
          Countdown to {nextWajibPrayer}: <span className="text-green-500 font-bold">{countdown}</span>
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
