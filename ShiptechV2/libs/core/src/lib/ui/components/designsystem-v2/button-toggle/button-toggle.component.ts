import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss']
})
export class ButtonToggleComponent implements OnInit {

  @Input('data') data;
  //   Sample data:
  //    { value: '3', names: ['One', 'Two', 'Three'] }
  //    { value: '4', names: ['One', 'Two', 'Three', 'Four'] }

  activeBtn = 'One';
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.activeBtn = 'One';
  }
}
