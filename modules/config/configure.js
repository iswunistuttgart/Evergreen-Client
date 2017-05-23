var path = require('path');

module.exports = {
  development: {
    APP_DOMAIN: '127.0.0.1',
    APP_HOST: '127.0.0.1',
    APP_HTTP_PORT: 3000,
    APP_HTTPS_PORT: 443,
    SERVERLIST_XML: path.join(__dirname, '../static/serverlist0.xml'),
    WEBSERVICE_URL: path.join(__dirname, '../static/EvergreenWebService.wsdl'),
    LOGIN_RESULT: path.join(__dirname, '../static/LoginResult.json'),
    GET_USER_PAGE_RESULT: path.join(__dirname, '../static/GetUserPageConfig.json'),
    GET_MACHINE_RESULT: path.join(__dirname, '../static/GetMachinesResult.json'),
    GET_NODES_RESULT: path.join(__dirname, '../static/GetAllNodesResult.json'),
    IS_WEBSERVICE: (process.argv.indexOf('--webservice') === -1) ? true: false,
  },
  production: {
    APP_DOMAIN: '127.0.0.1',
    APP_HOST: '127.0.0.1',
    APP_HTTP_PORT: 4001,
    APP_HTTPS_PORT: 443,
    SERVERLIST_XML: path.join(__dirname, '../static/serverlist0.xml'),
    WEBSERVICE_URL: path.join(__dirname, '../static/EvergreenWebService.wsdl'),
    IS_WEBSERVICE: true,
  }
}
