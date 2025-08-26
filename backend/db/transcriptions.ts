import { v4 as uuidv4 } from 'uuid';

export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  speaker?: string;
}

export interface TranscriptionRecord {
  id: string;
  segments: TranscriptionSegment[];
  createdAt: Date;
  updatedAt: Date;
}

// simple in-memory store; replace with real DB in production
const store: Map<string, TranscriptionRecord> = new Map();

export function saveTranscription(segments: TranscriptionSegment[]): TranscriptionRecord {
  const id = uuidv4();
  const record: TranscriptionRecord = {
    id,
    segments,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  store.set(id, record);
  return record;
}

export function getTranscription(id: string): TranscriptionRecord | undefined {
  return store.get(id);
}

export function updateTranscription(id: string, segments: TranscriptionSegment[]): TranscriptionRecord | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;
  const updated: TranscriptionRecord = { ...existing, segments, updatedAt: new Date() };
  store.set(id, updated);
  return updated;
}
