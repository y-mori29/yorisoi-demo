import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SharePage() {
  const router = useRouter();
  const { token } = router.query;
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');

  const load = (pwd?: string) => {
    if (!token) return;
    const url = pwd ? `/api/share/${token}?password=${encodeURIComponent(pwd)}` : `/api/share/${token}`;
    fetch(url).then(async res => {
      if (res.status === 200) {
        const data = await res.json();
        setContent(data.content);
        setError('');
        setPasswordRequired(false);
      } else if (res.status === 401) {
        setPasswordRequired(true);
        setError('Password required');
      } else if (res.status === 403) {
        setError('Invalid password');
      } else if (res.status === 410) {
        setError('Link expired');
      } else if (res.status === 404) {
        setError('Link not found');
      } else {
        setError('Unknown error');
      }
    });
  };

  useEffect(() => {
    load();
  }, [token]);

  if (error && !passwordRequired && !content) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {content && <pre>{content}</pre>}
      {!content && passwordRequired && (
        <div>
          <p>{error}</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => load(password)}>Submit</button>
        </div>
      )}
      {!content && !passwordRequired && error && <p>{error}</p>}
    </div>
  );
}
