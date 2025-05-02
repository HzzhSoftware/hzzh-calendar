import { APIGatewayProxyHandler } from 'aws-lambda';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const app = next({ dev: false });
const handle = app.getRequestHandler();

export const handler: APIGatewayProxyHandler = async (event, context) => {
  await app.prepare();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
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
      reject(error);
    }
  });
}; 