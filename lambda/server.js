const serverlessExpress = require('@vendia/serverless-express');
const express = require('express');
const next = require('next');

const app = next({
  dev: false,
  conf: {
    // This ensures Next looks in the right place
    distDir: '.next',
  }
});

const handle = app.getRequestHandler();

let server;

app.prepare().then(() => {
  const expressApp = express();

  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  server = serverlessExpress({ app: expressApp });
});

// Export the Lambda handler
exports.handler = async (event, context) => {
  if (!server) {
    throw new Error("Server not initialized");
  }
  return server(event, context);
};
