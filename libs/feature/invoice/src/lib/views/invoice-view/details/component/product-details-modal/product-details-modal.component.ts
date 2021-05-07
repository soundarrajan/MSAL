import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceDetailsService } from '../../../../../services/invoice-details.service';

@Component({
  selector: 'shiptech-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.scss']
})
export class ProductDetailsModalComponent implements OnInit {

  public searchText:string;
  selectedRow;
  isLoading:boolean= true;
  public dataSource: MatTableDataSource<any>;
  public productData:any = [];
  constructor(public dialogRef: MatDialogRef<ProductDetailsModalComponent>,private invoiceService: InvoiceDetailsService,@Inject(MAT_DIALOG_DATA) public receiveData: any) { 
    
  }

  ngOnInit(): void {
    
    // console.log("receiveData",this.receiveData.orderId); - this.receiveData.orderId
    let data : any = {
      Payload: {"Order":null,"PageFilters":{"Filters":[]},"SortList":{"SortList":[]},"Filters":[{"ColumnName":"Order_Id","Value":98297}],"SearchText":null,"Pagination":{}}
    };
    this.invoiceService
    .productListOnInvoice(data)
    .subscribe((response: any) => {
      this.isLoading = false;
      response.payload.forEach(row => {
        this.productData.push({selected:false, product:row.product.name, deliveries:row.order.id, details:row});
      });
      this.dataSource = new MatTableDataSource(this.productData);
    this.dataSource.filterPredicate = this.getFilterPredicate();
    });
  }

  radioSelected(element){
    this.selectedRow=element;

    console.log(this.selectedRow.product);
    this.dialogRef.close({data:this.selectedRow.details});
    
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
    this.dialogRef.close('close');
  }

  raiseClaim() {
    this.dialogRef.close('close');
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
  
}
