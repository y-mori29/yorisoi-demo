import express from 'express';
import http from 'http';

import uploadAudioRouter from './routes/uploadAudio';
import transcriptionsRouter from './routes/transcriptions';
import consentRouter from './routes/consent';
import shareRouter from './routes/share';
import { startTranscriptionWS } from './ws/transcription';

const app = express();
app.use(express.json());

app.use('/api', uploadAudioRouter);
app.use('/api/transcriptions', transcriptionsRouter);
app.use('/api/consent', consentRouter);
app.use('/api', shareRouter);

const server = http.createServer(app);
startTranscriptionWS(server);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
