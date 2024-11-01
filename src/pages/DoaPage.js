    import React, { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';

    const DoaPage = () => {
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
            return <div className="text-center">Loading...</div>;
        }

        if (error) {
            return <div className="text-center text-red-500">{error}</div>;
        }

        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold text-center mb-4">Doa Sehari-Hari</h1>
                <ul>
                    {doas.map((doa) => (
                        <Link to={`/doa/${doa.id}`} key={doa.id} className="mb-4 block p-4 border rounded shadow hover:bg-gray-100">
                            <h2 className="text-lg font-semibold">{doa.judul}</h2>
                            <p className="italic">{doa.arab}</p>
                            <p className="text-gray-600">{doa.latin}</p>
                            <p className="text-gray-800">{doa.terjemah}</p>
                        </Link>
                    ))}
                </ul>
            </div>
        );
    };

    export default DoaPage;