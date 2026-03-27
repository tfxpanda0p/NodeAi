const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/connectDb");
const logger = require("./config/logger");
const authRouter = require("./routers/authRouter");
const aiRouter = require("./routers/aiRouter");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", aiRouter);


// Global Error Handler
app.use((err, req, res, next) => {
    logger.error(`${err.message} \n ${err.stack}`);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
});

connectDB();

const server = app.listen(PORT, () => {
    logger.info(`Server started in ${process.env.NODE_ENV ?? "development"} mode on port ${PORT}`);
});
