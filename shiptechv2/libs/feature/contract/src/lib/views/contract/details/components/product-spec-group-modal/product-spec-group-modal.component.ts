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

@Component({
  selector: 'shiptech-product-spec-group-modal',
  templateUrl: './product-spec-group-modal.component.html',
  styleUrls: ['./product-spec-group-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ProductSpecGroupModalComponent implements OnInit {
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
  constructor(
    public dialogRef: MatDialogRef<ProductSpecGroupModalComponent>,
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private tenantService: TenantFormattingService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(DecimalPipe) private _decimalPipe,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalSpecGroupParameters = data.modalSpecGroupParameters;
    this.modalSpecGroupParametersEditable =
      data.modalSpecGroupParametersEditable;
    this.specParameterList = data.specParameterList;
    this.activeProductForSpecGroupEdit = data.activeProductForSpecGroupEdit;
  }

  ngOnInit() {}

  closeClick(): void {
    this.dialogRef.close();
  }

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return 0;
  };

  addProductSpecGroup() {
    if (!this.modalSpecGroupParameters) {
      this.modalSpecGroupParameters = [];
    }
    this.modalSpecGroupParameters.push({ editable: true, id: 0 });
  }

  removeProductSpecGroup(key) {
    if (this.modalSpecGroupParameters[key].id) {
      this.modalSpecGroupParameters[key].isDeleted = true;
    } else {
      this.modalSpecGroupParameters.splice(key, 1);
    }
  }

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  filterSpecParameterList(value) {
    if (value) {
      const filterValue = value.name
        ? value.name.toLowerCase()
        : value.toLowerCase();
      if (this.specParameterList) {
        return this.specParameterList
          .filter(
            option => option.name.toLowerCase().indexOf(filterValue) === 0
          )
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  modalSpecGroupParametersUpdateUom(specParam, index) {
    this.spinner.show();
    this.contractService
      .getSpecParameterById(specParam.id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.modalSpecGroupParameters[index].uom = response.uom;
          this.modalSpecGroupParameters[index].energyParameterTypeId =
            response.energyParameterType.id;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  saveProcurementSpecGroup(data) {
    data.forEach((spec, key) => {
      spec.contractProduct = data[0].contractProduct;
      spec.specGroup = data[0].specGroup;
    });
    var objToSend = {
      ProductId: this.activeProductForSpecGroupEdit.product.id,
      SpecParameters: data
    };

    this.spinner.show();
    this.contractService
      .saveSpecParameterForContractProduct(objToSend)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.toastr.success('Operation completed successfully');
        }
      });
  }
}
