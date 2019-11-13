// const { Registration } = require('ivory-data-mapping').cache
const { getRoutes } = require('../../flow')

class RegistrationsHandlers extends require('ivory-common-modules').handlers {
  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    // const registrations = await Registration.getAll(request) || []
    // this.viewData = { registrations }
    return super.handleGet(request, h, errors)
  }
}

const handlers = new RegistrationsHandlers()

const routes = getRoutes.bind(handlers)('registrations')

module.exports = handlers.routes(routes)
