const express = require('express');
const path = require('path');

const app = express ();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'Develop', 'public')));

let notes = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    notes.push(newNote);
    res.json(newNote);
    console.log('New note posted')
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
  });

  app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id);
  
    const indexToDelete = notes.findIndex(note => note.id === idToDelete);
  
    if (indexToDelete !== -1) {
        notes.splice(indexToDelete, 1);
        res.json({ message: 'Note deleted successfully' });
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
