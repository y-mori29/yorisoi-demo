import React from 'react';

/**
 * RecordingIndicator clearly shows when the assistant is active.
 */
export const RecordingIndicator: React.FC = () => {
  return (
    <div style={{ color: 'red', fontWeight: 'bold' }}>
      ● 同伴メモON
    </div>
  );
};

export default RecordingIndicator;
