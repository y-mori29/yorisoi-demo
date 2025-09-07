import React, { useState } from 'react';

interface ConsentModalProps {
  userId: string;
  onStart: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ userId, onStart }) => {
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitConsent = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, consent: true }),
      });
      if (!response.ok) {
        setError('同意の保存に失敗しました。');
        return;
      }
      onStart();
    } catch (err) {
      console.error(err);
      setError('ネットワークエラーが発生しました。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>付き添いアシスタントの利用に同意</h2>
        <p>AIアシスタントが診察に付き添い、会話をリアルタイムで文字に変換します。</p>
        <p>音声データは保存されず、変換された文字のみを診察メモとして残します。</p>
        <p>あとからいつでもご自身で振り返ることができます。</p>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          説明を理解し、付き添いアシスタントの利用に同意します
        </label>
        <button onClick={submitConsent} disabled={!checked || submitting}>
          付き添いアシスタントを開始
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ConsentModal;

