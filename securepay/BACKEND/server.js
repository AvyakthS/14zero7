const cors = require('cors');
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();

app.use(cors());
app.use(express.json());
app.options(/.*/, cors());


// THE REST OF YOUR ROUTES BELOW...

let users = [];
fs.createReadStream('users.csv')
  .pipe(csv())
  .on('data', (row) => users.push(row))
  .on('end', () => console.log('Loaded users from CSV'));

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const found = users.find(u => u.email === email && u.password === password);
  if (found) res.json({ success: true, user: found });
  else res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/api/ping', (req, res) => res.json({ success: true, message: "pong" }));

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const exists = users.some(u => u.email === email);
  if (exists) return res.status(409).json({ success: false, message: 'Email already taken' });
  const newUser = { id: String(users.length + 1), name, email, password };
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
