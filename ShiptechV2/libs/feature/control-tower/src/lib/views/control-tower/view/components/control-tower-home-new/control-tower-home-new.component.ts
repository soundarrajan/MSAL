import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-tower-home-new',
  templateUrl: './control-tower-home-new.component.html',
  styleUrls: ['./control-tower-home-new.component.css']
})
export class ControlTowerHomeNewComponent implements OnInit {
  public showQuality: boolean = false;
  public showQuantity: boolean = true;
  public showResidue: boolean = false;
  public theme;
  public newScreen = true;
  selected = 'quantity';

  selectedVal: string = 'labs';
  selectedVal2: string = 'differences';
  selectedVal3: string = 'differences';

  constructor() {}

  ngOnInit(): void {
    /* this.localService.themeChange.subscribe(data => {
      this.theme  = data;
    }) */
  }

  public onValChange(val: string) {
    this.selectedVal = val;
    this.selectedVal2 = val;
    this.selectedVal3 = val;
  }

  viewChange($event) {
    if ($event.value == 'quality') {
      this.showQuality = true;
      this.showQuantity = false;
      this.showResidue = false;
    } else if ($event.value == 'quantity') {
      this.showQuality = false;
      this.showQuantity = true;
      this.showResidue = false;
    } else if ($event.value == 'residue') {
      this.showQuality = false;
      this.showQuantity = false;
      this.showResidue = true;
    } else {
      this.showQuality = true;
      this.showQuantity = false;
      this.showResidue = false;
    }
  }
}
