// Database and Server Configuration
module.exports = {
    // Server Configuration
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'educe_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password'
    },
    
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'educe_super_secret_jwt_key_2024',
        expiresIn: '24h'
    },
    
    // CORS Configuration
    cors: {
        origin: [
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'file://',
            'null' // For local file access
        ],
        credentials: true
    },
    
    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }
}; 