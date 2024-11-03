import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function DoaList() {
  const [doas, setDoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoas = async () => {
      try {
        const response = await fetch('https://open-api.my.id/api/doa');
        if (!response.ok) {
          throw new Error('Failed to fetch DOAs');
        }
        const data = await response.json();
        
        // Randomly select 3 doas
        const shuffledDoas = data.sort(() => 0.5 - Math.random());
        const randomDoas = shuffledDoas.slice(0, 3);
        
        setDoas(randomDoas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoas();
  }, []);

  if (loading) return <p className="text-center text-green-600">Memuat Doa...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gradient-to-r from-green-100 to-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Doa Harian</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doas.map(doa => (
          <Link 
            to={`/doa/${doa.id}`} 
            key={doa.id} 
            className="bg-white rounded-lg p-6 border border-gray-200 shadow hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden"
            aria-label={`Lihat doa: ${doa.judul}`}
          >
            <h3 className="text-md font-semibold text-green-700 text-center">{doa.judul}</h3>
            <div className="absolute inset-0 bg-green-50 opacity-30 transition-opacity duration-300 hover:opacity-0"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DoaList;
