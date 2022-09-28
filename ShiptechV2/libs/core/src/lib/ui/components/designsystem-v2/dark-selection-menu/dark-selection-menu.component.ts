import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-dark-selection-menu',
  templateUrl: './dark-selection-menu.component.html',
  styleUrls: ['./dark-selection-menu.component.css']
})
export class DarkSelectionMenuComponent implements OnInit {

  dataSources = [
    { product: 'DMB MAX 0.4%S', delNo: '130090' },
    { product: 'DMA MAX 1%', delNo: '130091' },
    { product: 'DMA MAX 1.5%S', delNo: '130092' },
    { product: 'RMG 380 MAX 0.5%S', delNo: '130073' }
  ];
  dataSourcesCopy = [
    { product: 'DMB MAX 0.4%S', delNo: '130090' },
    { product: 'DMA MAX 1%', delNo: '130091' },
    { product: 'DMA MAX 1.5%S', delNo: '130092' },
    { product: 'RMG 380 MAX 0.5%S', delNo: '130073' }
  ];
  displayedColumns: string[] = ['product', 'delNo'];
  @Input('value') selectedProduct: boolean = false;
  @Output() onProductChange = new EventEmitter();
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  constructor() { }

  ngOnInit(): void {
  }

  private _filter(value: string) {
    if(value!=''){
      const filterValue = value.toLowerCase();
      return this.dataSources.filter(option => (option.product.toLowerCase().includes(filterValue) || option.delNo.toLowerCase().includes(filterValue)));
    }
    else{
      return this.dataSourcesCopy;
    }
  }

  onChangeProduct(prod) {
    this.selectedProduct = prod;
    this.onProductChange.emit(prod);
  }

  search(type: string, value: string): void {
    this.dataSources = this._filter(value);

    //alert(type);
    // if (type == "location") {
    //   let filterSummaryProducts = this.locationMasterSearchListOptions.filter((summaryProd) => summaryProd.name.toLowerCase().includes(value));
    //   this.locationMasterSearchListOptions = [...filterSummaryProducts];
    // } else {
    //   let filterSummaryProducts = this.productMasterSearchListOptions.filter((summaryProd) => summaryProd.pname.toLowerCase().includes(value));
    //   this.productMasterSearchListOptions = [...filterSummaryProducts];
    // }


  }
}
