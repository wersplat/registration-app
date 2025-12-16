import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTeamInfo } from '@/lib/queries';
import TeamInfo from '@/components/TeamInfo';
import RosterDisplay from '@/components/RosterDisplay';
import ScriptGenerator from '@/components/ScriptGenerator';

interface TeamPageProps {
  params: {
    id: string;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const teamData = await getTeamInfo(params.id);

  if (!teamData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Teams
        </Link>

        <div className="space-y-6">
          <TeamInfo team={teamData} />
          <RosterDisplay players={teamData.players} />
          <ScriptGenerator team={teamData} players={teamData.players} />
        </div>
      </div>
    </main>
  );
}

