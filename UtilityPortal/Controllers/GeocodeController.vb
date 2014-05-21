Imports System.Net
Imports System.Web.Http
Imports RestSharp
Imports Newtonsoft.Json

Public Class GeocodeController
    Inherits ApiController

    ''' GET api/geocode
    ''' 
    ''' <summary>
    ''' Converts a String to coordinates using ArcGIS Geocoding service.<br />
    ''' More info at http://geocode.arcgis.com/arcgis/index.html
    ''' </summary>
    <Route("api/geocode")> _
    <HttpGet> _
    Public Async Function Geocode(<FromUri()> ByVal text As String) As Threading.Tasks.Task(Of Object)
        ' Check parameter presence
        If text Is Nothing Then
            Return "Error"
        End If

        ' Initialize the client and the request
        Dim client = New RestClient(ConfigurationManager.AppSettings.Get("GeocodeServerUrl"))
        Dim RestRequest = New RestRequest("/arcgis/rest/services/World/GeocodeServer/find", Method.POST)

        ' Bind parameters to the request
        RestRequest.AddParameter("text", text)
        RestRequest.AddParameter("outFields", "*")
        RestRequest.AddParameter("maxCandidates", "5")
        RestRequest.AddParameter("maxLocations", "5")
        RestRequest.AddParameter("f", "pjson")

        ' Execute the request
        Dim RestResponse As RestResponse = Await client.ExecuteTaskAsync(RestRequest)
        Dim RestContent = RestResponse.Content

        ' Send the response
        Dim Response As Object = JsonConvert.DeserializeObject(RestContent)
        Return Response
    End Function
End Class
