const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

let isAppPrepared = false;

exports.handler = async (event, context) => {
  try {
    // Prepare the Next.js app only once
    if (!isAppPrepared) {
      await app.prepare();
      isAppPrepared = true;
    }
    
    return new Promise((resolve, reject) => {
      try {
        const { req, res } = createNextRequest(event);
        
        handle(req, res)
          .then(() => {
            resolve({
              statusCode: res.statusCode,
              headers: {
                'Content-Type': 'text/html',
                ...res.headers
              },
              body: res.body
            });
          })
          .catch(error => {
            console.error('Error handling request:', error);
            reject({
              statusCode: 500,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: 'Error handling request',
                error: error.message
              })
            });
          });
      } catch (error) {
        console.error('Error creating request:', error);
        reject({
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Error creating request',
            error: error.message
          })
        });
      }
    });
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Error in handler',
        error: error.message
      })
    };
  }
};

function createNextRequest(event) {
  const { path, httpMethod, headers = {}, queryStringParameters, body } = event;
  
  // Create a more complete req object
  const req = {
    method: httpMethod,
    url: path + (queryStringParameters ? '?' + new URLSearchParams(queryStringParameters).toString() : ''),
    headers: {
      ...headers,
      'x-forwarded-host': headers.Host || headers.host,
      'x-real-ip': event.requestContext?.identity?.sourceIp,
    },
    body: body,
    connection: {
      remoteAddress: event.requestContext?.identity?.sourceIp
    }
  };
  
  // Create a more complete res object
  const res = {
    statusCode: 200,
    headers: {},
    setHeader: (name, value) => {
      res.headers[name.toLowerCase()] = value;
    },
    getHeader: (name) => res.headers[name.toLowerCase()],
    removeHeader: (name) => delete res.headers[name.toLowerCase()],
    writeHead: (status, headers) => {
      res.statusCode = status;
      if (headers) {
        res.headers = { ...res.headers, ...headers };
      }
    },
    write: (chunk) => {
      if (!res.body) {
        res.body = '';
      }
      res.body += chunk;
    },
    end: (chunk) => {
      if (chunk) {
        if (!res.body) {
          res.body = '';
        }
        res.body += chunk;
      }
    }
  };
  
  return { req, res };
} 