import express from 'express';
import session from 'express-session';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';
import archiver from 'archiver';
import cron from 'node-cron';
import { ensureDirectories, readJson, writeJson, deleteFile, listDir, invalidateCache } from './fileService.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // secure in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from the built frontend
app.use(express.static(path.join(process.cwd(), 'dist')));

app.use('/appdata', express.static(path.join(process.cwd(), 'public', 'appdata')));

const upload = multer({ storage: multer.memoryStorage() });

await ensureDirectories();

// Media routes
app.post('/api/media/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const id = uuidv4();
    const ext = path.extname(file.originalname);
    const newName = `${id}${ext}`;
    const filePath = path.join('media', 'files', newName);
    const fullFilePath = path.join(process.cwd(), 'public', 'appdata', filePath);

    await fs.writeFile(fullFilePath, file.buffer);

    const meta = {
      id,
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: `/appdata/${filePath}`,
      uploadDate: new Date().toISOString(),
    };

    await writeJson(`media/data/${id}.json`, meta);

    // Update index
    await updateMediaIndex();

    res.json(meta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/media', async (req, res) => {
  try {
    const index = await readJson('media/index.json').catch(() => []);
    res.json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const meta = await readJson(`media/data/${id}.json`);
    await deleteFile(`media/files/${path.basename(meta.path)}`);
    await deleteFile(`media/data/${id}.json`);
    await updateMediaIndex();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const meta = await readJson(`media/data/${id}.json`);
    const newMeta = { ...meta, ...updates };
    await writeJson(`media/data/${id}.json`, newMeta);
    await updateMediaIndex();
    res.json(newMeta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin authentication routes
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'hello@danadelola.com' && password === 'Ade1997@.') {
    (req.session as any).isAdmin = true;
    (req.session as any).user = { email };
    res.json({ success: true, user: { email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed' });
    } else {
      res.clearCookie('connect.sid');
      res.json({ success: true });
    }
  });
});

app.get('/api/admin/status', (req, res) => {
  if ((req.session as any).isAdmin) {
    res.json({ isAuthenticated: true, isAdmin: true, user: (req.session as any).user });
  } else {
    res.json({ isAuthenticated: false, isAdmin: false });
  }
});

// Similar for posts, emails, users, settings
// For brevity, I'll add basic CRUD for posts as example

app.get('/api/posts', async (req, res) => {
  try {
    const files = await listDir('posts');
    const posts = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const post = await readJson(`posts/${file}`);
        posts.push(post);
      }
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const post = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
    await writeJson(`posts/${post.id}.json`, post);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await readJson(`posts/${req.params.id}.json`);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const post = await readJson(`posts/${req.params.id}.json`);
    const updated = { ...post, ...req.body, updatedAt: new Date().toISOString() };
    await writeJson(`posts/${req.params.id}.json`, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await deleteFile(`posts/${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emails routes
app.get('/api/emails', async (req, res) => {
  try {
    const files = await listDir('emails');
    const emails = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const email = await readJson(`emails/${file}`);
        emails.push(email);
      }
    }
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/emails', async (req, res) => {
  try {
    const email = { id: uuidv4(), ...req.body };
    await writeJson(`emails/${email.id}.json`, email);
    res.json(email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/emails/:id', async (req, res) => {
  try {
    const email = await readJson(`emails/${req.params.id}.json`);
    res.json(email);
  } catch (error) {
    res.status(404).json({ error: 'Email not found' });
  }
});

app.put('/api/emails/:id', async (req, res) => {
  try {
    const email = await readJson(`emails/${req.params.id}.json`);
    const updated = { ...email, ...req.body };
    await writeJson(`emails/${req.params.id}.json`, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/emails/:id', async (req, res) => {
  try {
    await deleteFile(`emails/${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const files = await listDir('users');
    const users = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const user = await readJson(`users/${file}`);
        users.push(user);
      }
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = { id: uuidv4(), ...req.body };
    await writeJson(`users/${user.id}.json`, user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await readJson(`users/${req.params.id}.json`);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await readJson(`users/${req.params.id}.json`);
    const updated = { ...user, ...req.body };
    await writeJson(`users/${req.params.id}.json`, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await deleteFile(`users/${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings routes
app.get('/api/settings', async (req, res) => {
  try {
    const files = await listDir('settings');
    const settings = {};
    for (const file of files) {
      if (file.endsWith('.json')) {
        const setting = await readJson(`settings/${file}`);
        settings[file.replace('.json', '')] = setting;
      }
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings/:key', async (req, res) => {
  try {
    await writeJson(`settings/${req.params.key}.json`, req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/settings/:key', async (req, res) => {
  try {
    const setting = await readJson(`settings/${req.params.key}.json`);
    res.json(setting);
  } catch (error) {
    res.status(404).json({ error: 'Setting not found' });
  }
});

app.put('/api/settings/:key', async (req, res) => {
  try {
    const setting = await readJson(`settings/${req.params.key}.json`);
    const updated = { ...setting, ...req.body };
    await writeJson(`settings/${req.params.key}.json`, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/settings/:key', async (req, res) => {
  try {
    await deleteFile(`settings/${req.params.key}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Finance routes
app.get('/api/expenses', async (req, res) => {
  try {
    const files = await listDir('expenses');
    const expenses = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const expense = await readJson(`expenses/${file}`);
        expenses.push(expense);
      }
    }
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const expense = { id: uuidv4(), ...req.body };
    await writeJson(`expenses/${expense.id}.json`, expense);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await readJson(`expenses/${req.params.id}.json`);
    const updated = { ...expense, ...req.body };
    await writeJson(`expenses/${req.params.id}.json`, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await deleteFile(`expenses/${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/savings-goals', async (req, res) => {
  try {
    const files = await listDir('savings-goals');
    const goals = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const goal = await readJson(`savings-goals/${file}`);
        goals.push(goal);
      }
    }
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/savings-goals', async (req, res) => {
  try {
    const goal = { id: uuidv4(), ...req.body };
    await writeJson(`savings-goals/${goal.id}.json`, goal);
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/savings-goals/:id', async (req, res) => {
  try {
    const goal = await readJson(`savings-goals/${req.params.id}.json`);
    const updated = { ...goal, ...req.body };
    await writeJson(`savings-goals/${req.params.id}.json`, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/savings-goals/:id', async (req, res) => {
  try {
    await deleteFile(`savings-goals/${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const files = await listDir('tasks');
    const tasks = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const task = await readJson(`tasks/${file}`);
        tasks.push(task);
      }
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const id = uuidv4();
    const task = {
      id,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await writeJson(`tasks/${id}.json`, task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await readJson(`tasks/${req.params.id}.json`);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const existingTask = await readJson(`tasks/${req.params.id}.json`);
    const updatedTask = {
      ...existingTask,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await writeJson(`tasks/${req.params.id}.json`, updatedTask);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await deleteFile(`tasks/${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/portfolio', async (req, res) => {
  try {
    const files = await listDir('portfolio');
    const items = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const item = await readJson(`portfolio/${file}`);
        items.push(item);
      }
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    const id = uuidv4();
    const item = {
      id,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await writeJson(`portfolio/${id}.json`, item);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const item = await readJson(`portfolio/${req.params.id}.json`);
    res.json(item);
  } catch (error) {
    res.status(404).json({ error: 'Portfolio item not found' });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  try {
    const existingItem = await readJson(`portfolio/${req.params.id}.json`);
    const updatedItem = {
      ...existingItem,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await writeJson(`portfolio/${req.params.id}.json`, updatedItem);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    await deleteFile(`portfolio/${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function updateMediaIndex() {
  const files = await listDir('media/data');
  const index = [];
  for (const file of files) {
    if (file.endsWith('.json')) {
      const meta = await readJson(`media/data/${file}`);
      index.push(meta);
    }
  }
  await writeJson('media/index.json', index);
}

// Backup daily
cron.schedule('0 0 * * *', async () => {
  const date = new Date().toISOString().split('T')[0];
  const backupPath = path.join(process.cwd(), 'backup', `${date}.zip`);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });

  const output = fs.createWriteStream(backupPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => console.log('Backup created'));
  archive.on('error', (err) => console.error(err));

  archive.pipe(output);
  archive.directory(path.join(process.cwd(), 'public', 'appdata'), false);
  await archive.finalize();
});

// Catch-all handler: send back index.html for client-side routing
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});