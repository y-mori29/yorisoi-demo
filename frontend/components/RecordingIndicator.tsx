import React from 'react';

/**
 * RecordingIndicator clearly shows when the microphone is recording.
 */
export const RecordingIndicator: React.FC = () => {
  return (
    <div style={{ color: 'red', fontWeight: 'bold' }}>
      ● Recording...
    </div>
  );
};

export default RecordingIndicator;
