import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-custom-stepper',
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.scss']
})
export class CustomStepperComponent {
  @Output() close = new EventEmitter();


}
