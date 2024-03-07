const { Router } = require('express');
const router = Router();

const { userController, loginController, gameController } = require('../controller');

// USER
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getOneUser);
router.post('/user', userController.createUser);

// LOGIN
router.post('/register', loginController.handleRegister);
router.post('/login', loginController.handleLogin);

// GAME
router.patch('/game/favorite', gameController.updateGameFavorite);

module.exports = router;