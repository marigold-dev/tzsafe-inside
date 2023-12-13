import React, { useState } from 'react';

export const ShortAddress: React.FC<{ address: string }> = ({ address }) => {
  const [copied, setCopied] = useState(false);
  const shortened = `${address.substring(0, 5)} ...${address.substring(address.length - 3)}`;

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Message will disappear after 2 seconds
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <span title={address} onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
          {shortened}
        </span>
      </div>
      <div className="flex space-x-2">
        <a href={`https://tzsafe.marigold.dev/${address}`} target="_blank" rel="noopener noreferrer">
          <img src="https://assets-global.website-files.com/616ab4741d375d1642c19027/642bdf58436a27e380de9919_TzSafe.svg" alt="TZSafe Link" className="h-6" />
        </a>
        <a href={`https://tzkt.io/${address}`} target="_blank" rel="noopener noreferrer">
          <img src="https://tzkt.io/logo.svg" alt="TZKT Link" className="h-6" />
        </a>
      </div>
      <div>
        {copied && <span className="text-sm text-gray-600">Copied</span>}
      </div>
    </div>
  );
};
