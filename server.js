const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Create Express app
const app = express();

// Global database connection
let db;

// Database initialization function
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        console.log('🚀 Starting EDUCE SQLite database initialization...');
        
        // Create database directory if it doesn't exist
        const dbDir = path.join(__dirname, 'database');
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // SQLite database file path
        const dbPath = path.join(dbDir, 'educe.db');
        console.log(`📁 Database path: ${dbPath}`);

        // Create SQLite connection
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err);
                reject(err);
                return;
            }
            console.log('✅ Connected to SQLite database');
            
            // Enable foreign keys
            db.run('PRAGMA foreign_keys = ON');
            
            // Create tables
            createTables()
                .then(() => insertDefaultData())
                .then(() => {
                    console.log('✅ Database initialization completed successfully');
                    resolve();
                })
                .catch(reject);
        });
    });
}

// Create tables function
async function createTables() {
    return new Promise((resolve, reject) => {
        console.log('🔍 Creating tables and indexes...');
        
        const createTablesSQL = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'psychologist', 'admin')),
                phone TEXT,
                approved INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS psychologists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                psychologist_id TEXT UNIQUE NOT NULL,
                title TEXT NOT NULL,
                specializations TEXT DEFAULT '[]',
                experience TEXT,
                rating REAL DEFAULT 4.5,
                completed_assessments INTEGER DEFAULT 0,
                description TEXT,
                available INTEGER DEFAULT 1,
                approved INTEGER DEFAULT 0,
                approved_by TEXT,
                approved_date DATETIME,
                rejected_by TEXT,
                rejected_date DATETIME,
                registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS children (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                gender TEXT,
                interests TEXT DEFAULT '[]',
                notes TEXT,
                status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'accepted', 'games_completed', 'completed')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS assessment_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                request_id TEXT UNIQUE NOT NULL,
                child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
                psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
                parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                child_name TEXT NOT NULL,
                child_age INTEGER NOT NULL,
                child_interests TEXT DEFAULT '[]',
                parent_notes TEXT,
                status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                response_date DATETIME,
                report_generated_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS game_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
                psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
                child_name TEXT NOT NULL,
                answers TEXT NOT NULL,
                completed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS ai_analysis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
                psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
                child_name TEXT NOT NULL,
                age INTEGER NOT NULL,
                gender TEXT,
                grade TEXT,
                iq_score INTEGER,
                verbal_reasoning INTEGER,
                numerical_reasoning INTEGER,
                spatial_reasoning INTEGER,
                memory_score INTEGER,
                processing_speed INTEGER,
                extroversion INTEGER,
                conscientiousness INTEGER,
                openness INTEGER,
                creativity INTEGER,
                interests TEXT DEFAULT '[]',
                observations TEXT,
                ai_report TEXT,
                report_generated INTEGER DEFAULT 0,
                assessment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS api_configs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                service_name TEXT NOT NULL,
                api_key_encrypted TEXT,
                config_data TEXT DEFAULT '{}',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            CREATE INDEX IF NOT EXISTS idx_psychologists_user_id ON psychologists(user_id);
            CREATE INDEX IF NOT EXISTS idx_psychologists_psychologist_id ON psychologists(psychologist_id);
            CREATE INDEX IF NOT EXISTS idx_psychologists_approved ON psychologists(approved);
            CREATE INDEX IF NOT EXISTS idx_children_parent_id ON children(parent_id);
            CREATE INDEX IF NOT EXISTS idx_children_status ON children(status);
            CREATE INDEX IF NOT EXISTS idx_assessment_requests_child_id ON assessment_requests(child_id);
            CREATE INDEX IF NOT EXISTS idx_assessment_requests_psychologist_id ON assessment_requests(psychologist_id);
            CREATE INDEX IF NOT EXISTS idx_assessment_requests_status ON assessment_requests(status);
            CREATE INDEX IF NOT EXISTS idx_game_results_child_id ON game_results(child_id);
            CREATE INDEX IF NOT EXISTS idx_ai_analysis_child_id ON ai_analysis(child_id);
        `;

        db.exec(createTablesSQL, (err) => {
            if (err) {
                console.error('❌ Error creating tables:', err);
                reject(err);
                return;
            }
            console.log('✅ Tables and indexes created successfully');
            resolve();
        });
    });
}

// Insert default data function
async function insertDefaultData() {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('🔍 Inserting default data...');

            // Insert admin with fixed password hash for nsuenactus2025
            const adminPasswordHash = await bcrypt.hash('nsuenactus2025', 10);
            const adminEmail = 'nsuenactus@gmail.com';
            
            // First, try to delete existing admin if exists
            await new Promise((resolve, reject) => {
                db.run('DELETE FROM users WHERE email = ?', [adminEmail], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            // Then create new admin
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO users (email, password_hash, name, role, approved) VALUES (?, ?, ?, ?, ?)',
                    [adminEmail, adminPasswordHash, 'Super Admin', 'admin', 1],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
            console.log('👤 Admin account recreated: nsuenactus@gmail.com / nsuenactus2025');

            // Default password for test psychologists
            const defaultPasswordHash = await bcrypt.hash('password123', 10);

            // Insert psychologists
            const psychologists = [
                { email: 'sarah.johnson@educe.com', name: 'Dr. Sarah Johnson', id: 'psy001', title: 'Child Psychologist', approved: true },
                { email: 'michael.chen@educe.com', name: 'Dr. Michael Chen', id: 'psy002', title: 'Educational Psychologist', approved: true },
                { email: 'emily.rodriguez@educe.com', name: 'Dr. Emily Rodriguez', id: 'psy003', title: 'Clinical Child Psychologist', approved: true },
                { email: 'james.wilson@educe.com', name: 'Dr. James Wilson', id: 'psy004', title: 'Developmental Psychologist', approved: false },
                { email: 'lisa.martinez@educe.com', name: 'Dr. Lisa Martinez', id: 'psy005', title: 'School Psychologist', approved: false }
            ];

            for (const psych of psychologists) {
                // Check if user exists
                const userExists = await new Promise((resolve, reject) => {
                    db.get('SELECT id FROM users WHERE email = ?', [psych.email], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });

                if (!userExists) {
                    // Insert user
                    const userId = await new Promise((resolve, reject) => {
                        db.run(
                            'INSERT INTO users (email, password_hash, name, role, approved) VALUES (?, ?, ?, ?, ?)',
                            [psych.email, defaultPasswordHash, psych.name, 'psychologist', psych.approved ? 1 : 0],
                            function(err) {
                                if (err) reject(err);
                                else resolve(this.lastID);
                            }
                        );
                    });
                    
                    // Insert psychologist profile
                    await new Promise((resolve, reject) => {
                        const specializations = JSON.stringify(['Child Development', 'Assessment']);
                        const currentDate = new Date().toISOString();
                        
                        db.run(
                            `INSERT INTO psychologists (user_id, psychologist_id, title, specializations, experience, rating, completed_assessments, description, approved, approved_by, approved_date, registration_date) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                userId,
                                psych.id,
                                psych.title,
                                specializations,
                                '5+ years',
                                4.8,
                                psych.approved ? 100 : 0,
                                `Professional ${psych.title.toLowerCase()} with extensive experience.`,
                                psych.approved ? 1 : 0,
                                psych.approved ? 'Super Admin' : null,
                                psych.approved ? currentDate : null,
                                currentDate
                            ],
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            }
                        );
                    });
                    console.log(`👨‍⚕️ Psychologist created: ${psych.email} / password123`);
                }
            }

            console.log('✅ Database initialization completed!');
            console.log('🔐 Default accounts ready:');
            console.log('   Admin: nsuenactus@gmail.com / nsuenactus2025');
            console.log('   Psychologists: Use email addresses above with password123');
            resolve();

        } catch (error) {
            console.error('❌ Database initialization failed:', error.message);
            reject(error);
        }
    });
}

// Middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
}));
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Admin only middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Psychologist only middleware
const requirePsychologist = (req, res, next) => {
    if (req.user.role !== 'psychologist') {
        return res.status(403).json({ error: 'Psychologist access required' });
    }
    next();
};

// ===== AUTHENTICATION ROUTES =====

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role = 'customer', phone } = req.body;
        
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Check if user exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, name, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role, approved',
            [email, passwordHash, name, role, phone]
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                approved: user.approved
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const result = await pool.query(
            'SELECT id, email, password_hash, name, role, approved FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                approved: user.approved
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ===== USER ROUTES =====

// Get current user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, name, role, phone, approved, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update user profile
app.put('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const { name, phone } = req.body;
        
        const result = await pool.query(
            'UPDATE users SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, name, role, phone, approved',
            [name, phone, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// ===== PSYCHOLOGIST ROUTES =====

// Get all psychologists (approved only for customers, all for admin)
app.get('/api/psychologists', async (req, res) => {
    try {
        let query = `
            SELECT p.*, u.name, u.email 
            FROM psychologists p 
            JOIN users u ON p.user_id = u.id
        `;
        
        // Only show approved psychologists to non-admin users
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        let isAdmin = false;
        if (token) {
            try {
                const decoded = jwt.verify(token, config.jwt.secret);
                isAdmin = decoded.role === 'admin';
            } catch (err) {
                // Token invalid, treat as non-admin
            }
        }
        
        if (!isAdmin) {
            query += ' WHERE p.approved = true';
        }
        
        query += ' ORDER BY p.rating DESC, p.completed_assessments DESC';

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Get psychologists error:', err);
                return res.status(500).json({ error: 'Failed to get psychologists' });
            }
            res.json(rows);
        });

    } catch (error) {
        console.error('Get psychologists error:', error);
        res.status(500).json({ error: 'Failed to get psychologists' });
    }
});

// Get psychologist by ID
app.get('/api/psychologists/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*, u.name, u.email 
             FROM psychologists p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.psychologist_id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Psychologist not found' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Get psychologist error:', error);
        res.status(500).json({ error: 'Failed to get psychologist' });
    }
});

// Update psychologist profile (psychologist only)
app.put('/api/psychologists/profile', authenticateToken, requirePsychologist, async (req, res) => {
    try {
        const { title, specializations, experience, description, available } = req.body;
        
        const result = await pool.query(
            `UPDATE psychologists 
             SET title = $1, specializations = $2, experience = $3, description = $4, available = $5, updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $6 
             RETURNING *`,
            [title, specializations, experience, description, available, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Psychologist profile not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            psychologist: result.rows[0]
        });

    } catch (error) {
        console.error('Update psychologist profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get psychologist's own profile
app.get('/api/psychologists/my-profile', authenticateToken, requirePsychologist, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*, u.name, u.email 
             FROM psychologists p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.user_id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Psychologist profile not found' });
        }

        // Format response for frontend compatibility
        const psychologist = result.rows[0];
        const profile = {
            id: psychologist.psychologist_id,
            name: psychologist.name,
            title: psychologist.title,
            email: psychologist.email,
            specializations: psychologist.specializations || [],
            experience: psychologist.experience,
            rating: parseFloat(psychologist.rating),
            completedAssessments: psychologist.completed_assessments,
            description: psychologist.description,
            available: psychologist.available,
            approved: psychologist.approved,
            approvedBy: psychologist.approved_by,
            approvedDate: psychologist.approved_date,
            registrationDate: psychologist.registration_date,
            createdAt: psychologist.created_at,
            updatedAt: psychologist.updated_at
        };

        res.json(profile);

    } catch (error) {
        console.error('Get psychologist profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update psychologist's own profile
app.put('/api/psychologists/my-profile', authenticateToken, requirePsychologist, async (req, res) => {
    try {
        const { name, title, specializations, experience, description, available } = req.body;

        // Update user name if provided
        if (name) {
            await pool.query(
                'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [name, req.user.id]
            );
        }

        // Update psychologist profile
        const result = await pool.query(`
            UPDATE psychologists 
            SET title = $1, specializations = $2, experience = $3, description = $4, available = $5, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $6
            RETURNING *
        `, [title, specializations, experience, description, available, req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Psychologist profile not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            psychologist: result.rows[0]
        });

    } catch (error) {
        console.error('Update psychologist profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// ===== ADMIN ROUTES =====

// Get all psychologists (admin only)
app.get('/api/admin/psychologists', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.email, u.name as user_name, u.created_at as user_created_at
            FROM psychologists p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error('Get all psychologists error:', error);
        res.status(500).json({ error: 'Failed to get psychologists' });
    }
});

// Approve/reject psychologist (admin only)
app.put('/api/admin/psychologists/:id/approval', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { approved, reason } = req.body;
        const psychologistId = req.params.id;
        
        let updateData;
        if (approved) {
            updateData = {
                approved: true,
                approved_by: req.user.email,
                approved_date: new Date(),
                rejected_by: null,
                rejected_date: null
            };
        } else {
            updateData = {
                approved: false,
                approved_by: null,
                approved_date: null,
                rejected_by: req.user.email,
                rejected_date: new Date()
            };
        }

        const result = await pool.query(
            `UPDATE psychologists 
             SET approved = $1, approved_by = $2, approved_date = $3, rejected_by = $4, rejected_date = $5, updated_at = CURRENT_TIMESTAMP 
             WHERE psychologist_id = $6 
             RETURNING *`,
            [updateData.approved, updateData.approved_by, updateData.approved_date, updateData.rejected_by, updateData.rejected_date, psychologistId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Psychologist not found' });
        }

        res.json({
            message: `Psychologist ${approved ? 'approved' : 'rejected'} successfully`,
            psychologist: result.rows[0]
        });

    } catch (error) {
        console.error('Approval error:', error);
        res.status(500).json({ error: 'Failed to update approval status' });
    }
});

// Get admin statistics
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const stats = await Promise.all([
            pool.query('SELECT COUNT(*) as total_users FROM users'),
            pool.query('SELECT COUNT(*) as pending_psychologists FROM psychologists WHERE approved = false'),
            pool.query('SELECT COUNT(*) as approved_psychologists FROM psychologists WHERE approved = true'),
            pool.query('SELECT COUNT(*) as total_assessments FROM assessment_requests'),
            pool.query('SELECT COUNT(*) as completed_assessments FROM assessment_requests WHERE status = \'completed\'')
        ]);

        res.json({
            totalUsers: parseInt(stats[0].rows[0].total_users),
            pendingPsychologists: parseInt(stats[1].rows[0].pending_psychologists),
            approvedPsychologists: parseInt(stats[2].rows[0].approved_psychologists),
            totalAssessments: parseInt(stats[3].rows[0].total_assessments),
            completedAssessments: parseInt(stats[4].rows[0].completed_assessments)
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// ===== CHILDREN ROUTES =====

// Get user's children
app.get('/api/children', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM children WHERE parent_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({ error: 'Failed to get children' });
    }
});

// Add new child
app.post('/api/children', authenticateToken, async (req, res) => {
    try {
        const { name, age, gender, interests, notes } = req.body;
        
        if (!name || !age) {
            return res.status(400).json({ error: 'Name and age are required' });
        }

        const result = await pool.query(
            'INSERT INTO children (parent_id, name, age, gender, interests, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.user.id, name, age, gender, interests || [], notes]
        );

        res.status(201).json({
            message: 'Child added successfully',
            child: result.rows[0]
        });

    } catch (error) {
        console.error('Add child error:', error);
        res.status(500).json({ error: 'Failed to add child' });
    }
});

// Update child
app.put('/api/children/:id', authenticateToken, async (req, res) => {
    try {
        const { name, age, gender, interests, notes, status } = req.body;
        const childId = req.params.id;
        
        const result = await pool.query(
            `UPDATE children 
             SET name = $1, age = $2, gender = $3, interests = $4, notes = $5, status = $6, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $7 AND parent_id = $8 
             RETURNING *`,
            [name, age, gender, interests || [], notes, status, childId, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Child not found' });
        }

        res.json({
            message: 'Child updated successfully',
            child: result.rows[0]
        });

    } catch (error) {
        console.error('Update child error:', error);
        res.status(500).json({ error: 'Failed to update child' });
    }
});

// Delete child
app.delete('/api/children/:id', authenticateToken, async (req, res) => {
    try {
        const childId = req.params.id;
        
        const result = await pool.query(
            'DELETE FROM children WHERE id = $1 AND parent_id = $2 RETURNING *',
            [childId, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Child not found' });
        }

        res.json({ message: 'Child deleted successfully' });

    } catch (error) {
        console.error('Delete child error:', error);
        res.status(500).json({ error: 'Failed to delete child' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'EDUCE API',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize and start server
async function startServer() {
    try {
        console.log('🚀 Starting EDUCE API Server...');
        console.log('');
        
        // Initialize SQLite database
        await initializeDatabase();
        console.log('');
        
        // Start server
        const PORT = config.port;
        app.listen(PORT, () => {
            console.log('🚀 EDUCE API Server started successfully!');
            console.log(`📡 Server running on http://localhost:${PORT}`);
            console.log('🔗 Available endpoints:');
            console.log('   - POST /api/auth/register - Register new user');
            console.log('   - POST /api/auth/login - User login');
            console.log('   - GET  /api/users/profile - Get user profile');
            console.log('   - GET  /api/psychologists - Get approved psychologists');
            console.log('   - GET  /api/psychologists/my-profile - Get own profile (psychologist)');
            console.log('   - PUT  /api/psychologists/my-profile - Update own profile (psychologist)');
            console.log('   - GET  /api/admin/psychologists - Get all psychologists (admin)');
            console.log('   - PUT  /api/admin/psychologists/:id/approval - Approve/reject psychologist');
            console.log('   - GET  /api/children - Get user children');
            console.log('   - POST /api/children - Add new child');
            console.log('   - POST /api/assessment-requests - Create assessment request');
            console.log('   - GET  /api/assessment-requests - Get assessment requests');
            console.log('   - POST /api/assessment-requests/:id/respond - Respond to request');
            console.log('   - POST /api/game-results - Save game results');
            console.log('   - GET  /api/game-results - Get game results');
            console.log('   - POST /api/ai-analysis - Save AI analysis');
            console.log('   - GET  /api/ai-analysis - Get AI analysis');
            console.log('   - GET  /api/admin/stats - Get admin statistics');
            console.log('   - GET  /api/health - Health check');
            console.log('');
            console.log('🔐 Default accounts ready to use:');
            console.log('   👨‍💼 Admin: nsuenactus@gmail.com / nsuenactus2025');
            console.log('   👨‍⚕️ Dr. Sarah Johnson: sarah.johnson@educe.com / password123');
            console.log('   👨‍⚕️ Dr. Michael Chen: michael.chen@educe.com / password123');
            console.log('   👨‍⚕️ Dr. Emily Rodriguez: emily.rodriguez@educe.com / password123');
            console.log('   ⏳ Dr. James Wilson: james.wilson@educe.com / password123 (pending)');
            console.log('   ⏳ Dr. Lisa Martinez: lisa.martinez@educe.com / password123 (pending)');
            console.log('');
            console.log('✅ Database ready:');
            console.log('   - SQLite database and tables automatically created');
            console.log('   - All data stored in local SQLite database file');
            console.log('   - Default accounts and sample data loaded');
            console.log('');
            console.log('💡 Tips:');
            console.log('   - Use JWT tokens for authentication');
            console.log('   - Include Authorization: Bearer <token> in headers');
            console.log('   - Frontend automatically switches to API when available');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('   1. Make sure PostgreSQL is installed and running');
        console.log('   2. Check database credentials in config.js');
        console.log('   3. Ensure PostgreSQL user has database creation permissions');
        console.log('   4. Try: npm install to install dependencies');
        console.log('   5. For Windows: Check if PostgreSQL service is running');
        console.log('');
        console.log('📝 Quick PostgreSQL setup commands:');
        console.log('   createuser -s postgres (if user doesn\'t exist)');
        console.log('   ALTER USER postgres PASSWORD \'password\';');
        console.log('');
        process.exit(1);
    }
}

// Start the server
startServer();

module.exports = app; 