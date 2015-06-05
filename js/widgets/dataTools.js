/*global define*/
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  // ESRI components
  'esri/toolbars/draw',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  // Dijit components
  'dojox/layout/FloatingPane',
  'dijit/layout/TabContainer',
  'dojox/layout/ContentPane',
  "dgrid/Grid",
  // DOM components
  'dojo/dom',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-style'
], function(declare, lang, on,
  Draw, Query, QueryTask,
  FloatingPane, TabContainer, ContentPane, dGrid,
  dom, domAttr, domClass, domConstruct, domStyle) {

  return declare(null, {

    options: {},
    started: false,
    map: null,
    floatingPane: null,
    tabContainer: null,
    index: 0,
    layers: null,

    /**
     * DataTools corresponds to the "Get Data" button in the toolbar
     */
    constructor: function(options) {
      
      this.map    = options.map;
      this.layers = options.layers;
      this.draw   = new Draw(options.map);

    },

    load: function() {

      // Handle the "click" event on the "Get Data" button in the navbar
      on(dom.byId("get-data"), "click", lang.hitch(this, this._handleClick));
      on(dom.byId("get-data-md"), "click", lang.hitch(this, this._handleClick));

      // Attach listener to the drawing tool
      this.draw.on("draw-complete", lang.hitch(this, this._handleDraw));

    },

    /**
     * Starts the Floating Window and attach a Tab Container to it
     */
    _initializeWindow: function() {
      // Instantiate the floating pane and minimize it
      this.floatingPane = new dojox.layout.FloatingPane({
        title: "Data Inspector",
        resizable: true,
        resizeAxis: 'x',
        dockable: true,
        closable: false,
        preload: false,
        style: "z-index:100;position:absolute;top:100px;left:100px;width:950px;height:430px;visibility:visible;",
        id: "data-tool"
      }, dojo.byId("data-tool"));
      this.floatingPane.startup();

      // Instantiate the tab container and add it into the floating pan
      this.tabContainer = new TabContainer({
          style: "height: 100%; width: 100%;",
          tabPosition: "top-h",
          useSlider: true
      }, dojo.byId("data-tool-tabcontainer"));
      this.tabContainer.startup();


      this.started = true;
    },

    /**
     * Trigerred when the user clicks on the "Get Data" button
     */
    _handleClick: function() {
      this.draw.activate(Draw.RECTANGLE);
    },

    /**
     * Trigerred when the user finishes drawing the rectangle on the map
     */
    _handleDraw: function(e) {

      this.draw.finishDrawing();
      this.draw.deactivate();

      if(!this.started) this._initializeWindow();

      this._loadData();

    },

    /**
     * Runs thru every layers registered to the map and process
     * only those which are visible
     */
    _loadData: function(geometry) {

      this._clearTabContainer();

      // For each layer
      this.layers.forEach(function(layer) {
        if(layer.visible) this._queryServer(layer, geometry);

      }, this);

      this.floatingPane.show();

    },

    /**
     * Queries the ArcGIS server to fetch the data according to the geometry.
     * "callback" is called only if at least one feature is returned.
     */
    _queryServer: function(layer, geometry) {

      // Run the query to fetch features from the server
      var query = new Query();
      var queryTask = new QueryTask(layer.url);
      query.where = "1=1";
      query.geometry = geometry;
      query.returnGeometry = false;
      query.outFields = [ "*" ];

      queryTask.execute(query, lang.hitch(this, function(data) {

        // If data is returned from the server for this layer
        if(data.features.length) this._processLayer(layer.name, data);

      }));
    },

    /**
     * Creates a dGrid from the data provided.
     * Called by _queryServer when data is returned from server.
     */
    _processLayer: function(name, data) {

      var columns = {}, items = [];

      for (var i = 0; i < data.features.length; i++) items.push(data.features[i].attributes);
      for (var property in items[0]) columns[property] = property.split('.').pop();
      
      var grid = new dGrid({
          columns: columns,
          autoRender: false,
          autoHeight: true,
          autoWidth: true,
          elasticView: true
      });

      this._addTab(name, grid);

      grid.renderArray(items);
      grid.resize();
    },

    /**
     * Add a tab to the Tab Container
     */
    _addTab: function(name, grid) {

      // Create the content pane
      var cp = new ContentPane({
        id: 'get-data-cp-' + this.index++,
        title: name,
        content: "Loading...",
        doLayout: "false",
        style: "font-size: 10px;"
      });

      this.tabContainer.addChild(cp);
      cp.set("content", grid.domNode);

      // Re-compute the dimensions of the tab when displayed
      cp.on('show', lang.hitch(grid, function() {
        this.resize();
      }));

      cp.startup();

      // Switch the view to the last inserted tab
      this.tabContainer.selectChild(cp, false);
    },

    /**
     * Removes every tab already present in the tab container
     */
    _clearTabContainer: function() {
      this.tabContainer.getChildren().forEach(lang.hitch(this, function(child) {
        this.tabContainer.removeChild(child);
        child.destroyRecursive();
      }));
    }
    
  });
});
