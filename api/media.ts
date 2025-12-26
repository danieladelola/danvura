import { readJson } from '../../backend/fileService.js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const index = await readJson('media/index.json');
    res.json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};