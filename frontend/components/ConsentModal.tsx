import React, { useState } from 'react';

interface ConsentModalProps {
  userId: string;
  onStart: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ userId, onStart }) => {
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitConsent = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, consent: true }),
      });
      onStart();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>録音への同意</h2>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          録音に同意します
        </label>
        <button onClick={submitConsent} disabled={!checked || submitting}>
          録音開始
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;

