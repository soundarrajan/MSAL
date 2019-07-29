import { Component } from '@angular/core';
import { MainComponent } from '../../main.component';
import { AuthenticationService } from '@shiptech/core';

@Component({
  selector: 'shiptech-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  constructor(public app: MainComponent, public authService: AuthenticationService) {
  }

  display(val: any) {
    console.log(val);
  }
}
