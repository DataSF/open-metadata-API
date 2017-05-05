'use strict';

let readYaml = require('read-yaml');
let UtilsService =  require('../services/utils.js');
let request = require('request-promise');
var _ = require('underscore')

class DatasetDetailsService {

    getDatasetDetails(fbf) {
      let datasets = ['datasetProfiles', 'assetInventory', 'master_dd']

      let data = {
        fbf: null,
        getCombined: function(allData) {
          if(!allData){
            return [{'error': 'ERROR! No Data Found!'}]
          }
           if(allData[1].length < 1){
            return [{'error': 'ERROR! No Data Found!'}]
          }
          console.log(allData)
          let combinedObj = {}
          let results = {}
          let fieldList = []
          for(let i = 0; i < datasets.length; i++){
            let dataset = datasets[i]
            fieldList = fieldList.concat(UtilsService.getFieldList(dataset))
          }
          for(let i = 0; i < allData.length; i++){
            combinedObj = _.extend(combinedObj, allData[i][0])
          }
          for(let i = 0; i < fieldList.length; i++){
            results[fieldList[i]] = combinedObj[fieldList[i]] || null
          }
          //for(let i = 0; i < fieldList.length; i++){
          //  console.log( '"' + fieldList[i] + '": {"type":' +'"string"' +"},")
          //}
          return [results]
        }
      }
      for(let i = 0; i < datasets.length; i++){
        let dataset = datasets[i]
        data[dataset] =  function () {
          return request({
            "method":"GET",
            'auth': {
                      'username': UtilsService.socrataConfigs.username,
                      'password': UtilsService.socrataConfigs.password_ascii
            },
            "uri": UtilsService.makeQry(fbf, dataset),
            "json": true
          });
        }
      }

      function main(fbf) {
        data.fbf = fbf;
        // call all functions asyncronously, and wait for all API calls to complete; then suppy data to combine and reduce functions
        return Promise.all([ data.datasetProfiles(), data.assetInventory(), data.master_dd()])
          .then(data.getCombined);
      }
     return main

   }

 }

module.exports = new DatasetDetailsService();
