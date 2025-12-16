'use client';

import { useState } from 'react';

interface ScriptOutputProps {
  script: string;
}

export default function ScriptOutput({ script }: ScriptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy script:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Generated Script</h2>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>{copied ? 'Copied!' : 'Copy Script'}</span>
        </button>
      </div>
      
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <pre className="whitespace-pre-wrap">{script}</pre>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Navigate to the league registration form page</li>
          <li>Open your browser&apos;s developer console (F12 or right-click → Inspect → Console)</li>
          <li>Paste the script above into the console</li>
          <li>Press Enter to execute the script</li>
          <li>The form should be automatically filled with your team data</li>
        </ol>
      </div>
    </div>
  );
}

