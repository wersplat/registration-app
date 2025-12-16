'use client';

import Image from 'next/image';
import type { Database } from '@/lib/db.types';

type Team = Database['public']['Tables']['teams']['Row'];

interface TeamInfoProps {
  team: Team;
}

export default function TeamInfo({ team }: TeamInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-6">
        {team.logo_url && (
          <Image
            src={team.logo_url}
            alt={team.name}
            width={96}
            height={96}
            className="w-24 h-24 object-contain"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{team.name}</h1>
          
          {team.alternate_name && (
            <p className="text-lg text-gray-600 mb-2">
              Alternate Name: {team.alternate_name}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {team.current_rp !== null && (
              <div>
                <p className="text-sm text-gray-500">Current RP</p>
                <p className="text-lg font-semibold">{team.current_rp}</p>
              </div>
            )}
            {team.leaderboard_tier && (
              <div>
                <p className="text-sm text-gray-500">Tier</p>
                <p className="text-lg font-semibold">{team.leaderboard_tier}</p>
              </div>
            )}
            {team.global_rank !== null && (
              <div>
                <p className="text-sm text-gray-500">Global Rank</p>
                <p className="text-lg font-semibold">#{team.global_rank}</p>
              </div>
            )}
            {team.money_won !== null && (
              <div>
                <p className="text-sm text-gray-500">Money Won</p>
                <p className="text-lg font-semibold">${team.money_won.toLocaleString()}</p>
              </div>
            )}
          </div>

          {(team.color_primary || team.color_secondary || team.color_accent) && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Team Colors</p>
              <div className="flex space-x-2">
                {team.color_primary && (
                  <div
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: team.color_primary }}
                    title={`Primary: ${team.color_primary}`}
                  />
                )}
                {team.color_secondary && (
                  <div
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: team.color_secondary }}
                    title={`Secondary: ${team.color_secondary}`}
                  />
                )}
                {team.color_accent && (
                  <div
                    className="w-12 h-12 rounded border border-gray-300"
                    style={{ backgroundColor: team.color_accent }}
                    title={`Accent: ${team.color_accent}`}
                  />
                )}
              </div>
            </div>
          )}

          {(team.team_twitter) && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Social Media</p>
              <div className="flex flex-wrap gap-3">
                {team.team_twitter && (
                  <a
                    href={`https://twitter.com/${team.team_twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                    <span>@{team.team_twitter}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

