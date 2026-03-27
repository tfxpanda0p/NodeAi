const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const genToken = async (user) => {
    try {
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        return token;
    }
    catch (err) {
        logger.error(`Error generating token: ${err.message}`);
        throw err;
    }
};

module.exports = genToken;