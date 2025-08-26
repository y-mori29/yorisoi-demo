import { useRef, useState } from 'react';

interface RecorderControls {
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => Promise<void>;
  isRecording: boolean;
  isPaused: boolean;
}

/**
 * useRecorder provides MediaRecorder control helpers.
 * It exposes start/pause/resume/stop functions and handles
 * uploading the recorded audio to the backend.
 */
export function useRecorder(): RecorderControls {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    if (isRecording) return;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.error('Failed to obtain microphone access', e);
      alert('マイクの権限を取得できませんでした。');
      setIsRecording(false);
      return;
    }
    streamRef.current = stream;
    const mediaRecorder = new MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setIsPaused(false);
  };

  const pause = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === 'recording') {
      mr.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === 'paused') {
      mr.resume();
      setIsPaused(false);
    }
  };

  const stop = async () => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    return new Promise<void>((resolve) => {
      mr.onstop = async () => {
        setIsRecording(false);
        setIsPaused(false);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        try {
          await fetch('/api/uploadAudio', {
            method: 'POST',
            body: formData,
          });
        } catch (e) {
          console.error('Failed to upload audio', e);
        }
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        resolve();
      };
      mr.stop();
    });
  };

  return { start, pause, resume, stop, isRecording, isPaused };
}
