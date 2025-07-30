import { Role, User, HealthRecord, FuzzyRule } from './types';
import { db, auth } from './firebaseConfig';
import { 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    doc, 
    query, 
    where,
    orderBy,
    getDoc,
    Timestamp
} from "firebase/firestore";
import { 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from "firebase/auth";

// =================================================================
// FIREBASE API IMPLEMENTATION
// This file now connects to a real Firebase backend.
//
// IMPORTANT FOR DEMO:
// The database must be seeded with initial data for this to work.
// Collections needed: 'users', 'fuzzyRules', 'healthRecords', 'symptoms'.
//
// DEMO LOGIN CREDENTIALS (must exist in Firebase Auth & 'users' collection):
// - Username: santri   => Email: santri@demo.com
// - Username: orangtua => Email: orangtua@demo.com
// - Username: admin    => Email: admin@demo.com
// - Password for all: "password123"
// =================================================================

// --- Helper to convert Firestore Timestamps ---
const convertTimestamp = (record: any) => {
    if (record.date && record.date instanceof Timestamp) {
        return { ...record, date: record.date.toDate().toISOString() };
    }
    return record;
};

// --- Authentication ---

const usernameToEmail: Record<string, string> = {
    'santri': 'santri@demo.com',
    'orangtua': 'orangtua@demo.com',
    'admin': 'admin@demo.com',
}

export const login = async (username: string, password?: string): Promise<User> => {
    let email: string | undefined;
    const lowerCaseUsername = username.toLowerCase();

    // Handle both simple usernames (e.g., "santri") and full emails
    if (lowerCaseUsername.includes('@')) {
        email = lowerCaseUsername;
    } else {
        email = usernameToEmail[lowerCaseUsername];
    }

    if (!email) {
        throw new Error('Username tidak valid. Gunakan username (cth: santri) atau email lengkap.');
    }
    if (!password) {
        throw new Error('Password diperlukan.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        throw new Error("User data not found in database.");
    }
    
    // Combine auth data with firestore data
    const userData = userDocSnap.data() as Omit<User, 'id'>;
    return { id: firebaseUser.uid, ...userData };
};

export const logout = (): Promise<void> => {
    return signOut(auth);
};

// Replaces checkSession. Sets up a listener.
export const onSessionChange = (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            try {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data() as Omit<User, 'id'>;
                    callback({ id: firebaseUser.uid, ...userData });
                } else {
                    console.error("User logged in but no data in Firestore.");
                    callback(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};


// --- Fuzzy Rules Management (for Admin) ---
export const getFuzzyRules = async (): Promise<FuzzyRule[]> => {
    const rulesCollection = collection(db, 'fuzzyRules');
    const q = query(rulesCollection);
    const rulesSnapshot = await getDocs(q);
    return rulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FuzzyRule));
};

export const addFuzzyRule = async (newRuleData: Omit<FuzzyRule, 'id'>): Promise<FuzzyRule> => {
    const rulesCollection = collection(db, 'fuzzyRules');
    const docRef = await addDoc(rulesCollection, newRuleData);
    return { id: docRef.id, ...newRuleData };
};

export const deleteFuzzyRule = (ruleId: string): Promise<void> => {
    const ruleDoc = doc(db, 'fuzzyRules', ruleId);
    return deleteDoc(ruleDoc);
};


// --- Health Records ---
export const getHealthHistoryForUser = async (user: User): Promise<HealthRecord[]> => {
    const recordsCollection = collection(db, 'healthRecords');
    let q;

    if (user.role === Role.SANTRI) {
        q = query(recordsCollection, where("santriId", "==", user.id), orderBy("date", "desc"));
    } else if (user.role === Role.ORANG_TUA && user.childId) {
        q = query(recordsCollection, where("santriId", "==", user.childId), orderBy("date", "desc"));
    } else {
        return []; // No records for other roles or parents without childId
    }
    
    const recordsSnapshot = await getDocs(q);
    return recordsSnapshot.docs.map(doc => {
  const data = doc.data() as Record<string, any>;
  return convertTimestamp({ id: doc.id, ...data }) as HealthRecord;
});
};

export const addHealthRecord = async (santriId: string, screeningResult: Omit<HealthRecord, 'id' | 'santriId' | 'date'>): Promise<HealthRecord> => {
     const newRecordData = {
        santriId: santriId,
        date: Timestamp.now(), // Use Firestore Timestamp
        ...screeningResult,
      };
      const recordsCollection = collection(db, 'healthRecords');
      const docRef = await addDoc(recordsCollection, newRecordData);
      
      const addedRecord: HealthRecord = {
          id: docRef.id,
          date: newRecordData.date.toDate().toISOString(),
          santriId: newRecordData.santriId,
          symptoms: newRecordData.symptoms,
          diagnosis: newRecordData.diagnosis,
          recommendation: newRecordData.recommendation
      }
      return addedRecord;
};

// --- General Data ---
// Assumes a 'symptoms' collection with a single document 'all' containing a 'list' array field.
export const getAllSymptoms = async (): Promise<string[]> => {
    try {
        const symptomsDocRef = doc(db, 'symptoms', 'all');
        const docSnap = await getDoc(symptomsDocRef);
        if (docSnap.exists() && docSnap.data().list) {
            return docSnap.data().list as string[];
        }
        console.warn("Symptoms document not found or is empty. Returning default list.");
        // Fallback for demo purposes if firestore is not seeded
        return [
            'Demam', 'Batuk', 'Pilek', 'Sakit Tenggorokan', 'Nyeri Menelan', 'Bengkak Pipi',
            'Mata Merah', 'Mata Berair', 'Nyeri Otot', 'Sakit Kepala', 'Lecet Kulit Berisi Air',
            'Ruam Merah', 'Gatal Hebat Malam Hari', 'Luka di Sudut Bibir', 'Sariawan'
        ];
    } catch (error) {
        console.error("Error fetching symptoms: ", error);
        return []; // Return empty on error
    }
};