import express from 'express';
import { getTranscription, updateTranscription, TranscriptionSegment } from '../db/transcriptions';
import * as db from '../db/transcriptions.js';

const router = express.Router();

// retrieve transcription for polling
router.get('/:id', (req, res) => {
  const record = getTranscription(req.params.id);
  if (!record) return res.sendStatus(404);
  res.json(record);
});

// update transcription after user edits
router.put('/:id', (req, res) => {
  const segments = req.body.segments as TranscriptionSegment[];
  const record = updateTranscription(req.params.id, segments);
  if (!record) return res.sendStatus(404);
  res.json(record);
});

export default router;
