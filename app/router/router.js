const { Router } = require('express');
const router = Router();

const { userController, loginController } = require('../controller');

// USER
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getOneUser);
router.post('/user', userController.createUser);

// LOGIN
router.post('/login', loginController.handleLogin);

module.exports = router;