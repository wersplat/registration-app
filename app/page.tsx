import TeamSelector from '@/components/TeamSelector';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            League Registration Form Auto-Filler
          </h1>
          <p className="text-lg text-gray-600">
            Select a team to generate browser console scripts for auto-filling league registration forms.
          </p>
        </div>
        <TeamSelector />
      </div>
    </main>
  );
}

