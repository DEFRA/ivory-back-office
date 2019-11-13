const { flow } = require('../flow')
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
