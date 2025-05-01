const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);

// Custom routes
server.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

server.get('/api/users/:handle/meeting-types', (req, res) => {
  const users = router.db.get('users').value();
  const meetingTypes = router.db.get('meeting_types').value();
  
  const user = users.find(u => u.handle === req.params.handle);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userMeetingTypes = meetingTypes.filter(mt => mt.userId === user.id);
  res.json(userMeetingTypes);
});

server.get('/api/users/:handle', (req, res) => {
  const users = router.db.get('users').value();
  const user = users.find(u => u.handle === req.params.handle);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Default router
server.use('/api', router);

const port = 3001;
server.listen(port, () => {
  console.log(`Mock API is running on port ${port}`);
  console.log('Available routes:');
  console.log('----------------------------------------');
  listRoutes();
});

function listRoutes() {
  console.log('Custom Routes:');
  console.log('GET    /api/users/:handle/meeting-types');
  console.log('GET    /api/users/:handle');
  console.log('\nStandard Resource Routes:');
  console.log('GET    /api/users');
  console.log('GET    /api/users/:id');
  console.log('POST   /api/users');
  console.log('PUT    /api/users/:id');
  console.log('PATCH  /api/users/:id');
  console.log('DELETE /api/users/:id');
  console.log('\nGET    /api/meeting_types');
  console.log('GET    /api/meeting_types/:id');
  console.log('POST   /api/meeting_types');
  console.log('PUT    /api/meeting_types/:id');
  console.log('PATCH  /api/meeting_types/:id');
  console.log('DELETE /api/meeting_types/:id');
  console.log('\nGET    /api/availability');
  console.log('GET    /api/availability/:id');
  console.log('POST   /api/availability');
  console.log('PUT    /api/availability/:id');
  console.log('PATCH  /api/availability/:id');
  console.log('DELETE /api/availability/:id');
  console.log('\nGET    /api/bookings');
  console.log('GET    /api/bookings/:id');
  console.log('POST   /api/bookings');
  console.log('PUT    /api/bookings/:id');
  console.log('PATCH  /api/bookings/:id');
  console.log('DELETE /api/bookings/:id');
}