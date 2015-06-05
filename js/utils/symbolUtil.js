/*global define*/
(function() {
  'use strict';

  define([
    'dojo/_base/Color',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol'
  ], function(Color, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol) {

    return {
      renderPolygon: function(outline, color) {
        return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                      // outline of symbol
                      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(outline), 1),
                      // color of fill
                      new Color(color));
      },

      renderLine: function(color, width) {
        return new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), width);
      },

      renderMarker: function(color, size) {
        return new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_SQUARE, size, 
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), 1), // outline
          new Color(color) // color
        );
      },
    };

  });

})();
