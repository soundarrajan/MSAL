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
  Renderer2,
  Optional
} from '@angular/core';

import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DecimalPipe, KeyValue } from '@angular/common';
import { ContractService } from 'libs/feature/contract/src/lib/services/contract.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';

@Component({
  selector: 'shiptech-product-formula-history-modal',
  templateUrl: './formula-history-modal.component.html',
  styleUrls: ['./formula-history-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class FormulaHistoryModalComponent implements OnInit {
  deliveryProducts: any;
  switchTheme;
  selectedProduct;
  formValues: any;
  splitDeliveryInLimit: any[];
  uoms: any;
  disabledSplitBtn;
  quantityFormat: string;
  modalSpecGroupParameters: any;
  modalSpecGroupParametersEditable: any;
  specParameterList: any;
  activeProductForSpecGroupEdit: any;
  formulaHistoryDataResponse: any;
  constructor(
    public dialogRef: MatDialogRef<FormulaHistoryModalComponent>,
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private tenantService: TenantFormattingService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private format: TenantFormattingService,
    @Inject(DecimalPipe) private _decimalPipe,
    
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data);
      this.formulaHistoryDataResponse = data.formulaHistoryDataResponse;

    }

  ngOnInit() {
  }

  closeClick(): void {
    this.dialogRef.close();
  }

  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
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
      let elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd') } ${ formattedDate}`;
      }
      return formattedDate;
    }
  }

  
 
  
}
