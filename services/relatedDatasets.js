'use strict'
let UtilsService = require('../services/utils.js')
let request = require('request-promise')
var _ = require('underscore')

class RelatedDatasetsService {

  getRelatedDatasets (fbf) {
    let datasets = ['masterDDGlobalFields']
    let data = {
      fbf: null,
      getRelated: function (allData) {
        let qryOtherStuff = allData[0].map((a) => ("field_alias = '" + a.field_alias + "'"))
        qryOtherStuff = qryOtherStuff.join(' OR ')
        return request(UtilsService.getRequestOptions(fbf, 'masterDDRelatedDatasets', qryOtherStuff)).then(function (response) {
          let qryOtherStuff2 = response.map((a) => ("u_id = '" + a.datasetid + "'"))
          qryOtherStuff2 = qryOtherStuff2.join(' OR ')
          return request(UtilsService.getRequestOptions(fbf, 'assetInventoryRelatedDatasets', qryOtherStuff2)).then(function (response2) {
            return [response, response2]
          })
        })
      },
      getCombined: function (allData) {
        if (!allData) {
          return [{'error': 'ERROR! No Data Found!'}]
        } else {
          let fieldList = []
          let combinedDatasets = ['masterDDGlobalFields', 'masterDDRelatedDatasets']
          for (let i = 0; i < combinedDatasets.length; i++) {
            fieldList = fieldList.concat(UtilsService.getFieldList(combinedDatasets[i]))
          }
          let results = allData[0]
          for (let i = 1; i < allData.length; i++) {
            results = _.map(results, function (item) {
              let obj = _.extend(item, _.findWhere(allData[i], { datasetid: item.datasetid }))
              let objKeys = Object.keys(obj)
              let nullKeys = fieldList.filter(x => objKeys.indexOf(x) < 0)
              if (nullKeys.length > 0) {
                nullKeys.forEach(function (key) {
                  obj[key] = null
                })
              }
              return obj
            })
          }
          return results
        }
      }
    }
    for (let i = 0; i < datasets.length; i++) {
      let dataset = datasets[i]
      data[dataset] = function () {
        return request(UtilsService.getRequestOptions(fbf, dataset))
      }
    }
    function main (fbf) {
      data.fbf = fbf
      // call all functions asyncronously, and wait for all API calls to complete; then suppy data to combine and reduce functions
      return Promise.all([data.masterDDGlobalFields()])
        .then(data.getRelated)
        .then(data.getCombined)
    }
    return main
  }
}
module.exports = new RelatedDatasetsService()
