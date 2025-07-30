import { Role, User, HealthRecord, FuzzyRule } from './types';

// Alamat base URL dari server backend Anda
const API_BASE_URL = 'http://localhost:3001/api';

// =================================================================
// FUNGSI API YANG TERHUBUNG KE BACKEND
// =================================================================

// --- Autentikasi ---

export const login = async (username: string, _password?: string): Promise<User> => {
    // Di aplikasi nyata, Anda juga harus mengirim password
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login gagal.');
    }

    const user: User = await response.json();
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    return user;
};

export const logout = (): Promise<void> => {
    sessionStorage.removeItem('loggedInUser');
    return Promise.resolve();
};

export const checkSession = (): Promise<User | null> => {
    const userJson = sessionStorage.getItem('loggedInUser');
    const user = userJson ? JSON.parse(userJson) : null;
    return Promise.resolve(user);
};


// --- Manajemen Aturan Fuzzy (Admin) ---

export const getFuzzyRules = async (): Promise<FuzzyRule[]> => {
    const response = await fetch(`${API_BASE_URL}/rules`);
    if (!response.ok) {
        throw new Error('Gagal memuat aturan fuzzy.');
    }
    return response.json();
};

export const addFuzzyRule = async (newRuleData: Omit<FuzzyRule, 'id'>): Promise<FuzzyRule> => {
    const response = await fetch(`${API_BASE_URL}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRuleData),
    });
    if (!response.ok) {
        throw new Error('Gagal menambahkan aturan baru.');
    }
    return response.json();
};

export const deleteFuzzyRule = async (ruleId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/rules/${ruleId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Gagal menghapus aturan.');
    }
};


// --- Riwayat Kesehatan ---

export const getHealthHistoryForUser = async (user: User): Promise<HealthRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/history/${user.id}`);
    if (!response.ok) {
        throw new Error('Gagal memuat riwayat kesehatan.');
    }
    // Backend sudah mengurus logika untuk mengambil data anak jika peran adalah ORANG_TUA
    return response.json();
};

export const addHealthRecord = async (santriId: string, screeningResult: Omit<HealthRecord, 'id' | 'santriId' | 'date' | 'symptoms_text'>): Promise<HealthRecord> => {
     const response = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ santriId, ...screeningResult }),
     });
     if (!response.ok) {
        throw new Error('Gagal menyimpan catatan kesehatan.');
     }
     return response.json();
};

// --- Data Umum ---

export const getAllSymptoms = async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/symptoms`);
    if (!response.ok) {
        throw new Error('Gagal memuat daftar gejala.');
    }
    return response.json();
};