const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../../test-helper')
const { Persistence } = require('defra-hapi-utils')
const config = require('../../config')
const Handlers = require('./registration-detail.handlers')
const serviceApi = 'http://ivory-test-api.com'
const registrationNumber = 'IVR1234'
const itemType = 'Item type'
const url = `/registrations/${registrationNumber}`
const pageHeading = `${registrationNumber} - ${itemType}`

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename)

  routesHelper.getRequestTests({ lab, pageHeading, url }, () => {
    lab.beforeEach(({ context }) => {
      const { sandbox } = context

      const registrations = [{
        registrationNumber,
        item: { itemType }
      }]

      const referenceData = {
        itemType: {
          choices: [{ shortName: itemType, display: itemType }]
        }
      }

      sandbox.stub(config, 'serviceApi').value(serviceApi)
      sandbox.stub(Handlers.prototype, 'getNodeHeading').value(() => itemType)
      sandbox.stub(Persistence, 'createDAO').value(({ path }) => {
        switch (path) {
          case `${serviceApi}/full-registrations?registrationNumber=${registrationNumber}`: return { restore: () => registrations }
          case `${serviceApi}/reference-data`: return { restore: () => referenceData }
          default: throw new Error(`Unexpected persistence path: ${path}`)
        }
      })
    })
  })
})
