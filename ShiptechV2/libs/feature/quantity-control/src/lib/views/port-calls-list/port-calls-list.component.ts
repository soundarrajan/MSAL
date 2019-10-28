import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PortCallsListGridViewModel } from './view-model/port-calls-list-grid.view-model';
import { MessageBoxService } from '@shiptech/core/ui/components/message-box/message-box.service';
import { PortCallsListViewModel } from './view-model/port-calls-list.view-model';
import { Subject } from 'rxjs';

@Component({
  selector: 'shiptech-port-calls-list',
  templateUrl: './port-calls-list.component.html',
  styleUrls: ['./port-calls-list.component.scss'],
  providers: [PortCallsListGridViewModel, PortCallsListViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortCallsListComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  @ViewChild('popup', {static: false}) popupTemplate: TemplateRef<any>;

  constructor(public viewModel: PortCallsListViewModel, private messageBox: MessageBoxService) {
  }

  onPageChange(page: number): void {
    this.viewModel.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.viewModel.gridViewModel.pageSize = pageSize;
  }

  showModal(data: any): void {
    this.messageBox.displayDialog({data, width: '500px', height: '600px'}, this.popupTemplate);
  }

  watchVesselWithId(vesselId: number): void {
    alert('Not implemented');
  }

  raiseClaim(): void {
    alert('Not implemented');
  }

  verifyVessels(): void {
    alert('Not implemented');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
