import React from 'react';
import { useRecorder } from '../hooks/useRecorder';
import RecordingIndicator from './RecordingIndicator';

/**
 * RecorderControls provides buttons to control the MediaRecorder
 * via the useRecorder hook.
 */
const RecorderControls: React.FC = () => {
  const { start, pause, resume, stop, isRecording, isPaused } = useRecorder();

  const handleStop = async () => {
    if (window.confirm('録音を終了しますか？')) {
      await stop();
    }
  };

  return (
    <div>
      <button onClick={start} disabled={isRecording && !isPaused}>
        録音
      </button>
      <button onClick={isPaused ? resume : pause} disabled={!isRecording}>
        {isPaused ? '再開' : '一時停止'}
      </button>
      <button onClick={handleStop} disabled={!isRecording}>
        終了
      </button>
      {isRecording && !isPaused && <RecordingIndicator />}
    </div>
  );
};

export default RecorderControls;
