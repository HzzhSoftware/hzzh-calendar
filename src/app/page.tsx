export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Book a Meeting with John Doe</h1>
          <p className="text-gray-600">Select a time that works for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* Calendar Navigation */}
          <div className="col-span-full flex justify-between items-center mb-4">
            <button className="p-2 hover:bg-gray-100 rounded">
              &larr; Previous
            </button>
            <h2 className="text-lg font-semibold">March 2024</h2>
            <button className="p-2 hover:bg-gray-100 rounded">
              Next &rarr;
            </button>
          </div>

          {/* Calendar Days */}
          <div className="hidden md:grid md:grid-cols-7 col-span-full gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold mb-4">Available Times</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                <button
                  key={time}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meeting Details */}
        <div className="mt-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Meeting Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                placeholder="your@email.com"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              Schedule Meeting
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
