import OpenAI from 'openai';
import fs from 'fs';
import {
  saveTranscription,
  TranscriptionSegment,
  TranscriptionRecord,
} from '../db/transcriptions';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Transcribe an audio file using OpenAI Whisper.
 * Japanese language and medical vocabulary are requested.
 * Speaker diarization and timestamps are enabled.
 */
export async function transcribeAudio(filePath: string): Promise<TranscriptionRecord> {
  const response: any = await client.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'gpt-4o-transcribe', // or 'whisper-1'
    language: 'ja',
    prompt: '医療用語',
    response_format: 'verbose_json',
    diarization: true,
  });

  const segments: TranscriptionSegment[] = (response.segments || []).map((s: any) => ({
    text: s.text,
    start: s.start,
    end: s.end,
    speaker: s.speaker,
  }));

  return saveTranscription(segments);
}
