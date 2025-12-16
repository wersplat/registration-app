'use client';

import { useState } from 'react';
import ScriptOutput from './ScriptOutput';
import { generateScript } from '@/lib/script-generator';
import type { Database } from '@/lib/db.types';

type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];

interface RosterPlayer extends Player {
  is_captain: boolean | null;
  is_player_coach: boolean | null;
}

interface ScriptGeneratorProps {
  team: Team;
  players: RosterPlayer[];
}

export default function ScriptGenerator({ team, players }: ScriptGeneratorProps) {
  const [script, setScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    try {
      const generatedScript = generateScript({ team, players });
      setScript(generatedScript);
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Generate Auto-Fill Script</h2>
        <p className="text-gray-600 mb-6">
          Generate a browser console script that will automatically fill league registration forms
          with your team&apos;s data.
        </p>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isGenerating ? 'Generating...' : 'Generate Script'}
        </button>
      </div>

      {script && <ScriptOutput script={script} />}
    </div>
  );
}

