// File: project/backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import axios from 'axios';
import crypto from 'crypto';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-super-secret-key-please-change-in-env';

let pool;

async function initializeDatabase() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    const connection = await pool.getConnection();
    console.log('✅ Berhasil terhubung ke database MySQL.');
    await createTables(connection);
    await createDefaultAdmin(connection);
    await createDefaultContent(connection);
    connection.release();
    console.log('✅ Inisialisasi database selesai.');
  } catch (err) {
    console.error("❌ KRITIS: Gagal menginisialisasi database. Pastikan file .env sudah benar.", err.message);
    process.exit(1);
  }
}

async function createTables(connection) {
  console.log('🔄 Memeriksa dan membuat tabel...');
  await connection.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, passwordHash VARCHAR(255) NOT NULL, role VARCHAR(50) DEFAULT 'admin')`);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS packages (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      name VARCHAR(255) NOT NULL, 
      price DECIMAL(10, 2) NOT NULL, 
      description TEXT, 
      features JSON, 
      popular BOOLEAN DEFAULT false,
      discord_role_id VARCHAR(255),
      payment_link TEXT
    )
  `);
  await connection.query(`CREATE TABLE IF NOT EXISTS features (id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(50) NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL)`);
  await connection.query(`CREATE TABLE IF NOT EXISTS testimonials (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, role VARCHAR(100), content TEXT NOT NULL, rating INT DEFAULT 5)`);
  await connection.query(`CREATE TABLE IF NOT EXISTS faqs (id INT AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL)`);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS hero_content (
      id INT PRIMARY KEY DEFAULT 1, 
      title VARCHAR(255), 
      subtitle VARCHAR(255), 
      description TEXT, 
      whatsappNumber VARCHAR(50),
      discord_invite_link VARCHAR(255) 
    )
  `);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(255) NOT NULL UNIQUE,
      payment_id VARCHAR(255),
      discord_id VARCHAR(255),
      wallet_address VARCHAR(255),
      product_id INT,
      status VARCHAR(50) NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES packages(id) ON DELETE SET NULL
    )
  `);
  console.log('✅ Semua tabel telah diperiksa dan siap.');
}

async function createDefaultAdmin(connection) {
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      console.log('🔧 Membuat akun admin default...');
      const password = 'Admin123!';
      const hashedPassword = await bcrypt.hash(password, 12);
      await connection.query('INSERT INTO users (username, passwordHash, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin']);
      console.log('✅ Akun admin default dibuat. Username: admin, Password: Admin123!');
    }
}
  
async function createDefaultContent(connection) {
    const [heroRows] = await connection.query('SELECT * FROM hero_content WHERE id = 1');
    if (heroRows.length === 0) {
      console.log('🔧 Membuat konten hero default...');
      await connection.query(
        `INSERT INTO hero_content (id, title, subtitle, description, whatsappNumber, discord_invite_link) VALUES (1, 'Master the Art of Cryptocurrency Trading', 'TRADING CRYPTO ACADEMY', 'The best trading education platform with experienced mentors.', '6281234567890', 'https://discord.gg/your-invite-code')`
      );
    }
}

const safeQuery = async (query, params = []) => {
    const [results] = await pool.query(query, params);
    return results;
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- ENDPOINT PUBLIK ---
app.get('/api/content', async (req, res) => {
    try {
        const heroResult = await safeQuery('SELECT * FROM hero_content WHERE id = 1');
        const featuresResult = await safeQuery('SELECT * FROM features');
        const packagesResult = await safeQuery('SELECT * FROM packages');
        const testimonialsResult = await safeQuery('SELECT * FROM testimonials');
        const faqsResult = await safeQuery('SELECT * FROM faqs');

        const parsedPackages = packagesResult.map(pkg => {
            let parsedFeatures = [];
            if (pkg.features && typeof pkg.features === 'string') {
                try {
                    const parsed = JSON.parse(pkg.features);
                    if (Array.isArray(parsed)) {
                        parsedFeatures = parsed;
                    }
                } catch (e) {
                    console.error(`Gagal parse JSON untuk package id ${pkg.id}:`, pkg.features);
                }
            }
            return { ...pkg, features: parsedFeatures };
        });

        res.json({
            heroContent: heroResult[0] || null,
            features: featuresResult || [],
            packages: parsedPackages || [],
            testimonials: testimonialsResult || [],
            faqs: faqsResult || []
        });
    } catch (error) {
        console.error("❌ Gagal mengambil data konten:", error);
        res.status(500).json({ message: 'Gagal mengambil data konten dari server.', details: error.message });
    }
});


// --- ENDPOINT OTENTIKASI ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!JWT_SECRET || JWT_SECRET === 'your-default-super-secret-key-please-change-in-env') {
            console.error('❌ KRITIS: JWT_SECRET tidak diatur di file .env. Server tidak dapat membuat token.');
            return res.status(500).json({ message: 'Konfigurasi server tidak lengkap.' });
        }

        console.log(`Mencoba login untuk pengguna: ${username}`);
        const users = await safeQuery('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            console.warn(`Pengguna tidak ditemukan: ${username}`);
            return res.status(400).json({ message: 'Username atau password salah' });
        }

        const user = users[0];
        
        if (!user.passwordHash) {
            console.error(`❌ Pengguna ${username} tidak memiliki hash kata sandi di database.`);
            return res.status(500).json({ message: 'Terjadi kesalahan pada data pengguna.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            console.warn(`Kata sandi salah untuk pengguna: ${username}`);
            return res.status(400).json({ message: 'Username atau password salah' });
        }

        console.log(`✅ Login berhasil untuk pengguna: ${username}`);
        
        const sessionId = crypto.randomUUID();
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '24h', jwtid: sessionId }
        );
        
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });

    } catch (error) {
        console.error("❌ Gagal login:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});

// === ENDPOINT BARU UNTUK GANTI PASSWORD ===
app.put('/api/user/change-password', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    try {
        // 1. Validasi input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Kata sandi saat ini dan kata sandi baru diperlukan.' });
        }

        // 2. Ambil hash kata sandi pengguna dari DB
        const users = await safeQuery('SELECT passwordHash FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        const user = users[0];

        // 3. Verifikasi kata sandi saat ini
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: 'Kata sandi saat ini salah.' });
        }

        // 4. Hash dan perbarui kata sandi baru
        const newHashedPassword = await bcrypt.hash(newPassword, 12);
        await safeQuery('UPDATE users SET passwordHash = ? WHERE id = ?', [newHashedPassword, userId]);

        res.status(200).json({ message: 'Kata sandi berhasil diubah.' });

    } catch (error) {
        console.error(`❌ Gagal mengubah kata sandi untuk pengguna ID ${userId}:`, error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengubah kata sandi.' });
    }
});

// --- ENDPOINT WEBHOOK NOWPAYMENTS ---
app.post('/api/nowpayments-webhook', async (req, res) => {
    const { body } = req;
    console.log('🔔 Webhook diterima:', body);
  
    const { payment_id, payment_status, purchase_id, order_description, order_id, pay_address } = body;
    const discord_id = order_description;
  
    if (payment_status === 'finished' && discord_id) {
        console.log(`Pembayaran selesai untuk order ${order_id}, Discord ID: ${discord_id}`);
        try {
            const [packages] = await safeQuery('SELECT discord_role_id FROM packages WHERE id = ?', [purchase_id]);
            if (packages && packages.length > 0 && packages[0].discord_role_id) {
                const roleId = packages[0].discord_role_id;
                const guildId = process.env.DISCORD_GUILD_ID;
                const botToken = process.env.DISCORD_BOT_TOKEN;
      
                await axios.put(`https://discord.com/api/v10/guilds/${guildId}/members/${discord_id}/roles/${roleId}`, {}, { 
                    headers: { 'Authorization': `Bot ${botToken}` } 
                });
                console.log(`✅ SUKSES: Role ${roleId} diberikan kepada pengguna ${discord_id}.`);

                const durationDays = 30;
                const startDate = new Date();
                const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
                const subQuery = `INSERT INTO subscriptions (order_id, payment_id, discord_id, wallet_address, product_id, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), payment_id = VALUES(payment_id), end_date = VALUES(end_date);`;
                await safeQuery(subQuery, [order_id, payment_id, discord_id, pay_address, purchase_id, 'active', startDate, endDate]);
            }
        } catch (apiError) {
            const errorData = apiError.response ? JSON.stringify(apiError.response.data) : apiError.message;
            console.error(`❌ GAGAL memproses webhook untuk ${discord_id}: ${errorData}`);
        }
    }
    res.status(200).send('Webhook diproses');
});

// --- CRUD Endpoints (Protected) ---
const createCrudEndpoints = (tableName) => {
    app.get(`/api/${tableName}`, authenticateToken, async (req, res) => {
        let items = await safeQuery(`SELECT * FROM ${tableName}`);
        if (tableName === 'packages' && items) {
            items = items.map(pkg => {
                let parsedFeatures = [];
                if (pkg.features && typeof pkg.features === 'string') {
                    try {
                        const parsed = JSON.parse(pkg.features);
                        if (Array.isArray(parsed)) {
                            parsedFeatures = parsed;
                        }
                    } catch (e) {
                        // Biarkan array kosong jika gagal
                    }
                }
                return { ...pkg, features: parsedFeatures };
            });
        }
        res.json(items);
    });
    app.post(`/api/${tableName}`, authenticateToken, async (req, res) => {
        const data = { ...req.body };
        if (tableName === 'packages' && data.features && Array.isArray(data.features)) {
            data.features = JSON.stringify(data.features);
        }
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        await safeQuery(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`, values);
        res.status(201).json({ message: 'Item berhasil dibuat' });
    });
    app.put(`/api/${tableName}/:id`, authenticateToken, async (req, res) => {
        const { id } = req.params;
        const data = { ...req.body };
        if (tableName === 'packages' && data.features && Array.isArray(data.features)) {
            data.features = JSON.stringify(data.features);
        }
        const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        await safeQuery(`UPDATE ${tableName} SET ${updates} WHERE id = ?`, values);
        res.json({ message: 'Item berhasil diperbarui' });
    });
    app.delete(`/api/${tableName}/:id`, authenticateToken, async (req, res) => {
        const { id } = req.params;
        await safeQuery(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
        res.json({ message: 'Item berhasil dihapus' });
    });
};

['features', 'packages', 'testimonials', 'faqs'].forEach(createCrudEndpoints);

app.put('/api/hero', authenticateToken, async (req, res) => {
    const { title, subtitle, description, whatsappNumber, discord_invite_link } = req.body;
    await safeQuery('UPDATE hero_content SET title=?, subtitle=?, description=?, whatsappNumber=?, discord_invite_link=? WHERE id = 1', [title, subtitle, description, whatsappNumber, discord_invite_link]);
    res.json({ success: true, message: 'Konten hero berhasil diperbarui' });
});

// --- MENJALANKAN SERVER ---
app.listen(PORT, () => {
  initializeDatabase();
  console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
});
