import { Component } from '@angular/core';
import { MainComponent } from '../../main.component';
import { AdalService } from 'adal-angular4';

@Component({
  selector: 'shiptech-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  constructor(public app: MainComponent, public adal: AdalService) {
  }

  display(val: any) {
    console.log(val);
  }
}
