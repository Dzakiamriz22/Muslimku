import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCopy } from 'react-icons/fa';

const DoaDetailPage = () => {
    const { id } = useParams();
    const [doa, setDoa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoaDetail = async () => {
            try {
                const response = await fetch(`https://open-api.my.id/api/doa/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch DOA details');
                }
                const data = await response.json();
                setDoa(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoaDetail();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(doa.arab)
            .then(() => alert('Arabic text copied to clipboard!'))
            .catch(err => alert('Failed to copy text: ', err));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 pb-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-lg">
            <button 
                onClick={handleBack} 
                className="mb-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
                aria-label="Back"
            >
                <span className="mr-2">&larr;</span> Kembali
            </button>
            <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">{doa.judul}</h1>
            <div className="flex justify-center items-center mb-4">
                <p className="text-4xl arabic-font border p-2 bg-white rounded shadow-lg">
                    {doa.arab}
                </p>
                <button 
                    onClick={handleCopy} 
                    className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    aria-label="Copy Arabic text"
                >
                    <FaCopy />
                </button>
            </div>
            <p className="text-xl italic text-center text-gray-700 mb-2">{doa.latin}</p>
            <p className="text-lg text-gray-800 bg-gray-50 p-4 rounded shadow-sm">{doa.terjemah}</p>
        </div>
    );
};

export default DoaDetailPage;