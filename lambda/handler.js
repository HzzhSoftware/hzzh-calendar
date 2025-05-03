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

    return new Promise((resolve, reject) => {
      const { req, res } = createNextRequest(event);
      
      handle(req, res)
        .then(() => {
          resolve({
            statusCode: res.statusCode,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              ...res.getHeaders()
            },
            body: res.body,
            isBase64Encoded: false
          });
        })
        .catch(error => {
          console.error('Next.js handler error:', error);
          reject({
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal Server Error' }),
            isBase64Encoded: false
          });
        });
    });
  } catch (error) {
    console.error('Lambda handler error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' }),
      isBase64Encoded: false
    };
  }
};

function createNextRequest(event) {
  const { path, httpMethod, headers = {}, queryStringParameters, body } = event;

  const req = {
    method: httpMethod,
    url: path + (queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''),
    headers: {
      ...headers,
      'x-forwarded-host': headers.Host || headers.host,
      'x-real-ip': event.requestContext?.identity?.sourceIp,
    },
    body: body,
    connection: { encrypted: headers['x-forwarded-proto'] === 'https' },
    on: (event, handler) => {},
    off: () => {},
    emit: () => {},
    socket: { destroy: () => {} },
    destroy: () => {},
    setTimeout: () => {},
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
      if (chunk) {
        this.body += chunk.toString();
      }
    },
    end: function(chunk) {
      if (chunk) {
        this.body += chunk.toString();
      }
    },
    on: () => {},
    once: () => {},
    emit: () => {},
    finished: true,
    writableEnded: true,
    setCharacterEncoding: () => {},
    status: (code) => {
      res.statusCode = code;
      return res;
    },
    json: (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return res;
    },
    send: (data) => {
      if (typeof data === 'string') {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      } else {
        res.json(data);
      }
      return res;
    }
  };

  return { req, res };
} 