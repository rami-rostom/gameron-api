const { Router } = require('express');
const router = Router();

const { userController } = require('../controller');

// USER
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getOneUser);

module.exports = router;