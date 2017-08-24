# Open Metadata API

## About
* This repo contains a node express REST API that wrangles and consolidates various metadata from Socrata's opendata platform.
* The API methods return easy-to-use json metadata objects for a given dataset.
* It's overall goal is to simplify the process of obtaining metadata data for upstream client facing apps.

## [API Method Documentation](http://metadata.datasf.org/docs/#!/default/)
* Uses Swagger to self document. For all API methods, click [here](http://metadata.datasf.org/docs/#!/default/).

## Get Up and Running
* point the app to your metadatasets on your open data portal by filling out the config file, fieldConfig.yaml.
* npm install
* npm start
* we used nginx and pm2 to run, serve and manage the API processes

## [Server Adminstration For the API](https://github.com/DataSF/open-metadata-API/blob/master/Server_Admin_Cheat%20Sheet_For_Metadata_API.md)
* A cheat sheet on how to adminster the api can be found [here](https://github.com/DataSF/open-metadata-API/blob/master/Server_Admin_Cheat%20Sheet_For_Metadata_API.md)
