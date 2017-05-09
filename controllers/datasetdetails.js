'use strict'

var DatasetDetailsService = require('/var/www/open-metadata-API/services/datasetdetails.js')
class DatasetDetailsController {

  constructor (router) {
    this.router = router
    this.registerRoutes()
  }

  registerRoutes () {
    this.router.get('/datasetdetails/:id', this.getDatasetDetails.bind(this))
  }

  getDatasetDetails (req, res) {
    let fbf = req.params.id
    let mainFxn = DatasetDetailsService.getDatasetDetails(fbf)
    if (!fbf) {
      res.sendStatus(404)
    } else {
      mainFxn({'fbf': fbf}).then(function (result) {
        if (result.error) {
          res.sendStatus(404)
          res.send(result)
        }
        res.send(result)
      })
    }
  }
}
module.exports = DatasetDetailsController
