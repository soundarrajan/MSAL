import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { RowstatusOnchangeResiduePopupComponent } from '@shiptech/core/ui/components/designsystem-v2/rowstatus-onchange-residue-popup/rowstatus-onchange-residue-popup.component';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';
// import { AGGridCellRendererComponent } from 'src/app/shared/ag-grid/ag-grid-cell-renderer.component';
// import { AGGridCellActionsComponent } from 'src/app/shared/designsystem-v2/ag-grid/ag-grid-cell-actions.component';
// import { RowstatusOnchangeResiduePopupComponent } from 'src/app/shared/designsystem-v2/rowstatus-onchange-residue-popup/rowstatus-onchange-residue-popup.component';

@Component({
  selector: 'app-residue-difference',
  templateUrl: './residue-difference.component.html',
  styleUrls: ['./residue-difference.component.css']
})
export class ResidueDifferenceComponent implements OnInit {
  public switchTheme: boolean = true;
  public gridTitle = 'Sludge Difference';
  public gridOptions_data: GridOptions;
  public gridOptions_data1: GridOptions;
  public rowCount: Number;
  today = new FormControl(new Date());
  public rowSelection;
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  public rowData_aggrid = [
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: {
        code: '#a9d372',
        displayName: 'Resolved',
        id: 65,
        index: 45,
        name: null,
        transactionTypeId: 46
      },
      status: {
        id: 2,
        name: null,
        displayName: 'New',
        code: '#ad93cc',
        transactionTypeId: 1
      },
      actions: ''
    }
  ];

  public rowData_aggrid1 = [
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'CMA CGM A Lincoln',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Unmatched',
      status: 'New',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Marked as Seen',
      actions: ''
    },
    {
      portCall: '000050001536482',
      vessel: 'Aila',
      port: 'Algeciras',
      type: 'HSFO',
      logQty: '1295.930',
      mQty: '1350.647',
      diff: '-54.717',
      uom: 'MT',
      date: 'Fri 11/02/2021 05:30',
      qtystatus: 'Matched',
      status: 'Resolved',
      actions: ''
    }
  ];

  private columnDef_aggrid = [
    {
      headerName: 'Port Call',
      headerTooltip: 'Port Call',
      field: 'portCall',
      width: 120,
      cellStyle: { 'padding-left': '15px' }
    },
    {
      headerName: 'Vessel',
      headerTooltip: 'Vessel',
      field: 'vessel',
      tooltipField: 'vessel',
      width: 120
    },
    {
      headerName: 'Port',
      headerTooltip: 'Port',
      field: 'port',
      width: 120
    },
    {
      headerName: 'Product Type',
      headerTooltip: 'Product Type',
      field: 'type',
      width: 120
    },
    {
      headerName: 'Log Book ROB (Surveyor Quantity before delivery)',
      headerTooltip: 'Log Book ROB (Surveyor Quantity before delivery)',
      field: 'logQty',
      width: 120
    },
    {
      headerName: 'Measured ROB (Surveyor Quantity before delivery)',
      headerTooltip: 'Measured ROB (Surveyor Quantity before delivery)',
      field: 'mQty',
      width: 120
    },
    {
      headerName: 'Difference',
      headerTooltip: 'Difference',
      field: 'diff',
      width: 120
    },
    {
      headerName: 'Qty UOM',
      headerTooltip: 'Qty UOM',
      field: 'uom',
      width: 120
    },
    {
      headerName: 'Survey Date',
      headerTooltip: 'Survey Date',
      field: 'date',
      width: 120
    },
    {
      headerName: 'Qty Status',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['status aggridtextalign-center'],
      headerTooltip: 'Qty Status',
      field: 'qtystatus',
      width: 150,
      cellRendererFramework: AgAsyncBackgroundFillComponent
      // cellRendererParams: function(params) {
      //   const classArray: string[] = [];
      //   classArray.push('aggridtextalign-center');
      //   const newClass =
      //     params.value === 'Matched'
      //       ? 'custom-chip-v2 medium dark-green'
      //       : params.value === 'Unmatched'
      //       ? 'custom-chip-v2 medium dark-amber'
      //       : 'custom-chip-v2 medium dark';
      //   classArray.push(newClass);
      //   return { cellClass: classArray.length > 0 ? classArray : null };
      // }
    },
    {
      headerName: 'Progress',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['status aggridtextalign-center'],
      headerTooltip: 'Progress',
      field: 'status',
      width: 150,
      cellRendererFramework: AgAsyncBackgroundFillComponent
      // cellRendererParams: function(params) {
      //   const classArray: string[] = [];
      //   classArray.push('aggridtextalign-center');
      //   const newClass =
      //     params.value === 'New'
      //       ? 'custom-chip-v2 small medium-blue'
      //       : params.value === 'Marked as Seen'
      //       ? 'custom-chip-v2 small medium-yellow'
      //       : params.value === 'Off Spec'
      //       ? 'custom-chip-v2 small medium-yellow'
      //       : params.value === 'Resolved'
      //       ? 'custom-chip-v2 small light-green'
      //       : 'custom-chip-v2 small dark';
      //   classArray.push(newClass);
      //   return {
      //     type: 'status',
      //     cellClass: classArray.length > 0 ? classArray : null
      //   };
      // }
    },
    {
      headerName: 'Actions',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['aggridtextalign-center'],
      headerTooltip: 'Actions',
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'actions' },
      cellStyle: { 'align-items': 'center' },
      resizable: false,
      suppressMovable: true,
      width: 110
    }
  ];

  private columnDef_aggrid1 = [
    {
      headerName: 'Port Call',
      headerTooltip: 'Port Call',
      field: 'portCall',
      width: 120,
      cellStyle: { 'padding-left': '15px' }
    },
    {
      headerName: 'Vessel',
      headerTooltip: 'Vessel',
      field: 'vessel',
      tooltipField: 'vessel',
      width: 120
    },
    {
      headerName: 'Port',
      headerTooltip: 'Port',
      field: 'port',
      width: 120
    },
    {
      headerName: 'Product Type',
      headerTooltip: 'Product Type',
      field: 'type',
      width: 120
    },
    {
      headerName: 'BDN Qty',
      headerTooltip: 'BDN Qty',
      field: 'logQty',
      width: 120
    },
    {
      headerName: 'Meaured Delivered Quantity / Survey Report Value',
      headerTooltip: 'Meaured Delivered Quantity / Survey Report Value',
      field: 'mQty',
      width: 120
    },
    {
      headerName: 'Difference',
      headerTooltip: 'Difference',
      field: 'diff',
      width: 120
    },
    {
      headerName: 'Qty UOM',
      headerTooltip: 'Qty UOM',
      field: 'uom',
      width: 120
    },
    {
      headerName: 'Survey Date',
      headerTooltip: 'Survey Date',
      field: 'date',
      width: 120
    },
    {
      headerName: 'Qty Status',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['status aggridtextalign-center'],
      headerTooltip: 'Qty Status',
      field: 'qtystatus',
      width: 150,
      cellRendererFramework: AGGridCellRendererV2Component,
      cellRendererParams: function(params) {
        const classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        const newClass =
          params.value === 'Matched'
            ? 'custom-chip-v2 medium dark-green'
            : params.value === 'Unmatched'
            ? 'custom-chip-v2 medium dark-amber'
            : 'custom-chip-v2 medium dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'Status',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['status aggridtextalign-center'],
      headerTooltip: 'Status',
      field: 'status',
      width: 150,
      cellRendererFramework: AGGridCellRendererV2Component,
      cellRendererParams: function(params) {
        const classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        const newClass =
          params.value === 'New'
            ? 'custom-chip-v2 small medium-blue'
            : params.value === 'Marked as Seen'
            ? 'custom-chip-v2 small medium-yellow'
            : params.value === 'Off Spec'
            ? 'custom-chip-v2 small medium-yellow'
            : params.value === 'Resolved'
            ? 'custom-chip-v2 small light-green'
            : 'custom-chip-v2 small dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'Actions',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['aggridtextalign-center'],
      headerTooltip: 'Actions',
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'actions' },
      cellStyle: { 'align-items': 'center' },
      resizable: false,
      suppressMovable: true,
      width: 110
    }
  ];
  constructor(public dialog: MatDialog) {
    this.rowSelection = 'single';
    this.gridOptions_data = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 30,
      rowHeight: 35,
      animateRows: false,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      rowSelection: 'single',
      onGridReady: params => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.setRowData(this.rowData_aggrid);
        this.gridOptions_data.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions_data.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
      },

      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 8 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          //params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();
        }
      }
    };
    this.gridOptions_data1 = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid1,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 30,
      rowHeight: 35,
      animateRows: false,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      rowSelection: 'single',

      onGridReady: params => {
        this.gridOptions_data1.api = params.api;
        this.gridOptions_data1.columnApi = params.columnApi;
        this.gridOptions_data1.api.setRowData(this.rowData_aggrid1);
        this.gridOptions_data1.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions_data1.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
      },

      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 8 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          //params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  ngOnInit(): void {}
  tabChange() {
    this.gridOptions_data.api.sizeColumnsToFit();
  }

  selectedTabChange(e: MatTabChangeEvent) {
    //console.log(e);
    if (e.index == 0) this.gridTitle = 'Sludge Difference';

    if (e.index == 1) this.gridTitle = 'EGCS Product Difference';

    this.gridOptions_data.api.sizeColumnsToFit();
    this.gridOptions_data1.api.sizeColumnsToFit();
  }
  public onrowClicked(ev) {
    //console.log("hhhhhhhhh");
    const index = ev.rowIndex;
    //alert(index);
    const dialogRef = this.dialog.open(RowstatusOnchangeResiduePopupComponent, {
      width: '382px',
      height: 'auto',
      maxHeight: '519px',
      backdropClass: 'dark-popupBackdropClass',
      panelClass: this.theme ? 'dark-theme' : 'light-theme',
      data: { title: 'Claims', id: 'Claim Id' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      const selectedData = this.gridOptions_data.api.getSelectedRows();
      //var res = this.gridOptions_data.api.applyTransaction({ remove: selectedData });
      // this.gridOptions_data.api.applyTransaction({
      //   add: this.newItems,
      //   addIndex: 0,
      // });

      //alert(result.data);
      //this.gridOptions_data.api.setRowData([]);
      const itemsToUpdate = [];
      this.gridOptions_data.api.forEachNodeAfterFilterAndSort(function(
        rowNode,
        index
      ) {
        // console.log("eeeeeeeee");
        // console.log(rowNode);
        if (!rowNode.isSelected() === true) {
          return;
        }
        const data = rowNode.data;
        data.status = result.data;
        itemsToUpdate.push(data);
      });
      const res = this.gridOptions_data.api.applyTransaction({
        update: itemsToUpdate
      });
      this.gridOptions_data.api.deselectAll(); //optional
    });
  }
}
