# Auto configuration tool for UDL Planning Portal
#
# Version 1.0

Write-Host '================================================================'
Write-Host '======= Auto configuration tool for UDL Planning Portal ========'
Write-Host '================================================================'
Write-Host ''
Write-Host 'http://servername/arcgis/rest/services/   NDOTUDLv1Srvs  /  SUE_DevApproval'
Write-Host '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^'
Write-Host '            ArcGIS Catalog                   Prefix          Service name  '
Write-Host ''
Write-Host ''



Write-Host '[Step 1] ArcGIS Catalog'
Write-Host '         (Example: http://servername/arcgis/rest/services/)'
Write-Host '         NB: Do not forget the trailing slash!'
Write-Host ''
$ArcGIS_Catalog = Read-Host '         What is your ArcGIS Catalog URL? '
Write-Host ''
Write-Host ''


Write-Host '[Step 2] UDL Services Folder Name'
Write-Host '         (Example: UDLServices)'
Write-Host ''
$UDL_Service_Prefix = Read-Host '         What is the Folder name for the UDL Services? '
Write-Host ''
Write-Host ''



Write-Host '[Step 3] SUE Publish and Approval Services Names - Publish & Approval'
Write-Host '         (Example: SUE_Publish)'
Write-Host ''
$SUE_Publish_Service = Read-Host '         What is the SUE Service name for the PUBLISH branch? '
$SUE_Approval_Service = Read-Host '         What is the SUE Service name for the APPROVAL(dev) branch?'
Write-Host ''
Write-Host ''


Write-Host '[Step 4] Survey Publish and Approval Services Names'
Write-Host '         (Example: Survey_Publish)'
Write-Host ''
$Survey_Publish_Service = Read-Host '         What is the Survey Service name for PUBLISH branch? '
$Survey_Approval_Service = Read-Host '         What is the Survey Service name for the APPROVAL(dev) branch? '
Write-Host ''
Write-Host ''



Write-Host '[Step 5] Field Prefix'
Write-Host '         Browse: '$ArcGIS_Catalog$UDL_Service_Prefix'/'$SUE_Publish_Service'/MapServer/0'
Write-Host '         Then, from the "Display Fields" section you will see:'
Write-Host '         UDLGeodatabase.UDL.WaterPoints.OBJECTID ( type: esriFieldTypeOID , alias: OBJECTID )'
Write-Host '         ^^^^^^^^^^^^^'
Write-Host '            This is your Field Prefix: UDLGeodatabase.UDL'
Write-Host ''
$Field_Prefix = Read-Host '         What is your Field Prefix? '
Write-Host ''
Write-Host ''



Write-Host '[Step 6] SUE Utilities IDs'
Write-Host '         Browse: '$ArcGIS_Catalog$UDL_Service_Prefix'/'$SUE_Publish_Service'/MapServer'
Write-Host '         Then, from the "Layers" list, please enter the IDs of each layers:'
Write-Host ''
$SUE_WATER_POINTS_LAYER_ID = Read-Host '         What is the ID of WaterPoints? '
$SUE_WASTEWATER_POINTS_LAYER_ID = Read-Host '         What is the ID of WasteWaterPoints? '
$SUE_TELECOM_POINTS_LAYER_ID = Read-Host '         What is the ID of TelecomPoints? '
$SUE_PETROL_POINTS_LAYER_ID = Read-Host '         What is the ID of PetrolPoints? '
$SUE_GAS_POINTS_LAYER_ID = Read-Host '         What is the ID of GasPoints? '
$SUE_ELECTRIC_POINTS_LAYER_ID = Read-Host '         What is the ID of ElectricPoints? '

$SUE_WATER_LINES_LAYER_ID = Read-Host '         What is the ID of WaterLines? '
$SUE_WASTEWATER_LINES_LAYER_ID = Read-Host '         What is the ID of WasteWaterLines? '
$SUE_TELECOM_LINES_LAYER_ID = Read-Host '         What is the ID of TelecomLines? '
$SUE_PETROL_LINES_LAYER_ID = Read-Host '         What is the ID of PetrolLines? '
$SUE_GAS_LINES_LAYER_ID = Read-Host '         What is the ID of GasLines? '
$SUE_ELECTRIC_LINES_LAYER_ID = Read-Host '         What is the ID of ElectricLines? '

$SUE_PROJECTS_LAYER_ID = Read-Host '         What is the ID of Projects? '
Write-Host ''
Write-Host ''



Write-Host '[Step 8] Survey Utilities IDs'
Write-Host '         Browse: '$ArcGIS_Catalog$UDL_Service_Prefix'/'$Survey_Publish_Service'/MapServer'
Write-Host '         Then, from the "Layers" list, please enter the IDs of each layers:'
Write-Host ''
$SURVEY_WATER_POINTS_LAYER_ID = Read-Host '         What is the ID of WaterPoints? '
$SURVEY_WASTEWATER_POINTS_LAYER_ID = Read-Host '         What is the ID of WasteWaterPoints? '
$SURVEY_TELECOM_POINTS_LAYER_ID = Read-Host '         What is the ID of TelecomPoints? '
$SURVEY_PETROL_POINTS_LAYER_ID = Read-Host '         What is the ID of PetrolPoints? '
$SURVEY_GAS_POINTS_LAYER_ID = Read-Host '         What is the ID of GasPoints? '
$SURVEY_ELECTRIC_POINTS_LAYER_ID = Read-Host '         What is the ID of ElectricPoints? '

$SURVEY_WATER_LINES_LAYER_ID = Read-Host '         What is the ID of WaterLines? '
$SURVEY_WASTEWATER_LINES_LAYER_ID = Read-Host '         What is the ID of WasteWaterLines? '
$SURVEY_TELECOM_LINES_LAYER_ID = Read-Host '         What is the ID of TelecomLines? '
$SURVEY_PETROL_LINES_LAYER_ID = Read-Host '         What is the ID of PetrolLines? '
$SURVEY_GAS_LINES_LAYER_ID = Read-Host '         What is the ID of GasLines? '
$SURVEY_ELECTRIC_LINES_LAYER_ID = Read-Host '         What is the ID of ElectricLines? '

$SURVEY_PROJECTS_LAYER_ID = Read-Host '         What is the ID of Projects? '
Write-Host ''
Write-Host ''





Write-Host '[Step 9] Approval Geoprocessing service URL'
Write-Host '         (Example: http://server/arcgis/rest/services/NDOTUDLv1Srvs/ApproveJob/GPServer/UpdateStatus)'
Write-Host ''
$APPROVAL_GPSERVICE_URL = Read-Host '         What is your approval Geoprocessing service URL? '
Write-Host ''
Write-Host ''


Write-Host 'Generating configuration...'

(Get-Content config.json.dist) | 
Foreach-Object {$_ -replace 'ARCGIS_CATALOG_URL', $ArcGIS_Catalog.Trim()}  | 
Foreach-Object {$_ -replace 'UDL_SERVICE_PREFIX', $UDL_Service_Prefix.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_SERVICE', $SUE_Publish_Service.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_SERVICE', $Survey_Publish_Service.Trim()}  | 
Foreach-Object {$_ -replace 'FIELD_PREFIX', $Field_Prefix.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_WATER_POINTS_LAYER_ID', $SUE_WATER_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_WASTEWATER_POINTS_LAYER_ID', $SUE_WASTEWATER_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_TELECOM_POINTS_LAYER_ID', $SUE_TELECOM_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_PETROL_POINTS_LAYER_ID', $SUE_PETROL_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_GAS_POINTS_LAYER_ID', $SUE_GAS_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_ELECTRIC_POINTS_LAYER_ID', $SUE_ELECTRIC_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_WATER_LINES_LAYER_ID', $SUE_WATER_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_WASTEWATER_LINES_LAYER_ID', $SUE_WASTEWATER_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_TELECOM_LINES_LAYER_ID', $SUE_TELECOM_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_PETROL_LINES_LAYER_ID', $SUE_PETROL_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_GAS_LINES_LAYER_ID', $SUE_GAS_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_ELECTRIC_LINES_LAYER_ID', $SUE_ELECTRIC_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_PROJECTS_LAYER_ID', $SUE_PROJECTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_WATER_POINTS_LAYER_ID', $SURVEY_WATER_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_WASTEWATER_POINTS_LAYER_ID', $SURVEY_WASTEWATER_POINTS_LAYER_ID}  |
Foreach-Object {$_ -replace 'SURVEY_TELECOM_POINTS_LAYER_ID', $SURVEY_TELECOM_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_PETROL_POINTS_LAYER_ID', $SURVEY_PETROL_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_GAS_POINTS_LAYER_ID', $SURVEY_GAS_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_ELECTRIC_POINTS_LAYER_ID', $SURVEY_ELECTRIC_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_WATER_LINES_LAYER_ID', $SURVEY_WATER_LINES_LAYER_ID}  |
Foreach-Object {$_ -replace 'SURVEY_WASTEWATER_LINES_LAYER_ID', $SURVEY_WASTEWATER_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_TELECOM_LINES_LAYER_ID', $SURVEY_TELECOM_LINES_LAYER_ID.Trim()}  |  
Foreach-Object {$_ -replace 'SURVEY_PETROL_LINES_LAYER_ID', $SURVEY_PETROL_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_GAS_LINES_LAYER_ID', $SURVEY_GAS_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_ELECTRIC_LINES_LAYER_ID', $SURVEY_ELECTRIC_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_PROJECTS_LAYER_ID', $SURVEY_PROJECTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'APPROVAL_GPSERVICE_URL', $APPROVAL_GPSERVICE_URL.Trim()}  | 
Out-File -encoding ASCII features.json

(Get-Content config.json.dist) | 
Foreach-Object {$_ -replace 'ARCGIS_CATALOG_URL', $ArcGIS_Catalog.Trim()}  | 
Foreach-Object {$_ -replace 'UDL_SERVICE_PREFIX', $UDL_Service_Prefix.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_SERVICE', $SUE_Approval_Service.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_SERVICE', $Survey_Approval_Service.Trim()}  | 
Foreach-Object {$_ -replace 'FIELD_PREFIX', $Field_Prefix.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_WATER_POINTS_LAYER_ID', $SUE_WATER_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_WASTEWATER_POINTS_LAYER_ID', $SUE_WASTEWATER_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_TELECOM_POINTS_LAYER_ID', $SUE_TELECOM_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_PETROL_POINTS_LAYER_ID', $SUE_PETROL_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_GAS_POINTS_LAYER_ID', $SUE_GAS_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_ELECTRIC_POINTS_LAYER_ID', $SUE_ELECTRIC_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_WATER_LINES_LAYER_ID', $SUE_WATER_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_WASTEWATER_LINES_LAYER_ID', $SUE_WASTEWATER_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_TELECOM_LINES_LAYER_ID', $SUE_TELECOM_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_PETROL_LINES_LAYER_ID', $SUE_PETROL_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_GAS_LINES_LAYER_ID', $SUE_GAS_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_ELECTRIC_LINES_LAYER_ID', $SUE_ELECTRIC_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SUE_PROJECTS_LAYER_ID', $SUE_PROJECTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_WATER_POINTS_LAYER_ID', $SURVEY_WATER_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_WASTEWATER_POINTS_LAYER_ID', $SURVEY_WASTEWATER_POINTS_LAYER_ID}  |
Foreach-Object {$_ -replace 'SURVEY_TELECOM_POINTS_LAYER_ID', $SURVEY_TELECOM_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_PETROL_POINTS_LAYER_ID', $SURVEY_PETROL_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_GAS_POINTS_LAYER_ID', $SURVEY_GAS_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_ELECTRIC_POINTS_LAYER_ID', $SURVEY_ELECTRIC_POINTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_WATER_LINES_LAYER_ID', $SURVEY_WATER_LINES_LAYER_ID}  |
Foreach-Object {$_ -replace 'SURVEY_WASTEWATER_LINES_LAYER_ID', $SURVEY_WASTEWATER_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_TELECOM_LINES_LAYER_ID', $SURVEY_TELECOM_LINES_LAYER_ID.Trim()}  |  
Foreach-Object {$_ -replace 'SURVEY_PETROL_LINES_LAYER_ID', $SURVEY_PETROL_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_GAS_LINES_LAYER_ID', $SURVEY_GAS_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_ELECTRIC_LINES_LAYER_ID', $SURVEY_ELECTRIC_LINES_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'SURVEY_PROJECTS_LAYER_ID', $SURVEY_PROJECTS_LAYER_ID.Trim()}  | 
Foreach-Object {$_ -replace 'APPROVAL_GPSERVICE_URL', $APPROVAL_GPSERVICE_URL.Trim()}  | 
Out-File -encoding ASCII features_approval.json


Write-Host 'Done!'