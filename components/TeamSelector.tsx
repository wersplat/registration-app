'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTeams } from '@/lib/queries';
import type { Database } from '@/lib/db.types';

type Team = Database['public']['Tables']['teams']['Row'];

export default function TeamSelector() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-semibold">Error loading teams</p>
        <p>{error}</p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No teams found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Select a Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/team/${team.id}`}
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              {team.logo_url && (
                <Image
                  src={team.logo_url}
                  alt={team.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {team.name}
                </h3>
                {team.current_rp !== null && (
                  <p className="text-sm text-gray-500">
                    RP: {team.current_rp}
                  </p>
                )}
                {team.leaderboard_tier && (
                  <p className="text-sm text-gray-500">
                    Tier: {team.leaderboard_tier}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

