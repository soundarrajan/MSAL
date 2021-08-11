import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ProductDetailsComponent } from '../dialog-popup/product-details/product-details.component';
import { CellHoverDetailsComponent } from '../dialog-popup/cell-hover-details/cell-hover-details.component';
import { OperationSummaryPopComponent } from '../dialog-popup/operation-summary-pop/operation-summary-pop.component';
import { WarningDeletePopupComponent } from '../dialog-popup/warning-delete-popup/warning-delete-popup.component';
import { OperationSummaryWithoutaddnewComponent } from '../dialog-popup/operation-summary-withoutaddnew/operation-summary-withoutaddnew.component';
import { OperationSummaryWithStatusComponent } from '../dialog-popup/operation-summary-with-status/operation-summary-with-status.component';
import { PipelineTariffComponent } from '../dialog-popup/pipeline-tariff/pipeline-tariff.component';
import { CogsCalculationComponent } from '../dialog-popup/cogs-calculation/cogs-calculation.component';
import { InventoryReportPopupComponent } from '../ops-inventory/popup-screens/inventory-report-popup/inventory-report-popup.component';
import { MovDetailsComponent } from '../ops-inventory/popup-screens/mov-details/mov-details.component';

@Component({
  selector: 'aggrid-cell-data',
  template: `
    <div
      *ngIf="
        params.stylemode != null
          ? params.stylemode.indexOf('notification') >= 0
            ? true
            : false
          : false
      "
      style="width:100%"
    >
      <div
        class="aggrid-notification"
        matTooltip="Final Price > 10% &#13; of OPIS Price"
      >
        <mat-icon class="error mat-icon material-icons" role="img"
          >error_outline</mat-icon
        >
        <div
          [ngClass]="{
            'aggrid-editable':
              params.stylemode != null
                ? params.stylemode.indexOf('editable') >= 0
                  ? true
                  : false
                : false
          }"
          [matMenuTriggerFor]="dropdownlist"
        >
          {{ params.value
          }}<span *ngIf="params.type == 'dropdown'" style="margin-left:2px"
            ><img src="../assets/customicons/dropdown.svg" alt="list"
          /></span>
        </div>
      </div>
    </div>

    <div *ngIf="params.stylemode === 'location'">
      <div class="aggrid-location" [matMenuTriggerFor]="dropdownlist">
        {{ params.value
        }}<span *ngIf="params.type == 'dropdown'" style="margin-left:2px"
          ><img src="../assets/customicons/dropdown.svg" alt="list"
        /></span>
      </div>
    </div>

    <div *ngIf="params.stylemode === 'editable'">
      <div [matMenuTriggerFor]="dropdownlist">
        <div class="aggrideditable-text">
          <span class="aggrid-text-resizable">{{ params.value }}</span>
          <span *ngIf="params.type == 'dropdown'" style="margin-left:2px">
            <img src="../assets/customicons/dropdown.svg" alt="list" />
          </span>
        </div>
      </div>
    </div>

    <div *ngIf="params.stylemode === 'dropdown-editable'">
      <div class="aggrideditable-text" [matMenuTriggerFor]="dropdownlist">
        <span class="aggrid-text-resizable"> {{ params.value }}</span>
        <span
          *ngIf="params.type == 'dropdown-grey'"
          style="position: relative; top: -3px;"
        >
          <img src="../assets/customicons/dropdown_grey.svg" alt="list" />
        </span>
      </div>
    </div>
    <div *ngIf="params.stylemode === 'dropdown-editable-singlerow'">
      <div
        class="aggrideditable-text-singlerow"
        [matMenuTriggerFor]="dropdownlist"
      >
        <span class="aggrid-text-resizable"> {{ params.value }}</span>
        <span
          *ngIf="params.type == 'dropdown-grey'"
          style="position: relative; top: -3px;"
        >
          <img src="../assets/customicons/dropdown_grey.svg" alt="list" />
        </span>
      </div>
    </div>

    <div *ngIf="params.type == 'text'">
      <div *ngIf="params.data.data">
        <div
          *ngFor="let item of params.data.data"
          class="aggrid-multirow"
          [ngClass]="params.classes"
        >
          <span class="aggrid-text-resizable">{{ item[params.label] }}</span>
        </div>
        <div
          *ngIf="!params.data.data"
          style="line-height: 15px"
          [ngClass]="params.classes"
        >
          <span style="line-height: 15px" class="aggrid-text-resizable">{{
            params.data
          }}</span>
        </div>
      </div>
    </div>

    <div *ngIf="params.type == 'radio-button'">
      <mat-radio-group class="">
        <mat-radio-button
          value=""
          [(checked)]="params.node.selected"
          (change)="handleChange()"
        ></mat-radio-button>
      </mat-radio-group>
    </div>

    <div *ngIf="params.type == 'div-in-cell'">
      <div *ngIf="params.label == 'div-in-cell'" class="div-in-cell" style="">
        {{ params.value }}
      </div>
      <div
        *ngIf="params.label == 'cell-editable'"
        class="aggrid-editable white-dash"
        style="text-align:right;padding-right:10px;height: 25px;"
      >
        <mat-form-field style="height: 25px;">
          <input matInput value="{{ params.value }}" style="text-align: right;"
        /></mat-form-field>
      </div>
      <div
        *ngIf="params.label == 'div-bg-cell'"
        class="div-bg-cell"
        style="background:rgba(74, 88, 108, 0.7); text-align:right;"
      >
        {{ params.value }}
      </div>
      <div *ngIf="params.label == 'cell-bg-border'" class="cell-bg-border">
        <div
          style="padding-right: 7px;margin-left: 5px;background:rgba(74, 88, 108, 0.7); text-align:right;"
        >
          {{ params.value }}
        </div>
      </div>
      <div *ngIf="params.label == 'cell-bg-border-0'" class="blue-opacity-cell">
        <div style="padding-right: 7px;margin-left: 5px; text-align:right;">
          {{ params.value }}
        </div>
      </div>
    </div>

    <div *ngIf="params.type == 'div-in-cell1'">
      <div
        class="aggrid-editable white-dash"
        style="text-align:right;padding-right:10px;height: 25px;"
      >
        <mat-form-field style="height: 25px;">
          <input matInput value="{{ params.value }}" style="text-align: right;"
        /></mat-form-field>
      </div>
    </div>

    <div *ngIf="params.type == 'editable-hover-popup'">
      <div *ngIf="params.data.data">
        <div *ngFor="let item of params.data.data">
          <div
            *ngIf="item[params.label]"
            class="hover-cell aggrid-multirow aggrideditable-text"
            [ngClass]="params.classes"
            style="height: 30px !important;line-height: 30px;margin: 8px;padding: 0;text-align: right;"
          >
            <span class="aggrid-text-resizable"
              >{{ item[params.label] }}
              <span
                class="hover-popup-img"
                (click)="
                  $event.stopPropagation(); pipelineTariff(item[params.label])
                "
              ></span
            ></span>
          </div>
          <div
            *ngIf="!item[params.label]"
            style="height: 30px; line-height: 32px;text-align: right;"
            class="aggrid-text-resizable"
          >
            NA
          </div>
        </div>
      </div>
      <div
        *ngIf="!params.data.data"
        style="line-height: 15px"
        [ngClass]="params.classes"
      >
        <span style="line-height: 15px" class="aggrid-text-resizable">{{
          params.data
        }}</span>
      </div>
    </div>

    <div *ngIf="params.type == 'staticlabel'" class="group-1">
      <div *ngIf="params.data.data" class="group-2">
        <div *ngFor="let item of params.data.data" class="group-3">
          <span *ngIf="item[params.label]" class="from-to">
            <span class="label" style="width: 78px;display: inline-block;"
              >{{ item.destination }}:</span
            ><span class="aggridtextunderline loc-name">{{
              item[params.label]
            }}</span></span
          >
        </div>
        <div *ngIf="!params.data.data[1][params.label]" class="group-3">
          <span class="from-to"><span class="label">Next:</span></span>
          <span
            class="no-destination"
            style="position:absolute; right:0"
            *ngIf="params.data.data[1].location == ''"
          >
            No Destination</span
          >
        </div>
      </div>
    </div>

    <div *ngIf="params.type == 'etalabel'" class="group-1">
      <div *ngIf="params.data.data" class="group-2">
        <div
          *ngFor="let item of params.data.data; let i = index"
          class="group-3"
        >
          <span *ngIf="params.data.data[i].location != ''">
            {{ item[params.label] }}</span
          >
          <span
            class="no-destination"
            *ngIf="params.data.data[i].location == ''"
          >
          </span>
        </div>
        <div *ngIf="!params.data.data">
          {{ params.data }}
        </div>
      </div>
    </div>

    <div *ngIf="params.type == 'comments'">
      <div class="aggrid-content-center">
        <span
          *ngIf="params.data.comment != '0'"
          matBadge="3"
          matBadgeColor="warn"
          matBadgeOverlap="true"
          matBadgePosition="before"
          class="comment-count"
        >
          <img
            class="comment-icon"
            src="../../../assets/customicons/comment.png"
            alt="comment_icon"
          />
        </span>

        <span *ngIf="params.data.comment == '0'" class="comment-count">
          <img
            class="comment-icon"
            src="../../../assets/customicons/comment_no.svg"
            alt="comment_icon"
          />
        </span>
      </div>
    </div>

    <div *ngIf="params.type == 'roundchip'">
      <div *ngFor="let item of params.data.data" class="aggrid-multirow">
        <div class="aggrid-innershadow" title="{{ item[params.label] }}">
          {{
            params.letter != null
              ? item[params.label].charAt(params.letter).toUpperCase()
              : item[params.label]
          }}
        </div>
      </div>
    </div>

    <div
      *ngIf="params.type == 'checkbox'"
      (mouseover)="bubblemessage = true"
      (mouseleave)="bubblemessage = false"
    >
      <p
        *ngIf="bubblemessage"
        [ngClass]="{
          bubble_error: bubblemessageerror,
          bubble_success: !bubblemessageerror
        }"
      >
        SitePoint Rocks!
        <span
          ><mat-icon
            *ngIf="bubblemessageerror"
            (click)="bubblemessageerror = !bubblemessageerror"
            >close</mat-icon
          ></span
        >
        <span
          ><mat-icon
            *ngIf="!bubblemessageerror"
            (click)="bubblemessageerror = !bubblemessageerror"
            >check</mat-icon
          ></span
        >
        <mat-icon>play_arrow</mat-icon>
      </p>
      <mat-checkbox
        class="dark-checkbox noborder"
        (click)="$event.stopPropagation()"
        >{{ params.value }}</mat-checkbox
      >
    </div>

    <div *ngIf="params.type == 'unmatch'">
      <div class="aggrid-content-center unmatch" (click)="deleteWarning()">
        <img
          id="list-icon"
          src="/assets/icon/unmatch.svg"
          alt="list"
          (click)="unmatch()"
          matTooltip="Revert"
        />
      </div>
    </div>

    <div *ngIf="params.type == 'revert'">
      <div class="aggrid-content-center unmatch" (click)="deleteWarning()">
        <img id="list-icon" src="/assets/icon/unmatch.svg" alt="list" (click)="unmatch()" matTooltip="Revert">
        <img [src]="imageSource" style="width:16px;height:16px" />
      </div>
    </div>

    <div *ngIf="params.type == 'new-revert'" style="height:100%">
      <div
        class="aggrid-content-center"
        (click)="revertWarning()"
        style="height:100%"
      >
        <img
          src="../../../assets/customicons/revert.svg"
          width="13"
          alt="Revert"
        />
      </div>
    </div>

    <div *ngIf="params.type == 'delete'">
      <div class="aggrid-content-center unmatch">
        <img
          id="list-icon"
          src="/assets/icon/delete.svg"
          alt="list"
          (click)="unmatch()"
          matTooltip="Delete"
        />
      </div>
    </div>

    <div *ngIf="params.type == 'delete-button'">
      <div
        class="aggrid-content-center"
        class="delete-red"
        (click)="deleteWarning()"
      >
        <!--<img id="list-icon" src="../assets/customicons/close-red.svg" alt="list">-->
        <img [src]="delimageSource" />
      </div>
    </div>
    <div *ngIf="params.type == 'delete-icon-red'" style="height:100%">
      <div
        class="aggrid-content-center"
        class="delete-red"
        style="opacity: 1;height:100%"
        (click)="deleteWarning()"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/delete-red.svg"
          width="22"
          alt="Delete"
        />
      </div>
    </div>
    <div *ngIf="params.type == 'checkbox-popup'" style="text-align: center;">
      <mat-checkbox
        class="noborder checkmenu small"
        style="border: 2px solid #C4C4C4;"
        #checkbox
        (click)="$event.stopPropagation()"
        [(ngModel)]="isChecked"
        (change)="checkValue(isChecked ? 'A' : 'B')"
        [matMenuTriggerFor]="checkboxPopup"
        #checkboxmenuTrigger1="matMenuTrigger"
      ></mat-checkbox>
    </div>
    <mat-menu
      #checkboxPopup="matMenu"
      class="menucheckboxpopup"
      yPosition="above"
    >
      <div class="cell-checkboxPopup">
        Auto Qty conversion disabled
        <!--<div class="polygon-arrow"></div>-->
      </div>
    </mat-menu>

    <div *ngIf="params.type == 'undo'">
      <div
        class="aggrid-content-center"
        style="background-color: #EB5757;width: 25px;height: 25px;border-radius: 25px;margin: 0 auto;"
      >
        <img
          id="list-icon"
          src="/assets/customicons/undo.svg"
          alt="list"
          (click)="unmatch()"
          matTooltip="Unmatch"
          style="width: 15px;height: 15px;"
        />
      </div>
    </div>

    <div *ngIf="params.type == 'schedule-img'">
      <div class="aggrid-content-center">
        <img
          id="list-icon"
          src="/assets/customicons/ship_f.svg"
          alt="list"
          (click)="unmatch()"
        />
      </div>
    </div>

    <div
      *ngIf="params.style != null && params.style != 'chip'"
      style="width:100%"
    >
      <p
        style="width:95%;display: inline-block;overflow: hidden;text-overflow: ellipsis;margin:0px; padding: 0px 18px 0px 15px"
        [ngClass]="{
          aggridlink: params.style.indexOf('link') >= 0 ? true : false,
          aggridtextunderline:
            params.style.indexOf('underline') >= 0 ? true : false,
          'aggrid-editable': params.style.indexOf('dotbox') >= 0 ? true : false,
          'aggrid-notification':
            params.style.indexOf('notification') >= 0 ? true : false,
          'aggrid-celldisable':
            params.style.indexOf('celldisable') >= 0 ? true : false
        }"
        [ngStyle]="{
          'letter-spacing.px':
            params.value == null || params.value == '' ? -1 : 1,
          'text-align':
            params.style.indexOf('center') >= 0
              ? 'center'
              : params.style.indexOf('right') >= 0
              ? 'right'
              : 'left'
        }"
        [matTooltipDisabled]="params.style.indexOf('notification') < 0"
        matTooltip="Final Price > 10% &#13; of OPIS Price"
        (dblclick)="
          showedit = params.style.indexOf('editable') >= 0 ? true : false
        "
      >
        <span *ngIf="params.style.indexOf('raiseupicon') >= 0 ? true : false">
          <mat-icon
            class="error mat-icon material-icons aggrid-raiseupicon"
            role="img"
            style="color:red"
            >play_arrow</mat-icon
          ></span
        >
        <span *ngIf="params.style.indexOf('raisedownicon') >= 0 ? true : false">
          <mat-icon
            *ngIf="params.style.indexOf('raisedownicon') >= 0 ? true : false"
            class="error mat-icon material-icons aggrid-raisedownicon"
            role="img"
            style="color:green"
            >play_arrow</mat-icon
          ></span
        >
        <mat-icon
          *ngIf="params.style.indexOf('notification') >= 0 ? true : false"
          class="error mat-icon material-icons"
          role="img"
          >error_outline</mat-icon
        >
        <span *ngIf="params.style.indexOf('checkbox') >= 0 ? true : false"
          ><mat-checkbox
            class="dark-checkbox noborder"
            (click)="$event.stopPropagation()"
          ></mat-checkbox
        ></span>
        {{
          params.value == null || params.value == ''
            ? '_________________'
            : params.value
        }}<span
          [matMenuTriggerFor]="dropdownlist"
          *ngIf="params.type == 'dropdown'"
          style="margin-left:4px;position: absolute;right: 8px;"
          ><img src="../assets/customicons/dropdown.svg" alt="list"
        /></span>
      </p>
    </div>

    <div *ngIf="params.style != null && params.style == 'chip'">
      <mat-chip-list>
        <mat-chip
          color="accent"
          matTooltip="{{ toolTip }}"
          [ngClass]="{
            darkgreen: params.value == 'Success',
            red: params.value == 'Failed'
          }"
          class="text-center aggrid-custom-chip chipbase mat-chip mat-primary mat-standard-chip"
          (click)="showICDetails()"
          >{{ this.params.value }}
        </mat-chip>
      </mat-chip-list>
    </div>

    <div *ngIf="showedit" class="editbubble">
      <input type="text" />
      <div>
        <a class="btn" (click)="showedit = false">Cancel</a>
        <a class="btn" (click)="showedit = false">Save</a>
      </div>
    </div>

    <div *ngIf="params.type == 'empty'">
      <span style="letter-spacing: -1px">_____________</span>
    </div>

    <div
      *ngIf="params.type == 'emptydropdown'"
      [matMenuTriggerFor]="checkboxmenu"
    >
      <span
        style="color:#96CF55;border-bottom: 1px solid black;padding-bottom: 2px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 90%;
        display: inline-block !important;height: 32px;"
        >{{ params.value }}</span
      >
      <span style="position: relative;bottom: 5px;"
        ><img src="../assets/customicons/dropdown.svg" alt="list"
      /></span>
    </div>

    <div
      *ngIf="params.type == 'product-details-popup'"
      (click)="openTankDetails()"
    >
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span class="product-popup"></span>
    </div>

    <div
      *ngIf="params.type == 'operation-summary-popup'"
      (click)="openoperationsummary()"
    >
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span class="product-popup"></span>
    </div>
    <div *ngIf="params.type == 'movReport-popup'" class="hover-click-drag-menu">
      <div
        class="popup-icon info-icon hover-menu-icon"
        style="cursor: pointer;margin-left:-15px !important;"
        [matMenuTriggerFor]="hovermenuz"
        #menuTriggerToggle="matMenuTrigger"
        (click)="movReport()"
        (mouseenter)="toggleMenu($event)"
        (mouseleave)="toggleMenu2()"
        (menuClosed)="toggleMenu1($event)"
      ></div>
      <div
        [ngClass]="params.cellClass"
        style="text-align:center;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
      >
        {{ params.value }}
      </div>
    </div>
    <mat-menu
      #hovermenuz="matMenu"
      class="menu-whitebg"
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <div class="mov-details" (click)="movReport()">
        <span class="mov-img"></span>Movement details
      </div>
    </mat-menu>
    <div
      *ngIf="params.type == 'inventoryReport-popup'"
      class="hover-click-drag-menu"
    >
      <div
        [ngClass]="params.cellClass"
        style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
      >
        {{ params.value }}
      </div>
      <div
        class="popup-icon info-icon hover-menu-icon"
        style="cursor: pointer; margin-left:10px;"
        [matMenuTriggerFor]="hovermenuz1"
        #menuTriggerHover="matMenuTrigger"
        (click)="inventoryReport()"
        (mouseenter)="hoverMenu($event)"
        (menuClosed)="toggleMenu1($event)"
      ></div>
    </div>
    <mat-menu
      #hovermenuz1="matMenu"
      class="menu-whitebg"
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTriggerHover.closeMenu()">
        <div class="mov-details" (click)="inventoryReport()">
          <span class="mov-img"></span>Tank Report
        </div>
        <div class="mov-details p-t-10" (click)="deleteTankReport()">
          <span class="delete-img"></span>Delete Report
        </div>
      </span>
    </mat-menu>
    <div *ngIf="params.type == 'cell-hover-click-menu'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickmenu"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenu="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border p-lr-0" style="width:170px;">
          <!-- <div class="p-tb-10" (click)='openoperationsummaryStatus()' >
      <span>
        <img class="p-r-10" src="../../../assets/customicons/ops_sum.svg" width="25" alt="export to excel icon">
      </span>
      <span class="fs-12">Ops Summary</span>
    </div> -->
          <div class="p-tb-10">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/copy2.svg"
                width="25"
                alt="Savc As icon"
              />
            </span>
            <span class="fs-12">Duplicate</span>
          </div>
          <div class="p-tb-10">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/updateinformation.svg"
                width="25"
                alt="export to excel icon"
              />
            </span>
            <span class="fs-12">Update Information</span>
          </div>
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="deleteWarning()"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/delete-red.svg"
                width="25"
                alt="Delete"
              />
            </span>
            <span class="fs-12">Delete Movement</span>
          </div>
          <!-- <div class="p-tb-10" (click)='openoperationsummaryStatus()' >
      <span>
        <img class="p-r-10" src="../../../assets/customicons/auditlog.svg" width="25" alt="export to excel icon">
      </span>
      <span class="fs-12">Audit Log</span>
    </div> -->
        </div>
      </span>
    </mat-menu>
    <div *ngIf="params.type == 'cell-hover-click-menu-recon'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickmenurecon"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenurecon="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border p-lr-0" style="width:170px;">
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="deleteWarning()"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/revert.svg"
                width="25"
                alt="Revert"
              />
            </span>
            <span class="fs-12">Revert Movement</span>
          </div>
        </div>
      </span>
    </mat-menu>
    <div *ngIf="params.type == 'cell-hover-click-menu-popup'">
      <span
        style="width: 70%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align:right"
        >{{ params.value }}</span
      >
      <span
        style="top: 8px; right:16px;transform: rotate(90deg);"
        class="product-popup"
        [matMenuTriggerFor]="clickmenupopup"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="transform: rotate(90deg);position: absolute;top: 4px;right: 10px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenupopup="matMenu"
      class="small-menu"
      yPosition="above"
      style="position: relative;bottom: 15px;left: 66px;text-align:center;min-height:40px;padding:0"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="no-border p-lr-0" style="width:120px;">
          <div
            class=""
            style="cursor:pointer;text-align: center;"
            (click)="cogsCalculation()"
          >
            <span class="fs-12">COGS Calculation</span>
          </div>
        </div>
      </span>
    </mat-menu>
    <div *ngIf="params.type == 'cell-hover-click-menu-dova'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickmenudova"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenudova="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border p-lr-0" style="width:170px;">
          <!-- <div class="p-tb-10" (click)='openoperationsummaryStatus()' >
      <span>
        <img class="p-r-10" src="../../../assets/customicons/ops_sum.svg" width="25" alt="export to excel icon">
      </span>
      <span class="fs-12">Ops Summary</span>
    </div> -->
          <div class="p-tb-10">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/copy2.svg"
                width="25"
                alt="Savc As icon"
              />
            </span>
            <span class="fs-12">Duplicate</span>
          </div>
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="viewMovement(params)"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/updateinformation.svg"
                width="25"
                alt="export to excel icon"
              />
            </span>
            <span class="fs-12">View Information</span>
          </div>

          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="deleteWarning()"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/delete-red.svg"
                width="25"
                alt="Delete"
              />
            </span>
            <span class="fs-12">Delete Movement</span>
          </div>
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="revertWarning()"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/revert.svg"
                width="25"
                alt="Revert"
              />
            </span>
            <span class="fs-12">Revert Movement</span>
          </div>
          <!-- <div class="p-tb-10" (click)='openoperationsummaryStatus()' >
      <span>
        <img class="p-r-10" src="../../../assets/customicons/auditlog.svg" width="25" alt="export to excel icon">
      </span>
      <span class="fs-12">Audit Log</span>
    </div> -->
        </div>
      </span>
    </mat-menu>

    <div *ngIf="params.type == 'cell-hover-click-menu-ova'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickmenuova"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenuova="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border p-lr-0" style="width:170px;">
          <!-- <div class="p-tb-10" (click)='openoperationsummaryStatus()' >
      <span>
        <img class="p-r-10" src="../../../assets/customicons/ops_sum.svg" width="25" alt="export to excel icon">
      </span>
      <span class="fs-12">Ops Summary</span>
    </div> -->
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="viewMovement(params)"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/updateinformation.svg"
                width="25"
                alt="export to excel icon"
              />
            </span>
            <span class="fs-12">View Information</span>
          </div>
          <!-- <div class="p-tb-10" (click)='openoperationsummaryStatus()' >
      <span>
        <img class="p-r-10" src="../../../assets/customicons/auditlog.svg" width="25" alt="export to excel icon">
      </span>
      <span class="fs-12">Audit Log</span>
    </div> -->
        </div>
      </span>
    </mat-menu>

    <div *ngIf="params.type == 'cell-hover-click-menu-3dua'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickmenu3"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenu3="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border p-lr-0" style="width:170px;">
          <div class="p-tb-10">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/copy2.svg"
                width="25"
                alt="Savc As icon"
              />
            </span>
            <span class="fs-12">Duplicate</span>
          </div>
          <div class="p-tb-10">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/updateinformation.svg"
                width="25"
                alt="export to excel icon"
              />
            </span>
            <span class="fs-12">Update Information</span>
          </div>
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="deleteWarning()"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/delete-red.svg"
                width="25"
                alt="Delete"
              />
            </span>
            <span class="fs-12">Delete Movement</span>
          </div>
          <!-- <div class="p-tb-10" (click)='openoperationsummaryStatus()' >
      <span>
        <img class="p-r-10" src="../../../assets/customicons/auditlog.svg" width="25" alt="export to excel icon">
      </span>
      <span class="fs-12">Audit Log</span>
    </div>
    --></div>
      </span>
    </mat-menu>

    <div *ngIf="params.type == 'cell-hover-click-menu-cancel'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-decoration: underline;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickCancelmenu"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickCancelmenu="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border p-lr-0" style="width:170px;">
          <div class="p-tb-10" style="cursor:pointer;">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/delete-red.svg"
                width="25"
                alt="Delete"
              />
            </span>
            <span class="fs-12">Cancel Closure</span>
          </div>
        </div>
      </span>
    </mat-menu>

    <div *ngIf="params.type == 'cell-hover-click-menu-2dv'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickmenu2"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenu2="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border p-lr-0" style="width:170px;">
          <div class="p-tb-10">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/copy2.svg"
                width="25"
                alt="Savc As icon"
              />
            </span>
            <span class="fs-12">Duplicate</span>
          </div>
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="viewMovement(params)"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/updateinformation.svg"
                width="25"
                alt="export to excel icon"
              />
            </span>
            <span class="fs-12">View Information</span>
          </div>
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="deleteWarning()"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/delete-red.svg"
                width="25"
                alt="Delete"
              />
            </span>
            <span class="fs-12">Delete Movement</span>
          </div>
          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="revertWarning()"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/revert.svg"
                width="25"
                alt="Revert"
              />
            </span>
            <span class="fs-12">Revert Movement</span>
          </div>
        </div>
      </span>
    </mat-menu>

    <div *ngIf="params.type == 'cell-hover-click-menu-2av'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickmenuav"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenuav="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border p-lr-0" style="width:170px;">
          <!-- <div class="p-tb-10" (click)='openoperationsummaryStatus()' >
      <span>
        <img class="p-r-10" src="../../../assets/customicons/auditlog.svg" width="25" alt="export to excel icon">
      </span>
      <span class="fs-12">Audit Log</span>
    </div> -->

          <div
            class="p-tb-10"
            style="cursor:pointer;"
            (click)="viewMovement(params)"
          >
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/updateinformation.svg"
                width="25"
                alt="export to excel icon"
              />
            </span>
            <span class="fs-12">View Information</span>
          </div>
        </div>
      </span>
    </mat-menu>

    <div *ngIf="params.type == 'cell-hover-click-menu-readonly'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup"
        [matMenuTriggerFor]="clickmenu1"
        #menuTrigger="matMenuTrigger"
        (mouseenter)="menuTrigger.openMenu()"
        (click)="$event.stopPropagation()"
        (menuOpened)="clickMenuOpened()"
        (menuClosed)="clickMenuClosed()"
      ></span>
      <div
        class="blue-menu-icon"
        *ngIf="blueMenuIcon"
        style="position: absolute;top: -3px;right: -5px;"
      >
        <img
          class="p-r-10"
          src="../../../assets/customicons/blue-menu-icon.svg"
          width="25"
          alt="Savc As icon"
        />
      </div>
    </div>
    <mat-menu
      #clickmenu1="matMenu"
      class=""
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <span (mouseleave)="menuTrigger.closeMenu()">
        <div class="tbl-context no-border" style="width:170px;">
          <div class="p-tb-10">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/copy2.svg"
                width="25"
                alt="Savc As icon"
              />
            </span>
            <span>Duplicate</span>
          </div>
          <div class="p-tb-10">
            <span>
              <img
                class="p-r-10"
                src="../../../assets/customicons/ops_sum.svg"
                width="25"
                alt="export to excel icon"
              />
            </span>
            <span>Ops Summary</span>
          </div>
        </div>
      </span>
    </mat-menu>

    <div *ngIf="params.type == 'hover-popup-toggle'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup hover-menu-icon "
        [matMenuTriggerFor]="hovertogglemenu"
        #hovermenuTrigger="matMenuTrigger"
        (click)="freezeMenuOpened($event, true)"
        (mouseenter)="hoverPopupOpen($event, true)"
        (mouseleave)="hoverOutPopup(true)"
        (menuClosed)="freezeMenuClosed($event, true)"
      ></span>
    </div>

    <mat-menu
      #hovertogglemenu="matMenu"
      class="matmenu-blue hover-menu-white"
      xPosition="after"
      [hasBackdrop]="false"
    >
      <div style="position: absolute;top: -19px;left: 63px;">
        <!--<div class="hover-highlight-icon"></div>-->
        <!--<div class="vector-arrow"></div>-->
      </div>
      <div
        (keydown)="$event.stopPropagation()"
        (click)="$event.stopPropagation(); $event.preventDefault()"
        cdkDrag
        cdkDragRootElement=".cdk-overlay-pane"
        cdkDragHandle
        class="grey-popup"
        style="position:relative;background: white;float:left;border: 1px solid #74CDEA;border-radius: 20px;padding: 10px 0px 5px 0px;"
      >
        <h2
          mat-dialog-title
          class="dialog-title"
          style="margin-bottom: 5px;font-weight: 400;font-size: 14px;color: #74CDEA;padding-top:0px;padding-left:15px;height: 16px;"
        >
          BL036782
        </h2>
        <div
          class="close-btn-red"
          (click)="freezePopupClose($event, true)"
        ></div>
        <table style="color: #8F9BAB;position:relative;">
          <thead>
            <tr class="head">
              <th style="">Label</th>
              <th style="padding-left: 0;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let item of rowDetails"
              style="font-size: 13px;color: #333333;"
            >
              <td style="padding: 5px 17px 0 17px;vertical-align: top;">
                {{ item.label }}
              </td>
              <td style="padding: 5px 17px 0 0px;vertical-align: top;">
                {{ item.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </mat-menu>

    <div *ngIf="params.type == 'hover-popup-toggle1'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup hover-menu-icon "
        [matMenuTriggerFor]="hovertogglemenu1"
        #hovermenuTrigger1="matMenuTrigger"
        (click)="freezeMenuOpened($event, false)"
        (mouseenter)="hoverPopupOpen($event, false)"
        (mouseleave)="hoverOutPopup(false)"
        (menuClosed)="freezeMenuClosed($event, false)"
      ></span>
    </div>

    <mat-menu
      [hasBackdrop]="false"
      #hovertogglemenu1="matMenu"
      class="matmenu-blue hover-menu-white"
      xPosition="after"
    >
      <div style="position: absolute;top: -19px;left: 63px;">
        <!--<div class="hover-highlight-icon"></div>-->
        <!--<div class="vector-arrow"></div>-->
      </div>
      <div
        (keydown)="$event.stopPropagation()"
        (click)="$event.stopPropagation(); $event.preventDefault()"
        cdkDrag
        cdkDragRootElement=".cdk-overlay-pane"
        cdkDragHandle
        class="grey-popup"
        style="position: relative;background: white;float:left;border: 1px solid #74CDEA;border-radius: 20px;padding: 10px 0px 5px 0px;"
      >
        <h2
          mat-dialog-title
          class="dialog-title"
          style="margin-bottom: 5px;font-weight: 400;font-size: 14px;color: #74CDEA;padding-top:0px;padding-left:15px;height: 16px;"
        >
          BL036782
        </h2>
        <div
          class="close-btn-red"
          (click)="freezePopupClose($event, false)"
        ></div>
        <table style="color: #8F9BAB;position:relative;">
          <thead>
            <tr class="head">
              <th style="">Label</th>
              <th style="padding-left: 0;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let item of rowDetails"
              style="font-size: 13px;color: #333333;"
            >
              <td style="padding: 5px 17px 0 17px;vertical-align: top;">
                {{ item.label }}
              </td>
              <td style="padding: 5px 17px 0 0px;vertical-align: top;">
                {{ item.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </mat-menu>

    <div *ngIf="params.type == 'hover-popup-toggle-table'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span
        class="product-popup hover-menu-icon left"
        [matMenuTriggerFor]="hovertoggletable"
        #hovermenuTrigger="matMenuTrigger"
        (mouseenter)="toggleMenu($event)"
        (mouseleave)="toggleMenu2()"
        (menuClosed)="toggleMenu1($event)"
      ></span>
    </div>

    <mat-menu
      #hovertoggletable="matMenu"
      class="matmenu-blue hover-menu-white hover-menu-below"
      xPosition="after"
    >
      <div class="grey-table">
        <h2 class="dialog-title">Calculated Qty Details</h2>
        <hr />
        <div class="product-terms p-b-5">
          <span class="product-id">PHS00774532-1/MOVS00774532</span>
          <span
            class="product-name float-right truncate-f100"
            style="text-align:right;"
            >{{
              params.data.product == 'LCFS credit'
                ? 'CA LCFS CREDIT'
                : params.data.product == 'RIN'
                ? 'RIN 2018'
                : params.data.product == 'CAR'
                ? 'CAR 2018'
                : 'CCA 20199999999999'
            }}</span
          >
        </div>
        <div class="product-details-block">
          <table>
            <thead>
              <tr>
                <th style="border-right: none;">Factor</th>
                <th style="text-align: right;border-left: none;">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of qtyDetails">
                <td style="">{{ item.label }}</td>
                <td style="text-align: right">
                  {{
                    params.data.product == 'LCFS credit'
                      ? '1200 BBL'
                      : item.value
                  }}
                </td>
              </tr>
              <tr>
                <td style="font-weight: 600 !important;">CI Difference</td>
                <td style="text-align: right;font-weight: 600 !important;">
                  1200
                </td>
              </tr>
              <tr>
                <td>Env. instrument Factor</td>
                <td style="text-align: right;">1200</td>
              </tr>
              <tr>
                <td style="font-weight: 600 !important;border-right: none;">
                  Calculated Qty
                </td>
                <td
                  style="text-align: right;font-weight: 600 !important;border-left:none"
                >
                  1200 LCFS
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </mat-menu>

    <div *ngIf="params.type == 'hover-info-toggle-table'">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}
        <span
          class="product-popup hover-menu-icon info-icon left"
          [matMenuTriggerFor]="infohovertoggletable"
          #hovermenuTrigger="matMenuTrigger"
          (mouseenter)="toggleMenu($event)"
          (mouseleave)="toggleMenu2()"
          (menuClosed)="toggleMenu1($event)"
          >i</span
        >
      </span>
    </div>

    <mat-menu
      #infohovertoggletable="matMenu"
      class="matmenu-blue hover-menu-white hover-menu-below pinned-right"
      xPosition="after"
    >
      <div class="grey-table">
        <h2 class="dialog-title">Margin Details</h2>
        <hr />
        <div class="product-terms p-b-5">
          <span class="product-id">Purchase ID: 7836782</span>
          <span class="product-name float-right">Sale ID: 7836782</span>
        </div>
        <div class="product-details-block">
          <table>
            <thead></thead>
            <tbody>
              <tr *ngFor="let item of marginDetails">
                <td style="">{{ item.label }}</td>
                <td style="text-align: right">{{ item.value }}</td>
              </tr>
              <tr>
                <td style="font-weight: 600 !important;border-right:none;">
                  Margin
                </td>
                <td
                  style="text-align: right;font-weight: 600 !important;border-left: none;"
                >
                  2 USD
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </mat-menu>

    <div *ngIf="params.type == 'cell-hover-popup'" (click)="openPopup()">
      <span
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span class="product-popup"></span>
    </div>

    <div *ngIf="params.type == 'dateTime-picker'">
      <input
        [(ngModel)]="selectedMoment"
        class="aggrideditable-text"
        style="border:none;width:100%;"
        [owlDateTimeTrigger]="dtPicker1"
        [owlDateTime]="dtPicker1"
      />
      <owl-date-time #dtPicker1 [hour12Timer]="false"></owl-date-time>
    </div>

    <div *ngIf="params.type == 'mat-dateTime-picker'">
      <div class="mat-dateTime-picker">
        <mat-form-field
          id="datePicker"
          style="width:100%"
          class="aggriddate-picker"
        >
          <input
            id="validFrom"
            class="aggrideditable-text"
            style="width:100%"
            matInput
            [matDatepicker]="picker"
            (click)="picker.open()"
            style="outline: 1px dashed #C4C4c4;top: -3px;line-height: 24px;"
          />
          <mat-datepicker-toggle matSuffix [for]="picker">
            <mat-icon matDatepickerToggleIcon svgIcon="data-picker"></mat-icon>
          </mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>
    </div>

    <div *ngIf="params.type == 'active-deactive'">
      <span
        class="link-data"
        style="width: 78%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
        >{{ params.value }}</span
      >
      <span class="dropdown" [matMenuTriggerFor]="statusdropdown"></span>
    </div>

    <mat-menu #statusdropdown="matMenu" class="slider-grey">
      <span style="position: absolute;top: -14px;left:0px;"
        ><img src="../assets/customicons/dropdown.svg" alt="list"
      /></span>
      <div mat-menu-item style="padding-right:50px">
        <img
          src="../assets/customicons/copy2.svg"
          alt="duplicate-icon"
          style="margin-right:11px; margin-left:6px;"
        />Duplicate
      </div>
      <div mat-menu-item style="padding-right:50px">
        <mat-slide-toggle
          class="mini-slider slider-grey"
          [(ngModel)]="isActive"
          >{{ isActive ? 'Deactivate' : 'Activate' }}</mat-slide-toggle
        >
      </div>
    </mat-menu>

    <div
      *ngIf="params.type == 'emptydropdown-blue'"
      [matMenuTriggerFor]="radiobtnmenu"
      class="emptydropdown-blue-position"
    >
      <span
        class="dropdown-select"
        style="border-bottom: 1px solid black;padding-bottom: 2px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 90%;
        display: inline-block !important;height: 32px;"
        >{{ params.value }}</span
      >
      <span style="position: relative;bottom: 2px;left: -10px;"
        ><img
          src="../assets/customicons/dropdown_blue.svg"
          alt="list"
          style="padding-bottom:8px;"
      /></span>
    </div>

    <div
      *ngIf="params.type == 'selectioncircle'"
      class="aggridselectionradio"
    ></div>

    <div
      *ngIf="params.type == 'rating-star' && params.value !== ''"
      class="rating-star"
    >
      <i
        *ngFor="let n of range; let $index = index"
        class="to-display fa fa-star"
        [ngClass]="isMarked($index)"
      ></i>
    </div>

    <div *ngIf="params.type == 'mp-provider' && params.value == ' '">
      <div class="mp-provider">
        <div class="mp-block">
          <div class="mp-text fw700">
            Market Price<span class="fw300">Provided by</span>
          </div>
          <img
            src="../../../assets/customimages/suppliers/spglobal.svg"
            alt="logo"
          />
        </div>
      </div>
    </div>

    <div
      *ngIf="params.type == 'mp-provider' && params.value !== ''"
      style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;text-align: center"
    >
      {{ params.value }}
    </div>

    <div
      *ngIf="params.type == 'notify-popup'"
      style="width:100%;margin: 0 auto;"
      [matMenuTriggerFor]="spotnotify"
      #menuTrigger="matMenuTrigger"
      (mouseover)="emptyOpenMenu()"
    >
      <div
        style="display:block;max-width: 70px;position:relative;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;margin: 0 auto;text-align:center;"
        class="notify-select dark"
      >
        {{ params.value }}
        <mat-icon
          *ngIf="params.value !== '-' && params.value !== ''"
          class="error mat-icon material-icons"
          role="img"
          style="position: absolute; right:0px;top:2px;color: #5780A6;font-size: 12px;width: 12px;height:12px;"
          >error_outline</mat-icon
        >
      </div>
    </div>

    <mat-menu
      #spotnotify="matMenu"
      class="matmenu-blue side-menu"
      xPosition="after"
      style="position: relative;bottom: 15px;left: 66px;"
    >
      <div class="notify-blue" style="width: 237px;">
        <div class="vector"></div>
        <table style="position: relative;left: 7px;top: 5px;">
          <tr>
            <td style="font-size: 12px; color:#577897;">
              Requested Quantity :
            </td>
            <td style="font-size: 12px;color: #8F9BAB;">2000 BBL</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color:#577897;">Price at:</td>
            <td style="font-size: 12px;color: #8F9BAB;">
              <div
                style="width: 59px;background: #2F3845;border-radius: 10px;font-weight: bold;
         font-size: 9px;text-align: center;color: #EEEEEE;"
              >
                Quoted
              </div>
            </td>
          </tr>
          <tr>
            <td style="font-size: 12px; color:#577897;">Last updated at:</td>
            <td style="font-size: 12px;color: #8F9BAB;">
              17/06/19
              <span style="font-size: 10px;color: #8F9BAB;">10:32:00am</span>
            </td>
          </tr>
        </table>
      </div>
    </mat-menu>

    <div
      *ngIf="params.type == 'avail-qty-popup'"
      style="width: 100%;margin: 0 auto;"
      [matMenuTriggerFor]="qtynotify"
      #menuTrigger="matMenuTrigger"
      (mouseover)="hoverOpenMenu()"
    >
      <div
        style="position:relative;margin: 0 auto;text-align:center;display: block;max-width: 95px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
        class="notify-select"
      >
        {{ params.value }}
        <mat-icon
          *ngIf="params.value !== '-' && params.value !== ''"
          class="error mat-icon material-icons"
          role="img"
          style="position: absolute; right:0px;top:0px;color: #5780A6;font-size: 12px;width: 12px;height:12px;"
          >error_outline</mat-icon
        >
      </div>
    </div>

    <mat-menu #qtynotify="matMenu" class="matmenu-blue side-menu-left">
      <div class="notify-blue">
        <div
          class="vector"
          style="position: relative;float: right;top: -8px;left: 4px;transform: rotate(113.51deg);"
        ></div>
        <table style="position: relative;left: 20px;top: 5px;width: 85%;">
          <tr>
            <td style="font-size: 12px; color:#577897;">Planned Qty:</td>
            <td style="font-size: 12px;color: #8F9BAB;">100000 BBL</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color:#577897;">Used Qty:</td>
            <td style="font-size: 12px;color: #8F9BAB;">200000 BBL</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color:#577897;">Utilisation:</td>
            <td style="font-size: 12px;color: #8F9BAB;">90% Used</td>
          </tr>
        </table>
      </div>
    </mat-menu>

    <div
      *ngIf="params.type == 'type-popup'"
      style="width: 100%;margin: 0 auto;"
      [matMenuTriggerFor]="typenotify"
      #menuTrigger="matMenuTrigger"
      (mouseover)="hoverOpenMenu_with_autohide($event)"
    >
      <div
        style="position:relative;margin: 0 auto;display: block;max-width: 70px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
        class="notify-select"
      >
        {{ params.value }}
        <mat-icon
          *ngIf="params.value !== 'Fixed' && params.value !== ''"
          class="error mat-icon material-icons"
          role="img"
          style="position: absolute; right:13px;top:0px;color: #5780A6;font-size: 12px;width: 12px;height:12px;"
          >error_outline</mat-icon
        >
      </div>
    </div>

    <mat-menu
      #typenotify="matMenu"
      class="matmenu-blue side-menu transparent-bg"
      xPosition="after"
      style="background-color: transparent;"
    >
      <div
        class="transparent-overlay"
        (click)="closeMenu()"
        (mouseover)="closeMenu()"
      ></div>
      <div
        class="transparent-cell"
        [ngStyle]="{
          'height.px': transparentCell_height,
          'width.px': transparentCell_width
        }"
        [style.height]="transparentCell_height"
        [style.width]="transparentCell_width"
        (mouseout)="closeMenu()"
        (click)="closeMenu()"
      ></div>

      <div class="notify-blue" style="padding-right: 5px;padding-top: 10px;">
        <div class="vector" style=""></div>
        <table style="position: relative;">
          <tr>
            <td
              style="font-size: 8px; color:#577897;width: 60px;display: flex;"
            >
              <span style="margin-left: 5px;font-size: 12px;">Formula:</span>
            </td>
            <td style="font-size: 11px;color: #8F9BAB;">
              Low PUABC00 (Platts FOB Rotterdam Barges) - $2.75 on ETA - 4 days
            </td>
          </tr>
        </table>
      </div>
    </mat-menu>

    <div
      *ngIf="params.type == 'click-popup'"
      class="click-popup"
      style="width: 100%;margin: 0 auto;"
      [matMenuTriggerFor]="clicknotify"
      #menuTrigger="matMenuTrigger"
      (mouseenter)="hoverToggleOpen($event)"
      (mouseleave)="hoverToggleClose()"
      (menuClosed)="hoverActiveIcon($event)"
    >
      <div
        style="position:relative;margin: 0 auto;display: block;max-width: 70px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
        class="notify-select"
      >
        {{ params.value }}
        <span
          style=""
          class="hover-icon"
          *ngIf="params.value !== ''"
          [ngClass]="hovered ? 'hoverIn' : 'hoverOut'"
        ></span>
      </div>
    </div>

    <mat-menu
      #clicknotify="matMenu"
      class="matmenu-blue icon-change1"
      yPosition="below"
    >
      <!--    <div class="vector-arrow"></div> -->
      <div
        class="grey-popup"
        style="float: left;width: 481px;background: #37414F;border: 1px solid #5780A6;border-radius: 20px;padding: 10px 0 15px 0px;"
      >
        <h2
          mat-dialog-title
          class="dialog-title"
          style="margin-bottom: 10px;font-weight: 500;font-size: 14px;color: #5780A6;padding-top:0px;padding-left:15px;height: 16px;"
        >
          Discount Details
        </h2>

        <table style="color: #8F9BAB;position:relative;">
          <thead>
            <tr style="background: #2F3845;">
              <th
                style="position: relative;font-weight: 300;font-style: normal;padding: 4px 17px 4px 15px;"
              >
                <div
                  style="background: #2F3845;height: 100%;position: absolute;left: -1px;top: 0;border:2px solid #2F3845;"
                ></div>
                Quantity type
              </th>
              <th
                style="position: relative;font-weight: 300;font-style: normal;padding: 4px 17px 4px 0;"
              >
                From
              </th>
              <th
                style="position: relative;font-weight: 300;font-style: normal;padding: 4px 17px 4px 0;"
              >
                To
              </th>
              <th
                style="position: relative;font-weight: 300;font-style: normal;padding: 4px 17px 4px 0;"
              >
                UOM
              </th>
              <th
                style="position: relative;font-weight: 300;font-style: normal;padding: 4px 17px 4px 0;"
              >
                Policy
              </th>
              <th
                style="position: relative;font-weight: 300;font-style: normal;padding: 4px 17px 4px 0;"
              >
                Amount
              </th>
              <th
                style="position: relative;font-weight: 300;font-style: normal;padding: 4px 17px 4px 0;"
              >
                Type
                <div
                  style="background: #2F3845;height: 100%;position: absolute;right: -1px;top: 0;border:2px solid #2F3845;"
                ></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="font-size: 13px;">
              <td style="padding: 10px 17px 0 17px;">Per month</td>
              <td style="padding: 10px 17px 0 0px;">1000</td>
              <td style="padding: 10px 17px 0 0px;">1200</td>
              <td style="padding: 10px 17px 0 0px;">MT</td>
              <td style="padding: 10px 17px 0 0px;">Premium</td>
              <td style="padding: 10px 17px 0 0px;">1%</td>
              <td style="padding: 10px 17px 0 0px;">Percentage</td>
            </tr>
          </tbody>
        </table>
      </div>
    </mat-menu>

    <div *ngIf="params.type == 'withunit'" (dblclick)="editwithunit = true">
      <span *ngIf="!editwithunit"> {{ params.value }} </span>
      <div *ngIf="editwithunit" class="editbubble">
        <input type="text" [ngModel]="params.value" />
        <div>
          <a class="btn" (click)="editwithunit = false">Cancel</a>
          <a class="btn" (click)="editwithunit = false">Save</a>
        </div>
      </div>
    </div>

    <mat-menu #checkboxmenu="matMenu">
      <div class="aggridpopmenu">
        <table>
          <th>Company</th>
          <th>Margin</th>
          <tr>
            <td>
              <mat-checkbox
                class="dark-checkbox noborder"
                (click)="$event.stopPropagation()"
                >ABC Truck</mat-checkbox
              >
            </td>
            <td>{{ params.value }}</td>
          </tr>
          <tr>
            <td>
              <mat-checkbox
                class="dark-checkbox noborder"
                (click)="$event.stopPropagation()"
                >ABC Truck</mat-checkbox
              >
            </td>
            <td>{{ params.value }}</td>
          </tr>
          <tr>
            <td>
              <mat-checkbox
                class="dark-checkbox noborder"
                (click)="$event.stopPropagation()"
                >ABC Truck</mat-checkbox
              >
            </td>
            <td>{{ params.value }}</td>
          </tr>
          <tr>
            <td>
              <mat-checkbox
                class="dark-checkbox noborder"
                (click)="$event.stopPropagation()"
                >ABC Truck</mat-checkbox
              >
            </td>
            <td>{{ params.value }}</td>
          </tr>
          <tr>
            <td>
              <mat-checkbox
                class="dark-checkbox noborder"
                (click)="$event.stopPropagation()"
                >ABC Truck</mat-checkbox
              >
            </td>
            <td>{{ params.value }}</td>
          </tr>
        </table>
      </div>
    </mat-menu>

    <mat-menu #radiobtnmenu="matMenu">
      <div class="aggridpopmenu-checkbox">
        <mat-radio-group>
          <table>
            <th>Company</th>
            <th>Contract</th>
            <th *ngIf="isAddNew">Freight Cost</th>
            <th *ngIf="isAddNew">Freight Price</th>
            <th>Margin</th>

            <tr *ngFor="let item of radioDropdowndata; let i = index">
              <td>
                <mat-radio-button
                  value="{{ item.company + i }}"
                  class="dark-checkbox noborder"
                  (click)="$event.stopPropagation()"
                  >{{ item.company }}</mat-radio-button
                >
              </td>
              <td>{{ item.contract }}</td>
              <td *ngIf="isAddNew">{{ item.freightcost }}</td>
              <td *ngIf="isAddNew">{{ item.freightprice }}</td>
              <td>{{ item.margin }}</td>
            </tr>
            <tr *ngIf="isAddNew">
              <td>
                <mat-radio-button
                  value="new"
                  class="dark-checkbox noborder"
                  (click)="$event.stopPropagation()"
                  ><input type="text" (click)="$event.stopPropagation()"
                /></mat-radio-button>
              </td>
              <td><input type="text" (click)="$event.stopPropagation()" /></td>
              <td><input type="text" (click)="$event.stopPropagation()" /></td>
              <td><input type="text" (click)="$event.stopPropagation()" /></td>
              <td><input type="text" (click)="$event.stopPropagation()" /></td>
            </tr>
          </table>
        </mat-radio-group>
      </div>
      <div class="ag_right_btn_container">
        <a
          *ngIf="!isAddNew"
          class="ag_dropdownmenu_add_btn"
          (click)="$event.stopPropagation(); isAddNew = true"
          ><i class="material-icons">add_circle</i>Add New</a
        >
        <button
          *ngIf="isAddNew"
          mat-button
          class="blue-button ag-dropdown-proceed-btn"
        >
          Proceed
        </button>
      </div>
    </mat-menu>

    <mat-menu #dropdownlist="matMenu">
      <div *ngFor="let item of params.values">
        <button mat-menu-item>{{ item }}</button>
      </div>
    </mat-menu>

    <div *ngIf="params.type === 'grid-cell-search'">
      <div class="grid-cell-edit">
        <div>
          <input [ngModel]="params.value" class="ellipsis-with-search" />
        </div>
        <div class="searchIcon"></div>
      </div>
    </div>

    <div *ngIf="params.type === 'grid-cell-dropdown'">
      <div class="grid-cell-edit">
        <div>
          <select [ngModel]="params.value" class="ellipsis-text">
            <option *ngFor="let item of params.items">{{ item }}</option>
          </select>
        </div>
      </div>
    </div>

    <div *ngIf="params.type === 'grid-cell-edit'">
      <div class="grid-cell-edit">
        <div style="width: 100%;">
          <input
            [ngModel]="params.value"
            class="ellipsis-text"
            [ngClass]="params.classes"
          />
        </div>
      </div>
    </div>

    <div *ngIf="params.type === 'cell-edit-dropdown'">
      <div class="inline-dropdown">
        <mat-form-field
          *ngIf="params.label === 'cost-type'"
          class="mat-form-p-0"
          style="display:flex; align-items:center"
        >
          <mat-select [(ngModel)]="selectedCostType" disableOptionCentering>
            <mat-option value="{{ item }}" *ngFor="let item of params.items">{{
              item
            }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field
          *ngIf="params.label === 'rate-type'"
          class="mat-form-p-0"
          style="display:flex; align-items:center"
        >
          <mat-select [(ngModel)]="selectedRateType" disableOptionCentering>
            <mat-option value="{{ item }}" *ngFor="let item of params.items">{{
              item
            }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    <div *ngIf="params.type === 'cell-edit-autocomplete'">
      <mat-form-field class="withsearch" *ngIf="params.label === 'cost-name'">
        <input
          class="free-text-field"
          matInput
          [formControl]="myControl"
          [matAutocomplete]="autodyield"
        />
        <mat-autocomplete #autodyield="matAutocomplete" class="darkPanelAuto">
          <mat-option
            *ngFor="let option of filteredOptions | async"
            [value]="option"
          >
            {{ option }}
          </mat-option>
        </mat-autocomplete>
        <div
          class="search-img-dark"
          style="position: absolute;right: -8px;top: 13px;"
        ></div>
      </mat-form-field>
      <mat-form-field
        class="withsearch"
        *ngIf="params.label === 'service-provider'"
      >
        <input
          class="free-text-field"
          matInput
          [formControl]="myControl1"
          [matAutocomplete]="autodyield"
        />
        <mat-autocomplete #autodyield="matAutocomplete" class="darkPanelAuto">
          <mat-option
            *ngFor="let option1 of filteredOptions1 | async"
            [value]="option1"
          >
            {{ option1 }}
          </mat-option>
        </mat-autocomplete>
        <div
          class="search-img-dark"
          style="position: absolute;right: -8px;top: 13px;"
        ></div>
      </mat-form-field>
    </div>

    <div *ngIf="params.type === 'row-remove-icon'">
      <div class="remove-icon" (click)="deleteRow()"></div>
    </div>
  `,
  styles: [
    `
      .transparent-overlay {
        position: fixed;
        background-color: transparent;
        height: 100%;
        width: 100%;
        top: 0px;
        left: 0px;
        right: 0px;
        z-index: -1;
      }
      .transparent-cell {
        position: absolute;
        background-color: transparent;
        z-index: -1;
        left: -89px;
        top: -15px;
      }
    `
  ]
})
export class AGGridCellDataComponent implements ICellRendererAngularComp {
  public params: any;
  public toolTip: string;
  private lable: string;
  public bubblemessage: boolean;
  public bubblemessageerror: boolean;
  public showedit: boolean;
  public editwithunit: boolean;
  public isActive: boolean;
  public selectedMoment = new Date();
  public hovered: boolean;
  public isAddNew: boolean;
  public blueMenuIcon: boolean = false;
  public imageSource: string;
  public delimageSource: string;
  public saveBtn: boolean = true;
  public isChecked: boolean = false;
  public allowMouseLeave: boolean = true;
  public selectedCostType = 'Pay';
  public selectedRateType = 'Flat';

  range = [];
  marked = -1;
  maxScore = 5;
  public score: number = 3;
  public radioDropdowndata = [
    {
      company: 'None',
      contract: 'NA',
      freightcost: 'NA',
      freightprice: 'NA',
      margin: 'NA'
    },
    {
      company: 'BAS Transports',
      contract: 'CT-BAS-04 ',
      freightcost: '2.20 USD / GAL',
      freightprice: '2.20 USD / GAL',
      margin: '2.20 USD / GAL'
    },
    {
      company: 'XYZ Trucking',
      contract: 'CT-XYZ-04 ',
      freightcost: '1.75 USD / GAL',
      freightprice: '1.75 USD / GAL',
      margin: '1.75 USD / GAL'
    },
    {
      company: 'XYZ Trucking',
      contract: 'CT-XYZ-08 ',
      freightcost: '1.55 USD / GAL',
      freightprice: '1.55 USD / GAL',
      margin: '1.55 USD / GAL'
    },
    {
      company: 'Freight All day',
      contract: 'CT-FRH-04 ',
      freightcost: '0.75 USD / GAL',
      freightprice: '0.75 USD / GAL',
      margin: '0.75 USD / GAL'
    }
  ];

  public rowDetails = [
    { label: 'Businessline', value: 'Pipeline' },
    { label: 'Type', value: 'Contract' },
    { label: 'Buy/sell', value: 'Sell' },
    { label: 'Date', value: '12/12/2018' },
    { label: 'Counterparty', value: 'Valero' },
    { label: 'Product', value: 'Red Carb Deisil' },
    { label: 'Quantity', value: '85000 GAL' },
    { label: 'Site/Location', value: 'N0. 123 Street, ddbi Abidjan, Cameroun' },
    { label: 'Terminal', value: 'PDTC' },
    { label: 'TC Number', value: '13/04/2019' },
    { label: 'Freight Company', value: 'ABC Company' },
    { label: 'Order QtY', value: '85000 GAL' },
    { label: 'Order Product', value: 'Red Carb Deisil' },
    { label: 'Buy/sell', value: 'Sell' },
    { label: 'Counterparty', value: 'Valero' },
    { label: 'Type', value: '85000 GAL' },
    { label: 'Business Line', value: 'Contract' },
    { label: 'Product', value: 'Pipeline' },
    { label: 'Quantity', value: '3543 MT' }
  ];

  public qtyDetails = [
    { label: 'Fuel Qty', value: '0.1200111111111111111111111 BBL' },
    { label: 'Actual CI ', value: '1600' },
    { label: 'Contract CI ', value: '1400' }
  ];

  public marginDetails = [
    { label: 'Purchase Price', value: '123 USD' },
    { label: 'Sale Price ', value: '121 USD' }
  ];

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private elem: ElementRef,
    private toastr: ToastrService
  ) {}

  myControl = new FormControl();
  myControl1 = new FormControl();
  options: string[] = ['Barging', 'Barging Two', 'Barging Three'];
  options1: string[] = ['Kinder Morgan', 'ARM Fuels'];
  filteredOptions: Observable<string[]>;
  filteredOptions1: Observable<string[]>;

  ngOnInit() {
    for (var i = 0; i < this.maxScore; i++) {
      this.range.push(i);
    }

    this.myControl.setValue('Barging');
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.myControl1.setValue('ARM Fuels');
    this.filteredOptions1 = this.myControl1.valueChanges.pipe(
      startWith(''),
      map(value => this._filter1(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }
  private _filter1(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options1.filter(
      option1 => option1.toLowerCase().indexOf(filterValue) === 0
    );
  }
  handleChange() {
    this.params.node.setSelected(!this.params.node.selected);
  }
  agInit(params: any): void {
    this.params = params;
    this.toolTip = params.value;

    const image =
      this.params.data.revert === 'yes' ? 'unmatch.svg' : 'unmatch-disable.svg';
    this.imageSource = `/assets/icon/${image}`;

    const image1 =
      this.params.data.revert === 'yes' ? 'close-red.svg' : 'close-disable.svg';
    this.delimageSource = `/assets/customicons/${image1}`;
  }

  refresh(): boolean {
    return false;
  }

  public unmatch() {
    alert('Unmatched');
  }

  public showdata(data) {}
  public showICDetails() {
    //this.params.context.componentParent.showICDetails(this.params.data);
  }

  public setClass(params) {
    let styleClass = '';
    if (params.hasOwnProperty('stylemode')) {
      if (params.stylemode.indexOf('editable') >= 0)
        styleClass = styleClass + 'aggrid-editable';
    }
    if (params.hasOwnProperty('style')) {
      if (params.style.indexOf('link') >= 0)
        styleClass = styleClass + 'aggridlink';

      if (params.style.indexOf('underline') >= 0)
        styleClass = styleClass + 'aggridtextunderline';

      if (params.style.indexOf('dotbox') >= 0)
        styleClass = styleClass + 'aggrid-editable';

      if (params.style.indexOf('notification') >= 0)
        styleClass = styleClass + 'aggrid-notification';

      if (params.style.indexOf('celldisable') >= 0)
        styleClass = styleClass + 'aggrid-celldisable';
    }
    if (params.hasOwnProperty('cellClass'))
      styleClass = styleClass + params.cellClass;
    return styleClass;
  }

  pipelineTariff(value) {
    const dialogRef = this.dialog.open(PipelineTariffComponent, {
      width: '725px',
      height: '240px',
      panelClass: 'pipeline-tariff',
      data: { cost: value }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openTankDetails() {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '750px',
      height: '420px',
      panelClass: 'tank-details-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openoperationsummaryStatus() {
    //event.stopPropagation();
    const dialogRef = this.dialog.open(OperationSummaryWithStatusComponent, {
      width: '600px',
      height: '400px',
      panelClass: 'tank-details-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  movReport() {
    //debugger;
    const dialogRef = this.dialog.open(MovDetailsComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'mov-report-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  inventoryReport() {
    const dialogRef = this.dialog.open(InventoryReportPopupComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'mov-report-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openoperationsummary() {
    //event.stopPropagation();
    const dialogRef = this.dialog.open(OperationSummaryPopComponent, {
      width: '600px',
      height: '400px',
      panelClass: 'tank-details-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  viewMovement(params) {
    //console.log(params);
    var movType = this.router.url;
    var viewmovId = params.data.movementid;
    if (movType == '/movements/delivery')
      this.router.navigate(['movements/delivery/addMovement'], {
        state: { type: 'view', movId: viewmovId }
      });

    if (movType == '/movements/transfer')
      this.router.navigate(['movements/transfer/addMovement'], {
        state: { type: 'view', movId: viewmovId }
      });

    if (movType == '/movements/other')
      this.router.navigate(['movements/other/addMovement'], {
        state: { type: 'view', movId: viewmovId }
      });
  }

  deleteWarning() {
    const dialogRef = this.dialog.open(WarningDeletePopupComponent, {
      width: '368px',
      data: {
        message: 'Are you sure you want to delete the Movement?',
        toastMsg: 'Movement deleted successfully!'
      },
      //height: '240px',
      //position: { top:'25px'},
      //top: '25px',

      panelClass: ['remove-terminal-popup', 'close-btn-pos']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

    //this.current_state='confirm';
  }

  revertWarning() {
    const dialogRef = this.dialog.open(WarningDeletePopupComponent, {
      width: '368px',
      data: {
        message:
          'This action will revert the movement to planned. Do you want to proceed?',
        toastMsg: 'Movement Reverted successfully!'
      },
      panelClass: ['remove-terminal-popup', 'close-btn-pos']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteTankReport() {
    const dialogRef = this.dialog.open(WarningDeletePopupComponent, {
      width: '368px',
      data: {
        message: 'Are you sure you want to delete the Tank Report?',
        toastMsg: 'Tank Report deleted successfully!'
      },
      panelClass: ['remove-terminal-popup', 'close-btn-pos']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  cogsCalculation() {
    const dialogRef = this.dialog.open(CogsCalculationComponent, {
      width: '570px',
      //height: '240px',
      //position: { top:'25px'},
      //top: '25px',

      panelClass: ['remove-terminal-popup', 'cogs-calc']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

    //this.current_state='confirm';
  }

  openPopup() {
    const dialogRef = this.dialog.open(CellHoverDetailsComponent, {
      width: '750px',
      height: '425px',
      panelClass: 'cell-details-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public isMarked = index => {
    var ratingcount = this.params.data.rating;
    //console.log(ratingcount);
    if (this.score >= index + 1) {
      return 'check';
    } else if (this.score > index && this.score < index + 1) {
      return 'fa-star-half-o';
    } else {
      return 'uncheck';
    }
  };

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('menuTriggerToggle') menuTriggerToggle: MatMenuTrigger;
  @ViewChild('menuTriggerHover') menuTriggerHover: MatMenuTrigger;
  @ViewChild('hovermenuTrigger') hovermenuTrigger: MatMenuTrigger;
  @ViewChild('hovermenuTrigger1') hovermenuTrigger1: MatMenuTrigger;
  @ViewChild('checkboxmenuTrigger1') checkboxmenuTrigger1: MatMenuTrigger;
  @ViewChild('checkboxmenuTrigger') checkboxmenuTrigger: ElementRef;
  @ViewChild('checkbox') checkbox;
  openMenu() {
    this.menuTrigger.openMenu();
    this.hovered = true;
    console.log(this.toolTip);
  }

  freezePopupClose(ev, left) {
    //console.log(ev.parentElement);
    if (left) {
      //var  overlay11 = document.querySelector<HTMLElement>('.grey-popup');
      ev.target.parentElement.style.removeProperty('transform');
      this.hovermenuTrigger.closeMenu();
    } else {
      //var  overlay11 = document.querySelector<HTMLElement>('.grey-popup');
      ev.target.parentElement.style.removeProperty('transform');
      this.hovermenuTrigger1.closeMenu();
    }

    var overlay = document.querySelector('.cdk-overlay-container');
    setTimeout(function() {
      overlay.classList.remove('removeOverlay');
      overlay.classList.remove('halfOverlay');
    }, 1000);
  }

  freezeMenuOpened(event, left) {
    this.allowMouseLeave = false;
    event.target.classList.add('selectedIcon');
    var overlay = document.querySelector('.cdk-overlay-container');
    if (left) {
      this.hovermenuTrigger.openMenu();
      setTimeout(function() {
        overlay.classList.add('halfOverlay');
      }, 1000);

      var hovericon = Array.from(
        document.querySelectorAll<HTMLElement>('.hoverdisable')
      );
      hovericon.forEach(element => {
        element.style.pointerEvents = 'none';
      });
    } else {
      this.hovermenuTrigger1.openMenu();
      //overlay.classList.remove('halfOverlay');
      //overlay.classList.remove('movedpanel1');
      //var  overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.add('removeOverlay');
      const frameZones = Array.from(
        document.querySelectorAll('.cdk-overlay-pane')
      );
      if (frameZones.length <= 1) {
        frameZones[0].classList.add('movedpanel2');
        frameZones[0].classList.remove('movedpanel1');
        frameZones[0].classList.remove('movedpanel');
        overlay.classList.remove('halfOverlay');
      } else {
        frameZones.forEach(el => {
          frameZones[1].classList.add('movedpanel2');
          frameZones[1].classList.remove('movedpanel1');
          frameZones[1].classList.remove('movedpanel');
          overlay.classList.add('halfOverlay');
        });
      }

      //var totalPopup = Array.from(document.querySelectorAll('.cdk-overlay-connected-position-bounding-box'));

      var hovericon = Array.from(
        document.querySelectorAll<HTMLElement>('.hoverdisable1')
      );
      hovericon.forEach(element => {
        element.style.pointerEvents = 'none';
      });
    }
  }

  hoverPopupOpen(event, left) {
    // var  overlay11 = document.querySelector<HTMLElement>('.grey-popup');
    // overlay11.style.removeProperty('transform');
    event.target.classList.add('selectedIcon');
    if (left) {
      this.hovermenuTrigger.openMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.add('removeOverlay');
      var overlay1 = document.querySelector('.cdk-overlay-pane');
      overlay1.classList.add('movedpanel');
      const frameZones = Array.from(
        document.querySelectorAll('.cdk-overlay-pane')
      );
      if (frameZones.length > 1) {
        frameZones[1].classList.add('movedpanel');
      }
    } else {
      this.hovermenuTrigger1.openMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.add('removeOverlay');
      overlay.classList.add('halfOverlay');
      const frameZones = Array.from(
        document.querySelectorAll('.cdk-overlay-pane')
      );
      if (frameZones.length <= 1) {
        frameZones[0].classList.add('movedpanel1');
      } else {
        frameZones.forEach(el => {
          frameZones[1].classList.add('movedpanel1');
        });
      }
    }
    this.allowMouseLeave = true;
  }

  hoverOutPopup(left) {
    if (this.allowMouseLeave) {
      console.log('leave');
      var overlay = document.querySelector('.cdk-overlay-container');
      if (left) {
        this.hovermenuTrigger.closeMenu();
        overlay.classList.remove('removeOverlay');
        overlay.classList.remove('halfOverlay');
      } else {
        this.hovermenuTrigger1.closeMenu();
        overlay.classList.remove('removeOverlay');
        overlay.classList.remove('halfOverlay');
      }
    }
  }

  freezeMenuClosed(event, left) {
    //alert("kk");
    let panels = this.elem.nativeElement.querySelectorAll('.hover-menu-icon');
    panels.forEach(element => {
      element.classList.remove('selectedIcon');
    });
    if (left) {
      var hovericon = Array.from(
        document.querySelectorAll<HTMLElement>('.hoverdisable')
      );
      hovericon.forEach(element => {
        element.style.pointerEvents = 'auto';
        //overlay.classList.remove('halfOverlay');
        //overlay.classList.remove('removeOverlay');
      });
    } else {
      var hovericon = Array.from(
        document.querySelectorAll<HTMLElement>('.hoverdisable1')
      );
      hovericon.forEach(element => {
        element.style.pointerEvents = 'auto';
        //overlay.classList.remove('halfOverlay');
        //overlay.classList.remove('removeOverlay');
      });
    }
    var overlay = document.querySelector('.cdk-overlay-container');
    var totalPopup = Array.from(
      document.querySelectorAll('.cdk-overlay-connected-position-bounding-box')
    );
    if ((totalPopup.length = 1)) {
      overlay.classList.add('halfOverlay');
      overlay.classList.add('removeOverlay');
    }
  }

  hoverMenu(event) {
    event.target.classList.add('selectedIcon');
    this.menuTriggerHover.openMenu();
  }

  toggleMenu(event) {
    //console.log(this.hovermenuTrigger);
    //console.log(this.menuTriggerToggle);
    // var  overlay = document.querySelector('.cdk-overlay-container');
    // overlay.classList.remove('fullOverlay');

    event.target.classList.add('selectedIcon');

    if (this.hovermenuTrigger != undefined) this.hovermenuTrigger.openMenu();

    if (this.menuTriggerToggle != undefined) this.menuTriggerToggle.openMenu();

    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('fullOverlay');
    overlay.classList.add('removeOverlay');
    var overlay1 = document.querySelector('.cdk-overlay-pane');
    overlay1.classList.add('movedpanel');
  }

  toggleMenu2() {
    //this.hovermenuTrigger.closeMenu();
    //alert("s");
    if (this.hovermenuTrigger != undefined) this.hovermenuTrigger.closeMenu();

    if (this.menuTriggerToggle != undefined) this.menuTriggerToggle.closeMenu();

    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
  }

  toggleMenu1(event) {
    //alert("kk");
    let panels = this.elem.nativeElement.querySelectorAll('.hover-menu-icon');
    panels.forEach(element => {
      element.classList.remove('selectedIcon');
    });
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    var overlay1 = document.querySelector('.cdk-overlay-pane');
    overlay1.classList.remove('movedpanel');
  }

  menuClosed() {
    this.hovered = false;
  }

  closeMenu() {
    this.menuTrigger.closeMenu();
  }

  hoverOpenMenu() {
    if (this.params.value !== 'Fixed') {
      this.menuTrigger.openMenu();
    }
  }

  public transparentCell_height;
  public transparentCell_width;

  hoverOpenMenu_with_autohide(evt) {
    var findCell = true;
    var element = evt.target;
    while (findCell) {
      if (element.attributes.class.value.indexOf('ag-cell') > -1) {
        findCell = false;
        this.transparentCell_height = element.clientHeight;
        this.transparentCell_width = element.clientWidth;
        if (this.params.value !== 'Fixed') {
          this.menuTrigger.openMenu();
        }

        return;
      } else {
        element = element.parentElement;
        if (element == null) {
          findCell = false;
          return;
        }
      }
    }
  }

  emptyOpenMenu() {
    if (this.params.value !== '-') {
      this.menuTrigger.openMenu();
    }
  }

  // shiptech on hover popup:

  hoverToggleOpen(event) {
    this.hovered = true;
    this.menuTrigger.openMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    //console.log(overlay);
    overlay.classList.add('removeOverlay');
    var overlay1 = document.querySelector('.cdk-overlay-pane');
    //console.log(overlay);
    overlay1.classList.add('movedpanel');
  }

  hoverToggleClose() {
    this.hovered = false;
    this.menuTrigger.closeMenu();
    //alert("s");
    var overlay = document.querySelector('.cdk-overlay-container');
    //console.log(overlay);
    overlay.classList.remove('removeOverlay');
  }

  hoverActiveIcon(event) {}

  clickMenuOpened() {
    this.blueMenuIcon = true;
  }

  clickMenuClosed() {
    this.blueMenuIcon = false;
  }
  openOperationSummarywithoutaddnewComponent() {
    const dialogRef = this.dialog.open(OperationSummaryWithoutaddnewComponent, {
      width: '600px',
      height: '400px',
      panelClass: 'OperationSummaryWithoutaddnew-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  checkValue(event: any) {
    //console.log(event);
    this.checkboxmenuTrigger1.openMenu;
    if (event == 'A') {
      (<HTMLElement>document.querySelector('.saveBtn')).removeAttribute(
        'disabled'
      );
      setTimeout(function() {
        //alert("");
        (<HTMLElement>(
          document.querySelector('.menucheckboxpopup')
        )).style.display = 'none';
        //this.checkboxmenuTrigger1.closeMenu();
      }, 3000);
    } else {
      (<HTMLElement>document.querySelector('.saveBtn')).setAttribute(
        'disabled',
        'disabled'
      );
      (<HTMLElement>(
        document.querySelector('.menucheckboxpopup')
      )).style.display = 'none';
      this.checkboxmenuTrigger1.closeMenu;
    }
  }

  deleteRow() {
    let rowData = [];
    this.params.api.forEachNode(node => rowData.push(node.data));
    var selectedData = this.params.api.getSelectedRows();
    let index = this.params.node.rowIndex;
    let newData = [];
    newData = rowData.splice(index, 1);
    this.params.api.applyTransaction({ remove: newData });
    //this.params.api.node.setSelected(true);
    //this.params.api.forEachNode(node=> node.rowIndex ? 0 : node.setSelected(true))
    //console.log(this.params);
    //console.log(this.params.api.getRenderedNodes()[0].data);

    //console.log(rowData);
    //console.log(this.params.rowIndex);

    // this.params.api.applyTransaction({ remove: selectedData });
    // console.log(this.params);
    // console.log("sssss");
    // console.log(selectedData);

    //console.log(rowData);
    //this.params.api.removeItems(newData);
    //const firstRow = this.params.api.getRenderedNodes()[index].data;

    //this.params.api.setRowData(rowData);
    //this.params.api.redrawRows();
  }
}
