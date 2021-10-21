import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-stepper',
  templateUrl: './progress-stepper.component.html',
  styleUrls: ['./progress-stepper.component.css']
})
export class ProgressStepperComponent implements OnInit {

  @Input('steps') steps;
  constructor() {
    // this.steps = [
    //   { name: 'Start Closure', status: 'complete', index: 0 },
    //   { name: 'Draft P&L', status: 'inprogress', index: 1 },
    //   { name: 'Final P&L', status: 'incomplete', index: 2 }
    // ];
  }

  ngOnInit(): void {
  }

  stepForward() {

  }

  stepBackward() {
  }




}
