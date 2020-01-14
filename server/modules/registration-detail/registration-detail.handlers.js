const { Persistence } = require('defra-hapi-utils')
const config = require('../../config')
const moment = require('moment')

class RegistrationDetailHandlers extends require('defra-hapi-handlers') {
  async load (path) {
    return Persistence.createDAO({ path: `${config.serviceApi}${path}` }).restore()
  }

  async getRegistration (request) {
    // Use request app object to cache the registration in this request
    if (!request.app.registration) {
      const result = await this.load(`/full-registrations?registrationNumber=${request.params.registrationNumber}`) || []
      request.app.registration = result[0]
    }
    return request.app.registration
  }

  async getItemType (request, type) {
    // Use request app object to cache itemTypes in this request
    if (!request.app.itemTypes) {
      const { itemType } = await this.load('/reference-data')
      request.app.itemTypes = itemType.choices
    }
    return request.app.itemTypes.find(({ shortName }) => shortName === type)
  }

  async getPageHeading (request) {
    const { registrationNumber, item } = await this.getRegistration(request) || {}
    const { display } = await this.getItemType(request, item.itemType)
    return `${registrationNumber} - ${display}`
  }

  async getNodeHeading (node, request) {
    // Abstract this away to allow ease of testing
    return node.handlers.getPageHeading(request)
  }

  async getBreadcrumbs (request) {
    const registrationNode = await this.getFlowNode('registrations')
    return [{
      text: await this.getNodeHeading(registrationNode, request),
      href: registrationNode.path
    }, {
      text: await this.getPageHeading(request)
    }]
  }

  buildRows (details) {
    return Object.entries(details)
      // Ignore all details that are not entered
      .filter(([_, detail]) => detail)
      // Map to summary list format
      .map(([heading, detail]) => {
        return {
          key: { text: heading },
          value: { text: detail }
        }
      })
  }

  getAddressLine ({ businessName, addressLine1, addressLine2, town, county, postcode }) {
    return [businessName, addressLine1, addressLine2, town, county, postcode]
      .filter((lineItem) => lineItem)
      .join(', ')
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    const { item = {}, agent = {}, owner = {}, submittedDate = '' } = await this.getRegistration(request) || {}
    const { description, ageExemptionDescription, volumeExemptionDescription, photos = [] } = item
    const { ageExemptionLabel = '', volumeExemptionLabel = '' } = await this.getItemType(request, item.itemType)

    const details = {
      Description: description,
      [`${ageExemptionLabel} explanation`]: ageExemptionDescription,
      [`${volumeExemptionLabel} explanation`]: volumeExemptionDescription,
      Agent: agent.fullName,
      'Agent\'s email': agent.email,
      'Agent\'s address': this.getAddressLine(agent.address || {}),
      Owner: owner.fullName,
      'Owner\'s email': owner.email,
      'Owner\'s address': this.getAddressLine(owner.address || {}),
      Submitted: moment(submittedDate).format('YYYY-MM-DD HH:mm')
    }

    const imageRows = photos.map(({ filename, originalFilename }) => {
      return {
        key: {
          html: `<img class="item-detail-main govuk-!-margin-bottom-5" src="/photos/medium/${filename}" alt="${originalFilename}">`
        }
      }
    })

    this.viewData = {
      rows: [
        ...imageRows,
        ...this.buildRows(details)
      ]
    }
    return super.handleGet(request, h, errors)
  }
}

module.exports = RegistrationDetailHandlers
