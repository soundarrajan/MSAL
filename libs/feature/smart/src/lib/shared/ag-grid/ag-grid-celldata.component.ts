import { Component, ViewChild, ElementRef, Input } from "@angular/core";
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatInput } from '@angular/material/input';
import { LocalService } from '../../services/local-service.service';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { Store } from '@ngxs/store';
import moment  from 'moment';
import { SaveBunkeringPlanAction,UpdateBunkeringPlanAction } from "../../store/bunker-plan/bunkering-plan.action";
import { UpdateBplanTypeState, SaveBunkeringPlanState } from "../../store/bunker-plan/bunkering-plan.state";
import { WarningoperatorpopupComponent } from '../warningoperatorpopup/warningoperatorpopup.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
const today = new Date();

@Component({
  selector: 'aggrid-cell-data',
  templateUrl: './ag-grid-celldata.component.html'
})

export class AGGridCellDataComponent implements ICellRendererAngularComp {
  moment: any = moment;
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
  public shiptechUrl: string ;
  public bplanType: any;
  public tooltipMessage : string = "";
  public isOperatorAck : boolean = false;
  @Input('selectedUserRole') 
  public set selectedUserRole(v : any) {
    this.selectedUserRole = v;
  };
  @Input('editableCell')public set editableCell(v : any) {
    this.editableCell = v;
  };
  constructor(public router: Router, public dialog: MatDialog, private elem: ElementRef,private localService:LocalService, 
              private bunkerPlanService:BunkeringPlanService,private store: Store ) {
    this.shiptechUrl =  new URL(window.location.href).origin;;
    this.shiptechPortUrl = `${this.shiptechUrl}/#/masters/location/edit/`
  }

  ngOnInit() {
    this.localService.themeChange.subscribe(value => this.theme = value);
  }

  agInit(params: any): void {
    this.params = params;
    this.menuData = params.value;
    this.isChecked = params.value;
    this.toolTip = params.value;
  //**ETA/ETD date format and days calculation
  if(this.params?.data){
    this.params.data.eta_date = moment.utc(params.data?.eta_date).format("YYYY-MM-DD hh:mm");
    //this.etaInTime = today.getTime() - new Date(params.data?.eta_date).getTime();
    //this.etaDays = (this.etaInTime/(1000 * 3600 * 24)).toFixed(0);
    this.params.data.etd_date = moment.utc(params.data?.etd_date).format("YYYY-MM-DD hh:mm");
    //this.etdInTime = today.getTime() - new Date(params.data?.etd_date).getTime();
    //this.etdDays = (this.etdInTime/(1000 * 3600 * 24)).toFixed(0);

    //to get Operator Ack.
    this.isOperatorAck = params.data?.is_new_port == 'Y' ? true : (params.data?.operator_ack == 1 ? true : false) ;
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
                                newClass = 'aggrid-cell-color mediumred';
                              else if(params.data?.hsfo_max_lift_color === 'B')
                                newClass = 'aggrid-cell-color brown';
                              else
                                newClass = 'aggrid-cell-color white';

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
                                                newClass = 'aggrid-cell-color mediumred';
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
                                                newClass = 'aggrid-cell-color mediumred';
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
                                        newClass = 'aggrid-cell-color mediumred';
                                      else if(params.data?.ulsfo_max_lift_color === 'B')
                                        newClass = 'aggrid-cell-color brown';
                                      else
                                        newClass = 'aggrid-cell-color white';

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
                                      newClass = 'aggrid-cell-color mediumred';
                                      else if(params.data?.lsdis_max_lift_color === 'B')
                                      newClass = 'aggrid-cell-color brown';
                                    else
                                      newClass = 'aggrid-cell-color white';

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
                                                  newClass = 'aggrid-cell-color mediumred';
                                                else
                                                  newClass = 'aggrid-cell-color brown';

                                                classArray.push(newClass);
                                              params.cellClass =  classArray.length > 0 ? classArray : null
                                              break;
                                        }
      case 'hsfo_estimated_lift' :{
                                    var classArray: string[] = ['pd-6'];
                                    let newClass;
                                    if(params.data?.order_id_hsfo && params.data?.is_alt_port_hsfo != 'N'){
                                      newClass = 'aggrid-link-bplan aggrid-red-cell'
                                      classArray.push(newClass);
                                    }
                                    else if(params.data?.request_id_hsfo && !params.data?.order_id_hsfo && params.data?.is_alt_port_hsfo != 'N'){
                                      newClass = 'aggrid-link-bplan aggrid-blue-cell';
                                      classArray.push(newClass);
                                    }
                                    params.cellClass =  classArray.length > 0 ? classArray : null
                                    break;
                                  }
      case 'ulsfo_estimated_lift':{
                                      var classArray: string[] = ['pd-6'];
                                      let newClass;
                                      if(params.data?.order_id_ulsfo && params.data?.is_alt_port_ulsfo != 'N'){
                                        newClass = 'aggrid-link-bplan aggrid-red-cell'
                                        classArray.push(newClass);
                                      }
                                      else if(params.data?.ulsfo_estimated_lift && params.data?.request_id_ulsfo && !params.data?.order_id_ulsfo && params.data?.is_alt_port_ulsfo != 'N'){
                                        newClass = 'aggrid-link-bplan aggrid-blue-cell';
                                        classArray.push(newClass);
                                      }
                                      params.cellClass =  classArray.length > 0 ? classArray : null
                                      break;
                                  }
      case 'lsdis_estimated_lift':{
                                    var classArray: string[] = ['pd-6'];
                                    let newClass;
                                    if(params.data?.order_id_lsdis && params.data?.is_alt_port_lsdis != 'N'){
                                      newClass = 'aggrid-link-bplan aggrid-red-cell'
                                      classArray.push(newClass);
                                    }
                                    else if(params.data?.lsdis_estimated_lift && params.data?.request_id_lsdis && !params.data?.order_id_lsdis && params.data?.is_alt_port_lsdis != 'N'){
                                      newClass = 'aggrid-link-bplan aggrid-blue-cell';
                                      classArray.push(newClass);
                                    }
                                    params.cellClass =  classArray.length > 0 ? classArray : null
                                    break;
                                  }
      case 'hsdis_estimated_lift':{
                                    var classArray: string[] = ['pd-6'];
                                        let newClass;
                                        if(params.data?.order_id_hsdis && params.data?.is_alt_port_hsdis != 'N'){
                                          newClass = 'aggrid-link-bplan aggrid-red-cell'
                                          classArray.push(newClass);
                                        }
                                        else if(params.data?.hsdis_estimated_lift && params.data?.request_id_hsdis && !params.data?.order_id_hsdis && params.data?.is_alt_port_hsdis != 'N'){
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


  toggleMenu(event) {
    //onenter
    // this.menuTrigger.openMenu();
    var overlay = document.querySelector(".cdk-overlay-container");
    overlay.classList.add("removeOverlay");
  }

  toggleMenu2() {
    //onleave
    this.menuClick = false;
    this.menuTrigger.closeMenu();
    var overlay = document.querySelector(".cdk-overlay-container");
    overlay?.classList.remove("removeOverlay");
  }

  triggerOnClick(event) {
    //onclick
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.menuClick = true;
    this.menuTrigger.openMenu();
  }

  toggleMenuInfo(event, data?:any) {//onenter
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
  checkLsdis(field){
    if(field == 'lsdis_estimated_consumption' || field == 'eca_estimated_consumption'){
      if(this.params?.data){
        if(this.params?.data?.lsdis_as_eca > 0){
          if(field == 'lsdis_estimated_consumption')
            this.tooltipMessage = `${this.params.data.lsdis_as_eca}` +" MT. of estimated consumption of low sulphur distillate from previous port to this port, covers ECA consumption"
          else
            this.tooltipMessage = "Estimated consumption of ECA bunker from previous port to this port, is covered by "+ `${this.params.data.lsdis_as_eca}` +" MT low Sulphur distillate."
          
          return true;
        }
        else{
          // this.tooltipMessage = "testing";
          return false;
        }
          
      }

    }
    if(field=="")
        return false;
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
    this.bplanType = this.store.selectSnapshot(UpdateBplanTypeState.getBplanType);
    switch(column){ //get respective comment fields 
      case 'eca_min_sod': {commentType = 'eca_sod_comment'; break;}
      case 'hsfo_min_sod':{commentType = 'hsfo_sod_comment'; break;}
      case 'max_sod': {commentType = 'max_sod_comment'; break;}
      case 'min_sod': {commentType = 'min_sod_comment'; break;}
    }
    if (this.params.data[commentType] && this.params.data[commentType] != '') {
      if(this.bplanType =='C'){
        this.inputMenuTrigger.openMenu();
        var overlay = document.querySelector('.cdk-overlay-container');
        overlay.classList.add('removeOverlay');
      }
      else if(this.params.value !=0 || this.params.data[commentType] != ''){ 
        //dont display popup for prev bplan or view all bplan if value = 0 and no comments exist
        this.inputMenuTrigger.openMenu();
        var overlay = document.querySelector('.cdk-overlay-container');
        overlay.classList.add('removeOverlay');
      }
      
    }
  }

  toggleMenu2Input() {//onleave
    if (this.inputMenuTrigger.menuOpen) {
      this.inputMenuTrigger.closeMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');
    }
  }

  toggleMenu3Input(event,field) { //onclick
    this.bplanType = this.store.selectSnapshot(UpdateBplanTypeState.getBplanType);
    let requestExists = 0;

    // if(this.bplanType == 'C'){
    //   this.menuClick = true;
    //   this.inputMenuTrigger.openMenu();
    //   if (document.getElementById('inputValue')) {
    //     document.getElementById('inputValue').focus();
    //   }
    // }
    
    if(this.bplanType == 'C'){
      //warning if previous ports have a request ID present
      let bPlanData = this.store.selectSnapshot(SaveBunkeringPlanState.getBunkeringPlanData);
      if(this.params.data.detail_no){

        let selectedPlanIndex = bPlanData.findIndex(data => data.detail_no == this.params.data.detail_no)
          for( let i = 0; i <= selectedPlanIndex ; i++){
            switch(field){
              case 'hsfo_min_sod' : {
                                      if(bPlanData[i]?.request_id_hsfo != ""){
                                        requestExists = 1; 
                                      }
                                      break;
                                    }
              case 'eca_min_sod' :{
                                    if(bPlanData[i]?.request_id_lsdis == "" && bPlanData[i]?.request_id_ulsfo == ""){
                                      requestExists = 0; 
                                    }
                                    else{
                                      requestExists = 1; 
                                    }
                                    break;
                                  }
              default :{
                          if(bPlanData[i]?.request_id_hsdis == "" && bPlanData[i]?.request_id_hsfo == "" && bPlanData[i]?.request_id_lsdis == "" && bPlanData[i]?.request_id_ulsfo == ""){
                            requestExists = 0; 
                          }
                          else{
                            requestExists = 1; 
                          }
                          break;
                        }
            }
            
            if( requestExists == 1)
              break;
          }

          if(requestExists === 1){
            var overlay = document.querySelector('.cdk-overlay-container');
            overlay.classList.remove('removeOverlay');
            const confirmMessage = 'Please note that there is a request in Shiptech for a prior call which BOPS will only modify next time the plan optimized, and the trader may nominate it before if no action is taken. In case it needs to be adjusted or cancelled please do so or advise responsible party.';
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                panelClass: 'confirmation-popup-operator', 
                data:  { message: confirmMessage }
              });

              dialogRef.afterClosed().subscribe(result => {
                console.log(result);
                if(result) {
                  this.menuClick = true;
                  this.inputMenuTrigger.openMenu();
                    if (document.getElementById('inputValue')) {
                      document.getElementById('inputValue').focus();
                    }
                } 
                else {
                
                }
              });
          }
          else{
            this.menuClick = true;
            this.inputMenuTrigger.openMenu();
              if (document.getElementById('inputValue')) {
                document.getElementById('inputValue').focus();
              }
          }
          
      }
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
    
    // this.bplanType = this.store.selectSnapshot(UpdateBplanTypeState.getBplanType);
    // if(this.bplanType == 'C'){
    //   this.menuClick = true;
    //   this.inputMenuTrigger.openMenu();
    //   if ((event.pageY + 201 > (window.innerHeight + event.offsetY))) {
    //     setTimeout(() => {
    //       const panels = document.querySelector('.edit-checkbox-menu');
    //       if (panels)
    //         panels.classList.add('hover-popup-pos');
    //     }, 0);
    //   }
    // }
    this.bplanType = this.store.selectSnapshot(UpdateBplanTypeState.getBplanType);
    if(this.bplanType == 'C'){
      let requestExists = 0;
      //min SOA  warning if previous ports have a request ID present
      let bPlanData = this.store.selectSnapshot(SaveBunkeringPlanState.getBunkeringPlanData);
        if(this.params.data.detail_no){

          let selectedPlanIndex = bPlanData.findIndex(data => data.detail_no == this.params.data.detail_no)
            for( let i = 0; i < selectedPlanIndex ; i++){
              if(bPlanData[i]?.request_id_hsdis =="" && bPlanData[i]?.request_id_hsfo == "" && bPlanData[i]?.request_id_lsdis == "" && bPlanData[i]?.request_id_ulsfo == ""){
                requestExists = 0; 
              }
              else{
                requestExists = 1; 
                break;
              }
            }

            if(requestExists === 1){
              var overlay = document.querySelector('.cdk-overlay-container');
              overlay.classList.remove('removeOverlay');
              const confirmMessage = 'Please note that there is a request in Shiptech for a prior call which BOPS will only modify next time the plan optimized, and the trader may nominate it before if no action is taken. In case it needs to be adjusted or cancelled please do so or advise responsible party.';
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                  panelClass: 'confirmation-popup-operator', 
                  data:  { message: confirmMessage }
                });

                dialogRef.afterClosed().subscribe(result => {
                  console.log(result);
                  if(result) {
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
                  else {
                  
                  }
                });
            }
            else{
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
            
        }
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
    if(this.isOperatorAck == true ){
      //User cannot unacknowledge/uncheck a port with request available.
      if(!this.params.data?.request_id_hsfo && !this.params.data?.request_id_hsdis && !this.params.data?.request_id_lsdis && !this.params.data?.request_id_ulsfo)
      {
        this.isOperatorAck = true;
      }
      else{
        this.isOperatorAck = false;
      }
    }

    if(this.params?.data){
      this.store.dispatch(new UpdateBunkeringPlanAction( this.isOperatorAck ==  false ?1:0 ,'operator_ack', this.params.data?.detail_no))
      this.params.data.operator_ack = this.isOperatorAck ==  false ?1:0
    }
      
    this.params.context.componentParent.toggleOperAck(this.params);
  }
  triggerChangeEvent() {
    this.params.context.componentParent.triggerChangeEvent();
  }
  onCheckboxClick(event){
    event.stopPropagation();
  }
  onEditCheckboxComment(value,comment,event) {
    if(comment!="")
      this.enableSave = true;
    else
      this.enableSave = false;
      
      event.stopPropagation();
  }
  onEditCell(value,comment) {
    if (comment!= "" && value !="")
      this.enableSave = true;
    else if(value == ""&& comment =="")
      this.enableSave = false;
    else if(value == 0 && comment =="")
      this.enableSave = false;
    else
      this.enableSave = false;
  }
  saveUserComment(comment){
    this.usercomments = comment;
  }

  saveInput(inputElem: HTMLInputElement,value,params,column) {
    let commentType;
    let totalTankCapacity = params?.data?.total_tank_capacity;
    switch(column){
      case 'eca_min_sod': {commentType = 'eca_sod_comment'; break;}
      case 'hsfo_min_sod':{commentType = 'hsfo_sod_comment'; break;}
      case 'max_sod': {commentType = 'max_sod_comment'; break;}
      case 'min_sod': {commentType = 'min_sod_comment'; break;}
    }
    // check and truncate to totalTankCapacity, if the total max sod input greater then totalTankCapacity
    if(value>totalTankCapacity) {
      value = totalTankCapacity;
      inputElem.value = value;
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
  restrictionForPrevBplan(event){
    this.bplanType = this.store.selectSnapshot(UpdateBplanTypeState.getBplanType);
    if(this.bplanType =='P'){
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');
      const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
        width: '350px',
        panelClass: 'confirmation-popup-operator',
        data : {message: 'A new Plan exists for this vessel. Cannot update an old Plan'}
      });
    }
  }
  redirectionUrl(params){
    if(params?.colDef?.field){
      let url;
      switch(params.colDef.field){
        case 'hsfo_estimated_lift' : { 
                                          if(params.data?.request_id_hsfo && params.data?.is_alt_port != 'N')
                                            url = `${this.shiptechUrl}/#/edit-request/${params.data.request_id_hsfo}`
                                          
                                          else
                                            url = `#`
                                        
                                          break;
                                     }
        case 'ulsfo_estimated_lift' : { 
                                        if(params.data?.request_id_ulsfo && params.data?.is_alt_port != 'N')
                                          url = `${this.shiptechUrl}/#/edit-request/${params.data.request_id_ulsfo}`
                                        
                                        else
                                          url = `#`
                                      
                                        break;
                                      }
        case 'lsdis_estimated_lift': {  
                                        if(params.data?.request_id_lsdis && params.data?.is_alt_port != 'N' )
                                          url = `${this.shiptechUrl}/#/edit-request/${params.data.request_id_lsdis}`
                                        
                                        else
                                          url = `#`
                                      
                                        break;
                                      }
        case 'hsdis_estimated_lift': {  
                                        if(params.data?.request_id_hsdis && params.data?.is_alt_port != 'N')
                                          url = `${this.shiptechUrl}/#/edit-request/${params.data.request_id_hsdis}`
                                        
                                        else
                                          url = `#`
                                      
                                        break;
                                      }
      
      }

      if(url != '#')
        window.open(url, "_blank");
    }
  }
  checkAltPort(params) {
    switch (params?.colDef?.field) {
      case 'hsfo_estimated_lift':
        return params?.data?.is_alt_port_hsfo;
        break;
      case 'ulsfo_estimated_lift':
        return params?.data?.is_alt_port_ulsfo;
        break;
      case 'lsdis_estimated_lift':
        return params?.data?.is_alt_port_lsdis;
        break;
      case 'hsdis_estimated_lift':
        return params?.data?.is_alt_port_hsdis;
        break;
    }
  }
  showProductRequestInfo(params) {
    debugger;
    let requestInfo = [];
    let data = params?.data;
    switch (params?.colDef?.field) {
      case 'hsfo_estimated_lift':
        if(data?.request_id_hsfo) {
          let requestModel= {request_id: '', request_product: '', estimated_lift: ''};
          requestModel.request_id = data?.request_id_hsfo;
          requestModel.request_product = data?.request_product_hsfo;
          requestModel.estimated_lift = data?.hsfo_estimated_lift;
          requestInfo.push(requestModel);
        }
        if(data?.request_id_vlsfo) {
          let requestModel= {request_id: '', request_product: '', estimated_lift: ''};
          requestModel.request_id = data?.request_id_vlsfo;
          requestModel.request_product = data?.request_product_vlsfo;
          requestModel.estimated_lift = data?.vlsfo_estimated_lift;
          requestInfo.push(requestModel);
        }
        return requestInfo;
        break;
      let requestModel= {request_id: '', request_product: '', estimated_lift: ''};
      case 'ulsfo_estimated_lift':
        if(data?.request_id_ulsfo) {
          requestModel.request_id = data?.request_id_ulsfo;
          requestModel.request_product = data?.request_product_ulsfo;
          requestModel.estimated_lift = data?.ulsfo_estimated_lift;
          requestInfo.push(requestModel);
        }
        return requestInfo;
        break;
      case 'lsdis_estimated_lift':
        if(data?.request_id_lsdis) {
          requestModel.request_id = data?.request_id_lsdis;
          requestModel.request_product = data?.request_product_vlsfo;
          requestModel.estimated_lift = data?.request_product_lsdis;
          requestInfo.push(requestModel);
        }
        return requestInfo;
        break;
      case 'hsdis_estimated_lift':
        if(data?.request_id_hsdis) {
          requestModel.request_id = data?.request_id_hsdis;
          requestModel.request_product = data?.request_product_hsdis;
          requestModel.estimated_lift = data?.hsdis_estimated_lift;
          requestInfo.push(requestModel);
        }
        return requestInfo;
        break;
    }
  }
  requestAvailable(params){
    let isRequestAvailable = false;
    switch(params?.colDef?.field){
      case 'hsfo_estimated_lift' : { 
                                        isRequestAvailable = params.data?.request_id_hsfo ? true : false;
                                        isRequestAvailable = (isRequestAvailable || (params.data?.request_id_vlsfo)) ? true : false;
                                        break;
                                   }
      case 'ulsfo_estimated_lift' : { 
                                      isRequestAvailable = params.data?.request_id_ulsfo ? true : false;
                                      break;
                                    }
      case 'lsdis_estimated_lift': {  
                                      isRequestAvailable = params.data?.request_id_lsdis ? true : false;
                                      break;
                                    }
      case 'hsdis_estimated_lift': {  
                                      isRequestAvailable = params.data?.request_id_hsdis ? true : false;
                                      break;
                                    }
    
    }
    return isRequestAvailable
  }

  consUpdatedEvent(params,value){
    this.params.context.componentParent.consUpdatedEvent(params,value);
  }

}
@Component({
  selector: "hover-menu",
  template: `
    <div
      *ngIf="items"
      style="display:flex;flex-wrap:wrap;"
      
    >
      <div
        *ngFor="let item of items"
        class="aggrid-content-center dark-multiple-text"
      >
        <div class=" aggrid-text-resizable" [matTooltip]="item">{{ item }}</div>
      </div>
         </div>
  `,
})
export class HoverMenuComponent {
  @Input("items") items;

  @ViewChild("menuTrigger") menuTrigger: MatMenuTrigger;
  public theme: boolean = true;
  menuClick: boolean;
  constructor(private elem: ElementRef, private localService: LocalService) {}

  ngOnInit() {
    console.log(this.items);
    
    this.localService.themeChange.subscribe((value) => (this.theme = value));
  }

  toggleMenu(event) {
    //onenter
    this.menuTrigger.openMenu();
    var overlay = document.querySelector(".cdk-overlay-container");
    overlay.classList.add("removeOverlay");
  }

  toggleMenu2() {
    //onleave
    this.menuTrigger.closeMenu();
    var overlay = document.querySelector(".cdk-overlay-container");
    overlay.classList.remove("removeOverlay");
  }
}
