import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Cari Surah..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 bg-white text-gray-800 placeholder-gray-400 shadow-md"
    />
  );
}

function SurahMekah() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://quran-api.santrikoding.com/api/surah')
      .then((res) => res.json())
      .then((data) => {
        const filteredSurahs = data.filter(surah => surah.tempat_turun === 'mekah');
        setSurahs(filteredSurahs);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-green-600">Memuat...</p>;
  }

  const filteredSurahs = surahs.filter(surah =>
    surah.nama_latin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-r from-green-50 to-white rounded-md shadow-lg mb-20">
      <h1 className="text-4xl font-bold text-center mb-4 text-green-700">Muslimku</h1>
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Surah Mekah</h2>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredSurahs.length === 0 && searchTerm ? (
          <p className="text-center text-gray-600 col-span-full">No Surahs found for "{searchTerm}".</p>
        ) : (
          filteredSurahs.map(surah => (
            <Link to={`/surah/${surah.nomor}`} key={surah.nomor} className="bg-white shadow-md rounded-lg p-4 border border-green-100 transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="flex flex-col items-start">
                <span className="text-xl font-semibold text-green-800">{surah.nama_latin}</span>
                <span className="text-xl font-semibold text-green-900 mt-1">{surah.nama}</span>
                <span className="text-green-700 text-sm italic">{surah.arti}</span>
                <span className="mt-2 text-sm text-gray-500">Nomor: {surah.nomor}</span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500 capitalize">{surah.tempat_turun}</span>
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Surah</span>
              </div>
              <p className="mt-2 text-gray-600 text-xs leading-relaxed">Penjelasan singkat atau info tambahan tentang Surah.</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default SurahMekah;
