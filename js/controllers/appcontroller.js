/*global define */
define([
  'controllers/mapcontroller',
  'controllers/basemapcontroller',
  'controllers/toolbarcontroller',
  'widgets/dataTools',
  'widgets/layersTools',
  'widgets/projectsTools',
  'widgets/filterTools',
  'widgets/distinguishTools',
  'esri/dijit/Geocoder',
  'esri/IdentityManager'
], function (MapController, BaseMapController, ToolbarController, DataTools, LayersTools, ProjectsTools, FilterTools, DistinguishTools, Geocoder) {

  var featuresFile;

  /*
   * Loads the components/tools of the web portal.
   * This function is executed immediately after the 
   * map have been loaded with all its layers
   */
  function mapLoaded(options) {

    // Loads the "Get Data" tool
    // Used on both portals
    var dataTools = new DataTools({
      map: options.map,
      layers: options.layers
    });
    dataTools.load();

    // Loads the "Layers" menu on the top-right corner
    // Used on both portals
    var layersTools = new LayersTools({
      map: options.map,
      featuresFile: featuresFile,
      layers: options.layers
    });
    layersTools.load();
    
    // Loads the "Basemaps" menu on the bottom-left corner
    // Used on both portals
    var baseMapCtrl = new BaseMapController(options.map);
    baseMapCtrl.load();

    // Loads most of the tools in the toolbar
    // Used by both portals
    var toolbarCtrl = new ToolbarController({ map: options.map });
    toolbarCtrl.load();

    // Loads the geocoder search bar (top-left corner)
    // Used on both portals
    geocoder = new Geocoder({ 
      map: options.map,
      highlightLocation: true,
      showResults: true,
      autoComplete: true
    }, "geocoder-search");
    geocoder.startup();

    // Loads the distinguish tool
    // Used on both portals
    distinguishTool = new DistinguishTools({ 
      map: options.map,
      featuresFile: featuresFile,
      layers: options.layers,
    }, "geocoder-search");
    distinguishTool.load();

    // Loads the "Projects List" tool in the navbar
    // Used ONLY for Approval Portal
    if(ApprovalPortal) {
      var projectsTools = new ProjectsTools({
        map: options.map,
        featuresFile: featuresFile,
        layers: options.layers,
        approval_gpservice: options.approval_gpservice
      });
      projectsTools.load();
    }

    // Filter tool
    // Used ONLY for Approval Portal
    if(ApprovalPortal) {
      var filterTools = new FilterTools({
        map: options.map,
        layers: options.layers
      });
      filterTools.load();
    }


  }

  function _init(config) {

    featuresFile = config.featuresFile;

    // Loads the MapController that have for role to add
    // the layers defined in the JSON configuration file
    // to the map.
    var mapCtrl = new MapController(config);
    mapCtrl.load().then(mapLoaded);
  }

  return {
    init: _init
  };

});
