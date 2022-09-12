import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-port-details',
  templateUrl: './port-details.component.html',
  styleUrls: ['./port-details.component.scss']
})
export class PortDetailsComponent implements OnInit {

  @Input('portData') portData;
  @Output() portInfoClose = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  closePanel() {
    this.portInfoClose.emit();
  }
}
