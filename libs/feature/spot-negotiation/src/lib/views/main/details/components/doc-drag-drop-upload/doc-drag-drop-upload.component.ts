import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AGGridCellRendererV2Component } from '../../../../../core/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '../../../../../core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererComponent } from '../../../../../core/ag-grid/ag-grid-cell-renderer.component';

@Component({
  selector: 'app-doc-drag-drop-upload',
  templateUrl: './doc-drag-drop-upload.component.html',
  styleUrls: ['./doc-drag-drop-upload.component.css']
})
export class DocDragDropUploadComponent implements OnInit {
  public gridOptions_data: GridOptions;
  myControl = new FormControl();
  options: string[] = ['Additional Document', 'Contract Document'];
  placeholder: string = '';
  filteredOptions: Observable<string[]>;
  constructor() {
    this.gridOptions_data = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: true
      },
      columnDefs: this.columnDef_grid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      animateRows: false,
      onGridReady: params => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_grid);
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 8 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  files: any[] = [];
  public doc_type;

  public enableFileUpload: boolean = false;
  public enableDrag: boolean = false;
  enableUpload(e) {
    this.doc_type = e.value;
    this.enableFileUpload = true;
    this.enableDrag = true;
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      this.uploadDocument(this.files, this.doc_type);
    }
  }

  uploadDocument(doc, doctype) {
    var lastfile = doc[doc.length - 1];
    var file = lastfile.name.split('.');
    let filename = file[0];
    let fileformat = file[1].toUpperCase();
    this.gridOptions_data.api.applyTransaction({
      add: [
        {
          doc_name: filename,
          size: '199KB',
          doc_type: 'Contract',
          file_type: doctype,
          entity: 'Contract',
          ref_no: '123678',
          uploaded_by: 'Alexander',
          uploaded_on: '12/11/20',
          status: 'Verified',
          verified_by: 'Yusuf',
          add_views: 'Document uploaded',
          download: ''
        }
      ]
    });
  }

  private columnDef_grid = [
    /* {
      resizable: false,
      width: 20,
      suppressMenu: true,
      headerClass: ['aggridtextalign-center'],
      headerName: "",
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon' }
    }, */
    {
      headerName: '',
      field: 'check',
      filter: true,
      suppressMenu: true,
      width: 20,
      checkboxSelection: true,
      resizable: false,
      suppressMovable: true,
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'row-remove-icon-with-checkbox' },
      headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
      cellClass:
        'p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center'
    },
    {
      headerName: 'Document Name',
      headerTooltip: 'Document Name',
      field: 'doc_name',
      width: 150
    },
    { headerName: 'Size', headerTooltip: 'Size', field: 'size', width: 100 },
    {
      headerName: 'Document Type',
      headerTooltip: 'Document Type',
      field: 'doc_type',
      width: 100
    },
    {
      headerName: 'File Type',
      headerTooltip: 'File Type',
      field: 'file_type',
      width: 100
    },
    {
      headerName: 'Entity',
      headerTooltip: 'Entity',
      field: 'entity',
      width: 100
    },
    {
      headerName: 'Reference No.',
      headerTooltip: 'Reference No.',
      field: 'ref_no',
      width: 125
    },
    {
      headerName: 'Uploaded by',
      headerTooltip: 'Uploaded By',
      field: 'uploaded_by',
      width: 150
    },
    {
      headerName: 'Uploaded On',
      headerTooltip: 'Uploaded On',
      field: 'uploaded_on',
      width: 120
    },
    {
      headerName: 'Status',
      headerTooltip: 'Status',
      field: 'status',
      width: 150,
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['aggridtextalign-center'],
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'Verified'
            ? 'custom-chip medium-green'
            : params.value === 'Unverified'
            ? 'custom-chip medium-amber'
            : 'custom-chip dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'Verified By',
      headerTooltip: 'Verified By',
      field: 'verified_by',
      width: 100
    },
    {
      headerName: 'Verified On',
      headerTooltip: 'Verified On',
      field: 'verified_on',
      width: 120
    },
    {
      headerName: 'Add Views/Notes',
      headerTooltip: 'Add Views/Notes',
      field: 'add_views',
      width: 200,
      cellRendererFramework: AGGridCellRendererV2Component,
      cellRendererParams: { type: 'dashed-border-notes' }
    },
    {
      headerName: 'Download',
      suppressMenu: true,
      sortable: false,
      width: 100,
      headerTooltip: 'Download',
      field: 'download',
      headerClass: ['pd-0'],
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'download' }
    }
  ];

  private rowData_grid = [
    {
      doc_name: 'Sept contract',
      size: '199KB',
      doc_type: 'Contract',
      file_type: 'PDF',
      entity: 'Contract',
      ref_no: '123678',
      uploaded_by: 'Alexander',
      uploaded_on: '12/11/20',
      status: 'Verified',
      verified_by: 'Yusuf',
      verified_on: '12/11/20',
      add_views: 'Document uploaded',
      download: ''
    },
    {
      doc_name: 'Demo contract',
      size: '199KB',
      doc_type: 'BDN',
      file_type: 'PDF',
      entity: 'Contract',
      ref_no: '123678',
      uploaded_by: 'Reshma',
      uploaded_on: '12/11/20',
      status: 'Verified',
      verified_by: 'Yusuf',
      verified_on: '12/11/20',
      add_views: 'Document uploaded',
      download: ''
    },
    {
      doc_name: 'Demo contract',
      size: '199KB',
      doc_type: 'Invoice',
      file_type: 'PDF',
      entity: 'Contract',
      ref_no: '123678',
      uploaded_by: 'Reshma',
      uploaded_on: '12/11/20',
      status: 'Unverified',
      verified_by: 'Yusuf',
      verified_on: '12/11/20',
      add_views: 'Document uploaded',
      download: ''
    }
  ];
}
