const router = require('express').Router();

const { askAi, savePrompt } = require("../controllers/ai");
const authUser = require("../middleware/authUser");

router.post("/askAi", authUser, askAi);
router.post("/savePrompt", authUser, savePrompt);

module.exports = router;
