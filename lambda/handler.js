const next = require('next');

const app = next({
  dev: false,
  dir: '/var/task',  // Lambda working directory
  conf: {
    compress: false,
    target: 'server',
    distDir: '.next'
  }
});
const handle = app.getRequestHandler();

let isAppPrepared = false;

exports.handler = async (event, context) => {
  try {
    if (!isAppPrepared) {
      await app.prepare();
      isAppPrepared = true;
    }

    const { req, res } = createNextRequest(event);
    await handle(req, res);
    
    return {
      statusCode: res.statusCode,
      headers: res.getHeaders(),
      body: res.body,
      isBase64Encoded: res.isBase64Encoded || false
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

function createNextRequest(event) {
  const { path, httpMethod, headers = {}, queryStringParameters, body } = event;

  const req = {
    method: httpMethod,
    url: path + (queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''),
    headers: headers,
    body: body,
    on: (event, handler) => {}, // Mock stream events
    connection: {},
    socket: {},
    destroy: () => {},
    setTimeout: () => {},
    emit: () => {},
    removeListener: () => {}
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    getHeaders: function() {
      return this.headers;
    },
    setHeader: function(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    getHeader: function(name) {
      return this.headers[name.toLowerCase()];
    },
    removeHeader: function(name) {
      delete this.headers[name.toLowerCase()];
    },
    write: function(chunk) {
      this.body += chunk;
    },
    end: function(chunk) {
      if (chunk) this.body += chunk;
    },
    on: () => {},
    once: () => {},
    emit: () => {},
    finished: true,
    writableEnded: true
  };

  return { req, res };
} 