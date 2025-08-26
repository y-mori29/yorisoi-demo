import React, { useEffect, useState } from 'react';

interface Segment {
  text: string;
  start: number;
  end: number;
  speaker?: string;
}

export default function TranscriptionView({ transcriptionId }: { transcriptionId: string }) {
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";
    const ws = new WebSocket(`${wsBaseUrl}/ws/transcriptions/${transcriptionId}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSegments((prev) => [...prev, ...(data.segments || [])]);
    };
    return () => ws.close();
  }, [transcriptionId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/transcriptions/${transcriptionId}`);
      if (res.ok) {
        const data = await res.json();
        setSegments(data.segments || []);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [transcriptionId]);

  const updateSegment = (index: number, text: string) => {
    setSegments((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], text };
      return copy;
    });
  };

  const saveEdits = async () => {
    await fetch(`/api/transcriptions/${transcriptionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ segments }),
    });
  };

  return (
    <div>
      {segments.map((seg, i) => (
        <div key={i}>
          <span>
            [{seg.start.toFixed(1)}-{seg.end.toFixed(1)}] (S{seg.speaker ?? '?'})
          </span>
          <input value={seg.text} onChange={(e) => updateSegment(i, e.target.value)} />
        </div>
      ))}
      <button onClick={saveEdits}>保存</button>
    </div>
  );
}
