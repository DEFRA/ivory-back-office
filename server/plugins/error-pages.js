const { errorPages } = require('defra-hapi-modules').plugins

module.exports = {
  plugin: errorPages,
  options: {
    handleFailedPrecondition: async (request, h) => {
      const { flow } = request.server.app
      // Just redirect home for now
      const route = await flow('home')
      return h.redirect(route.path)
    }
  }
}
