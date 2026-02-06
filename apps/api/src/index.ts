import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
dotenv.config()
import session from 'express-session'
import apiRouter from './router'
import { initializeAuth } from './auth/authService'
import { databaseService } from './services/database'
import { 
  requestIdMiddleware, 
  errorHandler, 
  notFoundHandler, 
  asyncHandler 
} from './middleware/errorHandler'
import { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT || 3001

export { app }

// Initialize services before starting server
async function initializeServices() {
  try {
    console.log('🚀 Initializing GamePilot API services...')
    
    // Initialize authentication and database
    await initializeAuth()
    
    console.log('✅ All services initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize services:', error)
    process.exit(1)
  }
}

// Start server
async function startServer() {
  try {
    // Apply security middleware first
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "http://localhost:3001", "https://localhost:3001"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }))
    
    // Apply rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 1000 requests per windowMs (increased for development)
      message: {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    })
    
    app.use(limiter)
    
    // Stricter rate limiting for auth endpoints
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // Limit each IP to 20 auth requests per windowMs
      message: {
        error: 'Too many authentication attempts',
        message: 'Please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    })
    
    // Apply CORS middleware
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['https://gamepilot.com'];

    app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (process.env.NODE_ENV !== 'production' || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
          callback(null, true);
        } else {
          console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
          console.info(`Allowed origins are: ${allowedOrigins.join(', ')}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }))
    
    app.use(session({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    }))
    
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    app.use(cookieParser())
    
    // Apply request ID middleware
    app.use(requestIdMiddleware)
    
    // Serve static files from web app public directory
    app.use(express.static(path.join(__dirname, '../../web/public')))
    
    // Serve favicon.ico
    app.get('/favicon.ico', (req, res) => {
      res.sendFile(path.join(__dirname, '../../web/public/favicon.ico'))
    })
    
    // Apply routes
    app.use('/api', apiRouter)
    
    // Apply stricter rate limiting to auth routes
    app.use('/api/auth', authLimiter)
    
    
    // Debug endpoint to check environment variables
    app.get('/debug/env', (req, res) => {
      res.json({
        steamApiKey: process.env.STEAM_API_KEY ? 'SET' : 'NOT_SET',
        steamApiKeyLength: process.env.STEAM_API_KEY?.length || 0,
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV
      })
    })
    
    // Root route for health check
    app.get("/", (req, res) => {
      res.status(200).send("GamePilot API OK");
    });
    
    // Apply error handling middleware (must be last)
    app.use(notFoundHandler)
    app.use(errorHandler)
    
    // Start listening
    const port = typeof PORT === 'string' ? parseInt(PORT) : PORT
    console.log(`🔍 PORT environment variable: ${process.env.PORT}`)
    console.log(`🔍 Using port: ${port}`)
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 GamePilot API server running on port ${port}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Initialize and start
initializeServices().then(startServer)
