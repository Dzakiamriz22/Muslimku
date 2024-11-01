import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SurahDetail() {
  const { id } = useParams();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState(''); // State for the selected Ayah

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

  // Function to handle Ayah selection from the dropdown
  const handleAyahChange = (e) => {
    setSelectedAyah(e.target.value);
  };

  // Determine which Ayahs to display based on selectedAyah
  const displayedAyahs = selectedAyah
    ? surah?.ayat.filter((ayah) => ayah.nomor === Number(selectedAyah))
    : surah?.ayat;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : surah ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">{surah.nama_latin}</h1>
          <p className="text-gray-600 text-lg mb-4 italic text-center">{surah.deskripsi}</p>
          <audio controls src={surah.audio} className="w-full mb-6 rounded-lg shadow-md" />

          {/* Dropdown for selecting Ayah */}
          <div className="mb-4">
            <select
              value={selectedAyah}
              onChange={handleAyahChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">Pilih Ayah</option>
              {/* Generate options from 1 to jumlah_ayat */}
              {Array.from({ length: surah.jumlah_ayat }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  Ayat {index + 1}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">Ayat</h2>
          <ul className="space-y-4">
            {displayedAyahs && displayedAyahs.length > 0 ? (
              displayedAyahs.map((ayah) => (
                <li key={ayah.id} className="p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300">
                  <p className="text-xl text-right text-gray-900 border-b border-gray-400 pb-2">{ayah.ar}</p>
                  <p className="text-lg text-gray-700 mt-2">{ayah.idn}</p>
                </li>
              ))
            ) : (
              <li className="p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300 text-center text-gray-700">
                Ayah tidak ditemukan!
              </li>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-center text-lg text-red-500">Surah not found!</p>
      )}
    </div>
  );
}

export default SurahDetail;
