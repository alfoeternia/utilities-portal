﻿<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@ViewBag.Title</title>
    @Styles.Render("~/Content/css")
    @Scripts.Render("~/bundles/modernizr")
</head>
<body>
    <!--<div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                @Html.ActionLink("Nom de l'application", "Index", "Home", Nothing, New With {Key .[class] = "navbar-brand"})
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li>@Html.ActionLink("Accueil", "Index", "Home", New With {.area = ""}, Nothing)</li>
                    <li>@Html.ActionLink("API", "Index", "Help", New With {.area = ""}, Nothing)</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="container body-content">-->
        @RenderBody()
        <!--<hr />
        <footer>
            <p>&copy; @DateTime.Now.Year - My ASP.NET Application</p>
        </footer>
    </div>-->

    @Scripts.Render("~/bundles/jquery")
    @Scripts.Render("~/bundles/bootstrap")
    @Scripts.Render("~/bundles/leaflet")
    @Scripts.Render("~/bundles/esri-leaflet")
    @Scripts.Render("~/bundles/leaflet-modules")
    @Scripts.Render("~/bundles/mustache")
    @Scripts.Render("~/bundles/main")
    @RenderSection("scripts", required:=False)
</body>
</html>
