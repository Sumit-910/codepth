const route = require('express').Router();

const { authController } = require('../controllers/auth');
const { authentication, loginUser } = require('../middleware')

route.post('/createUser', authController.createUser);
route.post('/loginUser', loginUser, authController.userVerify);
route.get('/getUser', authentication, authController.getUser);
route.get('/getAllUsers', authentication, authController.getAllUsers);
route.get('/logout', authentication, authController.logout);

module.exports = route;