import React from 'react';
import Disclaimer from '../components/Disclaimer';

/**
 * Placeholder share link view displaying the Disclaimer component in the footer.
 */
const ShareLink: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <h1>Share Link View</h1>
        <p>ここに共有リンクの詳細が表示されます。</p>
      </main>
      <footer>
        <Disclaimer />
      </footer>
    </div>
  );
};

export default ShareLink;
