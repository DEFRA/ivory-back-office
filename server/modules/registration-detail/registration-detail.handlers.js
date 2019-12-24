const { Persistence } = require('defra-hapi-utils')
const config = require('../../config')

class RegistrationDetailHandlers extends require('defra-hapi-handlers') {
  async load (path) {
    return Persistence.createDAO({ path: `${config.serviceApi}${path}` }).restore()
  }

  async getRegistration (request) {
    const result = await this.load(`/full-registrations?registrationNumber=${request.params.registrationNumber}`) || []
    return result[0]
  }

  async getItemType (type) {
    const { itemType } = await this.load('/reference-data')
    const { display } = itemType.choices.find(({ shortName }) => shortName === type)
    return display
  }

  async getPageHeading (request) {
    const { registrationNumber, item } = await this.getRegistration(request) || {}
    const itemType = await this.getItemType(item.itemType)
    return `${registrationNumber} - ${itemType}`
  }

  async getBreadcrumbs (request) {
    const { handlers, path } = await this.getFlowNode('registrations')
    return [{
      text: await handlers.getPageHeading(request),
      href: path
    }, {
      text: await this.getPageHeading(request)
    }]
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    return super.handleGet(request, h, errors)
  }
}

module.exports = RegistrationDetailHandlers
