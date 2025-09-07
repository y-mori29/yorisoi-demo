import express from 'express';
import http from 'http';

import uploadAudioRouter from './routes/uploadAudio.js';
import transcriptionsRouter from './routes/transcriptions.js';
import consentRouter, { initConsentTable } from './routes/consent.js';
import shareRouter from './routes/share.js';
import { startTranscriptionWS } from './ws/transcription.js';
import { cleanupUploads } from './utils/cleanupUploads.js';

async function startServer() {
  // 起動前の初期化
  await initConsentTable();

  const app = express();
  app.use(express.json());

  // 動作確認用エンドポイント（Cloud Run のヘルスチェック）
  app.get('/healthz', (_req, res) => res.status(200).send('ok'));

  // API ルーター
  app.use('/api', uploadAudioRouter);
  app.use('/api/transcriptions', transcriptionsRouter);
  app.use('/api/consent', consentRouter);
  app.use('/api', shareRouter);

  // HTTP サーバ（WebSocket をぶら下げるため http.Server を使用）
  const server = http.createServer(app);
  startTranscriptionWS(server);

  // 一時ファイルのクリーンアップ（起動時＋1時間ごと）
  cleanupUploads();
  setInterval(cleanupUploads, 60 * 60 * 1000);

  // Cloud Run の待ち受け設定：環境変数 PORT と 0.0.0.0 を使って待受
  const PORT = Number(process.env.PORT) || 8080;
  const HOST = '0.0.0.0';
  server.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
