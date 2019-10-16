import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PortCallsListGridViewModel } from './view-model/port-calls-list-grid.view-model';
import { MessageBoxService } from '@shiptech/core/ui/components/message-box/message-box.service';
import { IProcurementRequestDto } from '../../services/models/procurement-requests.dto';
import { PortCallsListViewModel } from './view-model/port-calls-list.view-model';

@Component({
  selector: 'shiptech-port-calls-list',
  templateUrl: './port-calls-list.component.html',
  styleUrls: ['./port-calls-list.component.css'],
  providers: [PortCallsListGridViewModel, PortCallsListViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortCallsListComponent implements OnInit {


  @ViewChild('popup', {static: false}) popupTemplate: TemplateRef<any>;

  constructor(public viewModel: PortCallsListViewModel, private messageBox: MessageBoxService) {
  }

  onPageChange(page: number): void {
    this.viewModel.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.viewModel.gridViewModel.pageSize = pageSize;
  }

  showModal(data: IProcurementRequestDto): void {
    this.messageBox.displayDialog({data, width: '500px', height: '600px'}, this.popupTemplate);
  }

  ngOnInit(): void {
  }

}
