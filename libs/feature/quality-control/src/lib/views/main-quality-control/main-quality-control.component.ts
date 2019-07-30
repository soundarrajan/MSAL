import { Component, OnInit } from '@angular/core';
import { QualityControlGridViewModel } from './view-model/quality-control-grid.view-model';

@Component({
  selector: 'shiptech-main-quality-control',
  templateUrl: './main-quality-control.component.html',
  styleUrls: ['./main-quality-control.component.scss'],
  providers: [QualityControlGridViewModel]
})
export class MainQualityControlComponent implements OnInit {

  constructor(private quantityControlGridViewModel: QualityControlGridViewModel) {
  }

  ngOnInit() {
  }

}
