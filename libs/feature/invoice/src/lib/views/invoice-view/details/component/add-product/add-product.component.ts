import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceDetailsService } from '../../../../../services/invoice-details.service';

@Component({
  selector: 'shiptech-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductDetailsComponent implements OnInit {

  public searchText:string;
  selectedRow;
  isLoading:boolean= false;
  public dataSource: MatTableDataSource<any>;
  @Input() productData:any;
  @Output() onSelected: EventEmitter<any> = new EventEmitter();
  constructor(private invoiceService: InvoiceDetailsService) {

  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.productData);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  radioSelected(element){
    this.selectedRow=element;

    console.log(this.selectedRow.product);
    // this.dialogRef.close({data:this.selectedRow.details});

  }

  getFilterPredicate() {
    return (row: any, filters: string) => {
      const matchFilter = [];

      // Fetch data from row
      const columnProduct = row.product;
      const columnDeliveries = row.deliveries;

      // verify fetching data by our searching values
      const customFilterDS = columnProduct.toLowerCase().includes(this.searchText);
      const customFilterAS = columnDeliveries.toString().toLowerCase().includes(this.searchText);

      // push boolean values into array
      matchFilter.push(customFilterDS);
      matchFilter.push(customFilterAS);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  closeClick(): void {
    // this.dialogRef.close('close');
  }

  raiseClaim() {
    // this.dialogRef.close('close');
  }

  onNoClick(): void {
    // this.dialogRef.close('close');
  }

  onSelectedItem(data){
    console.log("adding...")
    this.onSelected.emit(data);
  }

}
