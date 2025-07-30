
import { Role, User, HealthRecord, FuzzyRule } from './types';

// =================================================================
// SIMULASI DATABASE & BACKEND
// Di aplikasi nyata, data ini akan ada di database (PostgreSQL, MongoDB, dll.)
// dan logika di bawah akan ada di server backend (Node.js, Python, dll.)
// =================================================================

const FAKE_LATENCY = 500; // 0.5 detik

// --- Mock Database Tables ---
const MOCK_USERS: Record<string, User> = {
  santri: { id: 'santri01', name: 'Ahmad Zaini', role: Role.SANTRI },
  orangtua: { id: 'parent01', name: 'Bapak Abdullah', role: Role.ORANG_TUA, childId: 'santri01' },
  admin: { id: 'admin01', name: 'Admin Pesantren', role: Role.ADMIN },
};

let mockHealthRecords: HealthRecord[] = [];

let mockFuzzyRules: FuzzyRule[] = [
    { id: 'rule1', symptoms: ['Gatal Hebat Malam Hari', 'Ruam Merah'], diagnosis: 'Kemungkinan Scabies', recommendation: 'Segera konsultasi ke pos kesehatan. Hindari kontak fisik dan berbagi barang pribadi.' },
    { id: 'rule2', symptoms: ['Bengkak Pipi', 'Demam'], diagnosis: 'Kemungkinan Parotitis (Gondongan)', recommendation: 'Istirahat yang cukup, kompres area bengkak, dan hubungi petugas kesehatan.' },
    { id: 'rule3', symptoms: ['Batuk', 'Pilek', 'Sakit Tenggorokan'], diagnosis: 'Kemungkinan Common Cold', recommendation: 'Perbanyak minum air hangat, istirahat, dan konsumsi makanan bergizi.' },
];

const allSymptoms = [
  'Demam', 'Batuk', 'Pilek', 'Sakit Tenggorokan', 'Nyeri Menelan', 'Bengkak Pipi',
  'Mata Merah', 'Mata Berair', 'Nyeri Otot', 'Sakit Kepala', 'Lecet Kulit Berisi Air',
  'Ruam Merah', 'Gatal Hebat Malam Hari', 'Luka di Sudut Bibir', 'Sariawan'
];

// --- Fake API Functions ---

// Helper untuk meniru latensi jaringan
const simulateRequest = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation
        }, FAKE_LATENCY);
    });
};

// Authentication
export const login = (username: string, _password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = MOCK_USERS[username.toLowerCase()];
            if (user) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                resolve(JSON.parse(JSON.stringify(user)));
            } else {
                reject(new Error('Username tidak ditemukan.'));
            }
        }, FAKE_LATENCY);
    });
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


// Fuzzy Rules Management (for Admin)
export const getFuzzyRules = (): Promise<FuzzyRule[]> => {
    return simulateRequest(mockFuzzyRules);
};

export const addFuzzyRule = (newRuleData: Omit<FuzzyRule, 'id'>): Promise<FuzzyRule> => {
    const newRule: FuzzyRule = {
        id: `rule_${Date.now()}`,
        ...newRuleData,
    };
    mockFuzzyRules.unshift(newRule);
    return simulateRequest(newRule);
};

export const deleteFuzzyRule = (ruleId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = mockFuzzyRules.length;
            mockFuzzyRules = mockFuzzyRules.filter(rule => rule.id !== ruleId);
            if (mockFuzzyRules.length < initialLength) {
                resolve();
            } else {
                reject(new Error("Rule tidak ditemukan."));
            }
        }, FAKE_LATENCY);
    });
};


// Health Records
export const getHealthHistoryForUser = (user: User): Promise<HealthRecord[]> => {
    let records: HealthRecord[] = [];
    if (user.role === Role.SANTRI) {
        records = mockHealthRecords.filter(r => r.santriId === user.id);
    } else if (user.role === Role.ORANG_TUA && user.childId) {
        records = mockHealthRecords.filter(r => r.santriId === user.childId);
    }
    return simulateRequest(records);
};

export const addHealthRecord = (santriId: string, screeningResult: Omit<HealthRecord, 'id' | 'santriId' | 'date'>): Promise<HealthRecord> => {
     const newRecord: HealthRecord = {
        id: `rec_${Date.now()}`,
        santriId: santriId,
        date: new Date().toISOString(),
        ...screeningResult,
      };
      mockHealthRecords.unshift(newRecord);
      return simulateRequest(newRecord);
};

// General Data
export const getAllSymptoms = (): Promise<string[]> => {
    return simulateRequest(allSymptoms);
};
