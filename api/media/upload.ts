import { IncomingForm } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';
import { writeJson, uploadFile, updateMediaIndex } from '../../backend/fileService.js';

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const file = files.file?.[0];
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    try {
      const id = uuidv4();
      const ext = path.extname(file.originalFilename || '');
      const newName = `${id}${ext}`;
      const buffer = await fs.readFile(file.filepath);
      const filePath = `media/files/${newName}`;
      const url = await uploadFile(filePath, buffer, file.mimetype || '');

      const meta = {
        id,
        name: file.originalFilename,
        size: file.size,
        type: file.mimetype,
        path: url,
        uploadDate: new Date().toISOString(),
      };

      await writeJson(`media/data/${id}.json`, meta);
      await updateMediaIndex();

      res.json(meta);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};