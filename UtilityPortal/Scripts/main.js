/**
 * NDOT Utilities Web Portal
 *
 * @author Alexis Fouché <contact@alexisfouche.net>
 * @version 0.0.1
 */

/* Application initialization */
var utilityLayersConfig = [];
var utilityLayers = [];

$.get("/api/layers", function(layers) {
  utilityLayersConfig = layers;
  // Preparing Mustache
  var template = $('#tmpl-layers').html();
  Mustache.parse(template); // optional, speeds up future uses

  // Iterate over each layer
  for (var key in layers) {

      // Generate the layer object
      var layer = L.esri.featureLayer("/api/arcgis/" + layers[key]["service"] + "/" + layers[key]["type"] + "/" + layers[key]["layer"], {
        style: function (feature) {
          return { color: layers[key]["color"], weight: 2, opacity: 1 };
        },
        onEachFeature: function (feature, layer) {
          var template = "<small>";
          for(var prop in feature.properties)
            template += "<strong>" + prop + "</strong>: " + feature.properties[prop] + "<br />";
          template += "</small>";
          layer.bindPopup(template);
        }
      });

      // Workaround for setting the right color
      layer.addTo(map);
      map.removeLayer(layer);

      // Layer is added to the layers array
      utilityLayers[key] = layer;
          
      // Render the layer
      var rendered = Mustache.render(template, {id: key, layer: layers[key]});
      $('#utility-layers ul').append(rendered);

      // Click behavior
      $('#layer-' + key).click({layerId: key}, function(e) {
        if(utilityLayersConfig[e.data.layerId]['enabled']) {
          map.removeLayer(utilityLayers[e.data.layerId]);
          utilityLayersConfig[e.data.layerId]['enabled'] = false;
        }
        else {
          utilityLayers[e.data.layerId].setStyle({ color: utilityLayersConfig[e.data.layerId]["color"], weight: 4});
          utilityLayers[e.data.layerId].addTo(map);
          utilityLayersConfig[e.data.layerId]['enabled'] = true;
        }

      });

  }

}).fail(function() {
  alert("Cannot fetch layers list. Server is probably offline.");
})








var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
  layers: 'nexrad-n0r-900913',
  format: 'image/png',
  transparent: true,
  attribution: "Weather data © 2012 IEM Nexrad"
});




/* Base Layer management */
var streets = L.esri.basemapLayer("Streets");
var imagery = L.esri.basemapLayer("Imagery");
var gray = L.esri.basemapLayer("Gray");
var darkGray = L.esri.basemapLayer("DarkGray");
var topographic = L.esri.basemapLayer("Topographic");
var OSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var baseLayers = [ streets, imagery, OSM, darkGray, gray, topographic ];

var disableAllBaseLayers = function () {
  for (var i = baseLayers.length - 1; i >= 0; i--) {
    map.removeLayer(baseLayers[i]);
  };
}

$("#baselayer-streets").click(function() {
  disableAllBaseLayers();
  streets.addTo(map);
});

$("#baselayer-imagery").click(function() {
  disableAllBaseLayers();
  imagery.addTo(map);
});

$("#baselayer-gray").click(function() {
  disableAllBaseLayers();
  gray.addTo(map);
});

$("#baselayer-darkgray").click(function() {
  disableAllBaseLayers();
  darkGray.addTo(map);
});

$("#baselayer-topographic").click(function() {
  disableAllBaseLayers();
  topographic.addTo(map);
});

$("#baselayer-osm").click(function() {
  disableAllBaseLayers();
  OSM.addTo(map);
});



/* Map Init */
var map = L.map('map', {
  center: [36.0800, -115.1522],
  zoom: 10,
  zoomsliderControl: true,
  zoomControl: false,
  layers: [topographic],
  fullscreenControl: false
});



// Scale
L.control.scale({ imperial: true, maxWidth: 200, position: 'bottomright' }).addTo(map);

// Full screen
var fullscreen = L.control.fullscreen().addTo(map);
L.DomEvent.addListener($("#full-screen")[0], 'click', fullscreen.toogleFullScreen, map);

// Hash plugin to keep the same map coordinates during refresh
var hash = new L.Hash(map);

// Display coordinates on the bottom right of the page
L.control.coordinates({
    position:"bottomright",
    useDMS:false,
    labelTemplateLat:"N {y}",
    labelTemplateLng:"E {x}",
    useLatLngOrder:true
  }).addTo(map);

// Draw Controls
var drawOptions = {
    position: 'topleft',
    draw: {
        rectangle: {
            repeatMode: true
        }
    }
};

var drawControl = new L.Control.Draw(drawOptions);
//map.addControl(drawControl);

// Zoom by drawing a rectangle


map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'rectangle') {
        console.log(layer.getBounds());
        map.fitBounds(layer.getBounds());
    }

    // Do whatever else you need to. (save to db, add to map etc)
    //map.addLayer(layer);
});

// Tools
var currentTool = 'pan';
var drawing = undefined;

$('#pan-tool').click(function() {
  currentTool = 'pan';
  if(drawing !== undefined) drawing.disable();
  $('#map').css('cursor', 'pan');
});

$('#zoom-in').click(function() {
  currentTool = 'zoom-in';
  $('#map').css('cursor', 'crosshair');
  drawing = new L.Draw.Rectangle(map, drawOptions.draw.rectangle);
  drawing.enable();
});

$('#zoom-out').click(function() {
  currentTool = 'zoom-out';
  if(drawing !== undefined) drawing.disable();
  $('#map').css('cursor', '-moz-zoom-out');
  $('#map').css('cursor', '-webkit-zoom-out');
});

// Full Screen
/*$('#full-screen').click(function() {
  fullscreen.toogleFullScreen();
});*/


// Click Detection
map.on('mousedown', function (evt) {
  map.on('mouseup mousemove', function handler(evt) {
    if (evt.type === 'mouseup') {

      if(currentTool == 'zoom-out') {
        map.setZoom(map.getZoom()-1);
      } else if (currentTool == 'zoom-in') {
        map.setZoomAround(evt.latlng, map.getZoom()+1);
      }
    } else {
      // drag
    }
    map.off('mouseup mousemove', handler);
  });
});

// Zoom logger
var zoomLogPrev = new Array();
var zoomLogNext = new Array();
var zoomingForBacktrace = false;

map.on('zoomend', function(e) {
  if(zoomingForBacktrace === true) {
    zoomingForBacktrace = false;
    return 0;
  }

  zoomLogNext = new Array();

  var zoomLogEntry = {
    pos: e.target.getCenter(),
    level: e.target.getZoom()
  };

  zoomLogPrev.push(zoomLogEntry);

});

var undoZoom = function() {
  var zoomLogEntry = zoomLogPrev.pop();
  if(zoomLogEntry === undefined) return 1;

  if(zoomLogEntry.level == map.getZoom()) {
    zoomLogNext.push(zoomLogEntry);
    undoZoom();
    return 2;
  }
  zoomLogNext.push(zoomLogEntry);
  zoomingForBacktrace = true;
  map.setZoomAround(zoomLogEntry.pos, zoomLogEntry.level);
  map.panTo(zoomLogEntry.pos);
}

var redoZoom = function() {
  var zoomLogEntry = zoomLogNext.pop();
  if(zoomLogEntry === undefined) return 1;

  if(zoomLogEntry.level == map.getZoom()) {
    zoomLogPrev.push(zoomLogEntry);
    redoZoom();
    return 2;
  }

  zoomLogPrev.push(zoomLogEntry);
  zoomingForBacktrace = true;
  map.setZoomAround(zoomLogEntry.pos, zoomLogEntry.level);
  map.panTo(zoomLogEntry.pos);
}

$('#undo-zoom').click(function() {
  undoZoom();
});

$('#redo-zoom').click(function() {
  redoZoom();
});

/*L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

map.on('zoomstart', function(e) {
  if(e.target._animateToZoom !== undefined) {
    if(e.target._animateToZoom <= 12) w = 1;
    else w = e.target._animateToZoom / 3;

    layer0.setStyle({ color: "#70ca49", weight: w});
    layer1.setStyle({ color: "#7049ca", weight: w});

  }
});*/

var addMarkerAndPanTo = function (x, y, name) {
    if (name != undefined) L.marker([y, x]).bindPopup(name).addTo(map);
    else L.marker([y, x]).addTo(map);

    var latlng = L.latLng(y, x);
    map.panTo(latlng);
}

var geocodeSearch = function(address) {
    $.get('/api/geocode', { text: address }, function (res) {

        var tableTemplate = $('#tmpl-geocode-table').html();
        var tableRendered = Mustache.render(tableTemplate);
        $('#geocode-modal .modal-body').html(tableRendered);

        var trTemplate = $('#tmpl-geocode-tr').html();
        Mustache.parse(trTemplate); // optional, speeds up future uses

        // Iterate over each result
        var locations = res.locations;
        for (var key in locations) {
            // Render the table line and append it to the table
            var rendered = Mustache.render(trTemplate, { key: parseInt(key)+1, loc: locations[key] });
            $('#geocode-modal tbody').append(rendered);
        }
  });
}

$('#search-submit').click(function(e) {
    geocodeSearch($('#search-input').val());
    $('#search-input').val("");

    var loadingTemplate = $('#tmpl-geocode-loading').html();
    var loadingRendered = Mustache.render(loadingTemplate);
    $('#geocode-modal .modal-body').html(loadingRendered);
    $('#geocode-modal').modal({ show: true });
});

$('#search-input').keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
        geocodeSearch($('#search-input').val());
        $('#search-input').val("");

        var loadingTemplate = $('#tmpl-geocode-loading').html();
        var loadingRendered = Mustache.render(loadingTemplate);
        $('#geocode-modal .modal-body').html(loadingRendered);
        $('#geocode-modal').modal({ show: true });
    }
});
