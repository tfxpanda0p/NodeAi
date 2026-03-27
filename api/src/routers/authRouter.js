const router = require('express').Router();

const { register, login, logout, getHistory, deleteHistory } = require("../controllers/user");
const { sensitiveLimiter } = require("../middleware/rateLimiter");
const authUser = require("../middleware/authUser");

router.post('/register', sensitiveLimiter, register);
router.post('/login', sensitiveLimiter, login);
router.post('/logout', authUser, logout);
router.get('/history', authUser, getHistory);
router.delete('/history/:id', authUser, deleteHistory);

module.exports = router;
