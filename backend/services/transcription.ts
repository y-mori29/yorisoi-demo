import fs from 'fs';
import { SpeechClient } from '@google-cloud/speech';
import {
  saveTranscription,
  TranscriptionSegment,
  TranscriptionRecord,
} from '../db/transcriptions';

const client = new SpeechClient();

/**
 * Transcribe an audio file using Google Cloud Speech-to-Text.
 * Japanese language and medical vocabulary are requested.
 * Speaker diarization and timestamps are enabled.
 */
export async function transcribeAudio(filePath: string): Promise<TranscriptionRecord> {
  const audio = {
    content: fs.readFileSync(filePath).toString('base64'),
  };

  const config = {
    languageCode: 'ja-JP',
    enableSpeakerDiarization: true,
    enableWordTimeOffsets: true,
    model: 'latest_long',
  } as any;

  const [response] = await client.recognize({ audio, config });

  const segments: TranscriptionSegment[] = [];
  for (const result of response.results ?? []) {
    const alt = result.alternatives?.[0];
    const words = alt?.words || [];
    let current: TranscriptionSegment | null = null;
    for (const w of words) {
      const speaker = w.speakerTag || 0;
      const start = Number(w.startTime?.seconds || 0) + Number(w.startTime?.nanos || 0) / 1e9;
      const end = Number(w.endTime?.seconds || 0) + Number(w.endTime?.nanos || 0) / 1e9;
      if (!current || current.speaker !== speaker) {
        if (current) segments.push(current);
        current = { text: w.word || '', start, end, speaker };
      } else {
        current.text += ' ' + (w.word || '');
        current.end = end;
      }
    }
    if (current) segments.push(current);
  }

  return saveTranscription(segments);
}
