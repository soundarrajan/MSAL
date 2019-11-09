import { Component, Inject, OnInit } from '@angular/core';
import { ProductDetailsViewModel } from './view-model/product-details.view-model';
import { ProductDetailsGridViewModel } from './view-model/product-details-grid.view-model';
import { ProductTypeListItemViewModelBuilder } from './view-model/product-type-list-item.view-model';
import { LOOKUPS_API_SERVICE } from '@shiptech/core/services/lookups-api/lookups-api.service';
import { ILookupsApiService } from '@shiptech/core/services/lookups-api/lookups-api.service.interface';
import { map } from 'rxjs/operators';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'shiptech-port-call-grid',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [ProductDetailsViewModel, ProductDetailsGridViewModel, ProductTypeListItemViewModelBuilder]
})
export class ProductDetailsComponent implements OnInit {

  uomsLookup$: Observable<ILookupDto[]>;

  constructor(public viewModel: ProductDetailsViewModel, @Inject(LOOKUPS_API_SERVICE) private lookupsApi: ILookupsApiService) {
    this.uomsLookup$ = this.lookupsApi.getUoms({}).pipe(map(response => response.items));
  }

  ngOnInit(): void {
  }
}
