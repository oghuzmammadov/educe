const { Pool } = require('pg');
const config = require('./config');

// Function to create database if not exists
async function createDatabaseIfNotExists() {
    // Connect to postgres database to create pathify_db
    const postgresPool = new Pool({
        host: config.database.host,
        port: config.database.port,
        database: 'postgres', // Connect to default postgres database
        user: config.database.user,
        password: config.database.password,
    });

    try {
        console.log('🔍 Checking if database exists...');
        
        // Check if database exists
        const dbCheckResult = await postgresPool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [config.database.name]
        );

        if (dbCheckResult.rows.length === 0) {
            console.log(`📝 Creating database: ${config.database.name}`);
            await postgresPool.query(`CREATE DATABASE ${config.database.name}`);
            console.log('✅ Database created successfully!');
        } else {
            console.log('✅ Database already exists');
        }

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error(`❌ Cannot connect to PostgreSQL server. Make sure PostgreSQL is running on ${config.database.host}:${config.database.port}`);
        } else if (error.message.includes('authentication failed')) {
            throw new Error(`❌ Database authentication failed. Check username/password in config.js`);
        } else if (error.message.includes('does not exist')) {
            throw new Error(`❌ PostgreSQL user '${config.database.user}' does not exist. Create the user first.`);
        } else {
            throw error;
        }
    } finally {
        await postgresPool.end();
    }
}

// Function to create tables and initial data
async function createTablesAndData() {
    const pool = new Pool({
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        user: config.database.user,
        password: config.database.password,
    });

    try {
        console.log('🔍 Checking and creating tables...');

        // SQL commands to create tables
        const createTablesSQL = `
            -- Users table (customers, psychologists, admins)
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'psychologist', 'admin')),
                phone VARCHAR(20),
                approved BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Psychologists table (extended info for psychologists)
            CREATE TABLE IF NOT EXISTS psychologists (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                psychologist_id VARCHAR(20) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                specializations TEXT[] DEFAULT '{}',
                experience VARCHAR(100),
                rating DECIMAL(3,2) DEFAULT 4.5,
                completed_assessments INTEGER DEFAULT 0,
                description TEXT,
                available BOOLEAN DEFAULT true,
                approved BOOLEAN DEFAULT false,
                approved_by VARCHAR(255),
                approved_date TIMESTAMP,
                rejected_by VARCHAR(255),
                rejected_date TIMESTAMP,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Children table
            CREATE TABLE IF NOT EXISTS children (
                id SERIAL PRIMARY KEY,
                parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                age INTEGER NOT NULL,
                gender VARCHAR(10),
                interests TEXT[] DEFAULT '{}',
                notes TEXT,
                status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'pending', 'accepted', 'games_completed', 'completed')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Assessment requests table
            CREATE TABLE IF NOT EXISTS assessment_requests (
                id SERIAL PRIMARY KEY,
                request_id VARCHAR(50) UNIQUE NOT NULL,
                child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
                psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
                parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                child_name VARCHAR(255) NOT NULL,
                child_age INTEGER NOT NULL,
                child_interests TEXT[] DEFAULT '{}',
                parent_notes TEXT,
                status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                response_date TIMESTAMP,
                report_generated_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Game results table
            CREATE TABLE IF NOT EXISTS game_results (
                id SERIAL PRIMARY KEY,
                child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
                psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
                child_name VARCHAR(255) NOT NULL,
                answers JSONB NOT NULL,
                completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- AI analysis results table
            CREATE TABLE IF NOT EXISTS ai_analysis (
                id SERIAL PRIMARY KEY,
                child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
                psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
                child_name VARCHAR(255) NOT NULL,
                age INTEGER NOT NULL,
                gender VARCHAR(10),
                grade VARCHAR(50),
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
                interests TEXT[] DEFAULT '{}',
                observations TEXT,
                ai_report TEXT,
                report_generated BOOLEAN DEFAULT false,
                assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- API configuration table
            CREATE TABLE IF NOT EXISTS api_configs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                service_name VARCHAR(100) NOT NULL,
                api_key_encrypted TEXT,
                config_data JSONB DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Indexes for better performance
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

        // Execute table creation
        await pool.query(createTablesSQL);
        console.log('✅ Tables created/verified successfully');

        // Insert default data
        await insertDefaultData(pool);

    } finally {
        await pool.end();
    }
}

// Function to insert default data
async function insertDefaultData(pool) {
    try {
        console.log('🔍 Checking and inserting default data...');

        // Hash for all default passwords (admin123, password123)
        const defaultPasswordHash = '$2a$10$8K1p/a9Y6f6DuYXbgY/Ob.W8oOqmN/Q8JhF5m2nG0OfKQJ/M0wJ.e';

        // Insert default admin user
        const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@pathify.com']);
        if (adminCheck.rows.length === 0) {
            await pool.query(
                'INSERT INTO users (email, password_hash, name, role, approved) VALUES ($1, $2, $3, $4, $5)',
                ['admin@pathify.com', defaultPasswordHash, 'Super Admin', 'admin', true]
            );
            console.log('👤 Default admin user created');
        }

        // Insert default psychologists
        const psychologistUsers = [
            { email: 'sarah.johnson@pathify.com', name: 'Dr. Sarah Johnson', approved: true },
            { email: 'michael.chen@pathify.com', name: 'Dr. Michael Chen', approved: true },
            { email: 'emily.rodriguez@pathify.com', name: 'Dr. Emily Rodriguez', approved: true },
            { email: 'james.wilson@pathify.com', name: 'Dr. James Wilson', approved: false },
            { email: 'lisa.martinez@pathify.com', name: 'Dr. Lisa Martinez', approved: false }
        ];

        for (const psychUser of psychologistUsers) {
            const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [psychUser.email]);
            if (userCheck.rows.length === 0) {
                const userResult = await pool.query(
                    'INSERT INTO users (email, password_hash, name, role, approved) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                    [psychUser.email, defaultPasswordHash, psychUser.name, 'psychologist', psychUser.approved]
                );
                console.log(`👨‍⚕️ Psychologist user created: ${psychUser.name}`);
            }
        }

        // Insert psychologist details
        const psychologistDetails = [
            {
                email: 'sarah.johnson@pathify.com',
                psychologist_id: 'psy001',
                title: 'Child Psychologist',
                specializations: ['Child Development', 'Learning Disabilities', 'ADHD'],
                experience: '8 years',
                rating: 4.9,
                completed_assessments: 245,
                description: 'Specializes in child development and learning assessment with a focus on personalized approaches.',
                approved: true,
                registration_offset_days: 365
            },
            {
                email: 'michael.chen@pathify.com',
                psychologist_id: 'psy002',
                title: 'Educational Psychologist',
                specializations: ['Educational Assessment', 'Career Guidance', 'Gifted Children'],
                experience: '12 years',
                rating: 4.8,
                completed_assessments: 389,
                description: 'Expert in educational psychology and career guidance for children and adolescents.',
                approved: true,
                registration_offset_days: 730
            },
            {
                email: 'emily.rodriguez@pathify.com',
                psychologist_id: 'psy003',
                title: 'Clinical Child Psychologist',
                specializations: ['Autism Spectrum', 'Behavioral Assessment', 'Social Skills'],
                experience: '6 years',
                rating: 4.7,
                completed_assessments: 156,
                description: 'Focuses on autism spectrum disorders and behavioral assessments with evidence-based methods.',
                approved: true,
                registration_offset_days: 180
            },
            {
                email: 'james.wilson@pathify.com',
                psychologist_id: 'psy004',
                title: 'Developmental Psychologist',
                specializations: ['Cognitive Development', 'Language Disorders', 'Early Intervention'],
                experience: '10 years',
                rating: 4.6,
                completed_assessments: 0,
                description: 'Specializes in early childhood development and intervention strategies.',
                approved: false,
                registration_offset_days: 7
            },
            {
                email: 'lisa.martinez@pathify.com',
                psychologist_id: 'psy005',
                title: 'School Psychologist',
                specializations: ['Academic Assessment', 'Behavioral Issues', 'Family Therapy'],
                experience: '7 years',
                rating: 4.5,
                completed_assessments: 0,
                description: 'Focuses on school-based assessments and family intervention programs.',
                approved: false,
                registration_offset_days: 3
            }
        ];

        for (const psychDetail of psychologistDetails) {
            // Get user ID
            const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [psychDetail.email]);
            if (userResult.rows.length > 0) {
                const userId = userResult.rows[0].id;

                // Check if psychologist details already exist
                const psychCheck = await pool.query('SELECT id FROM psychologists WHERE user_id = $1', [userId]);
                if (psychCheck.rows.length === 0) {
                    await pool.query(
                        `INSERT INTO psychologists 
                         (user_id, psychologist_id, title, specializations, experience, rating, completed_assessments, description, approved, approved_by, approved_date, registration_date) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                        [
                            userId,
                            psychDetail.psychologist_id,
                            psychDetail.title,
                            psychDetail.specializations,
                            psychDetail.experience,
                            psychDetail.rating,
                            psychDetail.completed_assessments,
                            psychDetail.description,
                            psychDetail.approved,
                            psychDetail.approved ? 'Super Admin' : null,
                            psychDetail.approved ? new Date() : null,
                            new Date(Date.now() - psychDetail.registration_offset_days * 24 * 60 * 60 * 1000)
                        ]
                    );
                    console.log(`📋 Psychologist details created: ${psychDetail.psychologist_id}`);
                }
            }
        }

        console.log('✅ Default data setup completed');

    } catch (error) {
        console.error('❌ Error inserting default data:', error);
        throw error;
    }
}

// Main initialization function
async function initializeDatabase() {
    try {
        console.log('🚀 Starting database initialization...');
        
        await createDatabaseIfNotExists();
        await createTablesAndData();
        
        console.log('✅ Database initialization completed successfully!');
        console.log('');
        console.log('📊 Database ready with:');
        console.log('   - All required tables created');
        console.log('   - Indexes for performance');
        console.log('   - Default admin and psychologist accounts');
        console.log('');
        console.log('🔐 Default login credentials:');
        console.log('   Admin: admin@pathify.com / admin123');
        console.log('   Psychologists: *.pathify.com / password123');

        return true;

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting tips:');
        console.log('   1. Make sure PostgreSQL is running');
        console.log('   2. Check database credentials in config.js');
        console.log('   3. Ensure user has database creation permissions');
        console.log('   4. Try: createuser -s postgres (if user doesn\'t exist)');
        
        throw error;
    }
}

module.exports = { initializeDatabase }; 