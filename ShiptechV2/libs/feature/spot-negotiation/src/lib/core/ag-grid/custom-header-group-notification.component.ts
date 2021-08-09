import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div class="aggrid-group-headercontenet" style="height: 35px;">
      <div class="text-left amber" style="position: fixed">
        <!-- <app-badge
          *ngIf="this.params?.badge"
          [badgeColor]="this.params?.badge?.color"
          [value]="this.params?.badge?.value"
          [unit]="this.params?.badge?.unit"
        ></app-badge> -->
      </div>
      <div class="title">
        <div
          class="ag-header-group-cell-label"
          style="float:left;position:relative;overflow: visible;z-index:10000"
        >
          {{ this.params.displayName }}
          <div
            class="header-notification"
            style="position: absolute;top: -10px;right: -10px;"
            (mouseover)="$event.preventDefault()"
            matTooltipClass="header-tooltip"
            matTooltip="Estimated figures: subject to change"
          >
            <mat-icon
              class="error mat-icon material-icons"
              role="img"
              style="color: #f2994a;font-size: 15px;"
              >error_outline</mat-icon
            >
          </div>
        </div>
        <div class="subtitle-dropdown">
          <mat-form-field>
            <mat-select [(value)]="selected" disableRipple>
              <mat-option value="usd">USD</mat-option>
              <mat-option value="eur">EUR</mat-option>
              <mat-option value="inr">INR</mat-option>
            </mat-select>
          </mat-form-field>
          <span
            style="top: 2px;position: relative;margin-right: 4px;font-weight: lighter;font-size: 15px;"
            >/</span
          >
          <mat-form-field>
            <mat-select [(value)]="selected1" disableRipple>
              <mat-option value="bbl">BBL</mat-option>
              <mat-option value="gal">GAL</mat-option>
              <mat-option value="mt">MT</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <!--<div class="subtitle" style="clear: left;">{{this.params.subtitles}}</div>-->
      </div>
    </div>
  `,
  styles: [
    `
      .customHeaderLabel {
        position: fixed;
        width: 100%;
      }
    `
  ]
})
export class CustomHeaderGroupNotify {
  public params: any;
  selected = 'usd';
  selected1 = 'bbl';
  agInit(params): void {
    this.params = params;
  }
}
