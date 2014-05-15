<div id="map">
    <div class="leaflet-left leaflet-top">
        <div id="web-portal" class="hud leaflet-container leaflet-control leaflet-control-layers leaflet-control-layers-expanded">
            <div id="title"><img src="/images/logo_ndot-trans.png" alt=""><span>Utilities Web Portal</span></div>
        </div>
    </div>
    <div class="leaflet-left leaflet-top">
        <div id="tools" class="hud leaflet-container leaflet-control leaflet-control-layers leaflet-control-layers-expanded hud">
            <ul>
                <li id="pan-tool">Select &amp; Pan<img src="/images/pan.png" class="tool-icon"></li>
                <li id="zoom-in">Zoom in<img src="http://png-3.findicons.com/files/icons/2315/default_icon/256/zoom_in.png" alt="" class="tool-icon"></li>
                <li id="zoom-out">Zoom Out<img src="http://png-3.findicons.com/files/icons/2315/default_icon/256/zoom_out.png" alt="" class="tool-icon"></li>
                <li id="undo-zoom">Undo Zoom<img src="/images/undo.png" class="tool-icon"></li>
                <li id="redo-zoom">Redo Zoom<img src="/images/redo.png" class="tool-icon"></li>
                <li id="full-screen">Fullscreen<img src="/images/icon-fullscreen.png" class="tool-icon"></li>
            </ul>
        </div>
    </div>
    <div class="leaflet-right leaflet-top">
        <div id="utility-layers" class="hud leaflet-container leaflet-control leaflet-control-layers leaflet-control-layers-expanded">
            <p>Utility Layers</p>
            <ul></ul>
        </div>
    </div>
    <div class="leaflet-left leaflet-bottom">
        <div id="base-layers" class="hud leaflet-container leaflet-control leaflet-control-layers leaflet-control-layers-expanded hud">
            <p>AERIAL</p>
            <ul>
                <li id="baselayer-streets">
                    <div style="background: url(/Images/icon-streets.png);" class="layer-color"></div>
                    <div class="layer-title">Streets</div>
                </li>
                <li id="baselayer-imagery">
                    <div style="background: url(/Images/icon-imagery.png);" class="layer-color"></div>
                    <div class="layer-title">Imagery</div>
                </li>
                <li id="baselayer-gray">
                    <div style="background: url(/Images/icon-gray.png);" class="layer-color"></div>
                    <div class="layer-title">Gray</div>
                </li>
                <li id="baselayer-darkgray">
                    <div style="background: url(/Images/icon-darkgray.png);" class="layer-color"></div>
                    <div class="layer-title">Nightvision</div>
                </li>
                <li id="baselayer-topographic">
                    <div style="background: url(/Images/icon-topographic.png);" class="layer-color"></div>
                    <div class="layer-title">Topographic</div>
                </li>
                <li id="baselayer-osm">
                    <div style="background: url(/Images/icon-osm.png);" class="layer-color"></div>
                    <div class="layer-title">Open Street Map</div>
                </li>
            </ul>
        </div>
    </div>
    <div class="leaflet-right leaflet-bottom">
        <div id="search" class="hud leaflet-container leaflet-control leaflet-control-layers leaflet-control-layers-expanded hud">
            <p>Find / Query</p>
            <input id="search-input" type="text" placeholder="Enter an address...">
            <input id="search-submit" type="submit" value="Search">
        </div>
        
    </div>
</div>

<script id="tmpl-layers" type="x-tmpl-mustache">
    <li id="layer-{{ id }}">
        <div class="layer-color" style="background: {{ layer.color }}" />
        <div class="layer-title">{{ layer.name }}</div>
    </li>
</script>

<script id="tmpl-geocode-loading" type="x-tmpl-mustache">
    <p style="text-align: center;"><img src="/Images/loading.gif" alt="Loading..." /></p>
</script>

<script id="tmpl-geocode-table" type="x-tmpl-mustache">
    <table class="table table-striped">
        <thead style="font-weight: bolder;">
        <td>#</td>
        <td>Address</td>
        <td>Score</td>
        <td></td>
        </thead>
        <tbody></tbody>
    </table>
</script>

<script id="tmpl-geocode-tr" type="x-tmpl-mustache">
    <tr>
        <td>{{ key }}</td>
        <td>
            {{#loc.feature.attributes.PlaceName}}
            <strong>{{ loc.feature.attributes.PlaceName }}</strong><br />
            {{/loc.feature.attributes.PlaceName}}


            {{#loc.feature.attributes.Place_addr}}
                {{ loc.feature.attributes.Place_addr }}
            {{/loc.feature.attributes.Place_addr}}

            {{^loc.feature.attributes.Place_addr}}
                {{ loc.feature.attributes.Match_addr }}
            {{/loc.feature.attributes.Place_addr}}
            <br />
            <em>{{ loc.feature.attributes.Country }}</em>
        </td>
        <td>{{ loc.feature.attributes.Score }} %</td>
        <td><button type="button" class="btn btn-primary" data-dismiss="modal" onclick="addMarkerAndPanTo({{ loc.feature.geometry.x }}, {{ loc.feature.geometry.y }}, '{{ loc.name }}')">Go</button></td>
    </tr>
</script>

<div id="geocode-modal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Search results</h4>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <!--<button type="button" class="btn btn-primary">Save changes</button>-->
            </div>
        </div>
    </div>
</div>

@Scripts.Render("~/bundles/leaflet")
@Scripts.Render("~/bundles/mustache")
@Scripts.Render("~/bundles/main")
