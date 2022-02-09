import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SellerContactModel, SellerViewModel } from './seller-contact-model';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
@Component({
  selector: 'app-contactinformationpopup',
  templateUrl: './contactinformationpopup.component.html',
  styleUrls: ['./contactinformationpopup.component.css']
})
export class ContactinformationpopupComponent implements OnInit {
  @ViewChild("inputBox") _el: ElementRef;

  seller: SellerViewModel;
  isEditEnable3: boolean= true;
  countryList: any;
  switchTheme; //false-Light Theme, true- Dark Theme

  constructor(public dialogRef: MatDialogRef<ContactinformationpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    , private spinner: NgxSpinnerService
    , private toastr: ToastrService
    , private changeDetector: ChangeDetectorRef
    , public format: TenantFormattingService
    , private spotNegotiationService: SpotNegotiationService
    , private legacyLookupsDatabase: LegacyLookupsDatabase) { }

  ngOnInit(): void {
    this.getCounterpartyContacts();
    this.legacyLookupsDatabase.getTableByName('country').then(response => {
      this.countryList = response;
    });
  }

  getCounterpartyContacts(){
    this.spinner.show();
    this.spotNegotiationService.getSellerContacts(this.data.sellerId, this.data.locationId)
    .subscribe((res: any) => {
      this.spinner.hide();
      if (res) {
       this.seller = res;
       this.seller.counterpartyContacts = res.counterpartyContacts.filter(x=> x.isEmailContact == true);

        console.log(this.seller);
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
      let newContact = this.seller.counterpartyContacts.slice(-1)[0];

      if(!newContact.name || !newContact.email){
        this.toastr.error('Please enter a valid contact name or email to save.')
        return;
      }
      if(newContact.country && (!(newContact.country.name) || !(newContact.country.id))){
        this.toastr.error('Country is invalid, select a valid country to save.')
        return;
      }

      const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if(regexp.test(newContact.email) === false){
        this.toastr.error('\"'+ newContact.email +'\" is not a valid email address.', '', { timeOut: 5000 });
        newContact.email = '';
        return;
      }

      // add the new contact to counterparty
      newContact.counterpartyId = this.seller.counterpartyId;
      this.spinner.show();
      this.spotNegotiationService.addNewSellerContact(newContact).subscribe((res:any) => {
        this.spinner.hide();
        if(res && res.status){
          this.toastr.success('Counterparty contact added successully.');
          this.dialogRef.close();
        }
        else{
          this.toastr.error(res.message);
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

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  public filterCountryList(country) {
    if (country) {
      let filterValue = '';
      filterValue = country.name
        ? country.name.toLowerCase()
        : country.toLowerCase();
      if (this.countryList) {
        const list = this.countryList
          .filter((item: any) => {
            return item.name? item.name.toLowerCase().includes(filterValue.trim().toLowerCase()) : item.name;
          })
          .splice(0, 10);
        console.log(list);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

}


