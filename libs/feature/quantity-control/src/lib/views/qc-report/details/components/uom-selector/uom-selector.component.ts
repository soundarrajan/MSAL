import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'shiptech-uom-selector',
  templateUrl: './uom-selector.component.html',
  styleUrls: ['./uom-selector.component.css']
})
export class UomSelectorComponent implements OnInit {

  public uoms$: Observable<SelectItem[]>;

  constructor() {
    // TODO: assign dynamic value
    this.uoms$ = of([
      {
        label: 'MT',
        value: 1
      },
      {
        label: 'GAL',
        value: 2
      },
      {
        label: 'Other',
        value: 2
      }
    ]);
  }

  ngOnInit(): void {
  }

}
