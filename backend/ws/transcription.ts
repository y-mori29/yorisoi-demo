import { WebSocketServer, WebSocket } from 'ws';
import { TranscriptionSegment } from '../db/transcriptions';

interface Client {
  id: string;
  ws: WebSocket;
}

const clients: Client[] = [];

export function startTranscriptionWS(server: any) {
  const wss = new WebSocketServer({ server, path: '/ws/transcriptions' });
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const id = url.pathname.split('/').pop() || '';
    clients.push({ id, ws });
    ws.on('close', () => {
      const idx = clients.findIndex((c) => c.ws === ws);
      if (idx >= 0) clients.splice(idx, 1);
    });
  });
}

export function broadcastSegment(id: string, segment: TranscriptionSegment) {
  const message = JSON.stringify({ segments: [segment] });
  clients.filter((c) => c.id === id).forEach((c) => c.ws.send(message));
}
