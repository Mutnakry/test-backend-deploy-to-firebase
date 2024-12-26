const express = require('express');
const router = express.Router();
const authController = require('../controller/authController'); // Adjust path as needed

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', authController.GetUsers);



module.exports = router;
