const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors()); // Mengizinkan request dari frontend
app.use(express.json()); // Mem-parsing body request JSON

const PORT = process.env.PORT || 3001;

// === API ENDPOINTS ===

// 1. Autentikasi
app.post('/api/login', async (req, res) => {
    const { username } = req.body;
    // Di aplikasi nyata, Anda harus memeriksa password.
    // Untuk demo ini, kita hanya menggunakan username.
    const mockUserIds = {
        'admin': 'admin01',
        'santri': 'santri01',
        'orangtua': 'parent01',
    };
    const userId = mockUserIds[username.toLowerCase()];

    if (!userId) {
        return res.status(404).json({ message: 'Username tidak ditemukan.' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'User tidak ditemukan di database.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Gejala (Data Master)
app.get('/api/symptoms', async (req, res) => {
    try {
        const result = await db.query('SELECT name FROM symptoms ORDER BY name ASC');
        res.json(result.rows.map(row => row.name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Manajemen Aturan Fuzzy (CRUD)
app.get('/api/rules', async (req, res) => {
    try {
        const query = `
            SELECT r.id, r.diagnosis, r.recommendation, array_agg(s.name) as symptoms
            FROM fuzzy_rules r
            JOIN rule_symptoms rs ON r.id = rs.rule_id
            JOIN symptoms s ON rs.symptom_id = s.id
            GROUP BY r.id
            ORDER BY r.id DESC;
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/rules', async (req, res) => {
    const { symptoms, diagnosis, recommendation } = req.body;
    const ruleId = `rule_${Date.now()}`;

    const client = await db.query('BEGIN');
    try {
        const ruleInsertQuery = 'INSERT INTO fuzzy_rules (id, diagnosis, recommendation) VALUES ($1, $2, $3) RETURNING *';
        const newRule = await db.query(ruleInsertQuery, [ruleId, diagnosis, recommendation]);

        const symptomIds = await Promise.all(symptoms.map(async (symptomName) => {
            const res = await db.query('SELECT id FROM symptoms WHERE name = $1', [symptomName]);
            return res.rows[0].id;
        }));

        for (const symptomId of symptomIds) {
            await db.query('INSERT INTO rule_symptoms (rule_id, symptom_id) VALUES ($1, $2)', [ruleId, symptomId]);
        }

        await db.query('COMMIT');
        res.status(201).json({ id: ruleId, ...req.body });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/rules/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM fuzzy_rules WHERE id = $1', [id]);
        res.status(204).send(); // No Content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Riwayat Kesehatan
app.get('/api/history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userResult = await db.query('SELECT role, child_id FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) return res.status(404).send();

        const user = userResult.rows[0];
        let targetSantriId = userId;
        if (user.role === 'ORANG_TUA') {
            targetSantriId = user.child_id;
        }

        const historyResult = await db.query('SELECT * FROM health_records WHERE santri_id = $1 ORDER BY date DESC', [targetSantriId]);
        res.json(historyResult.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/records', async (req, res) => {
    const { santriId, symptoms, diagnosis, recommendation } = req.body;
    const recordId = `rec_${Date.now()}`;

    try {
        const query = 'INSERT INTO health_records (id, santri_id, symptoms_text, diagnosis, recommendation) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const newRecord = await db.query(query, [recordId, santriId, symptoms.join(', '), diagnosis, recommendation]);
        res.status(201).json(newRecord.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Backend server berjalan di http://localhost:${PORT}`);
});