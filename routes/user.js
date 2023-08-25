const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const { authentication } = require('../middleware')

router.post('/createUser', authController.createUser);
router.post('/loginUser', authController.loginUser);
router.post('/verifyUser', authController.userVerify);
router.get('/getUser', authController.getUser);
router.get('/getAllUsers', authController.getAllUsers);

module.exports = router;