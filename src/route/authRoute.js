const express = require('express');
const router = express.Router();
const authController = require('../controller/authController'); // Adjust path as needed

router.post('/register', authController.register);
router.post('/login', authController.login);
// router.get('/protected', authController.verifyToken, (req, res) => {
//   res.status(200).send('This is a protected route.');
// });

module.exports = router;
