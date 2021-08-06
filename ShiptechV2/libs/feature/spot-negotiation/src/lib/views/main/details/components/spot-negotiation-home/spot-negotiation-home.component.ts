import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AgGridDatetimePickerToggleComponent } from '../../../../../core/ag-grid/ag-grid-datetimePicker-Toggle';
import { SpotnegoConfirmorderComponent } from '../spot-negotiation-popups/spotnego-confirmorder/spotnego-confirmorder.component';

@Component({
  selector: 'app-spot-negotiation-home',
  templateUrl: './spot-negotiation-home.component.html',
  styleUrls: ['./spot-negotiation-home.component.css']
})
export class SpotNegotiationHomeComponent implements OnInit {
  navigationItems: any[];
  menuItems: any[];
  today = new FormControl(new Date());
  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.navigationItems = [
      {
        id: 'request',
        displayName: 'REQUEST',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-previous',
        hidden: false
      },
      {
        id: 'rfq',
        displayName: 'RFQ',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-active',
        hidden: false
      },
      {
        id: 'order',
        displayName: 'ORDER',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },

      {
        id: 'delivery',
        displayName: 'DELIVERY',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
      {
        id: 'labs',
        displayName: 'LABS',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
      {
        id: 'claims',
        displayName: 'CLAIMS',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
      {
        id: 'invoices',
        displayName: 'INVOICES',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      },
      {
        id: 'recon',
        displayName: 'RECON',
        url: '',
        entityId: '',
        indexStatus: 'navigationBar-next',
        hidden: false
      }
    ];
    this.menuItems = [
      {
        label: 'Main Page',
        url: '',
        status: 'active',
        styleClass: 'details-tab'
      },
      {
        label: 'Report',
        url: '',
        status: '',
        styleClass: 'tab'
      },
      {
        label: 'Documents',
        url: '',
        status: '',
        styleClass: 'tab'
      },
      {
        label: 'Email Log',
        url: '',
        status: '',
        styleClass: 'tab'
      } /* ,
        {
          label: 'View RFQ',
          url:'',
          status:'',
          styleClass: 'tab'
        } */
    ];
  }

  confirmorderpopup() {
    const dialogRef = this.dialog.open(SpotnegoConfirmorderComponent, {
      width: '1164px',
      height: '230px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  dateTimePicker(e) {
    //alert("");
    e.stopPropagation();
    this.child.pickerOpen();
  }
}
