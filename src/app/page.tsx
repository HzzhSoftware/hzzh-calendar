import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Calendar</h1>
          <p className="text-xl text-gray-600 mb-8">
            The simple way to schedule meetings with your clients
            <br />
            {process.env.NEXT_PUBLIC_CDN_URL}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/docs"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Read Documentation
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: 'Easy Scheduling',
              description: 'Share your link and let clients book their preferred time'
            },
            {
              title: 'Custom Meeting Types',
              description: 'Create different meeting durations and prices'
            },
            {
              title: 'Calendar Integration',
              description: 'Sync with your favorite calendar app'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-600">
          <p>
            Using our mock API at{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">localhost:3001</code>
          </p>
        </div>
      </main>
    </div>
  );
}
