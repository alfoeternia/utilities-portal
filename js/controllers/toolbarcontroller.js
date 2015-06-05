/*global define */
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/parser',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/dom-style',
  'dojo/fx',
  'esri/toolbars/draw',
  'esri/geometry/Point',
  'esri/toolbars/navigation',
  'dojo/domReady!'
], function (declare, lang, on, parser, dom, domClass, domStyle, dojoFx, Draw, Point, NavigationToolbar) {

  return declare(null, {
    navToolbar: null,
    draw: null,
    options: {},

    constructor: function(options) {
      declare.safeMixin(this.options, options);
    },

    // Loads the basic tools of the toolbar
    load: function() {

      this.navToolbar = new NavigationToolbar(this.options.map);
      this.draw = new Draw(this.options.map);

      /*
       * Toolbar's listeners for desktop, tablet and phone
       */
      on(dom.byId("pan-tool"), "click", lang.hitch(this, this._panToolActivate));

      on(dom.byId("zoom-in-md"), "click", lang.hitch(this, this._zoomInActivate));
      on(dom.byId("zoom-in"), "click", lang.hitch(this, this._zoomInActivate));

      on(dom.byId("zoom-out-md"), "click", lang.hitch(this, this._zoomOutActivate));
      on(dom.byId("zoom-out"), "click", lang.hitch(this, this._zoomOutActivate));

      on(dom.byId("full-screen-md"), "click", lang.hitch(this, this._toggleFullscreen));
      on(dom.byId("full-screen-xs"), "click", lang.hitch(this, this._toggleFullscreen));
      on(dom.byId("full-screen"), "click", lang.hitch(this, this._toggleFullscreen));

      on(dom.byId("full-extent-md"), "click", lang.hitch(this, this._zoomToNevada));
      on(dom.byId("full-extent-xs"), "click", lang.hitch(this, this._zoomToNevada));
      on(dom.byId("full-extent"), "click", lang.hitch(this, this._zoomToNevada));

      on(dom.byId("undo-zoom-md"), "click", lang.hitch(this, function() { this.navToolbar.zoomToPrevExtent() }));
      on(dom.byId("undo-zoom"), "click", lang.hitch(this, function() { this.navToolbar.zoomToPrevExtent() }));

      on(dom.byId("redo-zoom-md"), "click", lang.hitch(this, function() { this.navToolbar.zoomToNextExtent() }));
      on(dom.byId("redo-zoom"), "click", lang.hitch(this, function() { this.navToolbar.zoomToNextExtent() }));

      this.draw.on("draw-end", lang.hitch(this, function(evt) {
        this.options.map.setExtent(evt.geometry.getExtent());
        this.draw.finishDrawing();
        this.draw.deactivate();
      }));

      return true;
    },

    _zoomInActivate: function() {
      this.draw.activate(Draw.RECTANGLE);
    },

    _zoomOutActivate: function() {
      this.options.map.setZoom(this.options.map.getZoom() - 1);
    },

    _toggleFullscreen: function() {
      if (!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
        if      (document.documentElement.requestFullscreen)       document.documentElement.requestFullscreen();
        else if (document.documentElement.msRequestFullscreen)     document.documentElement.msRequestFullscreen();
        else if (document.documentElement.mozRequestFullScreen)    document.documentElement.mozRequestFullScreen();
        else if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

      } else {
        if      (document.exitFullscreen)       document.exitFullscreen();
        else if (document.msExitFullscreen)     document.msExitFullscreen();
        else if (document.mozCancelFullScreen)  document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    },

    _zoomToNevada: function() {
      this.options.map.centerAndZoom(new Point(-117, 38.7), 7);
    },

    _panToolActivate: function() {
      this.navToolbar.activate(NavigationToolbar.PAN);
      this.options.map.setMapCursor("move");
      this.draw.deactivate();
    }

  });

});
