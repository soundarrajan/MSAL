/**
* Implements normalizing table settings obtained from server as JSON data to specific DataTables settings format.
* @param {JSON} tables - The tables data received from server. Expected format (as seen in the respective mockup):
*   {
        "columns": [
            {
                "caption": "Column 0",
                "visible": boolean,
                "noHide": boolean
            }
            .
            .
            .
            {
                "caption": "Column N",
                ...
            }
        ]
*   }
*/
function normalizeJSONDataTables(tables) {
    // Initialize the result fields.
    let result = {};

    $.each(tables, (tableName, table) => {
        result[tableName] = normalizeJSONDataTable(table);
    });

    return result;
}


function normalizeJSONDataTable(table) {
    let result = {
        columnDefs: [],
        colvisColumns: []
    };

    $.each(table.columns, (index, properties) => {
        // Initialize datatable column definition, including visibility, sortability.
        result.columnDefs.push(
            {
                targets: [ index ],
                visible: properties.visible,
                sortable: properties.sortable,
                type: properties.type
            }
        );

        // Only add to colvis button columns those columns that can actually be toggled.
        if(!properties.alwaysVisible) {
            result.colvisColumns.push(index);
        }
    });

    return result;
}
