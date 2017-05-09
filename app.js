let express = require('express')        // call express
let app = express()

let bodyParser = require('body-parser')

app.use(bodyParser.json())

let apiRouter = express.Router()
app.use('/api/v1', apiRouter)

let DatasetDetails = require('./services/datasetdetails.js')
let DatasetDetailsController = require('./controllers/datasetdetails.js')
let dd = new DatasetDetailsController(apiRouter)

let FieldDetails = require('./services/fielddetails.js')
let FieldDetailsController = require('./controllers/fielddetails.js')
let fd = new FieldDetailsController(apiRouter)

let RelatedDatasets = require('./services/relatedDatasets.js')
let RelatedDatasetsController = require('./controllers/relatedDatasets.js')
let rd = new RelatedDatasetsController(apiRouter)


// Swagger Docs
let swaggerTools = require('swagger-tools')
// swaggerRouter configuration
let options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers'
}

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
let swaggerDoc = require('./swagger.json')

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata())

    // Validate Swagger requests
    app.use(middleware.swaggerValidator())

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options))

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi())

    // start the server
    let server = app.listen(3000, function () {
        let host = server.address().address
        host = (host === '::' ? 'localhost' : host)
        let port = server.address().port

        console.log('listening at http://%s:%s', host, port)
    })
})
