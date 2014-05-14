Imports System.Net
Imports System.Web.Http
Imports System.IO
Imports Newtonsoft.Json

Public Class LayerController
    Inherits ApiController

    Dim layers As Object

    ''' <summary>
    ''' Returns the list of available layers on the server.
    ''' </summary>
    <Route("api/layers")> _
    <HttpGet> _
    Public Function GetValues() As Object
        If layers Is Nothing Then
            Dim re As New StreamReader(System.AppDomain.CurrentDomain.BaseDirectory & "config.json")
            Dim reader As New JsonTextReader(re)
            Dim se As New JsonSerializer()
            Dim parsedData As Object = se.Deserialize(reader)
            layers = parsedData("layers")
        End If

        Return layers
    End Function

End Class
