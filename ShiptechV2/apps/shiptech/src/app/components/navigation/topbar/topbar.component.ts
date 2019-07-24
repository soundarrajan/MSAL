import { Component } from '@angular/core';
import { MainComponent } from '../../main.component';

@Component({
  selector: 'shiptech-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  constructor(public app: MainComponent) {}
}
