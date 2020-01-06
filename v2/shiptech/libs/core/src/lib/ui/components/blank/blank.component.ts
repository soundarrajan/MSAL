import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlankComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
