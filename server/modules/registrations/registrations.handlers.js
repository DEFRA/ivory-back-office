// const { Registration } = require('ivory-data-mapping').cache

class RegistrationsHandlers extends require('defra-hapi-handlers') {
  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    // const registrations = await Registration.getAll(request) || []
    // this.viewData = { registrations }
    return super.handleGet(request, h, errors)
  }
}

module.exports = RegistrationsHandlers
