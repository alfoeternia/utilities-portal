/*global define*/
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  //'dojo/on',
  'dojo/store/Memory',
  // ESRI components
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  // Dijit components
  'dijit/form/ComboBox',
  'dijit/ConfirmDialog',
], function(declare, lang, Memory, Query, QueryTask, ComboBox, Dialog) {

  return declare(null, {

    options: {},
    map: null,
    features: null,
    layers: null,
    memoryStore: null,

    /**
     * SearchTools is the search toolbox on the top-right corner.
     * It allows the user to search projects by their job ID.
     */
    constructor: function(options) {

      this.map = options.map;
      this.layers = options.layers.filter(function(l) { 
        return l.isProject;
      });

    },

    load: function() {

      this.memoryStore = new Memory({ idProperty: "OBJECTID" });

      this._initializeSearchBox();

      this.layers.forEach(function(layer) {
        this.populateData(layer.url, layer.projectName);
      }, this);

    },

    /**
     * Loads the search box for projects (top-left corner)
     */
    _initializeSearchBox: function() {

      var searchBox = new ComboBox({
        store: this.memoryStore,
        searchAttr: "JobID",
        autocomplete: true,
        placeholder: "Search Projects...",
        labelAttr: "label",
        labelType: "html",
        mapObject: this.map,
        onChange: function(e) {
          var extent = this.item.geometry.getExtent();
          this.mapObject.setExtent(extent);
        }
      }, "search-project-combobox");

      searchBox.startup();
    },

    /**
     * Populate data from the server to the search box
     */
    populateData: function(url, name) {
      var query = new Query();
      var queryTask = new QueryTask(url);
      query.where = "1=1";
      query.returnGeometry = "true";
      query.outSpatialReference = this.map.spatialReference;
      query.outFields = [ "*" ];


      queryTask.execute(query, lang.hitch(this, function(data) {
        if(data.features.length) {
          for (var i = 0; i < data.features.length; i++)
          {

            var item = {};
            for(var prop in data.features[i].attributes) {
              item[prop.split('.').pop()] = data.features[i].attributes[prop];
            }

            item.label = '['+ name +'] Job <strong>' + item.JobID + '</strong> <em>(P#' + item.PermitNumber + ')</em> by ' + item.UploadedBy;
            item.geometry = data.features[i].geometry;
            this.memoryStore.add(item);
          }
        } else {
          var dialog = new Dialog({
            title: "An error occured",
            content: "No data have been returned from server for <strong>" + name + "</strong> projects.",
            style: "width: 300px"
          });
          dialog.show();
        }
      }));

    }
    
  });
});
