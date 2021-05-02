import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'shiptech-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.scss']
})
export class ProductDetailsModalComponent implements OnInit {

  public searchText:string;
  selectedRow;
  public dataSource: MatTableDataSource<any>;
  public productData:any = [{selected:false, product:'RMG 380', deliveries:1226}, {selected:false, product:'RMK 350', deliveries:12}];
  constructor(public dialogRef: MatDialogRef<ProductDetailsModalComponent>) { 
    
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.productData);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  radioSelected(element){
    this.selectedRow=element;

    console.log(this.selectedRow.product);
    this.dialogRef.close({data:this.selectedRow.product});
    
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
    this.dialogRef.close();
  }

  raiseClaim() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
