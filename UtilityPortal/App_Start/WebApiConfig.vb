Imports System
Imports System.Collections.Generic
Imports System.Linq
Imports System.Web.Http

Public Module WebApiConfig

    Public Sub Register(ByVal config As HttpConfiguration)
        ' Web API configuration and services
        Dim appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(Function(t) t.MediaType = "application/xml")
        config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType)

        ' Web API routes
        config.MapHttpAttributeRoutes()

    End Sub
End Module
