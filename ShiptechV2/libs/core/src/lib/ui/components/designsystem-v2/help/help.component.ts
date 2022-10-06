import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  ts_code = `import { Component, OnInit } from "@angular/core";
  @Component({
    selector: "app-labels",
    templateUrl: "./labels.component.html",
    styleUrls: ["./labels.component.css"]
  })
  export class LabelsComponent implements OnInit {
    switchTheme; //false-Light Theme, true- Dark Theme
    constructor() {}
    ngOnInit(): void {}
  }
  `;
  
  html_code = `<div class="legend1-component-v2">
	<div class="legend-values" [ngClass]="{'darkTheme':switchTheme}">
		<div>
			<div class="color-circle green"></div>
			<span>ITM</span>
		</div>
		<div>
			<div class="color-circle blue"></div>
			<span>ATM</span>
		</div>
		<div>
			<div class="color-circle red"></div>
			<span>OTM</span>
		</div>
	</div>
</div>
`;

  constructor() { }

  ngOnInit(): void {
  }

}
