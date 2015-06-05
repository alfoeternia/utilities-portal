/*global define*/
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/parser',
  // DOM stuff
  'dojo/dom',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-style'
], function(declare, lang, on, parser, dom, domAttr, domClass, domConstruct, domStyle) {

  return declare(null, {

    options: {},
    map: null,
    features: null,
    categories: {},
    stopPropagation: false,

    constructor: function(options) {

      // mix in settings and defaults
      declare.safeMixin(this.options, options);
      this.map = this.options.map;
      this.features = this.options.featuresFile.features;

      // featuresList node
      this.domNode = dom.byId('utility-features-list');

    },

    load: function() {

    	this._generateCategoriesNodes();
    	this._generateFeaturesNodes();
    	this._generateEventListeners();

    },

    _generateCategoriesNodes: function() {

    	// For each feature
    	this.features.forEach(lang.hitch(this, function(f) {

    		// If the category has not been processed yet
    		if(!this.categories.hasOwnProperty(f.category)) {

    			var nodeTitle = domConstruct.create("h5", 
    				{ 
    					class: 'utility-category',
    					innerHTML: f.category
    				}, 'utility-features-list');

    			var nodeList = domConstruct.create("ul", null, 'utility-features-list');

    			this.categories[f.category] = nodeList;
    		}
    	}));
    },

    _generateFeaturesNodes: function() {

    	var featureIndex 	= 0;
	    var layerIndex 		= 0;

    	layersGlobal = this.options.layers;

    	// For each feature
    	this.features.forEach(lang.hitch(this, function(f) {

    		var nodeFeature 				= domConstruct.create('li', null, this.categories[f.category]);
    		var nodeFeatureTitle 		= domConstruct.create('div', { class: 'feature-title' }, nodeFeature);
    		var nodeFeatureIcon 		= domConstruct.create('span', { class: 'feature-color', style: 'background:' + f.color }, nodeFeatureTitle);
    		var nodeFeatureText 		= domConstruct.create('span', { class: 'feature-title-text', innerHTML: f.name }, nodeFeatureTitle);
    		var nodeFeatureToggle 	= domConstruct.create('input', { 'data-feature': featureIndex, 'data-layer': layerIndex, class: 'feature-toggle', type: 'checkbox' }, nodeFeatureTitle);
    		
    		if(f.enabledOnLoad) domAttr.set(nodeFeatureToggle, 'checked', '');

    		// Layers of the feature
    		if(f.layers.length > 1) {

	    		var nodeLayerList = domConstruct.create('ul', { class: 'layer-list', style: 'display: none'}, nodeFeature);
	    		f.layers.forEach(lang.hitch(this, function(l) {

	    			switch(l.type) {
	    				case 'point': var glyphicon = 'map-marker'; break;
	    				case 'line': var glyphicon = 'minus'; break;
	    				default: var glyphicon = 'stop'; break;
	    			}

	    			var nodeLayer 				= domConstruct.create('li', null, nodeLayerList);
	    			var nodeFeatureIcon 	= domConstruct.create('div', { class: 'glyphicon glyphicon-' + glyphicon }, nodeLayer);
		    		var nodeLayerText 		= domConstruct.create('span', { innerHTML: ' ' + l.type + 's' }, nodeLayer);
		    		var nodeLayerToggle 	= domConstruct.create('input', { 'data-feature': featureIndex, 'data-layer': layerIndex, class: "layer-toggle", type: 'checkbox' }, nodeLayer);

    				if(f.enabledOnLoad) domAttr.set(nodeLayerToggle, 'checked', '');

    				layerIndex++;

	    		}));

	    	} else layerIndex++;

	    	featureIndex++;

    	}));


			// Style: convert checkboxes to toggles
			$('.feature-toggle').bootstrapToggle({ size: 'small', height: 20, style: 'ios'});
			$('.layer-toggle').bootstrapToggle({ size: 'mini', onstyle: 'info', style: 'ios'});
    },

    _generateEventListeners: function() {

    	// Listeners on features toggles
    	$('.feature-toggle').change(lang.hitch(this, function(e) {


    		if(this.stopPropagation == true) return this.stopPropagation = false;

    		var featureIndex = e.target.dataset.feature;
    		var layerIndex = e.target.dataset.layer;

    		// If there is only one layer, no need to propagate the event to the layers checkboxes
    		if(this.features[featureIndex].layers.length == 1) {

    			var layer = this.options.layers[layerIndex];
    			if (layer.visible) layer.hide();
    			else  layer.show();

    		} else {
    			// Goes to the checkboxes of every sublayer
    			test = $(e.target).closest('li').children('ul').find('input').bootstrapToggle(e.target.checked ? 'on' : 'off');
    		}
    	}));



    	// Listeners on layers toggles
    	$('.layer-toggle').change(lang.hitch(this, function(e) {
    		var featureIndex			= e.target.dataset.feature;
    		var layerIndex				= e.target.dataset.layer;
    		var layer							= this.options.layers[layerIndex];
    		var activatedSum			= 0;
    		var siblings					= $(e.target).closest('ul').find('input');
    		var toggleElement			= $(e.target).closest('ul').parent().find('.feature-title').find('.toggle-on').first();
    		var toggleInput				= $(e.target).closest('ul').parent().find('.feature-title').find('input');
    		this.stopPropagation	= true;

    		// Display/Hide the layer
    		(e.target.checked) ? layer.show() : layer.hide();

				// Calulate number of siblings
    		for(i = 0; i < siblings.length; i++) if(siblings[i].checked) activatedSum++;

    		// No layers activated, set feature toggle to OFF
    		if(activatedSum == 0) toggleInput.bootstrapToggle('off');

    		// Not all layers are activated, set feature toggle to ON in orange
    		else if(activatedSum != siblings.length) {
    			toggleInput.bootstrapToggle('on');
    			toggleElement.removeClass('btn-primary');
    			toggleElement.addClass('btn-warning');
    		}

    		// All layers activated, restore blue color
    		else {
    			toggleInput.bootstrapToggle('on');
    			toggleElement.removeClass('btn-warning');
    			toggleElement.addClass('btn-primary');
    		}

    	}));


			// Listeners for expand/collapse the layers menu
 			on(dom.byId("utility-features-img"), "click", lang.hitch(this, this._expandFeaturesList));
      on(dom.byId("utility-features-close"), "click", lang.hitch(this, this._collapseFeaturesList));


      // Listeners for expand/collapse the layers under each feature
      $('.feature-title-text').click(function() {
      	$(this).closest('li').children('ul.layer-list').slideToggle();
      });

    },

    _expandFeaturesList: function() {
      domStyle.set(dom.byId("utility-features-img"), "display", "none");
      domStyle.set(dom.byId("utility-features-content"), "display", "block");
      domClass.add("utility-features", "utility-features-expanded");
    },

    _collapseFeaturesList: function() {
			domStyle.set(dom.byId("utility-features-img"), "display", "block");
			domStyle.set(dom.byId("utility-features-content"), "display", "none");
			domClass.remove("utility-features", "utility-features-expanded");
    }
  });
});
