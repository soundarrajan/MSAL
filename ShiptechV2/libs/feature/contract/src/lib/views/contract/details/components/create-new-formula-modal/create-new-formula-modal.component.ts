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
import { DeliveryAutocompleteComponent } from '../delivery-autocomplete/delivery-autocomplete.component';
import { knowMastersAutocompleteHeaderName, knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'shiptech-create-new-formula-modal',
  templateUrl: './create-new-formula-modal.component.html',
  styleUrls: ['./create-new-formula-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CreateNewFormulaModalComponent extends DeliveryAutocompleteComponent implements OnInit {
  deliveryProducts: any;
  switchTheme;
  selectedProduct;
  formValues: any = {
    'name': '',
    'simpleFormula': {}
  };
  splitDeliveryInLimit: any[];
  uoms: any;
  disabledSplitBtn;
  quantityFormat: string;
  modalSpecGroupParameters: any;
  modalSpecGroupParametersEditable: any;
  specParameterList: any;
  activeProductForSpecGroupEdit: any;
  selectedFormulaTab = 'Pricing formula';
  formulaTypeList: any;
  entityName: string;
  autocompleteSellers: knownMastersAutocomplete;
  private _autocompleteType: any;
  autocompleteSystemInstrument: knownMastersAutocomplete;
  systemInstumentList: any;
  marketPriceList: any;
  formulaPlusMinusList: any;
  formulaFlatPercentageList: any;
  uomList: any;
  autocompleteCurrency: knownMastersAutocomplete;
  currencyList: any;
  formulaOperationList: any;
  formulaFunctionList: any;
  marketPriceTypeList: any;
  systemInstumentList1: any;
  constructor(
    public dialogRef: MatDialogRef<CreateNewFormulaModalComponent>,
    private ren: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private tenantService: TenantFormattingService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(DecimalPipe) private _decimalPipe,
    
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) 
    {
      super(changeDetectorRef);
      console.log(data);
      this.formValues = data.formValues;
      this.formulaTypeList = data.formulaTypeList;
      this.systemInstumentList = data.systemInstumentList;
      this.marketPriceList =  data.marketPriceList;
      this.formulaPlusMinusList = data.formulaPlusMinusList;
      this.formulaFlatPercentageList = data.formulaFlatPercentageList;
      this.uomList = data.uomList;
      this.currencyList = data.currencyList;
      this.formulaOperationList = data.formulaOperationList;
      this.formulaFunctionList = data.formulaFunctionList;
      this.marketPriceTypeList = data.marketPriceTypeList;
    }

  ngOnInit() {
    this.entityName = 'Contract';
    this.autocompleteSystemInstrument = knownMastersAutocomplete.systemInstrument;
    this.autocompleteCurrency = knownMastersAutocomplete.currency;


  }

  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.systemInstrument:
        return knowMastersAutocompleteHeaderName.systemInstrument;
      default:
        return knowMastersAutocompleteHeaderName.systemInstrument;
    }
  }

  getHeaderNameSelector1(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.currency:
        return knowMastersAutocompleteHeaderName.currency;
      default:
        return knowMastersAutocompleteHeaderName.currency;
    }
  }
  
  selectorSystemInstumentSelectionChange(
    selection: IOrderLookupDto
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.simpleFormula.systemInstrument = '';
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.simpleFormula.systemInstrument = obj; 
      this.changeDetectorRef.detectChanges();   
    }
  }

  selectorCurrencySelectionChange(
    selection: IOrderLookupDto
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.currency = '';
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.currency = obj; 
      this.changeDetectorRef.detectChanges();   
    }
  }



  filterSystemInstrumenttList() {
    if (this.formValues.simpleFormula.systemInstrument) {
      const filterValue = this.formValues.simpleFormula.systemInstrument.name ? this.formValues.simpleFormula.systemInstrument.name.toLowerCase() : this.formValues.simpleFormula.systemInstrument.toLowerCase();
      console.log(filterValue);
      if (this.systemInstumentList) {
        return this.systemInstumentList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  filterSystemInstrumentListFromComplexFormulaQuoteLine(value) {
    if (value) {
      const  filterValue = value.toLowerCase();
      if (this.systemInstumentList) {
        return this.systemInstumentList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }


  
  filterCurrencyList() {
    if (this.formValues.currency) {
      const filterValue = this.formValues.currency.name ? this.formValues.currency.name.toLowerCase() : this.formValues.currency.toLowerCase();
      console.log(filterValue);
      if (this.currencyList) {
        return this.currencyList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }


  closeClick(): void {
    this.dialogRef.close();
  }

  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
  }

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  ngAfterViewInit(): void {
  
  }

  selectSystemInstrument(event: MatAutocompleteSelectedEvent) {
    this.formValues.simpleFormula.systemInstrument = event.option.value;
  }

  selectCurrency(event: MatAutocompleteSelectedEvent) {
    this.formValues.currency = event.option.value;
  }


  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }


  selectSystemInstrumentFromComplexFormulaQuoteLine(value, line, key) {
    this.formValues.complexFormulaQuoteLines[line].systemInstruments[key].systemInstrument = value;
  }

 
  addComplexFormulaQuoteLine() {
    if (!this.formValues.complexFormulaQuoteLines) {
      this.formValues.complexFormulaQuoteLines = [];
    }
    var count = 0;
    this.formValues.complexFormulaQuoteLines.forEach((val, key) => {
      if(!val.isDeleted) {
          count++;
      }
    });
    if (count < 3) {
      this.formValues.complexFormulaQuoteLines.push({
          id: 0,
          formulaOperation: {
              id: this.formValues.isMean ? 3 : 1,
              name: this.formValues.isMean ? 'Mean' : 'Add',
              internalName: null,
              code: null
          },
          weight: '100',
          formulaFunction: {
              id: 1,
              name: 'Min',
              internalName: null,
              code: null
          },
          systemInstruments: [ 
            {
              id: 0
            }, 
            {
              id: 0
            }, 
            {
              id: 0
            }
        ]
      });
    } else {
      this.toastr.error('Max 3 Quotes allowed');
    }
  }


  removeComplexFormulaQuoteLine(key) {
    var count = this.formValues.complexFormulaQuoteLines.length;
    if (count > 1) {
      if (this.formValues.complexFormulaQuoteLines[key].id > 0) {
        this.formValues.complexFormulaQuoteLines[key].isDeleted = true;
      } else {
        this.formValues.complexFormulaQuoteLines.splice(key, 1);
      }
    } else {
      this.toastr.error('Min 1 Quote');
    }
  }

  isMeanChange(ob: MatCheckboxChange) {
    console.log("checked: " + ob.checked);
    if (ob.checked) {
      for (let i = 0; i < this.formValues.complexFormulaQuoteLines.length; i++) {
        this.formValues.complexFormulaQuoteLines[i].formulaOperation.id = 3;
      }
    }
  } 
  
  
  
}
