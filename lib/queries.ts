import { supabase } from './supabase';
import type { Database } from './db.types';

type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type TeamRoster = Database['public']['Tables']['team_rosters']['Row'];

export interface TeamWithRoster extends Team {
  players: Array<Player & {
    is_captain: boolean | null;
    is_player_coach: boolean | null;
    joined_at: string | null;
  }>;
}

/**
 * Fetch all teams with basic info
 * Only returns the two specific teams configured for this app
 */
export async function getTeams(): Promise<Team[]> {
  const allowedTeamIds = [
    'a66e363f-bc0d-4fbf-82a1-bf9ab1c760f7',
    'ed3e6f8d-3176-4c15-a20f-0ccfe04a99ca',
  ];

  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .in('id', allowedTeamIds)
    .order('name');

  if (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch team roster with player details
 */
export async function getTeamRoster(teamId: string): Promise<TeamWithRoster['players']> {
  // Fetch roster entries
  const { data: rosterData, error: rosterError } = await supabase
    .from('team_rosters')
    .select('is_captain, is_player_coach, joined_at, player_id')
    .eq('team_id', teamId)
    .is('left_at', null); // Only get active roster members

  if (rosterError) {
    console.error('Error fetching team roster:', rosterError);
    throw rosterError;
  }

  if (!rosterData || rosterData.length === 0) {
    return [];
  }

  // Fetch player details for all players in roster
  const playerIds = rosterData.map((r) => r.player_id).filter((id): id is string => id !== null);
  
  if (playerIds.length === 0) {
    return [];
  }

  const { data: playersData, error: playersError } = await supabase
    .from('players')
    .select('*')
    .in('id', playerIds);

  if (playersError) {
    console.error('Error fetching players:', playersError);
    throw playersError;
  }

  if (!playersData) {
    return [];
  }

  // Create a map of player_id to player data
  const playersMap = new Map(playersData.map((p) => [p.id, p]));

  // Deduplicate rosters by player_id (keep the most recent joined_at or first entry)
  const rosterMap = new Map<string, typeof rosterData[0]>();
  rosterData.forEach((roster) => {
    if (roster.player_id) {
      const existing = rosterMap.get(roster.player_id);
      if (!existing) {
        rosterMap.set(roster.player_id, roster);
      } else if (roster.joined_at && existing.joined_at) {
        // Keep the one with the most recent joined_at
        if (new Date(roster.joined_at) > new Date(existing.joined_at)) {
          rosterMap.set(roster.player_id, roster);
        }
      }
    }
  });

  // Combine roster and player data (now deduplicated)
  return Array.from(rosterMap.values())
    .filter((roster) => roster.player_id && playersMap.has(roster.player_id))
    .map((roster) => {
      const player = playersMap.get(roster.player_id!)!;
      return {
        ...player,
        is_captain: roster.is_captain,
        is_player_coach: roster.is_player_coach,
        joined_at: roster.joined_at,
      };
    });
}

/**
 * Fetch complete team information
 */
export async function getTeamInfo(teamId: string): Promise<TeamWithRoster | null> {
  // Fetch team info
  const { data: teamData, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .single();

  if (teamError) {
    console.error('Error fetching team info:', teamError);
    throw teamError;
  }

  if (!teamData) {
    return null;
  }

  // Fetch roster
  const players = await getTeamRoster(teamId);

  return {
    ...teamData,
    players,
  };
}

