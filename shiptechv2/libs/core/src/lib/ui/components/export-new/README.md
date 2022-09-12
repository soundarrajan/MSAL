#export-module
These export module refers to the export functionalities of the ag-grid (Excel, Csv, PDF), print the page and open email preview.
It has multiple properties in order to be configured: 
- hasEmailPreview (default value false)
- hasExportToExcel (default value true)
- hasExportToCsv (default value true)
- hasExportToPdf (default value true)
- hasExportToPrint (default value true)
- gridModel: BaseGridViewModel     -> Mandatory
- serverKeys: Record<string, string> -> Mandatory
- gridId: string -> Mandatory

In order to use it, beside the 3 mandatory parameters that should be provided (as you see above), 
there are 2 parameters for gridModel that should be configured in their gridViewModel inside serverSideGetRows(..) function:
- this.paramsServerSide = params
- this.exportUrl = getUrl()

The params of the server side of the grid are used for creating the sort si filter lists of the grid and the export url is the API url from where the export can be made.
