Imports System
Imports System.Collections.Generic
Imports System.Linq
Imports System.Web.Http

Public Module WebApiConfig

    Public Sub Register(ByVal config As HttpConfiguration)
        ' Web API configuration and services

        ' Web API routes
        config.MapHttpAttributeRoutes()

        config.Routes.MapHttpRoute(
            name:="DefaultApi",
            routeTemplate:="gw/{controller}/{service}/{type}/{layer}/{queryType}",
            defaults:=New With {.queryType = RouteParameter.Optional}
        )

        Dim appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(Function(t) t.MediaType = "application/xml")
        config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType)

    End Sub
End Module
