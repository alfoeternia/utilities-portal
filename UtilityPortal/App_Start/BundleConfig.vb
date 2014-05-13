Imports System.Web
Imports System.Web.Optimization

Public Module BundleConfig
    Public Sub RegisterBundles(ByVal bundles As BundleCollection)
        bundles.Add(New ScriptBundle("~/bundles/jquery").Include(
                   "~/Scripts/jquery-{version}.js"))

        bundles.Add(New ScriptBundle("~/bundles/modernizr").Include(
                    "~/Scripts/modernizr-*"))

        bundles.Add(New ScriptBundle("~/bundles/main").Include(
                    "~/Scripts/main.js"))

        bundles.Add(New ScriptBundle("~/bundles/bootstrap").Include(
                    "~/Scripts/bootstrap.js",
                    "~/Scripts/respond.js"))

        bundles.Add(New ScriptBundle("~/bundles/leaflet").Include(
                    "~/Scripts/leaflet.js"))

        bundles.Add(New ScriptBundle("~/bundles/leaflet-modules").Include(
                    "~/Scripts/leaflet-hash.js",
                    "~/Scripts/leaflet-coordinates.js",
                    "~/Scripts/leaflet-pancontrol.js",
                    "~/Scripts/leaflet-zoomslider.js",
                    "~/Scripts/leaflet-draw.js",
                    "~/Scripts/leaflet-fullscreen.js"
                    ))

        bundles.Add(New ScriptBundle("~/bundles/esri-leaflet").Include(
                    "~/Scripts/esri-leaflet.js"))

        bundles.Add(New ScriptBundle("~/bundles/mustache").Include(
                    "~/Scripts/mustache.js"))

        bundles.Add(New StyleBundle("~/Content/css").Include(
                    "~/Content/bootstrap.css",
                    "~/Content/leaflet.css",
                    "~/Content/leaflet-coordinates.css",
                    "~/Content/leaflet-pancontrol.css",
                    "~/Content/leaflet-zoomslider.css",
                    "~/Content/leaflet-draw.css",
                    "~/Content/site.css"))
    End Sub
End Module