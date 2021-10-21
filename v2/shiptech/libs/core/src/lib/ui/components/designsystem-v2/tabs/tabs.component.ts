import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  @Input('data') data;
  //   Sample data:
  //    [{ disabled: false, name: 'Details' },{ disabled: false, name: 'Documents' },{ disabled: true, name: 'Audit Log' }]
  selectedTab = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
