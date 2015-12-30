/*global define*/
/*jshint laxcomma:true*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/on',
  'dojo/date/stamp',
  'dojo/date/locale',
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
  'dgrid/Grid',
  // DOM components
  'dojo/dom',
  'dojo/dom-attr',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-style'
], function(declare, lang, on, stamp, locale,
  Query, QueryTask, Geoprocessor, IdentityManager,
  FloatingPane, TabContainer, ContentPane, Button, DropDownButton, Dialog, ConfirmTooltipDialog, Dialog, dGrid,
  dom, domAttr, domClass, domConstruct, domStyle) {

  return declare(null, {

    options: {},
    started: false,
    map: null,
    floatingPane: null,
    tabContainer: null,
    index: 0,
    approval_gpservice: null,

    /**
     * ProjectsTools corresponds to the "Projects List" button in the toolbar
     */
    constructor: function(options) {

      this.approval_gpservice = options.approval_gpservice;
      this.map = options.map;
      this.layers = options.layers.filter(function(l) { 
        return l.isProject;
      });

      //console.log(this.layers);
    },

    load: function() {

      // Handle the "click" event on the "Get Projects" button in the navbar
      on(dom.byId("get-projects"), "click", lang.hitch(this, this._handleClick));
      on(dom.byId("get-projects-md"), "click", lang.hitch(this, this._handleClick));

    },

    /**
     * Starts the Floating Window and attach a Tab Container to it
     */
    _initializeWindow: function() {
      // Instantiate the floating pane and minimize it
        this.floatingPane = new dojox.layout.FloatingPane({
          title: "Projects Tool",
          resizable: true,
          resizeAxis: 'x',
          dockable: true,
          closable: false,
          preload: false,
          style: "z-index:100;position:absolute;top:100px;left:100px;width:1100px;height:430px;visibility:visible;",
          id: "projects-tool"
        }, dojo.byId("projects-tool"));
        this.floatingPane.startup();

        // Instantiate the tab container and add it into the floating pan
        this.tabContainer = new TabContainer({
            style: "height: 100%; width: 100%;",
            tabPosition: "top-h",
            useSlider: true
        }, dojo.byId("projects-tool-tabcontainer"));
        this.tabContainer.startup();
        
        this.started = true;
    },

    /**
     * Triggered when the user clicks on the "Projects List" button
     */
    _handleClick: function() {

      if(!this.started) this._initializeWindow();

      this._loadData();
    },

    /**
     * Runs through every layers registered to the map and process
     * only those which are projects.
     */
    _loadData: function() {

      this._clearTabContainer();

      // For each layer
      this.layers.forEach(function(layer) {
        this._queryServer(layer);
      }, this);

      this.floatingPane.show();
    },

    /**
     * Queries the ArcGIS server to fetch the data of a project.
     * "callback" is called only if at least one feature is returned.
     */
    _queryServer: function(layer) {

      // Run the query to fetch features from the server
      var query = new Query();
      var queryTask = new QueryTask(layer.url);
      query.where = "1=1";
      query.returnGeometry = true;
      query.outFields = [ "*" ];
      query.outSpatialReference = this.map.spatialReference;

      queryTask.execute(query, lang.hitch(this, function(data) {
        if(data.features.length) this._processLayer(layer.projectName, data);
      }));
    },

    /**
     * Creates a dGrid from the data provided.
     * Called by _queryServer when data is returned from server.
     */
    _processLayer: function(name, data) {
      var items = [];

      for (var i = 0; i < data.features.length; i++) {
        //console.log(data.features[i].attributes);
        //items.push(data.features[i].attributes);

        var item = {};
        for(var prop in data.features[i].attributes) {
          item[prop.split('.').pop()] = data.features[i].attributes[prop];
        }

        item.geometry = data.features[i].geometry;
        item.approval_gpservice = this.approval_gpservice;
        item.map = this.map;
        items.push(item);
      }

      var columns = [
        { label: 'Job ID', field: 'JobID', width: '60px' },
        { label: 'Uploaded By', field: 'UploadedBy', width: '80px' },
        { label: 'Date', field: 'UploadDate', formatter: this.formatDate, width: '70px' },
        { label: 'Permit Number', field: 'PermitNumber', width: '70px' },
        { label: 'Awaiting Approval?', field: 'AwaitingApproval', width: '55px' },
        { label: 'Approved?', field: 'Approved', width: '35px' },
        { label: 'Zoom To', renderCell: this.zoomToCell, width: '70px' },
        { label: 'More Info', renderCell: this.moreInfoCell, width: '70px' },
        { label: 'Approve', renderCell: this.approveCell, width: '130px' },
        { label: 'Reject', renderCell: this.rejectCell, width: '130px' }
      ];
            
      var grid = new dGrid({
          columns: columns,
          autoRender: false,
          autoHeight: true,
          autoWidth: true,
          elasticView: true
      });

      this._addTab(name, grid);

      grid.renderArray(items);
      grid.resize();
    },

    /**
     * Add a tab to the Tab Container
     */
    _addTab: function(name, grid) {

      // Create the content pane
      var cp = new ContentPane({
        id: 'get-projects-cp-' + this.index++,
        title: name,
        content: "Loading...",
        doLayout: "false",
        style: "font-size: 11px;"
      });

      this.tabContainer.addChild(cp);
      cp.set("content", grid.domNode);

      // Re-compute the dimensions of the tab when displayed
      cp.on('show', lang.hitch(grid, function() {
        this.resize();
      }));

      cp.startup();

      // Switch the view to the last inserted tab
      this.tabContainer.selectChild(cp, false);
    },

    /**
     * Removes every tab already present in the tab container
     */
    _clearTabContainer: function() {
      this.tabContainer.getChildren().forEach(lang.hitch(this, function(child) {
        this.tabContainer.removeChild(child);
        child.destroyRecursive();
      }));
    },

    /**
     * Correctly formats the displayed data (timestamp -> ISO String).
     */
    formatDate: function(datum) {
      var d = stamp.fromISOString(new Date(datum).toISOString());
      return locale.format(d, {selector: 'date', formatLength: 'long'});
    },

    /**
     * Renders the "Zoom To" cell with a button that zooms to the project
     * when clicked.
     */
    zoomToCell: function(object, data, td, options) {
      return new Button({
        label: "Zoom To",
        onClick: function() {

          object.map.setExtent(object.geometry.getExtent());

        }
      }).domNode;
    },

    /**
     * Renders the "More Info" cell with a button that displays more information
     * when clicked.
     */
    moreInfoCell: function(object, data, td, options) {
      return new Button({
        label: "More Info",
        onClick: lang.hitch(this, function() {

          var content = "<table>" ;
          for (var key in object) {
            if (key != "approval_gpservice" && key != "geometry" && key != "map")
              content += "<tr><td><strong>" + key + "</strong> </td><td>" + object[key] + "</td></tr>";
          }

          var myDialog = new Dialog({
              title: "Information | Job " + object.JobID,
              content: content + "</table>",
              style: "width: 500px"
          });

          myDialog.show();          
        })
      }).domNode;
    },

    /**
     * Renders the "Approve" cell with a button and a tooltip dialog
     * allowng the user to type a note and approve a project.
     */
    approveCell: function(object, data, td, options) {

      var confirmDialog = new ConfirmTooltipDialog({
        title: "Approve Job #" + data.JobID,
        content: '<label for="reason">Note:</label> \
          <input data-dojo-type="dijit/form/TextBox" id="note-approve-' + data.JobID + '" name="note"><br>',
        onExecute: lang.hitch(data, function() {

          var userId;
          require(["esri/IdentityManager"], function(IdentityManager) {
            var credentials = IdentityManager.credentials.pop();
            userId = credentials ? credentials.userId : "unknown";
          });

          var notes = $('#note-approve-' + data.JobID).val();
          var gp = new Geoprocessor(this.approval_gpservice);
          var params = { approvingUser: userId, Approval: "true", jobID: this.JobID, "Approval Notes": notes };

          gp.execute(params,

            // Success
            function(results, messages) {
              console.log(results, messages);
              new Dialog({
                title: "Project approved",
                content: "The project has been approved!",
                style: "width: 300px"
              }).show();
            },

            // Error
            function(err) {
              new Dialog({
                title: "An error occured",
                content: "Description:<br /> <pre>" + err + "</pre>",
                style: "width: 500px"
              }).show();
            }
          );

        })
      });

      return new DropDownButton({
        label: "Approve",
        dropDown: confirmDialog
      }).domNode;
    },

    /**
     * Renders the "Reject" cell with a button and a tooltip dialog
     * allowng the user to type a note and reject a project.
     */
    rejectCell: function(object, data, td, options) {
      var confirmDialog = new ConfirmTooltipDialog({
        content:
          '<label for="reason">Note:</label> \
          <input data-dojo-type="dijit/form/TextBox" id="note-reject-' + data.JobID + '" name="note"><br>',
          onExecute: lang.hitch(data, function() {

          var userId;
          require(["esri/IdentityManager"], function(IdentityManager) {
            var credentials = IdentityManager.credentials.pop();
            userId = credentials ? credentials.userId : "unknown";
          });

          var notes = $('#note-approve-' + data.JobID).val();
          var gp = new Geoprocessor(this.approval_gpservice);
          var params = { approvingUser: userId, Approval: "false", jobID: this.JobID, "Approval Notes": notes };

          gp.execute(params,

            // Success
            function(results, messages) {
              console.log(results, messages);
              new Dialog({
                title: "Project rejected",
                content: "The project has been rejected!",
                style: "width: 300px"
              }).show();
            },

            // Error
            function(err) {
              new Dialog({
                title: "An error occured",
                content: "Description:<br /> <pre>" + err + "</pre>",
                style: "width: 500px"
              }).show();
            }
          );
        })
      });

      return new DropDownButton({
            label: "Reject",
            dropDown: confirmDialog
        }).domNode;
    }
  });
});
