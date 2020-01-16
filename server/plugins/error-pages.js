module.exports = {
  plugin: require('defra-hapi-error-handling'),
  options: {
    handleFailedPrecondition: async (request, h) => {
      const { flow } = request.server.app
      // Just redirect home for now
      const route = await flow('home')
      return h.redirect(route.path)
    },
    view: 'errors/error' // Note the view is in server/modules
  }
}
