-- Tabel untuk menyimpan peran pengguna (Enum Type)
CREATE TYPE user_role AS ENUM ('SANTRI', 'ORANG_TUA', 'ADMIN');

-- Tabel Pengguna
-- Menyimpan data login untuk semua jenis pengguna.
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    child_id VARCHAR(50) REFERENCES users(id) -- Kolom untuk relasi orang tua ke santri
);

-- Tabel Gejala
-- Menyimpan semua kemungkinan gejala sebagai data master.
CREATE TABLE symptoms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Tabel Aturan Fuzzy
-- Menyimpan aturan diagnosis yang dikelola oleh admin.
CREATE TABLE fuzzy_rules (
    id VARCHAR(50) PRIMARY KEY,
    diagnosis VARCHAR(255) NOT NULL,
    recommendation TEXT NOT NULL
);

-- Tabel Penghubung (Junction Table) untuk aturan dan gejala
-- Karena satu aturan bisa memiliki banyak gejala.
CREATE TABLE rule_symptoms (
    rule_id VARCHAR(50) REFERENCES fuzzy_rules(id) ON DELETE CASCADE,
    symptom_id INTEGER REFERENCES symptoms(id) ON DELETE CASCADE,
    PRIMARY KEY (rule_id, symptom_id)
);

-- Tabel Riwayat Kesehatan
-- Menyimpan setiap hasil screening yang dilakukan oleh santri.
CREATE TABLE health_records (
    id VARCHAR(50) PRIMARY KEY,
    santri_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diagnosis VARCHAR(255) NOT NULL,
    recommendation TEXT NOT NULL,
    symptoms_text TEXT NOT NULL -- Menyimpan gejala sebagai teks untuk kemudahan
);

-- --- Contoh Data Awal ---
-- Isi tabel users (sesuai MOCK_USERS di api.ts)
INSERT INTO users (id, name, role) VALUES ('admin01', 'Admin Pesantren', 'ADMIN');
INSERT INTO users (id, name, role) VALUES ('santri01', 'Ahmad Zaini', 'SANTRI');
INSERT INTO users (id, name, role, child_id) VALUES ('parent01', 'Bapak Abdullah', 'ORANG_TUA', 'santri01');

-- Isi tabel symptoms (sesuai allSymptoms di api.ts)
INSERT INTO symptoms (name) VALUES
('Demam'), ('Batuk'), ('Pilek'), ('Sakit Tenggorokan'), ('Nyeri Menelan'), ('Bengkak Pipi'),
('Mata Merah'), ('Mata Berair'), ('Nyeri Otot'), ('Sakit Kepala'), ('Lecet Kulit Berisi Air'),
('Ruam Merah'), ('Gatal Hebat Malam Hari'), ('Luka di Sudut Bibir'), ('Sariawan');

-- Isi tabel fuzzy_rules (sesuai mockFuzzyRules di api.ts)
INSERT INTO fuzzy_rules (id, diagnosis, recommendation) VALUES
('rule1', 'Kemungkinan Scabies', 'Segera konsultasi ke pos kesehatan. Hindari kontak fisik dan berbagi barang pribadi.'),
('rule2', 'Kemungkinan Parotitis (Gondongan)', 'Istirahat yang cukup, kompres area bengkak, dan hubungi petugas kesehatan.'),
('rule3', 'Kemungkinan Common Cold', 'Perbanyak minum air hangat, istirahat, dan konsumsi makanan bergizi.');

-- Hubungkan aturan dengan gejalanya
INSERT INTO rule_symptoms (rule_id, symptom_id) VALUES
('rule1', (SELECT id from symptoms WHERE name = 'Gatal Hebat Malam Hari')),
('rule1', (SELECT id from symptoms WHERE name = 'Ruam Merah')),
('rule2', (SELECT id from symptoms WHERE name = 'Bengkak Pipi')),
('rule2', (SELECT id from symptoms WHERE name = 'Demam')),
('rule3', (SELECT id from symptoms WHERE name = 'Batuk')),
('rule3', (SELECT id from symptoms WHERE name = 'Pilek')),
('rule3', (SELECT id from symptoms WHERE name = 'Sakit Tenggorokan'));