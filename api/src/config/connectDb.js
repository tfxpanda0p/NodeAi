const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    } catch (error) {
        logger.error(`Error in connecting to MongoDB: ${error.message} \n ${error.stack}`);
        process.exit(1);
    }
};

module.exports = connectDB;