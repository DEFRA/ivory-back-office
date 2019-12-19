const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../../test-helper')
const { Persistence } = require('defra-hapi-utils')
const config = require('../../config')
const url = '/registrations'
const pageHeading = 'Ivory registrations'
const serviceApi = 'http://ivory-test-api.com'

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename)

  routesHelper.getRequestTests({ lab, pageHeading, url }, () => {
    lab.beforeEach(({ context }) => {
      const { sandbox } = context

      const registrations = []
      const referenceData = {
        itemType: {
          choices: []
        }
      }

      sandbox.stub(config, 'serviceApi').value(serviceApi)
      sandbox.stub(Persistence, 'createDAO').value(({ path }) => {
        switch (path) {
          case `${serviceApi}/full-registrations?status=submitted`: return { restore: () => registrations }
          case `${serviceApi}/reference-data`: return { restore: () => referenceData }
          default: throw new Error(`Unexpected persistence path: ${path}`)
        }
      })
    })
  })
})
