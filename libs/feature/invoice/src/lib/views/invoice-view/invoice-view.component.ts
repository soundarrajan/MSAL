import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'shiptech-invoice-view',
  templateUrl: './invoice-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceViewComponent implements OnInit, OnDestroy {

  
  constructor(){
  }
  selectedTab = 0;
  tabData = [
    { disabled: false, name: 'Details' },
    { disabled: false, name: 'Related Invoices' },
    { disabled: false, name: 'Documents' },
    { disabled: false, name: 'Email Log' },
    { disabled: false, name: 'Seller Rating' },
    { disabled: false, name: 'Audit Log' }
  ]
    
  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
  }
}
