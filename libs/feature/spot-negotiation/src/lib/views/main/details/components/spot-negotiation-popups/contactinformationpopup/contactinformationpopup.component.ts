import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SellerContactModel, SellerViewModel } from './seller-contact-model';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
@Component({
  selector: 'app-contactinformationpopup',
  templateUrl: './contactinformationpopup.component.html',
  styleUrls: ['./contactinformationpopup.component.css']
})
export class ContactinformationpopupComponent implements OnInit {
  @ViewChild("inputBox") _el: ElementRef;

  seller: SellerViewModel;
  isEditEnable3: boolean= true;

  constructor(public dialogRef: MatDialogRef<ContactinformationpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    , private spinner: NgxSpinnerService
    , private toaster: ToastrService
    , private changeDetector: ChangeDetectorRef
    , private spotNegotiationService: SpotNegotiationService) { }

  ngOnInit(): void {
    this.getCounterpartyContacts();
  }

  getCounterpartyContacts(){
    this.spinner.show();
    this.spotNegotiationService.getSellerContacts(this.data.sellerId).subscribe((res: any) => {
      this.spinner.hide();
      if (res) {
        this.seller = res;
        const newContact = <SellerContactModel>{contactTypeId: 1, contactType:'Trading'}
        this.seller.counterpartyContacts.push(newContact);
        this.changeDetector.detectChanges();
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  tabledatas3=[
    // {name:'',designation:'',email:'', address:'',zipcode:'',city:'',country:'',mobile:'',phone:'',fax:'',im:''},
  ];

  saveNewContact() {
    if(this.seller.counterpartyContacts){
      const newContact = this.seller.counterpartyContacts.slice(-1)[0];
      if(!newContact.name || !newContact.email){
        this.toaster.error('Please enter a valid contact name or email to save.')
        return;
      }
      // add the new contact to counterparty
      newContact.counterpartyId = this.seller.counterpartyId;
      this.spinner.show();
      this.spotNegotiationService.addNewSellerContact(newContact).subscribe((res:any) => {
        this.spinner.hide();
        if(res && res.status){
          this.toaster.success('Counterparty contact added successully.');
          this.dialogRef.close();
        }
        else{
          this.toaster.error(res.message);
        }
      });

    }
    // this.showoverlay = !this.showoverlay;
  }

  // Array edit
  editContact(domain: any){
    domain.isEditable = !domain.isEditable;
  }

  onEdit2(){
      this.isEditEnable3=!this.isEditEnable3;

        // this.tabledata2.push(this.newtabledata)
        // this.newtabledata = {};
 }

//Overlay Show and Hide
showoverlay: boolean= true;
removeoverlay(){
  this.showoverlay = false;
  this.isEditEnable3=true;

}

setFocus() {
  this._el.nativeElement.focus();
}

}


