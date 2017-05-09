'use strict'

var FieldDetailsService = require('../services/fieldDetails.js')

class FieldDetailsController {

  constructor (router) {
    this.router = router
    this.registerRoutes()
  }

  registerRoutes () {
    this.router.get('/fielddetails/:id', this.getFieldDetails.bind(this))
  }

  getFieldDetails (req, res) {
    let fbf = req.params.id
    let mainFxn = FieldDetailsService.getFieldDetails(fbf)
    if (!fbf) {
      res.sendStatus(404)
    } else {
      mainFxn({'fbf': fbf}).then(function (result) {
        res.send(result)
      })
    }
  }

}
module.exports = FieldDetailsController
