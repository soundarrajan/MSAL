import { Component, OnInit } from '@angular/core';
import { QualityControlGridViewModel } from './view-model/quality-control-grid.view-model';
import { ProcurementService } from '../../services/procurement.service';
import { IProcurementRequestDto } from '../../services/models/procurement-requests.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'shiptech-main-quality-control',
  templateUrl: './main-quality-control.component.html',
  styleUrls: ['./main-quality-control.component.scss'],
  providers: [QualityControlGridViewModel]
})
export class MainQualityControlComponent implements OnInit {

  private rowData$: Observable<IProcurementRequestDto[]>;

  constructor(private quantityControlGridViewModel: QualityControlGridViewModel, private procurementService: ProcurementService) {
    this.rowData$ = this.procurementService.getAllProcurementRequests();
  }

  ngOnInit() {
  }

}
