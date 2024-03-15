const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const dbPath = path.join(__dirname, 'Develop', 'db', 'db.json');

const readDbFile = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeDbFile = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Develop', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  try {
    const notes = readDbFile();
    res.json(notes);
  } catch (error) {
    console.error('Error reading notes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notes', (req, res) => {
  try {
    const newNote = req.body;
    const notes = readDbFile();
    newNote.id = notes.length + 1;
    notes.push(newNote);
    writeDbFile(notes);
    res.json(newNote);
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/notes/:id', (req, res) => {
  try {
    const idToDelete = parseInt(req.params.id);
    const notes = readDbFile();
    const updatedNotes = notes.filter(note => note.id !== idToDelete);
    writeDbFile(updatedNotes);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
