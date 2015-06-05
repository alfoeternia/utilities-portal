/*global require*/
require([
  'esri/config',
  'controllers/appcontroller',
  'services/mapservices',
  'dojo/request',
  'dojo/domReady!'
], function (config, appCtrl, mapServices, Request) {

  ApprovalPortal = false;

  // Running Job Approval Portal
  if(window.location.href.indexOf("approval") > -1) {
    var featuresFile = "features_approval.json";
    ApprovalPortal = true;
  }
  
  // Running default UDL Portal
  else var featuresFile = "features.json";

  
  // Configures proxy for authentication
  // @see https://developers.arcgis.com/javascript/jshelp/ags_proxy.html
  config.defaults.io.proxyUrl = "http://trc.i2.unlv.edu/arcgisproxy/proxy.ashx";
  config.defaults.io.alwaysUseProxy = false;

  // Loads the appropriate JSON file and loads the app controller
  Request.get(featuresFile, { handleAs:"json" }).then(function(features) {
    appCtrl.init({
      elem: 'map',
      mapOptions: {
        basemap: 'topo',
        center: [-117, 38.7],
        zoom: 7
      },
      layers: mapServices.loadServices(features),
      featuresFile: features
    });
  });
});