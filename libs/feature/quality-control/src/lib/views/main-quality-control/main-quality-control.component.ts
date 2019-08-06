import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProcurementRequestsGridViewModel } from './view-model/procurement-requests-grid.view-model';
import { MessageBoxService } from '@shiptech/core/ui/components/message-box/message-box.service';
import { IProcurementRequestDto } from '../../services/models/procurement-requests.dto';

@Component({
  selector: 'shiptech-main-quality-control',
  templateUrl: './main-quality-control.component.html',
  styleUrls: ['./main-quality-control.component.scss'],
  providers: [ProcurementRequestsGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainQualityControlComponent implements OnInit {

  @ViewChild('popup', {static: false}) popupTemplate: TemplateRef<any>;

  constructor(public gridViewModel: ProcurementRequestsGridViewModel, private messageBox: MessageBoxService) {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  showModal(data: IProcurementRequestDto): void {
    this.messageBox.displayDialog({data, width: '500px', height: '600px'}, this.popupTemplate);
  }

  ngOnInit(): void {
  }

}
