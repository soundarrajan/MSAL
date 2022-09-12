import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input('label') name;
  @Input('width') width = '104';
  @Input('height') height = '25.69';
  @Input('classList') classList = [];
  @Input('disable') disable: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
