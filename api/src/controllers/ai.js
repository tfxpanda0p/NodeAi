const axios = require("axios");
const jwt = require("jsonwebtoken");
const Prompt = require("../models/Prompt");
const User = require("../models/User");
const logger = require("../config/logger");

const askAi = async (req, res) => {
    logger.info("Ask AI endpoint hit...");

    const { prompt } = req.body || {};

    if (!prompt) {
        logger.error(`Prompt is required | ${req.method} ${req.originalUrl}`);
        return res.status(400).json({ success: false, message: "Prompt is required" });
    }
    try {

        const openRouterApiKey = process.env.OPENROUTER_API_KEY;
        if (!openRouterApiKey) {
            logger.error("OPENROUTER_API_KEY is missing in environment variables");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }


        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: process.env.MODEL_ID,
                messages: [
                    { role: "system", content: "You are a concise assistant. Provide only the direct, exact answer to the user's prompt. Do not include any extra explanations, greetings, warnings, or conversational filler." },
                    { role: "user", content: prompt }
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${openRouterApiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            }
        );

        const aiResponse = response.data?.choices?.[0]?.message?.content;
        if (!aiResponse) {
            return res.status(500).json({ success: false, message: "Empty response from AI" });
        }

        const payload = { prompt, response: aiResponse, userId: req.userId };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("savePromptToken", token, {
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({ success: true, data: aiResponse });

    } catch (error) {
        logger.error(
            `Error in askAi: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}\n${error.stack}`
        );
        return res.status(500).json({ success: false, message: "Failed to fetch response from AI" });
    }
};

const savePrompt = async (req, res) => {
    logger.info("Save Prompt endpoint hit...");
    try {
        const token = req.cookies?.savePromptToken;
        if (!token) {
            logger.error(`No prompt token found in cookies`);
            return res.status(400).json({ success: false, message: "No prompt data to save" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            logger.error(`Invalid prompt token: ${err.message}`);
            return res.status(401).json({ success: false, message: "Invalid or expired prompt data" });
        }

        const { prompt, response, userId } = decoded;

        if (!prompt || !response || !userId) {
            logger.error("Incomplete prompt data in token");
            return res.status(400).json({ success: false, message: "Incomplete prompt data" });
        }

        const newPrompt = await Prompt.create({
            prompt,
            response,
            user: userId
        });

        await User.findByIdAndUpdate(userId, {
            $push: { prompts: newPrompt._id }
        });

        res.clearCookie("savePromptToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        res.status(201).json({
            success: true,
            data: newPrompt
        });

    } catch (error) {
        logger.error(`Error in savePrompt: ${error.message} \n ${error.stack}`);
        res.status(500).json({ success: false, message: "Failed to save prompt" });
    }
};

module.exports = {
    askAi,
    savePrompt
};
