const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utile/db'); // Import your database utility

// Register user
exports.GetUsers = async (req, res) => {
  const query = 'SELECT * FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.status(200).json(results); // Send the retrieved rows as JSON
  });
};




exports.register = async (req, res) => {
  try {
    const { user_names, user_email, user_pass } = req.body;

    // SQL query to check if email already exists
    const EmailCheckQuery = 'SELECT user_email FROM users WHERE user_email = ?';

    db.query(EmailCheckQuery, [user_email], async (err, results) => {
      if (err) {
        return res.status(500).send('Error checking user email');
      }

      // If email already exists, return an error
      if (results.length > 0) {
        return res.status(400).send('User email already in use');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(user_pass, 8);

      // SQL query to insert a new user
      const query = 'INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)';

      // Execute the insert query
      db.query(query, [user_names, user_email, hashedPassword], (err, results) => {
        if (err) {
          return res.status(500).send('Error registering user');
        }
        // Success response
        res.status(201).send('User registered successfully');
      });
    });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
};


// Login user
exports.login = (req, res) => {
  const { user_email, user_pass } = req.body;

  // SQL query to find the user by email
  const query = 'SELECT * FROM users WHERE user_email = ?';
  
  // Execute the query with the provided email
  db.query(query, [user_email], (err, results) => {
    if (err) {
      return res.status(500).send('Error logging in');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0]; // Getting the user data

    // Compare the provided password with the hashed password asynchronously
    bcrypt.compare(user_pass, user.user_password, (err, isMatch) => {
      if (err) {
        return res.status(500).send('Error verifying password');
      }
      if (!isMatch) {
        return res.status(401).send('Invalid password');
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: 86400, // Token expires in 24 hours
      });

      // Respond with the token and user details
      res.status(200).send({
        auth: true,
        token,
        user_name: user.user_name,  // Provide the user name
        user_email: user.user_email // Optionally send back the email or other details
      });
    });
  });
};
