const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

exports.handler = async (event, context) => {
  try {
    await app.prepare();

    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    return new Promise((resolve, reject) => {
      try {
        server.listen(0, () => {
          resolve({
            statusCode: 200,
            body: JSON.stringify({
              message: 'Next.js server started successfully',
            }),
          });
        });
      } catch (error) {
        reject({
          statusCode: 500,
          body: JSON.stringify({
            message: 'Failed to start Next.js server',
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        });
      }
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to prepare Next.js app',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}; 