/*global define */
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/on',
  'dojo/dom',
  'dojo/dom-style',
  'esri/dijit/BasemapGallery',
  'dojo/Deferred'
], function (declare, on, dom, domStyle, BasemapGallery, Deferred) {

  return declare(null, {
    map: null,

    constructor: function(map) {
      this.map = map;
    },

    // Initializes the basemap tool on the bottom-left corner
    load: function() {

      // Handle the animation for opening/closing the basemaps icon
      on(dom.byId("base-layers-img"), "click", function() {
        domStyle.set(dom.byId("base-layers-img"), "display", "none");
        domStyle.set(dom.byId("base-layers-content"), "display", "block");
        domClass.add("base-layers", "base-layers-expanded");
      });

      on(dom.byId("base-layers-close"), "click", function() { 
        domStyle.set(dom.byId("base-layers-img"), "display", "block");
        domStyle.set(dom.byId("base-layers-content"), "display", "none");
        domClass.remove("base-layers", "base-layers-expanded");
      });

      // Add the basemap gallery from ArcGIS.com
      var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: this.map
      }, "base-layers-gallery");
      basemapGallery.startup();

      basemapGallery.on("error", function(msg) {
        var dialog = new Dialog({
            title: "An error occured",
            content: "No basemap information has been return from ArcGIS.com server.",
            style: "width: 300px"
          });
          dialog.show();
          return false;
      });

      return true;
    }
  });

});
