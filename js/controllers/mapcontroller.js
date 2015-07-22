/*global define */
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/Deferred',
  'esri/map',
  'dijit/Dialog'
], function (declare, lang, on, Deferred, Map, Dialog) {

  return declare(null, {
    map: null,
    options: {},

    constructor: function(options) {
      declare.safeMixin(this.options, options);
    },

    // Loads every layer defined in the JSON configuration file
    // and return the map object using a Deferred.
    load: function() {

      var deferred = new Deferred();
      var layersAdded = lang.hitch(this, function(layers) {
          
          deferred.resolve({
            map: this.map,
            layers: this.options.layers,
            approval_gpservice: this.options.featuresFile.approval_gpservice
          });
        });

        this.map = new Map(this.options.elem, this.options.mapOptions);

        on.once(this.map, 'layer-add-result', layersAdded);

        try {

          this.map.addLayers(this.options.layers);

        } catch(e) {
          console.log(e);
          var dialog = new Dialog({
            title: "An error occured",
            content: "At least one layer is not correctly configured: <br/><em><pre>" + e + "</pre></em>",
            style: "width: 500px"
          });
          dialog.show();
        }

        // Will resolve only when layersAdded() will be executed
        return deferred.promise;
    }
  });

});
