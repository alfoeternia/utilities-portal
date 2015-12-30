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
     * SearchTools is the filter toolbox on the top-right corner.
     * It allows the user to filter projects by their job ID.
     */
    constructor: function(options) {

      this.map = options.map;
      this.layers = options.layers;

    },

    load: function() {

      this.memoryStore = new Memory({ idProperty: "JobID" });

      this._initializeSearchBox();

      this.memoryStore.add({
        JobID: "",
        label: '<span class="glyphicon glyphicon-remove"></span> <strong>Clear</strong>'
      });


      projectLayers = this.layers.filter(function(l) { return l.isProject; });
      projectLayers.forEach(function(layer) {
        this.populateData(layer.url);
      }, this);



    },

    /**
     * Loads the filter box for projects (top-left corner)
     */
    _initializeSearchBox: function() {

      var filterBox = new ComboBox({
        store: this.memoryStore,
        searchAttr: "JobID",
        autocomplete: true,
        placeholder: "Filter Projects...",
        labelAttr: "label",
        labelType: "html",
        mapObject: this.map,
        onChange: lang.hitch(this, function(jobID) {

          // Filter one project
          if(jobID != '') {

            // Hide all other features
            for (var i in this.layers) {
              this._filterOnAttribute(jobID, this.layers[i]);
            }
          } 

          // Restore projects
          else {

            for (var i in this.layers) this._clearFilter(this.layers[i]);

          }
        })
      }, "filter-combobox");

      filterBox.startup();
    },

    _filterOnAttribute: function(value, layer) {

      for (var i in layer.graphics) {
        var isFiltered = true;

        for (var j in layer.graphics[i].attributes) 
          if (layer.graphics[i].attributes[j] == value) isFiltered = false;

        if (!isFiltered) layer.graphics[i].show();
        else layer.graphics[i].hide();
      }
    },

    _clearFilter: function (layer) {
      for (var i in layer.graphics) {
        layer.graphics[i].show();
      }
    },

    /**
     * Populate data from the server to the filter box
     */
    populateData: function(url) {
      var query = new Query();
      var queryTask = new QueryTask(url);
      query.where = "1=1";
      query.returnGeometry = "false";
      query.outFields = [ "*" ];


      queryTask.execute(query, lang.hitch(this, function(data) {
        
        if(data.features.length) {
          for (var i = 0; i < data.features.length; i++)
          {

            var item = {};
            for(var prop in data.features[i].attributes) {
              item[prop.split('.').pop()] = data.features[i].attributes[prop];
            }

            //item.label = '['+ name.split(' ')[0] +'] Job <strong>' + item.JobID + '</strong> <em>(P#' + item.PermitNumber + ')</em> by ' + item.UploadedBy;
            item.label = 'Job <strong>' + item.JobID + '</strong> <em>(P#' + item.PermitNumber + ')</em> by ' + item.UploadedBy;
            
            item.geometry = data.features[i].geometry;
            this.memoryStore.add(item);
          }
        }
      }));

    }

    
    
  });
});
