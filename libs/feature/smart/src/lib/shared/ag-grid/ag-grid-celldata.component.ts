import { Component, ViewChild, ElementRef, Input } from "@angular/core";
import { AppConfig } from '@shiptech/core/config/app-config';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatInput } from '@angular/material/input';
import { LocalService } from '../../services/local-service.service';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs'
import moment  from 'moment';
import { SaveBunkeringPlanAction,UpdateBunkeringPlanAction } from "../../store/bunker-plan/bunkering-plan.action";
const today = new Date();

@Component({
  selector: 'aggrid-cell-data',
  templateUrl: './ag-grid-celldata.component.html'
})

export class AGGridCellDataComponent implements ICellRendererAngularComp {
  public params: any;
  public toolTip: string;
  public data;
  public menuData;
  public menuClick: boolean;
  public showInfoIcon: boolean;
  public enableSave: boolean;
  public usercomments;
  public isChecked;
  public theme:boolean = true;
  public etaDays: any;
  public etaInTime: any;
  public etdDays: any;
  public etdInTime: any;
  public shiptechPortUrl: string;
  public shiptechOrderUrl: string = "shiptechUrl/#/masters/order";
  public _changeCurrentROBObj$: any;
  @Input('bplanType') 
  public set bplanType(v : any) {
    this.bplanType = v;
  };
  @Input('selectedUserRole') 
  public set selectedUserRole(v : any) {
    this.selectedUserRole = v;
  };
  @Input('editableCell')public set editableCell(v : any) {
    this.editableCell = v;
  };
  constructor(public router: Router, public dialog: MatDialog, private elem: ElementRef,private localService:LocalService,private appConfig: AppConfig, 
              private bunkerPlanService:BunkeringPlanService,private store: Store ) {
    this.shiptechPortUrl = this.appConfig.v1.API.BASE_HEADER_FOR_NOTIFICATIONS;
  }

  ngOnInit() {
    this.localService.themeChange.subscribe(value => this.theme = value);
    this.bunkerPlanService._changeCurrentROBObj$.subscribe(res => this._changeCurrentROBObj$ = res)
  }

  agInit(params: any): void {
    this.params = params;
    this.menuData = params.value;
    this.isChecked = params.value;
    this.toolTip = params.value;
  //**ETA/ETD date format and days calculation
  if(this.params?.data){
    this.params.data.eta_date = moment(params.data?.eta_date).format("YYYY-MM-DD hh:mm");
    this.etaInTime = today.getTime() - new Date(params.data?.eta_date).getTime();
    this.etaDays = (this.etaInTime/(1000 * 3600 * 24)).toFixed(0);
    this.params.data.etd_date = moment(params.data?.etd_date).format("YYYY-MM-DD hh:mm");
    this.etdInTime = today.getTime() - new Date(params.data?.etd_date).getTime();
    this.etdDays = (this.etdInTime/(1000 * 3600 * 24)).toFixed(0);
  }
    this.setCellClass(params);
    
  }

  refresh(): boolean {
    return false;
  }
  setCellClass(params){
    switch(params.colDef?.field){
      case 'hsfo_max_lift' :{
                              var classArray: string[] = [];
                              let newClass;
                              if(params.data?.hsfo_max_lift_color === 'G')
                                newClass = 'aggrid-cell-color darkgreen';
                              else if(params.data?.hsfo_max_lift_color === 'M')
                                newClass = 'aggrid-cell-color magenta';
                              else
                                newClass = 'aggrid-cell-color brown';

                              classArray.push(newClass);
                              params.cellClass =  classArray.length > 0 ? classArray : null
                              break;
                            }
      case 'hsfo_estimated_consumption' :{
                                              var classArray: string[] = [];
                                              let newClass;
                                              if(params.data?.hsfo_est_consumption_color === 'G')
                                                newClass = 'aggrid-cell-color darkgreen';
                                              else if(params.data?.hsfo_est_consumption_color === 'M')
                                                newClass = 'aggrid-cell-color magenta';
                                              else
                                                newClass = 'aggrid-cell-color brown';

                                              classArray.push(newClass);
                                            params.cellClass =  classArray.length > 0 ? classArray : null
                                            break;
                                      }
      case 'eca_estimated_consumption' :{
                                              var classArray: string[] = [];
                                              let newClass;
                                              if(params.data?.ulsfo_est_consumption_color === 'G')
                                                newClass = 'aggrid-cell-color darkgreen';
                                              else if(params.data?.ulsfo_est_consumption_color === 'M')
                                                newClass = 'aggrid-cell-color magenta';
                                              else
                                                newClass = 'aggrid-cell-color brown';

                                              classArray.push(newClass);
                                            params.cellClass =  classArray.length > 0 ? classArray : null
                                            break;
                                      }
      case 'ulsfo_max_lift' :{
                                      var classArray: string[] = [];
                                      let newClass;
                                      if(params.data?.ulsfo_max_lift_color === 'G')
                                        newClass = 'aggrid-cell-color darkgreen';
                                      else if(params.data?.ulsfo_max_lift_color === 'M')
                                        newClass = 'aggrid-cell-color magenta';
                                      else
                                        newClass = 'aggrid-cell-color brown';

                                      classArray.push(newClass);
                                    params.cellClass =  classArray.length > 0 ? classArray : null
                                    break;
                              }
      case 'lsdis_max_lift' :{
                                    var classArray: string[] = [];
                                    let newClass;
                                    if(params.data?.lsdis_max_lift_color === 'G')
                                      newClass = 'aggrid-cell-color darkgreen';
                                    else if(params.data?.lsdis_max_lift_color === 'M')
                                      newClass = 'aggrid-cell-color magenta';
                                    else
                                      newClass = 'aggrid-cell-color brown';

                                    classArray.push(newClass);
                                  params.cellClass =  classArray.length > 0 ? classArray : null
                                  break;
                            }
      case 'lsdis_estimated_consumption' : {
                                                var classArray: string[] = [];
                                                let newClass;
                                                if(params.data?.lsdis_est_consumption_color === 'G')
                                                  newClass = 'aggrid-cell-color darkgreen';
                                                else if(params.data?.lsdis_est_consumption_color === 'M')
                                                  newClass = 'aggrid-cell-color magenta';
                                                else
                                                  newClass = 'aggrid-cell-color brown';

                                                classArray.push(newClass);
                                              params.cellClass =  classArray.length > 0 ? classArray : null
                                              break;
                                        }
      case 'hsfo_estimated_lift' :{
                                    var classArray: string[] = ['pd-6'];
                                    let newClass;
                                    if(params.data?.order_id_hsfo && !params.data?.request_id_hsfo){
                                      newClass = 'aggrid-link-bplan aggrid-red-cell'
                                      classArray.push(newClass);
                                    }
                                    else if(params.data?.request_id_hsfo && !params.data?.order_id_hsfo){
                                      newClass = 'aggrid-link-bplan aggrid-blue-cell';
                                      classArray.push(newClass);
                                    }
                                    params.cellClass =  classArray.length > 0 ? classArray : null
                                    break;
                                  }
      case 'ulsfo_estimated_lift':{
                                      var classArray: string[] = ['pd-6'];
                                      let newClass;
                                      if(params.data?.order_id_ulsfo && !params.data?.request_id_ulsfo){
                                        newClass = 'aggrid-link-bplan aggrid-red-cell'
                                        classArray.push(newClass);
                                      }
                                      else if(params.data?.request_id_ulsfo && !params.data?.order_id_ulsfo){
                                        newClass = 'aggrid-link-bplan aggrid-blue-cell';
                                        classArray.push(newClass);
                                      }
                                      params.cellClass =  classArray.length > 0 ? classArray : null
                                      break;
                                  }
      case 'lsdis_estimated_lift':{
                                    var classArray: string[] = ['pd-6'];
                                    let newClass;
                                    if(params.data?.order_id_lsdis && !params.data?.request_id_lsdis){
                                      newClass = 'aggrid-link-bplan aggrid-red-cell'
                                      classArray.push(newClass);
                                    }
                                    else if(params.data?.request_id_lsdis && !params.data?.order_id_lsdis){
                                      newClass = 'aggrid-link-bplan aggrid-blue-cell';
                                      classArray.push(newClass);
                                    }
                                    params.cellClass =  classArray.length > 0 ? classArray : null
                                    break;
                                  }
      case 'hsdis_estimated_lift':{
                                    var classArray: string[] = ['pd-6'];
                                        let newClass;
                                        if(params.data?.order_id_hsdis && !params.data?.request_id_hsdis){
                                          newClass = 'aggrid-link-bplan aggrid-red-cell'
                                          classArray.push(newClass);
                                        }
                                        else if(params.data?.request_id_hsdis && !params.data?.order_id_hsdis){
                                          newClass = 'aggrid-link-bplan aggrid-blue-cell';
                                          classArray.push(newClass);
                                        }
                                        params.cellClass =  classArray.length > 0 ? classArray : null
                                        break;
                                    }
      case 'hsfo_safe_port':
      case 'eca_safe_port':{
                                var classArray: string[] = [];
                                let newClass = 'aggrid-cell-color lightgreen'
                                classArray.push(newClass);
                                params.cellClass = classArray ;
                                if(params?.value == 0)
                                  params.value = '';
                                params.cellClass =  classArray.length > 0 ? classArray : null
                                break;
                            }
                            
    }
    
  }

  // @HostListener('document:click', ['$event']) clickout(event) {
  //     document.onclick = (args: any) : void => {
  //         if(args.target.tagName === 'BODY') {
  //             this.infomenuTrigger.closeMenu();
  //         }
  //     }
  //   }
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('infomenuTrigger') infomenuTrigger: MatMenuTrigger;
  @ViewChild('inputMenuTrigger') inputMenuTrigger: MatMenuTrigger;



  toggleMenuInfo(event, data) {//onenter
    this.infomenuTrigger.openMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.add('removeOverlay');
  }

  toggleMenu2Info() {//onleave
    this.cancelMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
  }

  toggleMenu3Info(event) { //onclick
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.infomenuTrigger.openMenu();
    event.target.classList.add('clicked');
    this.menuClick = true;

  }
  cancelMenu() {
    this.infomenuTrigger.closeMenu();
    this.menuClick = false;
    let panels = this.elem.nativeElement.querySelectorAll('.info-i');
    panels.forEach((element) => {
      element.classList.remove('clicked');
    });
  }
  toggleMenu1Input(event) {//onmenuclose
    this.menuClick = false;
    this.enableSave = false;

  }
  toggleMenuInput(column) {//onenter
    let commentType;
    switch(column){
      case 'eca_min_sod': {commentType = 'eca_sod_comment'; break;}
      case 'hsfo_min_sod':{commentType = 'hsfo_sod_comment'; break;}
      case 'max_sod': {commentType = 'max_sod_comment'; break;}
      case 'min_sod': {commentType = 'min_sod_comment'; break;}
    }
    if (this.params.data[commentType] && this.params.data[commentType] != '') {
      this.inputMenuTrigger.openMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.add('removeOverlay');
    }
  }

  toggleMenu2Input() {//onleave
    if (this.inputMenuTrigger.menuOpen) {
      this.inputMenuTrigger.closeMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');
    }
  }

  toggleMenu3Input(event) { //onclick
    this.menuClick = true;
    this.inputMenuTrigger.openMenu();
    if (document.getElementById('inputValue')) {
      document.getElementById('inputValue').focus();
    }

  }

  toggleMenuCheckbox(event,params) {//onenter
    if(params?.colDef?.field == 'is_min_soa'){
      let comments = params?.data?.min_soa_comment;

      if (comments && comments != '') {
        var overlay = document.querySelector('.cdk-overlay-container');
        if (overlay)
          overlay.classList.add('removeOverlay');
        this.inputMenuTrigger.openMenu();
      }
      if ((event.pageY + 201 > (window.innerHeight + event.offsetY))) {
        setTimeout(() => {
          const panels = document.querySelector('.edit-checkbox-menu');
          if (panels)
            panels.classList.add('hover-popup-pos');
        }, 0);
      }
    }
  }

  toggleMenu2Checkbox() {//onleave
    if (this.inputMenuTrigger.menuOpen) {
      //setTimeout(() => {
      //this.menuClick = false;
      this.inputMenuTrigger.closeMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');

      // },1000);
    }
  }

  toggleMenu3Checkbox(event) { //onclick
    var overlay = document.querySelector('.cdk-overlay-container');
    if (overlay)
      overlay.classList.remove('removeOverlay');
    this.menuClick = true;
    this.inputMenuTrigger.openMenu();
    if ((event.pageY + 201 > (window.innerHeight + event.offsetY))) {
      setTimeout(() => {
        const panels = document.querySelector('.edit-checkbox-menu');
        if (panels)
          panels.classList.add('hover-popup-pos');
      }, 0);
    }

  }
  getComments(column){
    let commentType;
    switch(column){
      case 'eca_min_sod': {commentType = 'eca_sod_comment'; break;}
      case 'hsfo_min_sod':{commentType = 'hsfo_sod_comment'; break;}
      case 'max_sod': {commentType = 'max_sod_comment'; break;}
      case 'min_sod': {commentType = 'min_sod_comment'; break}
      case 'is_min_soa': {commentType = 'min_soa_comment'; break;}
    }
      return this.params.data[commentType];
  }
  portClicked(param) {
    this.params.context.componentParent.portClicked(param);
  }

  toggleOperAck() {
    this.params.context.componentParent.toggleOperAck();
  }
  triggerChangeEvent() {
    this.params.context.componentParent.triggerChangeEvent();
  }
  onCheckboxClick(check,comment) {
    if (comment != "")
      this.enableSave = true;
    if(check == false && comment =="")
      this.enableSave = true;
    else
      this.enableSave = false;
  }
  onEditCell(value,comment) {
    if (comment!= "")
      this.enableSave = true;
    else if(value == "" || value == false && comment =="")
      this.enableSave = true;
    else
      this.enableSave = false;
  }
  saveUserComment(comment){
    this.usercomments = comment;
  }

  saveInput(value,params,column) {
    let commentType;
    switch(column){
      case 'eca_min_sod': {commentType = 'eca_sod_comment'; break;}
      case 'hsfo_min_sod':{commentType = 'hsfo_sod_comment'; break;}
      case 'max_sod': {commentType = 'max_sod_comment'; break;}
      case 'min_sod': {commentType = 'min_sod_comment'; break;}
    }
    if (params.value != value || this.params?.data[commentType] != this.usercomments) {
      this.showInfoIcon = true;
      this.params.value = value;
      this.params.data[commentType] = this.usercomments;
    }
    this.menuClick = false;
    this.enableSave = false;
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.inputMenuTrigger.closeMenu();
    this.triggerChangeEvent();
    // Update store with Field popup value
    this.store.dispatch(new UpdateBunkeringPlanAction(this.params?.value, this.params?.colDef?.field, this.params.data?.detail_no))
    // Update store with Field popup comment
    this.store.dispatch(new UpdateBunkeringPlanAction(this.params?.data[commentType], commentType, this.params.data?.detail_no))
  }
  saveCheckbox(params) {
    let comments;
    let column = params?.colDef?.field;
    if(column == 'is_min_soa'){
        let commentType = 'min_soa_comment';
        comments = params?.data?.min_soa_comment; 
      if (params.value != this.isChecked || comments != this.usercomments) {
        this.showInfoIcon = true;
        this.params.value = this.isChecked == true? 1:0;
        if(this.params?.data)
        this.params.data[commentType] = this.usercomments;
      }
      this.menuClick = false;
      this.enableSave = false;
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');
      this.inputMenuTrigger.closeMenu();
      this.triggerChangeEvent();
      // Update store with Field popup value
      this.store.dispatch(new UpdateBunkeringPlanAction(this.params?.value, this.params?.colDef?.field, this.params.data?.detail_no))
      // Update store with Field popup comment
      this.store.dispatch(new UpdateBunkeringPlanAction(this.params?.data[commentType], commentType, this.params.data?.detail_no))
    }
  }
  cancel() {
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.inputMenuTrigger.closeMenu();
    this.menuClick = false;
    this.enableSave = false;
  }

  closeInfoPopup() {
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.infomenuTrigger.closeMenu();
    this.menuClick = false;
    let panels = this.elem.nativeElement.querySelectorAll('.info-i');
    panels.forEach((element) => {
      element.classList.remove('clicked');
    });
  }

  consUpdatedEvent(params,value){
    this.params.context.componentParent.consUpdatedEvent(params,value);
  }

  updateSOA(value){
    this.params.data.hsfo_soa = 4444;
  }
}
@Component({
  selector: 'hover-menu',
  template: `
  <div *ngIf="items" style="display:flex;flex-wrap:wrap;" #menuTrigger="matMenuTrigger" [matMenuTriggerFor]="hoverTitle"
  (mouseenter)="toggleMenu($event);" (mouseleave)="toggleMenu2();">
  <div *ngFor="let item of items" class="aggrid-content-center dark-multiple-text" >
  <div class=" aggrid-text-resizable"  >{{item}}</div>
          </div>
          <mat-menu class="outstanding-req-menu" #hoverTitle="matMenu" xPosition="after"  style="position: relative;bottom: 15px;left: 66px;">
          <div class="hover-tooltip" *ngFor="let item of items" [ngClass]="{'dark-theme':theme,'light-theme':!theme}">
              <table>
                <tr class="hover-title">
                  <td>{{item}}</td>
                  <td class="hover-value">350 BBLS</td>
                </tr>
                <tr class="hover-title">
                  <td>Request Date</td>
                  <td class="hover-value">12/09/2020</td>
                </tr>
              </table>
          </div>
        </mat-menu>
</div>
  
  `
})
export class HoverMenuComponent {
  @Input('items') items;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  public theme:boolean = true;
  constructor(private elem: ElementRef,private localService: LocalService) { }

  ngOnInit(){
    this.localService.themeChange.subscribe(value => this.theme = value);
  }

  toggleMenu(event) {//onenter
    this.menuTrigger.openMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.add('removeOverlay');

  }

  toggleMenu2() {//onleave
    this.menuTrigger.closeMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');

  }
}