import React from 'react';
import Disclaimer from '../components/Disclaimer';

/**
 * Placeholder summary view showing how to include the Disclaimer component in the footer.
 */
const Summary: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <h1>Summary View</h1>
        <p>ここにサマリー情報が表示されます。</p>
      </main>
      <footer>
        <Disclaimer />
      </footer>
    </div>
  );
};

export default Summary;
