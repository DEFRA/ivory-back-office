const { flow } = require('ivory-common-modules').plugins.routeFlow
const { errorPages } = require('ivory-common-modules').plugins

module.exports = {
  options: {
    handleFailedPrecondition: (request, h) => h.redirect(flow.home.path)
  },
  plugin: {
    name: 'error-pages',
    register: errorPages
  }
}
