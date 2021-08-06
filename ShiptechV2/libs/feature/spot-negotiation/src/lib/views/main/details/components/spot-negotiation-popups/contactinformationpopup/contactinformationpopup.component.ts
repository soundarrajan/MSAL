import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-contactinformationpopup',
  templateUrl: './contactinformationpopup.component.html',
  styleUrls: ['./contactinformationpopup.component.css']
})
export class ContactinformationpopupComponent implements OnInit {
  @ViewChild('inputBox') _el: ElementRef;

  ngOnInit(): void {}
  constructor(
    public dialogRef: MatDialogRef<ContactinformationpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
  tabledata = [
    {
      editable: false,
      name: 'Rajat Gupta',
      designation: 'trader',
      email: 'rajagputa@heymail.com',
      address: '123, HSR Layout',
      zipcode: '9092019',
      city: 'Chennai',
      country: 'India',
      mobile: '09283-2932032',
      phone: '09283-2932032',
      fax: '09283-2932032',
      im: '09283-2932032'
    },
    {
      editable: false,
      name: 'Rajat Gupta',
      designation: 'trader',
      email: 'rajagputa@heymail.com',
      address: '123, HSR Layout',
      zipcode: '9092019',
      city: 'Chennai',
      country: 'India',
      mobile: '09283-2932032',
      phone: '09283-2932032',
      fax: '09283-2932032',
      im: '09283-2932032'
    }
  ];
  tabledatas3 = [
    {
      name: '',
      designation: '',
      email: '',
      address: '',
      zipcode: '',
      city: '',
      country: '',
      mobile: '',
      phone: '',
      fax: '',
      im: ''
    }
  ];
  // tabledata2=[ ];
  //newtabledata:any={}
  addNew(tabledata) {
    console.log(tabledata);
    this.tabledata.push(tabledata);
    this.tabledatas3 = [
      {
        name: '',
        designation: 'designation',
        email: '',
        address: '',
        zipcode: '',
        city: '',
        country: '',
        mobile: '',
        phone: '',
        fax: '',
        im: ''
      }
    ];
    //this.newtabledata = {};

    this.showoverlay = !this.showoverlay;
  }
  // Array edit

  editDomain(domain: any) {
    domain.editable = !domain.editable;
  }

  isEditEnable3: boolean = true;

  onEdit2() {
    this.isEditEnable3 = !this.isEditEnable3;

    // this.tabledata2.push(this.newtabledata)
    // this.newtabledata = {};
  }

  //Overlay Show and Hide
  showoverlay: boolean = true;
  removeoverlay() {
    this.showoverlay = false;
    this.isEditEnable3 = true;
  }

  setFocus() {
    this._el.nativeElement.focus();
  }
}
