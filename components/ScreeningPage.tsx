
import React, { useState, useEffect } from 'react';
import { User, HealthRecord } from '../types';
import * as api from '../api';

interface ScreeningPageProps {
  user: User;
  onScreeningComplete: () => void;
}

const ScreeningPage: React.FC<ScreeningPageProps> = ({ user, onScreeningComplete }) => {
  const [allSymptoms, setAllSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<HealthRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const fetchSymptoms = async () => {
          try {
              const symptoms = await api.getAllSymptoms();
              setAllSymptoms(symptoms);
          } catch(error) {
              console.error("Failed to fetch symptoms", error);
          } finally {
              setIsLoading(false);
          }
      };
      fetchSymptoms();
  }, []);

  const handleToggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const simulateFuzzyDiagnosis = (): Omit<HealthRecord, 'id' | 'santriId' | 'date'> => {
      const s = new Set(selectedSymptoms);
      if (s.has('Gatal Hebat Malam Hari') && s.has('Ruam Merah')) return { symptoms: selectedSymptoms, diagnosis: 'Kemungkinan Scabies', recommendation: 'Segera konsultasi ke pos kesehatan. Hindari kontak fisik dan berbagi barang pribadi.' };
      if (s.has('Bengkak Pipi') && s.has('Demam')) return { symptoms: selectedSymptoms, diagnosis: 'Kemungkinan Parotitis (Gondongan)', recommendation: 'Istirahat yang cukup, kompres area bengkak, dan hubungi petugas kesehatan.' };
      if (s.has('Batuk') && s.has('Pilek') && s.has('Sakit Tenggorokan')) return { symptoms: selectedSymptoms, diagnosis: 'Kemungkinan Common Cold', recommendation: 'Perbanyak minum air hangat, istirahat, dan konsumsi makanan bergizi.' };
      if (s.has('Demam') && s.has('Batuk') && s.has('Nyeri Otot')) return { symptoms: selectedSymptoms, diagnosis: 'Kemungkinan ISPA / Influenza', recommendation: 'Gunakan masker, istirahat, dan segera lapor ke pos kesehatan untuk pemeriksaan lebih lanjut.' };
      if (s.has('Mata Merah') && s.has('Mata Berair')) return { symptoms: selectedSymptoms, diagnosis: 'Kemungkinan Konjungtivitis', recommendation: 'Jangan mengucek mata, gunakan lap bersih untuk membersihkan, dan hubungi petugas kesehatan.' };
      if (s.has('Ruam Merah')) return { symptoms: selectedSymptoms, diagnosis: 'Kemungkinan Dermatitis', recommendation: 'Jaga kebersihan kulit, hindari menggaruk, dan konsultasikan ke petugas kesehatan.' };
      if (s.has('Sariawan') || s.has('Luka di Sudut Bibir')) return { symptoms: selectedSymptoms, diagnosis: 'Kemungkinan Stomatitis', recommendation: 'Jaga kebersihan mulut, hindari makanan pedas/asam, dan gunakan obat sariawan jika perlu.' };
      
      return { symptoms: selectedSymptoms, diagnosis: 'Gejala Umum', recommendation: 'Jaga kondisi tubuh, perbanyak istirahat. Jika gejala berlanjut atau memburuk, segera hubungi petugas kesehatan.' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(selectedSymptoms.length === 0) return;
    setIsSubmitting(true);
    
    const diagnosisResult = simulateFuzzyDiagnosis();
    
    try {
        const newRecord = await api.addHealthRecord(user.id, diagnosisResult);
        setResult(newRecord);
    } catch (error) {
        console.error("Failed to submit screening", error);
        alert("Gagal menyimpan hasil screening. Coba lagi.");
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (result) {
    return (
        <div className="container mx-auto max-w-2xl p-6 my-10 bg-white rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-center text-teal-700 mb-4">Hasil Screening Anda</h2>
            <div className="bg-teal-50 p-6 rounded-lg border border-teal-200 space-y-4">
                <p><strong className="font-semibold text-gray-700">Tanggal:</strong> {new Date(result.date).toLocaleString('id-ID')}</p>
                <p><strong className="font-semibold text-gray-700">Gejala Dilaporkan:</strong> {result.symptoms.join(', ')}</p>
                <div>
                    <strong className="font-semibold text-gray-700">Diagnosis Awal:</strong>
                    <p className="text-xl font-bold text-red-600 mt-1">{result.diagnosis}</p>
                </div>
                <div>
                    <strong className="font-semibold text-gray-700">Rekomendasi:</strong>
                    <p className="text-gray-600 mt-1">{result.recommendation}</p>
                </div>
                <p className="text-sm text-gray-500 mt-4 italic">Penting: Hasil ini adalah deteksi dini dan bukan pengganti diagnosis medis profesional. Segera hubungi petugas kesehatan untuk penanganan lebih lanjut.</p>
            </div>
            <button
                onClick={onScreeningComplete}
                className="w-full mt-6 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors duration-300"
            >
                Lihat Riwayat Kesehatan
            </button>
        </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-10">Memuat daftar gejala...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 my-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Screening Kesehatan Mandiri</h2>
        <p className="text-gray-600 mb-6">Pilih semua gejala yang Anda rasakan saat ini. Sistem akan membantu memberikan diagnosis awal.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allSymptoms.map(symptom => (
              <label
                key={symptom}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedSymptoms.includes(symptom)
                    ? 'bg-teal-100 border-teal-500'
                    : 'bg-white border-gray-200 hover:border-teal-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleToggleSymptom(symptom)}
                />
                <span className="ml-3 text-sm font-medium text-gray-700">{symptom}</span>
              </label>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting || selectedSymptoms.length === 0}
              className="bg-teal-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-teal-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendiagnosis...
                </>
              ) : 'Dapatkan Hasil Diagnosis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScreeningPage;
