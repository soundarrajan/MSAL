import { Component, OnInit,ElementRef, ViewChild, Input,Output,EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import moment from 'moment';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { DeleteChatPopupComponent } from '../contract-negotiation-popups/delete-chat-popup/delete-chat-popup.component';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { ToastrService } from 'ngx-toastr';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import _ from 'lodash';
@Component({
  selector: 'app-offer-chat',
  templateUrl: './offer-chat.component.html',
  styleUrls: ['./offer-chat.component.scss']
})
export class OfferChatComponent implements OnInit {
  public chatList:any=[];
  public chatValue:string="";
  public clickChatIndex:number;
  public editChatIndex:number;
  public contenteditable:boolean=false;
  public fullHeaderWidth: any;
  public openChat:boolean=true;
  public readonly dateFormat: string = 'DDD dd/MM/yyyy HH:mm';
  currentUser: any;
  @Input() chatObj:any;
  
  @Output() chatAvailableStatus = new EventEmitter<boolean>();
  constructor(
    private contractNegoService: ContractNegotiationService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store,
    public format: TenantFormattingService,
    private toaster: ToastrService,
    ) { }

  ngOnInit(): void {  
    this.currentUser = this.store.selectSnapshot(UserProfileState.user);    
    this.getOfferChatData(); 
  }

  formatDate(date?: any) {
    if (date) {
      let currentFormat = this.format.dateFormat;
      let hasDayOfWeek;
      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');
      const elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;     
    }
  }

  private getOfferChatData() {   
    var allRequestComments = [];  
    const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
    var payload = {
       "contractRequestId": contractRequestIdFromUrl
     };
    this.contractNegoService.getContractRequestOfferChat(payload)
    .subscribe(response => {    
      response.forEach(commentResponse => {        
       var comment = { 
          "UserName":(commentResponse.users.displayName)?commentResponse.users.displayName:commentResponse.users.name,
          "label":(commentResponse.users.displayName)?commentResponse.users.displayName.slice(0, 2):commentResponse.users.name.slice(0, 2),
          "type":(this.currentUser.id == commentResponse.createdBy)?"sent":"received",
          "CreatedOn":this.showUtcToLocalDate(commentResponse.createdAt),
          "id":this.formatDate(commentResponse.id),
          "Message":commentResponse.chat
        }       
         allRequestComments.push(comment);          
       });  
        allRequestComments =  _.orderBy(
        allRequestComments,
        ['id'],
        ['asc']
      );
       this.chatObj =  allRequestComments;
      
             
     });     
 }

 displaySuccessMsg(msg) {
  this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">'+msg+'</div>',
    '', {
    enableHtml: true,
    toastClass: "toast-alert toast-green", // toast-green, toast-amber, toast-red, toast-grey
    timeOut: 2000
  });
}
public showUtcToLocalDate(value=''): string | undefined {
  let formattedDate;
  if(value){
     formattedDate = moment.utc(value).local().format(
      dateTimeAdapter.fromDotNet(this.dateFormat)
    );
  }else{
     formattedDate = moment.utc().local().format(
      dateTimeAdapter.fromDotNet(this.dateFormat)
    );
  }
  if (formattedDate.endsWith('00:00')) {
    formattedDate = formattedDate.split('00:00')[0];
  }
  return formattedDate;
}
sendChat(){  
    if(this.chatValue!=""){
      if(this.chatValue.length > 1000){
        this.toaster.error("Comment should have less than 1000 characters");
        return;
      }
      var contractRequestId = this.route.snapshot.params.requestId;
      this.chatObj.push(
        {
          UserName:this.currentUser.displayName,
          label: this.currentUser.displayName.slice(0, 2),
          type:'sent',
          CreatedOn:this.showUtcToLocalDate(),
          Message:this.chatValue
        });
        var payload =    
        {
          "contractRequestId": parseInt(contractRequestId),
          "chat": this.chatValue,        
          "createdBy": this.currentUser.id,         
        } 

        this.contractNegoService.addOfferChat(payload).subscribe((res: any) => {       
          if (res?.message == 'Unauthorized' || res?.errors) {         
            return;
          }
          if(res.errorMessage){
            this.toaster.error(res.errorMessage);
            return;
          }        
          this.chatAvailableStatus.emit(true);
          this.displaySuccessMsg('Comment has been added successfully');   
         
        });  
    this.chatValue = "";
    }else{

    }
    
  }  
  clickChat(i){
    this.clickChatIndex = i;
  }
  deleteChat(){
    const dialogRef = this.dialog.open(DeleteChatPopupComponent, {
      width: '320px',
      height: 'auto',
      panelClass: 'delete-chat-popup',
  });

  dialogRef.afterClosed().subscribe(result => {
      //this.rowData[index].data[rowindex].offPrice = Number(this.rowData[index].data[rowindex].offPrice) + 100;
  //alert(result.data);
  if(result.data){
    this.chatObj.splice(this.clickChatIndex,1);
  }
    });
    //this.chatObj.splice(this.clickChatIndex,1);
  }
  editChat(){
    this.editChatIndex = this.clickChatIndex;
    this.contenteditable=true;
  }
  editSave(){
    this.contenteditable=false;
  }

  toggleChat(){
    this.openChat = true;
 }

 panelClosed(){
  this.openChat=false;
}

}
