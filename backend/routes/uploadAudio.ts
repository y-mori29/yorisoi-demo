import { Router } from 'express';
import multer from 'multer';

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
  // For demo purposes we simply acknowledge receipt of the file.
  res.json({ message: 'Audio uploaded', file: req.file.filename });
});

export default router;
