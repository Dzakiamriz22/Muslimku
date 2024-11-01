import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SurahDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState('');

  useEffect(() => {
    fetch(`https://quran-api.santrikoding.com/api/surah/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSurah(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [id]);

  const handleAyahChange = (e) => {
    setSelectedAyah(e.target.value);
  };

  const displayedAyahs = selectedAyah
    ? surah?.ayat.filter((ayah) => ayah.nomor === Number(selectedAyah))
    : surah?.ayat;

  const goToNextSurah = () => {
    const nextId = parseInt(id) + 1; 
    navigate(`/surah/${nextId}`);
  };

  const goToPrevSurah = () => {
    const prevId = parseInt(id) - 1; 
    if (prevId > 0) { 
      navigate(`/surah/${prevId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pb-24">
      {loading ? (
        <p className="text-center text-lg text-gray-600">Memuat...</p>
      ) : surah ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center text-green-700 mb-4">{surah.nama_latin}</h1>

          {/* Navigation Buttons Above Content */}
          <div className="flex justify-between mb-6">
            <button
              onClick={goToPrevSurah}
              disabled={parseInt(id) <= 1}
              className={`bg-green-600 text-white py-2 px-4 rounded-md transition-opacity duration-200 ${parseInt(id) <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
            >
              Sebelumnya
            </button>
            <button
              onClick={goToNextSurah}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
            >
              Selanjutnya
            </button>
          </div>

          <div className="mb-6">
            <audio
              controls
              src={surah.audio}
              className="w-full mb-2 rounded-lg border border-green-300 shadow-lg appearance-none focus:outline-none"
              style={{
                background: '#f9f9f9',
                borderRadius: '8px',
              }}
            />
          </div>

          <div className="mb-4">
            <select
              value={selectedAyah}
              onChange={handleAyahChange}
              className="border border-green-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              <option value="">Pilih Ayat</option>
              {Array.from({ length: surah.jumlah_ayat }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  Ayat {index + 1}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Ayat</h2>
          <ul className="space-y-4">
            {displayedAyahs && displayedAyahs.length > 0 ? (
              displayedAyahs.map((ayah) => (
                <li key={ayah.id} className="p-4 bg-gray-50 rounded-lg shadow border border-green-200 flex items-start">
                  <span className="text-lg font-semibold text-green-700 mr-4">{ayah.nomor}.</span>
                  <div className="flex-1">
                    <p className="text-xl text-right text-gray-900 border-b border-gray-300 pb-2">{ayah.ar}</p>
                    <p className="text-lg text-gray-700 mt-2">{ayah.idn}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 bg-gray-50 rounded-lg shadow border border-green-200 text-center text-gray-700">
                Ayat tidak ditemukan!
              </li>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-center text-lg text-red-500">Surah tidak ditemukan!</p>
      )}
    </div>
  );
}

export default SurahDetail;