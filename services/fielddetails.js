'use strict'
let UtilsService = require('./utils.js')
let request = require('request-promise')
var _ = require('underscore')
class FieldDetailsService {

  getFieldDetails (fbf) {
    let datasets = ['fieldProfile', 'masterDDField', 'fieldProfileCategory']
    let data = {
      fbf: null,
      alterFieldTypes: function(allData){
        let typeCast = {
          'calendar_date': 'date',
          'currency': 'number',
          'money': 'number',
          'checkbox': 'boolean', 
          'timestamp': 'date',
          'numeric': 'number'
        }
        let typeCastKeys = Object.keys(typeCast)
        let results = _.map(allData, function (item) {
            if(typeCastKeys.includes(item.type)){
              item.type = typeCast[item.type]
            }
            return item
          })
        return results
      },
      getCombined: function (allData) {
        if (!allData) {
          return [{'error': 'ERROR! No Data Found!'}]
        } else if (allData.length >= 1) {
          let fieldList = []
          for (let i = 0; i < datasets.length; i++) {
            fieldList = fieldList.concat(UtilsService.getFieldList(datasets[i]))
          }
          let results = allData[0]
          for (let i = 1; i < allData.length; i++) {
            results = _.map(results, function (item) {
              let obj = _.extend(item, _.findWhere(allData[i], { columnid: item.columnid }))
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
          results = UtilsService.mapKeys(results, UtilsService.fieldConfigs.fieldDetailsMapping)
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
      return Promise.all([data.fieldProfile(), data.masterDDField(), data.fieldProfileCategory()])
        .then(data.getCombined)
        .then(data.alterFieldTypes)
    }
    return main
  }
}
module.exports = new FieldDetailsService()