import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tabs-header',
  templateUrl: './tabs-header.component.html',
  styleUrls: ['./tabs-header.component.css']
})
export class TabsHeaderComponent implements OnInit {
  @Input('data') data;
  /*[
  { disabled: false, name: 'First' },
  { disabled: false, name: 'Second' },
  { disabled: false, name: 'Third' }
]*/
  selectedTab = 0;
  constructor(public elem: ElementRef) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    let elements = this.elem.nativeElement.querySelectorAll('.mat-tab-label');
    elements.forEach((element, index) => {
      // element.style.left = 138 * index + 'px';
      element.style.zIndex = 1000 - index;
    });

  }
}
