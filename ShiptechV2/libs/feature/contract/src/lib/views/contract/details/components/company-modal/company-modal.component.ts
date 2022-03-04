import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  Inject,
  ChangeDetectorRef,
  Renderer2
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from '@ag-grid-enterprise/all-modules';
import { MatRadioChange } from '@angular/material/radio';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'shiptech-company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CompanyModalComponent implements OnInit {
  companyList: any;
  selectedCompany: any;
  favoriteSeason: any;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(
    public dialogRef: MatDialogRef<CompanyModalComponent>,
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.companyList = data.companyList;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  changeGender(e) {}

  closeClick(): void {
    this.dialogRef.close();
  }
}
