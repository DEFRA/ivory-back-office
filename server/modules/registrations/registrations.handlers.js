const { Persistence } = require('defra-hapi-utils')
const config = require('../../config')
const moment = require('moment')

class RegistrationsHandlers extends require('defra-hapi-handlers') {
  async load (path) {
    return Persistence.createDAO({ path: `${config.serviceApi}${path}` }).restore()
  }

  async getItemTypes () {
    const itemTypes = {}
    // Populate item types object with key value pairs of shortName and display
    const { itemType } = await this.load('/reference-data')
    itemType.choices.forEach(({ shortName, display }) => {
      itemTypes[shortName] = display
    })

    return itemTypes
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    const registrations = await this.load('/full-registrations?status=submitted') || []

    const itemTypes = await this.getItemTypes()

    const registrationDetailRoute = await this.getFlowNode('registration-detail')

    const head = [
      { text: 'Photo / registration number' },
      { text: 'Item type' },
      { text: 'Description' },
      { text: 'Submitted' }
    ]

    const rows = registrations.map((registration) => {
      const { registrationNumber, item, submittedDate } = registration
      const { itemType, description, photos } = item
      const { filename } = photos[0]
      const registrationDetailLink = registrationDetailRoute.path.replace('{registrationNumber}', registrationNumber)

      return [
        {
          html: `
            <a href="${registrationDetailLink}">
                <img src="/photos/small/${filename}" alt="${description}" class="item-list-thumbnail" />
                <br />
                ${registrationNumber}
            </a>
`
        },
        { text: itemTypes[itemType] },
        { text: description },
        { text: moment(submittedDate).format('YYYY-MM-DD HH:mm') }
      ]
    })

    this.viewData = { head, rows }
    return super.handleGet(request, h, errors)
  }
}

module.exports = RegistrationsHandlers
