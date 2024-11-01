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
        navigate(-1); // Go back to the previous page
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(doa.arab)
            .then(() => alert('Arabic text copied to clipboard!'))
            .catch(err => alert('Failed to copy text: ', err));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-lg">
            <button 
                onClick={handleBack} 
                className="mb-4 text-blue-600 hover:underline"
            >
                &larr; Back
            </button>
            <h1 className="text-5xl font-bold text-center mb-6 text-gray-800">{doa.judul}</h1>
            <div className="flex justify-center items-center mb-4">
                <p className="text-4xl arabic-font border p-2 bg-white rounded shadow-lg transition-transform transform hover:scale-105">
                    {doa.arab}
                </p>
                <button 
                    onClick={handleCopy} 
                    className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    aria-label="Copy Arabic text"
                >
                    <FaCopy />
                </button>
            </div>
            <p className="text-2xl italic text-center text-gray-700 mb-4">{doa.latin}</p>
            <p className="text-lg text-gray-800 bg-gray-50 p-4 rounded shadow-sm">{doa.terjemah}</p>
        </div>
    );
};

export default DoaDetailPage;
