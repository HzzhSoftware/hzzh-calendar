const serverlessExpress = require('@vendia/serverless-express')
const next = require('next')

const app = next({ dev: false })
const handle = app.getRequestHandler()

let server

app.prepare().then(() => {
  const express = require('express')
  const exp = express()

  exp.all('*', (req, res) => handle(req, res))

  server = serverlessExpress({ app: exp })
})

exports.handler = (event, context) => {
  if (!server) {
    throw new Error('Server not initialized')
  }
  return server(event, context)
}
