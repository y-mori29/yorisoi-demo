import React from 'react';

/**
 * Displays a disclaimer about the non-medical nature of the tool and guidance on seeking emergency care.
 *
 * The actual text should be provided via the `NEXT_PUBLIC_DISCLAIMER_TEXT` environment variable so that
 * legal teams can update the copy without requiring code changes.
 */
export const Disclaimer: React.FC = () => {
  const defaultText =
    'このコンテンツは医療助言を目的としたものではありません。緊急の場合は医療機関を受診してください。';
  const text = process.env.NEXT_PUBLIC_DISCLAIMER_TEXT ?? defaultText;

  return (
    <div className="text-xs text-gray-500 mt-4">
      <p>{text}</p>
    </div>
  );
};

export default Disclaimer;
