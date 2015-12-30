/*global define*/
/*jshint laxcomma:true*/
define([
  'dojo/_base/Color',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/date/stamp',
  'dojo/date/locale',
  'utils/symbolUtil',
  // ESRI components
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'esri/tasks/Geoprocessor',
  "esri/IdentityManager",
  // Dijit components
  'dojox/layout/FloatingPane',
  'dijit/layout/TabContainer',
  'dojox/layout/ContentPane',
  'dijit/form/Button',
  'dijit/form/DropDownButton',
  'dijit/Dialog',
  'dijit/ConfirmTooltipDialog',
  'dijit/ConfirmDialog',
  "dijit/form/ToggleButton",
  'dgrid/Grid',
  // DOM components
  'dojo/dom',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-style'
], function(Color, declare, lang, on, stamp, locale, symbolUtil,
  Query, QueryTask, Geoprocessor, IdentityManager,
  FloatingPane, TabContainer, ContentPane, Button, DropDownButton, Dialog, ConfirmTooltipDialog, Dialog, ToggleButton, dGrid,
  dom, domAttr, domClass, domConstruct, domStyle) {

  return declare(null, {

    options: {},
    started: false,
    map: null,
    floatingPane: null,
    grid: null,

    /**
     * DistinguishTools corresponds to the "Distinguish Projects" button in the toolbar
     */
    constructor: function(options) {

      this.map = options.map;
      this.layers = options.layers;

    },

    load: function() {

      // Handle the "click" event on the "Distinguish Projects" button in the navbar
      on(dom.byId("distinguish-projects"), "click", lang.hitch(this, this._handleClick));

    },

    /**
     * Starts the Floating Window and attach a Tab Container to it
     */
    _initializeWindow: function() {
      // Instantiate the floating pane and minimize it
      this.floatingPane = new dojox.layout.FloatingPane({
        title: "Distinguish Projects",
        resizable: true,
        resizeAxis: 'x',
        dockable: true,
        closable: false,
        preload: false,
        style: "z-index:100;position:absolute;top:100px;left:100px;width:800px;height:580px;visibility:visible;",
        id: "distinguish-tool"
      }, dojo.byId("distinguish-tool"));
      this.floatingPane.startup();

      // Instantiate the toggle button
      new ToggleButton({
        showLabel: true,
        checked: false,
        iconClass: "dijitCheckBoxIcon",
        onChange: lang.hitch(this, this._toggleDistinguish),
        label: "Apply"
      }, "distinguish-toggle").startup();



      var columns = [
        { label: 'Color', field: 'color', formatter: this.formatColor, width: '20px' },
        { label: 'Job ID', field: 'JobID', width: '70px' },
        { label: 'Permit Number', field: 'PermitNumber', width: '70px' }
      ];

      this.grid = new dGrid({
        columns: columns,
        autoWidth: true,
        elasticView: true
      }, 'distinguish-legend');

      gridd = this.grid;

            
        this.started = true;
    },

    /**
     * Triggered when the user clicks on the "Distinguish Projects" button
     */
    _handleClick: function() {

      if(!this.started) this._initializeWindow();

      this.floatingPane.show();
    },


    _toggleDistinguish: function(enable) {
      
      // Enabling colors for each projects
      if(enable) {
        // var items = [
        //   { color: "123456", JobID: 0123456789, PermitNumber: 0987654321 },
        //   { color: "AABBCC", JobID: 0123456789, PermitNumber: 0987654321 },
        //   { color: "FFDD00", JobID: 0123456789, PermitNumber: 0987654321 },
        //   { color: "ABCDEF", JobID: 0123456789, PermitNumber: 0987654321 },
        // ];
        // this.grid.renderArray(items);

        var projects = {};
        var projectsGrid = [];
        var distinctProjectsCount = 0;

        // For every layer on the map
        // The goal here is to count the number of distinct projects on the map,
        // so we can generate evenly spaced colors.
        for (var i in this.layers) {

          // If the layer has graphics in it
          if(this.layers[i].graphics.length) {

            // For every graphics in the layer
            for (var j in this.layers[i].graphics) {
              var identifier = this._findJobID(this.layers[i].graphics[j].attributes);

              if(projects[identifier] == undefined) {
                projects[identifier] = -1;
                distinctProjectsCount++;
              }
            }
          }
        }

        // For every layer on the map
        // The goal here is to apply the colors to the graphics
        var step = 0;
        for (var i in this.layers) {
          var layer = this.layers[i];

          // If the layer has graphics in it
          if(layer.graphics.length) {

            // For every graphics in the layer
            for (var j in layer.graphics) {
              var graphic = layer.graphics[j];
              var identifier = this._findJobID(graphic.attributes);

              if(projects[identifier] == -1) {
                projectsGrid.push({
                  color: this._getColor(distinctProjectsCount, step),
                  JobID: identifier,
                  PermitNumber: "null"
                });
                projects[identifier] = this._getColor(distinctProjectsCount, step);
                step++;
              }

              var color = projects[identifier];
              var symbol = null;

              switch (layer.featureType)
              {
                  case 'point':
                    symbol = new symbolUtil.renderMarker(color, layer.featureSize);
                    break;

                  case 'line':
                    symbol = new symbolUtil.renderLine(color, layer.featureWidth);
                    break;

                  case 'polygon':
                    var fillColor = new Color(color).toRgba();
                    fillColor[3] = 0.1;
                    symbol = new symbolUtil.renderPolygon(color, fillColor);
                    break;
              }
              graphic.setSymbol(symbol);
            }
          }
        }

        this.grid.renderArray(projectsGrid);

      // Revert to original colors
      } else {

        this.grid.refresh();

        for (var i in this.layers) {
          var layer = this.layers[i];

          // If the layer has graphics in it
          if(layer.graphics.length) {

            // For every graphics in the layer
            for (var j in layer.graphics) {
              var graphic = layer.graphics[j];
              var symbol = null;

              switch (layer.featureType)
              {
                  case 'point':
                    symbol = new symbolUtil.renderMarker(layer.featureColor, layer.featureSize);
                    break;

                  case 'line':
                    symbol = new symbolUtil.renderLine(layer.featureColor, layer.featureWidth);
                    break;

                  case 'polygon':
                    symbol = new symbolUtil.renderPolygon(layer.featureOutline, layer.featureColor);
                    break;
              }
              graphic.setSymbol(symbol);
            }
          }
        }
      }

      
    },

    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    _getColor: function(numOfSteps, step) {

      
      var r, g, b;
      var h = step / numOfSteps;
      var i = ~~(h * 6);
      var f = h * 6 - i;
      var q = 1 - f;
      switch(i % 6){
          case 0: r = 1; g = f; b = 0; break;
          case 1: r = q; g = 1; b = 0; break;
          case 2: r = 0; g = 1; b = f; break;
          case 3: r = 0; g = q; b = 1; break;
          case 4: r = f; g = 0; b = 1; break;
          case 5: r = 1; g = 0; b = q; break;
      }
      var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
      return (c);
    },

    _findJobID: function(attributes) {
      for(var attrname in attributes)
        if(attrname.split('.').pop() == 'JobID') return attributes[attrname];

      return null;
    },

    /**
     * Correctly formats the displayed data (timestamp -> ISO String).
     */
    formatDate: function(datum) {
      var d = stamp.fromISOString(new Date(datum).toISOString());
      return locale.format(d, {selector: 'date', formatLength: 'long'});
    },

    /**
     * Correctly formats the color
     */
    formatColor: function(color) {
      return "<strong style='background: " + color + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>";
    }

    
  });
});
