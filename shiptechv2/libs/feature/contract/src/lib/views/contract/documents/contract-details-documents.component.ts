import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { KnownTransactionTypes } from '@shiptech/core/enums/known-transaction-types.enum';
import { KnownContractRoutes } from '../../../known-contract.routes';

@Component({
  selector: 'shiptech-contract-details-documents',
  templateUrl: './contract-details-documents.component.html',
  styleUrls: ['./contract-details-documents.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractDetailsDocumentsComponent implements OnInit, OnDestroy {
  contractId: number;
  entityName = KnownTransactionTypes.QuantityControlReport;
  private _destroy$ = new Subject();

  constructor(route: ActivatedRoute) {
    this.contractId =
      route.snapshot.params[KnownContractRoutes.ContractIdParam];
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
