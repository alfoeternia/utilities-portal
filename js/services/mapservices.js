/*global define*/
/*jshint laxcomma:true*/
define([
  'esri/layers/FeatureLayer',
  'esri/renderers/SimpleRenderer',
  'esri/InfoTemplate',
  'utils/symbolUtil'
], function(FeatureLayer, SimpleRenderer, InfoTemplate, symbolUtil) {

  // Processes the list of features/layers defined in the JSON configuration file
  function _loadServices(featuresFile) {
    var layers = [];
    
    // For each feature : Water, Electric, ...
    featuresFile.features.forEach(function(feature, featureIndex) {

      // For each layer of that feature: Water/Points, Water/Lines, ...
      feature.layers.forEach(function(layerItem, layerIndex) {

        // Create a template for the popup window when selecting a feature
        var template = new InfoTemplate();
        var templateContent = '<table>';
        layerItem.fields.forEach(function(field) {
          if(feature.linkTo && feature.linkTo.field == field.name)
            templateContent += '<tr><td><strong>' + field.desc + '</strong></td><td>${' + field.name + '} <button class="btn btn-xs btn-default">' + feature.linkTo.title + '</button></td></tr>';
          else
            templateContent += '<tr><td><strong>' + field.desc + '</strong></td><td>${' + field.name + '}</td></tr>';
        });
        templateContent += '</table>';
        template.setTitle(feature.name);
        template.setContent(templateContent);
        

        // Init the layer
        var layer = new FeatureLayer(featuresFile.arcgis_catalog + '/' + feature.service + '/MapServer/' + layerItem.id, {
          mode: FeatureLayer.MODE_ONDEMAND,
          outFields: layerItem.fields.map(function(f) { return f.name }),
          infoTemplate: template,
          visible: feature.enabledOnLoad
        });

        layer.isProject = feature.isProject || false;
        layer.projectName = layer.isProject ? feature.name : undefined;

        // Generate the renderer
        //
        // Instead of using the colors returned by the server, we create our own
        // rendered based on the specifications defined in the configuration file.
        var renderer = null;
        switch (layerItem.type)
        {
            case 'point':
              renderer = new SimpleRenderer(symbolUtil.renderMarker(layerItem.color, layerItem.size));
              break;

            case 'line':
              renderer = new SimpleRenderer(symbolUtil.renderLine(layerItem.color, layerItem.width));
              break;

            case 'polygon':
              renderer = new SimpleRenderer(symbolUtil.renderPolygon(layerItem.outline, layerItem.color));
              break;

            // Information missing, defaults to line (color: black)
            default:
              renderer = new SimpleRenderer(symbolUtil.renderLine("#000000", 2));
              break;
        }

        layer.setRenderer(renderer);

        // Push the layer to the list of every layers
        layers.push(layer);
      });
    });

    return layers;
  }

  return {
    loadServices: _loadServices
  };

});