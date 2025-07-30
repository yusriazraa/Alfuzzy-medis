
import React, { useState, useEffect } from 'react';
import { FuzzyRule } from '../types';
import * as api from '../api';

const AdminManageRulesPage: React.FC = () => {
    const [rules, setRules] = useState<FuzzyRule[]>([]);
    const [allSymptoms, setAllSymptoms] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [diagnosis, setDiagnosis] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchRulesAndSymptoms = async () => {
        setIsLoading(true);
        try {
            const [fetchedRules, fetchedSymptoms] = await Promise.all([
                api.getFuzzyRules(),
                api.getAllSymptoms()
            ]);
            setRules(fetchedRules);
            setAllSymptoms(fetchedSymptoms);
        } catch (error) {
            console.error("Failed to fetch data", error);
            alert('Gagal memuat data. Coba muat ulang halaman.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRulesAndSymptoms();
    }, []);

    const handleToggleSymptom = (symptom: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
        );
    };
    
    const resetForm = () => {
        setSelectedSymptoms([]);
        setDiagnosis('');
        setRecommendation('');
        setIsAdding(false);
        setIsSubmitting(false);
    }

    const handleAddRule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSymptoms.length === 0 || !diagnosis || !recommendation) {
            alert('Harap lengkapi semua field.');
            return;
        }
        setIsSubmitting(true);
        
        try {
            const newRuleData = { symptoms: selectedSymptoms, diagnosis, recommendation };
            await api.addFuzzyRule(newRuleData);
            await fetchRulesAndSymptoms(); // Re-fetch all rules to get the latest list
            resetForm();
        } catch (error) {
            console.error("Failed to add rule", error);
            alert("Gagal menambahkan rule baru.");
            setIsSubmitting(false);
        }
    };

    const handleDeleteRule = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus rule ini?')) {
            try {
                 await api.deleteFuzzyRule(id);
                 setRules(prevRules => prevRules.filter(rule => rule.id !== id));
            } catch (error) {
                console.error("Failed to delete rule", error);
                alert("Gagal menghapus rule.");
            }
        }
    };


    return (
        <div className="container mx-auto max-w-6xl p-6 my-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Kelola Rules Diagnosis Fuzzy</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-28">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{isAdding ? 'Tambah Rule Baru' : 'Form Penambahan Rule'}</h3>
                        
                        {!isAdding ? (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                + Tambah Rule Baru
                            </button>
                        ) : (
                        <form onSubmit={handleAddRule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Gejala (bisa lebih dari satu):</label>
                                <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-2">
                                    {allSymptoms.map(symptom => (
                                    <label key={symptom} className={`flex items-center p-2 rounded-md cursor-pointer ${selectedSymptoms.includes(symptom) ? 'bg-teal-50' : ''}`}>
                                        <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                        checked={selectedSymptoms.includes(symptom)}
                                        onChange={() => handleToggleSymptom(symptom)}
                                        />
                                        <span className="ml-3 text-sm text-gray-700">{symptom}</span>
                                    </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Hasil Diagnosis:</label>
                                <input
                                    type="text"
                                    id="diagnosis"
                                    value={diagnosis}
                                    onChange={e => setDiagnosis(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    placeholder="Contoh: Kemungkinan ISPA"
                                    required
                                />
                            </div>
                             <div>
                                <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">Rekomendasi:</label>
                                <textarea
                                    id="recommendation"
                                    value={recommendation}
                                    onChange={e => setRecommendation(e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    placeholder="Tuliskan rekomendasi tindakan..."
                                    required
                                ></textarea>
                            </div>
                            <div className="flex space-x-2">
                                <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                    {isSubmitting ? 'Menyimpan...': 'Simpan Rule'}
                                </button>
                                <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Batal</button>
                            </div>
                        </form>
                        )}
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {isLoading ? <p>Loading rules...</p> : rules.map(rule => (
                            <div key={rule.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                <div className="p-4 flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-teal-700">{rule.diagnosis}</h4>
                                        <div className="mt-2">
                                            <p className="text-sm font-semibold text-gray-600">Jika Gejala:</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {rule.symptoms.map(symptom => (
                                                    <span key={symptom} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full">{symptom}</span>
                                                ))}
                                            </div>
                                        </div>
                                         <div className="mt-3">
                                            <p className="text-sm font-semibold text-gray-600">Maka Rekomendasi:</p>
                                            <p className="text-sm text-gray-800 mt-1">{rule.recommendation}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteRule(rule.id)}
                                        className="ml-4 flex-shrink-0 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 hover:text-red-800 transition"
                                        aria-label="Hapus rule"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                         {!isLoading && rules.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                <h3 className="text-sm font-medium text-gray-900">Belum ada rule yang dibuat</h3>
                                <p className="mt-1 text-sm text-gray-500">Silakan tambahkan rule baru menggunakan form di samping.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManageRulesPage;
