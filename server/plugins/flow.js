
const yaml = require('js-yaml')
const fs = require('fs')
const flowConfig = yaml.safeLoad(fs.readFileSync(`${__dirname}/../flow.yml`, 'utf8'))
const path = require('path')

module.exports = {
  plugin: require('defra-hapi-route-flow'),
  options: {
    flowConfig,
    handlersDir: path.normalize(`${__dirname}/../modules`)
  }
}
