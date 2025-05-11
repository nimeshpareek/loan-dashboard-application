import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL DB connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'loan_dashboard',
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL DB');
});

// Register User
// Register User
// Register User
app.post('/api/register', async (req, res) => {
  const { username, password, gender } = req.body;

  if (!username || !password || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    db.query(
      'INSERT INTO users (username, password, gender, role) VALUES (?, ?, ?, "user")',
      [username, hashedPassword, gender],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Registration failed' });
        }

        // Send the userId back in the response
        const userId = result.insertId;
        console.log("Newly registered user ID:", userId); // Add this line to log the userId

        res.status(201).json({
          message: 'User registered successfully',
          userId: userId, // Include userId in the response
        });
      }
    );
  });
});


// Login Route
// Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, userId: user.id, role: user.role });
  });
});


// Apply for Loan
app.post('/api/loans', (req, res) => {
  const { userId, loanAmount, purpose } = req.body;

  console.log('Request Body:', req.body); // Log the request body

  if (!userId || !loanAmount || !purpose) {
    console.log('Missing fields:', { userId, loanAmount, purpose }); // Log missing fields
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Fetch the username from the users table
  db.query('SELECT username FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to fetch username' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const username = results[0].username;

    // Insert the loan application into the loans table
    db.query(
      'INSERT INTO loans (user_id, loanAmount, name, purpose) VALUES (?, ?, ?, ?)',
      [userId, loanAmount, username, purpose], // Store username as name
      (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Failed to apply for loan' });
        }
        res.status(200).json({ message: 'Loan application submitted successfully!' });
      }
    );
  });
});

// Fetch Loans for a User
app.get('/api/loans/:userId', (req, res) => {
  const { userId } = req.params;

  db.query('SELECT id, loanAmount, name, purpose, status FROM loans WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching loans' });
    }
    res.json(results);
  });
});

// Get dashboard statistics
app.get('/api/statistics', (req, res) => {
  Promise.all([
    new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) AS totalUsers FROM users', (err, result) => {
        if (err) reject(err);
        resolve(result?.[0]?.totalUsers || 0);
      });
    }),
    new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) AS totalLoans FROM loans', (err, result) => {
        if (err) reject(err);
        resolve(result?.[0]?.totalLoans || 0);
      });
    }),
  ])
    .then(([totalUsers, totalLoans]) => {
      res.json({ totalUsers, totalLoans });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// Update loan status
app.post('/api/loans/:id/status', (req, res) => {
  const { id } = req.params; // Loan ID
  const { status } = req.body; // Status: 'approved' or 'rejected'

  db.query(
    'UPDATE loans SET status = ? WHERE id = ?',
    [status, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update loan status' });
      }
      res.status(200).json({ message: 'Loan status updated successfully' });
    }
  );
});


app.post('/api/loans/decision', (req, res) => {
  const { loanId, status } = req.body;

  db.query(
    'UPDATE loans SET status = ? WHERE id = ?',
    [status, loanId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

// Get all loans
app.get('/api/loans', (req, res) => {
  const query = `
    SELECT loans.id, loans.loanAmount, loans.status, loans.name, users.username 
    FROM loans 
    JOIN users ON loans.user_id = users.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching loans' });
    }
    res.json(results);
  });
});

// Get loan counts
app.get('/api/loan-counts', (req, res) => {
  db.query(
    `SELECT 
      COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approvedLoans,
      COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejectedLoans,
      COUNT(CASE WHEN status IS NULL THEN 1 END) AS pendingLoans
    FROM loans`,
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching loan counts' });
      }
      res.json(results[0]);
    }
  );
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
