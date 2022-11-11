import { Component, OnInit,ElementRef, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteChatPopupComponent } from '../contract-negotiation-popups/delete-chat-popup/delete-chat-popup.component';
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

  @Input() chatObj:any;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    // console.log("ssssssss");
    // console.log(this.chatObj)
  //this.chatListthis.chatObj;
  }
  sendChat(){
    //alert(this.chatValue);
    if(this.chatValue!=""){
    this.chatObj.push(
      {
        UserName:'Design System',
        label:'DS',
        type:'sent',
        CreatedOn:'05/08/2022 09:49',
        Message:this.chatValue
      }
    );
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
