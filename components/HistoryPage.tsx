
import React, { useState, useEffect } from 'react';
import { User, Role, HealthRecord } from '../types';
import * as api from '../api';

const HistoryCard: React.FC<{ record: HealthRecord }> = ({ record }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="bg-teal-500 text-white p-3 font-bold text-lg">
            {record.diagnosis}
        </div>
        <div className="p-4 space-y-2">
            <p className="text-sm text-gray-500">
                {new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div>
                <h4 className="font-semibold text-gray-700">Gejala:</h4>
                <p className="text-gray-600">{record.symptoms.join(', ')}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-700">Rekomendasi:</h4>
                <p className="text-gray-600">{record.recommendation}</p>
            </div>
        </div>
    </div>
);


const HistoryPage: React.FC<{ user: User }> = ({ user }) => {
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedRecords = await api.getHealthHistoryForUser(user);
                setRecords(fetchedRecords);
            } catch (err) {
                setError("Gagal memuat riwayat kesehatan.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const title = user.role === Role.SANTRI ? 'Riwayat Kesehatan Anda' : `Riwayat Kesehatan Santri`;

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-12">Memuat riwayat...</div>;
        }

        if (error) {
            return <div className="text-center py-12 text-red-600">{error}</div>;
        }
        
        if (records.length > 0) {
            return (
                <div className="space-y-6">
                    {records.map(record => (
                        <HistoryCard key={record.id} record={record} />
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada riwayat</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {user.role === Role.SANTRI ? 'Anda belum pernah melakukan screening.' : 'Belum ada data riwayat kesehatan untuk santri ini.'}
                </p>
            </div>
        );
    };

    return (
        <div className="container mx-auto max-w-4xl p-6 my-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
            {renderContent()}
        </div>
    );
};

export default HistoryPage;
