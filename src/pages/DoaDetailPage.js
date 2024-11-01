import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-gray-600">
                <p>Memuat...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10 pb-24">
            <button 
                onClick={handleBack} 
                className="mb-6 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200"
                aria-label="Back"
            >
                <span className="mr-2">&larr;</span> Kembali
            </button>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{doa.judul}</h1>
            <div className="flex justify-center items-center mb-6">
                <p className="text-4xl arabic-font border border-gray-300 p-4 bg-gray-50 rounded-lg shadow-md">
                    {doa.arab}
                </p>
            </div>
            <p className="text-xl italic text-center text-gray-700 mb-4">{doa.latin}</p>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <p className="text-base text-gray-800">{doa.terjemah}</p>
            </div>
        </div>
    );
};

export default DoaDetailPage;
