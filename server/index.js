
const dotenv = require('dotenv')
dotenv.config()

const DEFAULT_HOST = 'localhost'
const DEFAULT_PORT = 3020

const hapi = require('@hapi/hapi')

async function createServer () {
// Create a server instance
  const server = hapi.server({
    host: process.env.HOST || DEFAULT_HOST,
    port: process.env.PORT || DEFAULT_PORT,
    app: {}
  })

  // Add a route
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return 'Ivory Back Office: Place holder page'
    }
  })

  // Start the server
  await server.start((err) => {
    if (err) {
      throw err
    }

    console.log('Server running at:', server.info.uri)
  })

  return server
}

module.exports = createServer
