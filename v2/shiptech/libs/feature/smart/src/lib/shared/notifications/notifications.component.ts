import { Component, OnInit, ViewChildren,ViewChild, QueryList,ChangeDetectorRef , AfterViewInit } from '@angular/core';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FormControl } from '@angular/forms'; 
import{alertservice} from '../../services/alert.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as _loadashC from 'lodash';
const loadashC = _loadashC;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @ViewChildren(MatExpansionPanel) matExpansionPanelQueryList: QueryList<MatExpansionPanel>;
  @ViewChild('createPanelOpen', {static: false}) createPanelOpen: MatExpansionPanel;
  public dialogRef: MatDialogRef<ConfirmationPopupComponent>;
  public alerts;
  public count = 4;
  public active: boolean = true;
  public showSettingNotification: boolean;
  public customSelect = new FormControl();
  public openId = "";
  public isOpen: boolean;
  public enableUpdate: boolean;
  public showhideDeleteRule: boolean;
  public showMenu: boolean;
  public items;
  public newAlert;
  alertsList:any[] = []; 
  showLoading:boolean=true;
  showLoadingOnList:any=[];
  addTriggerRules=[0];
  createForm = false;
  createAlert = {
    title : "",
    ruletype:"",
    isActive: true,
    isTenant: false,
    message:""
  };
  alertOptions = [{
    colorFlag: "red",
    isVessel: true,
    isEmail : false,
    isNotification : true,
    displayMessage:""
  }];
  errorsAlerts=[{
    flagAlert: false,
    messageAlert:false,
    conditionAlert:false,
    nonEqualConditions: false
  }];

  addMoreRules=[{
    tags:[]
}];
alertAddTags = [{
  addMoreTags:[],
  conditionTags:[],
  valueTags : [],
  //valueBetweenTags:[],
  //dataTypeTag:[],
  deleteTrigger: false
}];

errors = {
  title: false,
  titleMessage: "Required alert name",
  titleID: -2,
  ruleType: false,
  ruleTypeMessage: "Choose alert type"
};

allAlertTags:{};
alertData:any[]= [];
selectedAlertTags:any[];
alertsType:any[]= [];
  newPanelCollapsedHeight: string = '72px';
  newPanelExpandedHeight: string = '72px';
  panelCollapsedHeight: string = '51px';
  panelExpandedHeight: string = '70px';
  constructor(public dialog: MatDialog, private alertservice: alertservice, private _snackBar: MatSnackBar,private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadAlerts();
    this.loadAlertParameters();
    this.newAlert =       {
      active: false,
      name: "",
      type: "",
      triggerRule: [
        {
          rule: [],
          alert: "",
          vesselFlag: false,
          email: false,
          notification: false
        }
      ]
    }
  //  this.items = [
  //     {
  //       id: 1,
  //       active: true,
  //       name: "Port Remarks",
  //       type: "port",
  //       triggerRule: [
  //         {
  //           rule: [
  //             {
  //               rule: "Bunker plan delay",
  //               condition: "greater than",
  //               value: "24 hours"
  //             }
  //           ],
  //           alert: "red",
  //           vesselFlag: false,
  //           email: true,
  //           notification: true
  //         },
  //         {
  //           rule: [
  //             {
  //               rule: "Bunker plan delay",
  //               condition: "greater than",
  //               value: "24 hours"
  //             }
  //           ],
  //           alert: "yellow",
  //           vesselFlag: false,
  //           email: true,
  //           notification: true
  //         },
  //       ]
  //     },
  //     {
  //       id: 2,
  //       active: false,
  //       name: "No Request Alert",
  //       type: "vessel",
  //       triggerRule: [{
  //         rule: [
  //           {
  //             rule: "Bunker plan delay",
  //             condition: "greater than",
  //             value: "24 hours"
  //           },
  //           {
  //             rule: "Operating Region",
  //             condition: "in",
  //             value: "Europe"
  //           }
  //         ],
  //         alert: "yellow",
  //         vesselFlag: false,
  //         email: true,
  //         notification: true
  //       }

  //       ]
  //     }
  //     
  //   ]
     this.alerts = [
    //   {
    //     name: "Bunker Plan Delay",
    //     date: "03 March 2020 09:00",
    //     vessel: "Vessel GUATEMALA",
    //     description: "Bunker plan has been not updated for 48 hours.",
    //     severity: "red"
    //   },
    //   {
    //     name: "Redelivery Date Nearing",
    //     date: "03 March 2020 22:00",
    //     vessel: "Vessel MCC Kyoto",
    //     description: "Redelivery date is within 15 days.",
    //     severity: "amber"
    //   },
    //   {
    //     name: "Price Drop",
    //     date: "03 March 2020 11:00",
    //     vessel: "Port of Rotterdam",
    //     description: "VLSFO prices has been dropped by $8 in 2weeks.",
    //     severity: "green"
    //   },
    //   {
    //     name: "No Order Alert",
    //     date: "03 March 2020 09:00",
    //     vessel: "Vessel Manila Maersk",
    //     description: "No orders have been placed for past 12 days.",
    //     severity: "amber"
    //   }
     ]
  }

  hello() {
    console.log("Hi")
  }
  panelOpened(id) {
    this.isOpen = true;
    this.openId = id;
  }

  panelClosed() {
    this.isOpen = false;
    this.showMenu = false;
    this.showhideDeleteRule = false;
  }

  clearNotifications() {
    this.active = false;
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      panelClass: ['confirmation-popup']

    });

    dialogRef.afterClosed().subscribe(result => {
      this.active = true;
      if (result) {
        this.alerts = [];
        this.count = 0;
      }
    });
  }
  removeValidationMessage(tidx){
    this.errorsAlerts[tidx].nonEqualConditions = false;
  }

  
  customTriggerTrackBy(index: number, obj: any): any {
    return index;
  }
  selectionChanged(value) {
    this.enableUpdate = true;
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  duplicateRule(idx){         
    let duplicate = loadashC.cloneDeep(this.alertsList[idx]);
    duplicate.AlertId = 0;
    duplicate.AlertName = "Copy Of "+duplicate.AlertName;
    duplicate.NoOfTriggerRules = duplicate.TriggerRules.length;
    duplicate.IsActive = false;
    let titleError = false;
    this.alertsList.forEach((alert)=>{
      if(alert.AlertName == duplicate.AlertName){          
          this._snackBar.open("Alert Name Already exists", "Close", {
            duration: 3000,
          });
          titleError = true;    
          return;      
        }      
    });


if(!titleError){
  this.showLoadingOnList[idx] = true; 
  this.alertservice.createUpdateAlert(duplicate).subscribe((res) => {    
    let resultValue = res;     
    if(resultValue.alertId > 0){        
      duplicate.AlertId = resultValue.alertId;
                         
      let successMessage = "Duplicated alert created successfully";
      this._snackBar.open(successMessage, "Close", {
        duration: 3000,
      });
      this.createForm = false;
      this.togglePanels(-1);
      this.alertsList.push(duplicate);
      this.showLoadingOnList[idx] = false; 
            
    }
  }); 
}
  }

  checkEmptyOnAddMore(){
    this.addTriggerRules.forEach((item,index)=>{
      this.errorsAlerts[index].nonEqualConditions = false; 
      let optionLength = this.addMoreRules[index].tags.length;
      if(optionLength == 0 || optionLength != this.alertAddTags[index].addMoreTags.length || 
        optionLength != this.alertAddTags[index].conditionTags.length ||
        optionLength != this.alertAddTags[index].valueTags.length){         
          this.errorsAlerts[index].nonEqualConditions = true;
              }else{        
        this.alertAddTags[index].valueTags.forEach(values=>{
          if(values == ''){
            this.errorsAlerts[index].nonEqualConditions = true; 
          }
        })        
      }           
    });
  }

  addingMoreRules(type, index, tindex){        
    if(type == 'add'){ 
      this.checkEmptyOnAddMore(); 
      if(!this.errorsAlerts[tindex].nonEqualConditions)        
        this.addMoreRules[tindex].tags.push(this.addMoreRules[tindex].tags.length);
      
    }else{      
      this.errorsAlerts[tindex].nonEqualConditions = false;
      if(this.addMoreRules[tindex].tags.length > 1){
        this.addMoreRules[tindex].tags.splice(index,1);        
        this.alertAddTags[tindex].addMoreTags.splice(index,1);
        this.alertAddTags[tindex].conditionTags.splice(index,1);
        this.alertAddTags[tindex].valueTags.splice(index,1);
      }else{
        this._snackBar.open("Atleast one condition is required", "Close", {
          duration: 3000,
        });
      }
    }       
  }  
  addMoreTriggerRule(type,index){
    if(type == 'add'){ 
      //if(this.addTriggerRules.length < mxRule)  {
        this.addTriggerRules.push(this.addTriggerRules.length);
        this.addMoreRules.push({tags:[0]})
        this.alertAddTags.push({
          addMoreTags:[],//[this.selectedAlertTags[0]],
          conditionTags:[],//[this.conditionalTags[0].key],
          valueTags : [],
          //dataTypeTag:[],//["200"],         
         // valueBetweenTags:[],
          deleteTrigger: false
        });        
        this.alertOptions.push({
          colorFlag: "",
          isVessel: false,
          isEmail : false,
          isNotification : false,
          displayMessage:''
        });
        this.errorsAlerts.push({
          flagAlert: false,
          messageAlert: false,
          conditionAlert:false,
          nonEqualConditions: false
        });
        //this.isFlagChecked(this.addTriggerRules.length-1);
      //}   
        
  }else{
    if(this.addTriggerRules.length > 1){
      this.addTriggerRules.splice(index,1);
      this.addMoreRules.splice(index,1);
      this.alertAddTags.splice(index,1);        
      this.alertOptions.splice(index,1);
      this.errorsAlerts.splice(index,1);
    }else{
      this._snackBar.open("Atleast one trigger rule is required", "Close", {
        duration: 3000,
      });
    }
  }
  }

  createAlertFormSubmit(event, a_id){
    let msgError;
    let conditionError;
    let optionError;
    let titleError = false;
     //Error checking for the display messages empty or not
    this.addTriggerRules.forEach((item,index)=>{
      msgError = this.alertOptions[index].displayMessage =="" ? true : false;
      if(msgError){
        this.errorsAlerts[index].messageAlert = true;
        return;
      }      
    }); 
    //Error checking for the conditions on addmore
    this.addTriggerRules.forEach((item,index)=>{
      conditionError = this.errorsAlerts[index].conditionAlert;
      if(conditionError){
        return;
      }
    });
    this.checkEmptyOnAddMore();//To find empty values on add more options
    this.addTriggerRules.forEach((item,index)=>{             
      optionError = this.errorsAlerts[index].nonEqualConditions;
      if(optionError){          
        return;
      }           
    });

    this.alertsList.forEach((alert)=>{
      if(alert.alertName == this.createAlert.title){
        if(a_id>-1){
          if(alert.alertId != this.alertsList[a_id].alertId){
            this._snackBar.open("Alert Name Already exists", "Close", {
              duration: 3000,
            });
            titleError = true;   
            return;
          }
        }
        else{
          this._snackBar.open("Alert Name Already exists", "Close", {
            duration: 3000,
          });
          titleError = true;    
          return;
        }
      }
    })
  
    if(this.createAlert.title && !titleError && !msgError ){//&& this.createAlert.ruletype && !msgError && !conditionError && !optionError && !titleError){   
      if(a_id>-1){
        this.showLoadingOnList[a_id] = true; 
      }else{
        this.showLoading = true;
      }    
      let triggerValues=[];
      let addMoreValues=[];
      this.addTriggerRules.forEach((item,index) => {
        addMoreValues=[];
        //addmoreRules is for only tags length
        this.addMoreRules[index].tags.forEach((aitem,vals)=>{
          //var checkBetweenValues = this.alertAddTags[index].conditionTags[vals] == 'between' ? [this.alertAddTags[index].valueTags[vals],this.alertAddTags[index].valueBetweenTags[vals]] : [this.alertAddTags[index].valueTags[vals]];
          addMoreValues.push({
            "columnValue": this.alertAddTags[index].addMoreTags,
            "columnType": this.alertAddTags[index].addMoreTags[vals] == "Bunker plan delay" ? 1 : this.alertAddTags[index].addMoreTags[vals] == "Operating Region" ? 2 : 3,
            "conditionValue": this.alertAddTags[index].conditionTags[vals] == "less than"?'<' : this.alertAddTags[index].conditionTags[vals] == 'greater than'? '>': 'in',
            "values": this.alertAddTags[index].valueTags[vals]
          });
        });
        triggerValues.push({
          "triggerRuleId" : index+1,
          "colorFlag": this.alertOptions[index].colorFlag == "red" ? 1 : 2, 
          "displayMessage": this.alertOptions[index].displayMessage,
          "isVessel" : this.alertOptions[index].isVessel,
          "isEmail" : this.alertOptions[index].isEmail,
          "isNotification" : this.alertOptions[index].isNotification,
          "formula" : addMoreValues
        });             
      });
      let createFormValues = {
        "alertId": a_id > -1 ? this.alertsList[a_id].alertId : 0,
        "alertMasterId": this.createAlert.ruletype == "vessel"? 1: 2, 
        "alertName" : this.createAlert.title,
        "isActive": this.createAlert.isActive,   
        "isTenant" : this.createAlert.isTenant,   
        "noOfTriggerRules" : this.addTriggerRules.length, 
        "triggerRules" : triggerValues
      };
       //console.log("final create form-->",JSON.stringify(createFormValues));
      this.alertservice.createUpdateAlert(createFormValues).subscribe((res) => {
        let resultValue = res; 
         
        if(resultValue.payload > -1){
          if(a_id > -1){ 
            this.showLoadingOnList[a_id] = false; 
            this.alertsList[a_id] = createFormValues;
            this.alertsList[a_id].LastUpdatedDate = new Date();
          }
          else{
            this.showLoading = false;
            createFormValues.alertId = resultValue.alertId;
            this.alertsList.push(createFormValues);
            this.alertsList[this.alertsList.length-1].LastUpdatedDate = new Date();
          }
            
          //Remove error messages and empty the values
          this.addTriggerRules.forEach((item,index) => {
            this.addTriggerRules.splice(index,1);
            this.addMoreRules.splice(index,1);
            this.alertAddTags.splice(index,1);        
            this.alertOptions.splice(index,1);            
            this.errorsAlerts.splice(index,1);            
          });                
          this.errors.title = false;       
          this.errors.titleID = a_id;       
          this.errors.ruleType = false; 
          let successMessage = a_id > -1 ? "Alert updated successfully": "New alert created successfully"
          this._snackBar.open(successMessage, "Close", {
            duration: 3000,
          });
          this.createForm = false;
          this.togglePanels(-1);
          this.createPanelOpen.expanded = false;           
        }else{
          event.stopPropagation();
        }
        
          
      }); 
      event.stopPropagation();
    }else{
      this.errors.title = this.createAlert.title ? false : true;       
      this.errors.ruleType = this.createAlert.ruletype ? false : true; 
      this.errors.titleID = a_id;                                 
      event.stopPropagation();
    } 
    this.loadAlerts();  
  }

  indexExpanded: number = -1;
  togglePanels(index: number) {  
    this.errors.title = false;
      this.indexExpanded = index == this.indexExpanded ? -1 : index;
  }

  handleSpacebar(ev) {
    if (ev.keyCode === 32) {
      ev.stopPropagation();
    }
   }

  loadAlerts(){
    let requestPayload = "" 
    this.alertservice.getAlerts(requestPayload).subscribe((res: any) => {  
      this.alertsList = res.payload;
      let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
      this.showLoading = false;
    });
  }

  loadAlertParameters(){
    let requestPayload = ""
    this.alertservice.getAlertParamters(requestPayload).subscribe((res:any)=>{
      let typeId=[];
      this.allAlertTags =res.payload;
      for (let key in this.allAlertTags) {
        let value = this.allAlertTags[key];
        if(!typeId.includes(this.allAlertTags[key].alertMasterId)){
          typeId.push(this.allAlertTags[key].alertMasterId);
          this.alertsType.push({"key":this.allAlertTags[key].alertMasterId,"value":this.allAlertTags[key].alertType});
        }
      }
    });
     }

  alertTypeChange(alerType){
    this.selectedAlertTags=[];
    //  this.addTriggerRules = [0]
    this.addTriggerRules.forEach((item,index)=>{
      this.addMoreRules[index].tags = [0];
      this.alertAddTags[index].addMoreTags = [];
      //this.alertAddTags[index].dataTypeTag = [];
      this.alertAddTags[index].conditionTags=[];
      this.alertAddTags[index].valueTags=[];
      this.alertAddTags[index].deleteTrigger = false;
      //this.alertAddTags[index].valueBetweenTags=[];
    });
    for (let key in this.allAlertTags) {
      let value = this.allAlertTags[key];
      if(value.alertMasterId == alerType){
        this.selectedAlertTags.push(value)
      }       
    }
}
updateAlertDetails(index){
  // console.log("update alert", index);
  this.createForm = false;
  this.alertTypeChange(this.alertsList[index].alertMasterId);
  //this.newEmptyObjectsFormed();       
    this.createAlert = {
      title : this.alertsList[index].alertName,
      ruletype:this.alertsList[index].alertMasterId.toString(),
      isActive: this.alertsList[index].isActive,
      isTenant: this.alertsList[index].isTenant,
      message: ""
    };
    this.alertOptions=[];this.addTriggerRules = [];this.addMoreRules = [];this.errorsAlerts=[];
    this.alertsList[index].triggerRules.forEach((item,idx)=>{
      this.addTriggerRules.push(idx);
      this.errorsAlerts.push({
        flagAlert: false,
        messageAlert: false,
        conditionAlert:false,
        nonEqualConditions: false
      });
      this.alertOptions.push({
        colorFlag: item.colorFlag == 1 ? 'red' :  'yellow',
        displayMessage:item.displayMessage,
        isVessel: item.isVessel,
        isEmail : item.isEmail,
        isNotification : item.isNotification,
      });

      this.alertAddTags[idx] = {
        addMoreTags:[],
        conditionTags:[],
        valueTags : [],
        deleteTrigger: false
      }; 
      this.addMoreRules.push({tags : []});
      item.formula.forEach((more,midx) => {
        this.addMoreRules[idx].tags.push(midx);
        this.alertAddTags[idx].addMoreTags.push(more.columnValue);
        let ConditionValue = more.conditionValue //== "&lt;"? "<": more.conditionValue == "&gt;"? ">": "in"
        this.alertAddTags[idx].conditionTags.push(ConditionValue);
        this.alertAddTags[idx].valueTags.push(more.values);
        this.alertAddTags[idx].deleteTrigger = false;
      });
    });
    this.cd.detectChanges();    
    // console.log(this.alertAddTags);
   
}

selectOpened(){
  //Hide drop down menu on click next drop dowm
  var elements = document.querySelectorAll('.cdk-overlay-backdrop');
    elements.forEach( (element) => {
    element.classList.add('removeOverlay');
  });
  
}

deleteNotification (a_id,idx){
  this.showLoadingOnList[idx] = true; 
  this.alertservice.deleteNotification(a_id).subscribe((res) => {      
    if(res > 0){
      this._snackBar.open("Alert deleted successfully", "Close", {
        duration: 3000,
      });
      this.createForm = false;
      this.togglePanels(-1);
      this.createPanelOpen.expanded = false;        
      this.alertsList.splice(idx,1);        
    }
    this.showLoadingOnList[idx] = false; 
  });
}

}
