'use strict'
let UtilsService = require('../services/utils.js')
let request = require('request-promise')
var _ = require('underscore')

class DatasetDetailsService {

  getDatasetDetails (fbf) {
    let datasets = ['datasetProfiles', 'assetInventory', 'masterDDDataset', 'datasetProfilesIsGeo']
    let data = {
      fbf: null,
      getHasGeo: function (allData) {
        if (allData.length >= 4) {
          if (allData[3].length < 1) {
            allData[3] = [{'datasetid': fbf, 'hasGeo': false}]
          }
        }
        return allData
      },
      getCombined: function (allData) {
        if (!allData) {
          return [{'error': 'ERROR! No Data Found!'}]
        } else {
          let fieldList = []
          for (let i = 0; i < datasets.length; i++) {
            fieldList = fieldList.concat(UtilsService.getFieldList(datasets[i]))
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
      return Promise.all([data.datasetProfiles(), data.assetInventory(), data.masterDDDataset(), data.datasetProfilesIsGeo()])
        .then(data.getHasGeo)
        .then(data.getCombined)
    }
    return main
  }
 }
module.exports = new DatasetDetailsService()
