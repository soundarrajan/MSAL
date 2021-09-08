import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-pipeline-tariff',
  templateUrl: './pipeline-tariff.component.html',
  styleUrls: ['./pipeline-tariff.component.scss']
})
export class PipelineTariffComponent implements OnInit {
  public disableBtn: boolean = true;
  public checked: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    //console.log(this.data.cost);
    if (this.data.cost == '1.3400') {
      this.checked = true;
      this.disableBtn = false;
    }
  }

  enableProceed() {
    this.disableBtn = false;
  }
}
