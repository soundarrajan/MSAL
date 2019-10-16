import { Injectable } from '@angular/core';
import { PortCallsListGridViewModel } from './port-calls-list-grid.view-model';

@Injectable({
  providedIn: 'root'
})
export class PortCallsListViewModel {
  constructor(public gridViewModel: PortCallsListGridViewModel) {}
}
