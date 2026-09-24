
const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// GET Active Todos – Filter !completed
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((t) => !t.completed);

  res.status(200).json(activeTodos);
});

// GET Completed Todos
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);

  res.status(200).json(completed);
});

// GET One Todo – Read by ID
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found'
    });
  }

  res.status(200).json(todo);
});

// POST New – Create with Validation
app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validate task
  if (typeof task !== 'string' || !task.trim()) {
    return res.status(400).json({
      error: 'Task is required and must be a non-empty string'
    });
  }

  const newTodo = {
    id: todos.length
      ? Math.max(...todos.map((t) => t.id)) + 1
      : 1,
    task: task.trim(),
    completed: false
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found'
    });
  }

  // Validate task if included in update
  if (
    'task' in req.body &&
    (typeof req.body.task !== 'string' ||
      !req.body.task.trim())
  ) {
    return res.status(400).json({
      error: 'Task must be a non-empty string'
    });
  }

  Object.assign(todo, req.body);

  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  const initialLength = todos.length;

  todos = todos.filter((t) => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({
      error: 'Not found'
    });
  }

  res.status(204).send();
});

// Error-handling Middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Server error!'
  });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});