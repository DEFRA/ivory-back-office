const { errorPages, routeFlow } = require('defra-hapi-modules').plugins
let flow

module.exports = {
  plugin: errorPages,
  options: {
    handleFailedPrecondition: (request, h) => {
      // Just redirect home for now
      flow = flow || routeFlow.flow()
      return h.redirect(flow.home.path)
    }
  }
}
