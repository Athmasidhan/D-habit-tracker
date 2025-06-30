import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongoDB.js';
import userRouter from './routes/userRouter.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Whitelisted frontend URLs
const allowedOrigins = [
    "http://localhost:5173",
    "https://athmasidhan.github.io",
    "https://your-frontend.onrender.com"
];

// 🌐 CORS middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://athmasidhan.github.io",
            "https://your-netlify-name.netlify.app"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error("❌ CORS Blocked Origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


// 🧠 JSON parsing
app.use(express.json());

// 🔌 Connect MongoDB
connectDB();

// 📦 Routes
app.use('/api/user', userRouter);

// 🔍 Health Check
app.get('/', (req, res) => {
    res.send('✅ Server is up and running');
});

// ❓ Fallback route
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "❌ API route not found"
    });
});

// 🛑 Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Global Error:", err.stack || err.message);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// 🚀 Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
