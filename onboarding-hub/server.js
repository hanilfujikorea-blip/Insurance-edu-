import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Initialize DB file if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ employees: [] }, null, 2));
}

// Get all employees
app.get('/api/employees', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  res.json(data.employees);
});

// Add/Update employee
app.post('/api/employees', (req, res) => {
  const { employees } = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const newEmployee = req.body;
  
  const existingIndex = employees.findIndex(e => e.id === newEmployee.id);
  if (existingIndex > -1) {
    employees[existingIndex] = newEmployee;
  } else {
    employees.push(newEmployee);
  }
  
  fs.writeFileSync(DB_PATH, JSON.stringify({ employees }, null, 2));
  res.json({ success: true, employee: newEmployee });
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const { employees } = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const filtered = employees.filter(e => e.id !== id);
  
  fs.writeFileSync(DB_PATH, JSON.stringify({ employees: filtered }, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Local Backend Server running at http://localhost:${PORT}`);
});
