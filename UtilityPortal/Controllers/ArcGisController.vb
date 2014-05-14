Imports System.Net
Imports System.Web.Http
Imports RestSharp
Imports Newtonsoft.Json

Public Class ArcGisController
    Inherits ApiController

    ''' GET api/arcgis/{folder}/{service}/{layer}/
    ''' 
    ''' <summary>
    ''' Returns information about a layer, directly from the ArcGIS Server
    ''' </summary>
    <Route("api/arcgis/{folder}/{service}/{layer}/")> _
    <HttpGet> _
    Public Async Function GetLayerInformation(ByVal folder As String, ByVal service As String, ByVal layer As Integer) As Threading.Tasks.Task(Of Object)
        ' Initialize the client and the request
        Dim client = New RestClient(ConfigurationManager.AppSettings.Get("ArcGisServerUrl"))
        Dim RestRequest = New RestRequest("/arcgis/rest/services/{folder}/{service}/{layer}/", Method.POST)

        ' Bind parameters to the request
        RestRequest.AddUrlSegment("folder", folder)
        RestRequest.AddUrlSegment("service", service)
        RestRequest.AddUrlSegment("layer", layer)
        RestRequest.AddParameter("f", "json")

        ' Execute the request
        Dim RestResponse As RestResponse = Await client.ExecuteTaskAsync(RestRequest)
        Dim RestContent = RestResponse.Content

        ' Send the response
        Dim Response As Object = JsonConvert.DeserializeObject(RestContent)
        Return Response
    End Function

    ''' GET api/arcgis/{folder}/{service}/{layer}/{operation}
    ''' 
    ''' <summary>
    ''' <strong>Process client request</strong> such as features list by
    ''' transfering it to the ArcGIS Server.
    ''' </summary>
    <Route("api/arcgis/{folder}/{service}/{layer}/{operation}")> _
    <HttpGet> _
    Public Async Function ExecuteLayerOperation(ByVal folder As String, ByVal service As String, ByVal layer As Integer, ByVal operation As String, <FromUri()> ByVal query As Object) As Threading.Tasks.Task(Of Object)
        ' Fetch parameters from URL Query string
        Dim nvc As NameValueCollection = HttpUtility.ParseQueryString(Request.RequestUri.Query)
        Dim geometryType = nvc("geometryType")
        Dim geometry = nvc("geometry")
        Dim outFields = nvc("outFields")
        Dim outSR = nvc("outSR")
        Dim inSR = nvc("inSR")
        Dim where = nvc("where")

        ' Initialize the client and the request
        Dim client = New RestClient(ConfigurationManager.AppSettings.Get("ArcGisServerUrl"))
        Dim RestRequest = New RestRequest("/arcgis/rest/services/{folder}/{service}/MapServer/{layer}/{operation}", Method.POST)

        ' Bind parameters to the request
        RestRequest.AddUrlSegment("folder", folder)
        RestRequest.AddUrlSegment("service", service)
        RestRequest.AddUrlSegment("layer", layer)
        RestRequest.AddUrlSegment("operation", operation)

        RestRequest.AddParameter("geometryType", geometryType)
        RestRequest.AddParameter("geometry", geometry)
        RestRequest.AddParameter("outFields", outFields)
        RestRequest.AddParameter("outSR", outSR)
        RestRequest.AddParameter("inSR", inSR)
        RestRequest.AddParameter("where", where)
        RestRequest.AddParameter("f", "json")

        ' Execute the request asynchronously
        Dim RestResponse As RestResponse = Await client.ExecuteTaskAsync(RestRequest)
        Dim RestContent = RestResponse.Content

        Dim Response As Object = JsonConvert.DeserializeObject(RestContent)
        Return Response
    End Function

    ''' GET /api/arcgis/benchmark
    ''' 
    ''' <summary>
    ''' Used for running a benchmark in synchronous mode (slow)
    ''' </summary>
    ''' <remarks>For benchmark purpose only!</remarks>
    <Route("api/arcgis/benchmark")> _
    <HttpGet> _
    Public Function Benchmark() As Object
        ' Initialize the client and the request
        Dim client = New RestClient(ConfigurationManager.AppSettings.Get("ArcGisServerUrl"))
        Dim RestRequest = New RestRequest("/arcgis/rest/services/SDSwithFiber/SDSwithFiber/MapServer/1/query", Method.POST)

        ' Bind parameters to the request
        RestRequest.AddParameter("geometryType", "esriGeometryEnvelope")
        RestRequest.AddParameter("geometry", "{""xmin"":-115.67264556884767,""ymin"":36.02383504383812,""xmax"":-115.49686431884766,""ymax"":36.16587374136921,""spatialReference"":{""wkid"":4326}}")
        RestRequest.AddParameter("outFields", "*")
        RestRequest.AddParameter("outSR", "4326")
        RestRequest.AddParameter("inSR", "4326")
        RestRequest.AddParameter("where", "1=1")
        RestRequest.AddParameter("f", "json")

        ' Execute the request
        Dim RestResponse As RestResponse = client.Execute(RestRequest)
        Dim RestContent = RestResponse.Content

        Dim Response As Object = JsonConvert.DeserializeObject(RestContent)
        Return Response
    End Function

    ''' GET /api/arcgis/benchmark-async
    ''' 
    ''' <summary>
    ''' Used for running a benchmark in asynchronous mode (fast).<br/>
    ''' Approx 30% gain in performances.
    ''' </summary>
    ''' <remarks>For benchmark purpose only!</remarks>
    <Route("api/arcgis/benchmark-async")> _
    <HttpGet> _
    Public Async Function BenchmarkAsync() As Threading.Tasks.Task(Of Object)
        ' Initialize the client and the request
        Dim client = New RestClient(ConfigurationManager.AppSettings.Get("ArcGisServerUrl"))
        Dim RestRequest = New RestRequest("/arcgis/rest/services/SDSwithFiber/SDSwithFiber/MapServer/1/query", Method.POST)

        ' Bind parameters to the request
        RestRequest.AddParameter("geometryType", "esriGeometryEnvelope")
        RestRequest.AddParameter("geometry", "{""xmin"":-115.67264556884767,""ymin"":36.02383504383812,""xmax"":-115.49686431884766,""ymax"":36.16587374136921,""spatialReference"":{""wkid"":4326}}")
        RestRequest.AddParameter("outFields", "*")
        RestRequest.AddParameter("outSR", "4326")
        RestRequest.AddParameter("inSR", "4326")
        RestRequest.AddParameter("where", "1=1")
        RestRequest.AddParameter("f", "json")

        ' Execute the request asynchronously
        Dim RestResponse As RestResponse = Await client.ExecuteTaskAsync(RestRequest)
        Dim RestContent = RestResponse.Content

        Dim Response As Object = JsonConvert.DeserializeObject(RestContent)
        Return Response
    End Function
End Class
