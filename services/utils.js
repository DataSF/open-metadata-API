'use strict';
let readYaml = require('read-yaml');
let request = require('request-promise');
class UtilsService {

    constructor() {
      var fieldConfigFn = '/Users/j9/Desktop/metadata-explorer-api/configs/fieldConfig.yaml'
      this.fieldConfigs = this.readConfigs(fieldConfigFn)
      var socrata_config_fn = this.fieldConfigs.socrata_config_fn
      this.socrataConfigs = this.readConfigs(socrata_config_fn)
      this.socrataConfigs.password_ascii = new Buffer(this.socrataConfigs.password, 'base64').toString('ascii')
    }

    readConfigs(fn){
      return readYaml.sync(fn)
    }

    getFieldList(datasetName){
      return this.fieldConfigs.fbfs[datasetName]['fields']
    }

    makeQry(fbf, datasetName, otherQryStuff){
      let baseUrl =this.fieldConfigs.baseUrl
      let metaFbf = this.fieldConfigs.fbfs[datasetName]['fbf']
      let fields = this.fieldConfigs.fbfs[datasetName]['fields']
      let idField = this.fieldConfigs.fbfs[datasetName]['idField']
      let qryParams =  this.fieldConfigs.fbfs[datasetName]['qryParams']
      fields = fields.join()
      let qry = baseUrl + metaFbf  + '.json'
      qry = qry + '?$query=SELECT%20' + fields + '%20WHERE%20' + idField +'%20=%27'
      qry = qry + fbf +'%27'
      if(qryParams){
        qry = qry + '%20' + qryParams
      }
      console.log(qry)
      return qry
    }


 }

module.exports = new UtilsService;
