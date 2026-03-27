const logger = require("../config/logger");
const User = require("../models/User");
const Prompt = require("../models/Prompt");
const { validateRegister, validateLogin } = require("../utils/validate");
const genToken = require("../utils/genToken");

const sendTokenResponse = (user, token, statusCode, res, additionalData = {}) => {
    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            ...additionalData,
            data: {
                id: user._id,
                name: user.name,
            }
        });
};

// Register
const register = async (req, res) => {
    logger.info("Registeration endpoint hit...");
    try {
        const { error: err } = validateRegister(req.body);
        if (err) {
            logger.error('validation error', err.details[0].message);
            return res.status(400).json({
                success: false,
                message: err.details[0].message
            });
        }
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn('User already exists');
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }


        const user = await User.create({ name, email, password });
        const token = await genToken(user);

        logger.info(`User registered successfully :- ${user._id}`);

        return sendTokenResponse(user, token, 201, res, {
            message: `User registered successfully :- ${user._id}`
        });

    } catch (err) {
        logger.error(`Error in registerUser controller: ${err.message}`, {
            stack: err.stack
        });
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Login 
const login = async (req, res) => {
    logger.info("Login endpoint hit...");
    try {
        const { error: err } = validateLogin(req.body);
        if (err) {
            logger.error('validation error', err.details[0].message);
            return res.status(400).json({
                success: false,
                message: err.details[0].message
            });
        }
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('User not found');
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // user valid password or not
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            logger.warn("Invalid password");
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = await genToken(user);

        logger.info(`User logged in successfully :- ${user._id}`);

        return sendTokenResponse(user, token, 200, res, {
            message: `User logged in successfully :- ${user._id}`
        });

    } catch (err) {
        logger.error(`Error in loginUser controller: ${err.message}`, {
            stack: err.stack
        });
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// logout

const logout = async (req, res) => {
    logger.info("Logout endpoint hit...");
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
        });
        logger.info(`User logged out successfully :- ${req.userId || "Unknown"}`);
        res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (err) {
        logger.error(`Error in logoutUser controller: ${err.message}`);
        res.status(500).json({ success: false, message: err.message });
    }
}

const getHistory = async (req, res) => {
    logger.info("Get History endpoint hit...");

    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const prompts = await Prompt.find({ user: req.userId })
            .select("user prompt response createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Prompt.countDocuments({ user: req.userId });

        res.status(200).json({
            success: true,
            data: prompts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        logger.error(`Error in getHistory controller: ${err.message}`);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const deleteHistory = async (req, res) => {
    logger.info(`Delete History endpoint hit for ID: ${req.params.id}`);
    try {
        const prompt = await Prompt.findOne({ _id: req.params.id, user: req.userId });

        if (!prompt) {
            logger.error(`History item not found for ID: ${req.params.id}`);
            return res.status(404).json({ success: false, message: "History item not found" });
        }

        await Prompt.deleteOne({ _id: req.params.id });

        // Remove from user's prompts array
        await User.findByIdAndUpdate(req.userId, {
            $pull: { prompts: req.params.id }
        });
        logger.info(`History item deleted successfully for ID: ${req.userId}`);
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        logger.error(`Error in deleteHistory: ${err.message}`);
        res.status(500).json({ success: false, message: "Deletion failed" });
    }
}

module.exports = { register, login, logout, getHistory, deleteHistory };