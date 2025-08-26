import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

/**
 * POST /api/uploadAudio
 * Receives audio blob and stores it temporarily.
 */
router.post('/uploadAudio', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio uploaded' });
  }

  const filePath = req.file.path;
  // For demo purposes we simply acknowledge receipt of the file.
  res.json({ message: 'Audio uploaded', file: req.file.filename });

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Failed to remove temporary file:', err);
    }
  });
});

export default router;
