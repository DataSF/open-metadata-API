'use strict'

var RelatedDatasetsService = require('/var/www/open-metadata-API/services/relatedDatasets.js')

class RelatedDatasetsController {

  constructor (router) {
    this.router = router
    this.registerRoutes()
  }

  registerRoutes () {
    this.router.get('/relateddatasets/:id', this.getRelatedDatasets.bind(this))
  }

  getRelatedDatasets (req, res) {
    let fbf = req.params.id
    let mainFxn = RelatedDatasetsService.getRelatedDatasets(fbf)
    if (!fbf) {
      res.sendStatus(404)
    } else {
      mainFxn({'fbf': fbf}).then(function (result) {
        res.send(result)
      })
    }
  }

}
module.exports = RelatedDatasetsController
