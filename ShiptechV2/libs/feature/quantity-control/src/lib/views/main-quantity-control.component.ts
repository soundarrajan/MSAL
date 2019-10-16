import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PortCallsListGridViewModel } from './port-calls-list/view-model/port-calls-list-grid.view-model';
import { MessageBoxService } from '@shiptech/core/ui/components/message-box/message-box.service';
import { IProcurementRequestDto } from '../services/models/procurement-requests.dto';

@Component({
  selector: 'shiptech-main-quantity-control',
  templateUrl: './main-quantity-control.component.html',
  styleUrls: ['./main-quantity-control.component.scss']
})
export class MainQuantityControlComponent {}
