/**
 * Workspace Gateway - Express Server Backend
 * 
 * Instructions to run:
 * 1. Ensure Node.js is installed on your Windows machine.
 * 2. Open this folder in a terminal.
 * 3. Run: npm install express cors
 * 4. Run: node server.js
 * 
 * Note: If this server is not running, the frontend will automatically 
 * fall back to a mock database in your browser's LocalStorage!
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests from the HTML files
app.use(express.json()); // Parse JSON bodies

// In-memory mock database for registered users
const users = [
  { 
    name: 'Demo User', 
    email: 'demo@example.com', 
    password: 'password123' 
  }
];

// --- ROUTES ---

// 1. Sign Up Route
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Basic server-side validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if user already exists
  const userExists = users.some(u => u.email === email);
  if (userExists) {
    return res.status(409).json({ message: 'User with this email already exists.' });
  }

  // Save the new user to our "database"
  const newUser = { name, email, password };
  users.push(newUser);
  
  console.log(`[Success] New user registered: ${email}`);
  
  return res.status(201).json({ 
    message: 'Account successfully created!',
    user: { name, email } 
  });
});

// 2. Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Verify credentials
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log(`[Failed] Invalid login attempt for: ${email}`);
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  console.log(`[Success] User logged in: ${email}`);

  // In a real backend, you would return a JWT session token here
  return res.status(200).json({
    message: 'Login successful!',
    user: { name: user.name, email: user.email }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Workspace Gateway API Server is running!`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
