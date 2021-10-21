import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-footer-v2',
  templateUrl: './footer-v2.component.html',
  styleUrls: ['./footer-v2.component.css']
})
export class FooterV2Component implements OnInit {
  @Input() rowCount;
  @Input() maxSize;
  @Input() doublePagination;
  @Input() dualfooter;
  @Input() singleGrid;
  @Input() id:string;
  @Input() footerWidth;
  @Input() footerPosition;
  @Input() showFooterDatepicker;
  //@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  //constructor() { }
  public page: number;

  ngOnInit(): void {
  }
  
  pageChanged(e){
    this.page= e;
    //console.log(e);
    //this.pageChange.emit(event)
  }

  collection = [];
  constructor(iconRegistry: MatIconRegistry,sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'data-picker',
      sanitizer.bypassSecurityTrustResourceUrl('../assets/customicons/datepicker.svg'));

    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }
}
