import { Component, OnInit } from '@angular/core';
import { IToolPanelAngularComp } from 'ag-grid-angular';
//import { ITooltipAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-ag-grid-hover-popup',
  template: `
    <div
      class="matmenu-blue side-menu notify-blue"
      style="padding-right: 5px;padding-top: 10px;"
    >
      <div class="vector" style=""></div>
      <table style="position: relative;">
        <tr>
          <td style="font-size: 8px; color:#577897;width: 42px;">
            <span style="position: relative;top: -16px;left: 5px;"
              >Formula:</span
            >
          </td>
          <td style="font-size: 11px;color: #8F9BAB;">
            Low PUABC00 (Platts FOB Rotterdam Barges) - $2.75 on ETA - 4 days
          </td>
        </tr>
      </table>
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        width: 150px;
        height: 70px;
        border: 1px solid cornflowerblue;
        overflow: hidden;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip p {
        margin: 5px;
        white-space: nowrap;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `
  ]
})
export class AgGridHoverPopupComponent implements IToolPanelAngularComp {
  private params: any;
  private data: any;

  agInit(params): void {
    console.log('****aslkdjhsadh');
    this.params = params;

    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    //this.data = params.api.getRowNode(params.rowIndex).data;
    this.data.color = this.params.color || 'white';
  }
}
