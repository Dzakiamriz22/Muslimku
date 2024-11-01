import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <input
            type="text"
            placeholder="Cari DOA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
        />
    );
}

const DoaPage = () => {
    const [doas, setDoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDoas = async () => {
            try {
                const response = await fetch('https://open-api.my.id/api/doa');
                if (!response.ok) {
                    throw new Error('Failed to fetch DOAs');
                }
                const data = await response.json();
                setDoas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoas();
    }, []);

    if (loading) {
        return <div className="text-center text-green-600">Memuat...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    const filteredDoas = doas.filter(doa =>
        doa.judul.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-20 border border-green-100">
            <h1 className="text-4xl font-bold text-center mb-4 text-green-700">Doa Sehari-Hari</h1>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ul className="mt-4">
                {filteredDoas.length === 0 ? (
                    <p className="text-center text-gray-600">Tidak ada doa yang ditemukan.</p>
                ) : (
                    filteredDoas.map((doa) => (
                        <li key={doa.id} className="mb-2">
                            <Link
                                to={`/doa/${doa.id}`}
                                className="block p-4 bg-green-50 rounded-md shadow hover:bg-green-100 transition duration-200"
                            >
                                <h2 className="text-lg font-medium text-green-800">{doa.judul}</h2>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default DoaPage;
